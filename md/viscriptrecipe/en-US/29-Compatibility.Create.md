<h1 id="create" data-toc-id="create">Create</h1>
<p>Edit native Create recipes in game. This page lists editor entries, parameter meanings and a concrete editing exercise.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">All integrations and version notes</a> · <a href="?file=&quot;Usage.Editing Compatible Recipes&quot;">Common editing and apply workflow</a></p>
<h2 id="versions-and-installation" data-toc-id="versions-and-installation">Versions and installation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Checked value</th></tr>
<tr><td>Mod ID</td><td>create</td></tr>
<tr><td>Build dependency version</td><td>6.0.10-280</td></tr>
<tr><td>VSR optional dependency range</td><td>No separate lower/upper bound declared; the build dependency above is the reference.</td></tr>
</tbody></table>
<p>Versions come from dependencies and mod metadata of the NeoForge / Minecraft 1.21.1 source project. A build dependency is not a claim of runtime testing across a whole range; see the index for notation and evidence.</p>
<h2 id="supported-workstations-and-types" data-toc-id="supported-workstations-and-types">Supported workstations and types</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Workstation or recipe</th><th>Editor type ID</th></tr>
<tr><td>Crushing Wheel: Crushing</td><td>create:crushing</td></tr>
<tr><td>Millstone: Milling</td><td>create:milling</td></tr>
<tr><td>Mechanical Saw: Sawing</td><td>create:cutting</td></tr>
<tr><td>Mechanical Saw: Block Cutting</td><td>create:block_cutting</td></tr>
<tr><td>Mechanical Press: Automatic Packing</td><td>create:auto_packing</td></tr>
<tr><td>Mechanical Press: Compacting</td><td>create:compacting</td></tr>
<tr><td>Mechanical Press: Pressing</td><td>create:pressing</td></tr>
<tr><td>Sandpaper: Polishing</td><td>create:sandpaper_polishing</td></tr>
<tr><td>Encased Fan: Bulk Blasting</td><td>create:blasting</td></tr>
<tr><td>Encased Fan: Bulk Haunting</td><td>create:haunting</td></tr>
<tr><td>Encased Fan: Bulk Smoking</td><td>create:smoking</td></tr>
<tr><td>Encased Fan: Bulk Washing</td><td>create:splashing</td></tr>
<tr><td>Spout: Filling</td><td>create:filling</td></tr>
<tr><td>Item Drain: Emptying</td><td>create:emptying</td></tr>
<tr><td>Mechanical Mixer: Mixing</td><td>create:mixing</td></tr>
<tr><td>Mechanical Mixer: Automatic Shapeless</td><td>create:automatic_shapeless</td></tr>
<tr><td>Mechanical Mixer: Automatic Brewing</td><td>create:automatic_brewing</td></tr>
<tr><td>Deployer: Deploying</td><td>create:deploying</td></tr>
<tr><td>Manual Item Application</td><td>create:item_application</td></tr>
<tr><td>Mechanical Crafting</td><td>create:mechanical_crafting</td></tr>
<tr><td>Sequenced Assembly</td><td>create:sequenced_assembly</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Enter a world with the required mods and run <code>/viscript_recipe editor</code> at permission level 4. Open/create a <code>.recipe</code> file, search for a workstation by the name or full type ID above, and use Import loaded recipe for existing recipes.</p>
<h3 id="editing-exercise" data-toc-id="editing-exercise">Editing exercise</h3>
<p>Choose crushing with cobblestone input, gravel output and processingTime 100. Check chance in each output slot. For sequenced assembly, add each step and separately set loop count and final output weights.</p>
<p>Select an editable input/output/other slot to show its properties. Click empty canvas space or reselect the recipe for recipe-level properties. Use Add for new recipes; after import, check Replace and the original recipe ID.</p>
<h2 id="parameter-reference" data-toc-id="parameter-reference">Parameter reference</h2>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Editing notes</div><div data-type="admonition-content"><p>Names identify UI/native data-model parameters; edit them through the UI rather than editing binary .recipe files. Only fields exposed by the selected type apply; a shared data structure does not make every field active at once.</p>
</div></div>
<h3 id="mechanical-crafting" data-toc-id="mechanical-crafting">Mechanical crafting</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>width</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>height</td><td>Shaped grid dimensions; recheck ingredient positions and empty slots after resizing.</td></tr>
<tr><td>acceptMirrored</td><td>Whether mechanical crafting accepts a mirrored pattern.</td></tr>
<tr><td>pattern</td><td>Shaped pattern and symbol-to-ingredient mapping generated from the grid; spaces are empty slots.</td></tr>
<tr><td>key</td><td>Shaped pattern and symbol-to-ingredient mapping generated from the grid; spaces are empty slots.</td></tr>
<tr><td>result</td><td>Concrete item output and count; an output stack must resolve to an item.</td></tr>
</tbody></table>
<h3 id="processing-recipes" data-toc-id="processing-recipes">Processing recipes</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredients</td><td>Item input list; fill each slot and adjust the list with slot-count or add controls.</td></tr>
<tr><td>fluidIngredients</td><td>Fluid input list; set each fluid or supported tag and its amount in mB.</td></tr>
<tr><td>outputs</td><td>Output chance for normal processing; relative output weight for sequenced assembly. Edit each output slot.</td></tr>
<tr><td>fluidOutputs</td><td>Fluid stack or list of stacks; outputs use concrete fluids and amounts in mB.</td></tr>
<tr><td>processingTime</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>heatRequirement</td><td>NONE, HEATED or SUPERHEATED heat requirement, where supported by the processing type.</td></tr>
<tr><td>keepHeldItem</td><td>Retain the held item after deploying or manual item application.</td></tr>
</tbody></table>
<h3 id="sequenced-assembly" data-toc-id="sequenced-assembly">Sequenced assembly</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>transitionalItem</td><td>Transitional item for sequenced assembly, separate from the final result.</td></tr>
<tr><td>sequence</td><td>Ordered assembly steps; add and configure deploying, pressing, cutting or filling steps.</td></tr>
<tr><td>outputs</td><td>Output chance for normal processing; relative output weight for sequenced assembly. Edit each output slot.</td></tr>
<tr><td>loops</td><td>Number of full sequence repetitions, minimum 1.</td></tr>
</tbody></table>
<h3 id="assembly-step" data-toc-id="assembly-step">Assembly step</h3>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter</th><th>Purpose and entry</th></tr>
<tr><td>kind</td><td>Step kind: DEPLOYING, PRESSING, CUTTING or FILLING.</td></tr>
<tr><td>ingredient</td><td>Item ingredient; select an item or tag in the input slot. Counts apply only where supported by the recipe.</td></tr>
<tr><td>fluidIngredient</td><td>Fluid or tag and mB amount consumed by a sequenced filling step.</td></tr>
<tr><td>processingTime</td><td>Processing duration in game ticks; 20 ticks are about one second at normal TPS.</td></tr>
<tr><td>keepHeldItem</td><td>Retain the held item after deploying or manual item application.</td></tr>
</tbody></table>
<h2 id="usage-notes" data-toc-id="usage-notes">Usage notes</h2>
<p>Per-slot counts expand to repeated ingredients for some mixing, compacting and automatic shapeless recipes. Sequenced results use relative weights; normal processing chance is an independent probability.</p>
<p>Mechanical crafting supports up to 32×32. Add assembly steps individually and set deploying ingredients, cutting time or filling fluid. Block cutting can generate several runtime recipe IDs.</p>
<h2 id="save-and-verify" data-toc-id="save-and-verify">Save and verify</h2>
<p>Save the file; on a dedicated server, upload it to <code>ldlib2/assets/viscript_recipe/recipes</code>. Run <code>/viscript_recipe reload delta</code> and <code>/viscript_recipe status</code>, inspect failures/logs, then complete one operation at the native workstation and verify counts, conditions and consumption.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/create" target="_blank" rel="noopener noreferrer nofollow">Workstation registration, canvas parameters and native recipe construction</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/resources/META-INF/neoforge.mods.toml" target="_blank" rel="noopener noreferrer nofollow">Optional dependency declarations</a></p>
