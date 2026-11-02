<h1 id="just-dire-things" data-toc-id="just-dire-things">Just Dire Things</h1>
<p>Edit native Just Dire Things recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>justdirethings</td></tr>
<tr><td>Build dependency version</td><td>1.5.7</td></tr>
<tr><td>VSR optional dependency range</td><td>[1.5.7,1.6)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Goo Spread</td><td>justdirethings:goospread</td></tr>
<tr><td>Goo Spread (Block Tag)</td><td>justdirethings:goospread_tag</td></tr>
<tr><td>Fluid Drop</td><td>justdirethings:fluiddrop</td></tr>
<tr><td>Ability Upgrade</td><td>justdirethings:ability</td></tr>
<tr><td>Paxel Assembly</td><td>justdirethings:paxel</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a goospread transformation, preserve valid block states and adjust tier/duration. fluiddrop requires a source-fluid block and catalyst item; start ability upgrades from an existing valid recipe.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="extended-ingredients" data-toc-id="extended-ingredients">Extended ingredients</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>value</td><td>The item, tag or other supported value of this ingredient.</td></tr>
<tr><td>customJson</td><td>Native extended ingredient definition preserved during import until explicitly replaced.</td></tr>
</tbody></table>
<h3 id="ability-and-paxel-smithing" data-toc-id="ability-and-paxel-smithing">Ability and paxel smithing</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>template</td><td>Pickaxe ingredient for a paxel recipe; required.</td></tr>
<tr><td>base</td><td>Ability upgrade base must support Just Dire Things abilities; paxel uses its matching tool ingredient.</td></tr>
<tr><td>addition</td><td>A valid ability-upgrade item for ability recipes, or the matching tool ingredient for paxel.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h3 id="block-and-fluid-transformation" data-toc-id="block-and-fluid-transformation">Block and fluid transformation</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>nativeId</td><td>Native transformation recipe ID; preserve the imported relationship to the editor entry ID.</td></tr>
<tr><td>input</td><td>Input block state; fluiddrop requires a source-fluid block.</td></tr>
<tr><td>inputTag</td><td>Block tag used by goospread_tag.</td></tr>
<tr><td>output</td><td>Non-air output block state.</td></tr>
<tr><td>catalyst</td><td>Catalyst item required by fluiddrop.</td></tr>
<tr><td>tier</td><td>Goo transformation tier, from 1 to 4.</td></tr>
<tr><td>duration</td><td>Transformation duration in ticks, minimum 1.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>ability calculates its result through native ability logic; retain a valid base and upgrade ingredient. The paxel template slot represents the pickaxe ingredient in this adapter.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/justdirethings" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
