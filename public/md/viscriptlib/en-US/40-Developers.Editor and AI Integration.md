<h1 id="integrating-editors-windows-and-ai" data-toc-id="integrating-editors-windows-and-ai">Integrating editors, windows and AI</h1>
<p>This page is for addon developers. Establish manual editing, validation, saving and native history before adding AI. Keep the user-facing <a href="?file=&quot;Editor-Basics&quot;">file workflow</a> understandable throughout.</p>
<h2 id="choose-a-file-model" data-toc-id="choose-a-file-model">Choose a file model</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
<tbody>
<tr><th>Base</th><th>Data model</th><th>Addon responsibility</th></tr>
<tr><td>FunctionFileEditor</td><td>One file serves editing and runtime use.</td><td>Define the EditorFileFormat, domain directory, project creation/loading and business refresh after upload.</td></tr>
<tr><td>ProjectFileEditor</td><td>An editable project retains graph/layout or precompiled information.</td><td>Generate runtime data through IRuntimeFileProject and handle editable/runtime files separately.</td></tr>
</tbody>
</table>
<p>Use <code>EditorAssetPaths</code> and <code>EditorAssetFiles</code> for shared path, scan and resolution rules. Upload success reports file writing; compilation, loading and activation remain domain responsibilities.</p>
<h2 id="keep-the-same-window-and-project" data-toc-id="keep-the-same-window-and-project">Keep the same window and project</h2>
<p>Use <code>ViScriptEditorWindow.open(windowID, editorCreator)</code> with a stable <code>ResourceLocation</code> to retain minimized-window restoration and host switching. Returning to the game should reuse the existing editor rather than replace its unsaved project.</p>
<p>Container-menu integrations should provide <code>setGameWindowReopener(...)</code> and keep using <code>open(...)</code> from the menu factory. LDLib2 manages floating views and their scales. VSL’s optional in-game shrink bounds serve a different layout need from a desktop host window.</p>
<h2 id="provide-a-domain-adapter" data-toc-id="provide-a-domain-adapter">Provide a domain adapter</h2>
<p>Return an <code>AiEditorAdapter</code> from <code>ViScriptEditor#createAiEditorAdapter()</code>. Describe supported reads and edits in the guide and schemas, and validate through actual domain rules rather than accepting arbitrary project fields.</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
<tbody>
<tr><th>Method</th><th>Responsibility</th></tr>
<tr><td>guide()</td><td>Explain the domain, field meaning and supported operations.</td></tr>
<tr><td>readSchema() / describe(...)</td><td>Describe query arguments and return paginated domain data without keys or local paths.</td></tr>
<tr><td>editSchema() / edit(draft, arguments)</td><td>Validate structured operations, modify only the isolated draft and report actual before/after values.</td></tr>
<tr><td>createAction(editor, draft)</td><td>Build a complete undoable EditAction without modifying the project at creation time. Apply/undo refresh synchronously without recursively adding history.</td></tr>
<tr><td>setPreviewMode(editor, previewing)</td><td>Pause domain edits while allowing browsing; switching an inspected object must not create history.</td></tr>
<tr><td>refresh(editor)</td><td>Refresh views after native history navigation without adding an entry.</td></tr>
</tbody>
</table>
<h2 id="verify-observable-behavior" data-toc-id="verify-observable-behavior">Verify observable behavior</h2>
<ul>
<li><p>Queries return exact IDs, supported fields and necessary paging data.</p></li>
<li><p>Invalid arguments or failed compilation leave no partial change from that tool call.</p></li>
<li><p>Preview allows browsing; discard restores the complete previous state without history.</p></li>
<li><p>One applied turn is one history action; undo/redo restores both data and views and preserves earlier manual history.</p></li>
<li><p>Manual edits, project switching, stop and close are protected from late responses.</p></li>
<li><p>Floating, docking, closing and reopening preserve the intended editor/project state.</p></li>
</ul>
<h2 id="server-integration" data-toc-id="server-integration">Server integration</h2>
<p>Client preferences are not server authorization. Save/upload/runtime operations need trusted server-side checks for permission, target, revision and data. Client chat exposes domain project tools; it does not automatically expose server SPIs to the model.</p>
<p>For server read-only knowledge, use <code>AiKnowledgeService</code>, <code>AiQueryRequest</code> and <code>AiAccessContext</code>, reading game data on the server thread. Continue provider pagination with returned cursors and restart after environment changes. Source <code>docs/ai-integration.md</code> documents the Java contracts and extension points.</p>
<p>Related guides: <a href="?file=&quot;Learning Path&quot;">Learning Path</a> · <a href="?file=&quot;Editor-Basics&quot;">Editor-Basics</a> · <a href="?file=&quot;Editor.Desktop Windows and Layout&quot;">Desktop Windows and Layout</a> · <a href="?file=&quot;AI.Connection and Edit Preferences&quot;">Connection and Edit Preferences</a> · <a href="?file=&quot;Troubleshooting and Saving&quot;">Troubleshooting and Saving</a></p>
