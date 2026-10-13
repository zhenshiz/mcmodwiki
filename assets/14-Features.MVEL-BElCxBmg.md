<h1 id="mvel" data-toc-id="mvel">MVEL</h1>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">INFO</div>
  <div data-type="admonition-content">
    <p>
      This is an advanced feature that requires a certain level of coding skills to use. If you already know how to use Kubejs, mastering mvel shouldn't be a problem either.<span data-type="hidden-text">(It's just that this one doesn't fill in anything complete, so it can be a bit troublesome.)</span>
    </p>
  </div>
</div>
<p>ChatBox uses mvel mainly for simple conditional checks of component events, placeholder parsing, and variable systems. You can do it here<a
    href="https://bigjun2017.github.io/2018/09/18/hou-duan/java/mvel2.x-yu-fa-zhi-nan/"
    target="_blank" rel="noopener noreferrer nofollow">Here</a>Understand the basic usage of mvel.</p>
<p></p>
<p>Because MC's runtime code is obfuscated, it is difficult to directly call all the methods and fields of the original class. To make it easier for creators, ChatBox has introduced some variables and methods as follows:</p>
<p><strong>(Currently, there are few built-in methods; if needed, please feel free to report to the author.)</strong></p>
<p>
  <span data-type="hidden-text">I really don't know how to make this tutorial easy to understand. If you have any questions, you can contact the author directly (join the group 188417806 or just add 1823040881)</span>
</p>
<h2 id="1-predefined-methods-and-variables" data-toc-id="1-predefined-methods-and-variables"><strong>1. Predefined methods and variables</strong></h2>
<p>
  Starting from version 1.1.4, ChatBox's MVEL parsing supports custom variables (including custom functions, which are also variables and affect the client/server global scope). The variable you declare at the start of a conversation can be modified as needed during the conversation, and then in the text,<code>&lt;&lt;MVEL代码&gt;&gt;</code>It is used in this form. ChatBox's MVEL parsing does not automatically delete custom variables. Unless you manually delete a custom variable, the declared variable will be visible in subsequent MVEL parses.
</p>
<p>Here are some ways to manipulate custom variables:</p>
<h4 id="hasvarvariable-name-string-boolean" data-toc-id="hasvarvariable-name-string-boolean">
  <code>hasVar(variable name: String): boolean</code></h4>
<p>To determine whether the variable with the name exists, the variable name must be enclosed in quotes.</p>
<h4 id="setvarvariable-name-string-variable-value-object-object" data-toc-id="setvarvariable-name-string-variable-value-object-object">
  <code>setVar(variable name: String, variable value: Object): Object</code></h4>
<p>
  Add a variable or assign a value to a variable; the variable name must be in quotes. Usually, you don't need to use this method, because you can write directly<code>a=10</code>, thus completing the declaration and assignment of the variable.
</p>
<h4 id="setvarifnodefvariable-name-string-variable-value-object-object" data-toc-id="setvarifnodefvariable-name-string-variable-value-object-object">
  <code>setVarIfNoDef(variable name: String, variable value: Object): Object</code></h4>
<p>
  A variable is declared only if it is not declared; the variable name must be in quotation marks. It's equivalent to writing<code>if (!hasVar('a')) {setVar('a', 10)}</code>。
</p>
<h4 id="removevarvariable-name-string-object" data-toc-id="removevarvariable-name-string-object">
  <code>removeVar(variable name: String): Object</code></h4>
<p>Delete the variable with that name; the variable name must be in quotation marks.</p>
<p></p>
<p>In an MVEL expression, the following variables can be used directly (may vary depending on the execution environment):</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>variable name</th>
      <th>Type</th>
      <th>Description</th>
      <th>Available environment</th>
    </tr>
    <tr>
      <td>random</td>
      <td>Random</td>
      <td>Random number generation</td>
      <td>Always available</td>
    </tr>
    <tr>
      <td>player</td>
      <td>Player</td>
      <td>Player Object (if there is a contextual player)</td>
      <td>When providing to players</td>
    </tr>
    <tr>
      <td>gameTime</td>
      <td>long</td>
      <td>Current game time (time in the player's world)</td>
      <td>When providing to players</td>
    </tr>
    <tr>
      <td>chatbox</td>
      <td>Class</td>
      <td>ChatBoxUtil class, which can call its static methods</td>
      <td>Client</td>
    </tr>
    <tr>
      <td>chatboxScreen</td>
      <td>ChatBoxScreen</td>
      <td>The currently opened chat box screen instance</td>
      <td>Client</td>
    </tr>
    <tr>
      <td>chatboxTick</td>
      <td>int</td>
      <td>The chat box count counter</td>
      <td>Client</td>
    </tr>
    <tr>
      <td>targets</td>
      <td>List&lt;Entity&gt;</td>
      <td>Current chat target entity list</td>
      <td>Client/server side</td>
    </tr>
    <tr>
      <td>_this</td>
      <td>Object</td>
      <td>Current context object (for example, representing the component itself when executing a component event)</td>
      <td>When it was provided</td>
    </tr>
  </tbody>
</table>
<p></p>
<p>Example:</p><pre isclosed="false"><code>// 生成一个0-9的随机整数
random.nextInt(10)
// 获取对话框屏幕的对话框对象（该方法返回的是列表，加上[0]才是列表内的元素）
chatboxScreen.getCompByDesc('@dialog')[0]
// 隐藏组件（若有）
_this.setHidden(true)</code></pre>
<h2 id="2-dynamic-attributes" data-toc-id="2-dynamic-attributes"><strong>2. Dynamic attributes</strong></h2>
<p>Dynamic attributes can be used using kubejs in startup scripts<code>ChatBoxUtil.addMvelProperty</code>Registration is available at MVEL
  used like fields for accessing objects (<code>对象.属性</code>）。</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>Attribute name</th>
      <th>Applicable Subjects</th>
      <th>Description</th>
    </tr>
    <tr>
      <td>name</td>
      <td>Solids, items/item piles</td>
      <td>Retrieve the display name of the object</td>
    </tr>
    <tr>
      <td>id</td>
      <td>Solids/items/item stacks/blocks/status effects, etc</td>
      <td>Obtain the registration ID of the object</td>
    </tr>
    <tr>
      <td>count</td>
      <td>Pile of items</td>
      <td>Obtain the number of items in the pile</td>
    </tr>
    <tr>
      <td>uuid</td>
      <td>Entity</td>
      <td>A unique identifier for an entity</td>
    </tr>
    <tr>
      <td>tags</td>
      <td>Entity</td>
      <td>Entity's tag collection (Set&lt;String&gt;)</td>
    </tr>
    <tr>
      <td>health</td>
      <td>LivingEntity</td>
      <td>The creature's current health</td>
    </tr>
    <tr>
      <td>experienceLevel</td>
      <td>Player</td>
      <td>Player experience level</td>
    </tr>
    <tr>
      <td>foodLevel</td>
      <td>Player</td>
      <td>Players' hunger level</td>
    </tr>
    <tr>
      <td>x</td>
      <td>Entity</td>
      <td>The X-coordinate of the entity</td>
    </tr>
    <tr>
      <td>y</td>
      <td>Entity</td>
      <td>The Y-coordinate of the entity</td>
    </tr>
    <tr>
      <td>z</td>
      <td>Entity</td>
      <td>The Z coordinate of the entity</td>
    </tr>
    <tr>
      <td>mainHandItem</td>
      <td>LivingEntity</td>
      <td>Main items</td>
    </tr>
    <tr>
      <td>offHandItem</td>
      <td>LivingEntity</td>
      <td>Off-hand items</td>
    </tr>
  </tbody>
</table>
<p></p>
<p>Example:</p><pre isclosed="false"><code>player.name                         //玩家名称
target2.health                      //第二个对话目标实体的生命值
player.id                           //返回"minecraft:player"
player.mainHandItem.count           //玩家主手物品的数量
player.offHandItem.name             //玩家副手物品的名称
player.getItemBySlot('chest').id    //玩家胸甲的物品id，方法用法见后文</code></pre>
<h2 id="3-dynamic-methods" data-toc-id="3-dynamic-methods"><strong>3. Dynamic Methods</strong></h2>
<p>
  Dynamic approach<s><span data-type="hidden-text">You can use kubejs to register with ChatBoxUtil.addMvelMethod in the startup script (due to a kubejs bug, this actually doesn't work).</span></s>It can be done
  Called like a function in the MVEL.</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">INFO</div>
  <div data-type="admonition-content">
    <p>The following methods are not found in Minecraft code, but rather static methods I imported into the MVEL parsing for ChatBox.</p>
    <p>In general, the method should be used as follows:<code>hasItem(player,'diamond')</code></p>
    <p>
      However, I find static methods quite unintuitive to use, so when analyzing MVEL, ChatBox will<code>player.hasItem('diamond')</code>Rewrite the above code<s><span data-type="hidden-text">(In reality, it will be rewritten in a more general form, which you don't need to know.)</span></s>, just like<code>Player</code>This class has<code>hasItem</code>The method is the same.
    </p>
    <p>Of course, both writing methods can be used; you can write however you like.</p>
  </div>
</div>
<h4 id="hasitemtarget-player-itemid-string-boolean" data-toc-id="hasitemtarget-player-itemid-string-boolean">
  <code>hasItem(target: Player, itemId: String): boolean</code></h4>
<p>Determine whether a player owns at least one designated item.</p>
<pre isclosed="false"><code>player.hasItem('diamond')   // 玩家是否有钻石</code></pre>
<h4 id="getitemcounttarget-player-itemid-string-int" data-toc-id="getitemcounttarget-player-itemid-string-int">
  <code>getItemCount(target: Player, itemId: String): int</code></h4>
<p>Obtain the total number of specified items owned by the player (including backpack, armor slot, and off-hand).</p>
<pre isclosed="false"><code>player.getItemCount('minecraft:apple')</code></pre>
<h4 id="getitembyslottarget-livingentity-slot-stringint-itemstack" data-toc-id="getitembyslottarget-livingentity-slot-stringint-itemstack">
  <code>getItemBySlot(target: LivingEntity, slot: String/int): ItemStack</code>
</h4>
<p>If the slot is a string, it retrieves items in the creature's designated equipment slot. Slot name support:</p>
<ul>
  <li>
    <p><code>head</code> / <code>helmet</code></p>
  </li>
  <li>
    <p><code>chest</code> / <code>chestplate</code></p>
  </li>
  <li>
    <p><code>legs</code> / <code>leggings</code></p>
  </li>
  <li>
    <p><code>feet</code> / <code>boots</code></p>
  </li>
</ul>
<p>If the slot is a number, obtain the item from the player's backpack with the specified index (index 0~35 for main inventory, 36~39 for armor, 40 for off-hand).</p><pre isclosed="false"><code>target.getItemBySlot('head')   // 获取目标（若有）头盔槽物品
player.getItemBySlot(0)        // 获取玩家背包第一个物品</code></pre>
<h4 id="getscoretarget-player-objective-string-int" data-toc-id="getscoretarget-player-objective-string-int">
  <code>getScore(target: Player, objective: String): int</code></h4>
<p>Obtain the player's score on a specified scoreboard objective (the client can only get the score from the displayed scoreboard).</p>
<pre isclosed="false"><code>player.getScore('example')</code></pre>
<h4 id="hastagtarget-entity-tag-string-boolean" data-toc-id="hastagtarget-entity-tag-string-boolean">
  <code>hasTag(target: Entity, tag: String): boolean</code></h4>
<p>Check whether an entity has a specified tag (clients generally cannot get tags, but if the entity is added to ChatBox's list of conversation entities, it can).</p>
<pre isclosed="false"><code>player.hasTag('tag')</code></pre>
<h4 id="hasadvancementtarget-player-progress-string-boolean" data-toc-id="hasadvancementtarget-player-progress-string-boolean">
  <code>hasAdvancement(target: Player, progress: String): boolean</code></h4>
<p>Determine whether a player has reached the specified progress. On the server side, the target can be any player, and the client can only be the player themselves, since data from other players cannot be accessed.</p>
<pre isclosed="false"><code>player.hasAdvancement('minecraft:story/mine_diamond')    //玩家是否取得了获得钻石进度</code></pre>
<h4 id="telltarget-player-message-string-actionbar-boolean" data-toc-id="telltarget-player-message-string-actionbar-boolean">
  <code>tell(target: Player, message: String, actionBar?: boolean)</code></h4>
<p>Send a message to the player. The second parameter is <code>true</code> The message will be displayed in the action bar.</p><pre isclosed="false"><code>player.tell('你好！')           //显示在聊天框
player.tell('Hello!', true)    //显示在动作栏</code></pre>
<h4 id="getenchantlevelitem-itemstack-id-string-int" data-toc-id="getenchantlevelitem-itemstack-id-string-int">
  <code>getEnchantLevel(item: ItemStack, id: String): int</code></h4>
<p>Obtain the required enchantment level for the item.</p>
<pre isclosed="false"><code>player.mainHandItem.getEnchantLevel('sharpness') &gt; 0  //判断玩家主手物品是否有锋利附魔</code></pre>
<h4 id="enchantitem-itemstack-id-string-level-int" data-toc-id="enchantitem-itemstack-id-string-level-int">
  <code>enchant(item: ItemStack, id: String, level: int)</code></h4>
<p>Adds enchantments of a specified level to items. It must be executed on the server side for it to be effective.</p>
<pre isclosed="false"><code>player.offHandItem.enchant('looting', 114)  //给玩家副手物品添加114级的抢夺附魔</code></pre>
<h2 id="4-expression-examples" data-toc-id="4-expression-examples"><strong>4. Expression Examples</strong></h2>
<p>Here are some comprehensive examples showing how to use the above variables, methods, and properties in MVEL:</p>
<pre isclosed="false"><code>// 判断玩家是否手持钻石剑且等级大于等于10
player.mainHandItem.id == 'minecraft:diamond_sword' &amp;&amp; player.experienceLevel &gt;= 10

// 获取第一个目标的名称和健康值
target.name + ' health: ' + target.health

// 向所有目标发送动作栏消息
for (t : targets) {t.tell('Hello ' + t.name, true)}

// 随机选择一个对话目标实体
targets[random.nextInt(targets.size())]

// 判断玩家是否有“vip”标签或者拥有至少5个金苹果
player.hasTag('vip') || player.getItemCount('golden_apple') &gt;= 5</code></pre>
<p></p>
