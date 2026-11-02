<h1 id="ae2--base-recipes" data-toc-id="ae2--base-recipes">AE2 / Base Recipes</h1>
<p>Edit native AE2 / Base Recipes recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>ae2</td></tr>
<tr><td>Build dependency version</td><td>19.2.17</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Inscriber</td><td>ae2:inscriber</td></tr>
<tr><td>Charger</td><td>ae2:charger</td></tr>
<tr><td>Item Transformation</td><td>ae2:transform</td></tr>
<tr><td>Entropy Manipulator</td><td>ae2:entropy</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose Inscriber; set ae2:silicon in the middle, ae2:silicon_press above and leave the bottom empty. Output ae2:printed_silicon with consumePresses disabled. Verify the press remains after crafting.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="charger" data-toc-id="charger">Charger</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>input</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h3 id="entropy-manipulator" data-toc-id="entropy-manipulator">Entropy manipulator</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>heat</td><td>Entropy heating or cooling mode; the same input may have different results in each mode.</td></tr>
<tr><td>inputBlockEnabled</td><td>Whether the input block or fluid is constrained; disabled means unconstrained.</td></tr>
<tr><td>inputBlock</td><td>Input-matching or output-replacement block ID; enable the corresponding switch first.</td></tr>
<tr><td>inputFluidEnabled</td><td>Whether the input block or fluid is constrained; disabled means unconstrained.</td></tr>
<tr><td>inputFluid</td><td>Fluid type matched or replaced by entropy; this is not an mB consumption amount.</td></tr>
<tr><td>outputBlockEnabled</td><td>Whether to change the output block/fluid; disabled leaves it unchanged. Select air or empty fluid explicitly to clear it.</td></tr>
<tr><td>outputBlock</td><td>Input-matching or output-replacement block ID; enable the corresponding switch first.</td></tr>
<tr><td>outputFluidEnabled</td><td>Whether to change the output block/fluid; disabled leaves it unchanged. Select air or empty fluid explicitly to clear it.</td></tr>
<tr><td>outputFluid</td><td>Fluid type matched or replaced by entropy; this is not an mB consumption amount.</td></tr>
<tr><td>keepBlockProperties</td><td>Retain compatible state properties from the original block or fluid.</td></tr>
<tr><td>keepFluidProperties</td><td>Retain compatible state properties from the original block or fluid.</td></tr>
<tr><td>inputBlockProperties</td><td>Input state constraints supporting single values, multiple values or ranges.</td></tr>
<tr><td>inputFluidProperties</td><td>Input state constraints supporting single values, multiple values or ranges.</td></tr>
<tr><td>outputBlockProperties</td><td>Output state assignments; outputs use explicit state values.</td></tr>
<tr><td>outputFluidProperties</td><td>Output state assignments; outputs use explicit state values.</td></tr>
<tr><td>drops</td><td>Additional item drops and counts produced by the entropy operation.</td></tr>
</tbody></table>
<h3 id="ingredient-alternatives" data-toc-id="ingredient-alternatives">Ingredient alternatives</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>alternatives</td><td>Alternative ingredients for one slot, combined with OR. Put simultaneously required inputs in separate slots.</td></tr>
</tbody></table>
<h3 id="inscriber" data-toc-id="inscriber">Inscriber</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>middle</td><td>Required middle inscriber ingredient.</td></tr>
<tr><td>top</td><td>Upper or lower inscriber press/ingredient; leave an unused slot empty.</td></tr>
<tr><td>bottom</td><td>Upper or lower inscriber press/ingredient; leave an unused slot empty.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>consumePresses</td><td>Consume top and bottom presses when enabled; otherwise retain them.</td></tr>
</tbody></table>
<h3 id="state-matching" data-toc-id="state-matching">State matching</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>name</td><td>Block/fluid state property such as lit or level, selected from registered properties.</td></tr>
<tr><td>mode</td><td>SINGLE for one value, MULTIPLE for allowed values, RANGE for lower and upper bounds.</td></tr>
<tr><td>value</td><td>Value for single matching or an output assignment.</td></tr>
<tr><td>values</td><td>Allowed values for multiple-value matching.</td></tr>
<tr><td>min</td><td>Range bounds using values accepted by the selected state property.</td></tr>
<tr><td>max</td><td>Range bounds using values accepted by the selected state property.</td></tr>
</tbody></table>
<h3 id="item-transformation" data-toc-id="item-transformation">Item transformation</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>inputs</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>explosion</td><td>Transformation trigger: explosion when enabled, fluid environment otherwise.</td></tr>
<tr><td>fluidTag</td><td>Required fluid tag for non-explosion transformation, e.g. minecraft:water.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>This menu lists the four AE2 addons with actual dedicated editors. Dependencies such as ExtendedAE, Applied Enhancements and ThunderboltCore do not imply a separate VSR editor for those mods.</p>
<h2 id="ae2-addon-pages" data-toc-id="ae2-addon-pages">AE2 addon pages</h2>
<ul>
<li><p><a href="?file=&quot;Compatibility.AE2.Crystal Science&quot;">Crystal Science</a></p>
</li>
<li><p><a href="?file=&quot;Compatibility.AE2.Lightning Craft&quot;">Lightning Craft</a></p>
</li>
<li><p><a href="?file=&quot;Compatibility.AE2.Neo ECO&quot;">Neo ECO</a></p>
</li>
<li><p><a href="?file=&quot;Compatibility.AE2.OmniSequence&quot;">OmniSequence</a></p>
</li>
</ul>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/ae2" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
