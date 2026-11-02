<h1 id="goety" data-toc-id="goety">Goety</h1>
<p>Edit native Goety recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>goety</td></tr>
<tr><td>Build dependency version</td><td>3.0.1</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Cursed infuser</td><td>goety:cursed_infuser_recipes</td></tr>
<tr><td>Dark Ritual</td><td>goety:ritual</td></tr>
<tr><td>Necro Brazier</td><td>goety:brazier</td></tr>
<tr><td>Pulverizing</td><td>goety:pulverize</td></tr>
<tr><td>Witch Brewing</td><td>goety:brewing</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import an existing dark ritual and retain its registered ritualType. Change duration in seconds, then enable sacrifice/summoning separately using native entity tags or IDs.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="brazier" data-toc-id="brazier">Brazier</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>soulCost</td><td>Soul energy cost, separate from duration and experience levels.</td></tr>
</tbody></table>
<h3 id="brewing-cauldron" data-toc-id="brewing-cauldron">Brewing cauldron</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>effect</td><td>Registered potion-effect ID for brewing.</td></tr>
<tr><td>soulCost</td><td>Soul energy cost, separate from duration and experience levels.</td></tr>
<tr><td>capacityExtra</td><td>Additional native potion capacity parameter.</td></tr>
<tr><td>duration</td><td>Ritual or potion-effect duration in seconds, not ticks.</td></tr>
<tr><td>entityKind</td><td>Brewing entity restriction: NONE, TAG or ENTITY.</td></tr>
<tr><td>entity</td><td>Entity tag in TAG mode or one entity ID in ENTITY mode.</td></tr>
</tbody></table>
<h3 id="cursed-infuser" data-toc-id="cursed-infuser">Cursed infuser</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>cookingTime</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>grim</td><td>Grim mode for the cursed infuser.</td></tr>
</tbody></table>
<h3 id="pulverizing" data-toc-id="pulverizing">Pulverizing</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>resultKind</td><td>Pulverize result kind: ITEM or BLOCK.</td></tr>
<tr><td>itemResult</td><td>Item stack result for ITEM mode.</td></tr>
<tr><td>blockResult</td><td>Registered block ID for BLOCK mode.</td></tr>
</tbody></table>
<h3 id="dark-rituals" data-toc-id="dark-rituals">Dark rituals</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>activationItem</td><td>Central activation item for the dark altar.</td></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>craftType</td><td>Ritual environment category selected from the native enum.</td></tr>
<tr><td>ritualType</td><td>Registered ritual behavior ID, separate from the environment category.</td></tr>
<tr><td>soulCost</td><td>Soul energy cost, separate from duration and experience levels.</td></tr>
<tr><td>duration</td><td>Ritual or potion-effect duration in seconds, not ticks.</td></tr>
<tr><td>summonLife</td><td>Native summoned-life duration parameter, default -1; retain the native mod semantics when changing it.</td></tr>
<tr><td>hasSacrifice</td><td>Enable sacrifice, summoning, conversion, structure location or enchantment; fill the corresponding fields after enabling it.</td></tr>
<tr><td>entityToSacrifice</td><td>Entity tag for sacrifice or conversion targets.</td></tr>
<tr><td>entityToSacrificeDisplayName</td><td>Display text or translation key used by the native UI.</td></tr>
<tr><td>hasSummon</td><td>Enable sacrifice, summoning, conversion, structure location or enchantment; fill the corresponding fields after enabling it.</td></tr>
<tr><td>entityToSummon</td><td>Single entity ID for the summoned or converted result.</td></tr>
<tr><td>hasConversion</td><td>Enable sacrifice, summoning, conversion, structure location or enchantment; fill the corresponding fields after enabling it.</td></tr>
<tr><td>entityToConvert</td><td>Entity tag for sacrifice or conversion targets.</td></tr>
<tr><td>entityToConvertDisplayName</td><td>Display text or translation key used by the native UI.</td></tr>
<tr><td>entityToConvertInto</td><td>Single entity ID for the summoned or converted result.</td></tr>
<tr><td>hasStructure</td><td>Enable sacrifice, summoning, conversion, structure location or enchantment; fill the corresponding fields after enabling it.</td></tr>
<tr><td>structureToLocate</td><td>Structure tag to locate.</td></tr>
<tr><td>structureDisplayName</td><td>Display text or translation key used by the native UI.</td></tr>
<tr><td>hasEnchantment</td><td>Enable sacrifice, summoning, conversion, structure location or enchantment; fill the corresponding fields after enabling it.</td></tr>
<tr><td>enchantment</td><td>Registered enchantment ID chosen with the enchantment selector.</td></tr>
<tr><td>xpLevelCost</td><td>Experience levels required by the enchantment behavior.</td></tr>
<tr><td>research</td><td>Required native research identifier; empty means no research requirement.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/goety" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
