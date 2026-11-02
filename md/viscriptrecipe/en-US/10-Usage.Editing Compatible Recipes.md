<h1 id="editing-compatible-recipes" data-toc-id="editing-compatible-recipes">Editing compatible recipes</h1>
<p>Start with <a href="?file=&quot;Compatibility Index&quot;">the compatibility index</a> to locate the mod, check supported types and versions, then use this workflow to edit, upload and verify.</p>
<h2 id="distinguish-the-three-identifiers" data-toc-id="distinguish-the-three-identifiers">Distinguish the three identifiers</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Name</th><th>Meaning</th><th>Example</th></tr>
<tr><td>Mod ID</td><td>Determines whether the optional adapter loads.</td><td>ae2cs</td></tr>
<tr><td>Editor type ID</td><td>Selects the recipe model in the editor; it may differ from the native serializer ID.</td><td>ae2cs:circuit_etcher</td></tr>
<tr><td>Recipe ID</td><td>Unique name of one world recipe, used for import, replace and delete.</td><td>my_pack:circuit_example</td></tr>
</tbody></table>
<h2 id="from-creation-to-applying" data-toc-id="from-creation-to-applying">From creation to applying</h2>
<div currentstep="0" data-type="steps">
<div data-type="step-item"><div data-type="admonition-title">Open the editor</div><div data-type="admonition-content"><p>Enter a world and run /viscript_recipe editor with permission level 4. Create a ViScript recipe file or open an existing .recipe.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Select workstation and type</div><div data-type="admonition-content"><p>Search by mod, workstation name or full ID. Only installed, successfully loaded integrations appear. A workstation may offer several recipe types.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Create or import</div><div data-type="admonition-content"><p>Use Add for a new recipe. After importing a loaded recipe, check Replace and the original ID. Switching type applies defaults, so select the right type first.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Edit slots and properties</div><div data-type="admonition-content"><p>Select an editable item/fluid/chemical/other slot to edit its properties. Click empty canvas space for recipe-level properties. Right-click clears a slot; Shift-left-drag copies compatible item slots.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Save and upload</div><div data-type="admonition-content"><p>Save .recipe. For a dedicated server, also use Upload recipe file so it reaches server-side ldlib2/assets/viscript_recipe/recipes.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Reload and verify</div><div data-type="admonition-content"><p>Run /viscript_recipe reload delta, inspect failures with /viscript_recipe status and server logs, then complete an operation at the native workstation.</p>
</div></div>
</div>
<h2 id="counts-tags-and-units" data-toc-id="counts-tags-and-units">Counts, tags and units</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Meaning</th></tr>
<tr><td>Alternatives in one slot</td><td>Alternatives mean OR; two simultaneously required materials belong in two slots.</td></tr>
<tr><td>Tags</td><td>Tag previews rotate matching values but save the tag ID. Item, block, fluid, chemical, entity and structure tags belong to different registries.</td></tr>
<tr><td>Input counts</td><td>Counts affect consumption only when the native recipe supports them; a normal vanilla Ingredient does not imply multiple items.</td></tr>
<tr><td>tick</td><td>Game ticks: 20 ticks are about one second at normal TPS. Goety seconds-based fields are noted on its page.</td></tr>
<tr><td>mB</td><td>Fluid amount; usually 1000 mB per bucket. Exact matching/tag support follows the recipe type.</td></tr>
<tr><td>Chances and weights</td><td>Floating-point chance (0–1), percentage (0–100) and relative weights are distinct. Follow the integration page.</td></tr>
<tr><td>Total energy and energy per tick</td><td>Total costs and per-tick rates have different meanings; do not copy values between them blindly.</td></tr>
</tbody></table>
<h2 id="imports-and-extended-predicates" data-toc-id="imports-and-extended-predicates">Imports and extended predicates</h2>
<p>Import candidates come from the current client RecipeManager. JEI dynamic pages, Data Maps and standalone viewer objects may not be normal importable recipes. Adapters may preserve native composite definitions or reject recipes that cannot be mapped losslessly; follow the integration page and actual error.</p>
<p>A preserved ingredient’s preview item does not replace its original predicate. Use an explicit Replace ingredient action to simplify it. After editing component predicates, native JSON or field mappings, inspect the result to ensure constraints are retained.</p>
<h2 id="choose-a-reload-mode" data-toc-id="choose-a-reload-mode">Choose a reload mode</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Command</th><th>Purpose</th></tr>
<tr><td>/viscript_recipe reload delta</td><td>Frequent previews; incrementally syncs recipes/JEI without vanilla recipe-book or tag updates. Falls back when needed.</td></tr>
<tr><td>/viscript_recipe reload</td><td>Sync the complete recipe set and vanilla recipe book.</td></tr>
<tr><td>/viscript_recipe reload full</td><td>Also sync tags in addition to the normal recipe update.</td></tr>
<tr><td>/viscript_recipe status</td><td>Inspect file/entry/applied/skipped/failed counts and use file names/recipe IDs in logs to troubleshoot.</td></tr>
</tbody></table>
<h2 id="troubleshooting" data-toc-id="troubleshooting">Troubleshooting</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Symptom</th><th>What to check</th></tr>
<tr><td>Missing workstation</td><td>Check mod ID, Minecraft, loader, version and dependencies. Installing AE2 does not automatically support unregistered addons.</td></tr>
<tr><td>Missing recipe properties</td><td>Click empty canvas space; a selected ingredient shows only its properties. Machine icons, fuel and JEI hints may be read-only.</td></tr>
<tr><td>Server unchanged after save</td><td>Upload to the server directory and reload; a client-side save is not automatically applied.</td></tr>
<tr><td>Original recipe remains after deleting an editor entry</td><td>Removing an editor entry only removes that file edit. To remove a world recipe, keep an entry with Delete operation and the correct target ID.</td></tr>
<tr><td>Applied successfully but machine rejects it</td><td>Check native environment, tier, research, souls, mold, input components and machine caches, then test an actual operation.</td></tr>
</tbody></table>
<p><a href="?file=&quot;Introduction&quot;">Return to the full introduction, commands and vanilla recipe guide</a></p>
