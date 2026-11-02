<h1 id="ae2--crystal-science" data-toc-id="ae2--crystal-science">AE2 / Crystal Science</h1>
<p>Edit native AE2 / Crystal Science recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>ae2cs</td></tr>
<tr><td>Build dependency version</td><td>1.2.1</td></tr>
<tr><td>VSR optional dependency range</td><td>[1.2.1,)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<p><strong>Related dependencies: </strong>AE2 ≥ 19.2.8</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Circuit etcher</td><td>ae2cs:circuit_etcher</td></tr>
<tr><td>Crystal aggregator</td><td>ae2cs:crystal_aggregator</td></tr>
<tr><td>Crystal pulverizer</td><td>ae2cs:crystal_pulverizer</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose circuit etching with an iron ingot input, gold ingot output and energy_cost 3200. After applying, verify energy use and output count; fill extra input slots for additional ingredients.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="parameters-for-all-three-workstations" data-toc-id="parameters-for-all-three-workstations">Parameters for all three workstations</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>input_a / input_b / input_c / input</td><td>Etching/aggregation have three input slots; pulverizing has input only. Choose item/tag inputs and counts with at least one valid input.</td></tr>
<tr><td>count</td><td>Required amount of each ingredient, minimum 1; counts can also be edited for preserved extended ingredients.</td></tr>
<tr><td>result</td><td>Concrete output item, count and data components.</td></tr>
<tr><td>energy_cost</td><td>Positive integer energy cost; new etching defaults to 3200, aggregation/pulverizing to 200.</td></tr>
<tr><td>Extended ingredient</td><td>Imported custom ingredients remain intact until Replace ingredient converts them to a normal item/tag.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>Editor type IDs such as ae2cs:circuit_etcher differ from native serializer IDs ending in _recipe_serializer. Use the workstation selector/importer rather than interchanging them.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/ae2cs" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
