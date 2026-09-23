<h1 id="viscriptshop" data-toc-id="viscriptshop">ViScriptShop</h1>
<p>ViScriptShop
  is a visual shop mod for modpack authors and server administrators. It uses a shopping cart to settle multiple items in a single transaction, and supports barter trades, virtual currency buying and selling, stock, phase unlocking, tiered promotions, and integration with multiple mod containers.
</p>
<h2 id="what-problem-does-this-mod-solve" data-toc-id="what-problem-does-this-mod-solve">What problem does this mod solve</h2>
<ul>
  <li>
    <p><strong>Visual shop building:</strong> Create categories and items in-game with the editor, no hand-written NBT required.</p>
  </li>
  <li>
    <p><strong>Unified checkout:</strong> Players can add multiple items across categories to the cart, and the server prices, validates, and settles everything at once.</p>
  </li>
  <li>
    <p><strong>Progression control:</strong> Lock entire categories or individual items with phase flags — ideal for story progression, tech trees, and quest unlocks.</p>
  </li>
  <li>
    <p><strong>Server events:</strong> Set discounts, price increases, sell-income bonuses, and buy-X-get-Y bonuses at the shop, category, or item level.</p>
  </li>
  <li>
    <p><strong>Modpack integration:</strong> Trade items can be read from certain linked backpacks or wallets, and KubeJS lets you hook into quests, NPCs, or custom interfaces.
    </p>
  </li>
</ul>
<h2 id="recommended-reading-order" data-toc-id="recommended-reading-order">Recommended reading order</h2>
<ol>
  <li>
    <p>Building a shop for the first time: follow <a
        href="?file=&quot;10-Quick-Start.Your-First-Shop.md&quot;">Your First Shop</a> to build a test shop that sells diamonds.
    </p>
  </li>
  <li>
    <p>Getting players up to speed: read <a
        href="?file=&quot;11-Quick-Start.Player-Buying-Guide.md&quot;">Player Buying Guide</a> to learn about search, the shopping cart, the staging area, output targets, and virtual currency payment.
    </p>
  </li>
  <li>
    <p>Learning the editor properly: read <a href="?file=&quot;20-Editor-Tutorial.Shops-and-Categories.md&quot;">Shops and Categories</a> and <a
        href="?file=&quot;21-Editor-Tutorial.Items-and-Trades.md&quot;">Items and Trades</a>.</p>
  </li>
  <li>
    <p>Building a full modpack: continue by configuring <a href="?file=&quot;30-Advanced.Stock-and-Phases.md&quot;">Stock and Phases</a>, <a
        href="?file=&quot;31-Advanced.Promotions.md&quot;">Promotions</a>, and <a
        href="?file=&quot;40-Server.Commands-and-Config.md&quot;">Commands and Config</a>.</p>
  </li>
  <li>
    <p>Connecting to the modpack ecosystem: read <a href="?file=&quot;50-Mod-Integration.md&quot;">Mod Integration</a>; if you need scripts or Java
      events, continue with <a href="?file=&quot;60-KubeJS-and-Developers.md&quot;">KubeJS and Developers</a>.</p>
  </li>
  <li>
    <p>When something goes wrong: follow <a
        href="?file=&quot;70-Troubleshooting-and-Maintenance.md&quot;">Troubleshooting and Maintenance</a> to distinguish file, save data, UI, and server-side settlement issues.</p>
  </li>
</ol>
<h2 id="feature-overview" data-toc-id="feature-overview">Feature overview</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>System</th>
      <th>Best suited for</th>
      <th>Key features</th>
    </tr>
    <tr>
      <td>Barter</td>
      <td>Material exchange, quest item turn-in, multi-material crafting</td>
      <td>A single trade can have up to two cost items</td>
    </tr>
    <tr>
      <td>Common currency</td>
      <td>Shop purchases, player selling, economy loops</td>
      <td>Supports decimal prices; income and expenses within the same cart are settled by net amount</td>
    </tr>
    <tr>
      <td>Stock</td>
      <td>Limited items, server-wide rushes, per-player purchase limits</td>
      <td>Supports unlimited, shared, and per-player stock</td>
    </tr>
    <tr>
      <td>Phases</td>
      <td>Story progression, tech trees, reputation, factions</td>
      <td>Both categories and items support multiple groups of AND, OR, NOT, and NOR conditions</td>
    </tr>
    <tr>
      <td>Promotions</td>
      <td>Holiday events, member pricing, night pricing, coupons</td>
      <td>Inheritance and merging across the shop, category, and item levels</td>
    </tr>
  </tbody>
</table>
<h2 id="core-concepts" data-toc-id="core-concepts">Core concepts</h2>
<ul>
  <li>
    <p><strong>Shop path:</strong> The first argument after <code>/viscript_shop open</code>, corresponding to the file path without the <code>.shop</code>
      extension under the server-side <code>ldlib2/assets/viscript_shop/shop</code> directory.</p>
  </li>
  <li>
    <p><strong>Category IDs and item IDs:</strong> The editor generates UUIDs. Commands, scripts, and direct links to a specific item rely on them, so avoid changing them casually after publishing.
    </p>
  </li>
  <li>
    <p><strong>Shop files and save data:</strong> <code>.shop</code>
      files are the source of configuration; once a shop is opened, the server saves the current shop and stock state into the world data.</p>
  </li>
</ul>
<h2 id="safety-and-settlement-principles" data-toc-id="safety-and-settlement-principles">Safety and settlement principles</h2>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">The server has the final say on trade results</div>
  <div data-type="admonition-content">
    <p>The client only submits the category ID, item ID, and purchase quantity. The server re-reads prices, promotions, phases, stock, costs, and outputs; if any condition is not met, the purchase will not complete.</p>
    <p>After a successful trade, the client receives a snapshot of item counts based on the server's actual inventory, and then refreshes the shop UI.</p>
  </div>
</div>
<h2 id="next-steps" data-toc-id="next-steps">Next steps</h2>
<p>If you are a shop author, head straight to <a
    href="?file=&quot;10-Quick-Start.Your-First-Shop.md&quot;">Your First Shop</a>. If you only need to learn how to buy, jump to the <a
    href="?file=&quot;11-Quick-Start.Player-Buying-Guide.md&quot;">Player Buying Guide</a>.</p>