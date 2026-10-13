<h1 id="items-and-trades" data-toc-id="items-and-trades">Items and Trades</h1>
<p>The editable fields of an item are determined by the shop type of the category it belongs to. This page creates a barter item, a currency buy item, and a currency sell item, then covers item matching, custom icons, stock, experience, and success commands.</p>
<h2 id="three-common-trade-types" data-toc-id="three-common-trade-types">Three Common Trade Types</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Goal</th>
      <th>Category type</th>
      <th>Key fields</th>
      <th>Example</th>
    </tr>
    <tr>
      <td>Material exchange</td>
      <td>Barter</td>
      <td>Trade item A, Trade item B, Result item</td>
      <td>8 iron ingots plus 1 coal for 1 block of iron</td>
    </tr>
    <tr>
      <td>Player buys</td>
      <td>General currency</td>
      <td>Price, Trade type Buy, Result item</td>
      <td>10◎ buys 1 apple</td>
    </tr>
    <tr>
      <td>Player sells</td>
      <td>General currency</td>
      <td>Price, Trade type Sell, Result item</td>
      <td>Hand over 16 wheat and receive 24◎</td>
    </tr>
  </tbody>
</table>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">What "Result item" means for sell items</div>
  <div data-type="admonition-content">
    <p>When the trade type is "sell", the result item is the item the player must hand over, and the price is the virtual currency the player receives once the trade completes. You can use the arrow directions in the UI to check whether you have configured it backwards.</p>
  </div>
</div>
<h2 id="creating-a-barter-item" data-toc-id="creating-a-barter-item">Creating a Barter Item</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Prepare a category</div>
    <div data-type="admonition-content">
      <p>Select a "barter shop" category, then click "Add item" in the center preview area.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Fill in the cost</div>
    <div data-type="admonition-content">
      <p>Set trade item A to 8 iron ingots and trade item B to 1 coal. You can use just one of A or B, but you cannot leave both empty.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Fill in the output</div>
    <div data-type="admonition-content">
      <p>Set the result item to 1 block of iron. The result item cannot be left empty, otherwise saving or uploading will report an error.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Set the other fields</div>
    <div data-type="admonition-content">
      <p>Give the item a stable ID, e.g. <code>iron_block</code>. For initial testing, keep stock at
        <code>-1</code>, and leave experience and the command list at their defaults.</p>
    </div>
  </div>
</div>
<h2 id="creating-a-currency-buy-or-sell-item" data-toc-id="creating-a-currency-buy-or-sell-item">Creating a Currency Buy or Sell Item</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Prepare a general currency category</div>
    <div data-type="admonition-content">
      <p>Select a "general currency shop" category, then add an item.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Choose the buy/sell direction</div>
    <div data-type="admonition-content">
      <p>Choose "buy" when players pay money for items; choose "sell" when players hand over items for money. The center preview area also offers "Set trade type" to batch-set every item in the current category to buy or sell.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Fill in price and items</div>
    <div data-type="admonition-content">
      <p>The price cannot be negative and may use decimals. For a buy item, the result item is what the player receives; for a sell item, the result item is what the player hands over.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Verify with the arrows</div>
    <div data-type="admonition-content">
      <p>In the preview, confirm that the left side is what the player pays and the right side is what the player receives. "Buy" should show the currency pointing to the item; "sell" should show the item pointing to the currency.</p>
    </div>
  </div>
</div>
<h2 id="common-item-fields" data-toc-id="common-item-fields">Common Item Fields</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Field</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>Item ID</td>
      <td>Auto-generated UUID</td>
      <td>Stable identifier used by stock, direct commands, staging restore, and script references</td>
    </tr>
    <tr>
      <td>Item stock</td>
      <td>-1</td>
      <td>-1 means unlimited, 0 means sold out, and any value above 0 means the number of trades still available</td>
    </tr>
    <tr>
      <td>Result item</td>
      <td>Empty</td>
      <td>The output for buys and the cost for sells; required for every item</td>
    </tr>
    <tr>
      <td>Experience</td>
      <td>0</td>
      <td>Experience points granted per completed trade, not experience levels</td>
    </tr>
    <tr>
      <td>Command list</td>
      <td>Empty</td>
      <td>Executed entry by entry after a successful trade; enter one full command per list entry</td>
    </tr>
    <tr>
      <td>Item promotion settings</td>
      <td>Off</td>
      <td>Even when off, promotions already enabled at higher levels are still inherited</td>
    </tr>
    <tr>
      <td>Phase system</td>
      <td>Off</td>
      <td>Once enabled, you can restrict whether players can purchase the item</td>
    </tr>
  </tbody>
</table>
<h2 id="actual-items-and-display" data-toc-id="actual-items-and-display">Actual Items and Display</h2>
<p>Trade item A, trade item B, and the result item all separate the "actual item" from the "icon display". The actual item participates in counting, validation, deduction, and granting; the display only affects the icon and hover name players see.
</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Render mode</th>
      <th>What is shown</th>
      <th>Changes the trade?</th>
    </tr>
    <tr>
      <td>Follow actual item</td>
      <td>The icon of the actual trade item</td>
      <td>No</td>
    </tr>
    <tr>
      <td>Resource pack image</td>
      <td>The image at the specified resource path with a custom name</td>
      <td>No</td>
    </tr>
    <tr>
      <td>Substitute item render</td>
      <td>The model and components of another item</td>
      <td>No</td>
    </tr>
  </tbody>
</table>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Do not treat substitute icons as trade content</div>
  <div data-type="admonition-content">
    <p>For example, if the actual cost is set to diamonds but an emerald is used as the substitute icon, the server still checks for and deducts diamonds.</p>
  </div>
</div>
<h2 id="component-matching-for-cost-items" data-toc-id="component-matching-for-cost-items">Component Matching for Cost Items</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Comparison mode</th>
      <th>Meaning</th>
      <th>Typical use</th>
    </tr>
    <tr>
      <td>Compare all item components</td>
      <td>The item ID and all components must be identical</td>
      <td>The default strict trade</td>
    </tr>
    <tr>
      <td>Compare only specified item components</td>
      <td>The field list is a whitelist</td>
      <td>Recognize only a specific custom data or name</td>
    </tr>
    <tr>
      <td>Exclude specified item components</td>
      <td>The field list is a blacklist</td>
      <td>Ignore durability differences by excluding minecraft:damage</td>
    </tr>
  </tbody>
</table>
<p>Component matching only exists for barter costs A and B and for promotion conditions that require holding items. Currency sell items are matched using the full data of the result item itself.</p>
<h2 id="stock-experience-and-success-commands" data-toc-id="stock-experience-and-success-commands">Stock, Experience, and Success Commands</h2>
<ul>
  <li>
    <p><strong>Stock:</strong> No matter how many items one entry produces, each increase of 1 in purchase quantity consumes 1 stock.</p>
  </li>
  <li>
    <p><strong>Experience:</strong> The value is the extra experience points granted per entry. Buying 3 entries with 5 filled in for each grants 15 experience points in total.</p>
  </li>
  <li>
    <p><strong>Commands:</strong> Click the <code>+</code>
      on the list to add entries; each entry takes one full command, with no semicolons needed. After a successful trade, commands run with the current player as context, at permission level 2, and with output suppressed.</p>
  </li>
</ul><pre language="plaintext" isclosed="false"><code class="language-plaintext">give @s minecraft:bread 2
effect give @s minecraft:speed 30 0</code></pre>
<h2 id="costs-in-external-containers" data-toc-id="costs-in-external-containers">Costs in External Containers</h2>
<p>Regular item costs and the "hold specified item" discount condition are counted and deducted through the container helpers registered by ViScriptLib.
  Besides the player inventory, with the matching mods installed it can also read Sophisticated Backpacks, the Beyond Dimensions network, Lightman’s Currency
  wallets, plus the extra inventories and the Piggy Bank from Confluence: Otherworld. See <a href="?file=&quot;50-Mod-Integration.md&quot;">Mod Integration</a> for details.</p>
<h2 id="safe-handling-of-missing-items" data-toc-id="safe-handling-of-missing-items">Safe Handling of Missing Items</h2>
<p>If a <code>.shop</code>
  file references items, components, or enchantments the current client cannot resolve, the editor displays them with a barrier placeholder while preserving the original data. Before a forced open, it attempts to create a backup next to the original file.</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Keep the placeholders to keep the original data</div>
  <div data-type="admonition-content">
    <p>Restore the missing mods or data packs first. Replacing a placeholder with another item overwrites the preserved original information. Purchase requests containing missing trade items are rejected by the server.</p>
  </div>
</div>
<h2 id="next-steps" data-toc-id="next-steps">Next Steps</h2>
<p>Once the basic trades are done, use <a href="?file=&quot;30-Advanced.Stock-and-Phases.md&quot;">Stock and Phases</a> to control visibility and supply, then use <a
    href="?file=&quot;31-Advanced.Promotions.md&quot;">Promotions</a> to build events.</p>