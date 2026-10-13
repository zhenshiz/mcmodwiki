<h1 id="promotions" data-toc-id="promotions">Promotions</h1>
<p>The promotion system supports storewide discounts, category markups, per-item specials, limited-time events, phase-exclusive prices, coupon discounts, and gifts with purchase. All prices are recalculated server-side; the client only displays the result.</p>
<h2 id="understanding-the-three-levels" data-toc-id="understanding-the-three-levels">Understanding the Three Levels</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Level</th>
      <th>Rule scope</th>
      <th>Typical use</th>
    </tr>
    <tr>
      <td>Shop</td>
      <td>All matching items in the entire shop</td>
      <td>10% off everything for an anniversary</td>
    </tr>
    <tr>
      <td>Category</td>
      <td>Items in the current category</td>
      <td>Extra 20% off the minerals category</td>
    </tr>
    <tr>
      <td>Item</td>
      <td>The single current item</td>
      <td>Half price on a specific apple</td>
    </tr>
  </tbody>
</table>
<p>Once promotions are enabled at a level, you can decide whether it inherits rules from the level above. A category with promotions disabled at its own level still inherits enabled shop rules; an item with promotions disabled at its own level still inherits enabled rules from higher levels.</p>
<ul>
  <li><p>When a category enables promotions and turns off "Inherit", it cuts off shop rules and uses only its own rules.</p></li>
  <li><p>When an item enables promotions and turns off "Inherit", it cuts off shop and category rules and uses only its own rules.</p></li>
  <li><p>When multiple levels are involved, the merge mode closest to the item that is not "Inherit" determines how percentages are ultimately combined.</p></li>
</ul>
<h2 id="creating-a-storewide-10-discount" data-toc-id="creating-a-storewide-10-discount">Creating a Storewide 10% Discount</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Enable shop promotions</div>
    <div data-type="admonition-content">
      <p>In the editor, switch to "Shop" on the right, open the storewide promotion system, and keep the merge mode at "Add".</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Create a discount rule</div>
    <div data-type="admonition-content">
      <p>Set the rule type to "Discount", the direction to "Decrease", and the percentage to <code>10</code>.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Choose targets</div>
    <div data-type="admonition-content">
      <p>To affect all trade costs at once, choose "All". To affect only barter cost A or B, or currency buying or selling, choose a more specific target.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Leave conditions empty and test</div>
    <div data-type="admonition-content">
      <p>Without conditions, the rule always applies. After uploading and reloading, check barter trades, currency purchases, and currency sales items in turn to confirm the discount direction behaves as expected.</p>
    </div>
  </div>
</div>
<h2 id="discount-direction-and-targets" data-toc-id="discount-direction-and-targets">Discount Direction and Targets</h2>
<p>"Decrease" always means more favorable to the player: for "Buy" it reduces what the player pays, for "Sell" it increases the currency the player receives; "Increase" is the opposite.</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Target</th>
      <th>What it affects</th>
      <th>Available at</th>
    </tr>
    <tr>
      <td>All</td>
      <td>Every adjustable price in the scope</td>
      <td>Shop, category, item</td>
    </tr>
    <tr>
      <td>Item A</td>
      <td>Barter cost A</td>
      <td>Shop, category, item</td>
    </tr>
    <tr>
      <td>Item B</td>
      <td>Barter cost B</td>
      <td>Shop, category, item</td>
    </tr>
    <tr>
      <td>Currency</td>
      <td>All currency costs and rewards</td>
      <td>Shop level</td>
    </tr>
    <tr>
      <td>Currency cost</td>
      <td>Virtual currency paid when buying</td>
      <td>Shop, category, item</td>
    </tr>
    <tr>
      <td>Currency reward</td>
      <td>Virtual currency gained when selling</td>
      <td>Shop, category, item</td>
    </tr>
    <tr>
      <td>Sell item cost</td>
      <td>Number of items the player hands over when selling</td>
      <td>Shop, category, item</td>
    </tr>
  </tbody>
</table>
<h2 id="reading-the-price-tooltip" data-toc-id="reading-the-price-tooltip">Reading the Price Tooltip</h2>
<p>Once prices are adjusted by discounts, the price tags on items and in the cart show the change directly. Hover over a price to see the full details:</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">Original 1,234,567 → Now 617,283
Change: -50%
Member discount (from item): -50%</code></pre>
<ul>
  <li><p><strong>Original → Now:</strong> the full values before and after adjustment, with thousands separators to avoid misreading large numbers after compact abbreviation.</p></li>
  <li><p><strong>Increase / decrease:</strong> the overall change after all active rules are merged. Positive values (increase) are shown in red, negative values (decrease) in green, and 0% in white.</p></li>
  <li><p><strong>Rule breakdown:</strong> one line per active rule, in the format "rule name (from X): ±percentage". The rule name comes from the rule's "Rule name" field; if left empty, "Promotion rule" is shown.</p></li>
</ul>
<h3 id="customizing-the-source-text" data-toc-id="customizing-the-source-text">Customizing the Source Text</h3>
<p>Discount rules provide a "Source text (optional)" field that replaces the "from X" part in the breakdown line's parentheses; by default it shows the level the rule belongs to (shop/category/item).</p>
<ul>
  <li><p>When filled in, the entered text is displayed; e.g. after entering "Anniversary event", the breakdown line becomes "Member discount (from Anniversary event): -10%".</p></li>
  <li><p>Translation keys are supported: entering a key such as <code>mymod.promotion.anniversary</code> displays the corresponding translation from the client's language file; if no matching entry exists, the raw text is shown. Rule names also support translation keys.</p></li>
  <li><p>Leave it empty to keep the default, which helps players tell which level of configuration a rule comes from.</p></li>
</ul>
<h2 id="rounding-of-item-prices" data-toc-id="rounding-of-item-prices">Rounding of Item Prices</h2>
<p>Item costs have the percentage calculated separately for each unit of the trade, and results are rounded down. When the original cost is not 0, the discounted item quantity is still at least 1; virtual currency prices are allowed to drop to 0.</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Small quantities are insensitive to discounts</div>
  <div data-type="admonition-content">
    <p>1 diamond at 10% off still costs 1 diamond. If you want players to clearly feel the discount, change the trade base to "10 cost for 10 output", or switch to virtual currency pricing.</p>
  </div>
</div>
<h2 id="how-multiple-discounts-combine" data-toc-id="how-multiple-discounts-combine">How Multiple Discounts Combine</h2>
<p>Suppose the same price receives both a "decrease 20%" and a "decrease 10%" rule, with an original price of 100:</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Merge mode</th>
      <th>Result</th>
      <th>Notes</th>
    </tr>
    <tr>
      <td>Add</td>
      <td>70</td>
      <td>The two reductions are added directly</td>
    </tr>
    <tr>
      <td>Multiply</td>
      <td>72</td>
      <td>Multiply by 0.8 first, then by 0.9</td>
    </tr>
    <tr>
      <td>Max</td>
      <td>90</td>
      <td>Picks the larger signed ratio, -10%</td>
    </tr>
    <tr>
      <td>Min</td>
      <td>80</td>
      <td>Picks the smaller signed ratio, -20%</td>
    </tr>
  </tbody>
</table>
<p>"Max" and "Min" compare signed ratios, so in pure discount scenarios the result may be counterintuitive compared with everyday language. Check the final price in the player interface before going live; do not rely on rule names alone.</p>
<h2 id="adding-conditions-to-rules" data-toc-id="adding-conditions-to-rules">Adding Conditions to Rules</h2>
<p>All conditions within the same rule must be satisfied simultaneously. Five condition types are currently built in:</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Condition</th>
      <th>Configurable content</th>
      <th>Example use</th>
    </tr>
    <tr>
      <td>Phase</td>
      <td>Phases the player must have</td>
      <td>Discounts after completing a chapter</td>
    </tr>
    <tr>
      <td>Status effect</td>
      <td>Effect ID and minimum level 1–256</td>
      <td>Discounts while an event potion is active</td>
    </tr>
    <tr>
      <td>XP level</td>
      <td>Minimum player experience level</td>
      <td>High-level member pricing</td>
    </tr>
    <tr>
      <td>Game time</td>
      <td>HH:mm start and end times, inclusive</td>
      <td>Night sale; may cross midnight</td>
    </tr>
    <tr>
      <td>Player item</td>
      <td>Item, count, component matching, whether consumed</td>
      <td>Membership card or one-time coupon</td>
    </tr>
  </tbody>
</table>
<p>Time ranges may cross midnight, e.g. <code>22:00</code> to <code>02:00</code>. The player-item condition only checks the player's inventory, hotbar, offhand, and armor slots; it does not check the ender chest or external storage.</p>
<h2 id="making-membership-cards-and-coupons" data-toc-id="making-membership-cards-and-coupons">Making Membership Cards and Coupons</h2>
<ul>
  <li><p><strong>Reusable membership card:</strong> add a "Player item" condition, select the card item, and turn off "Consume". Players only need to carry it with them.</p></li>
  <li><p><strong>One-time coupon:</strong> use the same condition with "Consume" turned on. The required quantity scales with units purchased; buying 3 units consumes 3 times the condition quantity.</p></li>
  <li><p><strong>Safety:</strong> a rule consumes its condition items only once, even if it affects multiple price slots at the same time. If a later stock or cost check fails, the coupon is not deducted.</p></li>
</ul>
<h2 id="setting-up-gifts-with-purchase" data-toc-id="setting-up-gifts-with-purchase">Setting Up Gifts with Purchase</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Create a gift rule</div>
    <div data-type="admonition-content">
      <p>In the promotion area of the desired shop, category, or item, add a rule and change its type to "Gift with purchase".</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Fill in the threshold and gift quantity</div>
    <div data-type="admonition-content">
      <p>For example, a threshold of <code>3</code> and a gift quantity of <code>1</code> means every 3 units purchased triggers 1 gift set.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Choose the gift</div>
    <div data-type="admonition-content">
      <p>When the gift is left empty, the current item's return items are granted as the bonus; when an item is specified, that item is granted instead.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Verify the grouping result</div>
    <div data-type="admonition-content">
      <p>Units purchased are divided by the threshold and rounded down. In the example above, buying 2 units gives nothing, 3–5 units gives 1 set, and 6 units gives 2 sets.</p>
    </div>
  </div>
</div>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">An item ends up with only one gift rule</div>
  <div data-type="admonition-content">
    <p>Gifts do not stack the way discounts do. The mod picks the first valid rule in order of item, category, then shop level; within the same level it also takes only the first valid rule. Put the most specific and most important events at the level closest to the item.</p>
  </div>
</div>
<h2 id="promotion-launch-checklist" data-toc-id="promotion-launch-checklist">Promotion Launch Checklist</h2>
<ul>
  <li><p>Test with the minimum quantity, one below the threshold, exactly at the threshold, and multiple thresholds.</p></li>
  <li><p>Test both currency buying and selling, confirming that "Decrease" was not mistaken for reducing sell income.</p></li>
  <li><p>Test players who fail the conditions, barely meet them, and lack enough condition items.</p></li>
  <li><p>Check item rounding after discounts, stock consumption, coupon consumption, and gift quantities.</p></li>
  <li><p>Hover over the final price and verify "Original → Now", the increase/decrease magnitude and color direction, and the source text in the rule breakdown.</p></li>
  <li><p>After editing rules during a promotion, reopen the shop to make sure players receive the latest server data.</p></li>
</ul>
<h2 id="continuing-shop-management" data-toc-id="continuing-shop-management">Continuing Shop Management</h2>
<p>Server commands, the FTB sidebar entry, and configuration files are covered in <a href="?file=&quot;40-Server.Commands-and-Config.md&quot;">Commands and Config</a>.</p>
