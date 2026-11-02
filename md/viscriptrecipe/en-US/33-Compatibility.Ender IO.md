<h1 id="ender-io" data-toc-id="ender-io">Ender IO</h1>
<p>Edit native Ender IO recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>enderio</td></tr>
<tr><td>Build dependency version</td><td>8.2.12-beta</td></tr>
<tr><td>VSR optional dependency range</td><td>[8.2.12-beta,8.3)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Fire Crafting</td><td>enderio:fire_crafting</td></tr>
<tr><td>Alloy Smelting</td><td>enderio:alloy_smelting</td></tr>
<tr><td>Enchanter</td><td>enderio:enchanting</td></tr>
<tr><td>SAG Milling</td><td>enderio:sag_milling</td></tr>
<tr><td>Slice &amp; Splice</td><td>enderio:slicing</td></tr>
<tr><td>Soul Binding</td><td>enderio:soul_binding</td></tr>
<tr><td>Fluid Tank</td><td>enderio:tank</td></tr>
<tr><td>VAT Fermenting</td><td>enderio:vat_fermenting</td></tr>
<tr><td>Weather Change</td><td>enderio:weather_change</td></tr>
<tr><td>Soul-preserving Shaped Crafting</td><td>enderio:shaped_entity_storage</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose alloy smelting, import an existing recipe and change energy. Enabling smelting should leave a single input. For SAG byproducts, configure chance and bonus separately.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="fluid-ingredients" data-toc-id="fluid-ingredients">Fluid ingredients</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>value</td><td>The item, tag or other supported value of this ingredient.</td></tr>
<tr><td>customJson</td><td>Native extended ingredient definition preserved during import until explicitly replaced.</td></tr>
</tbody></table>
<h3 id="counted-ingredients" data-toc-id="counted-ingredients">Counted ingredients</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>alternatives</td><td>Alternative ingredients for one slot, combined with OR. Put simultaneously required inputs in separate slots.</td></tr>
<tr><td>count</td><td>Ingredient or output amount, separate from the number of alternatives.</td></tr>
<tr><td>customJson</td><td>Native extended ingredient definition preserved during import until explicitly replaced.</td></tr>
</tbody></table>
<h3 id="output-slots" data-toc-id="output-slots">Output slots</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Used by</th><th>Purpose and entry</th></tr>
<tr><td>item</td><td>This recipe or structure</td><td>Concrete output stack used when tag output is disabled.</td></tr>
<tr><td>useTag</td><td>This recipe or structure</td><td>Select an output through an item tag; enable it and enter a native supported tag.</td></tr>
<tr><td>tag</td><td>This recipe or structure</td><td>Select an output through an item tag; enable it and enter a native supported tag.</td></tr>
<tr><td>count</td><td>This recipe or structure</td><td>Ingredient or output amount, separate from the number of alternatives.</td></tr>
<tr><td>chance</td><td>fire_crafting, sag_milling</td><td>Output chance; typical floating-point values range from 0 to 1, with 1 guaranteed. Percentage fields are noted separately.</td></tr>
<tr><td>optional</td><td>This recipe or structure</td><td>Whether a tag-based result is optional.</td></tr>
<tr><td>minCount</td><td>fire_crafting</td><td>Lower and upper random output counts for fire crafting; keep minimum no greater than maximum.</td></tr>
<tr><td>maxCount</td><td>fire_crafting</td><td>Lower and upper random output counts for fire crafting; keep minimum no greater than maximum.</td></tr>
</tbody></table>
<h3 id="workstation-parameters" data-toc-id="workstation-parameters">Workstation parameters</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Used by</th><th>Purpose and entry</th></tr>
<tr><td>inputs</td><td>This recipe or structure</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>outputs</td><td>This recipe or structure</td><td>Output list; edit each item, count and any chance offered by this recipe type.</td></tr>
<tr><td>fluidInput</td><td>This recipe or structure</td><td>Fluid input and amount in mB; use a concrete fluid or a tag where the type permits it.</td></tr>
<tr><td>fluidOutput</td><td>This recipe or structure</td><td>Fluid stack or list of stacks; outputs use concrete fluids and amounts in mB.</td></tr>
<tr><td>energy</td><td>alloy_smelting, sag_milling, slicing, soul_binding</td><td>Native energy requirement for alloy smelting, SAG milling, slicing or soul binding.</td></tr>
<tr><td>experience</td><td>alloy_smelting</td><td>Recipe experience reward, configured separately from output counts.</td></tr>
<tr><td>smelting</td><td>alloy_smelting</td><td>Single-input furnace mode for alloy smelting; enabling it limits the recipe to one input.</td></tr>
<tr><td>experienceLevels</td><td>soul_binding</td><td>Experience levels required by soul binding, minimum 0.</td></tr>
<tr><td>bonus</td><td>sag_milling</td><td>Grinding-ball bonus mode: none, multiply_output or chance_only.</td></tr>
<tr><td>tankMode</td><td>tank</td><td>Fluid tank operation direction: fill or empty.</td></tr>
<tr><td>ticks</td><td>vat_fermenting</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>weather</td><td>weather_change</td><td>Target weather: clear, rain or lightning.</td></tr>
<tr><td>enchantment</td><td>enchanting</td><td>Registered enchantment ID chosen with the enchantment selector.</td></tr>
<tr><td>costMultiplier</td><td>enchanting</td><td>Enchantment cost multiplier, minimum 1; preview level affects only the editor preview.</td></tr>
<tr><td>entityType</td><td>soul_binding</td><td>Soul-binding entity ID, mob category or native soul-data predicate, according to the selected matching mode.</td></tr>
<tr><td>mobCategory</td><td>soul_binding</td><td>Soul-binding entity ID, mob category or native soul-data predicate, according to the selected matching mode.</td></tr>
<tr><td>soulData</td><td>soul_binding</td><td>Soul-binding entity ID, mob category or native soul-data predicate, according to the selected matching mode.</td></tr>
<tr><td>copyInputComponents</td><td>soul_binding</td><td>Whether input data components transfer to the output; check names, enchantments and other desired data with an existing recipe.</td></tr>
<tr><td>bases</td><td>fire_crafting</td><td>Allowed base block IDs and block tags for fire crafting.</td></tr>
<tr><td>baseTags</td><td>fire_crafting</td><td>Allowed base block IDs and block tags for fire crafting.</td></tr>
<tr><td>dimensions</td><td>fire_crafting</td><td>Dimension IDs allowed for fire crafting.</td></tr>
<tr><td>blockAfterBurning</td><td>fire_crafting</td><td>Optional replacement block after fire crafting; leave empty to omit it.</td></tr>
<tr><td>width</td><td>shaped_entity_storage</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>height</td><td>shaped_entity_storage</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>group</td><td>shaped_entity_storage</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>category</td><td>shaped_entity_storage</td><td>Vanilla crafting-book category; choose from the selector.</td></tr>
<tr><td>showNotification</td><td>shaped_entity_storage</td><td>Whether the native recipe unlock notification is shown.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/enderio" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
