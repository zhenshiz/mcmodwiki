<h1 id="ae2--neo-eco" data-toc-id="ae2--neo-eco">AE2 / Neo ECO</h1>
<p>Edit native AE2 / Neo ECO recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>neoecoae</td></tr>
<tr><td>Build dependency version</td><td>21.2.14</td></tr>
<tr><td>VSR optional dependency range</td><td>[21.2.14,)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<p><strong>Related dependencies: </strong>AE2 ≥ 19.2.17 and LDLib2 ≥ 2.2.40.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Cooling</td><td>neoecoae:cooling</td></tr>
<tr><td>Integrated workstation</td><td>neoecoae:integrated_working_station</td></tr>
<tr><td>Large integrated workstation</td><td>neoecoae:large_integrated_working_station</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose an integrated workstation with iron input, gold output, energy 1000 and processingTicks 100. Test cooling fluids with a separate cooling entry, which has its own parameter set.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="cooling-and-integrated-workstations" data-toc-id="cooling-and-integrated-workstations">Cooling and integrated workstations</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>input / output</td><td>Input and optional output fluid for cooling, in mB.</td></tr>
<tr><td>coolant</td><td>Native coolant value, minimum 0.</td></tr>
<tr><td>max_overclock</td><td>Maximum cooling overclock value, minimum 0.</td></tr>
<tr><td>inputItems</td><td>Item/tag inputs and counts for integrated and large integrated workstations.</td></tr>
<tr><td>inputFluid</td><td>Optional integrated-workstation fluid input in mB; imported extended ingredients are preserved.</td></tr>
<tr><td>itemOutput / fluidOutput</td><td>Integrated-workstation item/fluid results; at least one valid input and one valid output are required.</td></tr>
<tr><td>energy</td><td>Integrated-workstation energy cost, minimum 0.</td></tr>
<tr><td>processingTicks</td><td>Integrated-workstation duration in ticks, minimum 1.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>The large integrated workstation has its own recipe type but currently uses the integrated workstation icon; distinguish them by the full type ID.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/neoecoae" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
