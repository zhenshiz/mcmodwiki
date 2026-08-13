<h1 id="camera-and-album" data-toc-id="camera-and-album">Camera and Album</h1>
<p>The Camera takes photos from the current player's perspective, and the Album browses, deletes, and imports photos. Photos in the Album can also be sent as chat room image messages; see <a href="?file=30-Features.Social-and-Chat.md">Sending image messages</a>.</p>

<h2 id="taking-photos" data-toc-id="taking-photos">Taking photos</h2>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Open the camera</div>
    <div data-type="admonition-content">
      <p>Open Camera from the phone home screen or from the Album. The camera enters first-person viewfinder mode.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Adjust zoom</div>
    <div data-type="admonition-content">
      <p>Use the mouse wheel to adjust zoom, or use the minus and plus buttons in the camera UI.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Capture or open the album</div>
    <div data-type="admonition-content">
      <p>Right-click or press C to take a photo; press G or use the middle mouse button to open the Album. Press Esc to exit viewfinder mode and return to the phone.</p>
    </div>
  </div>
</div>
<p>On a successful capture, a save notification appears and the photo is added to the current player's local album.</p>

<h2 id="album-management" data-toc-id="album-management">Album management</h2>
<p>The Album sorts photos by most recently modified first. Tap a thumbnail to open the detail page, which shows the file name and save time; the detail page provides Camera and Delete buttons.</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">Deletion cannot be undone</div>
  <div data-type="admonition-content">
    <p>Deleting in the Album removes the actual image file from the album. Back up any photo you want to keep before deleting it.</p>
  </div>
</div>

<h2 id="importing-external-images" data-toc-id="importing-external-images">Importing external images</h2>
<p>The Import button at the top of the Album opens the system file picker, so you can import external images that did not come from the phone camera, such as PNG or JPEG files saved from another album app.</p>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">Open the import window</div>
    <div data-type="admonition-content">
      <p>Open the Album and click Import. The file picker only shows <code>.png</code>, <code>.jpg</code>, and <code>.jpeg</code> files.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Choose a valid image</div>
    <div data-type="admonition-content">
      <p>Select a PNG or JPEG image. The mod validates the file format, file size, and pixel count, then converts successfully imported images into the PNG files used by the album.</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">Confirm the result</div>
    <div data-type="admonition-content">
      <p>After the "Image imported" notification appears, return to the album list to see the new photo. On failure, the prompt will read unsupported format, image too large, invalid image, or import failed.</p>
    </div>
  </div>
</div>

<h2 id="import-limits" data-toc-id="import-limits">Import limits</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Item</th>
      <th>Current limit</th>
      <th>Handling</th>
    </tr>
    <tr>
      <td>File extension</td>
      <td>png, jpg, jpeg</td>
      <td>Other extensions are rejected</td>
    </tr>
    <tr>
      <td>Image format</td>
      <td>PNG, JPEG</td>
      <td>Rejected if the reader detects another format</td>
    </tr>
    <tr>
      <td>Source file size</td>
      <td>Up to 32 MiB</td>
      <td>Exceeding the limit shows image too large</td>
    </tr>
    <tr>
      <td>Source image pixels</td>
      <td>Up to 32,000,000 pixels</td>
      <td>Exceeding the limit shows image too large</td>
    </tr>
    <tr>
      <td>Size after import</td>
      <td>Largest side sampled to about 2048 pixels</td>
      <td>Imported content is saved as PNG</td>
    </tr>
  </tbody>
</table>

<h2 id="photo-file-location" data-toc-id="photo-file-location">Photo file location</h2>
<p>The album is isolated per player, and photos are saved under the game directory:</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">smart_phone/photos/&lt;player UUID&gt;/</code></pre>
<p>Local situations without a player entity use <code>local</code> as the directory name. This directory only stores client photos; it is not equivalent to the server chat history.</p>
