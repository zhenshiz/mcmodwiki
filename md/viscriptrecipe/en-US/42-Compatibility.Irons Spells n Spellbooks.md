<h1 id="irons-spells-n-spellbooks" data-toc-id="irons-spells-n-spellbooks">Irons Spells n Spellbooks</h1>
<p>Edit native Irons Spells n Spellbooks recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>irons_spellbooks</td></tr>
<tr><td>Build dependency version</td><td>1.21.1-3.16.3</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Alchemist Cauldron: Fill</td><td>irons_spellbooks:alchemist_cauldron_fill</td></tr>
<tr><td>Alchemist Cauldron: Empty</td><td>irons_spellbooks:alchemist_cauldron_empty</td></tr>
<tr><td>Alchemist Cauldron: Brew</td><td>irons_spellbooks:alchemist_cauldron_brew</td></tr>
<tr><td>No-Addition Smithing</td><td>irons_spellbooks:smithing_transform_no_addition</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose cauldron fill with a water bucket input, empty bucket return and 1000 mB water. Brewing uses a separate brew type with its own base fluid and fluid outputs.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="alchemist-cauldron" data-toc-id="alchemist-cauldron">Alchemist cauldron</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Used by</th><th>Purpose and entry</th></tr>
<tr><td>input</td><td>This recipe or structure</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>result</td><td>This recipe or structure</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>fluid</td><td>alchemist_cauldron_fill, alchemist_cauldron_empty</td><td>Fluid type and amount in mB for fill/empty operations.</td></tr>
<tr><td>baseFluid</td><td>alchemist_cauldron_brew</td><td>Base fluid required for alchemist brewing.</td></tr>
<tr><td>resultFluids</td><td>alchemist_cauldron_brew</td><td>Fluid outputs produced by alchemist brewing.</td></tr>
<tr><td>byproduct</td><td>alchemist_cauldron_brew</td><td>Optional item byproduct where supported.</td></tr>
<tr><td>mustFitAll</td><td>alchemist_cauldron_brew</td><td>Whether all fluid outputs must fit completely.</td></tr>
<tr><td>sound</td><td>This recipe or structure</td><td>Sound event ID used by this alchemist operation.</td></tr>
</tbody></table>
<h3 id="smithing-without-addition" data-toc-id="smithing-without-addition">Smithing without addition</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>template</td><td>Smithing base, template or addition; edit the matching slot.</td></tr>
<tr><td>base</td><td>Smithing base, template or addition; edit the matching slot.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/irons_spellbooks" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
