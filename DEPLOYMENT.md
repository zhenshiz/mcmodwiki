# 部署到 1Panel，并在 GitHub 更新后自动发布

本项目是 Vue 3 + Vite 静态网站。构建输出为 `dist/`，服务器使用已经安装的 OpenResty 提供这些文件。服务器不需要运行 Vite 开发服务或常驻 Node.js。

以下信息在 2026-10-12 核对：

- GitHub 仓库：`https://github.com/zhenshiz/mcmodwiki`。
- 发布分支：`master`。
- 新服务器公网 IP：`154.219.98.95`。
- 1Panel 管理端口：`22062`，这是管理面板端口；网站使用 `80/443`，SSH 端口另行查看。
- 网站域名：`doc.mafuyu.moe`。
- 域名目前通过 CNAME `golden-pudding-5bacd4.netlify.app` 指向 Netlify，HTTPS 正常。先验证新服务器、配置有效证书，再切换 DNS。
- 本地已在没有 `node_modules` 的副本上验证 Node `22.23.2` + pnpm `8.12.1` 的冻结安装和生产构建。

## 1. 在面板创建静态网站

进入「网站 → 网站 → 创建 → 静态网站」，填写：

| 字段 | 值 |
| --- | --- |
| 分组 | 默认 |
| 域名 | `doc.mafuyu.moe`，不带 `https://` 或末尾斜杠 |
| 端口 | `80` |
| 代号 | `mcmod-wiki` |
| 监听 IPv6 | 暂不勾选；确认服务器 IPv6 可用后再添加 |
| 启用 HTTPS | 初次创建可暂不勾选，后面绑定证书 |
| 创建 FTP | 不需要；自动发布使用 SSH |
| 描述 | Minecraft 模组文档 |

点击「确认」。如果列表已经有 `doc.mafuyu.moe`，进入其配置，不要重复创建。

创建后进入「配置 → 网站目录」，核对实际的主机目录与运行目录。按截图中的默认安装位置和上述代号，通常会是：

```text
/opt/1panel/www/sites/mcmod-wiki/index
```

这是主机侧文件路径的示例，必须以你的面板显示为准。不要把 OpenResty 容器内路径填到 GitHub 的部署路径里。最终提供网页的目录下应直接存在 `index.html`，而不是再嵌套一层 `dist/`。

服务器云平台安全组和系统防火墙需要允许网站 TCP `80`、`443`。面板已有其他网站时，不必停掉或重装 OpenResty。

## 2. 上传第一次构建

在本机项目根目录执行（使用 Node 22 和 pnpm 8.12.1）：

```bash
pnpm install --frozen-lockfile
pnpm build
```

通过面板文件管理，把 `dist/` 的内容上传到上一步核对的网站运行目录。也可以上传打包文件并在运行目录解压。目标结构如下：

```text
index/
├── index.html
├── favicon.ico
├── assets/
└── md/
```

只发布构建结果。新增或删除 `public/md/` 里的文档也需要重新构建，因为文档目录在构建时生成。

## 3. 配置页面路由和缓存

项目使用 Vue Router 的 history 路由。在网站的「配置 → 伪静态」或「配置文件」中配置：

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

先检查现有配置。如果已有同名的 `location`，修改已有段，避免重复。`location` 段必须位于该站点的 `server` 块内。面板保存时确认配置检查成功，再重载；不要覆盖整份 OpenResty 配置。

`/index.html` 必须允许浏览器重新验证，以便新发布后读到新版本；`/assets/` 和 `/md/` 的不存在文件应返回真实 404。

切换 DNS 之前，在本机终端直接指定新服务器测试：

```bash
curl --resolve doc.mafuyu.moe:80:154.219.98.95 \
  http://doc.mafuyu.moe/

curl --resolve doc.mafuyu.moe:80:154.219.98.95 \
  http://doc.mafuyu.moe/editor
```

两个请求都应返回本项目的 `index.html`。没有 `--resolve` 时，域名仍会访问 Netlify，不能据此验证新服务器。

## 4. 先配置 HTTPS，再迁移 DNS

现有域名已启用 HTTPS/HSTS，因此新服务器要准备有效域名证书后再切换解析。

在「网站 → 证书」为 `doc.mafuyu.moe` 申请证书，推荐使用 DNS 验证：按面板显示的挑战值在域名 DNS 管理处添加 `_acme-challenge.doc.mafuyu.moe` 的 TXT 记录，完成验证后把证书绑定到新网站并启用 HTTPS。DNS 验证可以在网站 A/CNAME 尚未切换时完成。若已有可续期证书和对应私钥，也可通过面板导入。

手动 DNS 验证续期时通常需要重新完成挑战；如果使用支持的 DNS 服务商接口，按面板配置自动续期，并检查续期状态。

配置后测试新服务器的 HTTPS，证书检查应正常：

```bash
curl --resolve doc.mafuyu.moe:443:154.219.98.95 \
  https://doc.mafuyu.moe/

curl --resolve doc.mafuyu.moe:443:154.219.98.95 \
  https://doc.mafuyu.moe/wiki/chatbox
```

测试通过后，在 `mafuyu.moe` 的 DNS 管理页记录旧解析值，再把 `doc` 的现有 CNAME 改为：

| 类型 | 主机记录 | 值 |
| --- | --- | --- |
| A | `doc` | `154.219.98.95` |

同一主机记录不能同时保留 CNAME 和 A；若另外存在旧 AAAA 记录，也需处理，避免 IPv6 用户访问旧服务器。若 DNS 服务提供代理/CDN，先确认其代理方式与新服务器证书配置匹配。

DNS 生效后验证 `https://doc.mafuyu.moe/` 和直接打开/刷新 `/editor`、`/wiki/chatbox`。编辑器复制、文件选择等功能需要有效 HTTPS。

## 5. 准备专用 SSH 部署账号

面板登录账号、密码和 `22062` 端口不能作为 SSH 登录资料。先在服务器「SSH 管理」或云服务器控制台确认 SSH 端口，以及能登录服务器终端的管理账号。

在本机生成仅供此站点自动发布的密钥；下面的文件名若已经存在，换一个新名称，避免覆盖：

```bash
ssh-keygen -t ed25519 -C "mcmod-wiki-deploy" -f ~/.ssh/mcmod_wiki_deploy -N ""
```

`mcmod_wiki_deploy.pub` 是公钥，放到服务器；没有 `.pub` 的文件是私钥，保存到 GitHub Actions Secret，不要提交到仓库或发到聊天中。

在服务器终端以管理员执行。以下是 Ubuntu/Debian 示例，先核对真实网站路径；其他系统改用等效的用户管理命令。若该用户已存在，跳过创建，先核对其用途。

```bash
useradd --create-home --shell /bin/bash mcmod-deploy
install -d -m 700 -o mcmod-deploy -g mcmod-deploy /home/mcmod-deploy/.ssh
touch /home/mcmod-deploy/.ssh/authorized_keys
chown mcmod-deploy:mcmod-deploy /home/mcmod-deploy/.ssh/authorized_keys
chmod 600 /home/mcmod-deploy/.ssh/authorized_keys
```

用面板文件编辑器把本机公钥作为**完整一行追加**到 `/home/mcmod-deploy/.ssh/authorized_keys`。可在公钥前加 `restrict `，关闭该密钥的转发和交互终端功能。

让这个账号只拥有本网站运行目录的写权限，示例：

```bash
chown -R mcmod-deploy:mcmod-deploy /opt/1panel/www/sites/mcmod-wiki/index
```

确认新目录与静态文件保持可读，父目录允许 OpenResty 和部署账号进入。不要对整个 `/opt/1panel` 或其他网站递归改权限，不要使用 `chmod 777`。服务器需安装 `rsync`，并保留正常的 SSH/SFTP 功能。

用实际 SSH 端口测试（这里 `22` 只是示例）：

```bash
ssh -i ~/.ssh/mcmod_wiki_deploy -p 22 mcmod-deploy@154.219.98.95 \
  'test -w /opt/1panel/www/sites/mcmod-wiki/index && command -v rsync'
```

在服务器控制台查看主机公钥和指纹：

```bash
cat /etc/ssh/ssh_host_ed25519_key.pub
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

第一次本机连接时核对指纹。GitHub 的 `DEPLOY_KNOWN_HOSTS` 用相同公钥构造：标准端口的格式是 `154.219.98.95 ssh-ed25519 公钥主体`；非标准端口是 `[154.219.98.95]:实际端口 ssh-ed25519 公钥主体`。工作流保留主机身份校验。

## 6. 配置 GitHub 自动发布

项目已经准备好 `.github/workflows/deploy.yml`。它在推送 `master` 时触发，也可以手动运行。安装依赖和构建在 GitHub 上完成，服务器只接收静态文件。[GitHub push 触发说明](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#push)。

在仓库「Settings → Secrets and variables → Actions → Secrets」创建以下六项：[GitHub Secrets 官方说明](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)。

| Secret 名称 | 内容 |
| --- | --- |
| `DEPLOY_HOST` | `154.219.98.95` |
| `DEPLOY_PORT` | 实际 SSH 端口，如 `22`；不是面板端口 |
| `DEPLOY_USER` | `mcmod-deploy` |
| `DEPLOY_PATH` | 经过核对的网站主机运行目录，如 `/opt/1panel/www/sites/mcmod-wiki/index` |
| `DEPLOY_SSH_KEY` | 本机生成的部署私钥完整内容，含 BEGIN/END 行 |
| `DEPLOY_KNOWN_HOSTS` | 上一步核对的服务器主机公钥行 |

当前工作流检查默认的 `.../www/sites/代号/index` 目录格式。如果面板使用了自定义网站路径，需要先对应调整工作流中的路径校验，不能仅为了通过检查而填错误目录。

在同一个页面的「Variables」添加 Repository variable：`DEPLOY_ENABLED` = `true`。先完成网站、SSH、证书和 Secrets 配置再启用；未设置该变量时发布任务会显示 `Skipped`。

把部署文件和同步后的锁文件提交并推送到当前远程 `master`（本项目远程名称也叫 `master`）：

```bash
git add .github/workflows/deploy.yml DEPLOYMENT.md pnpm-lock.yaml
git commit -m "Add 1Panel automatic deployment"
git push master master
```

去仓库「Actions → Deploy to 1Panel」查看执行结果。手动重跑可选「Run workflow」，选择 `master`。之后照常提交并推送网站或文档修改，服务器便会自动收到新版本；只在本机保存或提交而没有 push 不会触发。

工作流先上传资源，最后替换 `index.html`，并核对新服务器 HTTPS 首页、`/editor` 和首页引用的一个 JS 资源与构建结果一致。上传步骤不自动删除旧文件，保留旧资源可降低已打开网页加载旧分包失败的概率。这不是完整目录的原子切换；需要从服务器真正移除已下线的文档时，在核对路径后手动处理，并定期清理不再使用的旧资源。

静态文件更新通常不需要重启 OpenResty。工作流最后验证失败会标记红色，但不会自动回滚已经上传的文件；首次迁移前保留面板网站备份，必要时恢复备份或把 DNS 恢复为记录的 Netlify CNAME。

## 7. 常见问题

| 现象 | 检查点 |
| --- | --- |
| 首页仍是 Netlify 版本 | 检查 DNS 是否切换；用 `curl --resolve` 单独验证新服务器 |
| 首页可用，刷新文档页 404 | 检查当前网站的 `try_files` 回退规则 |
| 页面白屏、资源 404 | 检查运行目录是否直接包含 `index.html` 和 `assets/`；本项目部署在域名根路径 |
| Actions 显示 Skipped | 检查 Repository variable `DEPLOY_ENABLED` 是否为 `true`、分支是否为 `master` |
| Permission denied (publickey) | 检查部署公钥、私钥、SSH 用户和端口、`.ssh` 权限 |
| Host key verification failed | 用服务器控制台重新核对主机公钥和 known_hosts 的 IP/端口格式 |
| SSH 连接超时 | 检查真实 SSH 端口、云平台安全组和服务器防火墙 |
| 网站目录写入失败 | 检查 `DEPLOY_PATH`、目录所有者和父目录访问权限 |
| HTTPS 校验失败 | 检查新服务器 443、域名证书和对应站点配置；DNS 正常不代表新服务器证书正常 |
| 本机能构建，CI 报锁文件过期 | 保持 `package.json` 与 `pnpm-lock.yaml` 同步，并提交锁文件；pnpm 固定为 8.12.1 |

[1Panel 创建网站官方说明](https://docs.fit2cloud.com/1panel/user_manual/websites/website-create/)
