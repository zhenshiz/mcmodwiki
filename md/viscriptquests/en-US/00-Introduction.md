<h1 id="vsq-user-guide" data-toc-id="vsq-user-guide">VSQ User Guide</h1>
<p>ViScriptQuests (VSQ) is a quest system built on LDLib2.
  This page covers how players view and track quests, how modpack authors build quests with the blueprint editor, and how server admins publish, debug, and maintain quest files.</p>
<h2 id="using-the-quest-book" data-toc-id="using-the-quest-book">Using the quest book</h2>
<div currentstep="4" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Bind the quest book key</div>
    <div data-type="admonition-content">
      <p>Go to "Options → Controls → Key Binds", find "Open Quest Book", and bind a key. This key is unbound by default, so you need to set it manually the first time.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Open the quest book</div>
    <div data-type="admonition-content">
      <p>Press the "Open Quest Book" key. The quest book shows categories, the quest list, and the currently selected quest; if the server provides quests, they are visible in the "All" category by default.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">View objectives and rewards</div>
    <div data-type="admonition-content">
      <p>After selecting a quest you can see its title, description, quest state, current step, objective progress, and rewards. When a small quest contains multiple objectives, they usually need to be completed in the order shown in the quest book.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Track the quest</div>
    <div data-type="admonition-content">
      <p>After clicking "Track" or "Track Quest", the current objectives sync to the HUD. The reach-location objective can also show a navigation marker; the HUD and navigation markers can be turned off separately in the client configuration.
      </p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Submit manually submittable objectives</div>
    <div data-type="admonition-content">
      <p>Item or currency objectives that require submission show a "Submit Objective" button. Items and currency can be submitted in batches; whether submission deducts items or currency is decided by the quest author in the objective node.</p>
    </div>
  </div>
</div>
<p>The quest book can be closed with
  <code>Esc</code>, the currently bound "Toggle Inventory" key, and the "Open Quest Book" key. Categories, category pages, and parts of the quest book state are saved per player and restored the next time it is opened.</p>
<p>With JEI installed, point the mouse at the icon or text of an obtain-item objective and use JEI's own "Show Recipes" or "Show Uses" key to look up the item. VSQ does not replace JEI's
  key bindings.</p>
<h2 id="quest-states-and-flow" data-toc-id="quest-states-and-flow">Quest states and flow</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>State</th>
      <th>Meaning</th>
    </tr>
    <tr>
      <td>In progress</td>
      <td>The quest has been granted and the player can advance the current step.</td>
    </tr>
    <tr>
      <td>Completed</td>
      <td>The quest flow has ended and the rewards have entered settlement.</td>
    </tr>
    <tr>
      <td>Locked</td>
      <td>The quest file exists, but the current flow has not reached that quest or step yet.</td>
    </tr>
    <tr>
      <td>Failed</td>
      <td>The quest was marked as failed by the flow or a condition.</td>
    </tr>
    <tr>
      <td>Revoked</td>
      <td>An admin or a script revoked the player's quest state.</td>
    </tr>
  </tbody>
</table>
<p>
  Blueprints can combine linear flows, conditional branches, parallel objectives, and merge nodes. The quest book shows data that has already been compiled and synced to the player at runtime; after modifying project files you need to recompile and upload the runtime files, and old quest states are not reset automatically by re-uploading.
</p>
<h2 id="creating-quests-with-the-blueprint-editor" data-toc-id="creating-quests-with-the-blueprint-editor">Creating quests with the blueprint editor</h2>
<p>The editor saves quests as node graphs. The usual authoring order is: create the quest start and end nodes first, then place the small quests, objectives, rewards, and flow-control nodes, and finally check the connections and parameters.</p>
<div currentstep="4" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Open the editor</div>
    <div data-type="admonition-content">
      <p>Run <code>/viscript_quests editor</code> in game to create or edit a project. You can also run
        <code>/viscript_quests editor &lt;project&gt;</code> to open an existing
        <code>.questproj</code> project on the server.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Build the quest flow</div>
    <div data-type="admonition-content">
      <p>Use flow-control nodes to connect quest start, small quests, conditional branches, merges, and quest end. Connect objective nodes below the small quest node, and connect reward nodes to the corresponding settlement position.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Save the editor project</div>
    <div data-type="admonition-content">
      <p>Use the editor's project save feature to keep the full blueprint. When uploading a project to the server, use the <code>.questproj</code>
        extension; this file is for continuing to edit later, not a runtime quest file that is executed directly.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Compile and upload the runtime quests</div>
    <div data-type="admonition-content">
      <p>Choosing "Upload quests to server" compiles the blueprint into a <code>.quest</code>
        file and uploads it. You can also choose to upload the project and the quests together, producing an editable project file and an executable runtime file respectively.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Reload and test</div>
    <div data-type="admonition-content">
      <p>After modifying the runtime files, run
        <code>/viscript_quests reload &lt;target&gt;</code> for the target players, then verify the quest flow with the grant, submit, or trigger commands.
      </p>
    </div>
  </div>
</div>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Subgraph limitation</div>
  <div data-type="admonition-content">
    <p>Subgraphs can be used to organize and save editor content, but the current compiler mainly traverses the root diagram. Do not leave the only copy of an objective or reward inside a subgraph, or it may not be compiled into the
      <code>.quest</code>.</p>
  </div>
</div>
<h2 id="category-configuration" data-toc-id="category-configuration">Category configuration</h2>
<p>Categories organize the major quests in the quest book. The category configuration is saved to
  <code>viscript_quests/category/categories.nbt</code> under the LDLib2 assets directory, stored by the server and synced to players.</p>
<ul>
  <li>
    <p>Run <code>/viscript_quests category config</code> to open the category configuration screen.</p>
  </li>
  <li>
    <p>Each category can set a category ID, display name, display icon, default tab background texture, and selected tab background texture.</p>
  </li>
  <li>
    <p>Fill in the major quest file IDs in the category. Quest IDs use the logical path of the runtime <code>.quest</code> file; you do not need to write surrounding quotes, nor repeat the
      <code>.quest</code> extension.</p>
  </li>
  <li>
    <p>The quest book always provides an "All" view, making it easy to find quests when the category configuration is incomplete or quests are not yet categorized. Uncategorized quests appear in the other-quests view.</p>
  </li>
</ul>
<p>Category icons and tab textures only affect quest book display; they do not change quest IDs, quest flow, or player progress. Before deleting a category, make sure its major quests have been moved to other categories.</p>
<h2 id="objective-types" data-toc-id="objective-types">Objective types</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Objective</th>
      <th>Use</th>
    </tr>
    <tr>
      <td>Item</td>
      <td>Counts items in the player's inventory, ender chest, and hooked containers; supports strict component matching, auto or manual submission, and whether submission deducts items.</td>
    </tr>
    <tr>
      <td>Currency</td>
      <td>With ViScriptShop installed, checks the balance or submits currency; supports auto submission, manual batched submission, and dynamic numeric expressions.</td>
    </tr>
    <tr>
      <td>Reach location</td>
      <td>Checks the player's dimension and coordinate radius, and can show a navigation marker together with the tracking HUD.</td>
    </tr>
    <tr>
      <td>Kill entity</td>
      <td>Accumulates kills by entity type or entity tag.</td>
    </tr>
    <tr>
      <td>Break block</td>
      <td>Accumulates broken blocks by block type.</td>
    </tr>
    <tr>
      <td>Visit dimension</td>
      <td>Completes after the player enters the specified dimension.</td>
    </tr>
    <tr>
      <td>Interact entity</td>
      <td>Completes after the player interacts with an entity of the specified type or carrying the specified tag.</td>
    </tr>
    <tr>
      <td>Advancement</td>
      <td>Detects whether the player completed the specified Minecraft Advancement.</td>
    </tr>
    <tr>
      <td>Custom trigger</td>
      <td>Triggered by VSQ commands, NeoForge events, KubeJS, or other external logic; used for story content and mod integration.</td>
    </tr>
    <tr>
      <td>Countdown, Ponder, entity death</td>
      <td>Used for time limits, Ponder tutorials, or entity-death conditions; see the editor's node panel for the parameters actually available.</td>
    </tr>
  </tbody>
</table>
<p>All objectives accept a custom <code>taskHint</code>. When left empty, the quest book uses the default hint for the objective type.</p>
<h2 id="reward-types" data-toc-id="reward-types">Reward types</h2>
<ul>
  <li>
    <p><strong>Item reward</strong>: gives the player the specified items.</p>
  </li>
  <li>
    <p><strong>Experience reward</strong>: grants the specified experience points.</p>
  </li>
  <li>
    <p><strong>Command reward</strong>: runs server commands with the claiming player as the command source.</p>
  </li>
  <li>
    <p><strong>Loot table reward</strong>: uses a datapack loot table or a simple custom probability item list.</p>
  </li>
  <li>
    <p><strong>Currency reward</strong>: with ViScriptShop installed, adds player currency; when it is not installed the optional reward is skipped, and ViScriptShop never becomes a hard dependency of
      VSQ.</p>
  </li>
</ul>
<p>With ViScriptTeam installed, reward nodes can also take part in team integration, for example restricting a reward to the team leader only. Rewards for offline members enter a pending list and are delivered once they come back online.</p>
<h2 id="admin-commands" data-toc-id="admin-commands">Admin commands</h2>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Permission levels</div>
  <div data-type="admonition-content">
    <p>The <code>/viscript_quests</code> root command requires permission level
      2. <code>editor</code>, project upload, and runtime quest upload require permission level 4. For day-to-day quest book access, players should use the key binding instead of relying on admin commands.</p>
  </div>
</div>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Command</th>
      <th>Effect</th>
    </tr>
    <tr>
      <td>/viscript_quests book</td>
      <td>Opens the quest book for the player running the command.</td>
    </tr>
    <tr>
      <td>/viscript_quests editor</td>
      <td>Opens a new quest blueprint editor.</td>
    </tr>
    <tr>
      <td>/viscript_quests editor &lt;project&gt;</td>
      <td>Opens the specified .questproj from the server project directory.</td>
    </tr>
    <tr>
      <td>/viscript_quests category config</td>
      <td>Opens the quest category configuration screen.</td>
    </tr>
    <tr>
      <td>/viscript_quests reload &lt;target&gt;</td>
      <td>Refreshes the quest display and runtime data of the target players.</td>
    </tr>
    <tr>
      <td>/viscript_quests grant &lt;target&gt; &lt;quest&gt; [autoTrack]</td>
      <td>Grants a quest; omitted or true tracks it automatically, false keeps the player's current tracking choice.</td>
    </tr>
    <tr>
      <td>/viscript_quests revoke &lt;target&gt; &lt;quest&gt;</td>
      <td>Revokes the target player's quest.</td>
    </tr>
    <tr>
      <td>/viscript_quests complete &lt;target&gt; &lt;quest&gt;</td>
      <td>Marks the target player's quest as completed directly.</td>
    </tr>
    <tr>
      <td>/viscript_quests submit &lt;target&gt; &lt;quest&gt; &lt;step&gt;</td>
      <td>Submits the current objectives of the specified step for the target player.</td>
    </tr>
    <tr>
      <td>/viscript_quests trigger &lt;target&gt; &lt;trigger_id&gt;</td>
      <td>Triggers custom trigger objectives.</td>
    </tr>
  </tbody>
</table>
<p>Quest IDs and project IDs support directory separators. IDs containing spaces or paths that must be preserved should be wrapped in double quotes, for example:</p><pre language="bash" isclosed="false"><code class="language-bash">/viscript_quests grant @s "mainline/first-adventure" false
/viscript_quests editor "chapter-one/newbie-flow"</code></pre>
<h2 id="client-configuration" data-toc-id="client-configuration">Client configuration</h2>
<p>VSQ's quest book theme, animation, completion toast, tracking HUD, and navigation markers are all client configuration. Configuration entry names follow the translations shown in the config screen, and percentage positions are calculated relative to the current screen size.
</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Config group</th>
      <th>Purpose</th>
      <th>Defaults</th>
    </tr>
    <tr>
      <td>Quest book</td>
      <td>Choose the quest book UI theme, or enable/disable the short quest UI animation.</td>
      <td>Theme: Classic Book; animation on</td>
    </tr>
    <tr>
      <td>Quest completion toast</td>
      <td>Controls whether the completion toast is shown, plus the horizontal and vertical percentage of its top-left corner.</td>
      <td>Shown; X 1%, Y 8%</td>
    </tr>
    <tr>
      <td>Tracked quest HUD</td>
      <td>Controls whether the tracked-quest card is shown and sets the X, Y, width, and height percentages.</td>
      <td>Shown; X 74%, Y 22%, width 24%, height 13%</td>
    </tr>
    <tr>
      <td>Quest navigation markers</td>
      <td>Controls the edge markers for location objectives and sets the edge margin and icon size when close to the screen edge.</td>
      <td>Shown; margin 3%, icon 2.6%</td>
    </tr>
  </tbody>
</table>
<p>If the HUD still hugs the edge after adjusting its position, check all four percentages: X, Y, width, and height. Disabling the quest UI animation only affects the display transition and never changes quest data.</p>
<h2 id="optional-integrations" data-toc-id="optional-integrations">Optional integrations</h2>
<ul>
  <li>
    <p><strong>ViScriptTeam</strong>: quest state reuse across the team, team progress sync, leader-only rewards, and offline reward delivery.</p>
  </li>
  <li>
    <p><strong>ViScriptShop</strong>: the currency objective and currency reward.</p>
  </li>
  <li>
    <p><strong>JEI</strong>: recipe and uses lookup for item objectives.</p>
  </li>
  <li>
    <p><strong>Sophisticated Backpacks</strong>: item objectives count and deduct items inside that mod's backpacks.</p>
  </li>
  <li>
    <p><strong>Beyond Dimensions</strong>: item objectives read that mod's unified storage.</p>
  </li>
  <li>
    <p><strong>KubeJS</strong>: listen to quest events, or manipulate quest state from scripts.</p>
  </li>
</ul>
<p>Optional integrations connect through compatibility layers. When the corresponding mod is not installed, related objectives or rewards are not automatically replaced with other types; when authoring quests, confirm the dependency information shown on the node in the editor.</p>
<h2 id="frequently-asked-questions" data-toc-id="frequently-asked-questions">Frequently asked questions</h2>
<h3 id="the-quest-book-key-does-not-respond" data-toc-id="the-quest-book-key-does-not-respond">The quest book key does not respond</h3>
<p>Make sure the key is bound in the controls settings and that the server has loaded at least one valid <code>.quest</code> file. Admins can also use
  <code>/viscript_quests book</code> to test whether the current player can open the quest book.</p>
<h3 id="quests-made-in-the-editor-do-not-appear-in-the-quest-book" data-toc-id="quests-made-in-the-editor-do-not-appear-in-the-quest-book">Quests made in the editor do not appear in the quest book</h3>
<p>Check whether you only saved the <code>.questproj</code>. The project file is only for continuing to edit; you must also compile and upload the
  <code>.quest</code>. After uploading, run
  <code>/viscript_quests reload &lt;target&gt;</code> for the target players, and check that the category lists the correct logical quest ID.</p>
<h3 id="an-objective-completed-but-nothing-settled" data-toc-id="an-objective-completed-but-nothing-settled">An objective completed but nothing settled</h3>
<p>First check the objective states and the current step in the quest book. If the objective is configured for manual submission, click "Submit Objective"; if a currency objective is used, confirm ViScriptShop
  is installed and the player's balance meets the requirement. Admins can use the <code>submit</code> command to verify the submission path of a specific step.</p>
<h3 id="do-old-quest-states-disappear-after-files-change" data-toc-id="do-old-quest-states-disappear-after-files-change">Do old quest states disappear after files change</h3>
<p>Re-uploading quest files does not automatically clear quest states players have already saved. If quest IDs, step IDs,
  or the objective structure changed incompatibly, revoke and re-grant the quest in a test world first before moving to the live world.</p>
<h3 id="how-to-confirm-the-server-loaded-the-quest-files" data-toc-id="how-to-confirm-the-server-loaded-the-quest-files">How to confirm the server loaded the quest files</h3>
<p>Use command completion when running <code>/viscript_quests grant</code> to look for the quest ID; if the quest is not in the completion list, check that the file is in the server's
  <code>viscript_quests/quest</code> directory, that the extension is <code>.quest</code>, and that the uploader has permission level
  4.</p>