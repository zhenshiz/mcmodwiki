<h1 id="viscriptlib-overview" data-toc-id="viscriptlib-overview">ViScriptLib overview</h1>
<p><strong>ViScriptLib (VSL)</strong> provides shared editor, data and utility features for the ViScript mod family. This wiki covers the common editor workflow, desktop windows, AI assistance, and the responsibilities of addon developers.</p>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Installation</div><div data-type="admonition-content"><p>ViScript family mods bundle VSL through Jar-in-Jar. When using those mods, a separate VSL download is unnecessary. Install LDLib2 and other dependencies required by the relevant mod.</p>
</div></div>
<h2 id="choose-your-starting-point" data-toc-id="choose-your-starting-point">Choose your starting point</h2>
<ul>
<li><p><a href="?file=&quot;Learning Path&quot;">Learning path</a> for pack authors and new editor users.</p></li>
<li><p><a href="?file=&quot;Editor-Basics&quot;">Editor basics</a> for local saves, runtime exports and server uploads.</p></li>
<li><p><a href="?file=&quot;Editor.Desktop Windows and Layout&quot;">Desktop windows and layout</a> for detaching the editor or individual panels.</p></li>
<li><p><a href="?file=&quot;AI.Connection and Edit Preferences&quot;">AI setup</a> followed by <a href="?file=&quot;AI.Preview Apply and Undo&quot;">preview, apply and undo</a>.</p></li>
<li><p><a href="?file=&quot;Developers.Editor and AI Integration&quot;">Developer integration</a> for custom editors and domain adapters.</p></li>
</ul>
<h2 id="shared-capabilities" data-toc-id="shared-capabilities">Shared capabilities</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
<tbody>
<tr><th>Area</th><th>What VSL provides</th></tr>
<tr><td>Editors and files</td><td>FunctionFileEditor uses one editable runtime file. ProjectFileEditor keeps an editable project separate from generated runtime data.</td></tr>
<tr><td>Windows and AI</td><td>Shared editor settings, an AI chat window, isolated draft previews and whole-turn history through domain adapters; native window support comes from LDLib2.</td></tr>
<tr><td>Search components</td><td>Typed selectors for registered items, blocks, entities, fluids, tags and loaded JSON resources.</td></tr>
<tr><td>Items and containers</td><td>Item matching, counting, removal and output routing with optional container adapters. Output overflow is handled by the configured fallback.</td></tr>
<tr><td>Missing items</td><td>ViScriptItemStack preserves unresolved IDs and components behind a placeholder until the author replaces them or restores the missing content.</td></tr>
<tr><td>Player stages</td><td>Persistent stage flags and editable stage restrictions shared by participating mods; KubeJS bindings are available when installed.</td></tr>
<tr><td>Data and RPC</td><td>Helpers for early accessor registration, serialization and common NBT, codec and text operations. Base persistence and RPC facilities build on LDLib2.</td></tr>
</tbody>
</table>
<h2 id="what-each-addon-supplies" data-toc-id="what-each-addon-supplies">What each addon supplies</h2>
<p>The owning mod defines how to open its editor, the project type, file extensions, runtime compilation, validation and reload behavior. VSL does not introduce one universal command that opens every series editor. Use the entry point documented by the mod you are editing.</p>
<p>Related guides: <a href="?file=&quot;Learning Path&quot;">Learning Path</a> · <a href="?file=&quot;Editor-Basics&quot;">Editor-Basics</a> · <a href="?file=&quot;Editor.Desktop Windows and Layout&quot;">Desktop Windows and Layout</a> · <a href="?file=&quot;AI.Connection and Edit Preferences&quot;">Connection and Edit Preferences</a> · <a href="?file=&quot;Troubleshooting and Saving&quot;">Troubleshooting and Saving</a></p>
