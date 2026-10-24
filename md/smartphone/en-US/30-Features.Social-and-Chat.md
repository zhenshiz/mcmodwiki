<h1 id="social-and-chat" data-toc-id="social-and-chat">Social and Chat</h1>
<p>The Chat Room app provides a default public channel, friend requests, and friend direct messages. Public chat, direct messages, and friend relationships are saved by the server and synchronized to online players.</p>

<h2 id="channels-and-text-messages" data-toc-id="channels-and-text-messages">Channels and text messages</h2>
<p>The first time you open the Chat Room, the Public Channel is shown. Inside the channel page, tap a room to open its message history; type content and click Send to post a message.</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Text length and line breaks</div>
  <div data-type="admonition-content">
    <p>The server replaces line breaks with spaces and truncates a single chat message to at most 160 characters. Blank messages are not sent.</p>
  </div>
</div>

<h2 id="preset-conversations" data-toc-id="preset-conversations">Preset conversations</h2>
<p>Administrators can edit a specific phone's preset conversations with <code>/smart_phone editor player name, UUID, or character name</code>. On the Chat page, click "Conversation +" in the bottom-right corner to create a preset channel, or "+ Friend" to create a preset friend. The friend's player ID may be fictional and does not require the player to exist on the server; the left phone's Channels and Friends pages show them respectively. After clicking a conversation, the right side shows its name and friend ID; clicking a message shows only that message's edit fields. "Message + / −" adds or deletes the current message, and "Conversation −" deletes the current conversation.</p>
<p>Messages support text, images, or a mix of both. With a message selected, click "Choose image from album" and pick an existing photo on the left phone; you can also replace or remove the image. External PNG/JPEG images imported into the album can be selected too, and their thumbnail data is written into the phone profile on save, so they do not depend on the original photo file.</p>
<p>A message shows its sender's avatar beside it: received messages appear on the left and messages sent by the phone on the right. Online players show their current skin; offline or fictional player IDs use a stable default avatar and never incorrectly borrow the current viewer's avatar.</p>
<p>With a preset message selected, you can enter a valid Java player username in "Avatar player ID", for example <code>Notch</code>, to use that account's skin avatar; the player does not need to be online. The field accepts up to 16 letters, digits, or underscores, and leaving it empty restores the sender's original avatar. The avatar source is independent of the sender's name: the name can stay "Zhang San" while the phone's ownership and message left/right placement are unchanged. The setting applies only to the selected message and syncs with the preset chat profile on save. The first load requires the client to be online to query the skin service; while loading or on failure, the original avatar is kept and the interface is never blocked.</p>
<p>The preset friend list uses the avatar setting from the friend's most recent message; replies sent later by the phone owner do not overwrite the friend's avatar. After changing an avatar, returning to the list shows the update, and entering a conversation still shows each message's own avatar.</p>
<p>After clicking "Save and apply", players can keep sending text or images in this phone's preset conversations. Sent content is appended and saved to the profile of the phone's bound owner, existing records are preserved, and no automatic reply is triggered. The sender name follows the phone component's owner; character phones show the character name. Public channels and friend direct messages do not add preset automatic replies. A conversation summary shows its most recent non-empty message; a newly created empty record does not make an existing channel show "No messages".</p>
<p>For the full editor operations and saving, see <a href="?file=&quot;Admin.Phone-Data-Editor#creating-preset-chats&quot;">Creating preset chats</a>.</p>

<h2 id="friends-management" data-toc-id="friends-management">Friends management</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Open the friends page</div>
    <div data-type="admonition-content">
      <p>Switch to the Friends tab at the top of the Chat Room. The list shows online players and existing friends, and marks them as online, pending, friend, or offline.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Send or accept a request</div>
    <div data-type="admonition-content">
      <p>Click Add on an addable online player. After the recipient clicks Accept, both sides become friends and receive a status update.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Open a direct message</div>
    <div data-type="admonition-content">
      <p>When both sides are friends and the other player is online, click Chat to open the direct message between the two of you. Only the two participants of that direct message receive its new messages.</p>
    </div>
  </div>
</div>
<p>Sending a friend request and opening a direct message both require the target player to be online. When a direct message is sent, the server also verifies that the sender actually belongs to that conversation and that both sides are still friends.</p>

<h2 id="sending-image-messages" data-toc-id="sending-image-messages">Sending image messages</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Prepare a photo</div>
    <div data-type="admonition-content">
      <p>Take a photo with the Camera first, or import a PNG/JPEG image into the Album. For how to import, see <a href="?file=&quot;Features.Camera-and-Album#importing-external-images&quot;">Importing external images</a>.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Select an image</div>
    <div data-type="admonition-content">
      <p>Enter the target channel or friend direct message, click Image, then choose a photo from the Album.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Wait for sync</div>
    <div data-type="admonition-content">
      <p>The client generates a 160×90 PNG thumbnail and sends it to the server. The public channel is synchronized to online players; direct messages are synchronized only to the two participants.</p>
    </div>
  </div>
</div>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">Image size limit</div>
  <div data-type="admonition-content">
    <p>The server only accepts non-empty image message data up to 100 KiB. When the limit is exceeded or thumbnail generation fails, the image is not sent.</p>
  </div>
</div>

<h2 id="data-scope" data-toc-id="data-scope">Data scope</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Content</th>
      <th>Storage location</th>
      <th>Visibility</th>
    </tr>
    <tr>
      <td>Public channel and messages</td>
      <td>Server Overworld data</td>
      <td>Online players receive new public channel messages</td>
    </tr>
    <tr>
      <td>Friend relationships</td>
      <td>Server Overworld data</td>
      <td>Both sides of the relationship and friend list sync</td>
    </tr>
    <tr>
      <td>Friend direct messages</td>
      <td>Server Overworld data</td>
      <td>The two participants of the direct message</td>
    </tr>
    <tr>
      <td>Album original images</td>
      <td>Client game directory</td>
      <td>Local album only; chat sends thumbnail data</td>
    </tr>
  </tbody>
</table>
