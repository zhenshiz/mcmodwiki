<h1 id="viscriptteam-user-guide" data-toc-id="viscriptteam-user-guide">ViScriptTeam User Guide
</h1>
<p>ViScriptTeam is designed for RPG maps and PVE
  Faction relationships and player teaming mods for maps, story servers, and quest integration packs. Regular players can create teams, apply to join, handle invitations, and use team chats through the visual interface; Map creators can manage physical factions, player reputation, hostile relationships, friendly damage, and faction scouting.
</p>
<h2 id="feature-overview" data-toc-id="feature-overview">Feature Overview</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>System</th>
      <th>Main users</th>
      <th>Purpose</th>
    </tr>
    <tr>
      <td>Player team</td>
      <td>All players</td>
      <td>Visualize team creation, application and invitation, member management, team chat, and team friend-wounds</td>
    </tr>
    <tr>
      <td>Faction</td>
      <td>Administrators and map creators</td>
      <td>Set faction affiliations and hostilities for monsters, NPCs, guards, and mechanic entities</td>
    </tr>
    <tr>
      <td>Player reputation</td>
      <td>Administrator, quest and scriptwriter</td>
      <td>Numbers determine whether a player is hostile, neutral, or friendly when facing a faction</td>
    </tr>
    <tr>
      <td>Battles and displays</td>
      <td>Server and client</td>
      <td>Perform friendly damage protection, faction scouting, and use green, yellow, and red to indicate entity attitudes</td>
    </tr>
  </tbody>
</table>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Factions and teams are two separate systems</div>
  <div data-type="admonition-content">
    <p>
      <strong>Faction</strong>Used to express the relationships among monsters, NPCs, factions, and players;<strong>Team</strong>Used to express which players are currently acting together. Players do not express their identity through "physical faction affiliation," but rather judge relationships based on their reputation with each faction.
    </p>
  </div>
</div>
<h2 id="player-team-interface" data-toc-id="player-team-interface">Player team interface</h2>
<h3 id="open-the-interface" data-toc-id="open-the-interface">Open the interface</h3>
<p>Any player can use any of the following commands to open the team interface, with the required permission level being  <code>0</code>：</p><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team party
/viscript_team party open</code></pre>
<p>The left side of the interface displays team identity, available operations, and a list of members; the right side shows team chat. When not joining a team, the member list only shows themselves, with the identity "Not yet joined the team."</p>
<h3 id="when-there-is-no-queue" data-toc-id="when-there-is-no-queue">When there is no queue</h3>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Build a team</div>
    <div data-type="admonition-content">
      <p>Click "Create Team" and enter a team name of 1 to 32 characters. The creator becomes the captain and automatically joins the new team.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Apply to join</div>
    <div data-type="admonition-content">
      <p>Click "Find Team" to browse the current team, then select "Apply to Join." The same team cannot apply again; If you have already received an invitation from that team, the list will display the invitation status.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Handle invitations</div>
    <div data-type="admonition-content">
      <p>Click "Invite View" to accept or decline invitations from other captains. After accepting, you will be directly added to the corresponding team.</p>
    </div>
  </div>
</div>
<h3 id="captain-operation" data-toc-id="captain-operation">Captain operation</h3>
<ul>
  <li>
    <p>
      <strong>Invite players:</strong>The candidate list only shows players who are online and have not yet joined any team, excluding those who have already been invited or have submitted a team application. The search box supports searching by player name or
      Filter some UUID content.</p>
  </li>
  <li>
    <p><strong>Apply to view:</strong>Accept or reject jointing applications submitted by other players. If the applicant has already joined another team before processing, the acceptance process will fail and the invalidation application will be cleared.
    </p>
  </li>
  <li>
    <p><strong>Managing Members:</strong>Right-click other members in the member list to choose "Kick Out of Team" or "Transfer Captain".</p>
  </li>
  <li>
    <p><strong>Team Composition:</strong>Set whether team members are allowed to harm each other. Friendly damage is disabled by default.</p>
  </li>
  <li>
    <p><strong>Disbanding Team:</strong>Remove the entire team and clear the chat history in the current server session of that team.</p>
  </li>
</ul>
<h3 id="ordinary-team-members-operate" data-toc-id="ordinary-team-members-operate">Ordinary team members operate</h3>
<p>Regular players can use "Voluntary Departure." The captain cannot leave the team directly through the player interface; the leader must be transferred to another member or disbanded.</p>
<h3 id="team-chat-and-save-range" data-toc-id="team-chat-and-save-range">Team chat and save range</h3>
<p>Team members can send messages in the chat bar on the right, with a maximum of 256 characters per message. After sending, the online members' team interface will refresh simultaneously.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Chat logs are not written to the world archive</div>
  <div data-type="admonition-content">
    <p>Each team only keeps the last 100 from the current server runtime
      A message; After the server restarts or the team disbands, chat logs will disappear. Team members, captains, friend damage setups, invitations, and party applications will be permanently saved with the world save.</p>
  </div>
</div>
<h2 id="factions-and-reputation" data-toc-id="factions-and-reputation">Factions and reputation</h2>
<h3 id="attitude-threshold" data-toc-id="attitude-threshold">Attitude threshold</h3>
<p>Each player has a reputation point for each faction. Factions use their own neutral and friendly thresholds to convert reputation into attitude. The default values are as follows:</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Reputation range</th>
      <th>Attitude</th>
      <th>Default behavior</th>
    </tr>
    <tr>
      <td>Below 50</td>
      <td>Hostile</td>
      <td>Faction entities can actively seek out enemies, and damage from both sides is not protected by friendly protection</td>
    </tr>
    <tr>
      <td>50 to 99</td>
      <td>Neutral</td>
      <td>Faction entities do not actively lock onto players based on reputation, but neutrality itself does not provide damage protection</td>
    </tr>
    <tr>
      <td>Reaching or exceeding 100</td>
      <td>Friendly</td>
      <td>By default, players and faction entities cannot damage each other, unless the faction allows friendly damage</td>
    </tr>
  </tbody>
</table>
<h3 id="faction-id-and-entity-affiliation" data-toc-id="faction-id-and-entity-affiliation">Faction ID and entity affiliation</h3>
<p>Faction ID removes the initial and final spaces and converts it to lowercase, for example <code>Guards</code> will be preserved as
  <code>guards</code>。 The physical faction is suitable for monsters, NPCs, guards, monster farming cage spawns, and map mechanism entities; Entity ownership is saved by UUID.</p>
<p>When setting a physical faction or player reputation, if the corresponding faction does not yet exist, the underlying data will create that faction. To make the map initialization process clearer, it is still recommended to explicitly execute the faction creation command first.</p>
<h3 id="one-way-hostility" data-toc-id="one-way-hostility">One-way hostility</h3>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Add two relationships when you need to be mutually hostile</div>
  <div data-type="admonition-content">
    <p>The list of hostile enemies is one-way.<code>guards → raiders</code> It will not be generated automatically
      <code>raiders → guards</code>； If both sides want to actively attack each other, they must add two directions separately.</p>
  </div>
</div><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction enemy add guards raiders
/viscript_team faction enemy add raiders guards</code></pre>
<h2 id="quickly-build-a-faction-scene" data-toc-id="quickly-build-a-faction-scene">Quickly build a faction scene</h2>
<div currentstep="3" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Create a faction</div>
    <div data-type="admonition-content"><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction create guards
/viscript_team faction create raiders</code></pre>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Set up bidirectional hostility</div>
    <div data-type="admonition-content"><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction enemy add guards raiders
/viscript_team faction enemy add raiders guards</code></pre>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Generate and assign entities</div>
    <div data-type="admonition-content">
      <pre language="plaintext" isclosed="false"><code class="language-plaintext">/summon minecraft:iron_golem ~ ~ ~ {CustomName:'{"text":"Guard"}',CustomNameVisible:1b}
/summon minecraft:zombie ~5 ~ ~ {CustomName:'{"text":"Raider"}',CustomNameVisible:1b}
/viscript_team faction entity set @e[type=minecraft:iron_golem,limit=1,sort=nearest] guards
/viscript_team faction entity set @e[type=minecraft:zombie,limit=1,sort=nearest] raiders</code></pre>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Set player reputation and verify it</div>
    <div data-type="admonition-content"><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction standing set @p guards 100
/viscript_team faction standing set @p raiders 0</code></pre>
      <p>Players face it <code>guards</code> The times are friendly and face-to-face <code>raiders</code>
        At that time, they were hostile enemies. Entities with visible custom names display green and red nameplates respectively; Entities using the standard target system attempt to lock onto targets as hostile entities.</p>
    </div>
  </div>
</div>
<h2 id="reference-for-management-instructions" data-toc-id="reference-for-management-instructions">Reference for management instructions</h2>
<p>Besides opening the team interface, the following faction and team backend commands all require permission levels by default <code>2</code>, suitable for enabling cheat-enabled single-player worlds, server OP, command blocks, and map functions.
</p>
<h3 id="faction-command" data-toc-id="faction-command">Faction Command</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Order</th>
      <th>Function</th>
    </tr>
    <tr>
      <td>/viscript_team faction create &lt;id&gt;</td>
      <td>Create a faction</td>
    </tr>
    <tr>
      <td>/viscript_team faction delete &lt;id&gt;</td>
      <td>Removes factions and their associated entity affiliations, player reputation, and other hostile references within factions</td>
    </tr>
    <tr>
      <td>/viscript_team faction list</td>
      <td>List all faction IDs</td>
    </tr>
    <tr>
      <td>/viscript_team faction info &lt;id&gt;</td>
      <td>View the list of default faction reputation and rival factions</td>
    </tr>
    <tr>
      <td>/viscript_team faction enemy add &lt;faction&gt; &lt;enemy&gt;</td>
      <td>Add a one-way hostile relationship</td>
    </tr>
    <tr>
      <td>/viscript_team faction enemy remove &lt;faction&gt; &lt;enemy&gt;</td>
      <td>Remove a one-way hostile relationship</td>
    </tr>
    <tr>
      <td>/viscript_team faction entity set &lt;targets&gt; &lt;faction&gt;</td>
      <td>Batch set the faction affiliations of entities</td>
    </tr>
    <tr>
      <td>/viscript_team faction entity clear &lt;targets&gt;</td>
      <td>Clear the affiliation of the physical faction</td>
    </tr>
    <tr>
      <td>/viscript_team faction entity get &lt;target&gt;</td>
      <td>View the faction of a single entity</td>
    </tr>
    <tr>
      <td>/viscript_team faction standing set &lt;targets&gt; &lt;faction&gt; &lt;points&gt;</td>
      <td>Set player reputation to a specified value</td>
    </tr>
    <tr>
      <td>/viscript_team faction standing add &lt;targets&gt; &lt;faction&gt; &lt;delta&gt;</td>
      <td>Increase or decrease player reputation</td>
    </tr>
    <tr>
      <td>/viscript_team faction standing get &lt;target&gt; &lt;faction&gt;</td>
      <td>View player reputation and current attitude</td>
    </tr>
  </tbody>
</table>
<h3 id="team-backend-command" data-toc-id="team-backend-command">Team backend command</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Order</th>
      <th>Authority</th>
      <th>Function</th>
    </tr>
    <tr>
      <td>/viscript_team party</td>
      <td>0</td>
      <td>Open the player team interface</td>
    </tr>
    <tr>
      <td>/viscript_team party open</td>
      <td>0</td>
      <td>Open the player team interface</td>
    </tr>
    <tr>
      <td>/viscript_team party create &lt;id&gt; &lt;leader&gt;</td>
      <td>2</td>
      <td>Create a team with a specified ID and set up a captain</td>
    </tr>
    <tr>
      <td>/viscript_team party delete &lt;id&gt;</td>
      <td>2</td>
      <td>Delete the specified team</td>
    </tr>
    <tr>
      <td>/viscript_team party list</td>
      <td>2</td>
      <td>List all troop IDs</td>
    </tr>
    <tr>
      <td>/viscript_team party info &lt;id&gt;</td>
      <td>2</td>
      <td>View the leader, members, and friendly damage setup</td>
    </tr>
    <tr>
      <td>/viscript_team party join &lt;targets&gt; &lt;party&gt;</td>
      <td>2</td>
      <td>Allowing players to join the party; If a player originally belonged to another team, they will leave the original team first</td>
    </tr>
    <tr>
      <td>/viscript_team party leave &lt;targets&gt;</td>
      <td>2</td>
      <td>Forcing players to leave the current team; After the captain leaves, a new captain is chosen from the remaining members</td>
    </tr>
    <tr>
      <td>/viscript_team party get &lt;target&gt;</td>
      <td>2</td>
      <td>View your team</td>
    </tr>
    <tr>
      <td>/viscript_team party leader set &lt;party&gt; &lt;leader&gt;</td>
      <td>2</td>
      <td>Establish a team leader; The target player will automatically join when not in the party</td>
    </tr>
    <tr>
      <td>/viscript_team party modify &lt;party&gt; friendly_fire &lt;true|false&gt;</td>
      <td>2</td>
      <td>Modified the team's friendly damage switch</td>
    </tr>
    <tr>
      <td>/viscript_team party standing get &lt;party&gt; &lt;faction&gt; [&lt;strategy&gt;]</td>
      <td>2</td>
      <td>Check the team's valid reputation against the faction according to the specified strategy; Use min when omitting the policy</td>
    </tr>
  </tbody>
</table>
<h2 id="effective-team-reputation" data-toc-id="effective-team-reputation">Effective team reputation</h2>
<p>Teams do not retain an independent faction reputation. When it is necessary to determine relationships, the mod dynamically calculates based on each member's reputation. The default policy is <code>min</code>: For example, member A is a pair
  <code>guards</code> If the reputation is 100 and member B is -50, then the team's default effective reputation is -50.</p>
<p>Target selection, damage interception, and nameplate colors in the original or modded entities use default settings <code>min</code> Strategy. This prevents hostile players from bypassing guards and monster AI by joining friendly teams
  or a copy for admission.</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Strategy</th>
      <th>Calculation method</th>
      <th>Recommended uses</th>
    </tr>
    <tr>
      <td>min</td>
      <td>Set the lowest reputation among members as the default strategy</td>
      <td>Hostile judgment, guard aggro, dungeon access</td>
    </tr>
    <tr>
      <td>average</td>
      <td>Take the average of the members and round down</td>
      <td>Settlement display and soft evaluation</td>
    </tr>
    <tr>
      <td>leader</td>
      <td>Only the captain's reputation is considered</td>
      <td>Story entry and mission synchronization entry</td>
    </tr>
    <tr>
      <td>max</td>
      <td>Earn the highest reputation among members</td>
      <td>Any member of the team can trigger this logic</td>
    </tr>
  </tbody>
</table>
<h2 id="combat-scouting-and-name-tags" data-toc-id="combat-scouting-and-name-tags">Combat, scouting, and name tags</h2>
<h3 id="injury-rules" data-toc-id="injury-rules">Injury rules</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Relationships</th>
      <th>Harmful behavior</th>
    </tr>
    <tr>
      <td>Players from the same team</td>
      <td>By default, no mutual harm is allowed; Allows the team to activate friendly damage after the captain activates</td>
    </tr>
    <tr>
      <td>Entities from the same faction</td>
      <td>By default, no mutual harm is allowed; This faction allows friendly damage after taking damage</td>
    </tr>
    <tr>
      <td>Players and friendly faction entities</td>
      <td>By default, no damage can be dealt from both directions; This faction allows friendly damage after taking damage</td>
    </tr>
    <tr>
      <td>Neutral relations</td>
      <td>Doesn't actively seek enemies based on reputation, but neutrality itself does not provide damage protection</td>
    </tr>
    <tr>
      <td>Hostile relations</td>
      <td>Allowing injury to be done</td>
    </tr>
  </tbody>
</table>
<p>The mod performs final checks during server-side damage events, so even if certain AI or attack methods bypass normal target selection, protected friendly damage is still canceled.</p>
<h3 id="enemy-search-rules" data-toc-id="enemy-search-rules">Enemy search rules</h3>
<ul>
  <li>
    <p>Ordinary entities without faction affiliation will not scan faction targets additionally.</p>
  </li>
  <li>
    <p>There are factions and affiliates <code>Mob</code> Attempts will be made to lock onto players who are hostile to your faction.</p>
  </li>
  <li>
    <p>When a faction enables "Actively Attack Hostile Factions," its entities will attempt to lock onto entities from the Hostile list.</p>
  </li>
  <li>
    <p>Entities in the same faction will not be actively locked; Invalid or protected existing targets are cleared away and navigation stops.</p>
  </li>
</ul>
<h3 id="brand-colors" data-toc-id="brand-colors">Brand colors</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Attitude</th>
      <th>Brand colors</th>
    </tr>
    <tr>
      <td>Friendly</td>
      <td>Green</td>
    </tr>
    <tr>
      <td>Neutral</td>
      <td>Yellow</td>
    </tr>
    <tr>
      <td>Hostile</td>
      <td>Red</td>
    </tr>
  </tbody>
</table>
<p>ViScriptTeam only modifies the color of the physical nameplate that has already been rendered and does not force the nameplate to be displayed. If you need it to always be visible, set the entity name and using the map or script
  <code>CustomNameVisible</code>or use the entity's own nameplate display mechanism.</p>
<h2 id="profile-file" data-toc-id="profile-file">Profile file</h2>
<p>The general configuration is located here <code>config/viscript_team_config.toml</code>, or you can open it from NeoForge's mod configuration interface.
</p><pre language="toml" isclosed="false"><code class="language-toml">[faction]
defaultFactionPoints = 50
neutralFactionPoints = 50
friendlyFactionPoints = 100
defaultFactionFriendlyFire = false
defaultAttackEnemyFactions = true</code></pre>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Configuration items</th>
      <th>Default values</th>
      <th>Function</th>
    </tr>
    <tr>
      <td>defaultFactionPoints</td>
      <td>50</td>
      <td>Default reputation for new factions</td>
    </tr>
    <tr>
      <td>neutralFactionPoints</td>
      <td>50</td>
      <td>Below this value, it is considered hostile; once it is reached, it is at least neutral</td>
    </tr>
    <tr>
      <td>friendlyFactionPoints</td>
      <td>100</td>
      <td>Reaching or exceeding this value is considered friendly</td>
    </tr>
    <tr>
      <td>defaultFactionFriendlyFire</td>
      <td>false</td>
      <td>Does creating a new faction by default allow entities and friendly players of the same faction to take friendly damage?</td>
    </tr>
    <tr>
      <td>defaultAttackEnemyFactions</td>
      <td>true</td>
      <td>Does the newly created faction automatically scan hostile faction targets by default?</td>
    </tr>
  </tbody>
</table>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Configurations only provide default values for new factions</div>
  <div data-type="admonition-content">
    <p>Existing factions will save their thresholds and switches. Modifying configuration files will not automatically override old faction data.</p>
  </div>
</div>
<h2 id="kubejs-scripting-interface" data-toc-id="kubejs-scripting-interface">KubeJS scripting interface</h2>
<p>After installing KubeJS, server scripts can be bound globally <code>ViScriptTeamUtil</code>
  The logic behind the command call. The interface does not automatically send command feedback to the chat bar, making it suitable for quests, storylines, and server events.</p><pre language="javascript" isclosed="false"><code class="language-javascript">// server_scripts/viscript_team_example.js
ServerEvents.loaded(event =&gt; {
  const level = event.server.overworld()

ViScriptTeamUtil.createFaction(level, 'guards')
ViScriptTeamUtil.createFaction(level, 'raiders')
ViScriptTeamUtil.addEnemyFaction(level, 'guards', 'raiders')
ViScriptTeamUtil.addEnemyFaction(level, 'raiders', 'guards')
})

PlayerEvents.loggedIn(event =&gt; {
const player = event.player
ViScriptTeamUtil.setPlayerStanding(player, 'guards', 100)
ViScriptTeamUtil.addPlayerStanding(player, 'raiders', -25)

const partyId = ViScriptTeamUtil.getPlayerPartyId(player)
const effectiveStanding = ViScriptTeamUtil.getPlayerEffectiveStanding(player, 'guards')
})</code></pre>
<p>Common server-side methods also include:
  <code>setEntityFaction</code>、<code>clearEntityFaction</code>、<code>createParty</code>、<code>joinParty</code>、<code>leaveParty</code>、<code>isSameParty</code>、<code>canHurt</code>、<code>canTarget</code>
  And <code>shouldActivelyTarget</code>。</p>
<h2 id="data-storage-and-cleaning" data-toc-id="data-storage-and-cleaning">Data storage and cleaning</h2>
<ul>
  <li>
    <p>Faction, entity affiliation, player reputation, team members, captain, friendly damage settings, invitations, and team application are stored in the world data and are centrally managed by the main world archive, so all dimensions share the same set of data.</p>
  </li>
  <li>
    <p>When deleting a faction, the entity affiliation, player reputation record, and other hostile relationships pointed to it within that faction will be cleared.</p>
  </li>
  <li>
    <p>When backend commands or scripts require players to join a new team, the player is first removed from the original team and their old invitations and requests are cleaned up.</p>
  </li>
  <li>
    <p>If the team has no members, it will be removed; When the backend operation causes the captain to leave, a new captain is selected from the remaining members.</p>
  </li>
  <li>
    <p>Team chat belongs to server session memory and will not be written to the world save file.</p>
  </li>
</ul>
<h2 id="frequently-asked-questions" data-toc-id="frequently-asked-questions">Frequently Asked Questions</h2>
<h3 id="why-does-everyone-get-attacked-after-having-a-low-reputation-player-in-the-team" data-toc-id="why-does-everyone-get-attacked-after-having-a-low-reputation-player-in-the-team">
  Why does everyone get attacked after having a low-reputation player in the team?</h3>
<p>The default effective reputation strategy is:
  <code>min</code>, the lowest reputation among team members will be used. This is a security rule to prevent hostile players from using the team to bypass faction inspections. Only administrator commands and script queries can explicitly select other policies; Built-in detection, damage, and nameplate judgment are still in use
  <code>min</code>。</p>
<h3 id="why-didnt-the-physical-display-the-colorful-name-tag" data-toc-id="why-didnt-the-physical-display-the-colorful-name-tag">Why didn't the physical display the colorful name tag?</h3>
<p>The mod only sets colors for the displayed name tag and does not guarantee the name tag will appear. Please ensure the entity has a display name and set it according to the map requirements
  <code>CustomNameVisible</code>。</p>
<h3 id="why-didnt-the-old-faction-change-after-modifying-the-configuration" data-toc-id="why-didnt-the-old-faction-change-after-modifying-the-configuration">Why didn't the old faction change after modifying the configuration?</h3>
<p>All five items in the configuration file are default values used when creating a faction. Data from the old faction has already been written to the archive and will not be overwritten by default configurations.</p>
<h3 id="why-cant-the-captain-voluntarily-leave-the-team" data-toc-id="why-cant-the-captain-voluntarily-leave-the-team">Why can't the captain voluntarily leave the team?</h3>
<p>The player interface requires the captain to transfer the leader first, or directly disband the team to avoid losing a manager without a clear handover. Administrators can still use backend commands to enforce member relationships.</p>
