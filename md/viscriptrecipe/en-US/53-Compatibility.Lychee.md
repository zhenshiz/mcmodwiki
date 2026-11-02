<h1 id="lychee" data-toc-id="lychee">Lychee</h1>
<p>Edit native Lychee recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>lychee</td></tr>
<tr><td>Build dependency version</td><td>6.7.1+neoforge</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Block Interaction</td><td>lychee:block_interacting</td></tr>
<tr><td>Block Clicking</td><td>lychee:block_clicking</td></tr>
<tr><td>Item Burning</td><td>lychee:item_burning</td></tr>
<tr><td>Item Inside Block</td><td>lychee:item_inside</td></tr>
<tr><td>Anvil Crafting</td><td>lychee:anvil_crafting</td></tr>
<tr><td>Block Crushing</td><td>lychee:block_crushing</td></tr>
<tr><td>Lightning Channeling</td><td>lychee:lightning_channeling</td></tr>
<tr><td>Item Exploding</td><td>lychee:item_exploding</td></tr>
<tr><td>Block Exploding</td><td>lychee:block_exploding</td></tr>
<tr><td>Random Block Ticking</td><td>lychee:random_block_ticking</td></tr>
<tr><td>Dripstone Dripping</td><td>lychee:dripstone_dripping</td></tr>
<tr><td>Advanced Shaped Crafting</td><td>lychee:crafting</td></tr>
<tr><td>Entity Ticking</td><td>lychee:entity_ticking</td></tr>
<tr><td>Display Recipe</td><td>lychee:blank</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose block interacting with iron input and stone block_in, then add a gold-ingot drop action to post. Apply and right-click stone with iron to verify conditions/ingredients/output. Import an existing recipe for complex combinations.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="triggers-targets-and-general-parameters" data-toc-id="triggers-targets-and-general-parameters">Triggers, targets and general parameters</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>item_in</td><td>Triggering item ingredient/list, selected as an item or tag in input slots.</td></tr>
<tr><td>block_in / falling_block / landing_block</td><td>Input/falling/landing block predicates; choose any, one block or tag and state values in the rule editor.</td></tr>
<tr><td>source_block / target_block</td><td>Source and target block predicates for dripstone recipes.</td></tr>
<tr><td>entity</td><td>Entity predicate for entity-ticking recipes: any, one entity or tag; complex imported predicates are preserved.</td></tr>
<tr><td>time</td><td>Item-inside duration in ticks, minimum 0.</td></tr>
<tr><td>interval</td><td>Entity-ticking interval in ticks, minimum 1.</td></tr>
<tr><td>level_cost / material_cost</td><td>Anvil level cost, minimum 1, and material cost, minimum 0.</td></tr>
<tr><td>item_out / result</td><td>Item output for anvil/crafting recipes; other trigger types normally produce results through post actions.</td></tr>
<tr><td>pattern / key</td><td>Pattern and ingredient mapping for advanced crafting.</td></tr>
<tr><td>group / comment</td><td>Resource-ID-format group and comment text; leaving either empty removes that optional field.</td></tr>
<tr><td>ghost</td><td>Ghost/display recipe flag, using native Lychee behavior.</td></tr>
<tr><td>hide_in_viewer</td><td>Whether this recipe is hidden in the recipe viewer.</td></tr>
<tr><td>if / post / assembling</td><td>Preconditions, post-trigger actions and crafting/anvil assembly actions, edited separately in Edit rules.</td></tr>
</tbody></table>
<h3 id="action-and-condition-editor" data-toc-id="action-and-condition-editor">Action and condition editor</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>type</td><td>Registered action/condition type; switching types loads its template.</td></tr>
<tr><td>drop_item / set_item</td><td>Set an item ID, count and components to drop an item or set the target item.</td></tr>
<tr><td>drop_xp</td><td>xp is a positive integer experience amount.</td></tr>
<tr><td>execute</td><td>command text; action repeat controls repeated execution, while condition value matches a command-result range.</td></tr>
<tr><td>place / set_block / cycle_state_property</td><td>Select the block/state or the state property to cycle.</td></tr>
<tr><td>damage_item / anvil_damage_chance</td><td>damage changes durability and target selects the item; anvil damage chance ranges from 0 to 1.</td></tr>
<tr><td>delay / add_item_cooldown</td><td>Set the time; the cooldown action can also specify an item.</td></tr>
<tr><td>explode</td><td>Set explosion strength, fire behavior and block interaction: keep, destroy, destroy_with_decay or trigger_block.</td></tr>
<tr><td>move / move_towards_face</td><td>offset is x/y/z displacement; factor is the signed motion factor toward a face.</td></tr>
<tr><td>random / if</td><td>Random actions contain weighted entries; conditional branches contain conditions and then/else actions.</td></tr>
<tr><td>copy_component / remove_component / copy_durability</td><td>Configure component copying/removal or durability source and target.</td></tr>
<tr><td>weather / difficulty / direction</td><td>Choose weather, a difficulty set or a direction from the available options.</td></tr>
<tr><td>chance</td><td>Condition probability is greater than 0 and less than 1.</td></tr>
<tr><td>fall_distance / entity_health / sky_darken</td><td>Configure fall-distance, health or sky-darkness ranges; sky conditions can also require skylight.</td></tr>
<tr><td>time</td><td>Time-condition value range and period, with period at least 1.</td></tr>
<tr><td>and / or / not</td><td>Combine contextual conditions using all, any or negation.</td></tr>
<tr><td>location / is_off_item_cooldown</td><td>Location predicate or cooldown-completed condition for an item.</td></tr>
<tr><td>custom / param</td><td>Custom actions/conditions use registered IDs or parameter keys; configure these only when the native mod/script provides the implementation.</td></tr>
<tr><td>Unrecognized extensions</td><td>Preserve complex imported fields; applying still requires native recipe validation.</td></tr>
</tbody></table>
<h3 id="additional-rule-controls" data-toc-id="additional-rule-controls">Additional rule controls</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>s</td><td>Positive duration in seconds for delay and add_item_cooldown.</td></tr>
<tr><td>offsetX / offsetY / offsetZ</td><td>Integer offsets from the trigger position for block/explosion actions and location conditions.</td></tr>
<tr><td>property / reversed</td><td>State-property name and reverse-cycling switch.</td></tr>
<tr><td>radius / radius_step / fire</td><td>Positive explosion radius, radius_step increment and fire toggle.</td></tr>
<tr><td>with</td><td>Native additional movement-target string for move.</td></tr>
<tr><td>empty_weight / rolls / weight</td><td>Empty-result weight, roll-count bounds and positive integer entry weights.</td></tr>
<tr><td>component / source / target / bonus</td><td>Component name/wildcard, source/target paths and durability-copy bonus from -1 to 999.</td></tr>
<tr><td>hide / if</td><td>Action display flag and conditions applying to that individual action.</td></tr>
<tr><td>repeatable / preventSync / allowClientRun</td><td>Custom-action flags for repeatability, preventing sync and client execution; retain settings required by the implementation.</td></tr>
<tr><td>create / loot</td><td>Parameter-creation toggle and native loot string for a param condition.</td></tr>
<tr><td>min / max</td><td>Set minimum and maximum separately; leave one empty for an open bound, or use equal bounds for an exact value.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>Applying the rule dialog validates the complete native recipe. Unknown third-party conditions can remain preserved, but changing their type or replacing their template alters the definition.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/lychee" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
