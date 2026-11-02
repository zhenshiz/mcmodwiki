<h1 id="kaleidoscope-cookery" data-toc-id="kaleidoscope-cookery">Kaleidoscope Cookery</h1>
<p>Edit native Kaleidoscope Cookery recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>kaleidoscope_cookery</td></tr>
<tr><td>Build dependency version</td><td>1.5.0-neoforge+mc1.21.1</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Pot</td><td>kaleidoscope_cookery:pot</td></tr>
<tr><td>Stockpot</td><td>kaleidoscope_cookery:stockpot</td></tr>
<tr><td>Millstone</td><td>kaleidoscope_cookery:millstone</td></tr>
<tr><td>Chopping Board</td><td>kaleidoscope_cookery:chopping_board</td></tr>
<tr><td>Steamer</td><td>kaleidoscope_cookery:steamer</td></tr>
<tr><td>Teapot</td><td>kaleidoscope_cookery:teapot</td></tr>
<tr><td>Bamboo Tray</td><td>kaleidoscope_cookery:bamboo_tray</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Import a pot recipe and inspect ingredients, carrier, time and stirFryCount. Retain valid stockpot textures; for bamboo trays explicitly choose rain wetting or sunny drying.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="bamboo-tray" data-toc-id="bamboo-tray">Bamboo tray</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>subtype</td><td>Bamboo-tray processing subtype selected from the menu.</td></tr>
<tr><td>duration</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
</tbody></table>
<h3 id="chopping-board" data-toc-id="chopping-board">Chopping board</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>cutCount</td><td>Number of cuts required on the chopping board.</td></tr>
<tr><td>modelId</td><td>Chopping-board display model resource ID, separate from the output item.</td></tr>
</tbody></table>
<h3 id="millstone" data-toc-id="millstone">Millstone</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>results</td><td>Millstone outputs with per-output chances; legacy single results map to an output slot.</td></tr>
</tbody></table>
<h3 id="cooking-pot" data-toc-id="cooking-pot">Cooking pot</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>carrier</td><td>Serving carrier ingredient, such as a bowl or bottle.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>stirFryCount</td><td>Required stir-fry count for the pot.</td></tr>
</tbody></table>
<h3 id="steamer" data-toc-id="steamer">Steamer</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>cookTick</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
</tbody></table>
<h3 id="stockpot" data-toc-id="stockpot">Stockpot</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>soupBase</td><td>Base fluid ID for the stockpot.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>carrier</td><td>Serving carrier ingredient, such as a bowl or bottle.</td></tr>
<tr><td>cookingTexture</td><td>Stockpot texture resource IDs while cooking and after completion.</td></tr>
<tr><td>finishedTexture</td><td>Stockpot texture resource IDs while cooking and after completion.</td></tr>
<tr><td>cookingBubbleColor</td><td>Stockpot bubble colors while cooking and after completion.</td></tr>
<tr><td>finishedBubbleColor</td><td>Stockpot bubble colors while cooking and after completion.</td></tr>
</tbody></table>
<h3 id="teapot" data-toc-id="teapot">Teapot</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>teaFluid</td><td>Tea fluid ID used by the teapot.</td></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>time</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>Bamboo-tray wetting means rain wetting and drying means sunny drying. Millstone recipes support multiple outputs with independent chances.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/kaleidoscope_cookery" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
