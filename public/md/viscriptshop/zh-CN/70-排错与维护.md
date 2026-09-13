<h1 id="排错与维护" data-toc-id="排错与维护">排错与维护</h1>
<p>遇到问题时，先判断故障发生在文件、世界存档、客户端界面还是服务端结算。ViScriptShop
  的价格、阶段、库存和购买结果由服务端决定，客户端显示只是一份同步快照。</p>
<h2 id="快速定位表" data-toc-id="快速定位表">快速定位表</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>现象</th>
      <th>优先检查</th>
      <th>常见处理</th>
    </tr>
    <tr>
      <td>编辑器改完，玩家仍看到旧商店</td>
      <td>是否只保存本地、是否上传、是否重载</td>
      <td>确认文件到达服务端，再谨慎重载指定商店</td>
    </tr>
    <tr>
      <td>选择器中没有商店</td>
      <td>商店是否允许快捷打开</td>
      <td>编辑器开启选项或使用 setQuickOpening</td>
    </tr>
    <tr>
      <td>FTB 按钮不显示</td>
      <td>FTB Library 和 showFtbLibraryButton</td>
      <td>安装正确版本并启用公共配置</td>
    </tr>
    <tr>
      <td>FTB 按钮没有直达商店</td>
      <td>ftbDefaultShop 路径</td>
      <td>只填 open 后面的路径，不加命令或后缀</td>
    </tr>
    <tr>
      <td>无法输入中文</td>
      <td>是否安装 IMBlocker</td>
      <td>将 LDLib2 界面类加入其白名单</td>
    </tr>
    <tr>
      <td>有物品却显示成本不足</td>
      <td>组件匹配、容器联动、促销条件范围</td>
      <td>用普通无组件物品和主物品栏做最小测试</td>
    </tr>
    <tr>
      <td>锁定条件不生效</td>
      <td>阶段开关、组内和组间模式、执行者</td>
      <td>用 stage 指令给当前测试玩家做正反测试</td>
    </tr>
    <tr>
      <td>更新商店后库存恢复初始值</td>
      <td>上传后自动重载或 reload 指令</td>
      <td>从备份恢复，今后发布前决定是否保留库存</td>
    </tr>
  </tbody>
</table>
<h2 id="编辑结果没有更新" data-toc-id="编辑结果没有更新">编辑结果没有更新</h2>
<p>商店存在两层数据：</p>
<ul>
  <li>
    <p><strong>全局文件：</strong><code>ldlib2/assets/viscript_shop/shop</code> 下的
      <code>.shop</code>，由编辑器保存或上传。</p>
  </li>
  <li>
    <p><strong>世界数据：</strong>世界存档中的 <code>shop_info</code>，包含已加载商店和运行时库存。</p>
  </li>
</ul>
<p>打开商店时，服务端优先使用世界中已加载的数据；不存在时才从全局文件初始化。因此只替换文件不一定立刻改变正在运营的商店。</p>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">确认改对了文件</div>
    <div data-type="admonition-content">
      <p>检查服务端路径、文件名和 <code>.shop</code> 后缀。多人服不要只查看客户端本地文件。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">备份运行数据</div>
    <div data-type="admonition-content">
      <p>重载前备份世界存档，尤其是已经消耗过的限量库存。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">只重载目标商店</div>
    <div data-type="admonition-content">
      <pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop reload village_market</code></pre>
      <p>指定路径比无参数重载更容易控制影响范围。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">重新打开验证</div>
    <div data-type="admonition-content">
      <p>关闭旧界面后再次打开商店，用普通玩家确认名称、商品、价格和库存。</p>
    </div>
  </div>
</div>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">自动重载默认开启</div>
  <div data-type="admonition-content">
    <p>编辑器“设置 → Behavior →
      商店上传”中的“上传后自动重载商店”默认为开启。它方便开发测试，但会清除该商店的运行时库存。正式服需要保留库存时，应在上传前关闭。</p>
  </div>
</div>
<h2 id="快捷选择器为空" data-toc-id="快捷选择器为空">快捷选择器为空</h2>
<p><code>/viscript_shop open</code> 和未配置默认路径的 FTB
  按钮只展示“允许快捷打开”的商店。打开编辑器选中商店层级并开启该选项，或执行：</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop setQuickOpening village_market true</code></pre>
<p>如果指令提示商店不存在，先通过 <code>/viscript_shop open village_market</code>
  或编辑器加载它，并核对服务器文件路径。</p>
<h2 id="无法输入中文" data-toc-id="无法输入中文">无法输入中文（最新版IMBlocker已主动兼容了LDLib2）</h2>
<p>如果安装了输入法冲突修复 IMBlocker，需要在其 UI 白名单中加入 LDLib2 使用的界面类：</p><pre language="plaintext" isclosed="false"><code class="language-plaintext">com.lowdragmc.lowdraglib2.gui.holder.ModularUIScreen
com.lowdragmc.lowdraglib2.gui.holder.ModularUIContainerScreen</code></pre>
<p>修改后按 IMBlocker 的要求重启客户端或重载配置。如果没有安装该模组，检查输入法、窗口模式以及其他键盘输入类模组是否也拦截了界面。</p>
<h2 id="在编辑器中用-jei-选物品" data-toc-id="在编辑器中用-jei-选物品">在编辑器中用 JEI 选物品</h2>
<p>编辑器右上角提供最小化、缩放或还原、关闭等窗口操作。全屏编辑时可先缩小编辑器窗口，让 JEI
  物品列表露出，再把物品拖到编辑器中的物品选择组件。玩家商店内则可把鼠标放在物品图标上，使用 JEI 的配方或用途按键。</p>
<h2 id="物品数量或成本看起来不对" data-toc-id="物品数量或成本看起来不对">物品数量或成本看起来不对</h2>
<div currentstep="3" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">检查实际物品</div>
    <div data-type="admonition-content">
      <p>编辑器的资源图片和替代物品渲染只改变显示。服务端始终按“实际物品”字段交易。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">检查组件匹配</div>
    <div data-type="admonition-content">
      <p>耐久、名称和自定义数据都可能让物品不匹配。需要忽略耐久时，可用“排除指定组件”并排除
        <code>minecraft:damage</code>。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">区分普通成本与促销条件</div>
    <div data-type="admonition-content">
      <p>普通成本可从末影箱和已兼容外部容器统计；促销的“玩家物品”条件只检查随身栏位。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">结算后等待服务端快照</div>
    <div data-type="admonition-content">
      <p>购买成功后，服务端会发送完整物品数量快照并刷新商店。若显示仍不正确，重新打开界面并检查服务端与客户端日志。</p>
    </div>
  </div>
</div>
<h2 id="购物车抵扣规则" data-toc-id="购物车抵扣规则">购物车抵扣规则</h2>
<p>同一购物车中的虚拟货币收入和支出会按净额结算。例如先用 100◎ 买入物品，再出售另一件物品获得 60◎，只需现有余额能够支付净支出 40◎。</p>
<p>普通物品不采用这种抵扣。即使购物车里某个商品会产出钻石，另一个商品需要钻石，结算前玩家仍必须在可用容器中持有后者的全部成本；服务端先扣成本，再发放产出。
</p>
<h2 id="购买被拒绝" data-toc-id="购买被拒绝">购买被拒绝</h2>
<p>服务端会重新计算整份购物车。常见拒绝原因包括：</p>
<ul>
  <li>
    <p>阶段条件已变化，分类或商品不再对玩家开放。</p>
  </li>
  <li>
    <p>多人同时购买后库存已不足。</p>
  </li>
  <li>
    <p>普通物品成本、优惠券或净虚拟货币余额不足。</p>
  </li>
  <li>
    <p>产出总量超过 <code>maxShopUiGiveItemsPerPurchase</code>。</p>
  </li>
  <li>
    <p>选择的超越维度输出目标在结算时不可用。</p>
  </li>
  <li>
    <p>商店引用了当前服务端无法解析的缺失物品。</p>
  </li>
  <li>
    <p>KubeJS 或 NeoForge 的购买前事件取消了交易。</p>
  </li>
</ul>
<p>失败时不应发生部分扣款或部分发放。先记录界面提示，再查看同一时间的服务端日志和脚本日志。</p>
<h2 id="缺失物品或屏障占位符" data-toc-id="缺失物品或屏障占位符">缺失物品或屏障占位符</h2>
<p>
  商店文件引用不存在的物品、组件或附魔时，编辑器会使用屏障占位符并保留原始序列化数据；强制打开前还会尝试在原文件旁创建备份。服务端会拒绝包含缺失交易物品的购买。
</p>
<ol>
  <li>
    <p>确认服务端和编辑器客户端安装了相同的内容模组与数据包。</p>
  </li>
  <li>
    <p>恢复缺失依赖后重新打开文件，检查占位符是否还原。</p>
  </li>
  <li>
    <p>不要随意用其他物品覆盖占位符，否则原始数据会被替换。</p>
  </li>
  <li>
    <p>无法恢复时只在文件副本中修复，并保留自动备份。</p>
  </li>
</ol>
<h2 id="主题没有完全更新" data-toc-id="主题没有完全更新">主题没有完全更新</h2>
<p>将 <code>config/viscript_shop_client.toml</code> 中的 <code>shopUiTheme</code>
  设为 <code>GLASS_DARK</code> 或
  <code>GRAY_CAT_WORKSHOP</code>，然后关闭并重新打开商店、选择器或提示界面。主题是客户端配置，不要求全服玩家保持一致。</p>
<h2 id="升级与备份" data-toc-id="升级与备份">升级与备份</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">完整备份</div>
    <div data-type="admonition-content">
      <p>备份世界存档、<code>ldlib2/assets/viscript_shop/shop</code>、公共与客户端配置、KubeJS
        脚本和资源包。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">先在副本升级</div>
    <div data-type="admonition-content">
      <p>使用与正式服相同的 NeoForge、LDLib2、内容模组和联动模组版本启动测试副本。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">迁移旧文件</div>
    <div data-type="admonition-content">
      <p>保持 <code>enableLegacyDataMigration = true</code> 打开并逐份载入旧商店，重新保存为当前格式。
      </p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">完成回归测试</div>
    <div data-type="admonition-content">
      <p>测试买入、出售、货币净额、物品成本、库存、阶段、促销、外部容器、任务和脚本。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">确认后再关闭迁移</div>
    <div data-type="admonition-content">
      <p>只有当全部生产用 <code>.shop</code> 都已成功转换并验证，才考虑关闭旧数据迁移。</p>
    </div>
  </div>
</div>
<h2 id="提交问题时需要什么" data-toc-id="提交问题时需要什么">提交问题时需要什么</h2>
<ul>
  <li>
    <p>Minecraft、NeoForge、ViScriptShop、LDLib2 和 ViScriptLib 的完整版本。</p>
  </li>
  <li>
    <p>服务端与客户端模组列表，以及是否安装 KubeJS、容器联动、Magic Coins、FTB 系列或 IMBlocker。</p>
  </li>
  <li>
    <p>从启动到复现后的完整日志，不要只截取最后一行报错。</p>
  </li>
  <li>
    <p>能复现问题的最小 <code>.shop</code> 文件、相关配置和脚本；分享前移除隐私信息。</p>
  </li>
  <li>
    <p>明确的复现步骤、预期结果、实际结果，以及单人或多人环境。</p>
  </li>
</ul>
<p>确认不是配置问题后，可在<a href="https://github.com/zhenshiz/ViScriptShop/issues"
    target="_blank" rel="noopener noreferrer nofollow">项目问题追踪器</a>提交报告。</p>
<h2 id="回到文档入口" data-toc-id="回到文档入口">回到文档入口</h2>
<p>返回<a href="?file=&quot;00-模组介绍.md&quot;">模组介绍</a>，或按照<a
    href="?file=&quot;10-快速开始.创建第一个商店.md&quot;">创建第一个商店</a>重新进行最小配置测试。</p>