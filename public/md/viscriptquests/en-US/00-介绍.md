<h1 id="viscriptquests" data-toc-id="viscriptquests">ViScriptQuests</h1>
<p>ViScriptQuests
  This is a quest mod designed for RPGs. Integration packages and map authors can arrange the flow of major quests, objectives of small quests, rewards, conditional branches, dynamic values, and runtime variables through node blueprints, advancing the story through the process rather than showing players a complete quest list at once.
</p>
<h2 id="core-features" data-toc-id="core-features">Core features</h2>
<ul>
  <li>
    <p><strong>Procedural quests:</strong>Root map orchestration quests begin, subtasks, conditional branches, merging, and quest end; Each small quest has its own independent submap.</p>
  </li>
  <li>
    <p><strong>Unlock objectives in order:</strong>You can check the "Synthesis Bench → to make flint → Think →
      "Going to the Nether" is placed in the same small quest; subsequent objectives only activate and display after completing the previous objective.</p>
  </li>
  <li>
    <p><strong>Dynamic parameters:</strong>Parameters such as item quantity, kill countdown, countdown, experience, and currency can all be accessed from constants, scoreboards, mathematical calculations, or quest variables.</p>
  </li>
  <li>
    <p><strong>Variables and subgraph boundaries:</strong>Support
      <code>String</code>、<code>Int</code>、<code>Float</code>、<code>Bool</code>
      And <code>ItemStack</code> Blackboard variables: The main graph variable can be passed into the subgraph via the input port of the small quest node.</p>
  </li>
  <li>
    <p>
      <strong>Controllable quest book display:</strong>Actual goals and rewards can run normally but do not appear in the goal or reward bars, making them suitable for hiding custom triggered goals, command rewards, and other technical content.
    </p>
  </li>
</ul>
<h2 id="differences-from-traditional-quest-lists" data-toc-id="differences-from-traditional-quest-lists">Differences from traditional quest lists</h2>
<p>ViScriptQuests focuses on "processes" rather than "grids." Quests can be done by players entering specific locations, completing prerequisite objectives, or interacting with NPCs
  Dialogues or script-triggered scenarios unfold dynamically, making them better suited for story missions, adventure maps, and multi-branching scenarios. If you only need a static tech tree and a large number of parallel quests, traditional quest lists can still be more straightforward; If variables, conditions, sequential goals, and hidden processes are needed, the blueprint model is more flexible.
</p>
<h2 id="optional-linkage" data-toc-id="optional-linkage">Optional linkage</h2>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>Mod</th>
      <th>Linked content</th>
      <th>Loading position</th>
    </tr>
    <tr>
      <td>KubeJS</td>
      <td>Monitor major quests, small quests, objectives, and reward events, as well as proactively issue, complete, commit, or trigger quests.</td>
      <td>Server side optional</td>
    </tr>
    <tr>
      <td>Ponder</td>
      <td>Use the "View Thinking" objective to let players open the specified tutorial from the quest book.</td>
      <td>Client options available</td>
    </tr>
    <tr>
      <td>Xaero's Minimap</td>
      <td>Make the specific coordinate mode location target use Xaero waypoints.</td>
      <td>Client options available</td>
    </tr>
    <tr>
      <td>ViScriptTeam</td>
      <td>Supports team quests and the "For Team Leader Only" reward option.</td>
      <td>Optional</td>
    </tr>
    <tr>
      <td>ViScriptShop</td>
      <td>Register currency reward nodes.</td>
      <td>Optional</td>
    </tr>
  </tbody>
</table>
<h2 id="versions-and-compatibility" data-toc-id="versions-and-compatibility">Versions and compatibility</h2>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">The Beta phase adopted disruptive updates</div>
  <div data-type="admonition-content">
    <p>Current runtime <code>.quest</code> File version is an integer <code>1</code>；<code>.questproj</code>
      Only the current LDLib2 standard uncompressed project structure is accepted, which <code>meta.version</code> is a string
      <code>1.0</code>。 These two version fields are not the same concept. The current Beta does not migrate old projects, fields, or ports, or old Beta
      Files should be recreated or re-exported in the new version.</p>
  </div>
</div>
<h2 id="gradle-development-dependency" data-toc-id="gradle-development-dependency">Gradle development dependency</h2><pre language="groovy" isclosed="false"><code class="language-groovy">repositories {
    maven { url = "https://maven.firstdark.dev/snapshots" }
    maven { url = "https://maven.sighs.cc/repository/maven-public/" }
}

dependencies {
    implementation("com.lowdragmc.ldlib2:ldlib2-neoforge-${minecraft_version}:${ldlib2_version}:all")
    implementation("com.zhenshiz:ViScriptLib-neoforge-${minecraft_version}:${viscriptlib_version}")
    implementation("com.zhenshiz:ViScriptQuests-neoforge-${minecraft_version}:${viscriptquests_version}") {
        transitive = false
    }
}</code></pre>
<p></p>
