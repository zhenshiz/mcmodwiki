<h1 id="eidolon-repraised" data-toc-id="eidolon-repraised">Eidolon Repraised</h1>
<p>Edit native Eidolon Repraised recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>eidolon_repraised</td></tr>
<tr><td>Build dependency version</td><td>0.5.0.5.74</td></tr>
<tr><td>VSR optional dependency range</td><td>[0.5.0.5,)</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Crucible Brewing</td><td>eidolon_repraised:crucible</td></tr>
<tr><td>Worktable Crafting</td><td>eidolon_repraised:worktable</td></tr>
<tr><td>Dyeing (Preserve Components)</td><td>eidolon_repraised:dye</td></tr>
<tr><td>Generic Ritual</td><td>eidolon_repraised:ritual_brazier</td></tr>
<tr><td>Item Crafting Ritual</td><td>eidolon_repraised:ritual_brazier_crafting</td></tr>
<tr><td>Summoning Ritual</td><td>eidolon_repraised:ritual_brazier_summoning</td></tr>
<tr><td>Command Ritual</td><td>eidolon_repraised:ritual_brazier_command</td></tr>
<tr><td>Structure Location Ritual</td><td>eidolon_repraised:ritual_brazier_location</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a crucible recipe, check each ingredient step and stirs, then modify one step. Follow the sequence during testing. Worktable recipes additionally require a valid four-slot outer reagent configuration.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="crucible-recipe" data-toc-id="crucible-recipe">Crucible recipe</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>steps</td><td>Crucible steps, each with its own ingredients and stir count.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h3 id="crucible-step" data-toc-id="crucible-step">Crucible step</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>stirs</td><td>Required stirs for the current step, minimum 0.</td></tr>
<tr><td>items</td><td>Ingredient slots for this crucible step.</td></tr>
</tbody></table>
<h3 id="dyeing" data-toc-id="dyeing">Dyeing</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>inputs</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>group</td><td>Native recipe-book group string; this is separate from editor categories.</td></tr>
<tr><td>category</td><td>Vanilla crafting-book category; choose from the selector.</td></tr>
</tbody></table>
<h3 id="ingredient-alternatives" data-toc-id="ingredient-alternatives">Ingredient alternatives</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>alternatives</td><td>Alternative ingredients for one slot, combined with OR. Put simultaneously required inputs in separate slots.</td></tr>
</tbody></table>
<h3 id="component-matching" data-toc-id="component-matching">Component matching</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>value</td><td>The item, tag or other supported value of this ingredient.</td></tr>
<tr><td>matchComponents</td><td>Enable data-component matching for the ingredient.</td></tr>
<tr><td>strict</td><td>Whether component matching is strict, used with the component predicate.</td></tr>
<tr><td>componentPredicate</td><td>SNBT component predicate required on the input ingredient.</td></tr>
</tbody></table>
<h3 id="brazier-rituals" data-toc-id="brazier-rituals">Brazier rituals</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>reagent</td><td>Central reagent or main ingredient, separate from pedestal ingredients.</td></tr>
<tr><td>pedestals</td><td>Pedestal ingredient list; slot order and optional slots follow the current recipe canvas.</td></tr>
<tr><td>foci</td><td>Ritual focus and invariant ingredient lists, configured separately from pedestal ingredients.</td></tr>
<tr><td>invariants</td><td>Ritual focus and invariant ingredient lists, configured separately from pedestal ingredients.</td></tr>
<tr><td>healthRequirement</td><td>Required ritual health, a finite nonnegative value.</td></tr>
<tr><td>ritual</td><td>Registered ritual ID used by a generic ritual.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>keepReagentComponents</td><td>Whether input data components transfer to the output; check names, enchantments and other desired data with an existing recipe.</td></tr>
<tr><td>entity</td><td>Registered entity ID, selected from available entities rather than its display name.</td></tr>
<tr><td>summonCount</td><td>Number of summoned entities, minimum 1.</td></tr>
<tr><td>structureTag</td><td>Structure tag for a location ritual, distinct from a single structure ID.</td></tr>
<tr><td>commands</td><td>Command list, with one command executed by the ritual per entry.</td></tr>
<tr><td>symbol</td><td>Symbol texture ID for the command ritual.</td></tr>
<tr><td>color</td><td>Display color for the command ritual.</td></tr>
</tbody></table>
<h3 id="worktable" data-toc-id="worktable">Worktable</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>width</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>height</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>core</td><td>Worktable central 1–3 by 1–3 grid with at least one nonempty ingredient.</td></tr>
<tr><td>reagents</td><td>Four outer worktable reagent slots, not all empty.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/eidolon" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
