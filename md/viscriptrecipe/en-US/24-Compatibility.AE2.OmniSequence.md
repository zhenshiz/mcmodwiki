<h1 id="ae2--omnisequence" data-toc-id="ae2--omnisequence">AE2 / OmniSequence</h1>
<p>Edit native AE2 / OmniSequence recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>molecularmanipulator</td></tr>
<tr><td>Build dependency version</td><td>2.0.12</td></tr>
<tr><td>VSR optional dependency range</td><td>[2.0.12,)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<p><strong>Related dependencies: </strong>AE2 ≥ 19.2.17, ExtendedAE ≥ 1.21-2.2.32-neoforge, Applied Enhancements ≥ 1.1.2 and LDLib2 ≥ 2.2.18.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Matter Fabrication</td><td>molecularmanipulator:matter_fabrication</td></tr>
<tr><td>Matter Research</td><td>molecularmanipulator:matter_research</td></tr>
<tr><td>Machine Recipe Import</td><td>molecularmanipulator:matter_machine_import</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose matter fabrication with 1 iron ingot input, 1 gold ingot output, processing_time 400 and ae_per_tick 64. Verify processing with research disabled, then configure research and unlocks.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="matter-fabrication" data-toc-id="matter-fabrication">Matter fabrication</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>ingredients / catalysts</td><td>Separate ingredient and catalyst lists; each row has an ingredient predicate and count.</td></tr>
<tr><td>count</td><td>Positive ingredient count; research costs use long integers and support large amounts.</td></tr>
<tr><td>processing_time</td><td>Fabrication processing time in ticks, minimum 1.</td></tr>
<tr><td>ae_per_tick</td><td>AE consumed per tick, a finite nonnegative decimal; not the total recipe energy.</td></tr>
<tr><td>results</td><td>Item output list, resized with the count control and edited slot by slot.</td></tr>
<tr><td>fluid_input / fluid_result</td><td>One exact input/output fluid stack in mB; fluid tags are unsupported.</td></tr>
<tr><td>ae_inputs / ae_outputs</td><td>AE resource lists; item/fluid resources can be edited while third-party resource kinds are preserved.</td></tr>
<tr><td>Resource amount</td><td>Positive long-integer resource amount in the native unit for that resource kind.</td></tr>
<tr><td>requires_research</td><td>Whether the corresponding research must be completed.</td></tr>
<tr><td>List limits</td><td>Ingredients, catalysts and AE inputs share 12 entries; item results and AE outputs each allow up to 6 entries.</td></tr>
</tbody></table>
<h3 id="research-and-research-depths" data-toc-id="research-and-research-depths">Research and research depths</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>title</td><td>Research title or translation key.</td></tr>
<tr><td>duration</td><td>Research duration in ticks, minimum 1.</td></tr>
<tr><td>ae_per_tick</td><td>Finite nonnegative research AE cost per tick.</td></tr>
<tr><td>stage / sort_order</td><td>Nonnegative research stage and signed native sorting order.</td></tr>
<tr><td>ingredients</td><td>Research ingredients and long-integer amounts, edited through slots/list entries.</td></tr>
<tr><td>prerequisites</td><td>Prerequisite research IDs.</td></tr>
<tr><td>prerequisite_levels</td><td>Prerequisite research IDs mapped to minimum depth levels, minimum 0.</td></tr>
<tr><td>unlocks</td><td>Native recipe/entry IDs unlocked by this research.</td></tr>
<tr><td>required_mods</td><td>Required mod IDs, distinct from recipe IDs.</td></tr>
<tr><td>depths</td><td>Research depth list, up to 256 entries, one depth per entry.</td></tr>
<tr><td>material_multiplier / parallel / speed_multiplier</td><td>Per-depth material multiplier, parallelism and speed multiplier; each is a long integer of at least 1.</td></tr>
<tr><td>processing_ticks</td><td>Per-depth processing ticks, minimum 0; zero follows native research semantics.</td></tr>
<tr><td>custom_costs / ingredients</td><td>Enable custom costs to supply that depth with a separate ingredient list; disabling restores inherited costs.</td></tr>
</tbody></table>
<h3 id="machine-import-declarations" data-toc-id="machine-import-declarations">Machine import declarations</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or control</th><th>Purpose and entry</th></tr>
<tr><td>machine</td><td>Machine item ID to integrate, such as minecraft:furnace.</td></tr>
<tr><td>serializers</td><td>Source recipe serializer IDs, such as minecraft:smelting; not individual recipe IDs.</td></tr>
<tr><td>processing_time / ae_per_tick</td><td>Processing duration and AE-per-tick cost for imported machine recipes.</td></tr>
<tr><td>inputs / outputs mapping</td><td>Optional input/output mapping switches; disabling leaves native automatic detection.</td></tr>
<tr><td>items / fluids / resources</td><td>JSON field paths for each resource category, e.g. /ingredients or /result, matching the source serializer.</td></tr>
<tr><td>ae_keys</td><td>Extended AE-key mappings preserved during import; the UI shows their count.</td></tr>
<tr><td>research</td><td>Embedded research configuration using the research parameters above.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>matter_machine_import declares machines and serializers for OmniSequence to import; it does not create a generic VSR editor for arbitrary other mods.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/omnisequence" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
