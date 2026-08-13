<h1 id="configuration-and-commands" data-toc-id="configuration-and-commands">Configuration and Commands</h1>
<p>This page is for server administrators and modpack authors. It describes SmartPhone's NeoForge common configuration, the app disable list, and management commands. All <code>/smart_phone</code> subcommands require the executor to have permission level 2.</p>

<h2 id="common-configuration" data-toc-id="common-configuration">Common configuration</h2>
<p>SmartPhone registers a NeoForge common configuration and the config file is named <code>smart_phone_config.toml</code>. The exact location of the file follows NeoForge's standard rules for client and server common configuration.</p>
<pre language="toml" isclosed="false"><code class="language-toml">[config]
phoneMarginLeft = 0.0
phoneMarginTop = 0.0

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
      <td>Horizontal offset percentage of the phone UI; range -100 to 100</td>
    </tr>
    <tr>
      <td>config.phoneMarginTop</td>
      <td>0</td>
      <td>Vertical offset percentage of the phone UI; range -100 to 100</td>
    </tr>
    <tr>
      <td>apps.disabledApps</td>
      <td>Empty string</td>
      <td>Comma-separated app registry names; listed apps are neither shown nor auto-installed</td>
    </tr>
  </tbody>
</table>

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

<h2 id="admin-commands" data-toc-id="admin-commands">Admin commands</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Command</th>
      <th>Effect</th>
    </tr>
    <tr>
      <td>/smart_phone open</td>
      <td>Opens the phone for the player who runs the command</td>
    </tr>
    <tr>
      <td>/smart_phone setting</td>
      <td>Opens the executor's full phone profile configuration UI</td>
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
<p>The full syntax for sending an official message is:</p>
<pre language="mcfunction" isclosed="false"><code class="language-mcfunction">/smart_phone message send &lt;targets&gt; &lt;title&gt; &lt;body&gt;</code></pre>
<p><code>targets</code> uses a player target selector; <code>title</code> is a single string argument and should be quoted when it contains spaces; <code>body</code> reads the rest of the command text. After a successful send, the target players receive a notification and can read the message in the Messages app.</p>

<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">reload clears personal phone data</div>
  <div data-type="admonition-content">
    <p><code>/smart_phone reload</code> is not a hot-reload of configuration. It removes the executor's PhoneInfo record, so it may clear wallpapers, time settings, installed apps, icon order, notepad, and in-phone official messages. Confirm that the target player has backed up anything they want to keep before running it.</p>
  </div>
</div>

<h2 id="server-saved-data" data-toc-id="server-saved-data">Server saved data</h2>
<p>When the server loads the Overworld, it initializes the SavedData for phone profiles, chat room, and friend relationships. When you back up the world save, this data is backed up along with the Overworld data; when migrating the server, migrate the corresponding world save in full.</p>
