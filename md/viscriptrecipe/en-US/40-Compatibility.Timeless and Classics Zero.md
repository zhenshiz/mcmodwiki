<h1 id="timeless-and-classics-zero" data-toc-id="timeless-and-classics-zero">Timeless and Classics Zero</h1>
<p>Edit native Timeless and Classics Zero recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>tacz</td></tr>
<tr><td>Build dependency version</td><td>1.1.8-hotfix-r7</td></tr>
<tr><td>VSR optional dependency range</td><td>[1.1.8,)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Gunsmith workbench</td><td>tacz:gun_smith_table_crafting</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a workbench recipe from the active gun pack. Preserve gun/attachment identifiers in output components and change only material counts and group. Verify the same gun appears in the intended workbench category.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="workbench-ingredients" data-toc-id="workbench-ingredients">Workbench ingredients</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>value</td><td>The item, tag or other supported value of this ingredient.</td></tr>
<tr><td>count</td><td>Ingredient or output amount, separate from the number of alternatives.</td></tr>
<tr><td>customJson</td><td>Native extended ingredient definition preserved during import until explicitly replaced.</td></tr>
</tbody></table>
<h3 id="gunsmith-workbench" data-toc-id="gunsmith-workbench">Gunsmith workbench</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>materials</td><td>Workbench materials with individual counts; imported tags and extended ingredients are preserved.</td></tr>
<tr><td>result</td><td>Output gun/attachment stack; preserve gun-pack identifiers in data components, preferably by importing an existing recipe.</td></tr>
<tr><td>group</td><td>Native TACZ recipe group ID, such as tacz:misc, separate from editor file categories.</td></tr>
<tr><td>inputSlots</td><td>Number of workbench material slots; fill added slots with valid ingredients.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>This edits gunsmith recipes. Gun-pack models, ammunition definitions and weapon stats belong to the pack. Stacks sharing a base gun item can still have different pack IDs in components.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/tacz" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
