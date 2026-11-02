<h1 id="immersive-engineering" data-toc-id="immersive-engineering">Immersive Engineering</h1>
<p>Edit native Immersive Engineering recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>immersiveengineering</td></tr>
<tr><td>Build dependency version</td><td>12.4.2-194</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Immersive Engineering: Coke Oven</td><td>immersiveengineering:coke_oven</td></tr>
<tr><td>Immersive Engineering: Alloy Smelter</td><td>immersiveengineering:alloy</td></tr>
<tr><td>Immersive Engineering: Blast Furnace</td><td>immersiveengineering:blast_furnace</td></tr>
<tr><td>Immersive Engineering: Blast Furnace Fuel</td><td>immersiveengineering:blast_furnace_fuel</td></tr>
<tr><td>Immersive Engineering: Garden Cloche</td><td>immersiveengineering:cloche</td></tr>
<tr><td>Immersive Engineering: Fertilizer</td><td>immersiveengineering:fertilizer</td></tr>
<tr><td>Immersive Engineering: Metal Press</td><td>immersiveengineering:metal_press</td></tr>
<tr><td>Immersive Engineering: Crusher</td><td>immersiveengineering:crusher</td></tr>
<tr><td>Immersive Engineering: Sawmill</td><td>immersiveengineering:sawmill</td></tr>
<tr><td>Immersive Engineering: Engineer&#x27;s Workbench</td><td>immersiveengineering:blueprint</td></tr>
<tr><td>Immersive Engineering: Squeezer</td><td>immersiveengineering:squeezer</td></tr>
<tr><td>Immersive Engineering: Fermenter</td><td>immersiveengineering:fermenter</td></tr>
<tr><td>Immersive Engineering: Refinery</td><td>immersiveengineering:refinery</td></tr>
<tr><td>Immersive Engineering: Arc Furnace</td><td>immersiveengineering:arc_furnace</td></tr>
<tr><td>Immersive Engineering: Mixer</td><td>immersiveengineering:mixer</td></tr>
<tr><td>Immersive Engineering: Bottling Machine</td><td>immersiveengineering:bottling_machine</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a metal-press recipe, retain its single mold item and adjust the input count and energy. Verify mold, consumption and output in the press. For a cloche, initially preserve imported clocheRender.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="machine-parameters" data-toc-id="machine-parameters">Machine parameters</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Used by</th><th>Purpose and entry</th></tr>
<tr><td>inputs</td><td>This recipe or structure</td><td>Type-specific ingredients, soil, catalyst or mold; a metal-press mold must be one concrete item.</td></tr>
<tr><td>outputs</td><td>This recipe or structure</td><td>Main/byproduct outputs; some types support tag-based outputs and byproduct chances.</td></tr>
<tr><td>fluidInputs</td><td>This recipe or structure</td><td>Fluid input list; set each fluid or supported tag and its amount in mB.</td></tr>
<tr><td>fluidInputCodecs</td><td>This recipe or structure</td><td>Native fluid ingredient definitions preserved during import until edited.</td></tr>
<tr><td>fluidOutput</td><td>This recipe or structure</td><td>Fluid stack or list of stacks; outputs use concrete fluids and amounts in mB.</td></tr>
<tr><td>time</td><td>alloy, arc_furnace, blast_furnace, blast_furnace_fuel, cloche, coke_oven</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>energy</td><td>arc_furnace, crusher, fermenter, metal_press, mixer, refinery, sawmill, squeezer</td><td>Energy required by one recipe operation, in the native mod unit.</td></tr>
<tr><td>creosote</td><td>coke_oven</td><td>Coke-oven creosote output in mB, minimum 0.</td></tr>
<tr><td>growthModifier</td><td>fertilizer</td><td>Fertilizer growth multiplier; positive, with an editor range of 0.01–1000.</td></tr>
<tr><td>blueprintCategory</td><td>blueprint</td><td>Blueprint category string, such as components, matching an existing category.</td></tr>
<tr><td>clocheRender</td><td>cloche</td><td>Cloche render-definition JSON controlling crop appearance, separate from the output ID.</td></tr>
<tr><td>recycling</td><td>arc_furnace</td><td>Whether the arc furnace uses recycling-recipe behavior.</td></tr>
<tr><td>arcSpecialType</td><td>arc_furnace</td><td>Arc-furnace special recipe type string; leave empty for a normal recipe.</td></tr>
<tr><td>recyclingAmounts</td><td>arc_furnace</td><td>Fractional amounts for recycling outputs, distinct from normal integer stack counts.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/immersive_engineering" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
