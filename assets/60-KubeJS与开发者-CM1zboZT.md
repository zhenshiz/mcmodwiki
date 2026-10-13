<h1 id="kubejs-与开发者" data-toc-id="kubejs-与开发者">KubeJS 与开发者</h1>
<p>本页面向整合包脚本作者和其他模组开发者。只想配置商店的服主不需要编写代码，可直接阅读<a
    href="?file=&quot;40-服务器管理.指令与配置.md&quot;">指令与配置</a>。</p>
<h2 id="kubejs-绑定的作用域" data-toc-id="kubejs-绑定的作用域">KubeJS 绑定的作用域</h2>
<p>安装 KubeJS 后，客户端脚本和服务端脚本都能使用名为 <code>ViScriptShopUtil</code>
  的全局绑定，但两端对应的工具类不同：</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>脚本位置</th>
      <th>绑定类型</th>
      <th>主要能力</th>
    </tr>
    <tr>
      <td>kubejs/server_scripts</td>
      <td>ViScriptShopServerUtil</td>
      <td>打开商店、管理数据、库存、阶段和虚拟货币</td>
    </tr>
    <tr>
      <td>kubejs/client_scripts</td>
      <td>ViScriptShopClientUtil</td>
      <td>打开客户端选择器、读取本地玩家余额和阶段快照</td>
    </tr>
  </tbody>
</table>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">影响游戏结果的逻辑必须写在服务端</div>
  <div data-type="admonition-content">
    <p>余额、库存、阶段和成交结果都以服务端为准。客户端工具适合界面联动，不能作为权限或支付校验依据。</p>
  </div>
</div>
<h2 id="用物品右键打开商店" data-toc-id="用物品右键打开商店">用物品右键打开商店</h2>
<p>以下脚本放入 <code>kubejs/server_scripts/open_shop.js</code>。玩家右键绿宝石时打开
  <code>village_market</code>：</p><pre language="javascript" isclosed="false"><code class="language-javascript">ItemEvents.rightClicked('minecraft:emerald', event =&gt; {
  ViScriptShopUtil.serverOpenShop(event.player, 'village_market')
})</code></pre>
<p>也可以直达分类和商品：</p><pre language="javascript" isclosed="false"><code class="language-javascript">ItemEvents.rightClicked('minecraft:diamond', event =&gt; {
  ViScriptShopUtil.serverOpenShop(
    event.player,
    'village_market',
    'ores',
    'diamond_offer'
  )
})</code></pre>
<p>路径、分类 ID 和商品 ID 必须与服务端当前商店一致。正式脚本应根据自己的玩法添加冷却、维度或物品条件，避免每次右键都重复打开。</p>
<h2 id="服务端常用方法" data-toc-id="服务端常用方法">服务端常用方法</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>方法</th>
      <th>用途</th>
    </tr>
    <tr>
      <td>serverOpenShopSelector(player)</td>
      <td>为玩家打开快捷商店选择器</td>
    </tr>
    <tr>
      <td>serverOpenFtbShop(player)</td>
      <td>按服务端 FTB 默认路径打开商店或选择器</td>
    </tr>
    <tr>
      <td>serverOpenShop(player, shop[, categoryId, merchantId])</td>
      <td>打开商店，并可直达分类和商品</td>
    </tr>
    <tr>
      <td>getShopInfo(shop)</td>
      <td>读取当前已加载的商店信息</td>
    </tr>
    <tr>
      <td>reloadOpenShop(shop)</td>
      <td>清除指定商店已加载数据和运行时库存</td>
    </tr>
    <tr>
      <td>setQuickOpening(shop, boolean)</td>
      <td>修改快捷打开状态</td>
    </tr>
    <tr>
      <td>setMerchantStock(shop, categoryId, merchantId, stock)</td>
      <td>修改当前世界中的商品库存，返回是否成功</td>
    </tr>
    <tr>
      <td>removeMerchant(shop, categoryId, merchantId)</td>
      <td>从当前世界数据中移除商品，返回是否成功</td>
    </tr>
    <tr>
      <td>getMoney、setMoney、addMoney、removeMoney</td>
      <td>读写玩家当前货币提供方的余额</td>
    </tr>
    <tr>
      <td>getStageFlags、hasStageFlag、addStageFlag、removeStageFlag</td>
      <td>查询和修改玩家阶段</td>
    </tr>
  </tbody>
</table>
<p><code>removeMoney</code> 返回实际扣除数，不会让余额降到 0 以下。启用 Magic Coins 替换后，货币方法会自动操作
  Magic Coins 余额，无需在脚本中分支。</p>
<h2 id="购买事件" data-toc-id="购买事件">购买事件</h2>
<p>服务端提供三个 KubeJS 事件：</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>事件</th>
      <th>触发时机</th>
      <th>能否取消</th>
    </tr>
    <tr>
      <td>ViScriptShopEvents.buyPre</td>
      <td>服务端准备处理购物车时</td>
      <td>是</td>
    </tr>
    <tr>
      <td>ViScriptShopEvents.buyFail</td>
      <td>服务端结算检查失败后</td>
      <td>否</td>
    </tr>
    <tr>
      <td>ViScriptShopEvents.buySuccess</td>
      <td>服务端完成扣除与发放后</td>
      <td>否</td>
    </tr>
  </tbody>
</table><pre language="javascript" isclosed="false"><code class="language-javascript">ViScriptShopEvents.buyPre(event =&gt; {
  if (!ViScriptShopUtil.hasStageFlag(event.player, 'shop_access')) {
    event.cancel()
  }
})

ViScriptShopEvents.buySuccess(event =&gt; {
console.info('VSS purchase completed')
})</code></pre>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">KubeJS 包装事件公开的数据</div>
  <div data-type="admonition-content">
    <p>当前 KubeJS 事件包装器公开 <code>player</code> 和 <code>shopInfo</code>。底层 NeoForge
      事件还包含成本与收益汇总，但它们没有直接暴露到 KubeJS 包装器。脚本不要假设能从 KubeJS 事件读取购物车中的每一项成本。</p>
  </div>
</div>
<h2 id="客户端生命周期事件" data-toc-id="客户端生命周期事件">客户端生命周期事件</h2>
<p>客户端脚本可监听
  <code>ViScriptShopEvents.opening</code>、<code>ViScriptShopEvents.closing</code>
  和 <code>ViScriptShopEvents.tick</code>。事件公开当前 <code>shopUI</code>，适合接入界面提示或调试。
</p><pre language="javascript" isclosed="false"><code class="language-javascript">ViScriptShopEvents.opening(event =&gt; {
  console.info('ViScriptShop UI opened')
})

ViScriptShopEvents.closing(event =&gt; {
console.info('ViScriptShop UI closed')
})</code></pre>
<p><code>tick</code> 在商店界面活动期间频繁触发。不要在其中扫描大量数据、写文件或发送高频网络消息。</p>
<h2 id="作为开发依赖" data-toc-id="作为开发依赖">作为开发依赖</h2>
<p>当前发布坐标由项目构建配置定义为 <code>com:ViScriptShop-neoforge-1.21.1:1.2.1</code>，发布仓库为
  Sighs Maven。POM 不携带传递依赖，开发者需要显式加入 LDLib2，并按用途加入 ViScriptLib 或可选联动依赖。</p><pre language="groovy" isclosed="false"><code class="language-groovy">repositories {
  maven { url = 'https://maven.sighs.cc/repository/maven-releases/' }
  maven { url = 'https://maven.sighs.cc/repository/maven-public/' }
  maven { url = 'https://maven.firstdarkdev.xyz/snapshots' }
}

dependencies {
implementation('com:ViScriptShop-neoforge-1.21.1:${viscriptshop_version}') {
transitive = false
}
implementation('com.lowdragmc.ldlib2:ldlib2-neoforge-1.21.1:${ldlib2_version}:all')
implementation('com.zhenshiz:ViScriptLib-neoforge-1.21.1:${viscriptlib_version}')
}</code></pre>
<p>版本会随发布变化。复制依赖前请以<a href="https://github.com/zhenshiz/ViScriptShop"
    target="_blank" rel="noopener noreferrer nofollow">当前项目仓库</a>中的
  <code>gradle.properties</code> 和 <code>build.gradle</code> 为准。</p>
<h2 id="排查开发问题" data-toc-id="排查开发问题">排查开发问题</h2>
<p>脚本没有触发、方法找不到或服务端结算异常时，参阅<a
    href="?file=&quot;70-排错与维护.md&quot;">排错与维护</a>，并附带完整日志和最小复现商店。</p>