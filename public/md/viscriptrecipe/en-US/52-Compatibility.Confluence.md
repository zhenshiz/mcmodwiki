<h1 id="confluence" data-toc-id="confluence">Confluence</h1>
<p>Edit native Confluence recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>confluence</td></tr>
<tr><td>Build dependency version</td><td>1.2.2-260208</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Confluence: Shimmer Transmutation</td><td>confluence:item_transmutation</td></tr>
<tr><td>Confluence: Sky Mill</td><td>confluence:sky_mill</td></tr>
<tr><td>Confluence: Altar</td><td>confluence:altar</td></tr>
<tr><td>Confluence: Hell Forge</td><td>confluence:hellforge</td></tr>
<tr><td>Confluence: Heavy Work Bench</td><td>confluence:heavy_work_bench</td></tr>
<tr><td>Confluence: Alchemy Table</td><td>confluence:alchemy_table</td></tr>
<tr><td>Confluence: Fletching Table</td><td>confluence:fletching_table</td></tr>
<tr><td>Confluence: Cooking Pot</td><td>confluence:cooking_pot</td></tr>
<tr><td>Confluence: Sawmill</td><td>confluence:sawmill</td></tr>
<tr><td>Confluence: Solidifier</td><td>confluence:solidifier</td></tr>
<tr><td>Confluence: Hardmode Anvil</td><td>confluence:hardmode_anvil</td></tr>
<tr><td>Confluence: Hardmode Forge</td><td>confluence:hardmode_forge</td></tr>
<tr><td>Confluence: Loom</td><td>confluence:loom</td></tr>
<tr><td>Confluence: Dye Vat</td><td>confluence:dye_vat</td></tr>
<tr><td>Confluence: Crystal Ball</td><td>confluence:crystal_ball</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a sky-mill recipe, first adjust item counts, then its biome/block-tag environment. Verify location, environment and progression requirements in the world.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="environment-conditions" data-toc-id="environment-conditions">Environment conditions</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>biomes</td><td>Environment biome/block/fluid set: unconstrained, explicit IDs or a tag.</td></tr>
<tr><td>inflate</td><td>Expansion radius for nearby block/fluid environment checks.</td></tr>
<tr><td>blocks</td><td>Environment biome/block/fluid set: unconstrained, explicit IDs or a tag.</td></tr>
<tr><td>statePredicates</td><td>State-property predicates that must be satisfied.</td></tr>
<tr><td>fluids</td><td>Environment biome/block/fluid set: unconstrained, explicit IDs or a tag.</td></tr>
<tr><td>graveyard</td><td>Whether a graveyard environment is required.</td></tr>
</tbody></table>
<h3 id="heat-source-conditions" data-toc-id="heat-source-conditions">Heat-source conditions</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>blocks</td><td>Environment biome/block/fluid set: unconstrained, explicit IDs or a tag.</td></tr>
<tr><td>hasState</td><td>Whether the heat-source block state is constrained.</td></tr>
<tr><td>state</td><td>Heat-source block state predicate.</td></tr>
<tr><td>hasNbt</td><td>Whether a block-entity SNBT predicate is enabled for the heat source.</td></tr>
<tr><td>nbt</td><td>Valid SNBT compound text, for example {}.</td></tr>
</tbody></table>
<h3 id="registry-sets" data-toc-id="registry-sets">Registry sets</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>kind</td><td>NONE for no constraint, IDS for explicit IDs, TAG for a tag.</td></tr>
<tr><td>tag</td><td>Tag ID in the relevant registry, used in TAG mode.</td></tr>
<tr><td>values</td><td>Explicit identifier list, used in IDS mode.</td></tr>
</tbody></table>
<h3 id="workstation-parameters" data-toc-id="workstation-parameters">Workstation parameters</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Used by</th><th>Purpose and entry</th></tr>
<tr><td>ingredients</td><td>This recipe or structure</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>This recipe or structure</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>targets</td><td>item_transmutation</td><td>Possible item-transmutation targets with individual stacks and counts.</td></tr>
<tr><td>craftingMode</td><td>heavy_work_bench, sawmill, hardmode_anvil, loom</td><td>SHAPED or SHAPELESS mode, exposed only on workstations supporting both.</td></tr>
<tr><td>width</td><td>heavy_work_bench, sawmill, hardmode_anvil, loom, solidifier</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>height</td><td>heavy_work_bench, sawmill, hardmode_anvil, loom, solidifier</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>environment</td><td>sky_mill, heavy_work_bench, crystal_ball</td><td>Environment conditions for the sky mill, heavy work bench and crystal ball.</td></tr>
<tr><td>container</td><td>cooking_pot</td><td>Container item such as a bowl or bottle; consumption follows the recipe type and its container switch.</td></tr>
<tr><td>heatSource</td><td>cooking_pot</td><td>Cooking-pot heat-source predicate combining blocks, state and SNBT.</td></tr>
<tr><td>experience</td><td>hellforge, hardmode_forge</td><td>Recipe experience reward, configured separately from output counts.</td></tr>
<tr><td>cookingTime</td><td>hellforge, hardmode_forge, cooking_pot</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>requiresFuel</td><td>hellforge, hardmode_forge</td><td>Whether fuel is required, where the selected smelting type supports it.</td></tr>
<tr><td>shrink</td><td>item_transmutation</td><td>Input quantity consumed by one transmutation, minimum 1.</td></tr>
<tr><td>gamePhase</td><td>item_transmutation</td><td>Progression gate: before/after Skeletron, Wall of Flesh, mechanical bosses, Plantera, Golem or Moon Lord.</td></tr>
</tbody></table>
<h3 id="block-state-predicates" data-toc-id="block-state-predicates">Block state predicates</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>properties</td><td>State-property predicates that must be satisfied.</td></tr>
</tbody></table>
<h3 id="state-values-and-ranges" data-toc-id="state-values-and-ranges">State values and ranges</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>name</td><td>State property name, such as lit.</td></tr>
<tr><td>ranged</td><td>Use range matching; otherwise match a single value.</td></tr>
<tr><td>value</td><td>Single matching value for the state property.</td></tr>
<tr><td>min</td><td>Lower and upper state-value bounds.</td></tr>
<tr><td>max</td><td>Lower and upper state-value bounds.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/confluence" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
