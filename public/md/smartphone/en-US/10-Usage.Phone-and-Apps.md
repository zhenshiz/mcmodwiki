<h1 id="phone-and-apps" data-toc-id="phone-and-apps">Phone and Apps</h1>
<p>This page covers the basic operation of the phone home screen, built-in apps, the App Store, and in-phone settings. For server configuration and administrator commands, see <a href="?file=50-Admin.Config-and-Commands.md">Configuration and Commands</a>.</p>

<h2 id="opening-and-returning" data-toc-id="opening-and-returning">Opening and returning</h2>
<p>Hold <code>smart_phone:phone</code> and use it to open the phone. After unlocking, the home screen appears; inside an app, tap the bottom return bar to close the current app and return to the home screen.</p>
<p>On the server side, players with permission level 2 can also run <code>/smart_phone open</code> to open their own phone.</p>

<h2 id="home-screen-operations" data-toc-id="home-screen-operations">Home screen operations</h2>
<ul>
  <li><p><strong>Open an app:</strong> Left-click the icon.</p></li>
  <li><p><strong>Reorder apps:</strong> Hold the icon for about 400 milliseconds, then drag it onto another icon. The two apps swap positions and the change is saved.</p></li>
  <li><p><strong>Uninstall an app:</strong> Right-click the icon and choose delete. System apps cannot be uninstalled; downloadable apps can.</p></li>
  <li><p><strong>Disabled apps:</strong> Apps listed by the administrator in the common configuration are neither shown on the home screen nor auto-installed.</p></li>
</ul>

<h2 id="built-in-apps" data-toc-id="built-in-apps">Built-in apps</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>App</th>
      <th>App ID</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>App Store</td>
      <td>smart_phone:app_store</td>
      <td>Manage downloadable apps</td>
    </tr>
    <tr>
      <td>Settings</td>
      <td>smart_phone:setting</td>
      <td>Set the phone wallpaper resource location</td>
    </tr>
    <tr>
      <td>Camera</td>
      <td>smart_phone:camera</td>
      <td>Enter first-person viewfinder and photo mode</td>
    </tr>
    <tr>
      <td>Photo Album</td>
      <td>smart_phone:photo_album</td>
      <td>Browse, import, and delete local photos</td>
    </tr>
    <tr>
      <td>Chat Room</td>
      <td>smart_phone:chat_room</td>
      <td>Public channel, friends, and direct messages</td>
    </tr>
    <tr>
      <td>Phone Call</td>
      <td>smart_phone:phone_call</td>
      <td>Simple Voice Chat two-person calls</td>
    </tr>
    <tr>
      <td>Messages</td>
      <td>smart_phone:official_messages</td>
      <td>Receive, read, and delete official server messages</td>
    </tr>
    <tr>
      <td>Notepad</td>
      <td>smart_phone:notepad</td>
      <td>Save personal notes</td>
    </tr>
  </tbody>
</table>

<h2 id="app-store" data-toc-id="app-store">App Store</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Search apps</div>
    <div data-type="admonition-content">
      <p>Open the App Store and type an app's display name in the search bar to filter the list.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Install</div>
    <div data-type="admonition-content">
      <p>Click Download on an app that is not yet installed. The install state is saved to that player's phone profile and the icon then appears on the home screen.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Uninstall</div>
    <div data-type="admonition-content">
      <p>Click Uninstall on an uninstallable app. App Store, Settings, Camera, Photo Album, Chat Room, Phone Call, Messages, and Notepad are non-uninstallable system apps.</p>
    </div>
  </div>
</div>
<p>The mini-games currently installable from the App Store are Snake, 2048, Flappy Bird, Minesweeper, and Piano Tiles. Whether an app is visible also depends on the server's <code>disabledApps</code> configuration.</p>

<h2 id="in-phone-settings" data-toc-id="in-phone-settings">In-phone settings</h2>
<p>The Settings app on the home screen provides a wallpaper resource location input. Only resource locations that the current client resource manager can resolve are accepted; to restore the default wallpaper, use <code>smart_phone:textures/ui/default_wallpaper.png</code>.</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Time source</div>
  <div data-type="admonition-content">
    <p>The phone profile supports three time sources: real time, Minecraft world time, and custom time segments. Administrators can open the full phone configuration UI with <code>/smart_phone setting</code> to adjust it; the command requires permission level 2.</p>
  </div>
</div>

<h2 id="official-messages" data-toc-id="official-messages">Official messages</h2>
<p>Server administrators can send official messages to players. When a new message arrives, a notification appears in the top-right corner of the client; inside the Messages app, messages can be marked as read or deleted.</p>
<p>For the send command and permission details, see <a href="?file=50-Admin.Config-and-Commands.md">Admin Commands</a>.</p>
