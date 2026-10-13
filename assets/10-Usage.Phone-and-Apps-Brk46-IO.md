<h1 id="phone-and-apps" data-toc-id="phone-and-apps">Phone and Apps</h1>
<p>This page covers the basic operation of the phone home screen, built-in apps, the App Store, and in-phone settings. For server configuration and administrator commands, see <a href="?file=&quot;50-Admin.Config-and-Commands.md&quot;">Configuration and Commands</a>.</p>

<h2 id="opening-and-returning" data-toc-id="opening-and-returning">Opening and returning</h2>
<p>With the default configuration, switching <code>smart_phone:phone</code> to your main hand starts the raise animation: the vanilla first-person item rendering hides, and the player's right hand reaches out from the lower right to grip the phone. The phone first shows the standby lock screen; after the animation ends and the phone profile has synced, swipe up with the mouse to unlock, then tap a home screen app. Press Esc to put the phone away; switching to another item and picking the phone up again shows the lock screen once more. The bottom return bar inside an app closes the current app and returns to the home screen.</p>
<p>If <code>heldPhoneMode</code> is set to <code>false</code>, you must use the phone item to open the centered lock screen interface, then swipe up as prompted to unlock. For the configuration entries and offset tuning, see <a href="?file=&quot;50-Admin.Config-and-Commands.md&quot;">Configuration and Commands</a>.</p>
<p>On the server side, players with permission level 2 can also run <code>/smart_phone open</code> to open their own phone.</p>
<p>The phone owner can be a real player or an administrator-registered virtual character. The item's <code>smart_phone:phone_owner</code> component accepts a player UUID or a character name. An unbound phone binds to its holder on first open; a bound phone reads the owner's wallpaper, apps, notes, official messages, preset chats, and passcode, and changes are saved under that owner. The item tooltip and standby page show the phone owner's name.</p>
<p>When a character phone sends chat messages, the author uses the character name, and preset replies are saved to the character profile. Online friend relationships, direct message routing, and voice connections still depend on the actual online players; the local album reads the current client's photo directory. Map authors can register, edit, and create character phones by following the steps in <a href="?file=&quot;50-Admin.Config-and-Commands.md&quot;#character-phones">Character phones</a>.</p>

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
      <td>Browse, doodle-edit, import, and delete local photos</td>
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
      <p>Click Download on an app that is not yet installed. The install state is saved to the current phone owner's profile and the icon then appears on the home screen.</p>
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
<p>For how to play after installing, see <a href="?file=&quot;15-Usage.Mini-Games.md&quot;">Mini-Games</a>.</p>

<h2 id="in-phone-settings" data-toc-id="in-phone-settings">In-phone settings</h2>
<p>The Settings app on the home screen provides a wallpaper resource location input. Only resource locations that the current client resource manager can resolve are accepted; to restore the default wallpaper, use <code>smart_phone:textures/ui/default_wallpaper.png</code>.</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Time source</div>
  <div data-type="admonition-content">
    <p>The phone profile supports three time sources: real time, Minecraft world time, and custom time segments. Administrators can adjust the time source on the Basics page of <code>/smart_phone editor</code>, and it takes effect after saving; the command requires permission level 2. For editing steps, see <a href="?file=&quot;45-Admin.Phone-Data-Editor.md&quot;">Phone Data Editor</a>.</p>
  </div>
</div>

<h2 id="official-messages" data-toc-id="official-messages">Official messages</h2>
<p>Server administrators can send official messages to players. When a new message arrives, a notification appears in the top-right corner of the client; inside the Messages app, messages can be marked as read or deleted.</p>
<p>For the send command and permission details, see <a href="?file=&quot;50-Admin.Config-and-Commands.md&quot;#admin-commands">Admin commands</a>.</p>

<h2 id="six-digit-passcode-lock-screen" data-toc-id="six-digit-passcode-lock-screen">Six-digit passcode lock screen</h2>
<p>Open the phone's Settings and click "Enable six-digit passcode", then enter the same six digits twice in a row to enable it. Phones without a passcode keep the original swipe-up unlock.</p>
<p>Once enabled, putting the phone away and picking it up again still shows the standby page first; swiping up opens the passcode page. The round keys show only digits, six dots indicate how many digits have been entered, and verification runs automatically after the sixth digit. Only "Cancel" is offered below; clicking it returns to the standby page without unlocking. The main keyboard and numpad digit keys and Backspace are also supported.</p>
<p>The passcode is bound to the phone owner, and copies of the same owner's phone (player or character) share the passcode. Other players who pick up the phone must also enter the passcode, after which they can use its profile normally. "Change passcode" and "Disable passcode" in Settings require the old passcode first. After five consecutive wrong attempts, you must wait 30 seconds before trying again.</p>
<p>The server separately stores a salted passcode digest. While the phone is locked, the full profile such as chat history and notes is not sent to the client, and profile writes must go through server authorization. When an administrator edits another phone's profile, the passcode is preserved; the editor's Basics page can also set a new six-digit passcode or clear the existing one. When an administrator resets their own phone profile, the passcode is cleared with it.</p>
