<h1 id="shops-and-categories" data-toc-id="shops-and-categories">Shops and Categories</h1>
<p>This page describes in detail the three main areas of the visual editor, shop-level fields, category fields, and the differences between saving, uploading, and reloading. If you have not yet built a shop successfully, it is recommended to first complete <a
    href="?file=&quot;10-Quick-Start.Your-First-Shop.md&quot;">Your First Shop</a>.</p>
<h2 id="how-to-open" data-toc-id="how-to-open">How to Open</h2><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_shop editor
/viscript_shop editor &lt;shop path&gt;</code></pre>
<p>Without a shop path, an empty editor opens where you can create a new file or open a local one. With a path, the server reads the matching <code>.shop</code>
  file from
  <code>ldlib2/assets/viscript_shop/shop</code> and loads it directly into the editor.</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Permission Requirement</div>
  <div data-type="admonition-content">
    <p>Opening the editor and uploading files to the server both require permission level 4. Regular players should not be granted this permission.</p>
  </div>
</div>
<h2 id="editor-layout-overview" data-toc-id="editor-layout-overview">Editor Layout Overview</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Location</th>
      <th>View</th>
      <th>Main use</th>
    </tr>
    <tr>
      <td>Left</td>
      <td>Categories</td>
      <td>Create, select, drag to reorder, and delete categories</td>
    </tr>
    <tr>
      <td>Center</td>
      <td>Shop preview</td>
      <td>Create, select, drag to reorder, copy, cut, paste, and delete items</td>
    </tr>
    <tr>
      <td>Right</td>
      <td>Editing</td>
      <td>Switch between the "Shop", "Category", and "Item" tabs and modify properties</td>
    </tr>
  </tbody>
</table>
<p>Both category and item cards can be dragged to reorder. Order is not just a visual effect in the editor: it also determines the display order in the player-facing shop and the results of index-based lookups.</p>
<h2 id="shop-level-fields" data-toc-id="shop-level-fields">Shop-Level Fields</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Field</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>Shop name</td>
      <td>Empty</td>
      <td>Page title and display name in the quick shop selector; when left empty, the default "Shop" is shown</td>
    </tr>
    <tr>
      <td>Allow quick open</td>
      <td>false</td>
      <td>Determines whether the shop appears in the quick shop selector</td>
    </tr>
    <tr>
      <td>Locked content display</td>
      <td>Show locked content</td>
      <td>Applies uniformly to unlocked categories and items; choose to show them or hide them completely</td>
    </tr>
    <tr>
      <td>Store-wide promotion system</td>
      <td>Off</td>
      <td>Once enabled, you can configure the default merge mode and store-wide rules</td>
    </tr>
  </tbody>
</table>
<p>The shop name can be plain text or a translation key defined in a resource pack, so players using different languages automatically see the corresponding translation.</p>
<h2 id="creating-and-editing-categories" data-toc-id="creating-and-editing-categories">Creating and Editing Categories</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Create a category</div>
    <div data-type="admonition-content">
      <p>Click the <code>+</code> at the bottom left. The new category gets a unique ID automatically, and its properties open on the right.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Set a stable ID</div>
    <div data-type="admonition-content">
      <p>Rename it only when you need direct command access or script references, e.g. <code>ores</code> or
        <code>chapter_2_food</code>. Lowercase letters, numbers, and underscores are recommended, and the ID should stay unchanged after release.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Choose the trade model</div>
    <div data-type="admonition-content">
      <p>Items in a "barter shop" use cost item A and cost item B; items in a "general currency shop" use a price and a buy/sell direction. The category type also determines which fields the item editor shows.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Choose an icon</div>
    <div data-type="admonition-content">
      <p>With the "item texture" icon type, select an item directly; with "resource pack image", fill in a resource location, e.g.
        <code>example:textures/gui/ores.png</code>. The image must already exist in a resource pack available on the client.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Order and check</div>
    <div data-type="admonition-content">
      <p>Use the drag handle to the left of each category to adjust the order. Click the category card and confirm that the header on the right has switched to "Category", so you do not accidentally edit shop-level fields.</p>
    </div>
  </div>
</div>
<h2 id="category-field-reference" data-toc-id="category-field-reference">Category Field Reference</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Field</th>
      <th>Description</th>
      <th>Recommendation</th>
    </tr>
    <tr>
      <td>Category ID</td>
      <td>Stable identifier used by commands, scripts, and stock records</td>
      <td>Do not change it casually after release</td>
    </tr>
    <tr>
      <td>Category name</td>
      <td>Name shown in the player UI</td>
      <td>Can be plain text or a translation key</td>
    </tr>
    <tr>
      <td>Shop type</td>
      <td>Choose barter or general currency</td>
      <td>Keep similar trades in the same category</td>
    </tr>
    <tr>
      <td>Image type</td>
      <td>Choose an item icon or a resource pack image</td>
      <td>When distributing custom images, distribute the resource pack as well</td>
    </tr>
    <tr>
      <td>Category promotion settings</td>
      <td>Inherit or override store-wide rules, and add category-level rules</td>
      <td>See the promotions tutorial</td>
    </tr>
    <tr>
      <td>Phase system</td>
      <td>Determines whether players can access the entire category</td>
      <td>When a category is locked, its item list is not shown</td>
    </tr>
  </tbody>
</table>
<h2 id="reusing-and-deleting-content" data-toc-id="reusing-and-deleting-content">Reusing and Deleting Content</h2>
<ul>
  <li>
    <p>Categories can be dragged to reorder and deleted; a confirmation dialog appears when deleting.</p>
  </li>
  <li>
    <p>Right-click an item card to edit, copy, cut, paste, or delete it.</p>
  </li>
  <li>
    <p>Items can only be pasted into categories with the same shop type. A barter item cannot be pasted directly into a currency category, and vice versa.</p>
  </li>
</ul>
<h2 id="saving-uploading-and-reloading" data-toc-id="saving-uploading-and-reloading">Saving, Uploading, and Reloading</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Action</th>
      <th>What it modifies</th>
      <th>Best for</th>
    </tr>
    <tr>
      <td>Save file</td>
      <td>The local .shop file on the current client</td>
      <td>Local backups, version control, offline editing</td>
    </tr>
    <tr>
      <td>Upload shop file</td>
      <td>Server-side ldlib2/assets/viscript_shop/shop</td>
      <td>Publishing or updating the shop on a multiplayer server</td>
    </tr>
    <tr>
      <td>Reload shops</td>
      <td>Clears the shops loaded in the save and their runtime stock</td>
      <td>Lets the server initialize from the latest .shop files on its next load</td>
    </tr>
  </tbody>
</table>
<p>The editor's <code>Settings → Behavior → Shop Upload</code>
  section has an "Auto reload shops after upload" option, which is enabled by default. Keep it on while authoring; once the shop is live and you do not want to reset its stock, turn it off before uploading and schedule a separate maintenance window.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Shop files are not collaboration documents</div>
  <div data-type="admonition-content">
    <p>Uploading a file with the same name overwrites the entire file on the server. When several people build the shop together, use Git or another version control tool to keep diffs and rollback points.</p>
  </div>
</div>
<h2 id="start-configuring-items" data-toc-id="start-configuring-items">Start Configuring Items</h2>
<p>Once the categories are ready, continue with <a href="?file=&quot;21-Editor-Tutorial.Items-and-Trades.md&quot;">Items and Trades</a>.</p>