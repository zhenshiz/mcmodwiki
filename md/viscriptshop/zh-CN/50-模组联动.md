<h1 id="模组联动" data-toc-id="模组联动">模组联动</h1>
<p>ViScriptShop 会在检测到兼容模组后自动启用相应能力。大多数联动不需要额外开关；FTB 侧边栏和 Magic Coins 货币替换需要修改公共配置。</p>
<h2 id="联动一览" data-toc-id="联动一览">联动一览</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>模组</th>
      <th>ViScriptShop 提供的能力</th>
      <th>需要额外配置</th>
    </tr>
    <tr>
      <td>KubeJS</td>
      <td>客户端和服务端工具方法、商店生命周期与购买事件</td>
      <td>编写脚本时需要</td>
    </tr>
    <tr>
      <td>精妙背包</td>
      <td>普通商品成本可从背包模组容器中统计和扣除</td>
      <td>无</td>
    </tr>
    <tr>
      <td>超越维度</td>
      <td>普通成本可从网络扣除，并可把购买产出发送到网络</td>
      <td>玩家在界面中选择输出目标</td>
    </tr>
    <tr>
      <td>Lightman’s Currency</td>
      <td>普通物品成本可读取和扣除钱包中的硬币物品</td>
      <td>无</td>
    </tr>
    <tr>
      <td>汇流来世</td>
      <td>普通成本可读取和扣除额外物品栏与小猪储钱罐</td>
      <td>无</td>
    </tr>
    <tr>
      <td>FTB Library</td>
      <td>在 FTB 侧边栏显示商店按钮，可打开选择器或指定商店</td>
      <td>启用按钮并可填写默认商店</td>
    </tr>
    <tr>
      <td>FTB Quests</td>
      <td>提供提交 VSS 虚拟货币的任务，以及发放货币的奖励</td>
      <td>在任务编辑器中添加对应类型</td>
    </tr>
    <tr>
      <td>JEI</td>
      <td>在商店物品图标上使用 JEI 的配方和用途快捷键</td>
      <td>无</td>
    </tr>
    <tr>
      <td>Just Enough Characters</td>
      <td>商店商品搜索框支持拼音查询</td>
      <td>无</td>
    </tr>
    <tr>
      <td>Magic Coins</td>
      <td>可让商店、指令和任务统一使用 Magic Coins 余额</td>
      <td>开启货币替换</td>
    </tr>
  </tbody>
</table>
<h2 id="普通物品成本从哪里扣除" data-toc-id="普通物品成本从哪里扣除">普通物品成本从哪里扣除</h2>
<p>以物换物成本、货币出售成本等“普通交易物品”通过 ViScriptLib 的容器助手统一统计和扣除。在没有额外联动时，它可处理玩家物品栏、合成栏、鼠标携带物和末影箱；安装对应模组后，再纳入已注册的外部容器。</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">促销物品条件不是普通成本</div>
  <div data-type="admonition-content">
    <p>“玩家持有指定物品”促销条件只检查玩家随身物品栏、快捷栏、副手和盔甲栏，不会检查末影箱、精妙背包、超越维度网络或其他外部容器。优惠券要放在玩家身上才会生效。</p>
  </div>
</div>
<h2 id="外部容器联动测试" data-toc-id="外部容器联动测试">外部容器联动测试</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">准备单一来源</div>
    <div data-type="admonition-content">
      <p>清空玩家主物品栏，只在目标背包、网络、钱包或额外栏位中放入一份交易成本。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">检查消费面板</div>
    <div data-type="admonition-content">
      <p>把商品加入购物车，确认“消费”区域显示的持有数量已经包含外部容器。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">完成一次购买</div>
    <div data-type="admonition-content">
      <p>结算后检查外部容器中成本被准确扣除，同时确认没有重复扣除其他来源。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">测试数量不足</div>
    <div data-type="admonition-content">
      <p>移走一部分成本再购买，确认服务端拒绝交易且未扣除任何物品。</p>
    </div>
  </div>
</div>
<h2 id="超越维度输出目标" data-toc-id="超越维度输出目标">超越维度输出目标</h2>
<p>安装超越维度后，玩家可在商店购物车旁选择产出目标。选“玩家物品栏”时按原版方式发放；选超越维度网络时，普通产出和买赠物品会尝试直接进入网络。该选择会为每位玩家保存。</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">输出网络不可用时不会强行成交</div>
  <div data-type="admonition-content">
    <p>如果玩家选择的超越维度网络在结算时不可用，交易会取消，避免先扣除成本却无法发放物品。排错时先切回玩家物品栏验证。</p>
  </div>
</div>
<h2 id="配置-ftb-侧边栏" data-toc-id="配置-ftb-侧边栏">配置 FTB 侧边栏</h2>
<p>安装 FTB Library 后，在 <code>config/viscript_shop_config.toml</code> 中启用按钮：</p>
<pre language="toml" isclosed="false"><code class="language-toml">[config]
showFtbLibraryButton = true
ftbDefaultShop = ""</code></pre>
<p><code>ftbDefaultShop</code> 留空会打开商店选择器；填写 <code>village_market</code> 会直接打开同名商店。这里填写的是 <code>/viscript_shop open</code> 后面的路径，不包含命令和 <code>.shop</code> 后缀。无效路径会显示错误并自动回到选择器。</p>
<p>选择器只显示允许快捷打开的商店。可在商店编辑器中开启对应选项，或执行：</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop setQuickOpening village_market true</code></pre>
<h2 id="配置-ftb-quests-货币任务" data-toc-id="配置-ftb-quests-货币任务">配置 FTB Quests 货币任务</h2>
<p>在 FTB Quests 编辑模式中，ViScriptShop 注册了一个虚拟货币任务和一个虚拟货币奖励。</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>类型</th>
      <th>默认数量</th>
      <th>行为</th>
    </tr>
    <tr>
      <td>虚拟货币任务</td>
      <td>100，最小 1</td>
      <td>玩家主动提交余额；实际扣除的整数部分计入团队任务进度</td>
    </tr>
    <tr>
      <td>虚拟货币奖励</td>
      <td>100</td>
      <td>玩家领取时增加对应数量的当前商店货币</td>
    </tr>
  </tbody>
</table>
<p>任务提交按整数计算：余额为 25.8 时，单次最多提交 25。任务进度属于 FTB Quests 团队数据，但货币从实际提交的玩家余额中扣除。</p>
<h2 id="用-magic-coins-替换货币" data-toc-id="用-magic-coins-替换货币">用 Magic Coins 替换货币</h2>
<p>同时安装 Magic Coins 后，将公共配置改为：</p>
<pre language="toml" isclosed="false"><code class="language-toml">[config]
isReplaceMoneyToMagicCoin = true</code></pre>
<p>启用后，商店结算、余额显示、<code>/viscript_shop money</code> 指令以及 FTB Quests 的虚拟货币任务和奖励都会读写 Magic Coins 当前提供的余额，形成统一经济系统。</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">切换提供方不会自动搬迁旧余额</div>
  <div data-type="admonition-content">
    <p>启用替换前先规划原 ViScriptShop 余额的迁移或补偿，并在服务器副本上测试。不要在正式运营中来回切换，否则玩家看到的可用余额来源会改变。</p>
  </div>
</div>
<h2 id="jei-快捷查询" data-toc-id="jei-快捷查询">JEI 快捷查询</h2>
<p>安装 JEI 后，将鼠标放在商店中的交易物品或返回物品图标上，按 JEI 设置中的“查看配方”或“查看用途”按键，即可跳转到相应查询。实际按键以玩家自己的 JEI 键位设置为准。</p>
<h2 id="联动故障快速检查" data-toc-id="联动故障快速检查">联动故障快速检查</h2>
<ul>
  <li><p>确认兼容模组安装在正确运行端，版本与 Minecraft 1.21.1、NeoForge 和当前整合包一致。</p></li>
  <li><p>检查服务端启动日志中是否有缺失类、混入或版本范围错误。</p></li>
  <li><p>FTB 按钮不显示时检查 <code>showFtbLibraryButton</code>，选择器为空时检查商店快捷打开状态。</p></li>
  <li><p>外部容器不参与扣除时，用单一来源测试，并确认物品组件匹配规则没有把物品排除。</p></li>
  <li><p>Magic Coins 余额不一致时确认服务端和客户端使用相同配置并重新连接。</p></li>
</ul>
<h2 id="脚本联动" data-toc-id="脚本联动">脚本联动</h2>
<p>希望监听成交、阻止购买或由任务脚本打开商店时，继续阅读<a href="?file=&quot;60-KubeJS与开发者.md&quot;">KubeJS 与开发者</a>。</p>
