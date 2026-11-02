<h1 id="farm--charm--bakery" data-toc-id="farm--charm--bakery">Farm &amp; Charm / Bakery</h1>
<p>Edit native Farm &amp; Charm / Bakery recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>bakery</td></tr>
<tr><td>Build dependency version</td><td>2.1.7</td></tr>
<tr><td>VSR optional dependency range</td><td>[2.1.7,2.2)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<p><strong>Related dependencies: </strong>Requires Farm &amp; Charm and the dependencies of this Bakery build.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Baking station</td><td>bakery:baking_station</td></tr>
<tr><td>Blank cake interaction</td><td>bakery:blank_cake_interaction</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Edit the ingredients and cake output of baking_station. For blank-cake interaction, create blank_cake_interaction, choose CAKE and configure the held ingredient, replacement block, consumption and cooldown.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="baking-station" data-toc-id="baking-station">Baking station</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>inputs</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>inputSlots</td><td>Baking station input slots; the recipe requires 1–3 ingredients.</td></tr>
</tbody></table>
<h3 id="cake-interaction" data-toc-id="cake-interaction">Cake interaction</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>stage</td><td>Interaction stage: CAKE, CUPCAKE or COOKIE.</td></tr>
<tr><td>input</td><td>Held item/tag that triggers this cake interaction, with ingredient alternatives.</td></tr>
<tr><td>priority</td><td>Signed interaction priority used by the native rule selection.</td></tr>
<tr><td>replaceBlock</td><td>Whether to replace the targeted cake block.</td></tr>
<tr><td>block</td><td>Replacement block ID, used when replacement is enabled.</td></tr>
<tr><td>patchState</td><td>Whether to patch cake-type state on the current block.</td></tr>
<tr><td>cake</td><td>Cake, cupcake and cookie flags used when patchState is enabled.</td></tr>
<tr><td>cupcake</td><td>Cake, cupcake and cookie flags used when patchState is enabled.</td></tr>
<tr><td>cookie</td><td>Cake, cupcake and cookie flags used when patchState is enabled.</td></tr>
<tr><td>returnItem</td><td>Whether the interaction returns an item.</td></tr>
<tr><td>item</td><td>Returned item ID, for example bakery:jar.</td></tr>
<tr><td>playSound</td><td>Whether to play the configured interaction sound.</td></tr>
<tr><td>sound</td><td>Registered sound event ID, used when custom sound is enabled.</td></tr>
<tr><td>consumeOne</td><td>Whether to consume one held ingredient.</td></tr>
<tr><td>particles</td><td>Whether the interaction emits particles.</td></tr>
<tr><td>cooldownTicks</td><td>Interaction cooldown in ticks, minimum 0.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>This page covers the Farm &amp; Charm based Bakery branch; older namesakes and other-loader builds require separate verification.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/bakery" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
