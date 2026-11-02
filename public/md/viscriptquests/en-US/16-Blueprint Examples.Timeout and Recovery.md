<h1 id="timeout-and-recovery" data-toc-id="timeout-and-recovery">Timeout and recovery</h1>
<p><a href="?file=&quot;Learning Path&quot;">Learning path and videos</a> · <a href="?file=&quot;Blueprints.Blueprint-Nodes&quot;">Node reference</a></p>
<p>Goal: deliver four oak logs within eight seconds; timeout opens a recovery task requiring one cobblestone. A failure output can lead to a recovery subquest rather than ending the whole quest.</p>
<figure data-type="local-video" data-width="960" style="width: 960px; max-width: 100%;"><video src="/md/media/viscriptquests-05-timeout-and-recovery.mp4" poster="/md/media/viscriptquests-05-timeout-and-recovery.png" controls playsinline preload="metadata"><a href="/md/media/viscriptquests-05-timeout-and-recovery.mp4">Download demonstration video</a></video><figcaption>Set countdown as a failure condition and watch recovery activate after timeout.</figcaption></figure>
<p>Video uses Chinese UI and burned-in Chinese captions; the English text below describes every connection and parameter.</p>
<p><a href="/md/media/viscriptquests-05-timeout-and-recovery.mp4">Download MP4</a> · <a href="/md/media/viscriptquests-05-timeout-and-recovery.zh.vtt">Chinese subtitles</a> · <a href="/md/media/viscriptquests-05-timeout-and-recovery.en.vtt">English subtitles</a></p>
<h2 id="timed-subquest-contents" data-toc-id="timed-subquest-contents">Timed subquest contents</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">Subquest Start.objectives -&gt; Item Objective.in
Subquest Start.objectives -&gt; Countdown.in

Item Objective: oak_log, item_count=4, MANUAL, objective_type=REQUIRED
Countdown: duration_seconds=8, objective_type=FAILURE</code></pre>
<p>Activate both objectives from the subquest start to begin timing immediately. Connecting Item Objective.next -> Countdown.in starts timing only after the item objective completes, which does not implement this deadline.</p>
<h2 id="root-result-handling" data-toc-id="root-result-handling">Root result handling</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">Start.next -&gt; Timed Delivery.in
Timed Delivery.success -&gt; Successful End.in
Timed Delivery.failure -&gt; Recovery.in
Recovery.success -&gt; Successful End.in</code></pre>
<h2 id="parameters-and-effects" data-toc-id="parameters-and-effects">Parameters and effects</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Parameter</th><th>Value</th><th>Effect</th></tr>
<tr><td>duration_seconds</td><td>8</td><td>Seconds, measured from objective activation rather than opening the book.</td></tr>
<tr><td>objective_type</td><td>FAILURE</td><td>Reaching zero fails the subquest instead of satisfying a required wait.</td></tr>
<tr><td>success / failure</td><td>Connect to success end and recovery respectively.</td><td>Successful delivery and timeout follow different routes.</td></tr>
</tbody></table>
<h2 id="test-both-outcomes" data-toc-id="test-both-outcomes">Test both outcomes</h2>
<p>The video deliberately leaves oak unsubmitted and verifies FAILED delivery plus ACTIVE recovery. Also regrant and submit within eight seconds to verify direct success. Eight seconds is a short teaching value; adjust real content for travel, interaction and server conditions.</p>
<p>For a wait-until-complete objective, set countdown to REQUIRED and design the next flow accordingly; that differs from a failure deadline.</p>
