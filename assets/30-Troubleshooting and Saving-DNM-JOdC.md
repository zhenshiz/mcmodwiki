<h1 id="troubleshooting-and-saving" data-toc-id="troubleshooting-and-saving">Troubleshooting and saving</h1>
<p>Identify whether a problem occurs during connection, generation, preview or publication. A completion message in chat is not by itself evidence that the project or server content has been saved.</p>
<h2 id="find-the-failing-stage" data-toc-id="find-the-failing-stage">Find the failing stage</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
<tbody>
<tr><th>Symptom</th><th>Check</th><th>Next action</th></tr>
<tr><td>Cannot find AI preferences</td><td>File → Settings → AI, rather than the top AI menu.</td><td>The top AI menu opens chat.</td></tr>
<tr><td>Send is unavailable</td><td>AI enabled, nonempty model ID and no active request.</td><td>Apply the connection preferences or stop/wait for the current request.</td></tr>
<tr><td>Connection/authentication failure</td><td>Running service, correct endpoint, key and model access.</td><td>Check your service contract. The default localhost address does not install a service.</td></tr>
<tr><td>Protocol or parameter rejection</td><td>Protocol, model ID and supported effort level.</td><td>Choose the matching protocol and reset effort to the default first.</td></tr>
<tr><td>Chat works but editing does not</td><td>Project-edit preference and current domain adapter.</td><td>Read its supported operations; edit unsupported fields manually.</td></tr>
<tr><td>Generation exceeds timeout seconds</td><td>Whether meaningful response/tool progress continues.</td><td>Timeout limits idle time, not the total turn. Stop if you no longer need it.</td></tr>
<tr><td>Image paste fails</td><td>Image clipboard content and Linux clipboard utilities.</td><td>Copy an image again; check wl-paste or xclip where applicable.</td></tr>
<tr><td>Thumbnail exists but service rejects it</td><td>Image-input support in the chosen model/service.</td><td>Use an image-capable endpoint/model or send text without the attachment.</td></tr>
<tr><td>No confirmation preview</td><td>Whether edits were produced, validation succeeded, or confirmation is off.</td><td>Read tool records and native history; the turn may already have auto-applied.</td></tr>
<tr><td>Save/upload is disabled</td><td>An AI preview is awaiting a decision.</td><td>Apply or discard the preview first.</td></tr>
<tr><td>Cannot revert the turn</td><td>Later edits or a project-state mismatch.</td><td>Undo subsequent changes in native history first.</td></tr>
<tr><td>Desktop host switch unavailable</td><td>Fullscreen state and supported LDLib2/window integration.</td><td>Use windowed Minecraft and the owning mod’s editor entry point.</td></tr>
<tr><td>Chat opens inside the game</td><td>The platform may have refused a native window or shared graphics context.</td><td>Use the fallback dialog; if it still occurs in windowed mode, inspect client window-creation logs.</td></tr>
<tr><td>Scaled interface no longer fits</td><td>Which main or floating window was adjusted.</td><td>Lower the target window’s scale or enlarge it.</td></tr>
</tbody>
</table>
<h2 id="check-before-saving" data-toc-id="check-before-saving">Check before saving</h2>
<div currentstep="0" data-type="steps">
<div data-type="step-item"><div data-type="admonition-title">Inspect the project</div><div data-type="admonition-content"><p>Read the actual fields, graph and item data in the main editor; use the AI summary as supporting information.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Save the local file</div><div data-type="admonition-content"><p>Apply a pending draft, then Save or Save as. Keep an editable project file for split-project editors.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Verify runtime content</div><div data-type="admonition-content"><p>Export/upload the runtime file and follow the owning mod’s reload flow. Uploading only an editable project does not publish runtime data.</p>
</div></div>
</div>
<h2 id="what-survives-a-restart" data-toc-id="what-survives-a-restart">What survives a restart</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
<tbody>
<tr><th>Data</th><th>Storage/lifetime</th><th>Keep it by</th></tr>
<tr><td>Saved project/runtime files</td><td>The owning mod’s local or server directories.</td><td>Saving normally and keeping useful backups.</td></tr>
<tr><td>AI settings and key</td><td>Current instance config/ldlib2/editor.json.</td><td>Applying preferences; remove keys before sharing the file.</td></tr>
<tr><td>Chat, images and unsent attachments</td><td>Editor-session memory.</td><td>Copying important text separately and saving project results.</td></tr>
<tr><td>Pending AI preview</td><td>Temporary confirmation state.</td><td>Applying and saving, or discarding. Closing the owning editor retracts it.</td></tr>
<tr><td>Native undo history</td><td>Current editor instance.</td><td>Use saved copies for durable backups rather than relying on restart persistence.</td></tr>
</tbody>
</table>
<h2 id="missing-items" data-toc-id="missing-items">Missing items</h2>
<p>For placeholder barriers and unresolved item warnings, follow the <a href="?file=&quot;Editor-Basics&quot;">missing-item and backup workflow</a>. Preserving unresolved data helps when restoring missing dependencies. Replacing it, through AI or manually, changes that original reference.</p>
<p>Related guides: <a href="?file=&quot;Learning Path&quot;">Learning Path</a> · <a href="?file=&quot;Editor-Basics&quot;">Editor-Basics</a> · <a href="?file=&quot;Editor.Desktop Windows and Layout&quot;">Desktop Windows and Layout</a> · <a href="?file=&quot;AI.Connection and Edit Preferences&quot;">Connection and Edit Preferences</a> · <a href="?file=&quot;Troubleshooting and Saving&quot;">Troubleshooting and Saving</a></p>
