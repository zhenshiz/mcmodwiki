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
      <p>Take a photo with the Camera first, or import a PNG/JPEG image into the Album. For how to import, see <a href="?file=20-Features.Camera-and-Album.md">Importing external images</a>.</p>
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
      <p>The client generates a 160x90 PNG thumbnail and sends it to the server. The public channel is synchronized to online players; direct messages are synchronized only to the two participants.</p>
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
