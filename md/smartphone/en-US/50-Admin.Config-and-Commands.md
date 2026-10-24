<h1 id="configuration-and-commands" data-toc-id="configuration-and-commands">Configuration and Commands</h1>
<p>This page is for server administrators and modpack authors. It describes SmartPhone's NeoForge common configuration, the app disable list, and management commands. All <code>/smart_phone</code> subcommands require the executor to have permission level 2.</p>

<h2 id="common-configuration" data-toc-id="common-configuration">Common configuration</h2>
<p>SmartPhone registers a NeoForge common configuration and the config file is named <code>smart_phone_config.toml</code>. The exact location of the file follows NeoForge's standard rules for client and server common configuration.</p>
<pre language="toml" isclosed="false"><code class="language-toml">[config]
phoneMarginLeft = 0.0
phoneMarginTop = 0.0
heldPhoneMode = true

[apps]
disabledApps = &quot;smart_phone:camera,smart_phone:phone_call&quot;</code></pre>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Field</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>config.phoneMarginLeft</td>
      <td>0</td>
      <td>Horizontal offset percentage of the phone UI, range -100 to 100; in held-phone mode the right hand moves with it</td>
    </tr>
    <tr>
      <td>config.phoneMarginTop</td>
      <td>0</td>
      <td>Vertical offset percentage of the phone UI, range -100 to 100; in held-phone mode the right hand moves with it</td>
    </tr>
    <tr>
      <td>config.heldPhoneMode</td>
      <td>true</td>
      <td>Raises the right hand and phone immediately when the phone is switched to the main hand; the vanilla item rendering hides, and the left and top margins fine-tune the final resting position</td>
    </tr>
    <tr>
      <td>apps.disabledApps</td>
      <td>Empty string</td>
      <td>Comma-separated app registry names; listed apps are neither shown nor auto-installed</td>
    </tr>
  </tbody>
</table>

<h2 id="per-player-phone-configuration" data-toc-id="per-player-phone-configuration">Per-player phone configuration</h2>
<p>Use <code>/smart_phone config &lt;player name, UUID, or character name&gt; &lt;parameter&gt; &lt;value&gt;</code> to modify a specific phone. The command requires permission level 2 and can also be run from the server console or a command block. The target can be an existing player on the server or a registered character; UUIDs work for existing offline players. Configuration is stored with the phone's bound owner, and saving immediately updates the phone of the current holder.</p>
<pre language="mcfunction" isclosed="false"><code class="language-mcfunction">/smart_phone config Dev wallpaper smart_phone:textures/ui/default_wallpaper.png
/smart_phone config Dev locked true
/smart_phone config Dev hide_date true
/smart_phone config Dev hide_status_icons true
/smart_phone config Dev hide_owner_name true
/smart_phone config Dev hide_lock_icon true</code></pre>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr><th>Parameter</th><th>Values</th><th>Effect</th></tr>
    <tr><td>wallpaper</td><td>namespace:texture path</td><td>Changes the phone wallpaper; the image must exist in client mods or resource packs</td></tr>
    <tr><td>locked</td><td>true / false</td><td>Enables or removes administrator interception, default false</td></tr>
    <tr><td>hide_date</td><td>true / false</td><td>Hides or shows the large standby time and the top time, default false</td></tr>
    <tr><td>hide_status_icons</td><td>true / false</td><td>Hides or shows the signal and battery icons together, default false</td></tr>
    <tr><td>hide_owner_name</td><td>true / false</td><td>Hides or shows the phone owner's name on the standby page, default false</td></tr>
    <tr><td>hide_lock_icon</td><td>true / false</td><td>Hides or shows the bottom lock icon without changing unlock permissions, default false</td></tr>
  </tbody>
</table>
<p>When intercepted, the standby page shows a closed lock, removes the "Swipe up to unlock" hint, and neither swiping up nor the passcode can unlock. An app or camera in use returns to the standby page. Running <code>/smart_phone config Dev locked false</code> removes the interception; afterwards the original passcode settings still apply. Setting the hide options back to <code>false</code> restores display.</p>
<p>These five toggles can also be modified and previewed on the Basics page of the Phone Data Editor. Regular in-phone settings changes do not overwrite administrator toggles. The editor can enter the chat and message content preview of an intercepted phone without removing the interception first; returning to the standby preview still follows the interception settings. Changes for offline players are persisted and take effect the next time they use the phone.</p>

<h2 id="disabling-apps" data-toc-id="disabling-apps">Disabling apps</h2>
<p><code>disabledApps</code> uses full app IDs, separated by commas. Spaces are ignored. The following example disables Camera and Phone Call:</p>
<pre language="toml" isclosed="false"><code class="language-toml">disabledApps = &quot;smart_phone:camera, smart_phone:phone_call&quot;</code></pre>
<p>The app IDs currently available for this configuration are:</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Category</th>
      <th>App ID</th>
    </tr>
    <tr>
      <td>System</td>
      <td>smart_phone:app_store</td>
    </tr>
    <tr>
      <td>System</td>
      <td>smart_phone:setting</td>
    </tr>
    <tr>
      <td>System</td>
      <td>smart_phone:camera</td>
    </tr>
    <tr>
      <td>System</td>
      <td>smart_phone:photo_album</td>
    </tr>
    <tr>
      <td>System</td>
      <td>smart_phone:chat_room</td>
    </tr>
    <tr>
      <td>System</td>
      <td>smart_phone:phone_call</td>
    </tr>
    <tr>
      <td>System</td>
      <td>smart_phone:official_messages</td>
    </tr>
    <tr>
      <td>System</td>
      <td>smart_phone:notepad</td>
    </tr>
    <tr>
      <td>Mini-game</td>
      <td>smart_phone:snake_game</td>
    </tr>
    <tr>
      <td>Mini-game</td>
      <td>smart_phone:game_2048</td>
    </tr>
    <tr>
      <td>Mini-game</td>
      <td>smart_phone:flappy_bird</td>
    </tr>
    <tr>
      <td>Mini-game</td>
      <td>smart_phone:minesweeper</td>
    </tr>
    <tr>
      <td>Mini-game</td>
      <td>smart_phone:piano_tiles</td>
    </tr>
  </tbody>
</table>

<h2 id="character-phones" data-toc-id="character-phones">Character phones</h2>
<p>Map authors can pre-register virtual characters without knowing the future player's ID. The following commands require permission level 2; use double quotes for names with Chinese characters or spaces.</p>
<pre language="mcfunction" isclosed="false"><code class="language-mcfunction">/smart_phone character register "Zhang San"
/smart_phone editor "Zhang San"
/smart_phone config "Zhang San" locked true
/smart_phone bind "Zhang San"
/give @s smart_phone:phone[smart_phone:phone_owner=&quot;Zhang San&quot;]</code></pre>
<p>Register the character first, then open the editor to preset its content. The bind command modifies the phone in your main hand; the give example creates a phone whose component owner is "Zhang San". Names support 1–64 characters and may not be UUIDs, control characters, or have leading/trailing spaces. Re-registering does not overwrite existing data, and unregistered names are not auto-created as real players. Name resolution matches registered characters first; when a real player and a character share a name, use the player's UUID to target the real player.</p>
<p>The standby page shows "Zhang San's phone". New owner messages, preset chat replies, and public chat senders use "Zhang San", not the holder's name. Copies of a character phone share its profile and passcode. Phones without an owner component still bind to their actual holder on first open; existing player phones and UUID saves stay compatible, with no manual migration needed.</p>

<h2 id="admin-commands" data-toc-id="admin-commands">Admin commands</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Command</th>
      <th>Effect</th>
    </tr>
    <tr>
      <td>/smart_phone open</td>
      <td>Opens the executor's own phone profile</td>
    </tr>
    <tr>
      <td>/smart_phone bind &lt;player name, UUID, or character name&gt;</td>
      <td>Binds the executor's main-hand phone to the target player or character</td>
    </tr>
    <tr>
      <td>/smart_phone editor [player name, UUID, or character name]</td>
      <td>Opens the Phone Data Editor; with no target it edits the owner bound to the main-hand phone, or the executor if unbound</td>
    </tr>
    <tr>
      <td>/smart_phone reload</td>
      <td>Deletes the executor's saved phone profile and rebuilds default content on next open</td>
    </tr>
    <tr>
      <td>/smart_phone message send</td>
      <td>Sends an official message to one or more players</td>
    </tr>
  </tbody>
</table>
<p>The bind command accepts the name or UUID of an existing player on this server, or a registered character name. When entering a player name, the server's player cache must be able to resolve it; it never guesses offline-mode UUIDs for arbitrary names. After binding, the item tooltip shows the phone owner's name, and the player holding the phone can modify the target phone's profile. With a six-digit passcode enabled, the passcode must be verified first, and the server checks phone ownership and unlock authorization on every save.</p>
<p>The Basics page of the Phone Data Editor can set the unlock passcode directly: the input accepts digits only, up to 6, and must be exactly 6 digits on save, with leading zeros allowed. An existing passcode is stored only as a digest, so the original digits are never filled back in; leaving it empty keeps the current passcode, and clicking "Clear passcode" and saving disables it. Setting or replacing it requires no old passcode and applies immediately on save; a new passcode re-locks the phone for its current holder. When the passcode format is invalid, the whole draft is not saved.</p>
<p>For the interactive preview on the left, the parameter pages on the right, date picking, and preset chats, see <a href="?file=&quot;Admin.Phone-Data-Editor&quot;">Phone Data Editor</a>.</p>
<p>The full syntax for sending an official message is:</p>
<pre language="mcfunction" isclosed="false"><code class="language-mcfunction">/smart_phone message send &lt;targets&gt; &lt;title&gt; &lt;body&gt;</code></pre>
<p><code>targets</code> uses a player target selector; <code>title</code> is a single string argument and should be quoted when it contains spaces; <code>body</code> reads the rest of the command text. After a successful send, the target players receive a notification and can read the message in the Messages app.</p>

<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">reload clears personal phone data</div>
  <div data-type="admonition-content">
    <p><code>/smart_phone reload</code> is not a hot-reload of configuration. It removes the executor's PhoneInfo record and the phone passcode, so it may clear wallpapers, time settings, installed apps, icon order, notepad, and in-phone official messages. Confirm that the target player has backed up anything they want to keep before running it.</p>
  </div>
</div>

<h2 id="server-saved-data" data-toc-id="server-saved-data">Server saved data</h2>
<p>When the server loads the Overworld, it initializes the SavedData for phone profiles, chat rooms, and friend relationships. When you back up the world save, this data is backed up along with the Overworld data; when migrating the server, migrate the corresponding world save in full.</p>
