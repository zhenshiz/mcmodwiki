<h1 id="smartphone-mod-documentation" data-toc-id="smartphone-mod-documentation">SmartPhone Mod Documentation</h1>
<p>SmartPhone gives every player in Minecraft a persistently saved phone. The phone provides a home screen, built-in apps, camera and album, chat room, friend direct messages, voice calls, messages, and mini-games.</p>
<p>This directory is split by feature. Read this page first to install and start using the phone, then go to Camera, Social, Calls, or Administration as needed.</p>

<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Version and dependencies</div>
  <div data-type="admonition-content">
    <p>The project currently targets Minecraft 1.21.1 with NeoForge 21.1.216; the mod metadata requires NeoForge 21 or higher.</p>
    <p>Simple Voice Chat API is declared as a required dependency, with a version range of 2.6.0 or higher. Only voice calls require an active voice chat connection; see <a href="?file=40-Features.Voice-Call.md">Voice Call</a> for details.</p>
  </div>
</div>

<h2 id="table-of-contents" data-toc-id="table-of-contents">Table of contents</h2>
<ul>
  <li><p><a href="?file=10-Usage.Phone-and-Apps.md">Phone and Apps</a>: opening, unlocking, home screen, app store, and in-phone settings.</p></li>
  <li><p><a href="?file=20-Features.Camera-and-Album.md">Camera and Album</a>: taking photos, managing photos, and importing PNG/JPEG from external files.</p></li>
  <li><p><a href="?file=30-Features.Social-and-Chat.md">Social and Chat</a>: public channels, friend requests, direct messages, and image messages.</p></li>
  <li><p><a href="?file=40-Features.Voice-Call.md">Voice Call</a>: starting, answering, and ending two-person calls through Simple Voice Chat.</p></li>
  <li><p><a href="?file=50-Admin.Config-and-Commands.md">Configuration and Commands</a>: server administrator configuration, disabling apps, and management commands.</p></li>
</ul>

<h2 id="obtaining-and-opening-the-phone" data-toc-id="obtaining-and-opening-the-phone">Obtaining and opening the phone</h2>
<p>The mod registers the item <code>smart_phone:phone</code> and places it in the "Smart Phone" category of the creative inventory. The source currently ships no crafting recipe data; survival servers should decide distribution through modpacks, data packs, or an administrator.</p>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Get the phone</div>
    <div data-type="admonition-content">
      <p>Take the phone from the "Smart Phone" category in creative mode, or have the server distribute <code>smart_phone:phone</code> according to its own rules.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Use it in hand</div>
    <div data-type="admonition-content">
      <p>Hold the phone and use the item. The server opens the phone UI for that player; the first opening creates default phone data and the default built-in apps.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Unlock and enter the home screen</div>
    <div data-type="admonition-content">
      <p>Swipe up on the lock screen as prompted to unlock, then tap a home screen icon to use an app.</p>
    </div>
  </div>
</div>

<h2 id="default-apps" data-toc-id="default-apps">Default apps</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>App</th>
      <th>Installed by default</th>
      <th>Purpose</th>
    </tr>
    <tr>
      <td>App Store</td>
      <td>Yes</td>
      <td>Install or uninstall downloadable apps</td>
    </tr>
    <tr>
      <td>Settings</td>
      <td>Yes</td>
      <td>Change the phone wallpaper</td>
    </tr>
    <tr>
      <td>Camera and Album</td>
      <td>Yes</td>
      <td>Capture, import, browse, and delete photos</td>
    </tr>
    <tr>
      <td>Chat Room</td>
      <td>Yes</td>
      <td>Public channel, friends, and direct messages</td>
    </tr>
    <tr>
      <td>Phone Call</td>
      <td>Yes</td>
      <td>Start and handle voice calls</td>
    </tr>
    <tr>
      <td>Messages and Notepad</td>
      <td>Yes</td>
      <td>Read official messages and save personal notes</td>
    </tr>
  </tbody>
</table>

<h2 id="downloadable-apps" data-toc-id="downloadable-apps">Downloadable apps</h2>
<p>The App Store lists installable apps that are not disabled by the server configuration. The currently registered mini-games are Snake, 2048, Flappy Bird, Minesweeper, and Piano Tiles.</p>
<p>System apps cannot be uninstalled through the App Store; downloadable apps can be installed or uninstalled in the App Store. Administrators can also hide specific apps through configuration; see <a href="?file=50-Admin.Config-and-Commands.md">Configuration and Commands</a>.</p>

<h2 id="data-persistence" data-toc-id="data-persistence">Data persistence</h2>
<p>Phone profiles are saved per player into the Overworld SavedData on the server, including installed apps, app layout, wallpaper, time source, notepad, official messages, and other phone information. Chat room messages and friend relationships are also saved in the server Overworld data.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Back up before resetting</div>
  <div data-type="admonition-content">
    <p>The administrator command <code>/smart_phone reload</code> deletes the executor's saved phone information and rebuilds default content on next use. It may clear personal wallpapers, app layouts, notepad, and official messages stored on the phone.</p>
  </div>
</div>
