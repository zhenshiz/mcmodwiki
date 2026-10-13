<h2 id="the-renderevents-component-renders-events" data-toc-id="the-renderevents-component-renders-events">The RenderEvents component renders events</h2>
<p>Component rendering events are advanced features that trigger custom event effects during dialogue playback at specific moments during component rendering, such as playing sound effects, executing commands, hiding or showing specific components, and so on.</p>
<p><code>renderEvents</code>It can be used as a parameter for a conversation or defined under any component. If used as a parameter in a dialogue, the event will only be triggered when jumping to that dialogue.</p>
<p>Let's first look at a configuration that only appears after the dialog box text is displayed (in the topic file):</p><pre language="json" isclosed="false"><code class="language-json">  "option": {
    "texture": "chatbox:textures/options/default_no_checked_option.png",
    "selectTexture": "chatbox:textures/options/default_checked_option.png",
    "lockTexture": "chatbox:textures/options/default_lock_checked_option.png",
    "x": 0, "y": 30, "width": 35, "height": 8, "alignX": "right", "alignY": "top",
    "optionChatX": 6, "optionChatY": 2.7, "textAlign": "left",
    "hidden": true,
    "注释": "这里的hidden只是在渲染层面隐藏选项，用于让选项不在一开始就显示出来，以配合对话框的事件"
  },
  "dialogBox": {
    "texture": "chatbox:textures/chatbox/default_dialog_box.png",
    "alignX": "left", "alignY": "bottom", "lineWidth": 70, "width": 100, "height": 40,
    "nameX": 20, "nameY": 10, "textX": 20, "textY": 15,
    "renderEvents": [
      {"trigger": "end", "condition": "", "type": "show", "value": "@Options"}
    ]
  }</code></pre>
<p>Component rendering events are also an array, with each event containing 3 fields:</p>
<ul>
  <li>
    <p><code>trigger</code>: The timing of triggering the event includes the following:</p>
    <ul>
      <li>
        <p><code>on_start</code>(It can be abbreviated as.)<code>start</code>): Triggered when component rendering starts (or when switching to a conversation).
        </p>
      </li>
      <li>
        <p><code>on_end</code>(It can be abbreviated as.)<code>end</code>): Triggered when component rendering ends.</p>
      </li>
      <li>
        <p>
          <code>tick</code>: As long as the player opens the dialog box, it triggers every tick, regardless of whether the component is locked or hidden. It is recommended to set it reasonably<code>condition</code>。 Available in mvel executed by the client<code>chatboxTick</code>Indicates the tick where the current conversation has started, and this value resets to 0 when entering a new dialogue.
        </p>
      </li>
      <li>
        <p>
          <code>check</code>: Regardless of whether the component is locked or hidden, once a conversation is entered, it will always be triggered once, generally used for coordination<code>set_normal</code>(See below) Effect recovery component.
        </p>
      </li>
    </ul>
  </li>
</ul>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">INFO</div>
  <div data-type="admonition-content">
    <p>
      Regarding this<code>dialogBox</code>component, triggered when the text is fully displayed; Regarding this<code>portrait</code>If it has animations and does not loop, it will be triggered at the end of the character animation; Regarding this<code>video</code>If the component does not loop, it will be triggered at the end of video playback. Other components do not have this timing.
    </p>
  </div>
</div>
<ul>
  <li>
    <p><strong>The following three trigger times are only for reference</strong><code>portrait</code><strong>Character Art Component:</strong>
    </p>
    <ul>
      <li>
        <p>
          <code>on_click</code>(It can be abbreviated as.)<code>click</code>): Triggers when the character is clicked. (If the illustrations overlap, only the topmost illustration events will be executed.)
        </p>
      </li>
      <li>
        <p><code>on_mouse_over</code>(It can be abbreviated as.)<code>mouse_over</code>): Triggers when hovering over the portrait.
        </p>
      </li>
      <li>
        <p><code>on_mouse_out</code>(It can be abbreviated as.)<code>mouse_out</code>): Triggers when the mouse moves away from the portrait.
        </p>
      </li>
    </ul>
  </li>
  <li>
    <p>
      <code>condition</code>: Event trigger condition. Leaving it blank by default means unconditional; By default, the client executes mvel, if<code>execute</code>It starts with the server executing commands, if used as <code>server:</code>It starts by executing mvel on the server. Only after passing the conditional test will the event effect be executed.<span data-type="hidden-text">But since you can run mvel code here, you can actually get the job done at this step</span>
    </p>
  </li>
</ul>
<p></p>
<ul>
  <li>
    <p><code>type</code>: Event type, with multiple built-in events and support custom registration via KJS (see end of this article).</p>
  </li>
  <li>
    <p><code>value</code>: Event parameters, and the content of the parameters varies depending on the event type. Introduction to built-in event types and parameters:</p>
    <ul>
      <li>
        <p><code>command</code>: The server executes instructions. Parameter input instructions (no need to add it).<code>/</code>）。</p>
      </li>
      <li>
        <p>
          <code>mvel</code>: Executes mvel code, which is executed on the client by default. If the parameter is set to <code>server:</code>The beginning will be executed on the server side.
        </p>
      </li>
      <li>
        <p>
          <code>jump</code>:Forced dialogue redirects, ignoring restrictions. If no parameters are filled, the next dialogue will be skipped by default; Entering a number will redirect you to the specified index dialog; Fill in the group name to jump to the first dialogue of that group;<strong>Fill</strong><code>this</code><strong>Stay in the current conversation; Filling in a negative number will end the conversation</strong>。
        </p>
      </li>
      <li>
        <p><code>goto_next</code>: To the next dialogue, if there are any options, it is invalid. No parameters.</p>
      </li>
      <li>
        <p>
          <code>play_sound</code>: Play sound effects. Enter the sound effect id as a parameter (for example,<code>minecraft:ambient.cave</code>）。
        </p>
      </li>
      <li>
        <p>
          <code>play_voice</code>: Play voice messages. The same audio effect playback, but the difference is that the sound effect played during this event is similar to the voice play mechanism in a galgame, stopping as soon as the next dialogue line begins.
        </p>
      </li>
      <li>
        <p><code>stop_sound</code>: Stop specific sound effects.</p>
      </li>
      <li>
        <p>
          <code>hide</code>: Hides specific components, can be used<code>;</code>Separate multiple components. If one were to arrange the arguments<code>@</code>At the beginning, all related components are hidden; otherwise, the character with the specified ID is hidden.<code>@s</code>Pointing to the component itself,<code>@portraits</code>Pointing to all the illustrations,<code>@options</code>Pointing to all options,<code>@buttons</code>Pointing to all the keys,<code>@dialog</code>Pointing to text boxes,<code>@video</code>Pointing to the video.
        </p>
      </li>
      <li>
        <p><code>show</code>: Displays specific components. Parameter writing is the same<code>hide</code>。</p>
      </li>
      <li>
        <p>
          <code>replace</code>: Replace itself with a specific component. It means first hiding itself, then displaying the simple layout of other components, with the same parameter layout<code>hide</code>。
        </p>
      </li>
      <li>
        <p><code>lock</code>: Lock specific components. Parameter writing is the same<code>hide</code>。</p>
      </li>
      <li>
        <p><code>unlock</code>: Unlock specific components. Parameter writing is the same<code>hide</code>。</p>
      </li>
      <li>
        <p><code>set_normal</code>: Unlocks and hides component status. Parameter writing is the same<code>hide</code>。</p>
      </li>
      <li>
        <p>
          <code>set_autoplay</code>: Set whether autoplay is enabled. Fill in the parameters<code>true</code>Or<code>false</code>。
        </p>
      </li>
      <li>
        <p><code>scale</code>: Zoom character portraits. Parameters fill the scale scale (float type).</p>
      </li>
      <li>
        <p><code>play_animation</code>: Play an animation. Parameters can only be used to fill in the preset animation names of the theme file.</p>
      </li>
      <li>
        <p><code>restart_animation</code>: Replays the animation already held by this character; it has no effect on characters that play the animation on repeat. No parameters.</p>
      </li>
    </ul>
  </li>
</ul>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">IMPORTANT</div>
  <div data-type="admonition-content">
    <p>
      It should be noted that if the component is<code>hide</code>Event or component<code>hidden</code>The field is<code>true</code>If it is hidden, that component will not be rendered, cannot be interacted with, and naturally cannot be triggered either<code>tick</code>And<code>check</code>Rendering events outside of the usual timing.<br>The character must be in a dialogue<code>portrait</code>Only those mentioned in the array (or reserved due to previous dialogue) can be shown or hidden,<strong>You cannot add a new character to the current dialogue through events!</strong>
    </p>
  </div>
</div>
<p></p>
<p>Example: Add two portraits, start with only one display, click to switch to the other, click again to switch back (two different formats are used in the dialog file).</p><pre language="json" isclosed="false"><code class="language-json">{
  "renderEvents": [
    {"trigger": "start", "type": "hide", "value": "portrait2"}
  ],
  "注释": "如果 portrait2 的 hidden 字段被设置为 true ，就无需上面的 hide 事件",
  "portrait": [
    {
      "id": "portrait1",
      "renderEvents": [
        {"trigger": "click", "type": "hide", "value": "@s"},
        {"trigger": "click", "type": "show", "value": "portrait2"}
      ]
    },
    {
      "id": "portrait2",
      "renderEvents": [
        {"trigger": "click", "type": "replace", "value": "portrait1"}
      ]
    }
  ]
}</code></pre>
<h3 id="use-kubejs-to-define-new-event-types" data-toc-id="use-kubejs-to-define-new-event-types">Use KubeJS to define new event types
</h3><pre language="javascript" isclosed="false"><code class="language-javascript">//server_script

//你可以在服务端任意事件中添加对话组件渲染事件，比如我这里用的是服务端载入事件
ServerEvents.loaded(event =&gt; {
    //第一个参数是事件的类型，是你选项写渲染事件type的值，无视大小写
    //第二个参数是事件触发时，在客户端执行的操作
    //第三个参数是决定是否需要在服务端执行操作，如果填true就会自动发包触发第四个参数里的内容
    //第四个参数是事件触发时，在服务端执行的操作
    ChatBoxUtil.registerComponentEvent(
    'test',
    // 此处lambda表达式的第一个参数为触发事件的组件，可能为空，要使用一定记得检查！第二个参数为事件的参数
    (component, value) =&gt; { },
    true,
    (player, value) =&gt; {
        player.tell('test click')
        // 可以在此处使用ChatBoxUtil.serverGetChatTargets(player)来获取当前对话的目标实体列表
        let targets = ChatBoxUtil.serverGetChatTargets(player)
        if (targets.length &gt; 0) {
            let target = targets[0]
            player.tell('target1: ' + target.getName().getString())
        }
    })
})</code></pre>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">Did you know?</div>
  <div data-type="admonition-content">
    <ol>
      <li>
        <p>Component rendering events start as option click events, which initially only serve as command execution effects.</p>
      </li>
      <li>
        <p>
          Options are basically portraits with several convenient parameters; as long as you want to write, the portrait can be used as an option. Because the click event in the option is actually triggered at the time of the event<code>click</code>The component rendering event, the option jump dialogue is also that is<code>jump</code>Component of the type renders events.
        </p>
      </li>
      <li>
        <p>
          Optional<code>unlockCommand</code>A field actually adds a trigger time to the option<code>check</code>, with the condition being the field value,<code>set_normal</code>type, parameter is<code>@s</code>The event.
        </p>
      </li>
    </ol>
  </div>
</div>
