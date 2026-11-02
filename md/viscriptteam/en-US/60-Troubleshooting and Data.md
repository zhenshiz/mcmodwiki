<h1 id="troubleshooting-and-data" data-toc-id="troubleshooting-and-data">Troubleshooting and data</h1>
<p><a href="?file=&quot;Learning Path&quot;">Back to learning path</a></p>
<h2 id="party-screen-opens-but-the-faction-editor-does-not" data-toc-id="party-screen-opens-but-the-faction-editor-does-not">Party screen opens but the faction editor does not</h2>
<p>The party screen needs level 0; the faction editor needs level 2. Verify server permission and use faction, not party.</p>
<h2 id="a-friend-is-absent-from-the-invite-list" data-toc-id="a-friend-is-absent-from-the-invite-list">A friend is absent from the invite list</h2>
<p>Check online state, current party, existing invitation and pending request. Review pending requests separately. Search by name/UUID fragment.</p>
<h2 id="the-leader-cannot-leave" data-toc-id="the-leader-cannot-leave">The leader cannot leave</h2>
<p>Transfer leadership by right-clicking another member, or disband a solo party. Admin party leave is a force operation with different behavior.</p>
<h2 id="my-reputation-is-100-but-the-guard-is-red" data-toc-id="my-reputation-is-100-but-the-guard-is-red">My reputation is 100 but the guard is red</h2>
<p>Check entity faction ID, then party membership and min standing. Offline low-standing members still count; faction standing get reports personal standing.</p>
<h2 id="changing-faction-color-does-not-change-name-tags" data-toc-id="changing-faction-color-does-not-change-name-tags">Changing faction color does not change name tags</h2>
<p>Name-tag colors follow the viewing player’s effective attitude. Representative color is for maps/integrations.</p>
<h2 id="why-can-neutral-entities-still-take-damage" data-toc-id="why-can-neutral-entities-still-take-damage">Why can neutral entities still take damage</h2>
<p>Neutrality suppresses reputation-based proactive targeting but is not protection. Check the friendly threshold and the correct friendly-fire setting.</p>
<h2 id="the-enemy-list-is-set-but-mobs-do-not-attack" data-toc-id="the-enemy-list-is-set-but-mobs-do-not-attack">The enemy list is set but mobs do not attack</h2>
<p>Check assignments, direction and targeting flag, then distance, visibility, difficulty and combat capability. Custom AI may bypass the standard system.</p>
<h2 id="old-factions-ignore-changed-defaults" data-toc-id="old-factions-ignore-changed-defaults">Old factions ignore changed defaults</h2>
<p>Defaults apply to new factions. Edit and save existing names, flags and enemies in the editor; avoid deletion just to rename.</p>
<h2 id="edited-values-revert-after-switching" data-toc-id="edited-values-revert-after-switching">Edited values revert after switching</h2>
<p>Click Save Faction Settings and wait for server confirmation; form edits are not submitted individually.</p>
<h2 id="newly-spawned-mobs-have-no-faction" data-toc-id="newly-spawned-mobs-have-no-faction">Newly spawned mobs have no faction</h2>
<p>Assignments are UUID-based and are not inherited from type, name or vanilla tags. Assign each new entity from spawning logic.</p>
<h2 id="chat-disappears-after-restart" data-toc-id="chat-disappears-after-restart">Chat disappears after restart</h2>
<p>Chat is session-only. Membership, requests and invitations persist; use a separate logger for durable chat archives.</p>
<h2 id="data-to-preserve-during-migration" data-toc-id="data-to-preserve-during-migration">Data to preserve during migration</h2>
<p>Stop the server and back up the world and config. Faction/party data is shared through the overworld; copying one dimension or player file is incomplete. Avoid deleting the data file as a general repair step.</p>
