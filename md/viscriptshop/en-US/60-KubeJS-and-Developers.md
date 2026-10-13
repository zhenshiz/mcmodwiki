<h1 id="kubejs-and-developers" data-toc-id="kubejs-and-developers">KubeJS and Developers</h1>
<p>This page is for modpack script authors and other mod developers. Server owners who only want to configure shops do not need to write any code and can go straight to <a
    href="?file=&quot;40-Server.Commands-and-Config.md&quot;">Commands and Config</a>.</p>
<h2 id="scope-of-the-kubejs-bindings" data-toc-id="scope-of-the-kubejs-bindings">Scope of the KubeJS Bindings</h2>
<p>With KubeJS installed, both client and server scripts can use the global binding named <code>ViScriptShopUtil</code>, but the underlying utility class differs on each side:</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Script location</th>
      <th>Binding type</th>
      <th>Main capabilities</th>
    </tr>
    <tr>
      <td>kubejs/server_scripts</td>
      <td>ViScriptShopServerUtil</td>
      <td>Opening shops; managing data, stock, stages, and virtual currency</td>
    </tr>
    <tr>
      <td>kubejs/client_scripts</td>
      <td>ViScriptShopClientUtil</td>
      <td>Opening the client selector; reading the local player's balance and stage snapshots</td>
    </tr>
  </tbody>
</table>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Logic that affects game outcomes must run on the server</div>
  <div data-type="admonition-content">
    <p>Balances, stock, stages, and purchase outcomes are all decided by the server. The client-side utilities are suitable for UI integration and must not be used as a basis for permission or payment checks.</p>
  </div>
</div>
<h2 id="open-a-shop-by-right-clicking-an-item" data-toc-id="open-a-shop-by-right-clicking-an-item">Open a Shop by Right-Clicking an Item</h2>
<p>Put the following script into <code>kubejs/server_scripts/open_shop.js</code>. When a player right-clicks an emerald, it opens
  <code>village_market</code>:</p><pre language="javascript" isclosed="false"><code class="language-javascript">ItemEvents.rightClicked('minecraft:emerald', event =&gt; {
  ViScriptShopUtil.serverOpenShop(event.player, 'village_market')
})</code></pre>
<p>You can also jump straight to a category and item:</p><pre language="javascript" isclosed="false"><code class="language-javascript">ItemEvents.rightClicked('minecraft:diamond', event =&gt; {
  ViScriptShopUtil.serverOpenShop(
    event.player,
    'village_market',
    'ores',
    'diamond_offer'
  )
})</code></pre>
<p>The path, category ID, and item ID must match the shop as currently loaded on the server. Production scripts should add cooldown, dimension, or item conditions appropriate to your gameplay to avoid reopening the shop on every right-click.</p>
<h2 id="common-server-methods" data-toc-id="common-server-methods">Common Server Methods</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Method</th>
      <th>Purpose</th>
    </tr>
    <tr>
      <td>serverOpenShopSelector(player)</td>
      <td>Opens the quick shop selector for a player</td>
    </tr>
    <tr>
      <td>serverOpenFtbShop(player)</td>
      <td>Opens the shop or selector using the server's FTB default path</td>
    </tr>
    <tr>
      <td>serverOpenShop(player, shop[, categoryId, merchantId])</td>
      <td>Opens a shop, optionally jumping straight to a category and item</td>
    </tr>
    <tr>
      <td>getShopInfo(shop)</td>
      <td>Reads information about currently loaded shops</td>
    </tr>
    <tr>
      <td>reloadOpenShop(shop)</td>
      <td>Clears the loaded data and runtime stock of the given shop</td>
    </tr>
    <tr>
      <td>setQuickOpening(shop, boolean)</td>
      <td>Changes the quick-open state</td>
    </tr>
    <tr>
      <td>setMerchantStock(shop, categoryId, merchantId, stock)</td>
      <td>Changes an item's stock in the current world; returns whether it succeeded</td>
    </tr>
    <tr>
      <td>removeMerchant(shop, categoryId, merchantId)</td>
      <td>Removes an item from the current world data; returns whether it succeeded</td>
    </tr>
    <tr>
      <td>getMoney, setMoney, addMoney, removeMoney</td>
      <td>Read and write the player's balance in the current currency provider</td>
    </tr>
    <tr>
      <td>getStageFlags, hasStageFlag, addStageFlag, removeStageFlag</td>
      <td>Query and modify player stages</td>
    </tr>
  </tbody>
</table>
<p><code>removeMoney</code> returns the amount actually deducted and never pushes the balance below 0. When the Magic Coins replacement is enabled, the money methods automatically operate on the
  Magic Coins balance, so no branching is needed in scripts.</p>
<h2 id="purchase-events" data-toc-id="purchase-events">Purchase Events</h2>
<p>The server provides three KubeJS events:</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Event</th>
      <th>When it fires</th>
      <th>Cancellable</th>
    </tr>
    <tr>
      <td>ViScriptShopEvents.buyPre</td>
      <td>When the server is about to process the cart</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>ViScriptShopEvents.buyFail</td>
      <td>After the server's checkout checks fail</td>
      <td>No</td>
    </tr>
    <tr>
      <td>ViScriptShopEvents.buySuccess</td>
      <td>After the server has finished deducting and granting</td>
      <td>No</td>
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
  <div data-type="admonition-title">Data exposed by the KubeJS wrapper events</div>
  <div data-type="admonition-content">
    <p>The current KubeJS event wrappers expose <code>player</code> and <code>shopInfo</code>. The underlying NeoForge
      events also include cost and payout summaries, but these are not directly exposed to the KubeJS wrapper. Scripts must not assume they can read every cost entry in the cart from the KubeJS event.</p>
  </div>
</div>
<h2 id="client-lifecycle-events" data-toc-id="client-lifecycle-events">Client Lifecycle Events</h2>
<p>Client scripts can listen to
  <code>ViScriptShopEvents.opening</code>, <code>ViScriptShopEvents.closing</code>,
  and <code>ViScriptShopEvents.tick</code>. The events expose the current <code>shopUI</code>, which is useful for on-screen hints or debugging.
</p><pre language="javascript" isclosed="false"><code class="language-javascript">ViScriptShopEvents.opening(event =&gt; {
  console.info('ViScriptShop UI opened')
})

ViScriptShopEvents.closing(event =&gt; {
console.info('ViScriptShop UI closed')
})</code></pre>
<p><code>tick</code> fires frequently while a shop UI is active. Do not scan large amounts of data, write files, or send high-frequency network messages inside it.</p>
<h2 id="as-a-development-dependency" data-toc-id="as-a-development-dependency">As a Development Dependency</h2>
<p>The current release coordinates are defined by the project's build configuration as <code>com:ViScriptShop-neoforge-1.21.1:1.2.1</code>, published to
  Sighs Maven. The POM does not carry transitive dependencies; developers must explicitly add LDLib2, plus ViScriptLib or optional integration dependencies depending on their use.</p><pre language="groovy" isclosed="false"><code class="language-groovy">repositories {
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
<p>Versions change between releases. Before copying dependencies, treat the
  <code>gradle.properties</code> and <code>build.gradle</code> in the <a href="https://github.com/zhenshiz/ViScriptShop"
    target="_blank" rel="noopener noreferrer nofollow">current project repository</a> as authoritative.</p>
<h2 id="troubleshooting-development-issues" data-toc-id="troubleshooting-development-issues">Troubleshooting Development Issues</h2>
<p>If a script never triggers, a method cannot be found, or server-side checkout misbehaves, see <a
    href="?file=&quot;70-Troubleshooting-and-Maintenance.md&quot;">Troubleshooting and Maintenance</a>, and attach the full logs plus a minimal shop that reproduces the issue.</p>