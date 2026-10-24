<h1 id="phone-data-editor" data-toc-id="phone-data-editor">Phone Data Editor</h1>
<p>The Phone Data Editor lets administrators and map authors preset the phone of a specific owner. It reads the phone profile saved by the server directly, and edits stay in the editor draft first; clicking "Save and apply" writes them back to the server, with no need to open project files or import NBT files. Opening the editor requires command permission level 2.</p>

<h2 id="select-a-target-and-open" data-toc-id="select-a-target-and-open">Select a target and open</h2>
<pre language="mcfunction" isclosed="false"><code class="language-mcfunction">/smart_phone editor
/smart_phone editor Dev
/smart_phone character register "Zhang San"
/smart_phone editor "Zhang San"</code></pre>
<p>With no target given, the editor opens the owner bound to the phone in your main hand; if that phone has no bound owner, it edits yourself. You can also specify a player name known to the server, a player UUID, or a registered virtual character name. Virtual characters must be registered first; this lets you preset a phone without knowing the future player's ID. For the complete steps to create a character phone, see <a href="?file=&quot;Admin.Config-and-Commands#character-phones&quot;">Character phones</a>.</p>

<h2 id="preview-and-ui-scale" data-toc-id="preview-and-ui-scale">Preview and UI scale</h2>
<p>The left side of the editor is an interactive phone preview, and the right side holds the parameter pages. On the left you can swipe, open apps, enter the chat or message list, and click the conversation or message you want to modify; the right side shows the matching fields for the selected object. Drag the divider in the middle to change the width of the preview and parameter areas. "Return to standby preview" shows the lock screen effect again.</p>
<p>The "UI scale" setting at the top supports an automatic option and numeric options; the larger the number, the larger the text and controls inside the editor. This setting only affects the Phone Data Editor. On exit the game restores its original GUI scale, and the phone size outside the editor is unchanged. The client remembers this editor scale separately.</p>

<h2 id="parameter-pages-on-the-right" data-toc-id="parameter-pages-on-the-right">Parameter pages on the right</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr><th>Page</th><th>Editable content</th><th>How to operate</th></tr>
    <tr><td>Basics</td><td>Wallpaper, time source, administrator interception and lock screen display toggles, six-digit unlock passcode</td><td>Modify the fields and check the left preview; an existing passcode can be kept or cleared separately</td></tr>
    <tr><td>Apps</td><td>Install state of downloadable apps</td><td>Toggle app switches; default system apps cannot be turned off here</td></tr>
    <tr><td>Chat</td><td>Preset channels, preset friends, and the selected chat message</td><td>Select a conversation and message on the left, then use the bottom-right buttons to add or delete</td></tr>
    <tr><td>Messages</td><td>Sender, title, date and time, read state, and body of the selected official message</td><td>Select one entry in the left list to edit; manage messages with the bottom-right plus and minus buttons</td></tr>
    <tr><td>Notes</td><td>The phone's notepad body</td><td>Edit the multi-line content directly</td></tr>
  </tbody>
</table>
<p>When editing the date and time of a chat or official message, clicking the date button opens a calendar where you can set year, month, day, hour, minute, and second; there is no need to hand-write a millisecond timestamp. The date picker displays in the current client's local time zone.</p>

<h2 id="creating-preset-chats" data-toc-id="creating-preset-chats">Creating preset chats</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Create a conversation</div>
    <div data-type="admonition-content"><p>Go to the Chat page and click the conversation "+" in the bottom-right corner to create a channel, or "+ Friend" to create a preset friend. The preset friend's player ID may be a fictional name; the player does not need to exist.</p></div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Select the conversation</div>
    <div data-type="admonition-content"><p>Click a conversation in the channel or friend list on the left phone. The right side shows the current conversation name; for preset friends you can also change the friend player ID. The conversation "−" deletes the currently selected conversation.</p></div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Edit a single message</div>
    <div data-type="admonition-content"><p>Use the message "+" to create a record, then click a message on the left phone. The right side shows only that record's sender, whether it was sent by the phone owner, avatar player ID, date and time, and body. The message "−" deletes the currently selected record.</p></div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Add an image</div>
    <div data-type="admonition-content"><p>With a message selected, click "Choose image from album" to pick an existing photo from the left phone's album; you can also remove a chosen image. The image thumbnail data is saved, and it can be combined with text into an image-and-text message.</p></div>
  </div>
</div>
<p>The "avatar player ID" accepts up to 16 letters, digits, or underscores. After entering a valid Java player username, that message can show the skin avatar of that account; the account does not need to be online. When left empty, the sender's original avatar is used. The avatar source is independent of the message's display name. For more preset chat behavior, see <a href="?file=&quot;Features.Social-and-Chat#preset-conversations&quot;">Preset conversations</a>.</p>

<h2 id="passcode-and-saving" data-toc-id="passcode-and-saving">Passcode and saving</h2>
<p>The unlock passcode box on the Basics page accepts digits only, up to six; after entering a new passcode it must be exactly six digits to save, and leading zeros are allowed. An existing passcode is stored server-side only as a digest, so the editor never shows the original digits: leaving the new passcode empty keeps the current one; clicking "Clear passcode" and saving removes it. Setting or replacing a passcode in the editor requires no old passcode.</p>
<p>After clicking "Save and apply" in the top-right corner, the server validates the target and passcode format, saves the whole draft under that phone owner, and updates players currently using this phone. Unsaved changes trigger a discard confirmation when the editor closes. If saving fails, the editor keeps the draft and shows the failure state; check the target and passcode, then retry.</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">What is saved is the phone owner's profile</div>
  <div data-type="admonition-content"><p>Both real player phones and character phones read and write the profile of the owner pointed to by the item component. Multiple phones belonging to the same owner share wallpaper, apps, preset chats, notes, and passcode. The editor preview reads that owner's profile; the local album still uses the current client's photos.</p></div>
</div>
