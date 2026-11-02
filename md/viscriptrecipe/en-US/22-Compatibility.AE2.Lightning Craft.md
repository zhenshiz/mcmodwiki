<h1 id="ae2--lightning-craft" data-toc-id="ae2--lightning-craft">AE2 / Lightning Craft</h1>
<p>Edit native AE2 / Lightning Craft recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>ae2lt</td></tr>
<tr><td>Build dependency version</td><td>2.1.3</td></tr>
<tr><td>VSR optional dependency range</td><td>[2.1.3,)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<p><strong>Related dependencies: </strong>AE2 [19.2.17,19.3), ThunderboltCore [2.0.3,3.0.0), ae2wtlib_api, plus their loader dependencies.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Lightning transformation</td><td>ae2lt:lightning_transform</td></tr>
<tr><td>Lightning simulation</td><td>ae2lt:lightning_simulation</td></tr>
<tr><td>Lightning assembly</td><td>ae2lt:lightning_assembly</td></tr>
<tr><td>Overload processing</td><td>ae2lt:overload_processing</td></tr>
<tr><td>Crystal catalyzing</td><td>ae2lt:crystal_catalyzer</td></tr>
<tr><td>Firmament conversion</td><td>ae2lt:firmament_conversion</td></tr>
<tr><td>Lightning-strike structure</td><td>ae2lt:lightning_strike</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Start with lightning simulation: iron input, gold output, totalEnergy 1000, lightningCost 1 and high_voltage tier. Verify it in the matching machine. Lightning-strike structures use a separate lightning_strike recipe.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="ingredients-energy-and-outputs" data-toc-id="ingredients-energy-and-outputs">Ingredients, energy and outputs</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>inputs / count</td><td>Inputs and counts; simulation/firmament conversion allow up to 3 slots, assembly/overload up to 9. Overload may have no item inputs.</td></tr>
<tr><td>result / results</td><td>Single result for transformation/simulation/assembly; up to 4 firmament results, up to 1 optional overload item result.</td></tr>
<tr><td>priority</td><td>Signed priority for recipes other than crystal catalyzing or lightning-strike structures.</td></tr>
<tr><td>totalEnergy</td><td>Total energy for simulation, assembly or overload, minimum 5.</td></tr>
<tr><td>lightningCost</td><td>Lightning cost for simulation, assembly, overload and crystal catalyzing, minimum 1.</td></tr>
<tr><td>lightningTier</td><td>Lightning tier: high_voltage or extreme_high_voltage, where offered by the type.</td></tr>
<tr><td>processTime</td><td>Firmament conversion duration in ticks, minimum 1.</td></tr>
<tr><td>inputFluid / resultFluid</td><td>Optional overload input/output fluids in mB; crystal catalyzing offers an input fluid only.</td></tr>
</tbody></table>
<h3 id="crystal-catalyzer-parameters" data-toc-id="crystal-catalyzer-parameters">Crystal catalyzer parameters</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>mode</td><td>Native catalyzing mode: crystal or dust.</td></tr>
<tr><td>energyPerCycle</td><td>Positive energy cost per cycle, minimum 1.</td></tr>
<tr><td>catalyst / catalystCount</td><td>Catalyst enable switch, ingredient and count; disabling removes the catalyst requirement.</td></tr>
<tr><td>kind</td><td>Choose an item ID, item tag or harvested-block output, then its identifier and count.</td></tr>
<tr><td>output.count</td><td>Output amount; harvested outputs are resolved by the server after applying the recipe.</td></tr>
</tbody></table>
<h3 id="lightning-strike-structure-parameters" data-toc-id="lightning-strike-structure-parameters">Lightning-strike structure parameters</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>requires_natural_lightning</td><td>Require natural lightning.</td></tr>
<tr><td>center_input / center_output</td><td>Input and replacement block IDs at the structure center.</td></tr>
<tr><td>requirements</td><td>Surrounding block requirements, from 0 to 256 entries.</td></tr>
<tr><td>offset</td><td>Integer x, y and z offsets relative to the center.</td></tr>
<tr><td>block</td><td>Block required at the selected offset.</td></tr>
<tr><td>consume</td><td>Whether that surrounding block is consumed on success.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>Visible item/fluid slots are editing entry points; imported alternatives, components, tag outputs and harvested outputs are preserved until explicitly replaced.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/ae2lt" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
