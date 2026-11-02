<h1 id="kubejs-examples" data-toc-id="kubejs-examples">KubeJS examples</h1>
<p><a href="?file=&quot;Learning Path&quot;">Learning path and videos</a> · <a href="?file=&quot;Troubleshooting and Data&quot;">Troubleshooting</a></p>
<p>With KubeJS installed, use the VST server utility class for factions, parties and standings. These examples explicitly load ViScriptTeamServerUtil; the client class exposes only client helpers such as name-tag attitude caches.</p>
<div type="info" data-type="admonition" data-admo-type="info"><div data-type="admonition-title">Choose the server utility class</div><div data-type="admonition-content"><p>If the ViScriptTeamUtil binding resolves to ViScriptTeamClientUtil, methods such as createFaction fail. The examples use Java.loadClass to select the server class explicitly and avoid this ambiguity. Run mutations only in server scripts.</p>
</div></div>
<h2 id="initialize-map-factions-once" data-toc-id="initialize-map-factions-once">Initialize map factions once</h2>
<pre language="javascript" isclosed="false"><code class="language-javascript">// kubejs/server_scripts/vst_factions.js
ServerEvents.loaded(event =&gt; {
  const server = event.server
  const state = server.persistentData
  if (state.getBoolean(&#x27;vst_tutorial_factions_v1&#x27;)) return

  const level = server.overworld()
  const vst = Java.loadClass(&#x27;com.viscript_team.util.ViScriptTeamServerUtil&#x27;)
  vst.createFaction(level, &#x27;tutorial_guards&#x27;)
  vst.createFaction(level, &#x27;tutorial_raiders&#x27;)
  vst.addEnemyFaction(level, &#x27;tutorial_guards&#x27;, &#x27;tutorial_raiders&#x27;)
  vst.addEnemyFaction(level, &#x27;tutorial_raiders&#x27;, &#x27;tutorial_guards&#x27;)

  state.putBoolean(&#x27;vst_tutorial_factions_v1&#x27;, true)
})</code></pre>
<p>The first load creates both directions and stores a world flag. Later loads skip it; use explicit migration logic for existing data. Avoid unconditional setPlayerStanding on every login because it overwrites earned reputation.</p>
<h2 id="read-personal-and-effective-standing" data-toc-id="read-personal-and-effective-standing">Read personal and effective standing</h2>
<pre language="javascript" isclosed="false"><code class="language-javascript">// Call from your own server-side quest or dialogue callback.
function inspectGuardStanding(player) {
  const vst = Java.loadClass(&#x27;com.viscript_team.util.ViScriptTeamServerUtil&#x27;)
  const personal = vst.getPlayerStanding(player, &#x27;tutorial_guards&#x27;)
  const effective = vst.getPlayerEffectiveStanding(player, &#x27;tutorial_guards&#x27;)
  const partyId = vst.getPlayerPartyId(player)
  player.tell(&#x27;Personal: &#x27; + personal + &#x27; | Effective: &#x27; + effective)
  if (partyId == null) return

  const leaderValue = vst.getPartyEffectiveStanding(
    player.serverLevel(), partyId, &#x27;tutorial_guards&#x27;, &#x27;leader&#x27;
  )
  player.tell(&#x27;Party: &#x27; + partyId + &#x27; | Leader strategy: &#x27; + leaderValue)
}</code></pre>
<p>This defines a function; it does not run automatically. Call it with a ServerPlayer from your own server-side quest/dialogue callback. getPlayerPartyId returns null for a solo player; use the fixed ID rather than a display name.</p>
<h2 id="change-reputation-at-quest-settlement" data-toc-id="change-reputation-at-quest-settlement">Change reputation at quest settlement</h2>
<pre language="javascript" isclosed="false"><code class="language-javascript">// Run once from a verified server-side settlement callback.
const vst = Java.loadClass(&#x27;com.viscript_team.util.ViScriptTeamServerUtil&#x27;)
vst.addPlayerStanding(player, &#x27;tutorial_guards&#x27;, 25)
// A fixed setting replaces the value rather than adding to it:
// vst.setPlayerStanding(player, &#x27;tutorial_guards&#x27;, 100)</code></pre>
<p>The settlement callback supplies player; it is not a global. Do not paste this at file top level. Use quest state or a persistent marker to prevent duplicate rewards. Raising one member’s reputation may leave the party minimum unchanged.</p>
<h2 id="useful-helpers-and-limits" data-toc-id="useful-helpers-and-limits">Useful helpers and limits</h2>
<table data-type="custom-table" data-with-header-row="true"><tbody><tr><th>Helper</th><th>Input/result</th><th>Use</th></tr><tr><td>createFaction(level, id)</td><td>ServerLevel; false if already present.</td><td>Initialize factions.</td></tr><tr><td>setEntityFaction(entity, id)</td><td>Server entity; assigns its UUID.</td><td>Assign after mob/NPC creation.</td></tr><tr><td>getPlayerEffectiveStanding(player, id)</td><td>Default min; also has a strategy-string overload.</td><td>Gate consistently with built-in rules.</td></tr><tr><td>getPartyEffectiveStanding(level, partyId, id, strategy)</td><td>min/average/leader/max; null for missing parties.</td><td>Choose an explicit story evaluation.</td></tr><tr><td>joinParty(player, partyId)</td><td>Leaves old party; returns whether state changed.</td><td>Use only for intentional forced reassignment.</td></tr><tr><td>canHurt(attacker, target) / canTarget(attacker, target)</td><td>LivingEntity; returns VST relation permission.</td><td>Query custom combat permission; does not guarantee an attack or damage.</td></tr></tbody></table>
<h2 id="working-with-quest-systems" data-toc-id="working-with-quest-systems">Working with quest systems</h2>
<p>VST supplies membership and relationship data. Quest sync and reward distribution depend on the quest mod’s integration. Consult VSQ documentation for its team progress and leader rewards. VST parties are distinct from vanilla scoreboard teams.</p>
<p><a href="/downloads/viscriptteam-tutorial-examples.zip">Download server scripts and guard command examples</a></p>
