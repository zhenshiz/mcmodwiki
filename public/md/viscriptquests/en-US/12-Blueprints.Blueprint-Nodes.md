<h1 id="summary-of-blueprint-nodes" data-toc-id="summary-of-blueprint-nodes">Summary of blueprint nodes</h1>
<p>Before introducing all the nodes in the blueprint in detail, let's first briefly summarize the types of nodes in this blueprint and which diagram they are used:</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr>
      <th>Node type</th>
      <th>Root map</th>
      <th>Small quest sub-map</th>
      <th>Explanation</th>
    </tr>
    <tr>
      <td>The mission begins</td>
      <td>√</td>
      <td>×</td>
      <td>The beginning of a major quest, and the big quest can only have one beginning.</td>
    </tr>
    <tr>
      <td>Small quests</td>
      <td>√</td>
      <td>×</td>
      <td>Represents a step in the quest flow; double-click to enter the small quest sub-map.</td>
    </tr>
    <tr>
      <td>A small quest starting point</td>
      <td>×</td>
      <td>√</td>
      <td>When creating small quests, the automatically generated sub-image entry points are divided into two lines: objectives and fixed rewards.</td>
    </tr>
    <tr>
      <td>Mission complete</td>
      <td>√</td>
      <td>×</td>
      <td>The endpoint of the root diagram flow.</td>
    </tr>
    <tr>
      <td>Conditional branch</td>
      <td>√</td>
      <td>√</td>
      <td>Use Boolean conditions to decide whether to go true or false.</td>
    </tr>
    <tr>
      <td>Merge node</td>
      <td>√</td>
      <td>×</td>
      <td>Merge multiple process branches in the root diagram.</td>
    </tr>
    <tr>
      <td>Mission objectives</td>
      <td>×</td>
      <td>√</td>
      <td>For example, obtaining items, killing entities, reaching locations, and viewing and thinking.</td>
    </tr>
    <tr>
      <td>Mission rewards</td>
      <td>×</td>
      <td>√</td>
      <td>For example, item rewards, experience rewards, and command rewards.</td>
    </tr>
    <tr>
      <td>Logic/math/variables/scoreboard/debugging</td>
      <td>√</td>
      <td>√</td>
      <td>Commonly used for conditions, values, debugging, and actions; Root Diagram usually serves process branches.</td>
    </tr>
  </tbody>
</table>
<p>After roughly understanding the types of nodes in this mod blueprint, let's officially introduce the detailed node information. The following content is organized according to the node registration information currently in the source code, containing a total of 30 custom blueprint nodes: 6 for process control, 11 for quest goals, 6 for quest rewards, 1 for logic, 1 for mathematics, 2 for scoreboards, 1 for variables, and 2 for debugging.</p>
<h2 id="node-description" data-toc-id="node-description">Node Description</h2>

<h2 id="process-control" data-toc-id="process-control">Process control</h2>

<h3 id="the-mission-begins" data-toc-id="the-mission-begins">The mission begins</h3>
<p>This marks the beginning of a major quest, and all root map logic starts from this node.</p>
<h4 id="quest-start-node-overview" data-toc-id="quest-start-node-overview">Quest Start Node Overview</h4>
<ul>
  <li><p>Category: Process Control &gt; Quest Start</p></li>
  <li><p>Grouping: flow</p></li>
  <li><p>Registration ID:<code>viscript_quests:quest_start</code></p></li>
  <li><p>Applicable diagram: root diagram</p></li>
</ul>
<h4 id="quest-start-node-parameters" data-toc-id="quest-start-node-parameters">Quest Start Node Parameters</h4>
<h5 id="quest-start-option" data-toc-id="quest-start-option">Quest Start option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Title</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The major quest title displayed in the quest book.</td></tr>
    <tr><td>Subtitle</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The main quest subtitle shown in the quest book.</td></tr>
    <tr><td>Icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>Empty icon</td><td>The large quest icon displayed in the quest book supports item icons or resource pack images.</td></tr>
  </tbody>
</table>
<h5 id="start-the-quest-by-entering" data-toc-id="start-the-quest-by-entering">Start the quest by entering</h5>
<p>None</p>
<h5 id="the-quest-begins-output" data-toc-id="the-quest-begins-output">The quest begins: output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>Connect the first process node in the root diagram.</td></tr>
  </tbody>
</table>
<h4 id="the-quest-begins-with-a-behavioral-description" data-toc-id="the-quest-begins-with-a-behavioral-description">The quest begins with a behavioral description</h4>
<p>When compiling quests, the title, subtitle, and icons are read as major quest information. The root diagram must have and can only have one quest start node; otherwise, an error will be reported when exporting the quest.</p>

<h3 id="small-quests" data-toc-id="small-quests">Small quests</h3>
<p>Small quests are steps in the root map workflow and serve as containers for quest goals and rewards.</p>
<h4 id="overview-of-small-quests-and-nodes" data-toc-id="overview-of-small-quests-and-nodes">Overview of small quests and nodes</h4>
<ul>
  <li><p>Category: Process Control &gt; Small Quests</p></li>
  <li><p>Grouping: flow</p></li>
  <li><p>Registration ID:<code>viscript_quests:sub_quest</code></p></li>
  <li><p>Applicable diagram: root diagram</p></li>
</ul>
<h4 id="small-quest-node-parameters" data-toc-id="small-quest-node-parameters">Small quest node parameters</h4>
<h5 id="small-quests-option" data-toc-id="small-quests-option">Small Quests option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Title</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Small quest titles.</td></tr>
    <tr><td>Subtitle</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Subtitles of small quests.</td></tr>
    <tr><td>Description</td><td>QuestBlueprintTypes.STRING_ARRAY</td><td>Empty array</td><td>Small quest description text, multi-line display.</td></tr>
  </tbody>
</table>
<h5 id="small-quest-input" data-toc-id="small-quest-input">Small quest input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the previous root diagram process.</td></tr>
  </tbody>
</table>
<h5 id="small-quests-output" data-toc-id="small-quests-output">Small quests: output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Success</td><td>TypeHandles.EXECUTION_FLOW</td><td>The process continues after a small quest is successfully completed.</td></tr>
    <tr><td>Failure</td><td>TypeHandles.EXECUTION_FLOW</td><td>The process continues after a small quest fails.</td></tr>
  </tbody>
</table>
<h4 id="small-quests-and-behavioral-descriptions" data-toc-id="small-quests-and-behavioral-descriptions">Small quests and behavioral descriptions</h4>
<p>Double-clicking the small quest node will enter its exclusive local submap. Creating and copying small quests will get independent subgraphs and will not share node contents; When reading the project, it also splits the error shared subgraphs. At compile time, the small quest ID is only the UUID of the small quest node, which can be viewed in the Inspector. Small quests must include at least one valid objective in the subgraph, and the exit for success or failure must be connected to at least one subsequent process.</p>
<p>Zitu Zhong Dai <code>READ</code>、<code>WRITE</code> Or <code>READ_WRITE</code> The Blackboard variables of modifiers are mapped to the input, output, or bidirectional ports of the outer small quest nodes. Therefore, root graph variables can be connected to small quest nodes and passed into subgraphs; Subgraph variables use independent scope and do not chain between different small quests.</p>

<h3 id="a-small-quest-starting-point" data-toc-id="a-small-quest-starting-point">A small quest starting point</h3>
<p>The starting point of the small quest is the entry point of the sub-map, used to divide the content of small quests into goal lines and fixed reward lines.</p>
<h4 id="small-quest-starting-point-node-overview" data-toc-id="small-quest-starting-point-node-overview">Small quest starting point, node overview</h4>
<ul>
  <li><p>Category: Process Control &gt; Starting Point for Small Quests</p></li>
  <li><p>Grouping: flow</p></li>
  <li><p>Registration ID:<code>viscript_quests:sub_quest_start</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="small-quest-starting-point-node-parameters" data-toc-id="small-quest-starting-point-node-parameters">Small quest starting point: node parameters</h4>
<h5 id="small-quest-starting-point-option" data-toc-id="small-quest-starting-point-option">Small quest starting point option</h5>
<p>None</p>
<h5 id="small-quest-starting-point-input" data-toc-id="small-quest-starting-point-input">Small quest starting point input</h5>
<p>None</p>
<h5 id="small-quest-starting-point-output" data-toc-id="small-quest-starting-point-output">Small quest starting point: output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Goal</td><td>TypeHandles.EXECUTION_FLOW</td><td>Connect to small quest target nodes, or through action nodes such as conditional branches, variables, scoreboards, and debugging.</td></tr>
    <tr><td>Fixed rewards</td><td>TypeHandles.EXECUTION_FLOW</td><td>Connect to fixed reward nodes displayed and distributed after completing small quests.</td></tr>
  </tbody>
</table>
<h4 id="small-quest-starting-point-behavior-description" data-toc-id="small-quest-starting-point-behavior-description">Small quest starting point: Behavior description</h4>
<p>When creating a small quest, it automatically creates subgraphs and places them as the unique starting point for the small quest. The compiler only collects content accessible from the two output lines: "Goal" and "Fixed Reward"; Deleting starting points, adding multiple starting points, or leaving objectives and rewards in unconnected areas will all create invalid structures. The quest blueprint does not provide the LDLib2 general "Create Subgraph" command; please enter the subgraph only through small quest nodes.</p>

<h3 id="mission-complete" data-toc-id="mission-complete">Mission complete</h3>
<p>The quest end node indicates the root map flow reaches its endpoint.</p>
<h4 id="quest-end-node-overview" data-toc-id="quest-end-node-overview">Quest End Node Overview</h4>
<ul>
  <li><p>Category: Process Control &gt; Quest End</p></li>
  <li><p>Grouping: flow</p></li>
  <li><p>Registration ID:<code>viscript_quests:quest_end</code></p></li>
  <li><p>Applicable diagram: root diagram</p></li>
</ul>
<h4 id="quest-end-node-parameters" data-toc-id="quest-end-node-parameters">Quest End node parameters</h4>
<h5 id="quest-end-option" data-toc-id="quest-end-option">Quest End option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Success</td><td>TypeHandles.BOOL</td><td>true</td><td>If it is true, it means the quest has successfully ended; if it is false, it means the quest has failed and ended.</td></tr>
  </tbody>
</table>
<h5 id="quest-end-input" data-toc-id="quest-end-input">Quest End Input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the previous root diagram process.</td></tr>
  </tbody>
</table>
<h5 id="mission-complete-output" data-toc-id="mission-complete-output">Mission complete, output</h5>
<p>None</p>
<h4 id="quest-completion-behavior-description" data-toc-id="quest-completion-behavior-description">Quest Completion Behavior Description</h4>
<p>After compilation, a runtime termination node will be generated. All accessible root map flow nodes must be able to continue to the quest end node; otherwise, an error will occur when exporting.</p>

<h3 id="conditional-branch" data-toc-id="conditional-branch">Conditional branch</h3>
<p>Conditional branches divide the process into two routes: true and false based on Boolean conditions.</p>
<h4 id="conditional-branch-node-overview" data-toc-id="conditional-branch-node-overview">Conditional branch node overview</h4>
<ul>
  <li><p>Category: Process Control &gt; Conditional Branch</p></li>
  <li><p>Grouping: flow</p></li>
  <li><p>Registration ID:<code>viscript_quests:quest_branch</code></p></li>
  <li><p>Applicable graphs: root maps, sub-map of small quests</p></li>
</ul>
<h4 id="conditional-branch-node-parameters" data-toc-id="conditional-branch-node-parameters">Conditional branch node parameters</h4>
<h5 id="conditional-branch-option" data-toc-id="conditional-branch-option">Conditional branch option</h5>
<p>None</p>
<h5 id="conditional-branch-input" data-toc-id="conditional-branch-input">Conditional branch input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the previous execution process.</td></tr>
    <tr><td>Conditions</td><td>TypeHandles.BOOL</td><td>false</td><td>The output of the numerical comparison node should be connected.</td></tr>
  </tbody>
</table>
<h5 id="conditional-branch-output" data-toc-id="conditional-branch-output">Conditional branch output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>True</td><td>TypeHandles.EXECUTION_FLOW</td><td>The process begins when conditions are met.</td></tr>
    <tr><td>Fake</td><td>TypeHandles.EXECUTION_FLOW</td><td>The process entered when conditions were not met.</td></tr>
  </tbody>
</table>
<h4 id="conditional-branch-behavior-description" data-toc-id="conditional-branch-behavior-description">Conditional branch: Behavior description</h4>
<p>When exporting, the condition branch compiles the numerical comparison node into runtime conditions. The current compiler only recognizes the numerical comparison results connected to the conditional port; If there are no valid conditions, or if neither the real nor fake outputs are connected, the export will fail.</p>

<h3 id="merge-node" data-toc-id="merge-node">Merge node</h3>
<p>Merge nodes are used to reconge multiple flow branches in the root diagram.</p>
<h4 id="merge-node-overview" data-toc-id="merge-node-overview">Merge node overview</h4>
<ul>
  <li><p>Category: Process Control &gt; Merge Node</p></li>
  <li><p>Grouping: flow</p></li>
  <li><p>Registration ID:<code>viscript_quests:quest_join</code></p></li>
  <li><p>Applicable diagram: root diagram</p></li>
</ul>
<h4 id="merge-node-node-parameters" data-toc-id="merge-node-node-parameters">Merge node node parameters</h4>
<h5 id="merge-node-option" data-toc-id="merge-node-option">Merge node option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Convergence mode</td><td>QuestBlueprintTypes.JOIN_MODE</td><td>ANY</td><td>ANY means any input branch can be completed before continuing, ALL means all input branches are completed before continuing, and COUNT means at least a specified number of input branches are completed.</td></tr>
  </tbody>
</table>
<h5 id="input-the-merge-node" data-toc-id="input-the-merge-node">Input the merge node</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the flow branch that needs to be merged.</td></tr>
    <tr><td>Quantity demanded</td><td>TypeHandles.INT</td><td>2</td><td>It only appears when the merge mode is COUNT, indicating that at least several input branches need to be completed.</td></tr>
  </tbody>
</table>
<h5 id="merge-node-output" data-toc-id="merge-node-output">Merge node output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>The process continues once the convergence rules are met.</td></tr>
  </tbody>
</table>
<h4 id="merge-node-behavior-description" data-toc-id="merge-node-behavior-description">Merge node behavior description</h4>
<p>During compile, the merge pattern and required quantity are recorded. Merging nodes must have at least one input branch and one output flow;<code>COUNT</code> The required quantity in the mode must be valid and cannot exceed the current input number of branches.</p>

<h2 id="mission-objectives" data-toc-id="mission-objectives">Mission objectives</h2>
<p>Quest target nodes can only be placed in the sub-map of small quests. All quest target nodes have two execution stream ports: an entry point and a next step, which are compiled into a target within a small quest. The target ID only uses the target node UUID and can be viewed in the Inspector.</p>
<h3 id="a-universal-option-for-all-goals" data-toc-id="a-universal-option-for-all-goals">A universal option for all goals</h3>
<p>The "Options" table for each target node below lists business parameters and also applies the following general parameters:</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>REQUIRED</td><td>Set as a must-do, optional, or fail condition; Countdown and entity death default to FAILURE.</td></tr>
    <tr><td>Displayed in the objective bar</td><td>TypeHandles.BOOL</td><td>true</td><td>If set to false, the target still participates in the completion check, but does not appear in the mission book's objective bar or tracking HUD.</td></tr>
    <tr><td>Target icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>Empty icon</td><td>Display the form only when "Show in target bar" is true; When not configured, the default icon of the target can be used.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Display the form only when "Show in target bar" is true; When left blank, use the target's built-in description.</td></tr>
  </tbody>
</table>
<p>The goal that can be directly reached from the starting point of the small quest is  <code>ACTIVE</code>。 The "next" link from the previous goal is initially connected to the subsequent goal <code>LOCKED</code>, does not display, detect, or accept submissions; it only activates after the preset goal is completed. The target runtime state is  <code>LOCKED</code>、<code>ACTIVE</code>、<code>COMPLETED</code> Or <code>SKIPPED</code>。</p>

<h3 id="obtain-items" data-toc-id="obtain-items">Obtain items</h3>
<p>Item acquisition objectives require players to hold or submit specified items.</p>
<h4 id="get-an-item-node-overview" data-toc-id="get-an-item-node-overview">Get an item node overview</h4>
<ul>
  <li><p>Category: Quest Objective &gt; Acquiring Items</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:item_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="obtain-item-node-parameters" data-toc-id="obtain-item-node-parameters">Obtain item node parameters</h4>
<h5 id="obtain-items-option" data-toc-id="obtain-items-option">Obtain items option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Items</td><td>TypeHandles.ITEM_STACK</td><td>Empty items</td><td>Target item identity and data components do not carry the semantics of target quantity. Components retain LDLib2's native ItemStack selection, backpack item selection, and JEI drag-and-drop capabilities.</td></tr>
    <tr><td>Item matching rules</td><td>QuestBlueprintTypes.ITEM_MATCH_RULE</td><td>ALL_COMPONENTS</td><td>ALL_COMPONENTS Compare all data components; INCLUDE_COMPONENTS Only compare specified components; EXCLUDE_COMPONENTS Exclude specified components during comparison.</td></tr>
    <tr><td>Deducted upon submission</td><td>TypeHandles.BOOL</td><td>true</td><td>Whether items are deducted when submitting manually or automatically.</td></tr>
    <tr><td>Submission mode</td><td>QuestBlueprintTypes.SUBMIT_MODE</td><td>AUTO</td><td>AUTO automatically detects submissions, while MANUAL requires players to submit manually.</td></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>REQUIRED</td><td>Must-do, optional, or fail conditions.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Override the objective hints shown in the quest book.</td></tr>
  </tbody>
</table>
<h5 id="obtain-the-item-and-enter" data-toc-id="obtain-the-item-and-enter">Obtain the item and enter</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
    <tr><td>Quantity of items</td><td>TypeHandles.INT</td><td>1</td><td>Actual demand quantity; Constants, scoreboards, variables, or mathematical operations can be connected; after parsing, if less than 1, it is treated as 1.</td></tr>
  </tbody>
</table>
<h5 id="obtain-items-and-deal-damage" data-toc-id="obtain-items-and-deal-damage">Obtain items and deal damage</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continue after the goal is completed.</td></tr>
  </tbody>
</table>
<h4 id="item-acquisition-behavior-instructions" data-toc-id="item-acquisition-behavior-instructions">Item acquisition behavior instructions</h4>
<p>After compilation, an item target is generated. The item component only determines which items to match; the quantity comes only from the "Item Quantity" input port; Whether deductions, commit patterns, and component matching rules affect runtime detection and commit logic.</p>

<h3 id="arrival-location" data-toc-id="arrival-location">Arrival location</h3>
<p>Arrival location targets support three types of objectives: specific coordinates, biomes, and structures, and can generate mod HUD tags or Xaero's Minimap waypoints.</p>
<h4 id="arrival-location-node-overview" data-toc-id="arrival-location-node-overview">Arrival Location Node Overview</h4>
<ul>
  <li><p>Category: Quest Objective &gt; Arrival Location</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:location_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="arrival-position-node-parameters" data-toc-id="arrival-position-node-parameters">Arrival Position Node Parameters</h4>
<h5 id="arrival-location-option" data-toc-id="arrival-location-option">Arrival location option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Positioning type</td><td>QuestBlueprintTypes.LOCATION_TARGET_TYPE</td><td>COORDINATES</td><td>Switch specific coordinates, biomes, or structures. When switching, the form will be replaced with the corresponding parameters and will not accumulate old components.</td></tr>
    <tr><td>Dimension</td><td>QuestBlueprintTypes.DIMENSION_ID</td><td>minecraft:overworld</td><td>Only COORDINATES shows; Use the ViScriptLib dimension ID completion component.</td></tr>
    <tr><td>X / Y / Z coordinates</td><td>TypeHandles.DOUBLE</td><td>0 / 64 / 0</td><td>Only COORDINATES shows.</td></tr>
    <tr><td>Arrival radius</td><td>TypeHandles.DOUBLE</td><td>3</td><td>Only COORDINATES shows; Players complete the process after entering the specified dimension and coordinate radius; if less than 0, it is treated as 0.</td></tr>
    <tr><td>Biome ID</td><td>QuestBlueprintTypes.BIOME_ID</td><td>minecraft:plains</td><td>BIOME only displayed; Use the ViScriptLib Biome ID Completion Component.</td></tr>
    <tr><td>Structure ID</td><td>QuestBlueprintTypes.STRUCTURE_ID</td><td>minecraft:village_plains</td><td>Only STRUCTURE is displayed; Use the ViScriptLib structure ID completion component.</td></tr>
    <tr><td>Navigation providers</td><td>QuestBlueprintTypes.LOCATION_MARKER_PROVIDER</td><td>BUILT_IN</td><td>BUILT_IN Use this mod HUD; XAERO_MINIMAP Create a pathpoint when installing Xaero's Minimap on the client side.</td></tr>
    <tr><td>Navigation marker name</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Labels for the mod's HUD or Xaero waypoints.</td></tr>
    <tr><td>Navigation marker icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>Compass items</td><td>Only BUILT_IN displayed.</td></tr>
    <tr><td>Navigation marker colors</td><td>TypeHandles.COLOR</td><td>0xFFD8C7FF</td><td>Only BUILT_IN is displayed, saved as an ARGB integer.</td></tr>
    <tr><td>Xaero path point color</td><td>QuestBlueprintTypes.LOCATION_WAYPOINT_COLOR</td><td>PURPLE</td><td>Only XAERO_MINIMAP display, using a fixed enumeration color swatch, not arbitrary ARGB input.</td></tr>
  </tbody>
</table>
<h5 id="arrival-position-input" data-toc-id="arrival-position-input">Arrival Position Input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
  </tbody>
</table>
<h5 id="reach-the-position-of-output" data-toc-id="reach-the-position-of-output">Reach the position of output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continue after the goal is completed.</td></tr>
  </tbody>
</table>
<h4 id="arrival-location-behavior-description" data-toc-id="arrival-location-behavior-description">Arrival Location Behavior Description</h4>
<p><code>COORDINATES</code> Determine by dimension and three-dimensional radius.<code>BIOME</code> Using the original biome checkpoint, only completed when the player's current biome matches the player;<code>STRUCTURE</code> Use the original structure management API to determine whether a player is currently in a valid structure fragment of the target structure. Biome and structural modes do not use the arrival radius, but runtime searches for corresponding targets to generate navigation points; The searched horizontal coordinates are converted into surface coordinates suitable for players to stand on. Xaero is in sync <code>ModList</code> After confirming the mod is loaded, directly call the official API without using reflection.</p>

<h3 id="kill-entities" data-toc-id="kill-entities">Kill entities</h3>
<p>Killing entities requires players to kill a specified type of entity.</p>
<h4 id="kill-entity-node-overview" data-toc-id="kill-entity-node-overview">Kill Entity Node Overview</h4>
<ul>
  <li><p>Category: Mission Objective &gt; Kill Entities</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:kill_entity_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="kill-entity-node-parameters" data-toc-id="kill-entity-node-parameters">Kill entity node parameters</h4>
<h5 id="kill-the-entity-option" data-toc-id="kill-the-entity-option">Kill the entity option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entity type</td><td>QuestBlueprintTypes.ENTITY_TYPE_ID</td><td>minecraft:zombie</td><td>The type of entity to be killed.</td></tr>
    <tr><td>Tags</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Optional entity command labels to further restrict target entities.</td></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>REQUIRED</td><td>Must-do, optional, or fail conditions.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Override the objective hints shown in the quest book.</td></tr>
  </tbody>
</table>
<h5 id="kill-the-entity-input" data-toc-id="kill-the-entity-input">Kill the entity input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
    <tr><td>Kill count</td><td>TypeHandles.INT</td><td>1</td><td>The number of kills required to accumulate; Dynamic values can be connected; after parsing, if less than 1, it is treated as 1.</td></tr>
  </tbody>
</table>
<h5 id="kill-entities-and-output" data-toc-id="kill-entities-and-output">Kill entities and output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continue after the goal is completed.</td></tr>
  </tbody>
</table>
<h4 id="kill-entities-behavior-description" data-toc-id="kill-entities-behavior-description">Kill entities Behavior description</h4>
<p>Progress accumulates when players kill matched entities. After reaching the number of kills, the objective is completed and the chain of actions connected from the next port continues.</p>

<h3 id="entity-dies" data-toc-id="entity-dies">Entity dies</h3>
<p>Entity death targets monitor specified entity deaths, without requiring the death source to be a player; by default, this is used as a failure condition.</p>
<h4 id="entity-death-node-overview" data-toc-id="entity-death-node-overview">Entity Death node overview</h4>
<ul>
  <li><p>Category: Mission Objective &gt; Entity Death</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:entity_death_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="entity-death-node-parameters" data-toc-id="entity-death-node-parameters">Entity death node parameters</h4>
<h5 id="entity-death-option" data-toc-id="entity-death-option">Entity death option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entity type</td><td>QuestBlueprintTypes.ENTITY_TYPE_ID</td><td>minecraft:villager</td><td>The type of entity that needs to be monitored for death.</td></tr>
    <tr><td>Tags</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Optional entity command labels to further restrict target entities.</td></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>FAILURE</td><td>Default as a failure condition; It can also be changed to must-do or optional.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Override the objective hints shown in the quest book.</td></tr>
  </tbody>
</table>
<h5 id="entity-death-enters" data-toc-id="entity-death-enters">Entity death enters</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
    <tr><td>Number of deaths</td><td>TypeHandles.INT</td><td>1</td><td>The number of deaths that need to be accumulated; Dynamic values can be connected; after parsing, if less than 1, it is treated as 1.</td></tr>
  </tbody>
</table>
<h5 id="physical-death-output" data-toc-id="physical-death-output">Physical death output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continues after the target is triggered.</td></tr>
  </tbody>
</table>
<h4 id="physical-death-statement-of-behavior" data-toc-id="physical-death-statement-of-behavior">Physical death Statement of behavior</h4>
<p>Progress accumulates whenever a matched entity dies from any source. Since the default target type is a failure condition, it is often used for quests like NPC protection and timed escort.</p>

<h3 id="countdown" data-toc-id="countdown">Countdown</h3>
<p>The countdown target is triggered after a specified time; by default, it is used for timeout failure.</p>
<h4 id="countdown-node-overview" data-toc-id="countdown-node-overview">Countdown node overview</h4>
<ul>
  <li><p>Category: Quest Objectives &gt; Countdown</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:countdown_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="countdown-node-parameters" data-toc-id="countdown-node-parameters">Countdown node parameters</h4>
<h5 id="countdown-options" data-toc-id="countdown-options">Countdown options</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>FAILURE</td><td>Default as a failure condition; It can also be changed to must-do or optional.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Override the objective hints shown in the quest book.</td></tr>
  </tbody>
</table>
<h5 id="countdown-input" data-toc-id="countdown-input">Countdown input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
    <tr><td>Duration (seconds)</td><td>TypeHandles.INT</td><td>60</td><td>Countdown duration; Can connect scoreboards, variables, or mathematical operations; after parsing, if less than 1, it is treated as 1.</td></tr>
  </tbody>
</table>
<h5 id="countdown-output" data-toc-id="countdown-output">Countdown output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continue after the countdown is triggered.</td></tr>
  </tbody>
</table>
<h4 id="countdown-behavior-description" data-toc-id="countdown-behavior-description">Countdown behavior description</h4>
<p>The countdown records the start of the world game time after the target is activated. This timer status is saved along with the player's mission progress. When the player exits and re-enters, the countdown will not reset or freeze the countdown in an uninitialized state. Trigger the target after reaching the duration; Default is a failure condition, so it is often used to limit the completion time of small quests.</p>

<h3 id="break-the-block" data-toc-id="break-the-block">Break the block</h3>
<p>The block destruction objective requires players to break specified blocks.</p>
<h4 id="destruction-block-node-overview" data-toc-id="destruction-block-node-overview">Destruction block node overview</h4>
<ul>
  <li><p>Category: Mission Objectives &gt; Breaking Blocks</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:break_block_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="destroy-the-block-node-parameters" data-toc-id="destroy-the-block-node-parameters">Destroy the block node parameters</h4>
<h5 id="break-the-block-option" data-toc-id="break-the-block-option">Break the block option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Square</td><td>TypeHandles.BLOCK</td><td>minecraft:stone</td><td>Blocks that need to be destroyed.</td></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>REQUIRED</td><td>Must-do, optional, or fail conditions.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Override the objective hints shown in the quest book.</td></tr>
  </tbody>
</table>
<h5 id="destroy-the-block-input" data-toc-id="destroy-the-block-input">Destroy the block input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
    <tr><td>Destruction amount</td><td>TypeHandles.INT</td><td>1</td><td>The amount of damage that needs to be accumulated; Dynamic values can be connected; after parsing, if less than 1, it is treated as 1.</td></tr>
  </tbody>
</table>
<h5 id="break-blocks-output" data-toc-id="break-blocks-output">Break blocks output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continue after the goal is completed.</td></tr>
  </tbody>
</table>
<h4 id="breaking-blocks-behavior-description" data-toc-id="breaking-blocks-behavior-description">Breaking Blocks Behavior Description</h4>
<p>Progress accumulates when players destroy matching blocks. Reach the number of destroyed targets to complete the objective.</p>

<h3 id="access-dimensions" data-toc-id="access-dimensions">Access dimensions</h3>
<p>Access dimension objectives require players to enter a specified dimension.</p>
<h4 id="access-the-dimension-node-overview" data-toc-id="access-the-dimension-node-overview">Access the Dimension node overview</h4>
<ul>
  <li><p>Category: Quest Objectives &gt; Access Dimensions</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:visit_dimension_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="access-the-dimension-node-parameters" data-toc-id="access-the-dimension-node-parameters">Access the dimension node parameters</h4>
<h5 id="access-the-dimension-option" data-toc-id="access-the-dimension-option">Access the Dimension option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Dimension</td><td>QuestBlueprintTypes.DIMENSION_ID</td><td>minecraft:overworld</td><td>Dimensions that need to be accessed.</td></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>REQUIRED</td><td>Must-do, optional, or fail conditions.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Override the objective hints shown in the quest book.</td></tr>
  </tbody>
</table>
<h5 id="access-dimension-input" data-toc-id="access-dimension-input">Access dimension input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
  </tbody>
</table>
<h5 id="access-dimension-output" data-toc-id="access-dimension-output">Access dimension output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continue after the goal is completed.</td></tr>
  </tbody>
</table>
<h4 id="access-dimension-behavior-description" data-toc-id="access-dimension-behavior-description">Access dimension behavior description</h4>
<p>After entering a specified dimension, the player completes the objective. It only examines dimensions, not specific locations.</p>

<h3 id="entity-interaction" data-toc-id="entity-interaction">Entity interaction</h3>
<p>Entity interaction objectives require players to right-click to interact with a specified type of entity.</p>
<h4 id="overview-of-entity-interaction-nodes" data-toc-id="overview-of-entity-interaction-nodes">Overview of entity interaction nodes</h4>
<ul>
  <li><p>Category: Quest Objectives &gt; Entity Interactions</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:interact_entity_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="entity-interaction-node-parameters" data-toc-id="entity-interaction-node-parameters">Entity interaction node parameters</h4>
<h5 id="entity-interaction-options" data-toc-id="entity-interaction-options">Entity Interaction Options</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entity type</td><td>QuestBlueprintTypes.ANY_ENTITY_TYPE_ID</td><td>minecraft:pig</td><td>Interactive entity types, not limited to biological entities.</td></tr>
    <tr><td>Tags</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Optional entity command labels to further restrict target entities.</td></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>REQUIRED</td><td>Must-do, optional, or fail conditions.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Override the objective hints shown in the quest book.</td></tr>
  </tbody>
</table>
<h5 id="entity-interaction-input" data-toc-id="entity-interaction-input">Entity interaction input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
  </tbody>
</table>
<h5 id="entity-interaction-output" data-toc-id="entity-interaction-output">Entity Interaction Output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continue after the goal is completed.</td></tr>
  </tbody>
</table>
<h4 id="entity-interaction-behavior-description" data-toc-id="entity-interaction-behavior-description">Entity interaction behavior description</h4>
<p>Objectives are completed when players interact with matched entities. When the label is empty, only the entity type is used to determine the character.</p>

<h3 id="progress-targets" data-toc-id="progress-targets">Progress targets</h3>
<p>Progress objectives require players to complete specified Minecraft Advancement.</p>
<h4 id="progress-goals-node-overview" data-toc-id="progress-goals-node-overview">Progress Goals Node Overview</h4>
<ul>
  <li><p>Categories: Quest Objectives &gt; Progress Goals</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:advancement_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="progress-goals-node-parameters" data-toc-id="progress-goals-node-parameters">Progress Goals Node Parameters</h4>
<h5 id="progress-goals-option" data-toc-id="progress-goals-option">Progress Goals option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Progress ID</td><td>QuestBlueprintTypes.ADVANCEMENT_ID</td><td>minecraft:story/root</td><td>Progress ID to be completed.</td></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>REQUIRED</td><td>Must-do, optional, or fail conditions.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Override the objective hints shown in the quest book.</td></tr>
  </tbody>
</table>
<h5 id="progress-target-input" data-toc-id="progress-target-input">Progress Target Input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
  </tbody>
</table>
<h5 id="progress-goals-output" data-toc-id="progress-goals-output">Progress Goals Output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continue after the goal is completed.</td></tr>
  </tbody>
</table>
<h4 id="progress-goals-behavioral-description" data-toc-id="progress-goals-behavioral-description">Progress Goals Behavioral Description</h4>
<p>After the player completes the specified progress, the objective is completed. The progress ID comes from the server-synchronized Advancement list.</p>

<h3 id="custom-triggers" data-toc-id="custom-triggers">Custom triggers</h3>
<p>Define the trigger target, and reserve a business identifier for commands, scripts, or other code.</p>
<h4 id="custom-trigger-node-overview" data-toc-id="custom-trigger-node-overview">Custom trigger node overview</h4>
<ul>
  <li><p>Category: Quest Objectives &gt; Custom triggers</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:custom_trigger_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="custom-trigger-node-parameters" data-toc-id="custom-trigger-node-parameters">Custom trigger node parameters</h4>
<h5 id="customize-trigger-options" data-toc-id="customize-trigger-options">Customize trigger options</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Identification ID</td><td>TypeHandles.STRING</td><td>viscript_quests:custom_trigger</td><td>Used to externally trigger the marker of goal completion.</td></tr>
    <tr><td>Target types</td><td>QuestBlueprintTypes.OBJECTIVE_TYPE</td><td>REQUIRED</td><td>Must-do, optional, or fail conditions.</td></tr>
    <tr><td>Target prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Override the objective hints shown in the quest book.</td></tr>
  </tbody>
</table>
<h5 id="custom-trigger-input" data-toc-id="custom-trigger-input">Custom trigger input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
  </tbody>
</table>
<h5 id="custom-trigger-output" data-toc-id="custom-trigger-output">Custom trigger output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>A chain of actions that continue after the goal is completed.</td></tr>
  </tbody>
</table>
<h4 id="custom-trigger-behavior-description" data-toc-id="custom-trigger-behavior-description">Custom trigger behavior description</h4>
<p>The runtime does not automatically complete this goal; it needs to be done by <code>viscript_quests trigger &lt;玩家&gt; &lt;trigger_id&gt;</code>、<code>ViScriptQuestsUtil.triggerCustom(player, triggerId)</code>、<code>QuestManager.triggerCustom(...)</code> Or other linkage logic triggered by the identification ID. When triggered successfully, only the number of successful results or Boolean results is returned, and no chat messages are sent to the target player or the executor of the command; The failure prompt is only retained when there is no matching activity goal.</p>

<h3 id="examine-and-reflect" data-toc-id="examine-and-reflect">Examine and reflect</h3>
<p>View Thinking Objectives is used to get players to open the specified Ponder tutorial from the questbook.</p>
<h4 id="view-the-thinking-node-overview" data-toc-id="view-the-thinking-node-overview">View the Thinking Node Overview</h4>
<ul>
  <li><p>Category: Quest Objectives &gt; View and Think</p></li>
  <li><p>Grouping: task</p></li>
  <li><p>Registration ID:<code>viscript_quests:ponder_task</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
  <li><p>Optional linkage: Ponder</p></li>
</ul>
<h4 id="check-the-thinking-node-parameters" data-toc-id="check-the-thinking-node-parameters">Check the Thinking Node parameters</h4>
<h5 id="check-the-think-options" data-toc-id="check-the-think-options">Check the Think options</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Think about item/block IDs</td><td>QuestBlueprintTypes.PONDER_COMPONENT_ID</td><td>minecraft:crafting_table</td><td>Select the item or block belonging to the tutorial from the Ponder Index. Complete lists display icons and translated names, without duplicate display of item or block IDs.</td></tr>
  </tbody>
</table>
<h5 id="view-reflection-input" data-toc-id="view-reflection-input">View Reflection Input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the target link.</td></tr>
  </tbody>
</table>
<h5 id="view-the-reflection-output" data-toc-id="view-the-reflection-output">View the reflection output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>After the player clicks to view and completes the goal, the action chain continues.</td></tr>
  </tbody>
</table>
<h4 id="review-the-reflection-behavior-description" data-toc-id="review-the-reflection-behavior-description">Review the Reflection Behavior Description</h4>
<p>The quest will display a "View" button after the objective. When players click the button, they open the corresponding Ponder tutorial and immediately complete the goal, with no limit on viewing time; After completing a goal, you can still click "View" again, but you will not complete the goal again or receive rewards. If Ponder is not installed, ID is invalid, or the corresponding scenario cannot be found, the client will give a failure message.</p>

<h2 id="mission-rewards" data-toc-id="mission-rewards">Mission rewards</h2>
<p>Quest reward nodes can only be placed in sub-map of small quests. Except for the reward placeholder, reward nodes are compiled into the actual rewards distributed.</p>
<h3 id="a-universal-option-for-all-actual-rewards" data-toc-id="a-universal-option-for-all-actual-rewards">A universal option for all actual rewards</h3>
<p>Items, experience, commands, loot tables, and currency rewards all apply the following general parameters:</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Displayed in the rewards section</td><td>TypeHandles.BOOL</td><td>true</td><td>If set to false, rewards will still be distributed normally but will not appear in the quest book reward bar.</td></tr>
    <tr><td>Reward icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>Empty icon</td><td>Display the form only when "Show in reward bar" is true; When not configured, you can use the default icon for rewards.</td></tr>
    <tr><td>Reward floating text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The form is only displayed when "Show in rewards bar" is true.</td></tr>
    <tr><td>Only for the captain</td><td>TypeHandles.BOOL</td><td>false</td><td>Displayed only when ViScriptTeam is installed; In team missions, only the captain receives this reward.</td></tr>
  </tbody>
</table>
<p>"Show in reward bar" only controls the UI, not the reward switch. When closed, icons and floating text components are hidden from the form, but reopen to restore them; Form rebuilding does not repeatedly add components or lose already filled values.</p>

<h3 id="item-rewards" data-toc-id="item-rewards">Item rewards</h3>
<p>Item rewards will be given to players when the quest rewards are distributed.</p>
<h4 id="item-reward-node-overview" data-toc-id="item-reward-node-overview">Item Reward Node Overview</h4>
<ul>
  <li><p>Category: Quest rewards &gt; Item rewards</p></li>
  <li><p>Grouping: reward</p></li>
  <li><p>Registration ID:<code>viscript_quests:item_reward</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="item-reward-node-parameters" data-toc-id="item-reward-node-parameters">Item reward node parameters</h4>
<h5 id="item-rewards-option" data-toc-id="item-rewards-option">Item Rewards option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Items</td><td>TypeHandles.ITEM_STACK</td><td>Empty items</td><td>The actual quantity of item identities and data components to be issued is determined by the "item quantity" input port.</td></tr>
    <tr><td>Reward icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>Empty icon</td><td>Quest book reward display icon; When the game is empty, you can use the default reward icon during runtime.</td></tr>
    <tr><td>Reward floating text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The reward text in the quest book is a floating prompt text.</td></tr>
    <tr><td>Only for the Captain (ViScriptTeam collaboration)</td><td>TypeHandles.BOOL</td><td>false</td><td>It only appears when loading ViScriptTeam, indicating that in team quests, it is only given to the captain.</td></tr>
  </tbody>
</table>
<h5 id="item-reward-input" data-toc-id="item-reward-input">Item reward input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the reward link.</td></tr>
    <tr><td>Quantity of items</td><td>TypeHandles.INT</td><td>1</td><td>The quantity to be distributed; Constants, scoreboards, variables, or mathematical operations can be connected.</td></tr>
  </tbody>
</table>
<h5 id="item-reward-output" data-toc-id="item-reward-output">Item reward: Output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>Continue connecting other reward or display nodes.</td></tr>
  </tbody>
</table>
<h4 id="item-reward-behavior-description" data-toc-id="item-reward-behavior-description">Item reward Behavior description</h4>
<p>Item rewards are generated after compilation. The item component retains the item identity and data component, and the quantity is parsed when distributed when entering the "item quantity".</p>

<h3 id="experience-rewards" data-toc-id="experience-rewards">Experience rewards</h3>
<p>Experience rewards will be given to players when quest rewards are distributed.</p>
<h4 id="experience-reward-node-overview" data-toc-id="experience-reward-node-overview">Experience Reward Node Overview</h4>
<ul>
  <li><p>Category: Quest Rewards &gt; Experience Rewards</p></li>
  <li><p>Grouping: reward</p></li>
  <li><p>Registration ID:<code>viscript_quests:experience_reward</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="experience-reward-node-parameters" data-toc-id="experience-reward-node-parameters">Experience reward node parameters</h4>
<h5 id="experience-reward-option" data-toc-id="experience-reward-option">Experience reward option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Reward icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>Empty icon</td><td>Quest book reward display icon.</td></tr>
    <tr><td>Reward floating text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The reward text in the quest book is a floating prompt text.</td></tr>
    <tr><td>Only for the Captain (ViScriptTeam collaboration)</td><td>TypeHandles.BOOL</td><td>false</td><td>It only appears when loading ViScriptTeam, indicating that in team quests, it is only given to the captain.</td></tr>
  </tbody>
</table>
<h5 id="experience-reward-input" data-toc-id="experience-reward-input">Experience reward input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the reward link.</td></tr>
    <tr><td>Experience</td><td>TypeHandles.INT</td><td>1</td><td>Experience points to be issued; Dynamic values can be connected; after parsing, if less than 0, it is treated as 0.</td></tr>
  </tbody>
</table>
<h5 id="experience-reward-output" data-toc-id="experience-reward-output">Experience reward output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>Continue connecting other reward or display nodes.</td></tr>
  </tbody>
</table>
<h4 id="experience-rewards-behavioral-description" data-toc-id="experience-rewards-behavioral-description">Experience rewards: Behavioral description</h4>
<p>Experience rewards are generated after compilation. Experience points are protected as non-negative to avoid negative experience rewards.</p>

<h3 id="instruction-rewards" data-toc-id="instruction-rewards">Instruction rewards</h3>
<p>Command rewards execute one or more server commands when quest rewards are issued.</p>
<h4 id="command-reward-node-overview" data-toc-id="command-reward-node-overview">Command Reward Node Overview</h4>
<ul>
  <li><p>Category: Quest Rewards &gt; Command Rewards</p></li>
  <li><p>Grouping: reward</p></li>
  <li><p>Registration ID:<code>viscript_quests:command_reward</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="command-reward-node-parameters" data-toc-id="command-reward-node-parameters">Command reward node parameters</h4>
<h5 id="command-reward-option" data-toc-id="command-reward-option">Command reward option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Instructions</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The server command to be executed should not start with /. Use English semicolons; Separate multiple instructions.</td></tr>
    <tr><td>Reward icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>Empty icon</td><td>Quest book reward display icon.</td></tr>
    <tr><td>Reward floating text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The reward text in the quest book is a floating prompt text.</td></tr>
    <tr><td>Only for the Captain (ViScriptTeam collaboration)</td><td>TypeHandles.BOOL</td><td>false</td><td>It only appears when loading ViScriptTeam, indicating that in team quests, it is only given to the captain.</td></tr>
  </tbody>
</table>
<h5 id="command-reward-input" data-toc-id="command-reward-input">Command reward input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the reward link.</td></tr>
  </tbody>
</table>
<h5 id="command-reward-output" data-toc-id="command-reward-output">Command reward: output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>Continue connecting other reward or display nodes.</td></tr>
  </tbody>
</table>
<h4 id="instruction-reward-behavior-description" data-toc-id="instruction-reward-behavior-description">Instruction reward Behavior description</h4>
<p>Rewards are issued according to English semicolons <code>;</code> Split instructions, remove blank starting and ending lines one by one and skipping empty instructions. For example <code>give @s minecraft:diamond 1;say 完成任务</code> Two orders will be executed in sequence. This reward is suitable for granting permissions, triggering packet functions, or linking with other systems.</p>

<h3 id="loot-table-rewards" data-toc-id="loot-table-rewards">Loot Table Rewards</h3>
<p>Loot Table rewards can be drawn from loot table packets, or you can use the built-in simple drop list.</p>
<h4 id="loot-table-reward-node-overview" data-toc-id="loot-table-reward-node-overview">Loot Table Reward Node Overview</h4>
<ul>
  <li><p>Category: Mission Rewards &gt; Loot Table Rewards</p></li>
  <li><p>Grouping: reward</p></li>
  <li><p>Registration ID:<code>viscript_quests:loot_table_reward</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="loot-table-reward-node-parameters" data-toc-id="loot-table-reward-node-parameters">Loot table reward node parameters</h4>
<h5 id="loot-table-reward-options" data-toc-id="loot-table-reward-options">Loot Table Reward Options</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Loot configuration</td><td>QuestBlueprintTypes.LOOT_TABLE_REWARD</td><td>DATA_PACK, path: minecraft:chests/simple_dungeon</td><td>Composite configuration. For packet mode, fill in the loot table ID; Custom mode fills in item and probability lists.</td></tr>
    <tr><td>Reward icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>Empty icon</td><td>Quest book reward display icon.</td></tr>
    <tr><td>Reward floating text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The reward text in the quest book is a floating prompt text.</td></tr>
    <tr><td>Only for the Captain (ViScriptTeam collaboration)</td><td>TypeHandles.BOOL</td><td>false</td><td>It only appears when loading ViScriptTeam, indicating that in team quests, it is only given to the captain.</td></tr>
  </tbody>
</table>
<h5 id="loot-table-rewards-entered" data-toc-id="loot-table-rewards-entered">Loot table rewards entered</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the reward link.</td></tr>
  </tbody>
</table>
<h5 id="loot-table-rewards-output" data-toc-id="loot-table-rewards-output">Loot table rewards: Output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>Continue connecting other reward or display nodes.</td></tr>
  </tbody>
</table>
<h4 id="loot-table-reward-behavior-description" data-toc-id="loot-table-reward-behavior-description">Loot Table Reward Behavior Description</h4>
<p>In packet mode, rewards are drawn based on the loot table ID you provide. Custom mode independently draws from each item configuration based on probability, with a probability range limited from 0 to 1.</p>

<h3 id="monetary-rewards" data-toc-id="monetary-rewards">Monetary rewards</h3>
<p>Currency rewards are used for ViScriptShop integration, issuing a specified amount of currency.</p>
<h4 id="currency-rewards-node-overview" data-toc-id="currency-rewards-node-overview">Currency Rewards Node Overview</h4>
<ul>
  <li><p>Category: Quest Rewards &gt; Monetary Rewards</p></li>
  <li><p>Grouping: reward</p></li>
  <li><p>Registration ID:<code>viscript_quests:currency_reward</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
  <li><p>Dependency mod: ViScriptShop</p></li>
</ul>
<h4 id="currency-rewards-node-parameters" data-toc-id="currency-rewards-node-parameters">Currency rewards node parameters</h4>
<h5 id="currency-reward-option" data-toc-id="currency-reward-option">Currency Reward Option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Reward icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>Empty icon</td><td>Quest book reward display icon.</td></tr>
    <tr><td>Reward floating text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The reward text in the quest book is a floating prompt text.</td></tr>
    <tr><td>Only for the Captain (ViScriptTeam collaboration)</td><td>TypeHandles.BOOL</td><td>false</td><td>It only appears when loading ViScriptTeam, indicating that in team quests, it is only given to the captain.</td></tr>
  </tbody>
</table>
<h5 id="currency-reward-input" data-toc-id="currency-reward-input">Currency reward input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the reward link.</td></tr>
    <tr><td>Currency</td><td>TypeHandles.INT</td><td>1</td><td>The amount of currency to be issued; Dynamic values can be connected; after parsing, if less than 0, it is treated as 0.</td></tr>
  </tbody>
</table>
<h5 id="currency-reward-output" data-toc-id="currency-reward-output">Currency reward output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>Continue connecting other reward or display nodes.</td></tr>
  </tbody>
</table>
<h4 id="monetary-reward-behavior-description" data-toc-id="monetary-reward-behavior-description">Monetary reward behavior description</h4>
<p>This node only appears in the node library when ViScriptShop is loaded. After compilation, currency rewards are generated, and whether the distribution is successful depends on the runtime linkage layer.</p>

<h3 id="reward-placeholders" data-toc-id="reward-placeholders">Reward placeholders</h3>
<p>Reward placeholders are only used for quest book display and do not distribute actual rewards.</p>
<h4 id="reward-placeholder-node-overview" data-toc-id="reward-placeholder-node-overview">Reward placeholder node overview</h4>
<ul>
  <li><p>Category: Quest Rewards &gt; Reward Placeholders</p></li>
  <li><p>Grouping: reward</p></li>
  <li><p>Registration ID:<code>viscript_quests:reward_placeholder</code></p></li>
  <li><p>Applicable map: Small quest submap</p></li>
</ul>
<h4 id="reward-placeholder-node-parameters" data-toc-id="reward-placeholder-node-parameters">Reward placeholder node parameters</h4>
<h5 id="reward-placeholder-option" data-toc-id="reward-placeholder-option">Reward placeholder option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Reward icon</td><td>QuestBlueprintTypes.DISPLAY_ICON</td><td>ldlib2:textures/gui/icon/help.png</td><td>The reward icon displayed in the quest book.</td></tr>
    <tr><td>Reward floating text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The reward text in the quest book is a floating prompt text.</td></tr>
  </tbody>
</table>
<h5 id="reward-placeholder-input" data-toc-id="reward-placeholder-input">Reward placeholder input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive reward display link.</td></tr>
  </tbody>
</table>
<h5 id="reward-placeholder-output" data-toc-id="reward-placeholder-output">Reward placeholder output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>Continue connecting other reward or display nodes.</td></tr>
  </tbody>
</table>
<h4 id="reward-placeholder-behavior-description" data-toc-id="reward-placeholder-behavior-description">Reward placeholder behavior description</h4>
<p>After compilation, only reward display data is generated; no data is generated <code>IReward</code>。 Suitable for displaying external system rewards, story rewards, or manually distributed rewards. This node does not use the "Show in reward bar" switch because it is itself a placeholder that is always shown; When the icon is selected as ItemStack and the quantity is greater than 1, the quest book renders the quantity using the original item corner label; if the quantity is 1, no number is displayed.</p>

<h2 id="logic" data-toc-id="logic">Logic</h2>

<h3 id="numerical-comparison" data-toc-id="numerical-comparison">Numerical comparison</h3>
<p>Numerical comparison compares two numerical expressions into a boolean result and is commonly used for conditional branching.</p>
<h4 id="numerical-comparison-node-overview" data-toc-id="numerical-comparison-node-overview">Numerical Comparison Node Overview</h4>
<ul>
  <li><p>Category: Logic &gt; Numerical Comparison</p></li>
  <li><p>Grouping: logic</p></li>
  <li><p>Registration ID:<code>viscript_quests:compare</code></p></li>
  <li><p>Applicable graphs: root maps, sub-map of small quests</p></li>
</ul>
<h4 id="numerical-comparison-node-parameters" data-toc-id="numerical-comparison-node-parameters">Numerical comparison node parameters</h4>
<h5 id="numerical-comparison-options" data-toc-id="numerical-comparison-options">Numerical comparison options</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Comparison methods</td><td>QuestBlueprintTypes.COMPARE_OP</td><td>EQ</td><td>Supports equal to, not equal to, greater than, greater than, less than, less than or equal to.</td></tr>
  </tbody>
</table>
<h5 id="numerical-comparison-input" data-toc-id="numerical-comparison-input">Numerical Comparison Input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Value A</td><td>TypeHandles.FLOAT</td><td>0</td><td>The left side is a comparison value, which can be connected to mathematical calculations or scoreboard values.</td></tr>
    <tr><td>Value B</td><td>TypeHandles.FLOAT</td><td>0</td><td>The comparison value on the right can be connected to mathematical calculations or scoreboard values.</td></tr>
  </tbody>
</table>
<h5 id="numerical-comparison-output" data-toc-id="numerical-comparison-output">Numerical comparison output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>The result</td><td>TypeHandles.BOOL</td><td>Comparison results are usually connected to conditional inputs in the conditional branch.</td></tr>
  </tbody>
</table>
<h4 id="numerical-comparison-and-behavioral-description" data-toc-id="numerical-comparison-and-behavioral-description">Numerical comparison and behavioral description</h4>
<p>Supported comparison methods include: <code>EQ</code>、<code>NE</code>、<code>GT</code>、<code>GE</code>、<code>LT</code>、<code>LE</code>。 When exporting a conditional branch, the expressions and comparison methods on both sides of the node will be read.</p>

<h2 id="mathematics" data-toc-id="mathematics">Mathematics</h2>

<h3 id="mathematical-operations" data-toc-id="mathematical-operations">Mathematical operations</h3>
<p>Mathematical operations compile one or more numeric inputs into runtime numerical expressions.</p>
<h4 id="overview-of-mathematical-operations-nodes" data-toc-id="overview-of-mathematical-operations-nodes">Overview of Mathematical Operations Nodes</h4>
<ul>
  <li><p>Category: Mathematics &gt; Mathematical Operations</p></li>
  <li><p>Grouping: math</p></li>
  <li><p>Registration ID:<code>viscript_quests:math_operation</code></p></li>
  <li><p>Applicable graphs: root maps, sub-map of small quests</p></li>
</ul>
<h4 id="mathematical-operations-node-parameters" data-toc-id="mathematical-operations-node-parameters">Mathematical Operations Node Parameters</h4>
<h5 id="mathematical-operations-option" data-toc-id="mathematical-operations-option">Mathematical Operations Option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Calculation method</td><td>QuestBlueprintTypes.MATH_OPERATION</td><td>ADD</td><td>Supports addition, subtraction, multiplication, division, limited range, and random numbers.</td></tr>
    <tr><td>Enter the quantity</td><td>TypeHandles.INT</td><td>2</td><td>Only displays in addition, subtraction, multiplication, and division modes; The effective range is 2 to 64.</td></tr>
  </tbody>
</table>
<h5 id="mathematical-operations-input" data-toc-id="mathematical-operations-input">Mathematical Operations Input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Calculation method</th><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Addition/Subtraction/Multiplication/Division</td><td>Values 1 to N</td><td>TypeHandles.FLOAT</td><td>Addition/subtraction is 0; multiplication is 1; the first value of division is 0, and the subsequent value is 1</td><td>Dynamically generated based on the input quantity.</td></tr>
    <tr><td>Limiting the scope</td><td>Value, minimum value, maximum value</td><td>TypeHandles.FLOAT</td><td>Value 0, minimum value 0, maximum value 1</td><td>Limit the value to between the minimum and maximum values.</td></tr>
    <tr><td>Random numbers</td><td>Minimum value, maximum value</td><td>TypeHandles.FLOAT</td><td>Minimum value 0, maximum value 1</td><td>Generate random number expressions within the range.</td></tr>
  </tbody>
</table>
<h5 id="mathematical-operations-output" data-toc-id="mathematical-operations-output">Mathematical Operations Output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>The result</td><td>TypeHandles.FLOAT</td><td>Calculation results can be connected to comparison, variable, or scoreboard inputs.</td></tr>
  </tbody>
</table>
<h4 id="mathematical-operations-behavioral-description" data-toc-id="mathematical-operations-behavioral-description">Mathematical Operations Behavioral Description</h4>
<p>Addition, subtraction, multiplication, and division form expressions in the order of input. Restricted ranges are compiled into clamp expressions, and random numbers are compiled into random expressions. The input count is limited to 2 to 64 to avoid generating an overly large list of node ports.</p>

<h2 id="scoreboard" data-toc-id="scoreboard">Scoreboard</h2>

<h3 id="get-scoreboard-values" data-toc-id="get-scoreboard-values">Get scoreboard values</h3>
<p>Get scoreboard values and read the specified scoreboard targets and objects into numerical expressions.</p>
<h4 id="get-the-scoreboard-value-node-overview" data-toc-id="get-the-scoreboard-value-node-overview">Get the scoreboard value node overview</h4>
<ul>
  <li><p>Category: Scoreboard &gt; Get scoreboard values</p></li>
  <li><p>Grouping: scoreboard</p></li>
  <li><p>Registration ID:<code>viscript_quests:get_scoreboard_value</code></p></li>
  <li><p>Applicable graphs: root maps, sub-map of small quests</p></li>
</ul>
<h4 id="obtain-the-scoreboard-values-and-node-parameters" data-toc-id="obtain-the-scoreboard-values-and-node-parameters">Obtain the scoreboard values and node parameters</h4>
<h5 id="get-the-scoreboard-value-option" data-toc-id="get-the-scoreboard-value-option">Get the scoreboard value option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Scoreboard goals</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The name of the objective to read.</td></tr>
    <tr><td>Scoreboard targets</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The score holder to be read; When null, the target object is determined by runtime logic.</td></tr>
  </tbody>
</table>
<h5 id="get-the-scoreboard-value-input" data-toc-id="get-the-scoreboard-value-input">Get the scoreboard value input</h5>
<p>None</p>
<h5 id="get-the-scoreboard-value-output" data-toc-id="get-the-scoreboard-value-output">Get the scoreboard value output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>The result</td><td>TypeHandles.FLOAT</td><td>Read the scoreboard values.</td></tr>
  </tbody>
</table>
<h4 id="get-scoreboard-values-and-behavioral-descriptions" data-toc-id="get-scoreboard-values-and-behavioral-descriptions">Get scoreboard values and behavioral descriptions</h4>
<p>When the scoreboard objective is empty, it will not be compiled into a valid expression. It is usually connected to numerical comparison, mathematical operations, or variable writing nodes.</p>

<h3 id="modify-scoreboard-values" data-toc-id="modify-scoreboard-values">Modify scoreboard values</h3>
<p>Modifying scoreboard values is an execution stream node with side effects, used to set or calculate scoreboard scores.</p>
<h4 id="modify-the-scoreboard-value-node-overview" data-toc-id="modify-the-scoreboard-value-node-overview">Modify the scoreboard value node overview</h4>
<ul>
  <li><p>Category: Scoreboard &gt; Modify scoreboard values</p></li>
  <li><p>Grouping: scoreboard</p></li>
  <li><p>Registration ID:<code>viscript_quests:modify_scoreboard_value</code></p></li>
  <li><p>Applicable graphs: root maps, sub-map of small quests</p></li>
</ul>
<h4 id="modify-the-scoreboard-values-and-node-parameters" data-toc-id="modify-the-scoreboard-values-and-node-parameters">Modify the scoreboard values and node parameters</h4>
<h5 id="modify-the-scoreboard-value-option" data-toc-id="modify-the-scoreboard-value-option">Modify the scoreboard value option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Scoreboard goals</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The objective name to modify.</td></tr>
    <tr><td>Scoreboard targets</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The score holder to modify; When null, the target object is determined by runtime logic.</td></tr>
    <tr><td>Calculation method</td><td>QuestBlueprintTypes.VARIABLE_MUTATION_OP</td><td>SET</td><td>Supports setting, addition, subtraction, multiplication, and division.</td></tr>
  </tbody>
</table>
<h5 id="modify-the-scoreboard-value-input" data-toc-id="modify-the-scoreboard-value-input">Modify the scoreboard value input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the execution stream.</td></tr>
    <tr><td>Value</td><td>TypeHandles.FLOAT</td><td>0</td><td>Used to set or participate in calculations, mathematical expressions can be connected.</td></tr>
  </tbody>
</table>
<h5 id="modify-the-scoreboard-value-output" data-toc-id="modify-the-scoreboard-value-output">Modify the scoreboard value output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>After the scoreboard updates the record is entered into the workflow, execution continues.</td></tr>
  </tbody>
</table>
<h4 id="modify-scoreboard-values-and-behavior-descriptions" data-toc-id="modify-scoreboard-values-and-behavior-descriptions">Modify scoreboard values and behavior descriptions</h4>
<p>During compilation, a scoreboard is generated to modify actions, which are attached to the corresponding flow edge or the action chain after the goal is completed. Effective actions will not be generated when the scoreboard target is empty.</p>

<h2 id="variable" data-toc-id="variable">variable</h2>

<h3 id="set-variables" data-toc-id="set-variables">Set variables</h3>
<p>Set variables are execution stream nodes with side effects, used to write values to quest variables.</p>
<h4 id="set-the-variable-node-overview" data-toc-id="set-the-variable-node-overview">Set the variable node overview</h4>
<ul>
  <li><p>Category: Variable &gt; Set variables</p></li>
  <li><p>Group: variable</p></li>
  <li><p>Registration ID:<code>viscript_quests:set_variable</code></p></li>
  <li><p>Applicable graphs: root maps, sub-map of small quests</p></li>
</ul>
<h4 id="set-the-variable-node-parameters" data-toc-id="set-the-variable-node-parameters">Set the variable node parameters</h4>
<h5 id="set-the-variable-option" data-toc-id="set-the-variable-option">Set the variable option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>variable name</td><td>TypeHandles.STRING</td><td>Empty string</td><td>The name of the quest variable to be written.</td></tr>
  </tbody>
</table>
<h5 id="set-variable-input" data-toc-id="set-variable-input">Set variable input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the execution stream.</td></tr>
    <tr><td>Value</td><td>TypeHandles.FLOAT</td><td>0</td><td>To write the value of a variable, you can connect the mathematical expression.</td></tr>
  </tbody>
</table>
<h5 id="set-the-variable-output" data-toc-id="set-the-variable-output">Set the variable output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>The result</td><td>TypeHandles.FLOAT</td><td>Output and write values to facilitate continued use as expressions.</td></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>After writing the variable to the process, it continues to be executed.</td></tr>
  </tbody>
</table>
<h4 id="set-variables-and-behavior-descriptions" data-toc-id="set-variables-and-behavior-descriptions">Set variables and behavior descriptions</h4>
<p>During compile, variable settings are generated, with the operation method fixed as  <code>SET</code>。 When the variable is named empty, no valid action is generated. Variable declarations in blueprints are collected together when exported.</p>

<h2 id="debugging" data-toc-id="debugging">Debugging</h2>

<h3 id="debug-printing" data-toc-id="debug-printing">Debug printing</h3>
<p>Debug print is used to output fixed text during process runtime.</p>
<h4 id="debug-and-print-node-overview" data-toc-id="debug-and-print-node-overview">Debug and print node overview</h4>
<ul>
  <li><p>Category: Debugging &gt; Debugging Printing</p></li>
  <li><p>Grouping: debug</p></li>
  <li><p>Registration ID:<code>viscript_quests:debug_print</code></p></li>
  <li><p>Applicable graphs: root maps, sub-map of small quests</p></li>
</ul>
<h4 id="debug-the-print-node-parameters" data-toc-id="debug-the-print-node-parameters">Debug the print node parameters</h4>
<h5 id="debug-the-print-option" data-toc-id="debug-the-print-option">Debug the print option</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Output to the chat bar</td><td>TypeHandles.BOOL</td><td>false</td><td>If true, send it to the player's chat bar; Otherwise, it is used by default for log debugging.</td></tr>
  </tbody>
</table>
<h5 id="debug-print-input" data-toc-id="debug-print-input">Debug Print Input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the execution stream.</td></tr>
    <tr><td>Prompt text</td><td>TypeHandles.STRING</td><td>Empty string</td><td>For text to be printed, you can write constants in the port.</td></tr>
  </tbody>
</table>
<h5 id="debug-print-output" data-toc-id="debug-print-output">Debug print output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>After recording the print action into the process, continue execution.</td></tr>
  </tbody>
</table>
<h4 id="debug-print-behavior-description" data-toc-id="debug-print-behavior-description">Debug Print Behavior Description</h4>
<p>During compilation, debug print actions are generated and hung on the corresponding flow edge or the action chain after the goal is completed. Suitable for checking whether the process passes through a certain node as expected.</p>

<h3 id="print-variables" data-toc-id="print-variables">Print variables</h3>
<p>Print variables are used to output the current value of a variable or expression during process runtime.</p>
<h4 id="print-variable-node-overview" data-toc-id="print-variable-node-overview">Print variable node overview</h4>
<ul>
  <li><p>Category: Debugging &gt; Print variables</p></li>
  <li><p>Grouping: debug</p></li>
  <li><p>Registration ID:<code>viscript_quests:debug_print_var</code></p></li>
  <li><p>Applicable graphs: root maps, sub-map of small quests</p></li>
</ul>
<h4 id="print-the-variable-node-parameters" data-toc-id="print-the-variable-node-parameters">Print the variable node parameters</h4>
<h5 id="print-variable-options" data-toc-id="print-variable-options">Print variable options</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Parameters</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>variable name</td><td>TypeHandles.STRING</td><td>Empty string</td><td>Manually specify the variable name to print; When a value is entered with a concatenated expression, the expression is used first.</td></tr>
    <tr><td>Output to the chat bar</td><td>TypeHandles.BOOL</td><td>false</td><td>If true, send it to the player's chat bar; Otherwise, it is used by default for log debugging.</td></tr>
  </tbody>
</table>
<h5 id="print-variable-input" data-toc-id="print-variable-input">Print variable input</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Default values</th><th>Explanation</th></tr>
    <tr><td>Entrance</td><td>TypeHandles.EXECUTION_FLOW</td><td>None</td><td>Receive the execution stream.</td></tr>
    <tr><td>Value</td><td>QuestBlueprintTypes.OBJECT</td><td>None</td><td>You can link any type of variable or expression to print the current value.</td></tr>
  </tbody>
</table>
<h5 id="print-variable-output" data-toc-id="print-variable-output">Print variable output</h5>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Port</th><th>Type</th><th>Explanation</th></tr>
    <tr><td>Next</td><td>TypeHandles.EXECUTION_FLOW</td><td>After recording the print action into the process, continue execution.</td></tr>
  </tbody>
</table>
<h4 id="print-variable-behavior-description" data-toc-id="print-variable-behavior-description">Print variable behavior description</h4>
<p>During compilation, prioritize converting the input value into the connected expression into dynamic printable values; If there is no expression, manually filled variable names are used; If that doesn't work, try to infer variable names from the variable lines or use constant values. Debugging actions will not be generated when there is no printable content.</p>
