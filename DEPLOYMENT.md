# 1Panel 静态网站与自动更新

本项目采用「GitHub Actions 构建 → 发布公开静态产物分支 → 1Panel 每 5 分钟拉取」的部署方式。网站是 Vue 3 + Vite 静态应用，服务器的 OpenResty 提供构建文件，不需要运行 Vite 或常驻 Node.js。

## 当前站点

以下状态在 **2026-10-14** 核对：

| 项目 | 当前配置 |
| --- | --- |
| 网站 | `https://doc.mafuyu.moe/`，有效 HTTPS 已签发并绑定成功 |
| DNS | A 记录指向 `154.219.98.95`；原 Netlify CNAME 已移除，无旧 AAAA 记录 |
| 服务器 | `154.219.98.95`，1Panel 和 OpenResty |
| 面板端口 | `22062`；网站访问使用 `80/443` |
| 网站代号 | `mcmod-wiki` |
| 主机运行目录 | `/opt/1panel/www/sites/mcmod-wiki/index` |
| 源代码仓库 | `https://github.com/zhenshiz/mcmodwiki` |
| 源代码分支 | `master` |
| 构建产物分支 | `deploy-static`，只保存公开静态构建结果 |
| 1Panel 计划任务 | `MCModWiki自动更新`，主机侧 Bash Shell，每 5 分钟执行 |
| 私有状态目录 | `/opt/1panel/tmp/mcmod-wiki-pull`，保存发布锁与成功版本 SHA |

已经验证首页和 `/editor` 的 history 路由；本地也在没有 `node_modules` 的副本上验证了 Node `22.23.2` + pnpm `8.12.1` 的冻结安装和生产构建。服务器预检以 root 执行，GNU tar `1.34`、rsync `3.2.7` 与其他工具存在，运行目录可写，GitHub 和本机 HTTP 可达。

自动更新已完成真实验收：源代码提交 `1704a8fb953f7b96460ea700ba12085cc08434f8` 的 [GitHub Actions 运行](https://github.com/zhenshiz/mcmodwiki/actions/runs/38436681754) 在约 1 分 43 秒内完成 build 和 publish。服务器首次发布产物提交 `d744b57e91223c910635cda71fec1cd149f1c2f7`，报告为 `Published and verified: d744b57e91223c910635cda71fec1cd149f1c2f7`；首次下载发生一次 DNS 重试后成功，总计约 35 秒。第二次执行在约 1 秒内报告同一 SHA 的 `No update`，验证了无更新时跳过下载。

公网 HTTPS 首页、`/editor`、`/wiki/chatbox` 返回同一份构建首页，入口 JavaScript、样式和中文 ChatBox 文档返回成功，不存在的 `/assets/` 文件返回真实 404。HTTPS 检查保留了证书校验。

证书记录已改为 **HTTP 验证并启用自动续签**，面板申请日志成功，网站绑定更新成功。本次 ACME 授权仍在有效期内，日志跳过了新的 challenge，因此尚未实测一次全新的 HTTP-01 挑战或未来自动续签；保持 80 端口和 ACME 验证路径可达仍是必要条件。

原 Netlify 部署可保留作为回退来源。当前域名已经访问新服务器；确认自动更新首发和 HTTPS 续期后，再按需要处理 Netlify 构建设置。

## 自动更新流程

1. 将源代码或文档修改提交并推送到 GitHub 的 `master`。
2. `.github/workflows/deploy.yml` 使用 Node 22、pnpm 8.12.1 执行 `pnpm install --frozen-lockfile` 和 `pnpm build`。
3. build job 只读取仓库；独立 publish job 下载同一次运行的产物，普通提交并普通推送到 `deploy-static`。初次创建这个分支，后续保留提交历史，不强推。
4. `MCModWiki自动更新` 每 5 分钟查询产物分支完整 SHA。与上次成功版本相同则退出；不同才下载这个固定 SHA 的 HTTPS 归档。
5. 服务器检查归档路径、单一仓库根、文件类型及 `index.html`、`assets/`、`md/`，拒绝链接、特殊文件和源码根项，只复制静态文件。
6. 先上传资源，最后替换首页；通过本机 OpenResty 逐字节核对首页、`/editor` 和入口 JavaScript，全部成功后才记录新 SHA。

publish job 的 `contents: write` 是**当前仓库范围的权限**，不是 GitHub 强制限定为某个分支的权限；审查过的脚本把推送目标固定为 `deploy-static`。构建与依赖安装在只有 `contents: read` 的 job 完成，写权限 job 不运行站点代码。仓库或组织规则仍需允许内置 `GITHUB_TOKEN` 写入产物分支。[GitHub token 权限说明](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)

工作流只监听 `master` 的 push；手动「Run workflow」也必须选择 `master`。产物分支没有工作流文件，内置 `GITHUB_TOKEN` 的 push 也不会再次触发 push 工作流。[GitHub token 触发行为](https://docs.github.com/en/actions/concepts/security/github_token)

构建结果通过公开分支提供，服务器读取时不需要私钥、PAT 或 API Token。产物分支不得写入面板密码、环境密钥或服务器配置。

## 日常更新网站

在项目根目录使用 Node 22 和 pnpm 8.12.1：

```bash
pnpm install --frozen-lockfile
pnpm build
```

新增、删除或改名 `public/md/` 下的文档都需要重新构建，文档目录在构建时生成。依赖变化时，使用 pnpm 同步 `pnpm-lock.yaml` 并一并提交；冻结安装报锁文件过期时，应修复锁文件，不应在 CI 中绕过校验。

核对修改，按实际文件执行 `git add`，然后提交并推送。当前远程名称是 `master`：

```bash
git status
git add 本次修改的文件
git commit -m "Update website content"
git push master master
```

只在本机保存或提交不会触发服务器更新，必须完成 push。通常需要构建时间加最多 5 分钟；GitHub 排队、服务器网络故障或重试会延长这段时间。

在 GitHub「Actions → Build static website for 1Panel」查看 build 和 publish；在 1Panel「计划任务 → MCModWiki自动更新 → 报告」查看服务器结果。需要提前刷新时选择「立即执行」。发布静态文件通常不需要重启 OpenResty。

## 1Panel 计划任务配置

正式脚本位于 `scripts/deploy/1panel-pull-static.sh`。在 1Panel 创建或编辑任务：

| 字段 | 值 |
| --- | --- |
| 任务名称 | `MCModWiki自动更新` |
| 类型 | Shell 脚本 |
| 执行位置 | 主机，不勾选「在容器中执行」 |
| 解释器 | Bash |
| 周期 | 每 5 分钟；自定义表达式 `*/5 * * * *` |
| 脚本内容 | 将仓库脚本完整内容粘贴到任务中 |
| 执行超时 | 10 分钟 |
| 失败重试 | 0 次；脚本下载自身有有限重试，下个周期可再次尝试 |
| 执行记录保留 | 100 份 |

运行前核对 `SITE_DIR`、`STATE_DIR`、`DOMAIN` 和 `CHECK_IP`。本服务器已验证 `127.0.0.1` 的 80 端口可以到 OpenResty；站点检查强制解析到本机，避免误验证其他 DNS、代理或 CDN 页面。开启 HTTP 跳转 HTTPS 后，检查会跟随跳转并校验证书，最终地址必须仍是原域名和原路径。

需要 Bash、curl、git、GNU tar、rsync、flock、timeout、awk、find、cmp、mktemp、install。脚本执行时检查命令和目录写权限。Git 查询限制为 60 秒，下载也有超时和重试，失败返回非零；`flock` 防止任务重叠。

**面板里的脚本是粘贴时的副本。** 后续修改仓库脚本不会自动更改已有计划任务，需要核对后同步到面板。不要把远程下载的 Shell 内容直接交给解释器执行。[1Panel 计划任务说明](https://docs.fit2cloud.com/1panel/user-manual/cronjobs/)

`published.sha` 仅在内容验证通过后更新。同 SHA 会跳过下载及站点检查，所以任务是更新器，不是持续健康监控。人工修改或恢复网站目录后，如需重新发布同一 SHA，可在文件管理核对路径后删除 `/opt/1panel/tmp/mcmod-wiki-pull/published.sha`，再执行任务。

## 网站目录和路由

运行目录应直接包含下列结构，不能嵌套一层 `dist/`：

```text
/opt/1panel/www/sites/mcmod-wiki/index/
├── index.html
├── favicon.ico
├── assets/
└── md/
```

项目使用 `base: '/'` 和 Vue Router history 路由，部署在域名根路径。保留以下路由和缓存规则：

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location = /index.html {
    add_header Cache-Control "no-cache";
}

location /assets/ {
    try_files $uri =404;
}

location /md/ {
    try_files $uri =404;
    add_header Cache-Control "no-cache";
}
```

这些段应在对应网站的 `server` 内；已有同名段时修改现有内容，避免重复。保存后确认配置检查成功，不要覆盖整份 OpenResty 配置或 1Panel 管理的 ACME 验证配置。80/443 需继续在安全组和系统防火墙放行。

验证时直接指定服务器，保留有效证书检查：

```bash
curl --fail --resolve doc.mafuyu.moe:443:154.219.98.95 \
  https://doc.mafuyu.moe/

curl --fail --resolve doc.mafuyu.moe:443:154.219.98.95 \
  https://doc.mafuyu.moe/editor
```

编辑器文件选择和复制功能依赖浏览器安全上下文，应使用有效 HTTPS。

## HTTPS 证书续期

初次证书通过手动 DNS 验证申请。现在面板证书记录（ID 2）已改为具体域名 `doc.mafuyu.moe` 的 **HTTP 验证**并启用**自动续签**，重新申请日志成功，网站证书绑定已更新。不要删除当前已绑定的有效证书。[1Panel 证书申请说明](https://docs.fit2cloud.com/1panel/user-manual/websites/certificate-create/)

本次申请复用了仍有效的 ACME 授权，日志跳过 challenge，所以它证明配置保存、证书申请与绑定成功，不证明一个全新的 HTTP-01 挑战已经成功，也不证明未来自动续签已经执行。后续需要检查真正发生 HTTP 挑战时的验证结果及自动续签记录。

HTTP 验证需要验证机构能从公网通过 80 访问 ACME 挑战路径：保持解析正确、80 开放，并避免访问控制、重写或代理阻断 `/.well-known/acme-challenge/`。使用 1Panel 管理的验证配置，修改网站规则时不要覆盖它。HTTP 验证不用于通配符证书，本网站使用具体子域名。[Let's Encrypt HTTP-01 验证说明](https://letsencrypt.org/docs/challenge-types/#http-01-challenge)

应继续核对证书列表的自动续签状态、到期日及续签记录；后续成功记录才能证实自动续期实际生效。如果自动续签失败，应在当前证书到期前解决验证问题、重新申请并确认网站绑定。

## 发布失败、清理与回退

资源使用 `rsync -rpz --delay-updates --chmod=D755,F644` 上传，首页在网站目录内通过临时文件最后替换。**只有首页替换是原子 rename，整个目录不是原子发布。** 同名文档上传期间，已打开的页面可能读到新内容。

脚本不使用 `--delete`。旧哈希资源保留，降低已打开网页请求旧分包时的 404；删除的旧文档和其他静态文件也会留在服务器，旧 URL 可能仍可访问，磁盘占用会增长。真正下线或清理时，先核对当前构建、目录及使用范围，再通过面板处理。产物分支采用普通提交，也会积累构建历史。

发布后验证失败返回非零并保留旧成功 SHA，但**不会自动回滚已上传资源或已替换首页**。旧 marker 表示新版本未验证成功，不表示在线站点仍是旧版本。下次任务重试相同的新 SHA；必要时先停用任务，再通过面板网站备份恢复。

源码回退可对具体改动创建回退提交并 push `master`，让正常构建生成新的产物。如果面板直接恢复文件，应同时处理计划任务，否则下次拉取会再次发布 GitHub 当前产物。保留旧 Netlify 部署时，也可协调 DNS 管理者恢复原 CNAME `golden-pudding-5bacd4.netlify.app`；同名 A 与 CNAME 不能同时保留。

## 常见问题

| 现象 | 检查点 |
| --- | --- |
| 本地修改后未更新 | 确认已 commit 并 push `master`，检查 GitHub 两个 job 与 1Panel 报告 |
| publish 写分支失败 | 检查 Actions token 写权限、产物分支保护与仓库规则 |
| 分支缺失或查询超时 | 确认首次 build/publish 成功，服务器能访问公开 GitHub |
| 刷新文档或编辑器 404 | 检查 `try_files`，确认 `/editor` 没有重定向回 `/` |
| 白屏或资源 403/404 | 检查运行目录、权限、归档结构及入口 JS 校验错误 |
| 任务失败但页面已更新 | 验证发生在首页替换后，无自动回滚，按具体错误处理 |
| 恢复文件后显示 No update | 删除已核对的私有 `published.sha`，或发布新源码提交 |
| 删除文档后旧 URL 可访问 | 旧静态文件被保留，需要审查后手动删除 |
| HTTPS 到期或续签失败 | 检查验证方式、自动续签状态、80 和 ACME 配置 |
| 改仓库脚本但面板行为未变 | 面板使用粘贴副本，需要同步更新 |

[GitHub 固定 commit 归档说明](https://docs.github.com/en/repositories/working-with-files/using-files/downloading-source-code-archives)
