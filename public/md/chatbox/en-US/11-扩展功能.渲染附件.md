<h2 id="attachment-renders-attachments" data-toc-id="attachment-renders-attachments">Attachment Renders attachments</h2>
<p>
  Rendering accessories are one of the configuration items for portraits, used to add extra rendering, such as a picture or a piece of text. Attachments and character drawings form a unified whole, and when animation is performed, attachments move along with them. The configuration of the accessories is as follows:
</p><pre language="json" isclosed="false"><code class="language-json">"example": {
      "type": "texture",
      "texture": "chatbox:textures/portrait/authors.png",
      "x": 0, "y": 0, "width": 10, "height": 10, "alignX": "left", "alignY": "bottom",
      "attachment": [
        {
          "type": "text",
          "value": "Ciallo～(∠·ω&lt; )⌒★",
          "x": 3, "y": 3,
          "width": 30,
          "height": 0,
          "textAlign": "left",
          "textColor": -1,
          "lineBreak": false
        },
        {
          "只是一个提示": "可以根据需要继续添加附件"
        }
      ]
    }</code></pre>
<p>The above<code>attachment</code> An array is the configuration of rendering attachments. Next, I'll explain in detail the function of each parameter within it.</p>
<p></p>
<ul>
  <li>
    <p>
      <code>type</code>: There are currently two types of attachments, which are:<code>texture 资源包图片</code>And<code>text 文本</code>
      。</p>
  </li>
</ul>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">INFO</div>
  <div data-type="admonition-content">
    <p>
      Attachment<code>type</code>Fields and portraits<code>type</code>There is no association between fields; player avatars and item texture types can be used to add images and text attachments.
    </p>
    <p><span data-type="hidden-text">You ask me why attachments don't have player avatars and item texture types? Because I'm too lazy to do it (</span></p>
  </div>
</div>
<ul>
  <li>
    <p><code>x</code>(Optional, default 0): Offset relative to the x-coordinate of the portrait, measured as a percentage of window width.</p>
  </li>
  <li>
    <p><code>y</code>(Optional, default 0): Y coordinate offset relative to the portrait, measured as a percentage of window height.</p>
  </li>
</ul>
<p><strong>Since the latter two types of fields have quite different functions, I will introduce them separately</strong></p>
<h3 id="texture-resource-package-images" data-toc-id="texture-resource-package-images"><code>Texture resource package images</code>
</h3>
<p></p>
<ul>
  <li>
    <p><code>value</code>: Enter the path to the image, just like the image portrait<code>texture</code>The field is the same.</p>
  </li>
  <li>
    <p><code>width, height</code>: The effect matches the field with the same name as the image portrait.</p>
  </li>
  <li>
    <p>Other fields are meaningless for the picture.</p>
  </li>
</ul>
<h3 id="text" data-toc-id="text"><code>text</code></h3>
<ul>
  <li>
    <p><code>value</code> : The content of the text.</p>
  </li>
  <li>
    <p><code>width</code>: The width of the text lines affects line breaks and text alignment. If you don't need line breaks and don't consider alignment, then you don't need to worry about this field or the next two fields.</p>
  </li>
  <li>
    <p>
      <code>textAlign</code>(Optional, default value.)<code>left</code>): Text alignment, optional value<code>left center right</code>。 Just as it is<code>width</code>Effective when greater than 0.
    </p>
  </li>
  <li>
    <p>
      <code>lineBreak</code>(Optional, default value is <code>false</code>): Whether the text is line breaks. Just as it is<code>width</code>Effective when greater than 0.
    </p>
  </li>
  <li>
    <p><code>textColor</code>(Optional, default value is <code>-1</code>, white): The text color uses ARGB format color codes.
    </p>
  </li>
  <li>
    <p><s>height</s>: meaningless.</p>
  </li>
</ul>
<p></p>
