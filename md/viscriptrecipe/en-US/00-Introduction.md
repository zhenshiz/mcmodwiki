<h1 id="viscriptrecipe" data-toc-id="viscriptrecipe">ViScriptRecipe</h1>
<p><a href="?file=&quot;Compatibility Index&quot;">Browse integration guides and versions</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Compatible recipe editing workflow</a></p>
<p>ViScriptRecipe is an in-game visual recipe editing, overriding, and hot-reloading mod aimed at modpack authors and server administrators. It reorganizes work that used to require hand-written JSON, custom scripts, and repeated datapack reloads into a visual workflow of "choose a workstation, edit the slots, upload the file, then reload and verify".</p>
<h2 id="feature-overview" data-toc-id="feature-overview">Feature Overview</h2>
<ul>
  <li>
    <p>Edit <code>.recipe</code> runtime files in game; a single file can contain recipes for multiple different workstations.</p>
  </li>
  <li>
    <p>Supports adding, replacing, and deleting recipes, and entries can be temporarily disabled.</p>
  </li>
  <li>
    <p>The left panel filters recipes by workstation, the middle previews them in a workstation- or JEI-style layout, and the right panel shows only the parameters of the currently selected slot or recipe.</p>
  </li>
  <li>
    <p>Supports items, item tags, fluids, fluid tags, chemicals, chemical tags, entities, blocks, dimensions, structures, enchantments, and other parameters; searchable data uses autocomplete wherever possible.</p>
  </li>
  <li>
    <p>Recipes already loaded in the current world that can be mapped losslessly can be imported by recipe ID.</p>
  </li>
  <li>
    <p>Supports reloading only this mod's recipes and applying incremental JEI updates, avoiding a full datapack reload.</p>
  </li>
  <li>
    <p>Currently registers the vanilla recipe editor and provides dedicated editors and importers for 34 optional mods.</p>
  </li>
</ul>
<h2 id="quick-start" data-toc-id="quick-start">Quick Start</h2>
<h3 id="from-opening-the-editor-to-recipes-taking-effect" data-toc-id="from-opening-the-editor-to-recipes-taking-effect">From Opening the Editor to Recipes Taking Effect</h3>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Enter a world and open the editor</div>
    <div data-type="admonition-content">
      <p>After entering a singleplayer world, a LAN world, or a dedicated server, run <code>/viscript_recipe editor</code>. The editor requires a server environment and permission level 4; recipe importing or server uploads cannot be done from the main menu.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Create or open a recipe file</div>
    <div data-type="admonition-content">
      <p>In the editor, choose "File → New → ViScript Recipe File", or run <code>/viscript_recipe editor &lt;file&gt;</code> to open or create a specific runtime file directly. The command argument is a file name or relative path, not a recipe ID.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Set the new recipe ID namespace</div>
    <div data-type="admonition-content">
      <p>Automatically generated IDs use the <code>viscript_recipe</code> namespace by default. To generate IDs for a modpack or another mod, open "Recipes → Set New Recipe ID Namespace" and enter a valid namespace such as <code>my_pack</code>.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Pick a workstation</div>
    <div data-type="admonition-content">
      <p>Search the "Workstation" box on the left by name, owning mod, or ID and select a workstation. Workstations of an integration mod appear only when that mod is installed and loaded successfully.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Add or import a recipe</div>
    <div data-type="admonition-content">
      <p>Click "Add Recipe" to start editing from defaults; to modify an existing recipe, click "Import Loaded Recipe", search for the full <code>namespace:path</code> ID, and confirm the import.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Edit slots and parameters</div>
    <div data-type="admonition-content">
      <p>Click an item, fluid, or chemical slot in the middle workspace and the right panel switches to that slot's information. Click an empty area of the workspace or re-select the recipe to return to recipe-level parameters.</p>
      <p>The recipe ID must be a full <code>namespace:path</code>. Choose "Add", "Replace", or "Delete" as the operation mode according to your goal.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Check what this file modifies</div>
    <div data-type="admonition-content">
      <p>Open "Recipes → View Workstations Modified by This File". The window lists every entry in collapsible workstation groups, together with enabled counts, operation modes, and recipe IDs. Clicking a specific entry locates it back in the editor.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Save and upload</div>
    <div data-type="admonition-content">
      <p>"File → Save/Save As" saves the current file. In a multiplayer environment you also need to use "Upload → Upload Recipe File" to send the file to the server's <code>ldlib2/assets/viscript_recipe/recipes</code> directory.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Reload and verify</div>
    <div data-type="admonition-content">
      <p>Prefer <code>/viscript_recipe reload delta</code> while editing. Then check the result in JEI, at the actual workstation, or with <code>/viscript_recipe status</code>. Use the standard reload when the vanilla recipe book needs refreshing, and the full reload when tags are involved.</p>
    </div>
  </div>
</div>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Only server-side files are reloaded</div>
  <div data-type="admonition-content">
    <p>Reload commands read the server-side <code>ldlib2/assets/viscript_recipe/recipes</code> directory. Keeping a copy of the file on the client only will not automatically change recipes on a dedicated server; upload the file or have an administrator copy it into the server directory.</p>
  </div>
</div>
<h2 id="editor-interface-tutorial" data-toc-id="editor-interface-tutorial">Editor Interface Tutorial</h2>
<h3 id="three-pane-layout" data-toc-id="three-pane-layout">Three-Pane Layout</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Area</th>
      <th>Main purpose</th>
      <th>Common operations</th>
    </tr>
    <tr>
      <td>Left recipe list</td>
      <td>Pick a workstation; add, import, copy, delete, and reorder entries</td>
      <td>Search workstations, show all recipes, drag to reorder</td>
    </tr>
    <tr>
      <td>Middle workspace</td>
      <td>Show inputs, outputs, machines, and flows in a workstation or JEI layout</td>
      <td>Click a slot to focus it, right-click to clear, Shift+left-click drag to copy</td>
    </tr>
    <tr>
      <td>Right properties</td>
      <td>Edit the actual Codec parameters of the current recipe or slot</td>
      <td>Switch type, ID, operation, amounts, time, chances, and conditions</td>
    </tr>
  </tbody>
</table>
<h3 id="workstation-selection-and-the-recipe-list" data-toc-id="workstation-selection-and-the-recipe-list">Workstation Selection and the Recipe List</h3>
<ul>
  <li>
    <p><strong>Workstation search:</strong> candidates display the workstation name together with the owning mod. You can search localized names, mod IDs, workstation category IDs, or the corresponding workstation item ID.</p>
  </li>
  <li>
    <p><strong>Add:</strong> creates an entry with the default type in the current workstation and generates a <code>recipe_&lt;number&gt;</code> ID under the file's current namespace.</p>
  </li>
  <li>
    <p><strong>Import:</strong> lists only recipes in the current client's RecipeManager that this mod knows how to import.</p>
  </li>
  <li>
    <p><strong>Show all recipes:</strong> when off, only the current workstation is listed; when on, every recognized entry in this file is listed. Adding a new recipe does not change this switch.</p>
  </li>
  <li>
    <p><strong>Copy:</strong> creates a duplicate below the current entry and generates unique IDs such as <code>&lt;path&gt;_copy</code> and <code>&lt;path&gt;_copy_2</code>.</p>
  </li>
  <li>
    <p><strong>Drag reordering:</strong> drag the handle in front of an entry to reorder the currently visible entries, handy for organizing large recipe files by purpose.</p>
  </li>
  <li>
    <p><strong>Deleting a list entry:</strong> this deletes the editing entry in the current <code>.recipe</code> file. If the goal is to remove a recipe that already exists in the world, keep the entry and change its operation to "Delete".</p>
  </li>
</ul>
<h3 id="visual-slots-and-right-panel-properties" data-toc-id="visual-slots-and-right-panel-properties">Visual Slots and Right-Panel Properties</h3>
<ul>
  <li>
    <p>Left-click an input, output, fluid, chemical, or extra item slot, and the right panel shows only the editable content of that slot, avoiding piling every parameter into one global panel.</p>
  </li>
  <li>
    <p>Right-click an editable slot to clear it. Clearing a required input or output may cause the entry to be counted as failed on reload.</p>
  </li>
  <li>
    <p>Hold Shift and left-drag from an item slot to copy its content to another compatible slot. With JEI installed, JEI items can also be dragged into virtual slots.</p>
  </li>
  <li>
    <p>Item tags and fluid tags cycle previews of their matched content inside the slot; what is saved is still the tag ID, not the currently displayed sample item.</p>
  </li>
  <li>
    <p>Machines, fuel, containers, catalysts, description text, or animations in the workspace may only be JEI reading aids. Only when a corresponding field appears on the right does that piece of information belong to the current recipe Codec and become editable.</p>
  </li>
  <li>
    <p>With JEI installed, the textures of the matching recipe category are used preferentially; without JEI, the mod's built-in slot and arrow textures are used, and editing stays available.</p>
  </li>
</ul>
<h3 id="common-input-types-and-autocomplete" data-toc-id="common-input-types-and-autocomplete">Common Input Types and Autocomplete</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Parameter type</th>
      <th>Editing method</th>
      <th>Notes</th>
    </tr>
    <tr>
      <td>Items and item stacks</td>
      <td>Item slot or item picker</td>
      <td>Outputs usually have an editable count; whether input counts are effective depends on the native recipe type</td>
    </tr>
    <tr>
      <td>Item tags</td>
      <td>Tag autocomplete</td>
      <td>Saves the tag ID; the preview only shows candidate items from the tag</td>
    </tr>
    <tr>
      <td>Tool actions</td>
      <td>Enum dropdown</td>
      <td>Mainly for Farmer's Delight cutting board tools, such as knife, axe, shovel, and shear actions</td>
    </tr>
    <tr>
      <td>Fluids and fluid tags</td>
      <td>Fluid picker or registry autocomplete</td>
      <td>Fluid amounts are edited at the same time; not every native Codec accepts tags</td>
    </tr>
    <tr>
      <td>Mekanism chemicals</td>
      <td>Chemical name and ID autocomplete</td>
      <td>Supports single chemicals and chemical tags; compound expressions cannot be imported losslessly</td>
    </tr>
    <tr>
      <td>Blocks and block tags</td>
      <td>Registry autocomplete</td>
      <td>Block result fields store block IDs; do not enter ordinary item IDs</td>
    </tr>
    <tr>
      <td>Entities and entity tags</td>
      <td>Localized name and ID autocomplete</td>
      <td>Entity types and entity tags are two different parameters; choose according to the field's requirement</td>
    </tr>
    <tr>
      <td>Enchantments and potion effects</td>
      <td>Registry autocomplete</td>
      <td>Candidates are shown by localized name and can also be searched by full ID</td>
    </tr>
    <tr>
      <td>Structures and structure tags</td>
      <td>Server registry snapshot autocomplete</td>
      <td>Goety structure locating stores structure tags; the UI helps retrieval with familiar names</td>
    </tr>
    <tr>
      <td>Biome tags and dimension types</td>
      <td>Server-synced candidate catalog</td>
      <td>Used by conditional recipes of Industrial Foregoing, Confluence, and similar mods</td>
    </tr>
    <tr>
      <td>Enum parameters</td>
      <td>Dropdowns</td>
      <td>For example dragon breath type, heat, ritual environment, processing direction, and furnace tier</td>
    </tr>
  </tbody>
</table>
<h3 id="common-recipe-entry-parameters" data-toc-id="common-recipe-entry-parameters">Common Recipe Entry Parameters</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Parameter</th>
      <th>Purpose</th>
      <th>Suggestion</th>
    </tr>
    <tr>
      <td>Recipe type</td>
      <td>Selects the concrete native recipe type within the current workstation</td>
      <td>Switching applies the new type's default data; confirm before switching</td>
    </tr>
    <tr>
      <td>Enabled</td>
      <td>Whether the entry participates in the next reload</td>
      <td>Use it to temporarily disable test entries without deleting the content</td>
    </tr>
    <tr>
      <td>Recipe ID</td>
      <td>The unique namespace:path identifier in the RecipeManager</td>
      <td>Any legal mod namespace can be entered directly; a minecraft prefix is not forced</td>
    </tr>
    <tr>
      <td>Add</td>
      <td>Writes a new recipe; if an ID with the same name already exists it is overwritten and a warning is recorded</td>
      <td>For creating new content</td>
    </tr>
    <tr>
      <td>Replace</td>
      <td>Overwrites an existing recipe; if the target does not exist it becomes an add and a warning is recorded</td>
      <td>Use after importing and modifying an existing recipe</td>
    </tr>
    <tr>
      <td>Delete</td>
      <td>Removes the target ID from the final RecipeManager</td>
      <td>Only a correct ID is needed; a missing target is counted as skipped</td>
    </tr>
    <tr>
      <td>Unlock toast</td>
      <td>Controls whether recipes that support this parameter pop the unlock toast</td>
      <td>Shown only in supported types such as crafting table, stonecutter, and smithing</td>
    </tr>
  </tbody>
</table>
<h3 id="new-recipe-id-namespace" data-toc-id="new-recipe-id-namespace">New Recipe ID Namespace</h3>
<p>The "Recipes → Set New Recipe ID Namespace" menu only affects IDs generated automatically by the editor afterwards, including added and copied recipes. The default value is <code>viscript_recipe</code>.</p>
<ul>
  <li>
    <p>After setting <code>my_pack</code>, new entries get IDs like <code>my_pack:recipe_1</code>.</p>
  </li>
  <li>
    <p>Changing the namespace does not bulk-rewrite existing entries in the file, nor does it change the original IDs kept by imported recipes.</p>
  </li>
  <li>
    <p>The "Recipe ID" field on the right still accepts any legal full ID entered manually, such as <code>minecraft:iron_ingot</code> or <code>create:custom_pressing</code>.</p>
  </li>
  <li>
    <p>A namespace may only use characters allowed by ResourceLocation; empty values and illegal characters are rejected.</p>
  </li>
</ul>
<h3 id="workstations-modified-by-this-file" data-toc-id="workstations-modified-by-this-file">Workstations Modified by This File</h3>
<p>When a file contains many workstations and recipes, open "Recipes → View Workstations Modified by This File" to quickly inspect the scope of impact.</p>
<ul>
  <li>
    <p>The top shows the total workstation count, total recipe count, and enabled entry count.</p>
  </li>
  <li>
    <p>Recipes are grouped by workstation; each group is collapsed by default, avoiding scroll trouble when one workstation has too many entries.</p>
  </li>
  <li>
    <p>Workstation headers show the owning mod and "total entries / enabled".</p>
  </li>
  <li>
    <p>Expanding a group shows the recipe ID, recipe type, operation, and enabled state.</p>
  </li>
  <li>
    <p>Clicking a recipe entry closes the summary window and locates that recipe in the left panel and middle workspace.</p>
  </li>
</ul>
<h3 id="importing-loaded-recipes" data-toc-id="importing-loaded-recipes">Importing Loaded Recipes</h3>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Get the recipe ID</div>
    <div data-type="admonition-content">
      <p>You can get the full <code>namespace:path</code> from JEI advanced information, logs, or other tools. The import search box also lists IDs that are already loaded in the current world and supported for import by this mod.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Search and import</div>
    <div data-type="admonition-content">
      <p>Click "Import Loaded Recipe" on the left, search by ID, namespace, path, recipe type, or serializer ID, pick a candidate, and confirm.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Check the mapping result</div>
    <div data-type="admonition-content">
      <p>After a successful import, the entry is inserted below the currently selected entry and uses the "Replace" operation by default. Click through the slots one by one to check whether tags, counts, chances, and dedicated parameters match your expectations.</p>
    </div>
  </div>
</div>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Not importable does not mean it cannot be created manually</div>
  <div data-type="admonition-content">
    <p>JEI dynamic information pages, data maps, runtime synthetic categories, and display objects that are not in the RecipeManager are not ordinary recipes and cannot be imported by ID. When a complex Ingredient, FluidIngredient, or ChemicalIngredient cannot be mapped losslessly, the importer refuses it explicitly instead of silently corrupting the data; where a corresponding editor exists, supported parameter combinations can still be created manually.</p>
  </div>
</div>
<h2 id="file-saving-uploading-and-the-server-directory" data-toc-id="file-saving-uploading-and-the-server-directory">File Saving, Uploading, and the Server Directory</h2>
<p><code>.recipe</code> is ViScriptRecipe's binary runtime recipe file, not a vanilla JSON datapack file. Each file can hold multiple recipe entries.</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Operation</th>
      <th>Write location</th>
      <th>Whether server recipes change immediately</th>
    </tr>
    <tr>
      <td>Save or Save As</td>
      <td>The local runtime file the editor is working on</td>
      <td>Not applied automatically; the server-side file and a reload are still required</td>
    </tr>
    <tr>
      <td>Upload recipe file</td>
      <td>Server ldlib2/assets/viscript_recipe/recipes</td>
      <td>A reload command is still required after uploading</td>
    </tr>
  </tbody>
</table>
<h3 id="opening-a-file-directly-with-a-command" data-toc-id="opening-a-file-directly-with-a-command">Opening a File Directly with a Command</h3><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_recipe editor
/viscript_recipe editor example
/viscript_recipe editor subfolder/example</code></pre>
<p>Without arguments, only the editor opens. With <code>&lt;file&gt;</code>, the command opens an existing file in the runtime recipe directory or creates a new one, and offers completion for existing file names. Invalid paths are rejected, so this cannot be used to access arbitrary files outside the recipe directory.</p>
<h2 id="reload-and-jei-updates" data-toc-id="reload-and-jei-updates">Reload and JEI Updates</h2>
<p>ViScriptRecipe's reload only re-reads and applies this mod's <code>.recipe</code> files. It does not trigger a full datapack reload, nor does it reload other mods' loot tables, advancements, functions, or every data listener along the way.</p>
<h3 id="three-reload-modes" data-toc-id="three-reload-modes">Three Reload Modes</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Command</th>
      <th>What is synced</th>
      <th>When to use</th>
    </tr>
    <tr>
      <td>/viscript_recipe reload delta</td>
      <td>Sends only the recipes added, modified, and deleted this time and updates JEI partially; does not refresh the vanilla recipe book or tags</td>
      <td>Frequent previewing of ordinary recipes while editing; usually the lightest option</td>
    </tr>
    <tr>
      <td>/viscript_recipe reload</td>
      <td>Sends the new complete recipe set and syncs the vanilla recipe book; does not additionally sync the tag set</td>
      <td>When the vanilla recipe book and search data must update</td>
    </tr>
    <tr>
      <td>/viscript_recipe reload full</td>
      <td>Additionally syncs the tag set on top of the standard reload</td>
      <td>After adding, deleting, or modifying tag-related inputs; the highest cost</td>
    </tr>
  </tbody>
</table>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Delta reload automatically guarantees consistency</div>
  <div data-type="admonition-content">
    <p>When showcase mode is on, the number of changes is too large, a recipe cannot be encoded safely, or the client version state disagrees, the delta reload automatically falls back to a full recipe sync. When certain JEI categories use dedicated display objects, the system may only rebuild the JEI pages. Create automatic brewing and Iron's Spells arcane anvil are categories that require special handling.</p>
  </div>
</div>
<h3 id="viewing-load-statistics" data-toc-id="viewing-load-statistics">Viewing Load Statistics</h3>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_recipe status</code></pre>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Statistic</th>
      <th>Meaning</th>
    </tr>
    <tr>
      <td>Files</td>
      <td>Number of .recipe files successfully read and deserialized this time</td>
    </tr>
    <tr>
      <td>Entries</td>
      <td>Total number of entries in the files, including disabled ones</td>
    </tr>
    <tr>
      <td>Enabled</td>
      <td>Number of entries participating in this apply pass</td>
    </tr>
    <tr>
      <td>Applied</td>
      <td>Number of entries whose add, replace, or delete executed successfully</td>
    </tr>
    <tr>
      <td>Skipped</td>
      <td>Number of entries that are disabled, whose delete target is missing, or whose conditions are not met</td>
    </tr>
    <tr>
      <td>Failed</td>
      <td>Number of entries that failed due to ID, type, parameter, or native recipe construction errors</td>
    </tr>
    <tr>
      <td>Base recipes</td>
      <td>Total RecipeManager recipes saved before the ViScriptRecipe files were applied</td>
    </tr>
    <tr>
      <td>Current recipes</td>
      <td>Total RecipeManager recipes after this apply pass finished</td>
    </tr>
  </tbody>
</table>
<p>If "Failed" is greater than 0, check the server log for the specific recipe IDs, source files, and exceptions. Successful statistics only mean the entries were written into the RecipeManager; also verify the actual behavior at the corresponding machine or JEI page.</p>
<h3 id="without-jei-installed" data-toc-id="without-jei-installed">Without JEI Installed</h3>
<p>JEI is not a required dependency for opening the editor or applying recipes. Without JEI, the middle workspace uses the built-in slots, arrows, and machine layouts provided by ViScriptRecipe and LDLib2; recipe saving, uploading, import candidates, server reloads, and actual machine behavior remain available. The difference is that results cannot be viewed on JEI pages, and there are no JEI runtime pages to refresh.</p>
<h2 id="configuration" data-toc-id="configuration">Configuration</h2>
<p>The config file lives at <code>config/viscript_recipe_config.toml</code>. Whenever any ViScriptRecipe reload command runs, the mod re-reads this config file.</p>
<h3 id="showcase-mode" data-toc-id="showcase-mode">Showcase Mode</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Config path</th>
      <th>Default</th>
      <th>Effect</th>
    </tr>
    <tr>
      <td>recipes.showcase_only_viscript_recipes</td>
      <td>false</td>
      <td>When enabled, clears the base RecipeManager recipes and keeps only the applied ViScriptRecipe recipes, convenient for inspecting the current recipe pack</td>
    </tr>
  </tbody>
</table><pre language="toml" isclosed="false"><code class="language-toml">[recipes]
showcase_only_viscript_recipes = false</code></pre>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Showcase mode is not recommended directly on production servers</div>
  <div data-type="admonition-content">
    <p>Showcase mode changes the complete recipe set and makes delta reloads fall back to full sync. Some mods also have dynamic or dedicated recipes that bypass the RecipeManager, and those are not cleared by showcase mode.</p>
  </div>
</div>
<h2 id="vanilla-recipe-tutorial" data-toc-id="vanilla-recipe-tutorial">Vanilla Recipe Tutorial</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Workstation</th>
      <th>Supported types</th>
      <th>Main parameters</th>
    </tr>
    <tr>
      <td>Crafting Table</td>
      <td>minecraft:crafting_shaped; minecraft:crafting_shapeless</td>
      <td>Pattern or shapeless ingredients, items or tags, result, remainder, unlock toast</td>
    </tr>
    <tr>
      <td>Furnace</td>
      <td>minecraft:smelting</td>
      <td>Input, result, XP, smelting time</td>
    </tr>
    <tr>
      <td>Blast Furnace</td>
      <td>minecraft:blasting</td>
      <td>Input, result, XP, smelting time</td>
    </tr>
    <tr>
      <td>Smoker</td>
      <td>minecraft:smoking</td>
      <td>Input, result, XP, smelting time</td>
    </tr>
    <tr>
      <td>Campfire</td>
      <td>minecraft:campfire_cooking</td>
      <td>Input, result, XP, processing time</td>
    </tr>
    <tr>
      <td>Stonecutter</td>
      <td>minecraft:stonecutting</td>
      <td>Input, result, count, unlock toast</td>
    </tr>
    <tr>
      <td>Smithing Table</td>
      <td>minecraft:smithing_transform</td>
      <td>Template, base item, addition, result, unlock toast</td>
    </tr>
  </tbody>
</table>
<p>Shaped recipes store the pattern per slot; shapeless recipes store only the effective ingredients. The fuel slot in smelting workspaces is a machine hint and does not belong to an individual smelting recipe; what is truly editable is the input, output, XP, and time.</p>
<h2 id="compat-mod-recipe-tutorials" data-toc-id="compat-mod-recipe-tutorials">Compat Mod Recipe Tutorials</h2>
<p>Integration tutorials are now separate pages. Start at <a href="?file=&quot;Compatibility Index&quot;">the compatibility index</a> for all 34 recipe adapters and JEI; addons such as the AE2 integrations are grouped under the parent mod.</p>
<h2 id="frequently-asked-questions" data-toc-id="frequently-asked-questions">Frequently Asked Questions</h2>
<h3 id="why-did-my-change-not-take-effect" data-toc-id="why-did-my-change-not-take-effect">Why did my change not take effect</h3>
<ol>
  <li>
    <p>Confirm the file has been uploaded or copied to the server's <code>ldlib2/assets/viscript_recipe/recipes</code>.</p>
  </li>
  <li>
    <p>Confirm the entry's "Enabled" switch is on.</p>
  </li>
  <li>
    <p>Confirm the recipe ID and operation mode are correct; to modify an existing recipe, import it first and use "Replace".</p>
  </li>
  <li>
    <p>After running the reload, execute <code>/viscript_recipe status</code> and check the failed and skipped counts.</p>
  </li>
  <li>
    <p>Check the server log for the specific exception; missing integration mods, illegal registry IDs, empty required slots, and values outside the native Codec's range all cause failures.</p>
  </li>
</ol>
<h3 id="why-is-the-jei-page-not-updating" data-toc-id="why-is-the-jei-page-not-updating">Why is the JEI page not updating</h3>
<ul>
  <li>
    <p>Prefer <code>/viscript_recipe reload delta</code> for ordinary edits; the system partially hides old pages and adds new ones.</p>
  </li>
  <li>
    <p>If tags were changed, use <code>/viscript_recipe reload full</code>.</p>
  </li>
  <li>
    <p>If the category is a dynamic display page or uses dedicated objects, the system may rebuild the whole JEI page set instead of replacing entries partially.</p>
  </li>
  <li>
    <p>Confirm the recipe itself was applied successfully; JEI does not display entries that failed to construct.</p>
  </li>
</ul>
<h3 id="why-is-there-no-edit-box-for-some-text-or-machine-hints-on-the-right-panel" data-toc-id="why-is-there-no-edit-box-for-some-text-or-machine-hints-on-the-right-panel">Why is there no edit box for some text or machine hints on the right panel</h3>
<p>JEI pages combine recipe data, machine information, catalysts, animations, and derived text. ViScriptRecipe only edits data actually stored by the native recipe Codec. Text and icons derived from machine registry information, input contents, or the JEI category have no independent fields and are therefore read-only previews.</p>
<h3 id="why-is-a-jei-category-missing-from-the-editor" data-toc-id="why-is-a-jei-category-missing-from-the-editor">Why is a JEI category missing from the editor</h3>
<p>Only recipes registered by the corresponding mod itself, managed by the RecipeManager or an implemented dedicated override system, and safely constructible become editable types. Registry information pages, data maps, runtime synthetic categories, machine run demos, and other mods' or vanilla's recipes are not disguised as uploadable recipes just to inflate the count.</p>
<h3 id="how-do-i-keep-large-recipe-files-easy-to-navigate" data-toc-id="how-do-i-keep-large-recipe-files-easy-to-navigate">How do I keep large recipe files easy to navigate</h3>
<p>Split <code>.recipe</code> files by purpose and use "View Workstations Modified by This File" to check each one. Workstation groups in the summary window start collapsed, showing per-group totals and enabled counts; click an entry to locate it. The left panel can also turn on "Show all recipes" and sort everything together.</p>
<h2 id="promotional-video" data-toc-id="promotional-video">Promotional Video</h2>
<div class="video-container"><iframe
    src="//player.bilibili.com/player.html?bvid=BV1nzMp6WEPp&amp;page=1&amp;high_quality=1&amp;danmaku=0"
    width="640" height="480" allowfullscreen="true" frameborder="0"></iframe>
</div>
