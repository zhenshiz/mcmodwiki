<h1 id="ars-nouveau" data-toc-id="ars-nouveau">Ars Nouveau</h1>
<p>Edit native Ars Nouveau recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>ars_nouveau</td></tr>
<tr><td>Build dependency version</td><td>5.13.3</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Enchanting Apparatus</td><td>ars_nouveau:enchanting_apparatus</td></tr>
<tr><td>Magic Armor Upgrade</td><td>ars_nouveau:armor_upgrade</td></tr>
<tr><td>Enchanting</td><td>ars_nouveau:enchantment</td></tr>
<tr><td>Imbuement</td><td>ars_nouveau:imbuement</td></tr>
<tr><td>Glyph Crafting</td><td>ars_nouveau:glyph</td></tr>
<tr><td>Crush</td><td>ars_nouveau:crush</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose imbuement with lapis input, amethyst shard output and source 500. Add any pedestal ingredients and verify actual Source use.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="enchanting-apparatus" data-toc-id="enchanting-apparatus">Enchanting apparatus</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>reagent</td><td>Central reagent or main ingredient, separate from pedestal ingredients.</td></tr>
<tr><td>pedestalItems</td><td>Pedestal ingredient list; slot order and optional slots follow the current recipe canvas.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>sourceCost</td><td>Source cost in Ars Nouveau native units.</td></tr>
<tr><td>keepNbtOfReagent</td><td>Whether input data components transfer to the output; check names, enchantments and other desired data with an existing recipe.</td></tr>
</tbody></table>
<h3 id="armor-upgrading" data-toc-id="armor-upgrading">Armor upgrading</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>pedestalItems</td><td>Pedestal ingredient list; slot order and optional slots follow the current recipe canvas.</td></tr>
<tr><td>sourceCost</td><td>Source cost in Ars Nouveau native units.</td></tr>
<tr><td>tier</td><td>Target armor upgrade tier.</td></tr>
</tbody></table>
<h3 id="crushing-output" data-toc-id="crushing-output">Crushing output</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>item</td><td>Concrete item stack for this crushing output.</td></tr>
<tr><td>chance</td><td>Output chance; typical floating-point values range from 0 to 1, with 1 guaranteed. Percentage fields are noted separately.</td></tr>
<tr><td>maxRange</td><td>Maximum amount of this crushing output, not a distance.</td></tr>
</tbody></table>
<h3 id="crush-glyph" data-toc-id="crush-glyph">Crush glyph</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>input</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>outputs</td><td>Output list; edit each item, count and any chance offered by this recipe type.</td></tr>
<tr><td>skipBlockPlace</td><td>Skip placing the result as a block during the crush effect.</td></tr>
</tbody></table>
<h3 id="enchantment" data-toc-id="enchantment">Enchantment</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>pedestalItems</td><td>Pedestal ingredient list; slot order and optional slots follow the current recipe canvas.</td></tr>
<tr><td>enchantment</td><td>Registered enchantment ID chosen with the enchantment selector.</td></tr>
<tr><td>level</td><td>Target enchantment level, paired with the enchantment ID.</td></tr>
<tr><td>sourceCost</td><td>Source cost in Ars Nouveau native units.</td></tr>
</tbody></table>
<h3 id="glyph-scribing" data-toc-id="glyph-scribing">Glyph scribing</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>inputs</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>exp</td><td>Experience required by the native GlyphRecipe for scribing.</td></tr>
</tbody></table>
<h3 id="imbuement" data-toc-id="imbuement">Imbuement</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>input</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>pedestalItems</td><td>Pedestal ingredient list; slot order and optional slots follow the current recipe canvas.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>source</td><td>Source consumed by an imbuement recipe.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>Armor upgrades, enchantment and glyph recipes carry native behavior. The list contains the six registered editor types; unused classes/constants do not create additional entries.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/ars_nouveau" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
