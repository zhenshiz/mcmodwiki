<h1 id="submission-and-stage-rewards" data-toc-id="submission-and-stage-rewards">Submission and stage rewards</h1>
<p><a href="?file=&quot;Learning Path&quot;">Learning path and videos</a> · <a href="?file=&quot;Blueprints.Blueprint-Nodes&quot;">Node reference</a></p>
<p>Goal: submit four oak logs for two bread, then three cobblestone for one emerald. The second stage must activate only after the first succeeds.</p>
<figure data-type="local-video" data-width="960" style="width: 960px; max-width: 100%;"><video src="/md/media/viscriptquests-02-submit-and-rewards.mp4" poster="/md/media/viscriptquests-02-submit-and-rewards.png" controls playsinline preload="metadata"><a href="/md/media/viscriptquests-02-submit-and-rewards.mp4">Download demonstration video</a></video><figcaption>Watch real submission, consumption, stage unlocking and rewards.</figcaption></figure>
<p>Video uses Chinese UI and burned-in Chinese captions; the English text below describes every connection and parameter.</p>
<p><a href="/md/media/viscriptquests-02-submit-and-rewards.mp4">Download MP4</a> · <a href="/md/media/viscriptquests-02-submit-and-rewards.zh.vtt">Chinese subtitles</a> · <a href="/md/media/viscriptquests-02-submit-and-rewards.en.vtt">English subtitles</a></p>
<h2 id="nodes-and-settings" data-toc-id="nodes-and-settings">Nodes and settings</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Location/node</th><th>Settings</th><th>Effect</th></tr>
<tr><td>Root: two subquests</td><td>A.success -&gt; B.in</td><td>Stage B cannot be submitted at the start.</td></tr>
<tr><td>A subgraph: item objective</td><td>item_stack = minecraft:oak_log; item_count = 4; submit_mode = MANUAL; consume_item = true</td><td>Shows Submit and consumes four logs when fulfilled.</td></tr>
<tr><td>A subgraph: item reward</td><td>item_stack = minecraft:bread; item_count = 2</td><td>Connect from start rewards to grant two bread on A success.</td></tr>
<tr><td>B subgraph: item objective</td><td>minecraft:cobblestone; item_count = 3; MANUAL; consume_item = true</td><td>Activates after A and accepts cobblestone submission.</td></tr>
<tr><td>B subgraph: item reward</td><td>minecraft:emerald; item_count = 1</td><td>Grants one emerald on B success before reaching the end.</td></tr>
</tbody></table>
<h2 id="build-order" data-toc-id="build-order">Build order</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">Root: Start.next -&gt; A.in
A.success -&gt; B.in
B.success -&gt; End.in

A and B subgraphs:
Subquest Start.objectives -&gt; Item Objective.in
Subquest Start.rewards -&gt; Item Reward.in</code></pre>
<p>A new project contains a dirt example. Change it to oak, then create/copy a subquest for stone. Copied subquests have independent subgraphs; check each ingredient, amount and reward.</p>
<h2 id="automatic-manual-and-consumption-settings" data-toc-id="automatic-manual-and-consumption-settings">Automatic, manual and consumption settings</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Choice</th><th>Player experience</th></tr>
<tr><td>MANUAL</td><td>Shows a Submit button; item/currency objectives support partial submission as defined by their types.</td></tr>
<tr><td>AUTO</td><td>An active objective automatically attempts settlement when satisfied.</td></tr>
<tr><td>consume_item = true</td><td>Matching items are removed during successful submission, including partial manual submissions.</td></tr>
<tr><td>consume_item = false</td><td>Useful for possession/equipment checks; describe it as holding, rather than handing over, items.</td></tr>
</tbody></table>
<p>In manual mode, 0/4 is submitted progress rather than inventory count; held materials still require Submit.</p>
<h2 id="expected-results" data-toc-id="expected-results">Expected results</h2>
<p>On grant only wood is active. Submitting wood removes four logs, gives two bread and activates stone. Submitting stone removes three cobblestone, grants one emerald and completes the quest. Reopening the book must not grant rewards again. The recording checks these server results.</p>
