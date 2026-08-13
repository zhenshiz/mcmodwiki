<h2 id="mod-linkage" data-toc-id="mod-linkage">Mod linkage</h2>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">IMPORTANT</div>
  <div data-type="admonition-content">
    <p>Not all versions of ChatBox have the mod integration mentioned in this article; please refer to actual performance. For example, KubeJS integration only works with 1.20.1 forge and 1.21.1
      neoforge。</p>
  </div>
</div>
<h3 id="kubejs" data-toc-id="kubejs">KubeJS</h3>
<p>This mod provides KubeJS with a global variable<code>ChatBoxUtil</code>, this method includes API-based dialog box commands.<s>no
    Command the operation</s></p>
<p>This mod also provides three events for KubeJS calls to add whatever you want to add. Examples are as follows:</p><pre language="javascript" isclosed="false"><code class="language-javascript">//client_script

//在对话框渲染前触发，提供了GuiGraphics可以添加自己想要的渲染，可取消事件
ChatBoxEvents.renderPre(event=&gt;{
  let guiGraphics = event.getGuiGraphics()
  event.cancel()
})

//在对话框渲染后触发，提供了GuiGraphics可以添加自己想要的渲染
ChatBoxEvents.renderPost(event=&gt;{
  let guiGraphics = event.getGuiGraphics()
})

//server_script or client_script
//在跳转对话或关闭对话（index为-1）时触发，提供了对话的数据包文件，分组和序号来方便用户对特别某一句对话添加自己想要的功能。
//配合ChatBoxUtil的方法可以动态修改对话
ChatBoxEvents.skipChat(event =&gt; {
  let { player, resourceLocation, group, index, targets } = event
  if (index === -1) player.tell('关闭了对话框')
})</code></pre>
<h3 id="terra-bio" data-toc-id="terra-bio">Terra Bio</h3>
<p>Compatible versions are:<code>1.1.17-hotfix</code></p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">IMPORTANT</div>
  <div data-type="admonition-content">
    <p>While writing this feature, I found that GitHub's code is quite different from the released version, so compatibility with future versions may not be guaranteed, but I will try my best to support updated versions.</p>
  </div>
</div>
<p>
  By modifying the configuration file, you can block the NPC dialogue system in Terra Creatures. Note that if you enable this configuration, all NPC interactions will directly open the corresponding shop. You need to manually configure the corresponding dialogue boxes for these NPCs.
</p>
<p>So how do you configure the dialog box? You can cancel the original interaction behavior through the entity interaction event in KubeJS to jump to the current mod's dialogue. Example as follows:</p><pre language="javascript" isclosed="false"><code class="language-javascript">//server_script
ItemEvents.entityInteracted(event =&gt; {
  let { player, target } = event
  //判断NPC的实体类型，比如这里是判断是否为商人
  if (target.type === 'terra_entity:merchant') {
    //跳转本模组的对话框
    ChatBoxUtil.serverSkipDialogues(player, 'test:test', 'test', [target])
    //取消原先的交互行为
    event.cancel()
  }
})</code></pre>
<p>This way, you successfully swap the Terra creature NPC dialogue box for the cost mod. Now someone might ask: How do I open this NPC's shop?</p>
<p>
  You can select the click event type for the option in the dialog file as <code>TERRA_ENTITY_SHOP</code>This way, when players click this option, they can open the shop corresponding to the NPC currently interacting with them.
</p>
<h3 id="textanimator" data-toc-id="textanimator">TextAnimator</h3>
<p>You can use this mod to provide better animations for your dialogue text. For instructions, you can refer directly to the modrinth homepage for this mod:<a target="_blank"
    rel="noopener noreferrer nofollow"
    href="https://modrinth.com/mod/text-animator">TextAnimator</a></p>
<p></p>
