<h1 id="quest-structure-and-lifecycle" data-toc-id="quest-structure-and-lifecycle">Quest structure and lifecycle</h1>
<p><a href="?file=&quot;Learning Path&quot;">Learning path and videos</a> · <a href="?file=&quot;Blueprints.Blueprint-Nodes&quot;">Node reference</a></p>
<p>Use Village Supplies to understand the hierarchy: a category organizes the book, a quest is a whole commission, subquests are its stages, objectives are player actions, and rewards are settlement results.</p>
<figure data-type="local-video" data-width="960" style="width: 960px; max-width: 100%;"><video src="/md/media/viscriptquests-01-structure-and-subgraph.mp4" poster="/md/media/viscriptquests-01-structure-and-subgraph.png" controls playsinline preload="metadata"><a href="/md/media/viscriptquests-01-structure-and-subgraph.mp4">Download demonstration video</a></video><figcaption>The root orders stages; double-click a subquest to enter objectives and rewards.</figcaption></figure>
<p>Video uses Chinese UI and burned-in Chinese captions; the English text below describes every connection and parameter.</p>
<p><a href="/md/media/viscriptquests-01-structure-and-subgraph.mp4">Download MP4</a> · <a href="/md/media/viscriptquests-01-structure-and-subgraph.zh.vtt">Chinese subtitles</a> · <a href="/md/media/viscriptquests-01-structure-and-subgraph.en.vtt">English subtitles</a></p>
<h2 id="responsibilities-of-the-five-levels" data-toc-id="responsibilities-of-the-five-levels">Responsibilities of the five levels</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Level</th><th>Example</th><th>Player-visible effect</th></tr>
<tr><td>Category</td><td>Tutorial - Village Commissions</td><td>Chooses the book tab; does not grant the quest automatically.</td></tr>
<tr><td>Quest</td><td>Village Supplies</td><td>Quest Start supplies its title; a successful end completes the whole commission.</td></tr>
<tr><td>Subquest</td><td>Collect oak -&gt; Collect cobblestone</td><td>Root success wires activate the next stage; locked stages cannot be submitted early.</td></tr>
<tr><td>Objective</td><td>Manually submit four oak logs</td><td>Controls progress, submission and consumption inside that subquest’s own subgraph.</td></tr>
<tr><td>Reward</td><td>Two bread on stage completion</td><td>Rewards connected to the subquest start rewards output are fixed stage rewards. Placeholders do not grant anything.</td></tr>
</tbody></table>
<h2 id="how-the-root-and-subgraphs-relate" data-toc-id="how-the-root-and-subgraphs-relate">How the root and subgraphs relate</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">Quest Start.next -&gt; Subquest A.in
Subquest A.success -&gt; Subquest B.in
Subquest B.success -&gt; Quest End.in

Inside Subquest A:
Subquest Start.objectives -&gt; Item Objective.in
Subquest Start.rewards -&gt; Item Reward.in</code></pre>
<p>Double-click the subquest title to enter its managed subgraph, then use the top breadcrumb to return. Managed subgraphs are compiled with their subquests. The disabled commands are generic subgraphs without a subquest owner.</p>
<h2 id="from-project-to-player-progress" data-toc-id="from-project-to-player-progress">From project to player progress</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Object</th><th>Purpose</th><th>Action</th></tr>
<tr><td>.questproj</td><td>Editable nodes, positions, wires and subgraphs.</td><td>Save/upload the project for further editing.</td></tr>
<tr><td>.quest</td><td>Compiled task definition loaded by the server.</td><td>Export/upload the runtime quest and reload it.</td></tr>
<tr><td>Category configuration</td><td>Lists the logical quest file ID in a category.</td><td>Add the ID in category configuration; saving a project is insufficient.</td></tr>
<tr><td>Player progress</td><td>Active stages, objective progress, variables and reward records.</td><td>Starts when granted; replacing a file does not reset existing progress.</td></tr>
</tbody></table>
<h2 id="verify-a-minimal-complete-loop" data-toc-id="verify-a-minimal-complete-loop">Verify a minimal complete loop</h2>
<p>Begin with Start -> one Subquest -> successful End, one manual item objective and one fixed reward. Verify grant, submission, exact consumption and a single reward before adding branching or parallelism.</p>
<p><a href="?file=&quot;Blueprint Examples.Submission and Stage Rewards&quot;">Next: submission and stage rewards</a></p>
