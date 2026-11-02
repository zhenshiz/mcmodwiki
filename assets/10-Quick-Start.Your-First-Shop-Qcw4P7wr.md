<h1 id="create-your-first-shop" data-toc-id="create-your-first-shop">Create your first shop</h1>
<p>This tutorial walks you through creating a minimal, working general-currency shop in-game: players pay 10◎ to buy 1 diamond. When you are done, you will have mastered the full loop of "open the editor → create a shop → add a category → add an item → upload → test".</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Prerequisites</div>
  <div data-type="admonition-content">
    <p>You need a world with ViScriptShop properly loaded and a player with permission level 4. Uploading a shop file also re-checks this permission on the server side.</p>
  </div>
</div>
<h2 id="values-to-fill-in" data-toc-id="values-to-fill-in">Values to fill in</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Location</th>
      <th>Field</th>
      <th>Tutorial value</th>
    </tr>
    <tr>
      <td>Shop</td>
      <td>Shop name</td>
      <td>Tutorial Shop</td>
    </tr>
    <tr>
      <td>Shop</td>
      <td>Allow quick open</td>
      <td>Enabled</td>
    </tr>
    <tr>
      <td>Category</td>
      <td>Category name</td>
      <td>Basic Resources</td>
    </tr>
    <tr>
      <td>Category</td>
      <td>Shop type</td>
      <td>General-currency shop</td>
    </tr>
    <tr>
      <td>Item</td>
      <td>Price</td>
      <td>10</td>
    </tr>
    <tr>
      <td>Item</td>
      <td>Trade type</td>
      <td>Buy</td>
    </tr>
    <tr>
      <td>Item</td>
      <td>Result item</td>
      <td>1 diamond</td>
    </tr>
    <tr>
      <td>Item</td>
      <td>Item stock</td>
      <td>-1</td>
    </tr>
    <tr>
      <td>Upload</td>
      <td>File name</td>
      <td>tutorial_shop</td>
    </tr>
  </tbody>
</table>
<h2 id="steps" data-toc-id="steps">Steps</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Open the editor</div>
    <div data-type="admonition-content">
      <p>In-game, type <code>/viscript_shop editor</code>. If the interface does not open, first confirm that you have the server's highest admin permission.
      </p><img
        src="/md/media/viscriptshop-image-213dcca8780e516a.png"
        alt="Open the editor screenshot">
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Create a new shop file</div>
    <div data-type="admonition-content">
      <p>In the editor, choose <code>File → New → Shop file</code>. In the current version, the <code>.shop</code>
        file is used for both editing and running, so you do not need to export a separate project file.</p><img
        src="/md/media/viscriptshop-image-90bfd4f1be6273f3.png"
        alt="Create a new shop file screenshot">
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Fill in the shop properties</div>
    <div data-type="admonition-content">
      <p>The "Edit" panel on the right shows the shop-level fields by default. Set the shop name to
        <code>Tutorial Shop</code> and enable "Allow quick open". Leave the promotion and locked-content display options at their defaults for now.</p><img
        src="/md/media/viscriptshop-image-ce8004cdb7b5375e.png"
        alt="Fill in the shop properties screenshot">
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Add a category</div>
    <div data-type="admonition-content">
      <p>Click the <code>+</code> at the bottom of the category list on the left. With the new category selected, change its name to
        <code>Basic Resources</code>, set the shop type to "General-currency shop", keep the icon type as "Item texture", and pick an easily recognizable item.</p><img
        src="/md/media/viscriptshop-image-8141a70ff3a783d2.png"
        alt="Add a category screenshot">
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Add an item</div>
    <div data-type="admonition-content">
      <p>In the shop preview area in the middle, click "Add item". With the new item selected, set the price to <code>10</code>, choose "Buy" as the trade type, set the result item to 1
        diamond, and leave the stock at <code>-1</code>.</p><img
        src="/md/media/viscriptshop-image-4ccdd57bf01acfc3.png"
        alt="Add an item screenshot">
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Upload to the server</div>
    <div data-type="admonition-content">
      <p>Choose <code>Upload → Upload shop file</code> and enter <code>tutorial_shop</code> as the file name. Do not type the
        <code>.shop</code> extension manually. Once you receive the success notification saying the shop has been reloaded, the data is ready to be tested right away.</p><img
        src="/md/media/viscriptshop-image-dc26bcb9f15c6c88.png"
        alt="Upload to the server screenshot">
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Prepare a test balance</div>
    <div data-type="admonition-content">
      <p>Close the editor and run <code>/viscript_shop money add @s 100</code>. This adds 100◎ of
        test balance to the current player.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Open the shop and buy</div>
    <div data-type="admonition-content">
      <p>Run <code>/viscript_shop open tutorial_shop</code>. Click
        <code>+</code> to the right of the diamond item, confirm that the cart shows 1 diamond and the cost shows 10◎, then click "Buy".</p><img
        src="/md/media/viscriptshop-image-f3ae60fa0f98d7ff.png"
        alt="Open the shop and buy screenshot">
    </div>
  </div>
</div>
<h2 id="how-to-verify-success" data-toc-id="how-to-verify-success">How to verify success</h2>
<ul data-type="taskList">
  <li data-checked="false" data-type="taskItem"><label><input
        type="checkbox"><span></span></label>
    <div>
      <p>The shop title shows "Tutorial Shop".</p>
    </div>
  </li>
  <li data-checked="false" data-type="taskItem"><label><input
        type="checkbox"><span></span></label>
    <div>
      <p>The "Basic Resources" category is visible on the left.</p>
    </div>
  </li>
  <li data-checked="false" data-type="taskItem"><label><input
        type="checkbox"><span></span></label>
    <div>
      <p>The item in the middle shows the trade of 10◎ for 1 diamond.</p>
    </div>
  </li>
  <li data-checked="false" data-type="taskItem"><label><input
        type="checkbox"><span></span></label>
    <div>
      <p>After the trade, you get 1 diamond in your inventory and the balance drops from 100◎ to 90◎.</p>
    </div>
  </li>
  <li data-checked="false" data-type="taskItem"><label><input
        type="checkbox"><span></span></label>
    <div>
      <p>This shop appears in the shop-selection UI when you run <code>/viscript_shop open</code></p><img
        src="/md/media/viscriptshop-image-392964876d39d215.png"
        alt="How to verify success screenshot">
    </div>
  </li>
</ul>
<h2 id="about-ids-and-file-names" data-toc-id="about-ids-and-file-names">About IDs and file names</h2>
<p>Category IDs and item IDs are auto-generated UUIDs by default, which is fine for normal use. If you need to reference a specific item directly in commands or scripts, you can change them before publishing to stable, space-free values like
  <code>basic_resources</code> or <code>diamond</code>. The shop file name
  <code>tutorial_shop</code> is the shop path used by the open command.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Uploading overwrites files with the same name</div>
  <div data-type="admonition-content">
    <p>Server upload replaces the whole file; it is not real-time multi-user collaboration. When several authors edit at the same time, assign files up front or manage changes with Git.</p>
    <p>The default "auto-reload shops after upload" makes changes take effect immediately, but it also clears the runtime stock already recorded for that shop. Before uploading to a production server, confirm that resetting the stock to the initial values in the file is acceptable.</p>
  </div>
</div>
<h2 id="what-to-learn-next" data-toc-id="what-to-learn-next">What to learn next</h2>
<p>Read <a href="?file=&quot;Editor-Tutorial.Shops-and-Categories&quot;">Shops and Categories</a> to understand all top-level fields, then use <a
    href="?file=&quot;Editor-Tutorial.Items-and-Trades&quot;">Items and Trades</a> to create barter and sell-type items.</p>