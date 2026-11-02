<h1 id="vsq-learning-path" data-toc-id="vsq-learning-path">VSQ learning path</h1>
<p>Learn in this order: structure, a linear quest, blueprint operations, then branches and failure handling. Videos use the real quest editor and book, with examples compiled and executed on the server.</p>
<h2 id="where-to-start" data-toc-id="where-to-start">Where to start</h2>
<ol>
<li><p><a href="?file=&quot;Quest System.Structure and Lifecycle&quot;">Understand categories, quests, subquests, objectives and rewards</a></p>
</li>
<li><p><a href="?file=&quot;Blueprint Examples.Submission and Stage Rewards&quot;">Complete collection, submission, consumption and stage rewards</a></p>
</li>
<li><p><a href="?file=&quot;Blueprint Examples.Branch by Inventory&quot;">Choose a route from inventory count</a></p>
</li>
<li><p><a href="?file=&quot;Blueprint Examples.Parallel Tasks and Joins&quot;">Organize parallel routes with ALL, ANY and COUNT</a></p>
</li>
<li><p><a href="?file=&quot;Blueprint Examples.Timeout and Recovery&quot;">Route timeout failures to recovery</a></p>
</li>
</ol>
<p><a href="?file=&quot;Blueprints.Quest-Blueprint-Tutorial&quot;">Blueprint operations video: wiring, moving and undo</a></p>
<h2 id="choose-nodes-from-the-gameplay-goal" data-toc-id="choose-nodes-from-the-gameplay-goal">Choose nodes from the gameplay goal</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Gameplay goal</th><th>Node combination</th><th>Expected result</th></tr>
<tr><td>Wood before stone</td><td>Subquest.success -&gt; Subquest.in</td><td>The later stage starts locked and activates after success.</td></tr>
<tr><td>Deliver when stocked, otherwise gather</td><td>Get Player Item Count -&gt; Compare -&gt; Branch</td><td>At evaluation, only the true or false route activates.</td></tr>
<tr><td>Finish both wood and stone</td><td>Parallel subquests -&gt; Join ALL</td><td>One completed route still waits for the other.</td></tr>
<tr><td>Choose any two of three jobs</td><td>Three parallel subquests -&gt; Join COUNT=2</td><td>The second arrival advances; unchosen routes are skipped.</td></tr>
<tr><td>Timeout and recovery</td><td>Countdown FAILURE + Subquest.failure</td><td>Reaching zero activates recovery.</td></tr>
<tr><td>Arrive, then interact with an NPC</td><td>Location.next -&gt; Interact Entity.in</td><td>The interaction objective activates after arrival.</td></tr>
<tr><td>Complete an instructional scene</td><td>Ponder objective -&gt; next objective</td><td>Later objectives activate after viewing completion.</td></tr>
<tr><td>Show a reward without granting it</td><td>Reward Placeholder</td><td>Display only; actual grants need reward nodes or external logic.</td></tr>
</tbody></table>
<h2 id="before-reproducing-the-examples" data-toc-id="before-reproducing-the-examples">Before reproducing the examples</h2>
<p>Examples use Chinese UI, manual item submission and normal quest runtime behavior. The editor requires permission level 4. Projects, runtime files, categories and grant commands are separate steps; complete the minimal loop from the structure page first.</p>
<p><a href="/downloads/viscriptquests-tutorial-examples.zip">Download five example projects and runtime quests</a></p>
<p>Follow the included file-placement instructions and add the quest IDs to categories manually; the package does not replace your category configuration.</p>
<h2 id="reading-guidance" data-toc-id="reading-guidance">Reading guidance</h2>
<p>Values such as four logs, three stone and eight seconds are teaching examples. Node/port IDs match source; localized names follow the game. Each guide includes expected behavior and common mistakes, with the node reference for field details.</p>
