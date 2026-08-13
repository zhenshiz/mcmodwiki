<h1 id="quest-blueprint-operation-tutorial" data-toc-id="quest-blueprint-operation-tutorial">Quest blueprint operation tutorial</h1>
<p>This article introduces the project files, root diagrams and sub-quest diagrams, node connections, dynamic values, variables, sequential goals, shortcuts, as well as the export and distribution workflow of quests in the ViScriptQuests quest editor.</p>
<h2 id="core-concept" data-toc-id="core-concept">Core concept</h2>
<p>The quest editor saves two types of files:</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
  <tr>
    <th>File type</th>
    <th>Purpose</th>
    <th>Default server directory</th>
  </tr>
  <tr>
    <td>.questproj</td>
    <td>Editor project files, save complete blueprints, node locations, subdiagrams, comments, and other information for reopening and continuing editing.</td>
    <td>ldlib2/assets/viscript_quests/project</td>
  </tr>
  <tr>
    <td>.quest</td>
    <td>Runtime quest files, compiled and exported from blueprints, for the server to issue and execute quests.</td>
    <td>ldlib2/assets/viscript_quests/quest</td>
  </tr>
  </tbody>
</table>
<p>The core structure of the quest system in this mod is as follows:</p>
<div code="classDiagram
    direction TB

class QuestSystem {
        +UI interface display
    }

class QuestBook {
        + Current player quest list
    }

class classification {
        + Category name (e.g., main story, side quest, faction, daily game)
    }

class MajorQuest {
        + Major quest names (e.g., Hero's Newbie Trial)
        + Prerequisites
        + Background story description
    }

class SmallQuest {
        + Quest Names (e.g., Visiting the Village Chief)
        +List Objectives (e.g., 1 conversation / 10 monsters killed)
        +List rewards (e.g., experience, gold, equipment)
        +Current Status (In Progress, Completed)
    }

QuestSystem ..&gt; QuestBook : Opens/displays
    QuestBook &quot;1&quot; *-- &quot;1..*&quot; Classification : Contains
    Classification &quot;1&quot; *-- &quot;0..*&quot; MajorQuest : Contains exclusively
    MajorQuest &quot;1&quot; *-- &quot;1..*&quot; SmallQuest : Contains"
     hidecode="false" class="mermaid-render-container" data-type="mermaid">
  <div class="mermaid">classDiagram
    direction TB

class QuestSystem {
        +UI interface display
    }

class QuestBook {
        + Current player quest list
    }

class classification {
        + Category name (e.g., main story, side quest, faction, daily game)
    }

class MajorQuest {
        + Major quest names (e.g., Hero's Newbie Trial)
        + Prerequisites
        + Background story description
    }

class SmallQuest {
        + Quest Names (e.g., Visiting the Village Chief)
        +List Objectives (e.g., 1 conversation / 10 monsters killed)
        +List rewards (e.g., experience, gold, equipment)
        +Current Status (In Progress, Completed)
    }

QuestSystem ..&gt; QuestBook : Opens/displays
    QuestBook "1" *-- "1..*" Classification : Contains
    Classification "1" *-- "0..*" MajorQuest : Contains exclusively
    MajorQuest "1" *-- "1..*" SmallQuest : Contains</div>
</div>
<p>From the player's perspective, it feels similar to this</p>
<div code="graph TD
    A[🎮 Quest System] ==&gt;|Open interface| B((📖 Quest Log))

B ==&gt; C1(📁 Category: Main Quest)
    B ==&gt; C2(📁 Category: Side Quests)
    B ==&gt; C3(📁 Category: Daily Quests)

C1 --&gt; D1[📜 Major Quest: Save the Newbie Village]
    C1 --&gt; D2[📜 Major Quest: Advance on the Royal City]

C2 --&gt; D3[📜 Major Quest: The Blacksmith's Troubles]

D1 --&gt; E1{🎯 Small Quest 1: Understand the Situation}
    D1 --&gt; E2{🎯 Small Quest 2: Clear the Back Hill}

E2 -.-&gt; F1[✔️ Objective: Kill Slimes 0/10]
    E2 -.-&gt; F2[✔️ Objective: Collect Slimeballs 0/5]
    E2 -.-&gt; F3[🎁 Reward: 500 XP, Iron Sword x1]

style A fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#f5a623,stroke:#333,stroke-width:2px,color:#fff
    style C1 fill:#7ed321,stroke:#333,color:#fff
    style D1 fill:#bd10e0,stroke:#333,color:#fff
    style E2 fill:#9013fe,stroke:#333,color:#fff
    style F1 fill:#f8e71c,stroke:#333,color:#000
    style F2 fill:#f8e71c,stroke:#333,color:#000
    style F3 fill:#ff7e67,stroke:#333,color:#000" hidecode="false"
     class="mermaid-render-container" data-type="mermaid">
  <div class="mermaid">graph TD
    A[🎮 Quest System] ==&gt;|Open interface| B((📖 Quest Log))

B ==&gt; C1(📁 Category: Main Quest)
    B ==&gt; C2(📁 Category: Side Quests)
    B ==&gt; C3(📁 Category: Daily Quests)

C1 --&gt; D1[📜 Major Quest: Save the Newbie Village]
    C1 --&gt; D2[📜 Major Quest: Advance on the Royal City]

C2 --&gt; D3[📜 Major Quest: The Blacksmith's Troubles]

D1 --&gt; E1{🎯 Small Quest 1: Understand the Situation}
    D1 --&gt; E2{🎯 Small Quest 2: Clear the Back Hill}

E2 -.-&gt; F1[✔️ Objective: Kill Slimes 0/10]
    E2 -.-&gt; F2[✔️ Objective: Collect Slimeballs 0/5]
    E2 -.-&gt; F3[🎁 Reward: 500 XP, Iron Sword x1]

style A fill:#4a90e2,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#f5a623,stroke:#333,stroke-width:2px,color:#fff
    style C1 fill:#7ed321,stroke:#333,color:#fff
    style D1 fill:#bd10e0,stroke:#333,color:#fff
    style E2 fill:#9013fe,stroke:#333,color:#fff
    style F1 fill:#f8e71c,stroke:#333,color:#000
    style F2 fill:#f8e71c,stroke:#333,color:#000
    style F3 fill:#ff7e67,stroke:#333,color:#000</div>
</div>
<p>Once you understand the overall structure of the quest system, you can officially start writing the quest.</p>
<h2 id="write-the-quest" data-toc-id="write-the-quest">Write the quest</h2>
<h3 id="open-the-editor" data-toc-id="open-the-editor">Open the editor</h3>
<p>
  With OP permission, players can use commands<code>viscript_quests editor [任务id]</code>Open the editor. The quest ID is optional. If your server's specified path has available project files, there will be a completion option to help you choose which project to open. You can include a subdirectory without needing a suffix.
</p>
<h3 id="understand-the-editors-infrastructure" data-toc-id="understand-the-editors-infrastructure">Understand the editor's infrastructure</h3>
<p>Editors are mainly divided into:</p>
<ol>
  <li>
    <p>
      The menu list in the upper left corner is divided into File, View, and Export. Files are used to operate local project files and runtime files; they are only for simple backups. They do not mean you can use these files directly after saving. You can also edit project files by exporting and importing them into JSON.<span data-type="hidden-text">However, having AI write such complex engineering documents as blueprints is not easy.</span>
    </p>
  </li>
  <li>
    <p>
      The three buttons in the top right corner are used to minimize, toggle editor size, and close the editor. Minimizing and recovering is handled by the LDLib2 editor's built-in screen management and does not create a separate set of project caches. After switching to smaller sizes, you can expose item managers like JEI, allowing you to drag items into drag-and-drop item components. Before closing the editor, save the project; do not treat minimizing as a saving operation.
    </p>
  </li>
  <li>
    <p>The lower left is the blueprint view, where the logic of the quest after creating the project is edited there.</p>
  </li>
  <li>
    <p>
      The bottom right is the attribute form. Although each node in the blueprint can be edited directly by entering parameters within the node, you can also choose to edit in this view after clicking the node, which is more user-friendly for large List components.
    </p>
  </li>
</ol>
<h3 id="create-a-project" data-toc-id="create-a-project">Create a project</h3>
<p>Click<code>文件-&gt;新建-&gt;任务文件</code>After creating a project, you will see a minimal exportable example automatically generated in the blueprint view:</p>
<div code="flowchart LR
    A[&quot;Quest Start&quot;] --&gt; B[&quot;Small Quest: Collect Dirt&quot;]
    B -- Success --&gt; C[&quot;Quest End&quot;]" hidecode="false"
     class="mermaid-render-container" data-type="mermaid">
  <div class="mermaid">flowchart LR
    A["Quest Start"] --&gt; B["Small Quest: Collect Dirt"]
    B -- Success --&gt; C["Quest End"]</div>
</div>
<p>By default, the small quest subgraph (double-click the small quest node) will include:</p>
<div code="flowchart LR
    A[&quot;Small Quest Start&quot;] -- Objective --&gt; B[&quot;Obtain Item: Dirt&quot;]
    A -- Fixed Reward --&gt; C[&quot;Item Reward: Diamond x1&quot;]" hidecode="false"
     class="mermaid-render-container" data-type="mermaid">
  <div class="mermaid">flowchart LR
    A["Small Quest Start"] -- Objective --&gt; B["Obtain Item: Dirt"]
    A -- Fixed Reward --&gt; C["Item Reward: Diamond x1"]</div>
</div>
<p>This example can be used directly as a template for creating quests, saving or exporting.</p>
<h3 id="blueprint-operation" data-toc-id="blueprint-operation">Blueprint operation</h3>
<p>
  The blueprint view is where the quest editor truly writes the quest logic. RootTu is responsible for arranging the process of major quests, such as which small quest to go from the start, where to go after success or failure, and how to end it; The sub-quest is responsible for filling in the internal goals, rewards, and actions taken after completing the quest. When creating quests, it's recommended to first build the flow in the root map, then double-click the small quests to enter sub-maps to supplement goals and rewards.
</p>
<h4 id="root-and-sub-diagrams" data-toc-id="root-and-sub-diagrams">Root and sub-diagrams</h4>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
  <tr>
    <th>Location</th>
    <th>Main uses</th>
    <th>Normally placed node</th>
  </tr>
  <tr>
    <td>Root map</td>
    <td>Arrange the workflow for major quests.</td>
    <td>Quest start, small quests, quest end, conditional branching, merge nodes, as well as auxiliary logic, math, variables, scoreboards, and debug nodes.</td>
  </tr>
  <tr>
    <td>Small quest sub-map</td>
    <td>Write down the goals, rewards, and actions after completing each small quest.</td>
    <td>Small quest starting points, quest objectives, quest rewards, conditional branches, as well as auxiliary logic, math, variables, scoreboards, and debugging nodes.</td>
  </tr>
  </tbody>
</table>
<p>
  Double-clicking the small quest node in the root graph can enter its own small quest subgraph. After entering the subgraph, you can return to the root image via the breadcrumb path in the middle of the top. When creating a small quest, an independent subgraph will be automatically created for it and placed as the unique starting point for the small quest. The author only needs to connect to the target node from the starting point to the target exit and the fixed reward exit to the reward node. When copying a small quest, it will simultaneously copy an independent subimage; the two small quests will not share the same content.
</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">A subgraph of a small quest is a managed subgraph</div>
  <div data-type="admonition-content">
    <p>Quest Blueprint has disabled the LDLib2 generic "Create Subgraph" command. Please only enter the subgraph it owns by double-clicking the small quest node; do not manually create a generic subgraph that has no ownership relationship with the small quest.</p>
  </div>
</div>
<h4 id="create-nodes" data-toc-id="create-nodes">Create nodes</h4>
<ol>
  <li>
    <p>Right-click on an empty area of the blueprint canvas to open the right-click menu.</p>
  </li>
  <li>
    <p>Choice<code>添加节点</code>。</p>
  </li>
  <li>
    <p>Select nodes by category in the node database, or search by node name, for example<code>获取物品</code>。</p>
  </li>
  <li>
    <p>Click the node you want to create; it will appear near the spot you just right-clicked.</p>
  </li>
</ol>
<p>
  The node database automatically filters nodes based on the current diagram. For example, the root map will not display nodes for small quests like obtaining items or item rewards; In the subgraph of small quests, root diagram flow nodes such as quest start, small quest, quest end, and merge nodes will not be displayed. This filtering is designed to avoid invalid structures during export.
</p>
<h4 id="choose-and-move" data-toc-id="choose-and-move">Choose and move</h4>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
  <tr>
    <th>Operation</th>
    <th>Method</th>
    <th>Explanation</th>
  </tr>
  <tr>
    <td>Select a node or a connection</td>
    <td>Left-click on the node or wire.</td>
    <td>After selecting a single node, the properties form on the right will display its parameters.</td>
  </tr>
  <tr>
    <td>Deselect the selection</td>
    <td>Left-click on a blank area of the canvas.</td>
    <td>It clears the current choices.</td>
  </tr>
  <tr>
    <td>Multiple choice</td>
    <td>For Windows and Linux, hold down Ctrl and left-click; On macOS, hold down Cmd and left-click.</td>
    <td>Used for batch moving, copying, and deleting. On macOS, I use cmd.</td>
  </tr>
  <tr>
    <td>Box selection</td>
    <td>Hold down the left mouse button on a blank area of the canvas and drag.</td>
    <td>Boxed nodes, notes, and area boxes will be selected.</td>
  </tr>
  <tr>
    <td>Mobile nodes</td>
    <td>After selecting the node, hold down the left mouse button and drag.</td>
    <td>By default, it will be attached to the mesh; You can turn the attachment on or off using the top magnet button.</td>
  </tr>
  <tr>
    <td>Displayed at the top</td>
    <td>Click the node.</td>
    <td>Clicked nodes move above the display layer, making it easier to organize overlapping nodes.</td>
  </tr>
  </tbody>
</table>
<h4 id="connection-nodes" data-toc-id="connection-nodes">Connection nodes</h4>
<p>When connecting, hold down the left mouse button from one node's output port to drag it to the input port of another node, then release the mouse. During dragging, the connectable ports will be highlighted; If the port type does not match, releasing will not create a connection.
</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
  <tr>
    <th>Port type</th>
    <th>Common names</th>
    <th>Connection rules</th>
  </tr>
  <tr>
    <td>Execution flow</td>
    <td>Entry, Next, Success, Failure, Goal, Fixed Reward, True, False</td>
    <td>It can only connect to the execution stream port to determine the order of node execution.</td>
  </tr>
  <tr>
    <td>Boolean value</td>
    <td>Conditions, results</td>
    <td>A common use is to connect the results of numerical comparisons to conditional input in the conditional branch.</td>
  </tr>
  <tr>
    <td>Numerical values</td>
    <td>Value, value A, value B, minimum value, maximum value</td>
    <td>Integer and floating-point numbers can be connected to each other, making them suitable for scoreboards, mathematical operations, and variable writing.</td>
  </tr>
  <tr>
    <td>Any type</td>
    <td>Print the value of the variable node</td>
    <td>It can receive various types of inputs and is mainly used for debugging outputs.</td>
  </tr>
  </tbody>
</table>
<p>
  The most common connection in root maps is connecting the next step at the start of a quest to the entry point of the small quest, then connecting the successful exit of the small quest to the entry point of the quest end. The most common connection in small quest subgraphs is to connect the target exit of the small quest starting point to the quest objective, and the fixed reward exit to the quest reward.
</p>
<div code="flowchart LR
    A[&quot;Quest Start&quot;] -- Next --&gt; B[&quot;Small Quest&quot;]
    B -- Success --&gt; C[&quot;Quest End&quot;]
    B -. Double-click to enter .-&gt; D[&quot;Small Quest Subgraph&quot;]
    D -- Objective --&gt; E[&quot;Quest Objective&quot;]
    D -- Fixed Reward --&gt; F[&quot;Quest Reward&quot;]" hidecode="false"
     class="mermaid-render-container" data-type="mermaid">
  <div class="mermaid">flowchart LR
    A["Quest Start"] -- Next --&gt; B["Small Quest"]
    B -- Success --&gt; C["Quest End"]
    B -. Double-click to enter .-&gt; D["Small Quest Subgraph"]
    D -- Objective --&gt; E["Quest Objective"]
    D -- Fixed Reward --&gt; F["Quest Reward"]</div>
</div>
<h4 id="disconnect-and-delete" data-toc-id="disconnect-and-delete">Disconnect and delete</h4>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
  <tr>
    <th>Operation</th>
    <th>Method</th>
    <th>Explanation</th>
  </tr>
  <tr>
    <td>Delete the selected content</td>
    <td>Select nodes, wires, sticky notes, or area boxes and press the delete button.</td>
    <td>When deleting a node, the wires on it are also removed.</td>
  </tr>
  <tr>
    <td>Delete a certain line</td>
    <td>After selecting the wire, press the delete key, or right-click the wire and choose delete.</td>
    <td>Suitable for correcting error-related processes.</td>
  </tr>
  <tr>
    <td>Disconnect all connections at the node</td>
    <td>After selecting the node, right-click and choose to disconnect all connections.</td>
    <td>Only disconnect the wire, do not delete the node.</td>
  </tr>
  <tr>
    <td>Undo misoperations</td>
    <td>For Windows and Linux, press Ctrl+Z; On macOS, press Cmd+Z; You can also click the undo button at the top.</td>
    <td>Color, move, delete, paste, and other image editing operations can all be undone.</td>
  </tr>
  </tbody>
</table>
<h4 id="edit-parameters" data-toc-id="edit-parameters">Edit parameters</h4>
<p>
  After selecting a single node, the properties form on the right will display its editable parameters. The UUIDs of small quest nodes and target nodes are also displayed here, which can be used for precise location in commands, KubeJS, and the NeoForge API. The current quest blueprint hides the inline parameter editor inside the node, so you mainly use the right attribute form to change the title, item, entity type, coordinates, and other content. After modifying parameters, the node ports in the blueprint may change dynamically. For example, when a mathematical node switches to the limit range, it will display three input ports: value, minimum value, and maximum value. The merge node switches to at least
  When there are N options, the required quantity input ports will be displayed.</p>
<p>If you want to set item parameters, you can first switch the editor to a smaller window to display the item manager interface, then drag the item into the corresponding item configuration item. This makes it more intuitive than manually filling in item IDs.</p>
<h4 id="variable-system" data-toc-id="variable-system">Variable system</h4>
<p>
  Variables are used to store temporary states within the same quest flow, such as recording scores, stage counts, whether a branch has been triggered, or leaving the calculation result after a goal is completed for subsequent processes. Variables represent the player's current quest status and are not shared server-wide; When the same quest is assigned to different players, each player has their own variable value.
</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
  <tr>
    <th>Composition</th>
    <th>Purpose</th>
    <th>Common usage</th>
  </tr>
  <tr>
    <td>Blackboard variables</td>
    <td>Declare variable name, type, and default value.</td>
    <td>When multiple nodes need to share the same value, first create a variable on the blackboard or variable panel, then connect the variable node to the math, comparison, or debug node.</td>
  </tr>
  <tr>
    <td>Set variables</td>
    <td>Write variables as the execution stream passes.</td>
    <td>Connect the mathematical operations, scoreboard values, or constants into value inputs, and fill in the variable name to be written.</td>
  </tr>
  <tr>
    <td>Print variables</td>
    <td>Debug the current value of a variable or expression.</td>
    <td>Connect variables or expressions to value input, check output in the chat bar, and you can see the result directly in the game.</td>
  </tr>
  </tbody>
</table>
<p>
  When exporting a quest, the default value of the blackboard variable is written to the runtime quest file. After receiving a quest, the player will run these default values into their own quest variable table. In subsequent processes, the setting variable node will modify this runtime variable; Numerical comparisons, mathematical operations, and printing variables can read these variables.
</p>
<ol>
  <li>
    <p>First, create a variable in the blackboard or variable panel, and set its name, type, and default value. For variables that require numerical calculations or conditional judgment, it is recommended to use integers, floating-point numbers, or boolean values.</p>
  </li>
  <li>
    <p>When you need to read a variable, connect the variable node to the input port for numerical comparison, mathematical operations, variable settings, or printing variables.</p>
  </li>
  <li>
    <p>When modifying parameters, place the variable node, connect the entry and next steps into the execution stream, and fill in the variable name to be written.</p>
  </li>
  <li>
    <p>When branching based on variables, connect the variable to the numerical comparison, then connect the result of the comparison to the conditional branch.</p>
  </li>
</ol>
<p>
  Setting variables are action nodes with execution flows; variables are only written when the flow actually passes through them. When the variable name is empty, no write action is generated; If the variable name is spelled inconsistently, it will be used as another runtime variable. If a numeric expression cannot read a variable, it will press the button <code>0</code> Therefore, when debugging complex processes, it is recommended to first confirm the variable values with printed variables.
</p>
<h5 id="pass-the-main-map-variable-into-the-subtask-subgraph" data-toc-id="pass-the-main-map-variable-into-the-subtask-subgraph">Pass the main map variable into the subtask subgraph</h5>
<p>Small quest subgraphs can expose variable ports via LDLib2 Blackboard. After creating variables and setting read/write modifiers in the subgraph variable panel, the outer subtask node will automatically generate the corresponding port:</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Subgraph variable modifier</th><th>Outer layer small quest nodes</th><th>Purpose</th></tr>
    <tr><td>READ</td><td>Generate input ports</td><td>Pass root diagram variables, constants, scoreboards, or mathematical expressions into the subgraph.</td></tr>
    <tr><td>WRITE</td><td>Generate output ports</td><td>Returns the values written to the subgraph back to the outer flow.</td></tr>
    <tr><td>READ_WRITE</td><td>Generate input and output ports simultaneously</td><td>Read, modify, and pass results to subsequent processes within a small quest.</td></tr>
  </tbody>
</table>
<p>Variable names carry subgraph scope, so multiple small quests using the same local variable name will not have a string. Currently exposed <code>String</code>、<code>Int</code>、<code>Float</code>、<code>Bool</code> And <code>ItemStack</code>； The "Set Variable" node is still a numerical writing action.</p>

<h4 id="dynamic-parameters-and-display-switches" data-toc-id="dynamic-parameters-and-display-switches">Dynamic parameters and display switches</h4>
<p>Quantity and time are no longer just hardcoded values in the form on the right. The following parameters are the node input ports. You can directly fill in constants, or connect to scoreboards, variables, or mathematical output inputs:</p>
<ul>
  <li><p>The quantity of items to obtain, the number of entities killed, entity death, and block destruction required.</p></li>
  <li><p>The countdown lasts for seconds.</p></li>
  <li><p>Item reward quantity, experience bonus, and currency reward.</p></li>
</ul>
<p>The "Item" component of the Obtain Item node is only used to select item identity and component data; the actual required quantity is based on the input port for "Item Quantity."</p>
<p>All regular objectives have a "Show in Objective Bar" switch. When turned off, the target will still be detected and completed, but it will not appear in the quest book objective bar or tracking HUD. Target icons and prompt text forms related to display will also be hidden. All actual rewards have a "Show in rewards bar" switch; even when closed, rewards are still issued normally, but the reward icon and floating text form remain hidden. Dynamic switching only rebuilds the current form, does not duplicate component additions, and does not lose hidden values that have been filled.</p>

<h4 id="sequential-goals-and-target-status" data-toc-id="sequential-goals-and-target-status">Sequential goals and target status</h4>
<p>Objectives within the mini-quests can be unlocked one by one in the order of connection. The first level of objectives directly accessible from the "target" exit at the starting point of the small quest is initially set as follows <code>ACTIVE</code>； The "Next" port of the previous target is initially connected to the next target <code>LOCKED</code>, and only activates after the prerequisite goal is completed.</p>
<div code="flowchart LR
    A[&quot;Small Quest Start&quot;] -- Objective --&gt; B[&quot;Crafting Table: ACTIVE&quot;]
    B -- Next --&gt; C[&quot;Craft Flint and Steel: LOCKED&quot;]
    C -- Next --&gt; D[&quot;Review Thoughts: LOCKED&quot;]
    D -- Next --&gt; E[&quot;Go to the Nether: LOCKED&quot;]" hidecode="false" class="mermaid-render-container" data-type="mermaid">
  <div class="mermaid">flowchart LR
    A["Small Quest Start"] -- Objective --&gt; B["Crafting Table: ACTIVE"]
    B -- Next --&gt; C["Craft Flint and Steel: LOCKED"]
    C -- Next --&gt; D["Review Thoughts: LOCKED"]
    D -- Next --&gt; E["Go to the Nether: LOCKED"]</div>
</div>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>Status</th><th>Meaning</th></tr>
    <tr><td>LOCKED</td><td>Prerequisites are not yet fulfilled; No display, no detection, no submissions accepted.</td></tr>
    <tr><td>ACTIVE</td><td>Ongoing goals.</td></tr>
    <tr><td>COMPLETED</td><td>The goal has been achieved; Subsequent targets connected from the "Next" port will be unlocked.</td></tr>
    <tr><td>SKIPPED</td><td>The goal is skipped by the process and no longer participates in the current quest completion check.</td></tr>
  </tbody>
</table>
<p>Do not link multiple goals with strong sequential relationships directly to the starting point of the small quest, or they will be present together <code>ACTIVE</code> And displayed simultaneously.</p>
<h4 id="navigation-on-the-canvas" data-toc-id="navigation-on-the-canvas">Navigation on the canvas</h4>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
  <tr>
    <th>Operation</th>
    <th>Method</th>
    <th>Explanation</th>
  </tr>
  <tr>
    <td>Move the canvas flat</td>
    <td>Hold down the right mouse button to drag, or hold down the middle mouse button to drag.</td>
    <td>Short-pressing the right mouse button opens the menu, while dragging the right mouse button moves the canvas.</td>
  </tr>
  <tr>
    <td>Zoom in on the canvas</td>
    <td>Scroll the mouse wheel.</td>
    <td>Use the mouse's current position as the zoom center.</td>
  </tr>
  <tr>
    <td>Adapted view</td>
    <td>Click the adapter button on the top right.</td>
    <td>Try to bring the nodes in the current chart into your field of view as much as possible.</td>
  </tr>
  <tr>
    <td>Switch mesh adsorption</td>
    <td>Click the magnet button on the top right.</td>
    <td>After closing, node movement and new locations are no longer forcibly aligned to the grid.</td>
  </tr>
  <tr>
    <td>Enter the submap</td>
    <td>Double-click the small quest node.</td>
    <td>Enter the goal and reward editing area for this small quest.</td>
  </tr>
  <tr>
    <td>Return to the root map</td>
    <td>Click the root position in the top breadcrumb path.</td>
    <td>Subgraphs are not lost and are still stored in small quest nodes.</td>
  </tr>
  </tbody>
</table>
<h4 id="right-click-menu" data-toc-id="right-click-menu">Right-click menu</h4>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
  <tr>
    <th>Menu items</th>
    <th>Purpose</th>
  </tr>
  <tr>
    <td>Add nodes</td>
    <td>Open the node library and create a new blueprint node.</td>
  </tr>
  <tr>
    <td>Create a sticky note</td>
    <td>Add editor comments without affecting quest execution.</td>
  </tr>
  <tr>
    <td>Create a region box</td>
    <td>Use a regional box to organize a group of nodes without affecting quest execution.</td>
  </tr>
  <tr>
    <td>Copy, cut, paste, and duplicate</td>
    <td>Copy, cut, paste, or duplicate.</td>
  </tr>
  <tr>
    <td>Renamed</td>
    <td>Rename elements that support renaming.</td>
  </tr>
  <tr>
    <td>Color</td>
    <td>Modify the color of nodes or area boxes to distinguish different logic blocks.</td>
  </tr>
  <tr>
    <td>Fold or unfold</td>
    <td>Folded nodes reduce the space occupied by complex blueprints.</td>
  </tr>
  <tr>
    <td>Connect and turn to the portal</td>
    <td>Organize long lines into linear portals, mainly for visual organizing, without changing the quest logic.</td>
  </tr>
  </tbody>
</table>
<h4 id="shortcut-keys" data-toc-id="shortcut-keys">Shortcut keys</h4>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
  <tr>
    <th>Operation</th>
    <th>Windows and Linux</th>
    <th>macOS</th>
    <th>Explanation</th>
  </tr>
  <tr>
    <td>Delete the selected content</td>
    <td>Delete</td>
    <td>Fn+Delete or the standalone Delete key</td>
    <td>Delete selected nodes, lines, sticky notes, or area boxes.</td>
  </tr>
  <tr>
    <td>Revoked</td>
    <td>Ctrl+Z</td>
    <td>Cmd+Z</td>
    <td>Undo the previous chart editing operation.</td>
  </tr>
  <tr>
    <td>Redone</td>
    <td>Ctrl+Y or Ctrl+Shift+Z</td>
    <td>Cmd+Y or Cmd+Shift+Z</td>
    <td>Restore the operation that was just revoked.</td>
  </tr>
  <tr>
    <td>Copy</td>
    <td>Ctrl+C</td>
    <td>Cmd+C</td>
    <td>Copy the selected content.</td>
  </tr>
  <tr>
    <td>Cutting</td>
    <td>Ctrl+X</td>
    <td>Cmd+X</td>
    <td>Copy and delete the selected content.</td>
  </tr>
  <tr>
    <td>Paste</td>
    <td>Ctrl+V</td>
    <td>Cmd+V</td>
    <td>Paste content you just copied or cut.</td>
  </tr>
  <tr>
    <td>Copy the copy</td>
    <td>Ctrl+D</td>
    <td>Cmd+D</td>
    <td>Directly copy the selected content and place it next to it.</td>
  </tr>
  <tr>
    <td>Save the current project</td>
    <td>Ctrl+S</td>
    <td>Cmd+S</td>
    <td>Saving the current project file does not mean exporting the runtime quest.</td>
  </tr>
  <tr>
    <td>Save as Project</td>
    <td>Ctrl+Shift+S</td>
    <td>Cmd+Shift+S</td>
    <td>Save the current project as a new project file.</td>
  </tr>
  <tr>
    <td>Multiple choice</td>
    <td>Press Ctrl + Left Click</td>
    <td>Cmd + left click</td>
    <td>Add or deselect elements such as nodes and connections.</td>
  </tr>
  </tbody>
</table>
<p>On macOS, this editor follows Minecraft's shortcut key judgment, and commonly used key combinations are generally used<code>Cmd</code>Instead of Windows and Linux
  Above<code>Ctrl</code>。 Note that saving a project and exporting runtime quests are not the same thing. Save the project mainly for those that can continue editing<code>.questproj</code>Engineering; To enable the server to actually use the quest, it also needs to upload or export the runtime via the menu<code>.quest</code>Documents.
</p>
<h4 id="minimal-connection-process" data-toc-id="minimal-connection-process">Minimal connection process</h4>
<ol>
  <li>
    <p>Retain or create in the root diagram<code>任务开始</code>、<code>小任务</code>、<code>任务结束</code>Three nodes.</p>
  </li>
  <li>
    <p>Handle<code>任务开始</code><code>下一步</code>Connected<code>小任务</code><code>入口</code>。
    </p>
  </li>
  <li>
    <p>Handle<code>小任务</code><code>成功</code>Connected<code>任务结束</code><code>入口</code>。
    </p>
  </li>
  <li>
    <p>Double tap<code>小任务</code>Enter its independent subgraph and confirm it is automatically generated<code>小任务起点</code>It still exists.</p>
  </li>
  <li>
    <p>From<code>小任务起点</code><code>目标</code>Connect to at least one quest target node, for example<code>获取物品</code>。</p>
  </li>
  <li>
    <p>From<code>小任务起点</code><code>固定奖励</code>Connect to reward nodes, for example<code>物品奖励</code>。</p>
  </li>
  <li>
    <p>Select each node and fill in parameters such as title, item, quantity, coordinate, and reward in the right attribute form.</p>
  </li>
  <li>
    <p>Save the project, then upload or export the runtime quest file.</p>
  </li>
</ol>
<p>
  If the export fails, first check whether the root map can proceed from the quest start along the execution flow to the end, then check whether each subtask retains a unique small quest starting point and connects to at least one quest objective from the starting point exit. Missing execution streams, deleting automatic starting points, or targets not reaching the starting point will all result in invalid structures.
</p>
<h3 id="save-the-quest" data-toc-id="save-the-quest">Save the quest</h3>
<p>
  In the menu at the top left, you can save the current project's content to local or upload it to the server. If you open the project file in the editor, you can save it directly to the local file. If you open the server project file via a command, you need to upload it to the server after editing to overwrite the original file. Note that this file upload is file-level synchronization. If you want row-level synchronization, it's recommended to use Git.
</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">The current Beta does not retain compatibility with the old format</div>
  <div data-type="admonition-content">
    <p>Runtime <code>.quest</code> The integer version of the file is fixed to  <code>1</code>。<code>.questproj</code> Only the current LDLib2 standard uncompressed project structure is accepted, which <code>meta.version</code> It is a string <code>1.0</code>。 Currently, old compressed items, old fields, or old port maps are not read; After upgrading, please recreate the project or use the current version to re-export.</p>
  </div>
</div>
<h2 id="create-categories" data-toc-id="create-categories">Create categories</h2>
<p>
  Before using the runtime quest file, you need to create or organize quest categories. Usage <code>viscript_quests category config</code> Open the category configuration page, where you can edit category IDs, display names, icons, default label backgrounds, select label backgrounds, and the major quest IDs contained in the category. You can also adjust the category order by dragging. If the label background is not customized, use the blue default and select the mapping of this mod.
</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Did you know?</div>
  <div data-type="admonition-content">
    <p>
      When the quest classification information was initially designed, it was placed inside the quest. When facing multiple quests, setting a foreign key on the side with the more is very common<span data-type="hidden-text">(Infected by database)</span>However, if you design it this way, reusing and spreading quest files will be much more troublesome, because when placed in other environments, the category may not exist. In most cases, even if you want to reuse quests, the information in this category will usually need to be redesigned, requiring players to modify the information in each category one quest at a time, which is quite troublesome. So later on, the design changed to place this index in the category configuration file, which makes modifications much more convenient.
    </p>
  </div>
</div>
<h2 id="issue-quests" data-toc-id="issue-quests">Issue quests</h2>
<p>
  Once the categories are created, they can be used <code>viscript_quests grant &lt;玩家&gt; &lt;任务id&gt;</code> Assign quests, use <code>viscript_quests book</code> Open the quest book. Administrators can also use it <code>revoke</code> Cancel the quest,<code>complete</code> Forcing the completion of major quests,<code>submit</code> Submit the small quests currently tracking the player, as well as their usage <code>trigger &lt;玩家&gt; &lt;trigger_id&gt;</code> Complete the custom matching trigger target. When a custom objective is successfully triggered, no chat prompts are sent to the player or the executor; The failure prompt is only kept when there is no matching target.
</p>
<p>When a small or large quest is completed, the HUD will display a prompt that includes icons, titles, and a "Completed" indicator by default. Players can disable "Show Quest Completion Prompt" in the client configuration; the default value is  <code>true</code>。 The actual pixel size of this HUD does not change with the zoom of the Minecraft GUI.</p>
