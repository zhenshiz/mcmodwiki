<h1 id="editor-basics" data-toc-id="editor-basics">Editor basics</h1>
<p>This page explains how to use the LDLib2 editors that follow the ViScriptLib (VSL) file workflow: getting to know the interface, opening and saving files, exporting runtime data, uploading to a server, and handling items that cannot be resolved. It applies to the editors of several add-on mods; nodes, fields, and business rules are documented by each mod itself.</p>
<p>Editor tutorials of other ViScript-family mods reference this page as their basics guide: it only covers the file and window operations shared by all editors, so you can read it once before opening any mod's tutorial.</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Applicable environment</div>
  <div data-type="admonition-content">
    <p>This tutorial is written against the current VSL workspace: Minecraft 1.21.1, the NeoForge 21.1 series, and the LDLib2 2.2.40 editor. Add-on mods may adjust the layout, add menus, or hide some windows, so the actual interface is defined by that mod.</p>
  </div>
</div>

<h2 id="know-the-two-editor-types-first" data-toc-id="know-the-two-editor-types-first">Know the two editor types first</h2>
<p>Before you start, check which kind of file the editor saves. The canvas or forms of the two editor types can look similar, but "save" means different things.</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr><th>Editor mode</th><th>File relationship</th><th>What "save" writes</th><th>When it is used</th></tr>
    <tr><td>Function-file editors</td><td>There is only one function file; the edited file is also the file used at runtime.</td><td>A local function file, for example .shop.</td><td>The editor does not need to keep pre-compilation project data.</td></tr>
    <tr><td>Project-file editors</td><td>The project file keeps editable data, and the function file is generated from the project.</td><td>A local project file, for example .questproj; runtime files must be exported or uploaded separately.</td><td>The editor needs to store blueprints, layouts, or other authoring data.</td></tr>
  </tbody>
</table>
<p>VSL provides the common File menu and path rules for both modes. The add-on mod decides the concrete file extension, what is edited, how the editor is opened, and whether an extra reload or publish step is needed after uploading.</p>

<h2 id="getting-to-know-the-editor-interface" data-toc-id="getting-to-know-the-editor-interface">Getting to know the editor interface</h2>
<ul>
  <li><p><strong>Top menus</strong>: usually "File" and "View"; editors that follow the VSL file workflow also show "Abnormal Items" and, depending on the mode, an "Upload" menu.</p></li>
  <li><p><strong>Main editing area</strong>: where the current project is edited. It may be a node graph, a form, or another view, depending on the add-on mod.</p></li>
  <li><p><strong>Inspector</strong>: shows the parameters of the selected editable object; some mods place it on the right or replace it with their own property area.</p></li>
  <li><p><strong>Resource and history views</strong>: LDLib2 editors can provide resource browsing and edit history; add-on mods may remove views they do not need, so not seeing them is not a malfunction.</p></li>
  <li><p><strong>Window buttons</strong>: close, minimize, and window-size buttons depend on the window the editor uses and the mod's layout settings.</p></li>
</ul>
<p>The project types in "File → New" are also provided by the add-on mod. After creating a project, do the authoring in the main editing area; this tutorial only covers the common file operations.</p>

<h2 id="common-file-menu-operations" data-toc-id="common-file-menu-operations">Common File menu operations</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr><th>Menu operation</th><th>Effect</th><th>When to use</th></tr>
    <tr><td>New</td><td>Creates a new project supported by the current editor.</td><td>Start authoring from a blank project.</td></tr>
    <tr><td>Open</td><td>Reads a file from the local directory of the current editor, filtered by extension.</td><td>Continue editing an existing file.</td></tr>
    <tr><td>Recent projects</td><td>Reopens a valid local file recently used by this editor; the list can also be cleared from the menu.</td><td>You edit the same file back and forth often.</td></tr>
    <tr><td>Save</td><td>Overwrites the currently linked local file; the first save enters the Save As flow.</td><td>Keep the current editing result.</td></tr>
    <tr><td>Save As</td><td>Chooses a new local file name or location and saves a copy of the current project.</td><td>Create a copy or start a new version.</td></tr>
    <tr><td>Export runtime file</td><td>Generates a local function file from the project; only provided by project-file editors.</td><td>Turn an editable project into a runtime file.</td></tr>
    <tr><td>Export data to clipboard</td><td>Copies the serialized data of the current project.</td><td>Temporarily exchange or inspect project data.</td></tr>
    <tr><td>Import data from clipboard</td><td>Replaces the current editing content with clipboard data.</td><td>Use only after confirming the data source and format.</td></tr>
  </tbody>
</table>
<p>"Open", "Save", and "Save As" operate on <strong>local files of the current client</strong>. On a multiplayer server they never touch server files automatically; data used by the server must be submitted through the matching "Upload" menu.</p>
<p>LDLib2 editors also provide configurable shortcuts: by default <code>Ctrl+S</code> saves, <code>Ctrl+Shift+S</code> saves as, <code>Ctrl+Z</code> undoes, and <code>Ctrl+Y</code> or <code>Ctrl+Shift+Z</code> redoes. Copy, cut, and paste use <code>Ctrl+C</code>, <code>Ctrl+X</code>, and <code>Ctrl+V</code>. Shortcuts apply to the view that currently has focus; the actual bindings can be viewed and changed in the editor's "File → Settings".</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Importing from the clipboard replaces the current content</div>
  <div data-type="admonition-content">
    <p>Save the current project before using "Import data from clipboard". The import creates a new in-memory project and replaces what you are editing; mismatched or corrupted data can also fail to parse.</p>
  </div>
</div>

<h2 id="workflow-for-function-file-editors" data-toc-id="workflow-for-function-file-editors">Workflow for function-file editors</h2>
<p>This mode has only one file. Taking <code>.shop</code> as an example, the file the editor opens and saves is the function file itself; there is no separate <code>.shopproj</code> project file.</p>
<div currentstep="0" data-type="steps">
  <div data-type="step-item"><div data-type="admonition-title">Create or open a file</div><div data-type="admonition-content"><p>Choose a project type from "File → New", or use "File → Open" to select an existing function file. The open dialog starts in that mod's function file directory and filters by the extensions the current editor supports.</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">Edit the content</div><div data-type="admonition-content"><p>Modify content in the main editing area; fields, canvas operations, and validation rules follow the owning mod's tutorial.</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">Save the local file</div><div data-type="admonition-content"><p>Use "File → Save" or "Save As". The first save asks for a file name; afterwards "Save" writes back to the current local file.</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">Upload to the server when needed</div><div data-type="admonition-content"><p>If the editor provides "Upload → Upload to server", fill in the file name and submit. Wait for the server's "created" or "overwritten" result, then verify the content took effect the way that mod describes.</p></div></div>
</div>
<p>Local files live in <code>ldlib2/assets/&lt;modid&gt;/&lt;domain&gt;/</code> of the current game instance. The actual extension and directory name are decided by the add-on mod.</p>

<h2 id="workflow-for-project-file-editors" data-toc-id="workflow-for-project-file-editors">Workflow for project-file editors</h2>
<p>This mode has two files. The <strong>project file</strong> keeps the original data for continued editing; the <strong>function file</strong> is generated from the project and used by the mod at runtime. Taking <code>.questproj</code> and <code>.quest</code> as an example, saving the project does not produce a new runtime file.</p>
<div currentstep="0" data-type="steps">
  <div data-type="step-item"><div data-type="admonition-title">Create or open a project</div><div data-type="admonition-content"><p>Create a project from "File → New", or use "File → Open" to select a local project file. The open dialog filters by the current editor's project extension.</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">Edit and save the project</div><div data-type="admonition-content"><p>When the content is done, "Save" or "Save As" first. This keeps the data needed to continue editing, such as the original blueprint and editor information.</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">Generate the runtime file</div><div data-type="admonition-content"><p>If you need a local file, choose "File → Export runtime file"; to submit directly to the server, use "Upload → Upload function file". Both generate runtime data from the current project.</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">Keep a server-side project copy</div><div data-type="admonition-content"><p>When you want to continue editing from the server later, additionally use "Upload project file". "Upload project and function files" submits both files under the same base file name, finishing save and publish in one step.</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">Check the server results</div><div data-type="admonition-content"><p>Wait for the server to report each file's write result; if the mod requires a reload, reopening a screen, or re-granting content, follow that mod's documentation.</p></div></div>
</div>
<p>The project file's local directory is <code>ldlib2/assets/&lt;modid&gt;/project/</code>, and the runtime file's local directory is <code>ldlib2/assets/&lt;modid&gt;/&lt;domain&gt;/</code>. The project extension is derived from the function file extension, for example <code>.quest</code> corresponds to <code>.questproj</code>. Multiple editors can share the same mod's <code>project</code> directory and tell files apart by extension when opening.</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Saving the project and publishing are two steps</div>
  <div data-type="admonition-content">
    <p>Saving or uploading only the project file does not give the server a new runtime file. Export or upload the function file as needed, and confirm the actually loaded version on the server.</p>
  </div>
</div>

<h2 id="uploading-to-the-server" data-toc-id="uploading-to-the-server">Uploading to the server</h2>
<ul>
  <li><p>The "Upload" menu only shows the actions the current editor provides. Function-file editors usually have a single upload action; project-file editors can provide three: upload project, upload function file, and upload both.</p></li>
  <li><p>VSL's common upload requires server permission level 4. Without it, the server returns a rejection message.</p></li>
  <li><p>After clicking upload, "Upload request sent" appears first; once the write actually succeeds, the server's created or overwritten result arrives. If it reports failure, the server result is authoritative.</p></li>
  <li><p>Server files are written to <code>ldlib2/assets/&lt;modid&gt;/project/</code> or <code>ldlib2/assets/&lt;modid&gt;/&lt;domain&gt;/</code> under that server's game directory. Files with the same name are overwritten.</p></li>
  <li><p>Use only letters, digits, underscores, hyphens, and dots in upload file names. VSL's common upload normalizes the name by stripping directory parts and replacing other characters; do not treat the input box as a place for absolute server paths.</p></li>
</ul>
<p>For published content, a successful upload only proves the file was written; whether the mod reloads the file immediately is documented by that mod itself.</p>

<h2 id="windows-and-views" data-toc-id="windows-and-views">Windows and views</h2>
<p>The "View" menu adjusts the editor's UI zoom. An LDLib2 editor can include the main view, inspector, resources, and history areas; add-on mods may rearrange or remove them. To edit an object's parameters, select the object first, then open the property view that mod keeps.</p>
<p>Some editors use VSL extended windows that shrink to a chosen screen region to reveal the game UI or another mod's item list; they may also keep LDLib2's default maximize and restore buttons. Minimizing, shrinking the window, and closing the editor all <strong>do not save the file for you</strong>. Finish editing by saving in the current mode first, then export or upload.</p>

<h2 id="unresolvable-items-and-backups" data-toc-id="unresolvable-items-and-backups">Unresolvable items and backups</h2>
<p>For projects that store items with the VSL abnormal-item data type, opening a local file shows a warning when an item, component, or enchantment cannot be resolved in the current environment. Choosing "Back up and open" first creates a <code>.missing-items-backup</code> backup next to the original file, then shows the abnormal items as barrier placeholders; canceling opens nothing and writes no backup.</p>
<p>Placeholders keep the complete original data. If a mod is only temporarily missing, keep the placeholders and reopen the file after the dependency returns; deliberately replacing a placeholder with another item overwrites the original content it preserved.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Batch deletion modifies the current project</div>
  <div data-type="admonition-content">
    <p>"Abnormal Items → Batch delete missing item IDs" removes every matching item of the selected IDs from the current in-memory project. It does not write to disk immediately, but the next save overwrites the file; make sure a backup exists before using it.</p>
  </div>
</div>

<h2 id="frequently-asked-questions" data-toc-id="frequently-asked-questions">Frequently asked questions</h2>
<h3 id="saved-so-why-cant-the-server-see-the-changes" data-toc-id="saved-so-why-cant-the-server-see-the-changes">Saved, so why can't the server see the changes?</h3>
<p>First confirm whether you saved a local file or a server file. Function-file editors need to upload the function file when an upload action is provided; project-file editors must additionally confirm the runtime function file was uploaded, not just the project file. If the server reports a successful write but the content is still stale, check whether that mod requires a reload.</p>
<h3 id="why-is-there-no-save-in-the-file-menu" data-toc-id="why-is-there-no-save-in-the-file-menu">Why is there no "Save" in the File menu?</h3>
<p>When no project is open, or the current project is not linked to a local file yet, the menu may only show "Save As". Create or open a project first, then use "Save As" to establish the local file; "Save" becomes available afterwards.</p>
<h3 id="why-does-the-upload-menu-have-no-matching-action" data-toc-id="why-does-the-upload-menu-have-no-matching-action">Why does the Upload menu have no matching action?</h3>
<p>The Upload menu is generated from the actions the current project and add-on mod provide. Confirm a project is open; if a function-file editor still has no upload option, that mod may not provide the common upload — follow that mod's own publishing process.</p>
