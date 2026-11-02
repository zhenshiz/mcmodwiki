<h1 id="avaritia" data-toc-id="avaritia">Avaritia</h1>
<p>Edit native Avaritia recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>avaritia</td></tr>
<tr><td>Build dependency version</td><td>1.3.9.9</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Table: Shaped</td><td>avaritia:shaped_table</td></tr>
<tr><td>Table: Shapeless</td><td>avaritia:shapeless_table</td></tr>
<tr><td>No-Consume Catalyst</td><td>avaritia:no_consume_catalyst_shaped</td></tr>
<tr><td>Neutron Compressor</td><td>avaritia:compressor</td></tr>
<tr><td>Extreme Smithing</td><td>avaritia:extreme_smithing</td></tr>
<tr><td>Infinity Catalyst</td><td>avaritia:infinity_catalyst</td></tr>
<tr><td>Eternal Singularity</td><td>avaritia:eternal_singularity</td></tr>
<tr><td>Full Matter Cluster</td><td>avaritia:full_matter_cluster</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose shaped table crafting, set tier and size, then place ingredients/output. Enable compatible if lower-tier tables should accept it and verify in the intended table.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="neutron-compressor" data-toc-id="neutron-compressor">Neutron compressor</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>timeCost</td><td>Processing time passed to the native neutron compressor recipe.</td></tr>
</tbody></table>
<h3 id="extreme-smithing" data-toc-id="extreme-smithing">Extreme smithing</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>template</td><td>Smithing base, template or addition; edit the matching slot.</td></tr>
<tr><td>base</td><td>Smithing base, template or addition; edit the matching slot.</td></tr>
<tr><td>additions</td><td>Additional smithing ingredients, entered in the corresponding slots.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h3 id="special-shapeless-crafting" data-toc-id="special-shapeless-crafting">Special shapeless crafting</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>group</td><td>Native special shapeless recipe group, defaulting to default.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>count</td><td>Count parameter for the special shapeless recipe, separate from a normal output stack.</td></tr>
</tbody></table>
<h3 id="shaped-and-shapeless-tables" data-toc-id="shaped-and-shapeless-tables">Shaped and shapeless tables</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>width</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>height</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>tier</td><td>Crafting table tier that determines the required workstation.</td></tr>
<tr><td>compatible</td><td>Allow lower-tier crafting tables to use this recipe.</td></tr>
<tr><td>pattern</td><td>Shaped pattern and symbol-to-ingredient mapping generated from the grid; spaces are empty slots.</td></tr>
<tr><td>key</td><td>Shaped pattern and symbol-to-ingredient mapping generated from the grid; spaces are empty slots.</td></tr>
<tr><td>shapelessIngredients</td><td>Shapeless ingredient list; repeated slots count as separate ingredients.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/avaritia" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
