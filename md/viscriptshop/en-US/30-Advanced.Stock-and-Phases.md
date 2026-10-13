<h1 id="stock-and-phases" data-toc-id="stock-and-phases">Stock and Phases</h1>
<p>Stock controls how many more units can be sold, while phases control which players can see or buy them. Both are evaluated server-side, making them ideal for limited-quantity items, chapter shops, reputation gates, and member-only areas. Before starting, complete <a href="?file=&quot;21-Editor-Tutorial.Items-and-Trades.md&quot;">Items and Trades</a>.</p>
<h2 id="what-stock-values-mean" data-toc-id="what-stock-values-mean">What Stock Values Mean</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Item stock</th>
      <th>Actual effect</th>
      <th>Typical use</th>
    </tr>
    <tr>
      <td>Below 0</td>
      <td>Unlimited stock; never decreases on a sale</td>
      <td>Everyday base materials</td>
    </tr>
    <tr>
      <td>Equal to 0</td>
      <td>Sold out; players cannot buy any more</td>
      <td>Temporarily delisted but configuration kept</td>
    </tr>
    <tr>
      <td>Above 0</td>
      <td>Decreases by 1 per successful sale</td>
      <td>Daily limits or rare items</td>
    </tr>
  </tbody>
</table>
<p>Stock counts the units of the item sold, not the number of items returned. For example, if one unit returns 16 arrows, a stock of 10 still allows at most 10 units to be bought, yielding 160 arrows in total.</p>
<h2 id="configuring-a-limited-stock-item" data-toc-id="configuring-a-limited-stock-item">Configuring a Limited-Stock Item</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Fill in the initial stock</div>
    <div data-type="admonition-content">
      <p>On the item editing page, change "Item stock" from <code>-1</code> to the desired number of units, e.g. <code>100</code>.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Choose a sharing mode</div>
    <div data-type="admonition-content">
      <p>Set <code>isPersonalStock</code> in the server configuration. When it stays <code>false</code>, the whole server consumes the same 100 units; when set to <code>true</code>, each player has their own 100 units.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Upload and test</div>
    <div data-type="admonition-content">
      <p>After uploading and reloading the shop, buy one unit with a regular player and confirm the stock on the card decreases immediately. On multiplayer servers, use a second account to verify that shared or personal stock behaves as expected.</p>
    </div>
  </div>
</div>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">The server is the authoritative source</div>
  <div data-type="admonition-content">
    <p>The stock shown on the client is only a snapshot of the server state. When several players buy at the same time, the server checks stock again; on failure it syncs the latest stock back to the player, so it never oversells because of a stale UI number.</p>
  </div>
</div>
<h2 id="file-stock-vs-runtime-stock" data-toc-id="file-stock-vs-runtime-stock">File Stock vs Runtime Stock</h2>
<p>The <code>.shop</code> file stores the initial stock as designed, while <code>shop_info</code> in the world save stores the stock after the shop has been running. Once a shop has been loaded for the first time, the runtime data in the world save takes precedence.</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Operation</th>
      <th>Modifies the .shop file</th>
      <th>Modifies current world stock</th>
    </tr>
    <tr>
      <td>Editor save or upload</td>
      <td>Yes</td>
      <td>Only reinitialized on a subsequent reload</td>
    </tr>
    <tr>
      <td>/viscript_shop setStock</td>
      <td>No</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td>/viscript_shop addStock</td>
      <td>No</td>
      <td>Yes; adds to the existing remaining stock without resetting units already sold</td>
    </tr>
    <tr>
      <td>/viscript_shop remove</td>
      <td>No</td>
      <td>Removes the specified item from the world records</td>
    </tr>
    <tr>
      <td>/viscript_shop reload</td>
      <td>No</td>
      <td>Clears loaded shops and their runtime stock</td>
    </tr>
  </tbody>
</table>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Reloading resets runtime stock</div>
  <div data-type="admonition-content">
    <p>Performing a reload, or uploading with "Auto-reload shop after upload" enabled, clears the shop's current runtime stock. It will be re-initialized from the file stock the next time it opens. On production servers, back up first and schedule a maintenance window before updating items.</p>
  </div>
</div>
<h2 id="what-the-phase-system-can-do" data-toc-id="what-the-phase-system-can-do">What the Phase System Can Do</h2>
<p>Categories and items each have their own phase system. When a category fails the check, players cannot enter the whole category; when an item fails, only that item is restricted. Turning off the phase toggle at a given level means no gate at that level; anything already configured is kept, so it is easy to disable temporarily and restore later.</p>
<h2 id="creating-your-first-phase-gate" data-toc-id="creating-your-first-phase-gate">Creating Your First Phase Gate</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Add a phase to the test player</div>
    <div data-type="admonition-content">
      <pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop stage add chapter_2</code></pre>
      <p>This command modifies the player who executes it. Run it as the player, or target them with <code>execute as</code> as the server owner.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Enable the category or item phase</div>
    <div data-type="admonition-content">
      <p>Select the category or item in the editor, open "Phase System", and create a new phase group.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Fill in the phase identifier</div>
    <div data-type="admonition-content">
      <p>Add <code>chapter_2</code> to the group and set the group mode to "Has All". Save, upload, and reload the shop.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Run positive and negative tests</div>
    <div data-type="admonition-content">
      <p>A player who has the phase should be able to enter or buy; then run <code>/viscript_shop stage remove chapter_2</code>, reopen the shop, and confirm the content is locked or hidden.</p>
    </div>
  </div>
</div>
<h2 id="logic-within-and-between-groups" data-toc-id="logic-within-and-between-groups">Logic Within and Between Groups</h2>
<p>Each phase group first evaluates the identifiers within it, then an outer mode combines multiple groups. A condition that is enabled but contains no valid phase groups is treated as placing no restriction on players.</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Mode</th>
      <th>Meaning within a group</th>
      <th>Meaning between groups</th>
    </tr>
    <tr>
      <td>AND</td>
      <td>The player has all phases in the group</td>
      <td>All phase groups pass</td>
    </tr>
    <tr>
      <td>OR</td>
      <td>The player has any phase in the group</td>
      <td>At least one phase group passes</td>
    </tr>
    <tr>
      <td>NOT</td>
      <td>The player does not have all phases in the group at once</td>
      <td>Not all phase groups pass simultaneously</td>
    </tr>
    <tr>
      <td>NOR</td>
      <td>The player has none of the phases in the group</td>
      <td>All phase groups fail</td>
    </tr>
  </tbody>
</table>
<h2 id="common-phase-templates" data-toc-id="common-phase-templates">Common Phase Templates</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Design goal</th>
      <th>Recommended setup</th>
      <th>Example</th>
    </tr>
    <tr>
      <td>Unlock after completing a chapter</td>
      <td>One AND group</td>
      <td>chapter_2</td>
    </tr>
    <tr>
      <td>Either of two factions works</td>
      <td>One OR group</td>
      <td>faction_red, faction_blue</td>
    </tr>
    <tr>
      <td>Two quest lines must both be completed</td>
      <td>One AND group</td>
      <td>quest_mine, quest_magic</td>
    </tr>
    <tr>
      <td>Available only to non-VIP players</td>
      <td>One NOR group</td>
      <td>vip</td>
    </tr>
    <tr>
      <td>Chapter gate plus any one reputation</td>
      <td>AND between groups; chapter group AND, reputation group OR</td>
      <td>chapter_2; rep_a or rep_b</td>
    </tr>
  </tbody>
</table>
<h2 id="how-locked-content-is-displayed" data-toc-id="how-locked-content-is-displayed">How Locked Content Is Displayed</h2>
<p>The shop-level "Locked content display" setting controls both categories and items:</p>
<ul>
  <li><p><strong>Show locked content:</strong> locked categories have their name and icon dimmed to about 70% brightness with no extra lock icon; hovering shows only the unlock conditions without changing the visual state; locked items show a lock icon and no editable quantity controls.</p></li>
  <li><p><strong>Hide locked content:</strong> categories and items whose phase conditions are not met do not appear in the player interface at all.</p></li>
</ul>
<p>The lock tooltip can contain multiple text entries. Each entry is displayed in the player's language if it is a valid translation key; otherwise it is shown as-is. When left empty, the mod automatically generates a condition description from the phase groups.</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Do not rely on UI hiding alone to protect items</div>
  <div data-type="admonition-content">
    <p>Phase eligibility, stock, and cost are all re-verified server-side. Even if the client UI is outdated or modified, server-side purchases cannot be bypassed. Server owners should still complete pre-release testing with regular player permissions.</p>
  </div>
</div>
<h2 id="next-steps" data-toc-id="next-steps">Next Steps</h2>
<p>For discounts, gifts with purchase, or coupons, continue with <a href="?file=&quot;31-Advanced.Promotions.md&quot;">Promotions</a>. For changing stock or phases during operation, see <a href="?file=&quot;40-Server.Commands-and-Config.md&quot;">Commands and Config</a>.</p>
