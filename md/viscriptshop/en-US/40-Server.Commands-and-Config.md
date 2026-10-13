<h1 id="commands-and-config" data-toc-id="commands-and-config">Commands and Config</h1>
<p>This page is for modpack authors and server administrators, covering all built-in commands, configuration files, the FTB sidebar entry, and the safe update workflow. For everyday player operations, see the <a href="?file=&quot;11-Quick-Start.Player-Buying-Guide.md&quot;">Player Buying Guide</a>.</p>
<h2 id="permission-overview" data-toc-id="permission-overview">Permission Overview</h2>
<p>The <code>/viscript_shop</code> root command requires permission level 2, while the editor subcommand requires level 4. The open-shop, open-editor, and modify-own-stage subcommands can only be executed by player entities, not directly from the server console.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Never expose the whole root command to regular players</div>
  <div data-type="admonition-content">
    <p>The root command also includes reload, stock, currency, and stage management capabilities. To give players a shop entry point, use an FTB Library sidebar button, a fixed command executed as a quest reward, or strictly scoped permission rules.</p>
  </div>
</div>
<h2 id="shop-and-editor-commands" data-toc-id="shop-and-editor-commands">Shop and Editor Commands</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Command</th>
      <th>Effect</th>
      <th>Important Notes</th>
    </tr>
    <tr>
      <td>/viscript_shop editor [shop]</td>
      <td>Opens an empty editor, or loads the specified server-side shop</td>
      <td>Requires level 4; players only</td>
    </tr>
    <tr>
      <td>/viscript_shop open</td>
      <td>Opens the quick shop selector</td>
      <td>Only lists shops that allow quick opening</td>
    </tr>
    <tr>
      <td>/viscript_shop open &lt;shop&gt; [categoryId] [merchantId]</td>
      <td>Opens the specified shop, optionally jumping straight to a category and item</td>
      <td>The path does not include the .shop suffix; players only</td>
    </tr>
    <tr>
      <td>/viscript_shop setQuickOpening &lt;shop&gt; &lt;true|false&gt;</td>
      <td>Sets whether the shop appears in the quick selector</td>
      <td>Modifies shop data loaded in the current world</td>
    </tr>
    <tr>
      <td>/viscript_shop reload [shop]</td>
      <td>Reloads all shops or a specific shop</td>
      <td>Clears the corresponding runtime stock</td>
    </tr>
  </tbody>
</table>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop open village_market
/viscript_shop open village_market ores
/viscript_shop open village_market ores iron_ingot
/viscript_shop setQuickOpening village_market true
/viscript_shop reload village_market</code></pre>
<p>If the file is located at <code>ldlib2/assets/viscript_shop/shop/events/summer.shop</code>, the shop path is <code>events/summer</code>. When typing commands, use auto-completion to check paths, category IDs, and item IDs.</p>
<h2 id="stock-and-removal-commands" data-toc-id="stock-and-removal-commands">Stock and Removal Commands</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Command</th>
      <th>Effect</th>
    </tr>
    <tr>
      <td>/viscript_shop setStock &lt;shop&gt; &lt;categoryId&gt; &lt;merchantId&gt; &lt;stock&gt;</td>
      <td>Immediately sets the stock of the specified item in the current world</td>
    </tr>
    <tr>
      <td>/viscript_shop addStock &lt;shop&gt; &lt;categoryId&gt; &lt;merchantId&gt; &lt;amount&gt;</td>
      <td>Adds a positive integer amount to the specified item's current remaining stock</td>
    </tr>
    <tr>
      <td>/viscript_shop remove &lt;shop&gt; &lt;categoryId&gt; &lt;merchantId&gt;</td>
      <td>Removes the specified item from the shop data loaded in the current world</td>
    </tr>
  </tbody>
</table>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop setStock village_market ores iron_ingot 500
/viscript_shop addStock village_market ores iron_ingot 100
/viscript_shop setStock village_market ores weekly_crate 0
/viscript_shop remove village_market ores retired_offer</code></pre>
<p><code>addStock</code> preserves the quantity already sold and only adds the specified amount to the current remaining stock. In shared-stock mode it increases the global remaining stock; in per-player stock mode it increases the remaining stock of all established players and also raises the base stock for players without records yet. Unlimited stock stays unlimited, and finite stock is capped at 2147483647.</p>
<p>These commands do not rewrite the <code>.shop</code> files on disk. When the shop is reloaded later, items and initial stock may be restored from the files. For permanent changes, also update the source file and re-upload it.</p>
<h2 id="stage-commands" data-toc-id="stage-commands">Stage Commands</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop stage add &lt;flag&gt;
/viscript_shop stage remove &lt;flag&gt;</code></pre>
<p>These two commands only affect the executor. To modify other players, admins can have the target player run a fixed command, or use the vanilla <code>execute as</code>:</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/execute as Steve run viscript_shop stage add chapter_2</code></pre>
<p>Stage flags are case-sensitive; it is recommended to consistently use lowercase letters, digits, and underscores, such as <code>chapter_2</code> and <code>reputation_mage</code>. For the full configuration method, see <a href="?file=&quot;30-Advanced.Stock-and-Phases.md&quot;">Stock and Phases</a>.</p>
<h2 id="virtual-currency-commands" data-toc-id="virtual-currency-commands">Virtual Currency Commands</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Command</th>
      <th>Effect</th>
    </tr>
    <tr>
      <td>/viscript_shop money add &lt;player&gt; &lt;money&gt;</td>
      <td>Adds to the specified player's balance</td>
    </tr>
    <tr>
      <td>/viscript_shop money remove &lt;player&gt; &lt;money&gt;</td>
      <td>Deducts from the balance; the actual deduction never exceeds the current balance</td>
    </tr>
    <tr>
      <td>/viscript_shop money get &lt;player&gt;</td>
      <td>Queries a player's balance</td>
    </tr>
    <tr>
      <td>/viscript_shop money pay &lt;player1&gt; &lt;player2&gt; &lt;money&gt;</td>
      <td>Transfers from player 1 to player 2; the actual amount never exceeds player 1's balance</td>
    </tr>
  </tbody>
</table>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop money add Steve 1000
/viscript_shop money get Steve
/viscript_shop money pay Steve Alex 25.5</code></pre>
<h2 id="common-config-file" data-toc-id="common-config-file">Common Config File</h2>
<p>The common config lives in the <code>[config]</code> section of <code>config/viscript_shop_config.toml</code> and is determined by the server. Some integration options are only generated when the corresponding mod is installed.</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Config Key</th>
      <th>Default</th>
      <th>Purpose</th>
    </tr>
    <tr>
      <td>showFtbLibraryButton</td>
      <td>false</td>
      <td>After FTB Library is installed, whether to show the shop sidebar button</td>
    </tr>
    <tr>
      <td>ftbDefaultShop</td>
      <td>Empty string</td>
      <td>Shop path opened directly by the FTB button; leave empty to open the shop selector</td>
    </tr>
    <tr>
      <td>isReplaceMoneyToMagicCoin</td>
      <td>false</td>
      <td>After Magic Coins is installed, whether to replace this mod's virtual currency with its balance</td>
    </tr>
    <tr>
      <td>enableLegacyDataMigration</td>
      <td>true</td>
      <td>Whether to migrate legacy .shop files; can be turned off after confirming everything is updated, to reduce migration overhead</td>
    </tr>
    <tr>
      <td>maxShopUiGiveItemsPerPurchase</td>
      <td>-1</td>
      <td>Maximum number of items granted per purchase in the shop UI; -1 means unlimited</td>
    </tr>
    <tr>
      <td>isPersonalStock</td>
      <td>false</td>
      <td>false means server-wide shared stock, true means independent stock per player</td>
    </tr>
  </tbody>
</table>
<pre language="toml" isclosed="false"><code class="language-toml">[config]
showFtbLibraryButton = true
ftbDefaultShop = "village_market"
enableLegacyDataMigration = true
maxShopUiGiveItemsPerPurchase = 4096
isPersonalStock = false</code></pre>
<p><code>ftbDefaultShop</code> only takes the shop path that follows <code>/viscript_shop open</code> — do not include the command itself, and do not add a <code>.shop</code> suffix. When the path is empty, the selector opens normally; when the path is invalid, an error is shown to the player and it falls back to the selector.</p>
<h2 id="client-theme-config" data-toc-id="client-theme-config">Client Theme Config</h2>
<p>The client config lives in the <code>[client]</code> section of <code>config/viscript_shop_client.toml</code> and can be chosen independently by each player. The theme applies to the main shop, the quick shop selector, success notifications, and other screens.</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>shopUiTheme Value</th>
      <th>UI Theme</th>
    </tr>
    <tr>
      <td>GLASS_DARK</td>
      <td>Dark glass, the default theme</td>
    </tr>
    <tr>
      <td>GRAY_CAT_WORKSHOP</td>
      <td>Gray Cat Workshop</td>
    </tr>
  </tbody>
</table>
<pre language="toml" isclosed="false"><code class="language-toml">[client]
shopUiTheme = "GLASS_DARK"</code></pre>
<p>After changing the theme, close and reopen the relevant screens so that all widgets are recreated with the new theme.</p>
<h2 id="ftb-sidebar-entry-tutorial" data-toc-id="ftb-sidebar-entry-tutorial">FTB Sidebar Entry Tutorial</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Install FTB Library</div>
    <div data-type="admonition-content">
      <p>Make sure both the client and the server have an FTB Library version matching the current Minecraft version.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Enable the button</div>
    <div data-type="admonition-content">
      <p>Set <code>showFtbLibraryButton</code> to <code>true</code> in the common config.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Choose the opening behavior</div>
    <div data-type="admonition-content">
      <p>When <code>ftbDefaultShop</code> is empty, the quick selector is shown; when set to a path such as <code>village_market</code>, the button opens that shop directly.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Verify the quick list</div>
    <div data-type="admonition-content">
      <p>If you use the selector, make sure the shops you want to show have "allow quick opening" enabled in the editor, or enable it with the <code>setQuickOpening</code> command.</p>
    </div>
  </div>
</div>
<h2 id="safe-update-workflow" data-toc-id="safe-update-workflow">Safe Update Workflow</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Back up files and worlds</div>
    <div data-type="admonition-content">
      <p>Back up <code>ldlib2/assets/viscript_shop/shop</code> as well as the world saves. The current running stock is stored in world data, so keep both.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Edit in copies</div>
    <div data-type="admonition-content">
      <p>Do not let multiple admins overwrite the same shop at the same time. Use Git or clear file naming to keep pre-release versions.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Decide whether to keep stock</div>
    <div data-type="admonition-content">
      <p>If you need to keep operational stock, turn off "auto-reload shop after upload" in the editor before uploading; only run the reload when you really want to reset to file stock.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Validate with a regular account</div>
    <div data-type="admonition-content">
      <p>Check stage locks, discounts, stock, external containers, grant limits, and settlement commands. After a purchase, verify the balance, the items, and the server logs.</p>
    </div>
  </div>
</div>
<h2 id="related-pages" data-toc-id="related-pages">Related Pages</h2>
<p>For more compatible-mod configuration, see <a href="?file=&quot;50-Mod-Integration.md&quot;">Mod Integration</a>; when shops fail to open or trades misbehave, see <a href="?file=&quot;70-Troubleshooting-and-Maintenance.md&quot;">Troubleshooting and Maintenance</a>.</p>
