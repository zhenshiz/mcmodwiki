<h1 id="mod-integration" data-toc-id="mod-integration">Mod Integration</h1>
<p>ViScriptShop automatically enables the corresponding capabilities when compatible mods are detected. Most integrations require no extra switches; the FTB sidebar and the Magic Coins currency replacement need changes to the common config.</p>
<h2 id="integration-overview" data-toc-id="integration-overview">Integration Overview</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Mod</th>
      <th>Capabilities provided by ViScriptShop</th>
      <th>Extra config needed</th>
    </tr>
    <tr>
      <td>KubeJS</td>
      <td>Client and server tool methods, shop lifecycle and purchase events</td>
      <td>Needed when writing scripts</td>
    </tr>
    <tr>
      <td>Sophisticated Backpacks</td>
      <td>Normal item costs can be counted and deducted from the backpack mod's containers</td>
      <td>None</td>
    </tr>
    <tr>
      <td>Beyond Dimensions</td>
      <td>Normal costs can be deducted from the network, and purchase output can be sent to the network</td>
      <td>Players choose the output target in the UI</td>
    </tr>
    <tr>
      <td>Lightman’s Currency</td>
      <td>Normal item costs can read and deduct coin items from the wallet</td>
      <td>None</td>
    </tr>
    <tr>
      <td>Confluence: Otherworld</td>
      <td>Normal costs can read and deduct from the extra inventory slots and the piggy bank</td>
      <td>None</td>
    </tr>
    <tr>
      <td>FTB Library</td>
      <td>Shows a shop button in the FTB sidebar that can open the selector or a specified shop</td>
      <td>Enable the button and optionally fill in a default shop</td>
    </tr>
    <tr>
      <td>FTB Quests</td>
      <td>Provides a quest for submitting VSS virtual currency, plus rewards that grant currency</td>
      <td>Add the corresponding types in the quest editor</td>
    </tr>
    <tr>
      <td>JEI</td>
      <td>JEI's recipe and usage keybinds work on shop item icons</td>
      <td>None</td>
    </tr>
    <tr>
      <td>Just Enough Characters</td>
      <td>The shop item search box supports pinyin queries</td>
      <td>None</td>
    </tr>
    <tr>
      <td>Magic Coins</td>
      <td>Lets shops, commands, and quests all use the Magic Coins balance</td>
      <td>Enable currency replacement</td>
    </tr>
  </tbody>
</table>
<h2 id="where-normal-item-costs-are-deducted-from" data-toc-id="where-normal-item-costs-are-deducted-from">Where Normal Item Costs Are Deducted From</h2>
<p>"Normal trade items" such as barter costs and currency-sale costs are counted and deducted uniformly by ViScriptLib's container helper. Without extra integrations, it can handle the player inventory, the crafting grid, the item carried by the cursor, and the ender chest; once the corresponding mods are installed, registered external containers are included as well.</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Promotion item conditions are not normal costs</div>
  <div data-type="admonition-content">
    <p>The "player holds specified items" promotion condition only checks the player's carried inventory, hotbar, offhand, and armor slots; it does not check the ender chest, Sophisticated Backpacks, the Beyond Dimensions network, or other external containers. Coupons must be on the player to take effect.</p>
  </div>
</div>
<h2 id="external-container-integration-testing" data-toc-id="external-container-integration-testing">External Container Integration Testing</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Prepare a single source</div>
    <div data-type="admonition-content">
      <p>Empty the player's main inventory, then place one copy of the trade cost only in the target backpack, network, wallet, or extra slots.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Check the cost panel</div>
    <div data-type="admonition-content">
      <p>Add the item to the cart and confirm that the held quantity shown in the "cost" area already includes the external container.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Complete a purchase</div>
    <div data-type="admonition-content">
      <p>After checkout, check that the cost was deducted exactly once from the external container, and confirm nothing was double-deducted from other sources.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Test insufficient quantity</div>
    <div data-type="admonition-content">
      <p>Move part of the cost away and buy again, confirming that the server rejects the trade and no items are deducted.</p>
    </div>
  </div>
</div>
<h2 id="beyond-dimensions-output-target" data-toc-id="beyond-dimensions-output-target">Beyond Dimensions Output Target</h2>
<p>With Beyond Dimensions installed, players can choose the output target next to the shop cart. When "player inventory" is selected, items are granted the vanilla way; when the Beyond Dimensions network is selected, normal output and bonus items attempt to enter the network directly. This choice is saved per player.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">The trade is not forced through when the output network is unavailable</div>
  <div data-type="admonition-content">
    <p>If the Beyond Dimensions network chosen by the player is unavailable at checkout, the trade is canceled, avoiding a situation where the cost is deducted but the items cannot be granted. When troubleshooting, switch back to the player inventory first to verify.</p>
  </div>
</div>
<h2 id="configure-the-ftb-sidebar" data-toc-id="configure-the-ftb-sidebar">Configure the FTB Sidebar</h2>
<p>After installing FTB Library, enable the button in <code>config/viscript_shop_config.toml</code>:</p>
<pre language="toml" isclosed="false"><code class="language-toml">[config]
showFtbLibraryButton = true
ftbDefaultShop = ""</code></pre>
<p>When <code>ftbDefaultShop</code> is left empty, the shop selector opens; filling in <code>village_market</code> opens the shop of the same name directly. What goes here is the path that follows <code>/viscript_shop open</code>, without the command and without the <code>.shop</code> suffix. Invalid paths show an error and automatically return to the selector.</p>
<p>The selector only shows shops that allow quick opening. You can enable the corresponding option in the shop editor, or run:</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop setQuickOpening village_market true</code></pre>
<h2 id="configure-ftb-quests-currency-tasks" data-toc-id="configure-ftb-quests-currency-tasks">Configure FTB Quests Currency Tasks</h2>
<p>In FTB Quests edit mode, ViScriptShop registers one virtual currency task and one virtual currency reward.</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Type</th>
      <th>Default amount</th>
      <th>Behavior</th>
    </tr>
    <tr>
      <td>Virtual currency task</td>
      <td>100, minimum 1</td>
      <td>The player actively submits balance; the integer portion actually deducted counts toward the team's quest progress</td>
    </tr>
    <tr>
      <td>Virtual currency reward</td>
      <td>100</td>
      <td>When the player claims it, the corresponding amount is added to the current shop currency</td>
    </tr>
  </tbody>
</table>
<p>Quest submissions are counted as integers: with a balance of 25.8, at most 25 can be submitted at a time. Quest progress belongs to the FTB Quests team data, but the currency is deducted from the balance of the player who actually submitted it.</p>
<h2 id="replace-currency-with-magic-coins" data-toc-id="replace-currency-with-magic-coins">Replace Currency with Magic Coins</h2>
<p>With Magic Coins also installed, change the common config to:</p>
<pre language="toml" isclosed="false"><code class="language-toml">[config]
isReplaceMoneyToMagicCoin = true</code></pre>
<p>Once enabled, shop checkout, balance display, the <code>/viscript_shop money</code> commands, and the FTB Quests virtual currency task and reward all read and write the balance currently provided by Magic Coins, forming a unified economy.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Switching providers does not automatically migrate old balances</div>
  <div data-type="admonition-content">
    <p>Before enabling the replacement, plan the migration or compensation of the original ViScriptShop balances, and test on a copy of the server. Do not switch back and forth in live operation, otherwise the source of the balance players see will change.</p>
  </div>
</div>
<h2 id="jei-quick-lookups" data-toc-id="jei-quick-lookups">JEI Quick Lookups</h2>
<p>With JEI installed, hover the mouse over a trade item or output item icon in the shop and press the "show recipe" or "show uses" keybind from the JEI settings to jump to the corresponding lookup. The actual keybinds follow each player's own JEI key settings.</p>
<h2 id="quick-integration-troubleshooting-checks" data-toc-id="quick-integration-troubleshooting-checks">Quick Integration Troubleshooting Checks</h2>
<ul>
  <li><p>Confirm that compatible mods are installed on the correct side, with versions matching Minecraft 1.21.1, NeoForge, and the current modpack.</p></li>
  <li><p>Check the server startup logs for missing classes, mixin, or version range errors.</p></li>
  <li><p>If the FTB button does not show, check <code>showFtbLibraryButton</code>; if the selector is empty, check the shops' quick-opening status.</p></li>
  <li><p>If external containers are not being deducted from, test with a single source, and confirm that item component matching rules are not excluding the items.</p></li>
  <li><p>If Magic Coins balances are inconsistent, confirm the server and client use the same config and reconnect.</p></li>
</ul>
<h2 id="script-integration" data-toc-id="script-integration">Script Integration</h2>
<p>To listen for completed trades, block purchases, or open shops from quest scripts, continue with <a href="?file=&quot;60-KubeJS-and-Developers.md&quot;">KubeJS and Developers</a>.</p>
