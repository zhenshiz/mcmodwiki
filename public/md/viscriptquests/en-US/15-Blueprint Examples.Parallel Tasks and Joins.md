<h1 id="parallel-tasks-and-joins" data-toc-id="parallel-tasks-and-joins">Parallel tasks and joins</h1>
<p><a href="?file=&quot;Learning Path&quot;">Learning path and videos</a> · <a href="?file=&quot;Blueprints.Blueprint-Nodes&quot;">Node reference</a></p>
<p>Goal: collect wood and stone in parallel. Use ALL for both, ANY for one, or COUNT for a specified number such as two out of three.</p>
<figure data-type="local-video" data-width="960" style="width: 960px; max-width: 100%;"><video src="/md/media/viscriptquests-04-parallel-all-and-any.mp4" poster="/md/media/viscriptquests-04-parallel-all-and-any.png" controls playsinline preload="metadata"><a href="/md/media/viscriptquests-04-parallel-all-and-any.mp4">Download demonstration video</a></video><figcaption>Compare ALL and ANY: finishing wood first unlocks the next stage at different times.</figcaption></figure>
<p>Video uses Chinese UI and burned-in Chinese captions; the English text below describes every connection and parameter.</p>
<p><a href="/md/media/viscriptquests-04-parallel-all-and-any.mp4">Download MP4</a> · <a href="/md/media/viscriptquests-04-parallel-all-and-any.zh.vtt">Chinese subtitles</a> · <a href="/md/media/viscriptquests-04-parallel-all-and-any.en.vtt">English subtitles</a></p>
<h2 id="create-actual-parallel-routes" data-toc-id="create-actual-parallel-routes">Create actual parallel routes</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">Start.next -&gt; Wood.in
Start.next -&gt; Stone.in
Wood.success -&gt; Join.in
Stone.success -&gt; Join.in
Join.next -&gt; Certificate.in
Certificate.success -&gt; End.in</code></pre>
<p>Fork two flow wires from Start so both subquests can activate. Avoid an ALL join expecting both outputs of one exclusive true/false branch: only one can arrive on that execution.</p>
<h2 id="choose-the-join-rule" data-toc-id="choose-the-join-rule">Choose the join rule</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Mode</th><th>Setting</th><th>Concrete effect</th></tr>
<tr><td>ALL</td><td>join_mode = ALL</td><td>Wood completion still waits for stone; both arrivals unlock the certificate.</td></tr>
<tr><td>ANY</td><td>join_mode = ANY</td><td>The first completed route advances, skipping unchosen branches.</td></tr>
<tr><td>COUNT</td><td>join_mode = COUNT; required_count = 2</td><td>At least two distinct incoming routes must arrive; the count field appears only in COUNT mode.</td></tr>
</tbody></table>
<h2 id="runtime-checks" data-toc-id="runtime-checks">Runtime checks</h2>
<p>For ALL, finish wood and check the certificate remains locked; finish stone and check it activates. For ANY, finish wood and check the certificate activates while stone is skipped. Skipped does not mean the stone objective was completed or consumed materials.</p>
<h2 id="count-extension-exercise" data-toc-id="count-extension-exercise">COUNT extension exercise</h2>
<p>Add a food subquest, activate all three from Start and connect their success outputs to the same Join.in. Choose COUNT and set 2. Test one arrival, then any two. The video demonstrates ALL/ANY; use these text steps for COUNT.</p>
