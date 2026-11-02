<h1 id="desktop-windows-and-layout" data-toc-id="desktop-windows-and-layout">Desktop windows and layout</h1>
<p>Move the whole editor beside the game, or detach just an inspector, resource or history view. Both arrangements keep using the current project and make more room for content creation.</p>
<h2 id="choose-the-window-operation" data-toc-id="choose-the-window-operation">Choose the window operation</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
<tbody>
<tr><th>Operation</th><th>Result</th><th>Use it for</th></tr>
<tr><td>Shrink or minimize inside the game</td><td>The editor remains managed by the game window; available buttons depend on the addon.</td><td>Expose part of the game or its item list.</td></tr>
<tr><td>Detach the whole editor</td><td>A complete editor in a movable, resizable desktop window.</td><td>Working beside the game or on a second display.</td></tr>
<tr><td>Float one view</td><td>A separate desktop panel while other views stay in the editor.</td><td>Move the inspector aside to leave more canvas space.</td></tr>
</tbody>
</table>
<h2 id="move-the-whole-editor" data-toc-id="move-the-whole-editor">Move the whole editor</h2>
<div currentstep="0" data-type="steps">
<div data-type="step-item"><div data-type="admonition-title">Use windowed Minecraft</div><div data-type="admonition-content"><p>Host switching can be unavailable in fullscreen or on an unsupported window backend.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Use the host-switch button</div><div data-type="admonition-content"><p>At the top right, use the button whose tooltip opens the editor in an OS window. The current project and unsaved edits move with it.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Arrange the desktop window</div><div data-type="admonition-content"><p>Drag the system title bar or edges. Move it to another display if desired, then choose a readable UI scale.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Dock into the game</div><div data-type="admonition-content"><p>Use the corresponding dock-into-game button. The same editor and project return without reimporting the file.</p>
</div></div>
</div>
<p>The Appearance setting for opening in an OS window remembers the host preference. The title-bar switch updates that preference too. Window bounds are workspace state, separate from project content.</p>
<h2 id="float-a-single-view" data-toc-id="float-a-single-view">Float a single view</h2>
<div currentstep="0" data-type="steps">
<div data-type="step-item"><div data-type="admonition-title">Open the view-tab menu</div><div data-type="admonition-content"><p>Right-click the inspector, resource or history tab. The editor must retain that view and permit floating.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Float in a new window</div><div data-type="admonition-content"><p>Choose the float-in-new-window action and arrange the panel beside the main editor.</p>
</div></div>
<div data-type="step-item"><div data-type="admonition-title">Dock it back</div><div data-type="admonition-content"><p>Use the floating view tab or title context menu to dock back into the editor. Closing this floating view window also docks its view back.</p>
</div></div>
</div>
<h2 id="set-scale-for-each-window" data-toc-id="set-scale-for-each-window">Set scale for each window</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
<tbody>
<tr><th>Surface</th><th>Control</th><th>Effect</th></tr>
<tr><td>Editor inside the game</td><td>View → UI scale</td><td>Changes the game-hosted editor scale; leaving the editor restores the prior game scale.</td></tr>
<tr><td>Whole editor in a desktop window</td><td>That editor’s View → UI scale</td><td>Changes its desktop-window scale.</td></tr>
<tr><td>A floating view</td><td>View context menu → Window scale</td><td>Changes that floating panel independently.</td></tr>
</tbody>
</table>
<p>Follow-game, automatic and explicit numeric scales serve different layouts. A very small window can temporarily use a lower effective scale so its contents fit. If the interface is crowded, enlarge the window or reduce its scale.</p>
<h2 id="docking-closing-and-saving" data-toc-id="docking-closing-and-saving">Docking, closing and saving</h2>
<p>Docking changes the host. Closing the whole editor follows its close flow and may require a decision about unsaved work. Use the dock action when your goal is to return to the game, then save through the <a href="?file=&quot;Editor-Basics&quot;">normal file workflow</a>.</p>
<p>AI chat has its own window, independently of the main editor host. JEI, EMI and REI overlays attached to the game container do not automatically move into the desktop editor. Dock back and use the owning mod’s editor entry point when you need those interactions.</p>
<p>Native window support comes from LDLib2. If the controls are absent, check the installed dependency, fullscreen state and whether the owning mod uses the corresponding editor window wrapper.</p>
<p>Related guides: <a href="?file=&quot;Learning Path&quot;">Learning Path</a> · <a href="?file=&quot;Editor-Basics&quot;">Editor-Basics</a> · <a href="?file=&quot;Editor.Desktop Windows and Layout&quot;">Desktop Windows and Layout</a> · <a href="?file=&quot;AI.Connection and Edit Preferences&quot;">Connection and Edit Preferences</a> · <a href="?file=&quot;Troubleshooting and Saving&quot;">Troubleshooting and Saving</a></p>
