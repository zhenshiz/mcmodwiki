<h2 id="animation" data-toc-id="animation">Animation</h2>
<p>Animation is one of the configuration items for character illustrations, used to enrich their expressiveness. The animations in this mod use keyframe animation configuration. First, let's look at all the parameters of a keyframe:</p>
<ul>
  <li>
    <p>
      <code>time</code>(Default value is 1): The total number of frames from the start to the end of execution for this keyframe; the actual animation is shown in the dialog file<code>animationFPS</code>Configurations and the impact of user devices. The default animation frame rate is 60/s, that is<code>time</code>At 60, the animation should last 1 second (if the user's device frame rate is below 60, the animation duration will be extended).
    </p>
  </li>
  <li>
    <p><code>easing</code>: The slowing function of this keyframe. You can refer to an introduction to the slow function for details<a target="_blank"
        rel="noopener noreferrer nofollow"
        href="https://easings.net/zh-cn">Quick reference table for slow functions</a>。 Optional parameters include:<code>EASE_IN_SINE, EASE_OUT_SINE, EASE_IN_OUT_SINE, EASE_IN_QUAD, EASE_OUT_QUAD, EASE_IN_OUT_QUAD, EASE_IN_CUBIC, EASE_OUT_CUBIC, EASE_IN_OUT_CUBIC, EASE_IN_QUART, EASE_OUT_QUART, EASE_IN_OUT_QUART, EASE_IN_QUINT, EASE_OUT_QUINT, EASE_IN_OUT_QUINT, EASE_IN_EXPO, EASE_OUT_EXPO, EASE_IN_OUT_EXPO, EASE_IN_CIRC, EASE_OUT_CIRC, EASE_IN_OUT_CIRC, EASE_IN_BACK, EASE_OUT_BACK, EASE_IN_OUT_BACK, EASE_IN_ELASTIC, EASE_OUT_ELASTIC, EASE_IN_OUT_ELASTIC, EASE_IN_BOUNCE, EASE_OUT_BOUNCE, EASE_IN_OUT_BOUNCE</code>
    </p>
  </li>
  <li>
    <p>
      <code>x, y, scale, brightness, opacity, angle</code>: This is the value corresponding to the character illustration. During the duration of this keyframe, these values gradually change according to the slow function, thereby achieving the animation effect.
    </p>
  </li>
  <li>
    <p>
      <code>xOffset, yOffset</code>: The offset relative to the original character illustration coordinates. For example<code>xOffset</code>Fill in 5, and the portrait will move 5 units to the right;<code>yOffset</code>Fill in -5, and the portrait will move up by 5 units.
    </p>
  </li>
  <li>
    <p><code>texture</code>: The value corresponding to the character art only changes at the end of the keyframe.</p>
  </li>
  <li>
    <p><code>attachment</code>: The value corresponding to the character art only changes at the end of the keyframe.</p>
  </li>
</ul>
<p></p>
<p>At this point, some might ask: with so many parameters in a single keyframe, is writing animation really troublesome? Actually, that's not the case—just look at the configuration instructions and you'll understand.</p>
<h3 id="configuration-method-1-preset-the-theme-file-animation" data-toc-id="configuration-method-1-preset-the-theme-file-animation">Configuration Method 1: Preset the theme file animation</h3>
<p>
  In the configuration of the theme file, there is<code>customAnimation</code>Fields. Under this field, you can preset animations with names, and then just in the character drawing<code>animation</code>By entering this name in the field, you can directly use the corresponding animation. The three built-in animations in this mod are added in this way.
</p>
<p>Animations defined this way are generally commonly used. If you want to add a customized animation to a character, it's recommended to use Configuration Method 2 (of course, if you want to write it in the theme file, no one will stop you).</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">IMPORTANT</div>
  <div data-type="admonition-content">
    <p>Although preset animations are written in the theme file, they are not bound to the theme; as long as the theme is loaded, these animations are universally applicable.</p>
    <p>
      <strong>Animation titles are case-sensitive.</strong>Since preset animations are universally applicable, if there is an animation with the same name, the later loaded one will overwrite the one that came first<span data-type="hidden-text">(You ask me what determines the loading order?) I don't know either, just ask for the code.)</span>Therefore, it is recommended to use the common naming convention for MC—namespace: name—to prevent duplicate names.<span data-type="hidden-text">(If no one uses it, why worry about the same name?)</span>
    </p>
  </div>
</div>
<p>Let's take a look at how to write the three built-in animations:</p><pre language="json" isclosed="false"><code class="language-json">"customAnimation": {
    "FADE_IN": [
      {"time": 1, "opacity": 0},
      {"time": 30, "opacity": 100, "easing": "EASE_OUT_SINE"}
    ],
    "SLIDE_IN_FROM_BOTTOM": [
      {"time": 30, "yOffset": -5, "easing": "EASE_OUT_SINE"}
    ],
    "BOUNCE": [
      {"time": 15, "yOffset": -5, "easing": "EASE_OUT_SINE"},
      {"time": 15, "yOffset": 5, "easing": "EASE_OUT_SINE"}
    ]
  }</code></pre>
<p>
  As you can see, an animation is actually a set of keyframes. When rendering a portrait, it is defined by a keyframe<code>time</code>After the frame, the character artwork attribute will become the value defined in that keyframe. If a field is missing in the keyframe, the value of the corresponding field in the portrait will not change. So although a keyframe contains many fields, you only write it when you need it, and don't write it when you don't.
</p>
<p><s><span data-type="hidden-text">Why does FADE_IN animation have an extra frame? Please don't worry about these minor issues</span></s></p>
<h3 id="configuration-method-2-pre-draw-the-theme-file" data-toc-id="configuration-method-2-pre-draw-the-theme-file">Configuration Method 2: Pre-draw the theme file</h3>
<p>
  There are two fields related to animation in the character art configuration, one is <code>animation</code>, fill in the animation name defined by Configuration Method 1; Another is<code>customAnimation</code>, fill in<strong>Keyframe array</strong>。
</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">INFO</div>
  <div data-type="admonition-content">
    <p>If one character illustration is filled out at the same time<code>animation</code> And<code>customAnimation</code>
      Fields, then only<code>customAnimation</code> It will take effect.</p>
  </div>
</div>
<p>Example:</p><pre language="json" isclosed="false"><code class="language-json">    "ciallo": {
      "x": 11,
      "y": 41,
      "width": 22,
      "height": 13,
      "texture": "chatbox:textures/box1.png",
      "attachment": [
        {"type": "text", "value": "Ciallo～(∠·ω&lt; )⌒★", "x": 2, "y": 4.5}
      ],
      "customAnimation": [
        {"scale": 0},
        {"time": 14, "scale": 1.5}
      ],
      "注释：动画效果": "让该立绘由小变大出现"
    }</code></pre>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">IMPORTANT</div>
  <div data-type="admonition-content">
    <p>
      Although it's a character illustration<code>customAnimation</code>Fields and theme files<code>customAnimation</code>Same name, but different spellings. Animations bound to the character art do not need to be named, so just fill in the keyframe array; only preset animations in the theme file need to be named!
    </p>
  </div>
</div>
<h3 id="configuration-method-3-replace-the-portrait-in-the-dialog-file" data-toc-id="configuration-method-3-replace-the-portrait-in-the-dialog-file">Configuration Method 3: Replace the portrait in the dialog file</h3>
<p>This means using the Replace Portrait feature to change a preset character in the theme to another animation. The essence is the same as Method 2, just mentioned here.</p>
<p></p>
