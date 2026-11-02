<h1 id="farm--charm--base-recipes" data-toc-id="farm--charm--base-recipes">Farm &amp; Charm / Base Recipes</h1>
<p>Edit native Farm &amp; Charm / Base Recipes recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>farm_and_charm</td></tr>
<tr><td>Build dependency version</td><td>1.1.23</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Farm &amp; Charm: Cooking Pot</td><td>farm_and_charm:pot_cooking</td></tr>
<tr><td>Farm &amp; Charm: Stove</td><td>farm_and_charm:stove</td></tr>
<tr><td>Farm &amp; Charm: Crafting Bowl</td><td>farm_and_charm:crafting_bowl</td></tr>
<tr><td>Farm &amp; Charm: Roaster</td><td>farm_and_charm:roaster</td></tr>
<tr><td>Farm &amp; Charm: Silo Drying</td><td>farm_and_charm:drying</td></tr>
<tr><td>Farm &amp; Charm: Mincer</td><td>farm_and_charm:mincer</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a pot-cooking recipe and check its container. Test containerRequired and requiresLearning independently. Mincer/silo recipes use their own processingCategory.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="ingredient-alternatives" data-toc-id="ingredient-alternatives">Ingredient alternatives</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>alternatives</td><td>Alternative ingredients for one slot, combined with OR. Put simultaneously required inputs in separate slots.</td></tr>
</tbody></table>
<h3 id="workstation-parameters" data-toc-id="workstation-parameters">Workstation parameters</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Used by</th><th>Purpose and entry</th></tr>
<tr><td>inputs</td><td>This recipe or structure</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>This recipe or structure</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>container</td><td>pot_cooking, roaster</td><td>Container item such as a bowl or bottle; consumption follows the recipe type and its container switch.</td></tr>
<tr><td>containerRequired</td><td>pot_cooking</td><td>Whether pot cooking requires a container, configured separately from its item.</td></tr>
<tr><td>requiresLearning</td><td>pot_cooking, roaster, stove</td><td>Whether pot cooking, roasting or stove processing requires native recipe learning.</td></tr>
<tr><td>experience</td><td>stove</td><td>Recipe experience reward, configured separately from output counts.</td></tr>
<tr><td>processingCategory</td><td>mincer, drying</td><td>Native mincer/silo processing category string, for example MEAT.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/farm_and_charm" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
