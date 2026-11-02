<h1 id="guards-and-rival-factions" data-toc-id="guards-and-rival-factions">Guards and rival factions</h1>
<p><a href="?file=&quot;Learning Path&quot;">Learning path and videos</a> · <a href="?file=&quot;Troubleshooting and Data&quot;">Troubleshooting</a></p>
<p>Goal: guards and raiders are mutually hostile while the player is friendly to guards and hostile to raiders. Use a command-enabled test world, flat open space and a non-Peaceful difficulty. Husks avoid sunlight damage during verification.</p>
<h2 id="step-1-create-factions-and-set-both-directions" data-toc-id="step-1-create-factions-and-set-both-directions">Step 1: create factions and set both directions</h2>
<p>Create both factions in the editor and add the other ID to each, or use the first four commands below. If they already exist, inspect info and skip create.</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction create tutorial_guards
/viscript_team faction create tutorial_raiders
/viscript_team faction enemy add tutorial_guards tutorial_raiders
/viscript_team faction enemy add tutorial_raiders tutorial_guards
/summon minecraft:iron_golem ~2 ~ ~ {Tags:[&quot;vst_tutorial_guard&quot;],CustomName:&#x27;{&quot;text&quot;:&quot;Guard&quot;}&#x27;,CustomNameVisible:1b,PlayerCreated:0b}
/summon minecraft:husk ~10 ~ ~ {Tags:[&quot;vst_tutorial_raider&quot;],CustomName:&#x27;{&quot;text&quot;:&quot;Raider&quot;}&#x27;,CustomNameVisible:1b}
/viscript_team faction entity set @e[tag=vst_tutorial_guard,type=minecraft:iron_golem] tutorial_guards
/viscript_team faction entity set @e[tag=vst_tutorial_raider,type=minecraft:husk] tutorial_raiders
/viscript_team faction standing set @s tutorial_guards 100
/viscript_team faction standing set @s tutorial_raiders 0</code></pre>
<h2 id="step-2-verify-assignments" data-toc-id="step-2-verify-assignments">Step 2: verify assignments</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction entity get @e[tag=vst_tutorial_guard,limit=1]
/viscript_team faction entity get @e[tag=vst_tutorial_raider,limit=1]
/viscript_team faction standing get @s tutorial_guards
/viscript_team faction standing get @s tutorial_raiders</code></pre>
<p>Tags target the tutorial entities instead of accidentally selecting an existing nearest mob. VST stores membership by entity UUID; newly spawned mobs do not inherit it and must be assigned by the spawning logic.</p>
<h2 id="step-3-check-each-effect" data-toc-id="step-3-check-each-effect">Step 3: check each effect</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Check</th><th>Expected result</th><th>If it differs</th></tr><tr><td>Guard name tag</td><td>Green at effective reputation 100.</td><td>Check the party minimum; representative color does not change attitude color.</td></tr><tr><td>Raider name tag</td><td>Red at effective reputation 0.</td><td>Check faction assignment and name-tag visibility.</td></tr><tr><td>Faction targeting</td><td>Attempts enemy targeting within range and visibility.</td><td>Golems already attack some mobs; one fight alone does not prove the relation. Also inspect assignments, info and rules.</td></tr><tr><td>Friendly protection</td><td>With faction friendly fire off, relevant player/friendly-guard damage is blocked.</td><td>Neutral is not protection; other mods may add restrictions.</td></tr></tbody></table>
<h2 id="test-attitude-changes-in-isolation" data-toc-id="test-attitude-changes-in-isolation">Test attitude changes in isolation</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction standing set @s tutorial_guards 50
/viscript_team faction standing get @s tutorial_guards
/viscript_team faction standing set @s tutorial_guards 100</code></pre>
<p>With default thresholds, 50 is yellow/neutral and 100 is green/friendly. Test solo or account for all party members; offline members still contribute to the minimum.</p>
