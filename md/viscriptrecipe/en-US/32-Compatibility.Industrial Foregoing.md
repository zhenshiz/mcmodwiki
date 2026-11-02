<h1 id="industrial-foregoing" data-toc-id="industrial-foregoing">Industrial Foregoing</h1>
<p>Edit native Industrial Foregoing recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>industrialforegoing</td></tr>
<tr><td>Build dependency version</td><td>1.21-3.6.39</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Material StoneWork Crushing Recipe</td><td>industrialforegoing:crusher</td></tr>
<tr><td>Dissolution Chamber Recipe</td><td>industrialforegoing:dissolution_chamber</td></tr>
<tr><td>Fluid Extraction Recipe</td><td>industrialforegoing:fluid_extractor</td></tr>
<tr><td>Laser Drill Ore Recipe</td><td>industrialforegoing:laser_drill_ore</td></tr>
<tr><td>Laser Drill Fluid Recipe</td><td>industrialforegoing:laser_drill_fluid</td></tr>
<tr><td>StoneWork Generation Recipe</td><td>industrialforegoing:stonework_generate</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a dissolution-chamber recipe, change processingTime and its item result, then test the fluid-output switch. For laser drills, inspect every dimension, biome, Y-range and weight rule.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="replacement-block-state" data-toc-id="replacement-block-state">Replacement block state</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>name</td><td>Replacement block state property name/value, such as axis and y.</td></tr>
<tr><td>value</td><td>Replacement block state property name/value, such as axis and y.</td></tr>
</tbody></table>
<h3 id="crusher" data-toc-id="crusher">Crusher</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>input</td><td>Item/tag input interpreted by the native recipe.</td></tr>
<tr><td>output</td><td>Type-specific item/fluid output; crushers and laser drills can preserve native ingredient-style outputs.</td></tr>
</tbody></table>
<h3 id="dissolution-chamber" data-toc-id="dissolution-chamber">Dissolution chamber</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>input</td><td>Item/tag input interpreted by the native recipe.</td></tr>
<tr><td>inputFluid</td><td>Fluid input and amount in mB; use a concrete fluid or a tag where the type permits it.</td></tr>
<tr><td>processingTime</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>hasItemOutput</td><td>Whether the dissolution chamber produces an item or fluid; keep at least one real output.</td></tr>
<tr><td>output</td><td>Type-specific item/fluid output; crushers and laser drills can preserve native ingredient-style outputs.</td></tr>
<tr><td>hasFluidOutput</td><td>Whether the dissolution chamber produces an item or fluid; keep at least one real output.</td></tr>
<tr><td>outputFluid</td><td>Fluid stack or list of stacks; outputs use concrete fluids and amounts in mB.</td></tr>
</tbody></table>
<h3 id="entity-conditions" data-toc-id="entity-conditions">Entity conditions</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>enabled</td><td>Whether the entity condition is enabled.</td></tr>
<tr><td>kind</td><td>Entity matching mode: ENTITY or TAG.</td></tr>
<tr><td>id</td><td>Entity ID or entity tag for the selected mode.</td></tr>
<tr><td>nbt</td><td>Entity SNBT predicate text, such as {}.</td></tr>
<tr><td>display</td><td>Display name for the entity condition in the native UI.</td></tr>
</tbody></table>
<h3 id="fluid-extraction" data-toc-id="fluid-extraction">Fluid extraction</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>input</td><td>Item/tag input interpreted by the native recipe.</td></tr>
<tr><td>resultBlock</td><td>Replacement block after fluid extraction.</td></tr>
<tr><td>resultProperties</td><td>State properties of the replacement block; each property/value must be valid for it.</td></tr>
<tr><td>breakChance</td><td>Block break chance during fluid extraction, from 0 to 1.</td></tr>
<tr><td>output</td><td>Type-specific item/fluid output; crushers and laser drills can preserve native ingredient-style outputs.</td></tr>
<tr><td>defaultRecipe</td><td>Native default-recipe flag for fluid extraction.</td></tr>
</tbody></table>
<h3 id="fluid-laser-drill" data-toc-id="fluid-laser-drill">Fluid laser drill</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>output</td><td>Type-specific item/fluid output; crushers and laser drills can preserve native ingredient-style outputs.</td></tr>
<tr><td>catalyst</td><td>Laser-drill lens or catalyst ingredient.</td></tr>
<tr><td>entityCondition</td><td>Optional entity condition; enable it, choose an entity or tag and configure any SNBT.</td></tr>
<tr><td>rarity</td><td>Laser-drill distribution rules, each with biome, dimension, depth and weight settings.</td></tr>
</tbody></table>
<h3 id="ore-laser-drill" data-toc-id="ore-laser-drill">Ore laser drill</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>output</td><td>Type-specific item/fluid output; crushers and laser drills can preserve native ingredient-style outputs.</td></tr>
<tr><td>catalyst</td><td>Laser-drill lens or catalyst ingredient.</td></tr>
<tr><td>entityCondition</td><td>Optional entity condition; enable it, choose an entity or tag and configure any SNBT.</td></tr>
<tr><td>rarity</td><td>Laser-drill distribution rules, each with biome, dimension, depth and weight settings.</td></tr>
</tbody></table>
<h3 id="laser-drill-distribution-rules" data-toc-id="laser-drill-distribution-rules">Laser-drill distribution rules</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>biomeWhitelist</td><td>Allowed or excluded biome IDs.</td></tr>
<tr><td>biomeBlacklist</td><td>Allowed or excluded biome IDs.</td></tr>
<tr><td>dimensionWhitelist</td><td>Allowed or excluded dimension IDs.</td></tr>
<tr><td>dimensionBlacklist</td><td>Allowed or excluded dimension IDs.</td></tr>
<tr><td>depthMin</td><td>Minimum and maximum Y levels for the rule; keep minimum no greater than maximum.</td></tr>
<tr><td>depthMax</td><td>Minimum and maximum Y levels for the rule; keep minimum no greater than maximum.</td></tr>
<tr><td>weight</td><td>Relative laser-drill rule weight, not a percentage.</td></tr>
</tbody></table>
<h3 id="stonework-generation" data-toc-id="stonework-generation">Stonework generation</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>output</td><td>Type-specific item/fluid output; crushers and laser drills can preserve native ingredient-style outputs.</td></tr>
<tr><td>waterNeed</td><td>Water/lava amount required for stonework, in mB.</td></tr>
<tr><td>lavaNeed</td><td>Water/lava amount required for stonework, in mB.</td></tr>
<tr><td>waterConsume</td><td>Whether required water/lava is consumed rather than only checked.</td></tr>
<tr><td>lavaConsume</td><td>Whether required water/lava is consumed rather than only checked.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/industrial_foregoing" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
