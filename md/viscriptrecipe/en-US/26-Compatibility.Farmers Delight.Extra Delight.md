<h1 id="farmers-delight--extra-delight" data-toc-id="farmers-delight--extra-delight">Farmers Delight / Extra Delight</h1>
<p>Edit native Farmers Delight / Extra Delight recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>extradelight</td></tr>
<tr><td>Build dependency version</td><td>2.6.5</td></tr>
<tr><td>VSR optional dependency range</td><td>[2.6.5,2.7)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<p><strong>Related dependencies: </strong>Requires Farmer’s Delight and the addon’s own dependencies.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Mortar</td><td>extradelight:mortar</td></tr>
<tr><td>Mixing Bowl</td><td>extradelight:mixing_bowl</td></tr>
<tr><td>Oven</td><td>extradelight:oven</td></tr>
<tr><td>Drying Rack</td><td>extradelight:drying_rack</td></tr>
<tr><td>Dough Shaping</td><td>extradelight:dough_shaping</td></tr>
<tr><td>Tool on Block</td><td>extradelight:tool_on_block</td></tr>
<tr><td>Feast Serving</td><td>extradelight:feast</td></tr>
<tr><td>Melting Pot</td><td>extradelight:melting_pot</td></tr>
<tr><td>Chiller</td><td>extradelight:chiller</td></tr>
<tr><td>Vat</td><td>extradelight:vat</td></tr>
<tr><td>Evaporator</td><td>extradelight:evaporator</td></tr>
<tr><td>Bottled Fluid Mapping</td><td>extradelight:bottle_fluid</td></tr>
<tr><td>Shaped Crafting with Jars</td><td>extradelight:shaped_jar</td></tr>
<tr><td>Juicer</td><td>extradelight:juicer</td></tr>
<tr><td>Dynamic Jam</td><td>extradelight:dynamic_jam</td></tr>
<tr><td>Dynamic Toast</td><td>extradelight:dynamic_toast</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a loaded oven recipe, change only time to 200 and verify container consumption. For staged fermentation, create vat and configure each stage ingredient, time and lid separately.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="bottle-fluid" data-toc-id="bottle-fluid">Bottle fluid</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>fluid</td><td>Input or output fluid according to the recipe type; edit the corresponding fluid slot for bottling, vats, chillers and other workstations.</td></tr>
</tbody></table>
<h3 id="chiller" data-toc-id="chiller">Chiller</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>fluid</td><td>Input or output fluid according to the recipe type; edit the corresponding fluid slot for bottling, vats, chillers and other workstations.</td></tr>
<tr><td>container</td><td>Container item such as a bowl or bottle; consumption follows the recipe type and its container switch.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>experience</td><td>Recipe experience reward, configured separately from output counts.</td></tr>
<tr><td>consumeContainer</td><td>Whether processing consumes the container.</td></tr>
</tbody></table>
<h3 id="dough-shaping" data-toc-id="dough-shaping">Dough shaping</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h3 id="drying-rack" data-toc-id="drying-rack">Drying rack</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>experience</td><td>Recipe experience reward, configured separately from output counts.</td></tr>
</tbody></table>
<h3 id="dynamic-jam" data-toc-id="dynamic-jam">Dynamic jam</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>graphic</td><td>Native appearance key for dynamic jam or toast, such as apple; this is not an item registry ID.</td></tr>
<tr><td>container</td><td>Container item such as a bowl or bottle; consumption follows the recipe type and its container switch.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>experience</td><td>Recipe experience reward, configured separately from output counts.</td></tr>
<tr><td>recipeBookTab</td><td>Mod recipe-book tab identifier; use a category accepted by the native mod.</td></tr>
</tbody></table>
<h3 id="dynamic-toast" data-toc-id="dynamic-toast">Dynamic toast</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>graphic</td><td>Native appearance key for dynamic jam or toast, such as apple; this is not an item registry ID.</td></tr>
<tr><td>category</td><td>Vanilla crafting-book category; choose from the selector.</td></tr>
</tbody></table>
<h3 id="evaporator" data-toc-id="evaporator">Evaporator</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>fluid</td><td>Input or output fluid according to the recipe type; edit the corresponding fluid slot for bottling, vats, chillers and other workstations.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>lootTable</td><td>Loot-table ID used by the evaporator.</td></tr>
<tr><td>displayBlock</td><td>Display block ID for the evaporator.</td></tr>
</tbody></table>
<h3 id="feast-portioning" data-toc-id="feast-portioning">Feast portioning</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>feast</td><td>Feast item being portioned by the feast recipe.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h3 id="juicer" data-toc-id="juicer">Juicer</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>fluidOutput</td><td>Fluid stack or list of stacks; outputs use concrete fluids and amounts in mB.</td></tr>
<tr><td>chance</td><td>Juicer item byproduct chance as an integer percentage from 0 to 100; 25 means 25%.</td></tr>
</tbody></table>
<h3 id="melting-pot" data-toc-id="melting-pot">Melting pot</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>fluidOutput</td><td>Fluid stack or list of stacks; outputs use concrete fluids and amounts in mB.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
</tbody></table>
<h3 id="mixing-bowl" data-toc-id="mixing-bowl">Mixing bowl</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>fluids</td><td>Fluid input list; set each fluid or supported tag and its amount in mB.</td></tr>
<tr><td>container</td><td>Container item such as a bowl or bottle; consumption follows the recipe type and its container switch.</td></tr>
<tr><td>utensil</td><td>Mixing utensil ingredient, including tool tags such as c:spoons.</td></tr>
<tr><td>utensilCondition</td><td>Native ingredient-condition JSON; keep it valid and edit only understood conditions.</td></tr>
<tr><td>stirs</td><td>Mixing-bowl stir count, minimum 1.</td></tr>
</tbody></table>
<h3 id="mortar" data-toc-id="mortar">Mortar</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>fluidOutput</td><td>Fluid stack or list of stacks; outputs use concrete fluids and amounts in mB.</td></tr>
<tr><td>grinds</td><td>Mortar grinding count, minimum 1.</td></tr>
</tbody></table>
<h3 id="oven" data-toc-id="oven">Oven</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>container</td><td>Container item such as a bowl or bottle; consumption follows the recipe type and its container switch.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>experience</td><td>Recipe experience reward, configured separately from output counts.</td></tr>
<tr><td>consumeContainer</td><td>Whether processing consumes the container.</td></tr>
</tbody></table>
<h3 id="native-extra-conditions" data-toc-id="native-extra-conditions">Native extra conditions</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>fluidConditions</td><td>Imported native fluid/ingredient conditions, maintained in the corresponding slot condition editor; empty means no additional condition.</td></tr>
<tr><td>ingredientConditions</td><td>Imported native fluid/ingredient conditions, maintained in the corresponding slot condition editor; empty means no additional condition.</td></tr>
</tbody></table>
<h3 id="shaped-jar-crafting" data-toc-id="shaped-jar-crafting">Shaped jar crafting</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>category</td><td>Vanilla crafting-book category; choose from the selector.</td></tr>
<tr><td>showNotification</td><td>Whether the native recipe unlock notification is shown.</td></tr>
<tr><td>pattern</td><td>Shaped pattern and symbol-to-ingredient mapping generated from the grid; spaces are empty slots.</td></tr>
<tr><td>key</td><td>Shaped pattern and symbol-to-ingredient mapping generated from the grid; spaces are empty slots.</td></tr>
<tr><td>fluids</td><td>Fluid input list; set each fluid or supported tag and its amount in mB.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h3 id="tool-on-block" data-toc-id="tool-on-block">Tool on block</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h3 id="vat" data-toc-id="vat">Vat</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>fluid</td><td>Input or output fluid according to the recipe type; edit the corresponding fluid slot for bottling, vats, chillers and other workstations.</td></tr>
<tr><td>container</td><td>Container item such as a bowl or bottle; consumption follows the recipe type and its container switch.</td></tr>
<tr><td>stages</td><td>Vat stages, each with its added ingredient, duration and lid condition.</td></tr>
</tbody></table>
<h3 id="vat-stage" data-toc-id="vat-stage">Vat stage</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>ingredientCondition</td><td>Native ingredient-condition JSON; keep it valid and edit only understood conditions.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>lid</td><td>Whether the current vat stage requires the lid closed.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/extradelight" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
