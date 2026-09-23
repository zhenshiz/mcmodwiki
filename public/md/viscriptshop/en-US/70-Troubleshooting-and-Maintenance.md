<h1 id="troubleshooting-and-maintenance" data-toc-id="troubleshooting-and-maintenance">Troubleshooting and Maintenance</h1>
<p>When something goes wrong, first decide whether the fault is in the files, the world save, the client UI, or server-side checkout. ViScriptShop
  prices, stages, stock, and purchase results are decided by the server; client display is only a synchronized snapshot.</p>
<h2 id="quick-diagnosis-table" data-toc-id="quick-diagnosis-table">Quick Diagnosis Table</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Symptom</th>
      <th>Check first</th>
      <th>Common fix</th>
    </tr>
    <tr>
      <td>Players still see the old shop after editing</td>
      <td>Whether it was only saved locally, whether it was uploaded, whether it was reloaded</td>
      <td>Confirm the file reached the server, then carefully reload the specific shop</td>
    </tr>
    <tr>
      <td>No shops in the selector</td>
      <td>Whether the shop allows quick opening</td>
      <td>Enable the option in the editor or use setQuickOpening</td>
    </tr>
    <tr>
      <td>FTB button not showing</td>
      <td>FTB Library and showFtbLibraryButton</td>
      <td>Install the correct version and enable the public config</td>
    </tr>
    <tr>
      <td>FTB button doesn't jump to the shop</td>
      <td>The ftbDefaultShop path</td>
      <td>Fill in only the path after open, without the command or suffix</td>
    </tr>
    <tr>
      <td>Cannot type Chinese</td>
      <td>Whether IMBlocker is installed</td>
      <td>Add the LDLib2 UI classes to its whitelist</td>
    </tr>
    <tr>
      <td>Has the items but shows insufficient cost</td>
      <td>Component matching, container integration, promotion condition scope</td>
      <td>Run a minimal test with plain items without components and the main inventory</td>
    </tr>
    <tr>
      <td>Lock conditions not taking effect</td>
      <td>Stage toggles, intra-group and inter-group modes, the executor</td>
      <td>Use the stage command to run positive and negative tests on the current test player</td>
    </tr>
    <tr>
      <td>Stock resets to initial values after updating a shop</td>
      <td>Auto reload after upload or the reload command</td>
      <td>Restore from a backup; from now on decide whether to keep stock before publishing</td>
    </tr>
  </tbody>
</table>
<h2 id="edited-results-not-updating" data-toc-id="edited-results-not-updating">Edited Results Not Updating</h2>
<p>Shops have two layers of data:</p>
<ul>
  <li>
    <p><strong>Global files:</strong> the
      <code>.shop</code> files under <code>ldlib2/assets/viscript_shop/shop</code>, saved or uploaded by the editor.</p>
  </li>
  <li>
    <p><strong>World data:</strong> <code>shop_info</code> in the world save, containing loaded shops and runtime stock.</p>
  </li>
</ul>
<p>When a shop is opened, the server prefers data already loaded in the world; only if it does not exist is it initialized from the global files. So replacing a file alone does not necessarily change a shop that is already running.</p>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Confirm you edited the right file</div>
    <div data-type="admonition-content">
      <p>Check the server path, file name, and <code>.shop</code> extension. On a multiplayer server, do not only look at local client files.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Back up runtime data</div>
    <div data-type="admonition-content">
      <p>Back up the world save before reloading, especially limited stock that has already been consumed.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Reload only the target shop</div>
    <div data-type="admonition-content">
      <pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop reload village_market</code></pre>
      <p>Specifying a path is easier to keep controlled than a reload with no arguments.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Reopen and verify</div>
    <div data-type="admonition-content">
      <p>Close the old UI, open the shop again, and verify names, items, prices, and stock as a regular player.</p>
    </div>
  </div>
</div>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Auto-reload is enabled by default</div>
  <div data-type="admonition-content">
    <p>In the editor's "Settings → Behavior →
      Shop Upload", "Auto-reload shops after upload" is enabled by default. It is convenient for development and testing, but it clears that shop's runtime stock. Production servers that need to keep stock should disable it before uploading.</p>
  </div>
</div>
<h2 id="quick-selector-is-empty" data-toc-id="quick-selector-is-empty">Quick Selector Is Empty</h2>
<p><code>/viscript_shop open</code> and FTB buttons without a configured default path
  only show shops that "allow quick opening". Open the editor, select the shop in the hierarchy, and enable the option, or run:</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop setQuickOpening village_market true</code></pre>
<p>If the command reports that the shop does not exist, load it first via <code>/viscript_shop open village_market</code>
  or the editor, and double-check the server file path.</p>
<h2 id="cannot-type-chinese-the-latest-imblocker-already-supports-ldlib2" data-toc-id="cannot-type-chinese-the-latest-imblocker-already-supports-ldlib2">Cannot Type Chinese (the Latest IMBlocker Already Supports LDLib2)</h2>
<p>If the input method conflict fix IMBlocker is installed, the UI classes used by LDLib2 must be added to its UI whitelist:</p><pre language="plaintext" isclosed="false"><code class="language-plaintext">com.lowdragmc.lowdraglib2.gui.holder.ModularUIScreen
com.lowdragmc.lowdraglib2.gui.holder.ModularUIContainerScreen</code></pre>
<p>After changing this, restart the client or reload the config as IMBlocker requires. If the mod is not installed, check the input method, the window mode, and whether other keyboard-input mods are also intercepting the UI.</p>
<h2 id="selecting-items-with-jei-in-the-editor" data-toc-id="selecting-items-with-jei-in-the-editor">Selecting Items with JEI in the Editor</h2>
<p>The top-right of the editor provides window controls such as minimize, zoom or restore, and close. When editing fullscreen, shrink the editor window first so the JEI
  item list is visible, then drag items onto the item selection widget in the editor. Inside player shops, hover the mouse over an item icon and use JEI's recipe or uses keybinds.</p>
<h2 id="item-counts-or-costs-look-wrong" data-toc-id="item-counts-or-costs-look-wrong">Item Counts or Costs Look Wrong</h2>
<div currentstep="3" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Check the actual item</div>
    <div data-type="admonition-content">
      <p>The editor's texture overrides and substitute item rendering only change display. The server always trades by the "actual item" field.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Check component matching</div>
    <div data-type="admonition-content">
      <p>Durability, names, and custom data can all make items not match. To ignore durability, use "Exclude specific components" and exclude
        <code>minecraft:damage</code>.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Tell regular costs apart from promotion conditions</div>
    <div data-type="admonition-content">
      <p>Regular costs can be counted from the ender chest and compatible external containers; a promotion's "player inventory" condition only checks carried slots.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Wait for the server snapshot after checkout</div>
    <div data-type="admonition-content">
      <p>After a successful purchase, the server sends a full item-count snapshot and refreshes the shop. If the display is still wrong, reopen the UI and check the server and client logs.</p>
    </div>
  </div>
</div>
<h2 id="cart-offsetting-rules" data-toc-id="cart-offsetting-rules">Cart Offsetting Rules</h2>
<p>Virtual currency income and expenses in the same cart are settled by net amount. For example, if a player first buys items for 100◎ and then sells another item for 60◎, the existing balance only needs to cover the net expense of 40◎.</p>
<p>Regular items do not use this offsetting. Even if one item in the cart produces diamonds and another requires diamonds, before checkout the player must still hold the full cost of the latter in an available container; the server deducts costs first, then grants outputs.
</p>
<h2 id="purchase-rejected" data-toc-id="purchase-rejected">Purchase Rejected</h2>
<p>The server recomputes the entire cart. Common rejection reasons include:</p>
<ul>
  <li>
    <p>Stage conditions have changed; the category or item is no longer available to the player.</p>
  </li>
  <li>
    <p>Stock ran out after multiple players bought at the same time.</p>
  </li>
  <li>
    <p>Insufficient regular item costs, coupons, or net virtual currency balance.</p>
  </li>
  <li>
    <p>Total output exceeds <code>maxShopUiGiveItemsPerPurchase</code>.</p>
  </li>
  <li>
    <p>The selected Beyond Dimensions output target was unavailable at checkout.</p>
  </li>
  <li>
    <p>The shop references missing items that the current server cannot resolve.</p>
  </li>
  <li>
    <p>A KubeJS or NeoForge pre-purchase event cancelled the trade.</p>
  </li>
</ul>
<p>A failure should never cause partial deduction or partial granting. Note the UI message first, then check the server log and script log for the same time.</p>
<h2 id="missing-items-or-barrier-placeholders" data-toc-id="missing-items-or-barrier-placeholders">Missing Items or Barrier Placeholders</h2>
<p>
  When a shop file references nonexistent items, components, or enchantments, the editor uses barrier placeholders and keeps the original serialized data; before a force-open it also tries to create a backup next to the original file. The server rejects purchases that include trades with missing items.
</p>
<ol>
  <li>
    <p>Confirm that the server and the editor client have the same content mods and data packs installed.</p>
  </li>
  <li>
    <p>After restoring the missing dependencies, reopen the file and check whether the placeholders are restored.</p>
  </li>
  <li>
    <p>Do not casually overwrite placeholders with other items, or the original data will be replaced.</p>
  </li>
  <li>
    <p>When recovery is impossible, fix only a copy of the file and keep the automatic backup.</p>
  </li>
</ol>
<h2 id="theme-not-fully-updated" data-toc-id="theme-not-fully-updated">Theme Not Fully Updated</h2>
<p>Set <code>shopUiTheme</code> in <code>config/viscript_shop_client.toml</code>
  to <code>GLASS_DARK</code> or
  <code>GRAY_CAT_WORKSHOP</code>, then close and reopen the shop, selector, or notice UI. The theme is a client-side config and does not require all players on the server to match.</p>
<h2 id="upgrading-and-backups" data-toc-id="upgrading-and-backups">Upgrading and Backups</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Full backup</div>
    <div data-type="admonition-content">
      <p>Back up the world save, <code>ldlib2/assets/viscript_shop/shop</code>, the public and client configs, KubeJS
        scripts, and resource packs.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Upgrade on a copy first</div>
    <div data-type="admonition-content">
      <p>Start a test copy with the same NeoForge, LDLib2, content mod, and integration mod versions as the production server.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Migrate old files</div>
    <div data-type="admonition-content">
      <p>Keep <code>enableLegacyDataMigration = true</code> on and load the old shops one by one, re-saving them in the current format.
      </p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Complete regression testing</div>
    <div data-type="admonition-content">
      <p>Test buying, selling, currency netting, item costs, stock, stages, promotions, external containers, quests, and scripts.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Disable migration only after confirmation</div>
    <div data-type="admonition-content">
      <p>Only consider turning off legacy data migration after every production <code>.shop</code> file has been successfully converted and verified.</p>
    </div>
  </div>
</div>
<h2 id="what-to-include-when-reporting-an-issue" data-toc-id="what-to-include-when-reporting-an-issue">What to Include When Reporting an Issue</h2>
<ul>
  <li>
    <p>Full versions of Minecraft, NeoForge, ViScriptShop, LDLib2, and ViScriptLib.</p>
  </li>
  <li>
    <p>The server and client mod lists, and whether KubeJS, container integrations, Magic Coins, the FTB series, or IMBlocker are installed.</p>
  </li>
  <li>
    <p>The complete log from startup through reproduction; do not just copy the last error line.</p>
  </li>
  <li>
    <p>A minimal <code>.shop</code> file that reproduces the problem, plus related configs and scripts; remove private information before sharing.</p>
  </li>
  <li>
    <p>Clear reproduction steps, the expected result, the actual result, and whether the environment is single-player or multiplayer.</p>
  </li>
</ul>
<p>Once it is confirmed not to be a configuration issue, submit a report on the <a href="https://github.com/zhenshiz/ViScriptShop/issues"
    target="_blank" rel="noopener noreferrer nofollow">project issue tracker</a>.</p>
<h2 id="back-to-the-documentation-home" data-toc-id="back-to-the-documentation-home">Back to the Documentation Home</h2>
<p>Return to <a href="?file=&quot;00-Introduction.md&quot;">Introduction</a>, or redo a minimal config test following <a
    href="?file=&quot;10-Quick-Start.Your-First-Shop.md&quot;">Your First Shop</a>.</p>