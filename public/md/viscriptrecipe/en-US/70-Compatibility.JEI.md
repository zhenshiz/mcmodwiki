<h1 id="jei-integration" data-toc-id="jei-integration">JEI integration</h1>
<p>JEI provides item dragging, recipe layouts and display updates after reload. It is optional for editing and does not automatically create editors for unsupported native recipes.</p>
<p><a href="?file=&quot;Compatibility Index&quot;">Return to the compatibility index</a></p>
<h2 id="compatible-version" data-toc-id="compatible-version">Compatible version</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Item</th><th>Value</th></tr>
<tr><td>Mod ID</td><td>jei</td></tr>
<tr><td>Build dependency version</td><td>19.53.0.425</td></tr>
<tr><td>Platform reference</td><td>Minecraft 1.21.1 / NeoForge</td></tr>
<tr><td>Declared range</td><td>No separate JEI bound in VSR metadata; use the build dependency as the reference.</td></tr>
</tbody></table>
<h2 id="how-to-use" data-toc-id="how-to-use">How to use</h2>
<p>Install JEI in the same client instance and open the VSR editor in a world. Drag items from JEI into compatible phantom slots, then inspect counts/tags/components in the properties pane. The canvas uses the matching JEI category layout where available.</p>
<p>To modify a loaded recipe, use VSR Import loaded recipe and its full recipe ID. A visible JEI page may use a special display object and may not be importable as a normal recipe.</p>
<h2 id="parameters-and-update-modes" data-toc-id="parameters-and-update-modes">Parameters and update modes</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody>
<tr><th>Parameter or command</th><th>Effect</th></tr>
<tr><td>/viscript_recipe reload delta</td><td>Prefers incremental updates. Special display objects, inconsistent state or large changes may cause full synchronization or a JEI rebuild.</td></tr>
<tr><td>/viscript_recipe reload</td><td>Refresh the full recipe set and vanilla recipe book.</td></tr>
<tr><td>/viscript_recipe reload full</td><td>Also synchronize tags.</td></tr>
<tr><td>recipes.showcase_only_viscript_recipes</td><td>Boolean in config/viscript_recipe_config.toml, default false. true keeps only VSR-applied RecipeManager recipes for isolated showcases; it changes available recipes and causes incremental synchronization to fall back.</td></tr>
</tbody></table>
<p>JEI cannot uniformly remove dynamic recipes outside RecipeManager. Use showcase mode when recipe isolation is intended; restore false and reload when finished.</p>
<h2 id="verification-and-troubleshooting" data-toc-id="verification-and-troubleshooting">Verification and troubleshooting</h2>
<p>After upload/reload, open JEI for the same item and check the new result, then test at the actual workstation. If display and behavior differ, inspect reload logs and whether the category uses dynamic objects. Use a normal reload when the vanilla recipe book also needs an update.</p>
<p>Without JEI, VSR still offers built-in slots, import, save, upload and server application; verify at the actual workstation.</p>
<h2 id="source-references" data-toc-id="source-references">Source references</h2>
<p><a href="https://github.com/zhenshiz/ViScriptRecipe/tree/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/compat/jei" target="_blank" rel="noopener noreferrer nofollow">JEI layouts and incremental synchronization</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/src/main/java/com/viscript_recipe/Config.java" target="_blank" rel="noopener noreferrer nofollow">Showcase configuration</a> · <a href="https://github.com/zhenshiz/ViScriptRecipe/blob/6b4a92ae7ff648d62d3e3bca3376fa44a3587253/build.gradle" target="_blank" rel="noopener noreferrer nofollow">Build dependencies</a></p>
