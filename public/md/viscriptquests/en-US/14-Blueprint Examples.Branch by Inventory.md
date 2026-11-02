<h1 id="branch-by-inventory" data-toc-id="branch-by-inventory">Branch by inventory</h1>
<p><a href="?file=&quot;Learning Path&quot;">Learning path and videos</a> · <a href="?file=&quot;Blueprints.Blueprint-Nodes&quot;">Node reference</a></p>
<p>Goal: a blacksmith offers delivery when the player already holds three iron ingots, otherwise gathering. This uses both data wires and execution-flow wires.</p>
<figure data-type="local-video" data-width="960" style="width: 960px; max-width: 100%;"><video src="/md/media/viscriptquests-03-branch-by-inventory.mp4" poster="/md/media/viscriptquests-03-branch-by-inventory.png" controls playsinline preload="metadata"><a href="/md/media/viscriptquests-03-branch-by-inventory.mp4">Download demonstration video</a></video><figcaption>Grant the same graph without iron and with three ingots to compare routes.</figcaption></figure>
<p>Video uses Chinese UI and burned-in Chinese captions; the English text below describes every connection and parameter.</p>
<p><a href="/md/media/viscriptquests-03-branch-by-inventory.mp4">Download MP4</a> · <a href="/md/media/viscriptquests-03-branch-by-inventory.zh.vtt">Chinese subtitles</a> · <a href="/md/media/viscriptquests-03-branch-by-inventory.en.vtt">English subtitles</a></p>
<h2 id="nodes-and-parameters" data-toc-id="nodes-and-parameters">Nodes and parameters</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Node</th><th>Setting</th><th>Purpose</th></tr>
<tr><td>Get player item count</td><td>item_stack = minecraft:iron_ingot</td><td>Outputs a matching player item count without consuming iron.</td></tr>
<tr><td>Compare</td><td>operator = GE; value_b = 3</td><td>Tests count &gt;= 3.</td></tr>
<tr><td>Branch</td><td>condition &lt;- Compare.result</td><td>true selects delivery, false selects gathering.</td></tr>
<tr><td>Two subquests</td><td>Each has its own objective and shares a successful end.</td><td>Only the selected route activates.</td></tr>
</tbody></table>
<h2 id="wire-connections" data-toc-id="wire-connections">Wire connections</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">Start.next -&gt; Branch.in
Get Player Item Count.item_count -&gt; Compare.value_a
Compare.result -&gt; Branch.condition
Branch.true -&gt; Delivery.in
Branch.false -&gt; Gather.in
Delivery.success -&gt; End.in
Gather.success -&gt; End.in</code></pre>
<h2 id="when-the-condition-is-evaluated" data-toc-id="when-the-condition-is-evaluated">When the condition is evaluated</h2>
<p>The condition is evaluated when execution reaches the branch. Gaining iron later does not rewind an active gathering route. Its objective should advance the flow. The video explicitly revokes/regrants to compare two initial states; normal gameplay should not require regranting.</p>
<h2 id="common-wiring-mistakes" data-toc-id="common-wiring-mistakes">Common wiring mistakes</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Symptom</th><th>Cause and correction</th></tr>
<tr><td>Always takes one route</td><td>Check operator, A/B and the comparison-to-condition wire. An unconnected condition defaults to false.</td></tr>
<tr><td>Comparison exists but nothing executes</td><td>Data wires supply values; Start.next must also reach Branch.in.</td></tr>
<tr><td>New materials do not switch routes</td><td>Check the evaluation point; the current route was already selected.</td></tr>
</tbody></table>
