<h1 id="mekanism" data-toc-id="mekanism">Mekanism</h1>
<p>Edit native Mekanism recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>mekanism</td></tr>
<tr><td>Build dependency version</td><td>1.21.1-10.7.19.85</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Mekanism: Crushing</td><td>mekanism:crushing</td></tr>
<tr><td>Mekanism: Enriching</td><td>mekanism:enriching</td></tr>
<tr><td>Mekanism: Smelting</td><td>mekanism:smelting</td></tr>
<tr><td>Mekanism: Chemical Infusing</td><td>mekanism:chemical_infusing</td></tr>
<tr><td>Mekanism: Combining</td><td>mekanism:combining</td></tr>
<tr><td>Mekanism: Separating</td><td>mekanism:separating</td></tr>
<tr><td>Mekanism: Washing</td><td>mekanism:washing</td></tr>
<tr><td>Mekanism: Evaporating</td><td>mekanism:evaporating</td></tr>
<tr><td>Mekanism: Activating</td><td>mekanism:activating</td></tr>
<tr><td>Mekanism: Centrifuging</td><td>mekanism:centrifuging</td></tr>
<tr><td>Mekanism: Crystallizing</td><td>mekanism:crystallizing</td></tr>
<tr><td>Mekanism: Dissolution</td><td>mekanism:dissolution</td></tr>
<tr><td>Mekanism: Compressing</td><td>mekanism:compressing</td></tr>
<tr><td>Mekanism: Purifying</td><td>mekanism:purifying</td></tr>
<tr><td>Mekanism: Injecting</td><td>mekanism:injecting</td></tr>
<tr><td>Mekanism: Nucleosynthesizing</td><td>mekanism:nucleosynthesizing</td></tr>
<tr><td>Mekanism: Energy Conversion</td><td>mekanism:energy_conversion</td></tr>
<tr><td>Mekanism: Chemical Conversion</td><td>mekanism:chemical_conversion</td></tr>
<tr><td>Mekanism: Oxidizing</td><td>mekanism:oxidizing</td></tr>
<tr><td>Mekanism: Pigment Extracting</td><td>mekanism:pigment_extracting</td></tr>
<tr><td>Mekanism: Pigment Mixing</td><td>mekanism:pigment_mixing</td></tr>
<tr><td>Mekanism: Metallurgic Infusing</td><td>mekanism:metallurgic_infusing</td></tr>
<tr><td>Mekanism: Painting</td><td>mekanism:painting</td></tr>
<tr><td>Mekanism: Pressurized Reaction</td><td>mekanism:reaction</td></tr>
<tr><td>Mekanism: Condensentrating</td><td>mekanism:condensentrating</td></tr>
<tr><td>Mekanism: Decondensentrating</td><td>mekanism:decondensentrating</td></tr>
<tr><td>Mekanism: Sawing</td><td>mekanism:sawing</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a working chemical-injection recipe, check item/chemical inputs and compare consumption after changing perTickUsage. Chemical inputs must use the chemical slots.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="chemical-ingredients" data-toc-id="chemical-ingredients">Chemical ingredients</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>kind</td><td>Chemical input matching mode: CHEMICAL or TAG.</td></tr>
<tr><td>chemical</td><td>Registered chemical ID for concrete inputs or chemical outputs.</td></tr>
<tr><td>tag</td><td>Chemical tag ID, used only by TAG input matching.</td></tr>
<tr><td>amount</td><td>Native chemical amount, configured separately from fluid mB amounts.</td></tr>
</tbody></table>
<h3 id="chemical-outputs" data-toc-id="chemical-outputs">Chemical outputs</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>chemical</td><td>Registered chemical ID for concrete inputs or chemical outputs.</td></tr>
<tr><td>amount</td><td>Native chemical amount, configured separately from fluid mB amounts.</td></tr>
</tbody></table>
<h3 id="machine-parameters" data-toc-id="machine-parameters">Machine parameters</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Used by</th><th>Purpose and entry</th></tr>
<tr><td>itemInput</td><td>This recipe or structure</td><td>First or second item input, as required by the workstation; counts apply where supported.</td></tr>
<tr><td>extraItemInput</td><td>combining</td><td>First or second item input, as required by the workstation; counts apply where supported.</td></tr>
<tr><td>fluidInput</td><td>This recipe or structure</td><td>Fluid input and amount in mB; use a concrete fluid or a tag where the type permits it.</td></tr>
<tr><td>chemicalInput</td><td>This recipe or structure</td><td>First or second chemical input, using a chemical or chemical tag and an amount.</td></tr>
<tr><td>extraChemicalInput</td><td>chemical_infusing, pigment_mixing</td><td>First or second chemical input, using a chemical or chemical tag and an amount.</td></tr>
<tr><td>itemOutput</td><td>This recipe or structure</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>secondaryItemOutput</td><td>sawing</td><td>Secondary item output for the precision sawmill.</td></tr>
<tr><td>secondaryChance</td><td>sawing</td><td>Output chance; typical floating-point values range from 0 to 1, with 1 guaranteed. Percentage fields are noted separately.</td></tr>
<tr><td>fluidOutput</td><td>This recipe or structure</td><td>Fluid stack or list of stacks; outputs use concrete fluids and amounts in mB.</td></tr>
<tr><td>chemicalOutput</td><td>This recipe or structure</td><td>Primary or secondary chemical output; outputs must name a concrete chemical.</td></tr>
<tr><td>secondaryChemicalOutput</td><td>separating</td><td>Primary or secondary chemical output; outputs must name a concrete chemical.</td></tr>
<tr><td>perTickUsage</td><td>dissolution, compressing, purifying, injecting, nucleosynthesizing, metallurgic_infusing, painting</td><td>Consume chemical input per tick when enabled; offered only by supported item/chemical recipe types.</td></tr>
<tr><td>duration</td><td>nucleosynthesizing, reaction</td><td>Nucleosynthesizer or pressurized reaction duration in ticks.</td></tr>
<tr><td>energyRequired</td><td>reaction</td><td>Additional energy requirement for a pressurized reaction recipe.</td></tr>
<tr><td>energyMultiplier</td><td>separating</td><td>Energy multiplier for electrolytic separation.</td></tr>
<tr><td>energyOutput</td><td>energy_conversion</td><td>Energy supplied by an energy-conversion recipe.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/mekanism" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
