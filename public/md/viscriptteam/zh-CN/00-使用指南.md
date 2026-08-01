<h1 id="viscriptteam-使用指南" data-toc-id="viscriptteam-使用指南">ViScriptTeam 使用指南
</h1>
<p>ViScriptTeam 是面向 RPG 地图、PVE
  地图、剧情服务器和任务整合包的阵营关系与玩家组队模组。普通玩家可以通过可视化界面创建队伍、申请加入、处理邀请和使用队伍聊天；地图作者则可以管理实体阵营、玩家声望、敌对关系、友伤与阵营索敌。
</p>
<h2 id="功能概览" data-toc-id="功能概览">功能概览</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>系统</th>
      <th>主要使用者</th>
      <th>用途</th>
    </tr>
    <tr>
      <td>玩家队伍</td>
      <td>所有玩家</td>
      <td>可视化创建队伍、申请与邀请、成员管理、队伍聊天和队伍友伤</td>
    </tr>
    <tr>
      <td>阵营</td>
      <td>管理员与地图作者</td>
      <td>为怪物、NPC、守卫和机制实体设置势力归属与敌对关系</td>
    </tr>
    <tr>
      <td>玩家声望</td>
      <td>管理员、任务与脚本作者</td>
      <td>以数值决定玩家面对某个阵营时是敌对、中立还是友好</td>
    </tr>
    <tr>
      <td>战斗与显示</td>
      <td>服务器与客户端</td>
      <td>执行友伤保护、阵营索敌，并用绿色、黄色和红色提示实体态度</td>
    </tr>
  </tbody>
</table>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">阵营和队伍是两个系统</div>
  <div data-type="admonition-content">
    <p>
      <strong>阵营</strong>用于表达怪物、NPC、势力与玩家之间的关系；<strong>队伍</strong>用于表达哪些玩家当前一起行动。玩家不会通过“实体阵营归属”表示身份，而是通过自己对各阵营的声望参与关系判断。
    </p>
  </div>
</div>
<h2 id="玩家队伍界面" data-toc-id="玩家队伍界面">玩家队伍界面</h2>
<h3 id="打开界面" data-toc-id="打开界面">打开界面</h3>
<p>任意玩家都可以使用下面任一命令打开队伍界面，所需权限等级为 <code>0</code>：</p><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team party
/viscript_team party open</code></pre>
<p>界面左侧显示队伍身份、可用操作和成员列表，右侧显示队伍聊天。没有加入队伍时，成员列表只显示自己，身份为“尚未加入队伍”。</p>
<h3 id="没有队伍时" data-toc-id="没有队伍时">没有队伍时</h3>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">创建队伍</div>
    <div data-type="admonition-content">
      <p>点击“创建队伍”，输入 1 至 32 个字符的队伍名称。创建者会成为队长，并自动进入新队伍。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">申请加入</div>
    <div data-type="admonition-content">
      <p>点击“查找队伍”浏览当前队伍，选择“申请加入”。同一队伍不能重复申请；如果已经收到该队伍的邀请，列表会显示邀请状态。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">处理邀请</div>
    <div data-type="admonition-content">
      <p>点击“邀请查看”，可以接受或拒绝其他队长发来的邀请。接受后会直接加入对应队伍。</p>
    </div>
  </div>
</div>
<h3 id="队长操作" data-toc-id="队长操作">队长操作</h3>
<ul>
  <li>
    <p>
      <strong>邀请玩家：</strong>候选列表只显示在线且尚未加入任何队伍的玩家，并排除已经邀请或已经提交入队申请的玩家。搜索框支持按玩家名称或
      UUID 的部分内容筛选。</p>
  </li>
  <li>
    <p><strong>申请查看：</strong>接受或拒绝其他玩家提交的入队申请。如果申请人在处理前已经加入其他队伍，接受操作会失败并清理失效申请。
    </p>
  </li>
  <li>
    <p><strong>管理成员：</strong>右键成员列表中的其他队员，可以选择“踢出队伍”或“转让队长”。</p>
  </li>
  <li>
    <p><strong>队伍配置：</strong>设置是否允许队员互相伤害。默认关闭友伤。</p>
  </li>
  <li>
    <p><strong>解散队伍：</strong>移除整个队伍并清空该队伍当前服务器会话中的聊天记录。</p>
  </li>
</ul>
<h3 id="普通队员操作" data-toc-id="普通队员操作">普通队员操作</h3>
<p>普通队员可以使用“主动离队”。队长不能直接通过玩家界面离队，必须先将队长转让给其他成员，或者解散队伍。</p>
<h3 id="队伍聊天与保存范围" data-toc-id="队伍聊天与保存范围">队伍聊天与保存范围</h3>
<p>队伍成员可以在右侧聊天栏发送消息，单条消息最长为 256 个字符。发送后，在线队员的队伍界面会同步刷新。</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">聊天记录不会写入世界存档</div>
  <div data-type="admonition-content">
    <p>每个队伍只保留当前服务器运行期间最近的 100
      条消息；服务器重启或队伍解散后，聊天记录会消失。队伍成员、队长、友伤配置、邀请和入队申请会随世界存档持久化。</p>
  </div>
</div>
<h2 id="阵营与声望" data-toc-id="阵营与声望">阵营与声望</h2>
<h3 id="态度阈值" data-toc-id="态度阈值">态度阈值</h3>
<p>每个玩家对每个阵营都有一个声望点数。阵营使用自己的中立阈值和友好阈值，把声望转换为态度。默认值如下：</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>声望范围</th>
      <th>态度</th>
      <th>默认行为</th>
    </tr>
    <tr>
      <td>低于 50</td>
      <td>敌对</td>
      <td>阵营实体可以主动索敌，双方伤害不受友好保护</td>
    </tr>
    <tr>
      <td>50 至 99</td>
      <td>中立</td>
      <td>阵营实体不会因声望主动锁定玩家，但中立本身不提供伤害保护</td>
    </tr>
    <tr>
      <td>达到或超过 100</td>
      <td>友好</td>
      <td>玩家与阵营实体默认不能互相伤害，除非该阵营允许友伤</td>
    </tr>
  </tbody>
</table>
<h3 id="阵营-id-与实体归属" data-toc-id="阵营-id-与实体归属">阵营 ID 与实体归属</h3>
<p>阵营 ID 会去除首尾空白并转换为小写，例如 <code>Guards</code> 会保存为
  <code>guards</code>。实体阵营适合用于怪物、NPC、守卫、刷怪笼生成物和地图机制实体；实体归属按 UUID 保存。</p>
<p>设置实体阵营或玩家声望时，如果对应阵营尚不存在，底层数据会创建该阵营。为了让地图初始化过程更清晰，仍建议先显式执行阵营创建命令。</p>
<h3 id="单向敌对关系" data-toc-id="单向敌对关系">单向敌对关系</h3>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">需要双向敌对时添加两条关系</div>
  <div data-type="admonition-content">
    <p>敌对列表是单向的。<code>guards → raiders</code> 不会自动生成
      <code>raiders → guards</code>；如果双方都要主动攻击对方，必须分别添加两个方向。</p>
  </div>
</div><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction enemy add guards raiders
/viscript_team faction enemy add raiders guards</code></pre>
<h2 id="快速搭建一个阵营场景" data-toc-id="快速搭建一个阵营场景">快速搭建一个阵营场景</h2>
<div currentstep="3" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">创建阵营</div>
    <div data-type="admonition-content"><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction create guards
/viscript_team faction create raiders</code></pre>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">设置双向敌对</div>
    <div data-type="admonition-content"><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction enemy add guards raiders
/viscript_team faction enemy add raiders guards</code></pre>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">生成并分配实体</div>
    <div data-type="admonition-content">
      <pre language="plaintext" isclosed="false"><code class="language-plaintext">/summon minecraft:iron_golem ~ ~ ~ {CustomName:'{"text":"Guard"}',CustomNameVisible:1b}
/summon minecraft:zombie ~5 ~ ~ {CustomName:'{"text":"Raider"}',CustomNameVisible:1b}
/viscript_team faction entity set @e[type=minecraft:iron_golem,limit=1,sort=nearest] guards
/viscript_team faction entity set @e[type=minecraft:zombie,limit=1,sort=nearest] raiders</code></pre>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">设置玩家声望并验证</div>
    <div data-type="admonition-content"><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_team faction standing set @p guards 100
/viscript_team faction standing set @p raiders 0</code></pre>
      <p>玩家面对 <code>guards</code> 时为友好，面对 <code>raiders</code>
        时为敌对。拥有可见自定义名称的实体会分别显示绿色和红色名牌；使用标准目标系统的双方实体会按照敌对关系尝试锁定目标。</p>
    </div>
  </div>
</div>
<h2 id="管理指令参考" data-toc-id="管理指令参考">管理指令参考</h2>
<p>除打开队伍界面外，下面的阵营与队伍后台命令默认都需要权限等级 <code>2</code>，适用于开启作弊的单人世界、服务器 OP、命令方块和地图函数。
</p>
<h3 id="阵营指令" data-toc-id="阵营指令">阵营指令</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>命令</th>
      <th>作用</th>
    </tr>
    <tr>
      <td>/viscript_team faction create &lt;id&gt;</td>
      <td>创建阵营</td>
    </tr>
    <tr>
      <td>/viscript_team faction delete &lt;id&gt;</td>
      <td>删除阵营及其关联的实体归属、玩家声望和其他阵营中的敌对引用</td>
    </tr>
    <tr>
      <td>/viscript_team faction list</td>
      <td>列出全部阵营 ID</td>
    </tr>
    <tr>
      <td>/viscript_team faction info &lt;id&gt;</td>
      <td>查看阵营默认声望与敌对阵营列表</td>
    </tr>
    <tr>
      <td>/viscript_team faction enemy add &lt;faction&gt; &lt;enemy&gt;</td>
      <td>添加一条单向敌对关系</td>
    </tr>
    <tr>
      <td>/viscript_team faction enemy remove &lt;faction&gt; &lt;enemy&gt;</td>
      <td>移除一条单向敌对关系</td>
    </tr>
    <tr>
      <td>/viscript_team faction entity set &lt;targets&gt; &lt;faction&gt;</td>
      <td>批量设置实体所属阵营</td>
    </tr>
    <tr>
      <td>/viscript_team faction entity clear &lt;targets&gt;</td>
      <td>清除实体阵营归属</td>
    </tr>
    <tr>
      <td>/viscript_team faction entity get &lt;target&gt;</td>
      <td>查看单个实体所属阵营</td>
    </tr>
    <tr>
      <td>/viscript_team faction standing set &lt;targets&gt; &lt;faction&gt; &lt;points&gt;</td>
      <td>把玩家声望设置为指定数值</td>
    </tr>
    <tr>
      <td>/viscript_team faction standing add &lt;targets&gt; &lt;faction&gt; &lt;delta&gt;</td>
      <td>增加或减少玩家声望</td>
    </tr>
    <tr>
      <td>/viscript_team faction standing get &lt;target&gt; &lt;faction&gt;</td>
      <td>查看玩家声望与当前态度</td>
    </tr>
  </tbody>
</table>
<h3 id="队伍后台指令" data-toc-id="队伍后台指令">队伍后台指令</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>命令</th>
      <th>权限</th>
      <th>作用</th>
    </tr>
    <tr>
      <td>/viscript_team party</td>
      <td>0</td>
      <td>打开玩家队伍界面</td>
    </tr>
    <tr>
      <td>/viscript_team party open</td>
      <td>0</td>
      <td>打开玩家队伍界面</td>
    </tr>
    <tr>
      <td>/viscript_team party create &lt;id&gt; &lt;leader&gt;</td>
      <td>2</td>
      <td>创建指定 ID 的队伍并设置队长</td>
    </tr>
    <tr>
      <td>/viscript_team party delete &lt;id&gt;</td>
      <td>2</td>
      <td>删除指定队伍</td>
    </tr>
    <tr>
      <td>/viscript_team party list</td>
      <td>2</td>
      <td>列出全部队伍 ID</td>
    </tr>
    <tr>
      <td>/viscript_team party info &lt;id&gt;</td>
      <td>2</td>
      <td>查看队长、成员和友伤配置</td>
    </tr>
    <tr>
      <td>/viscript_team party join &lt;targets&gt; &lt;party&gt;</td>
      <td>2</td>
      <td>让玩家加入队伍；如果玩家原本属于其他队伍，会先退出原队伍</td>
    </tr>
    <tr>
      <td>/viscript_team party leave &lt;targets&gt;</td>
      <td>2</td>
      <td>强制玩家离开当前队伍；队长离开后会从剩余成员中选择新队长</td>
    </tr>
    <tr>
      <td>/viscript_team party get &lt;target&gt;</td>
      <td>2</td>
      <td>查看玩家所在队伍</td>
    </tr>
    <tr>
      <td>/viscript_team party leader set &lt;party&gt; &lt;leader&gt;</td>
      <td>2</td>
      <td>设置队长；目标玩家不在队伍中时会自动加入</td>
    </tr>
    <tr>
      <td>/viscript_team party modify &lt;party&gt; friendly_fire &lt;true|false&gt;</td>
      <td>2</td>
      <td>修改队伍友伤开关</td>
    </tr>
    <tr>
      <td>/viscript_team party standing get &lt;party&gt; &lt;faction&gt; [&lt;strategy&gt;]</td>
      <td>2</td>
      <td>按指定策略查询队伍对阵营的有效声望；省略策略时使用 min</td>
    </tr>
  </tbody>
</table>
<h2 id="队伍有效声望" data-toc-id="队伍有效声望">队伍有效声望</h2>
<p>队伍不会保存一份独立的阵营声望。需要判断关系时，模组会根据成员各自的声望动态计算。默认策略是 <code>min</code>：例如成员 A 对
  <code>guards</code> 的声望为 100，成员 B 为 -50，那么整个队伍的默认有效声望就是 -50。</p>
<p>原版或模组实体的目标选择、伤害拦截和名牌颜色使用默认的 <code>min</code> 策略。这能避免敌对玩家通过加入友好队伍绕过守卫、怪物 AI
  或副本准入。</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>策略</th>
      <th>计算方式</th>
      <th>建议用途</th>
    </tr>
    <tr>
      <td>min</td>
      <td>取成员最低声望，默认策略</td>
      <td>敌对判断、守卫仇恨、副本准入</td>
    </tr>
    <tr>
      <td>average</td>
      <td>取成员平均值并向下取整</td>
      <td>结算展示、软性评价</td>
    </tr>
    <tr>
      <td>leader</td>
      <td>只取队长声望</td>
      <td>剧情入口、任务同步入口</td>
    </tr>
    <tr>
      <td>max</td>
      <td>取成员最高声望</td>
      <td>队伍中任意一人满足即可触发的逻辑</td>
    </tr>
  </tbody>
</table>
<h2 id="战斗索敌与名牌" data-toc-id="战斗索敌与名牌">战斗、索敌与名牌</h2>
<h3 id="伤害规则" data-toc-id="伤害规则">伤害规则</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>关系</th>
      <th>伤害行为</th>
    </tr>
    <tr>
      <td>同一队伍的玩家</td>
      <td>默认不能互相伤害；队长开启队伍友伤后允许</td>
    </tr>
    <tr>
      <td>同一阵营的实体</td>
      <td>默认不能互相伤害；该阵营允许友伤后可以伤害</td>
    </tr>
    <tr>
      <td>玩家与友好阵营实体</td>
      <td>默认双向不能造成伤害；该阵营允许友伤后可以伤害</td>
    </tr>
    <tr>
      <td>中立关系</td>
      <td>不因声望主动索敌，但中立本身不提供伤害保护</td>
    </tr>
    <tr>
      <td>敌对关系</td>
      <td>允许造成伤害</td>
    </tr>
  </tbody>
</table>
<p>模组会在服务端伤害事件中进行最终检查，因此即使某些 AI 或攻击方式绕过普通目标选择，受保护的友好伤害仍会被取消。</p>
<h3 id="索敌规则" data-toc-id="索敌规则">索敌规则</h3>
<ul>
  <li>
    <p>没有阵营归属的普通实体不会额外扫描阵营目标。</p>
  </li>
  <li>
    <p>有阵营归属的 <code>Mob</code> 会尝试锁定对本阵营态度为敌对的玩家。</p>
  </li>
  <li>
    <p>阵营启用“主动攻击敌对阵营”后，其实体会尝试锁定敌对列表中阵营的实体。</p>
  </li>
  <li>
    <p>同阵营实体不会被主动锁定；无效或受保护的现有目标会被清除并停止导航。</p>
  </li>
</ul>
<h3 id="名牌颜色" data-toc-id="名牌颜色">名牌颜色</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>态度</th>
      <th>名牌颜色</th>
    </tr>
    <tr>
      <td>友好</td>
      <td>绿色</td>
    </tr>
    <tr>
      <td>中立</td>
      <td>黄色</td>
    </tr>
    <tr>
      <td>敌对</td>
      <td>红色</td>
    </tr>
  </tbody>
</table>
<p>ViScriptTeam 只修改已经准备渲染的实体名牌颜色，不会强制显示名牌。需要始终可见时，请由地图或脚本设置实体名称和
  <code>CustomNameVisible</code>，或者使用实体自身的名牌显示机制。</p>
<h2 id="配置文件" data-toc-id="配置文件">配置文件</h2>
<p>通用配置位于 <code>config/viscript_team_config.toml</code>，也可以从 NeoForge 的模组配置界面打开。
</p><pre language="toml" isclosed="false"><code class="language-toml">[faction]
defaultFactionPoints = 50
neutralFactionPoints = 50
friendlyFactionPoints = 100
defaultFactionFriendlyFire = false
defaultAttackEnemyFactions = true</code></pre>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>配置项</th>
      <th>默认值</th>
      <th>作用</th>
    </tr>
    <tr>
      <td>defaultFactionPoints</td>
      <td>50</td>
      <td>玩家对新建阵营的默认声望</td>
    </tr>
    <tr>
      <td>neutralFactionPoints</td>
      <td>50</td>
      <td>低于该值时视为敌对，达到该值后至少为中立</td>
    </tr>
    <tr>
      <td>friendlyFactionPoints</td>
      <td>100</td>
      <td>达到或超过该值时视为友好</td>
    </tr>
    <tr>
      <td>defaultFactionFriendlyFire</td>
      <td>false</td>
      <td>新建阵营是否默认允许同阵营实体和友好玩家受到友伤</td>
    </tr>
    <tr>
      <td>defaultAttackEnemyFactions</td>
      <td>true</td>
      <td>新建阵营是否默认主动扫描敌对阵营目标</td>
    </tr>
  </tbody>
</table>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">配置只提供新阵营的默认值</div>
  <div data-type="admonition-content">
    <p>已经存在的阵营会保存自己的阈值和开关。修改配置文件不会自动重写旧阵营数据。</p>
  </div>
</div>
<h2 id="kubejs-脚本接口" data-toc-id="kubejs-脚本接口">KubeJS 脚本接口</h2>
<p>安装 KubeJS 后，服务端脚本可以通过全局绑定 <code>ViScriptTeamUtil</code>
  调用命令背后的逻辑。接口不会自动向聊天栏发送命令反馈，适合任务、剧情和服务器事件。</p><pre language="javascript" isclosed="false"><code class="language-javascript">// server_scripts/viscript_team_example.js
ServerEvents.loaded(event =&gt; {
  const level = event.server.overworld()

ViScriptTeamUtil.createFaction(level, 'guards')
ViScriptTeamUtil.createFaction(level, 'raiders')
ViScriptTeamUtil.addEnemyFaction(level, 'guards', 'raiders')
ViScriptTeamUtil.addEnemyFaction(level, 'raiders', 'guards')
})

PlayerEvents.loggedIn(event =&gt; {
const player = event.player
ViScriptTeamUtil.setPlayerStanding(player, 'guards', 100)
ViScriptTeamUtil.addPlayerStanding(player, 'raiders', -25)

const partyId = ViScriptTeamUtil.getPlayerPartyId(player)
const effectiveStanding = ViScriptTeamUtil.getPlayerEffectiveStanding(player, 'guards')
})</code></pre>
<p>常用服务端方法还包括
  <code>setEntityFaction</code>、<code>clearEntityFaction</code>、<code>createParty</code>、<code>joinParty</code>、<code>leaveParty</code>、<code>isSameParty</code>、<code>canHurt</code>、<code>canTarget</code>
  和 <code>shouldActivelyTarget</code>。</p>
<h2 id="数据保存与清理" data-toc-id="数据保存与清理">数据保存与清理</h2>
<ul>
  <li>
    <p>阵营、实体归属、玩家声望、队伍成员、队长、友伤设置、邀请和入队申请保存在世界数据中，并由主世界存档统一承载，因此所有维度共享同一套数据。</p>
  </li>
  <li>
    <p>删除阵营时，会清理该阵营的实体归属、玩家声望记录，以及其他阵营中指向它的敌对关系。</p>
  </li>
  <li>
    <p>后台命令或脚本让玩家加入新队伍时，会先从原队伍移除该玩家，并清理该玩家旧的邀请和申请。</p>
  </li>
  <li>
    <p>队伍没有成员后会被移除；后台操作让队长离开时，会从剩余成员中选择新的队长。</p>
  </li>
  <li>
    <p>队伍聊天属于服务器会话内存，不会写入世界存档。</p>
  </li>
</ul>
<h2 id="常见问题" data-toc-id="常见问题">常见问题</h2>
<h3 id="为什么队伍里有一个低声望玩家后大家都被攻击" data-toc-id="为什么队伍里有一个低声望玩家后大家都被攻击">
  为什么队伍里有一个低声望玩家后，大家都被攻击？</h3>
<p>默认有效声望策略是
  <code>min</code>，会采用队伍成员中的最低声望。这是防止敌对玩家借队伍绕过阵营检查的安全规则。只有管理员命令和脚本查询可以显式选择其他策略；内置索敌、伤害和名牌判断仍使用
  <code>min</code>。</p>
<h3 id="为什么实体没有显示彩色名牌" data-toc-id="为什么实体没有显示彩色名牌">为什么实体没有显示彩色名牌？</h3>
<p>模组只为已经显示的名牌设置颜色，不负责让名牌出现。请确认实体拥有可显示名称，并按地图需求设置
  <code>CustomNameVisible</code>。</p>
<h3 id="为什么修改配置后旧阵营没有变化" data-toc-id="为什么修改配置后旧阵营没有变化">为什么修改配置后旧阵营没有变化？</h3>
<p>配置文件中的五个项目都是创建阵营时使用的默认值。旧阵营的数据已经写入存档，不会被默认配置覆盖。</p>
<h3 id="为什么队长不能主动离队" data-toc-id="为什么队长不能主动离队">为什么队长不能主动离队？</h3>
<p>玩家界面要求队长先转让队长，或者直接解散队伍，避免成员在没有明确交接的情况下失去管理者。管理员仍可使用后台命令强制处理成员关系。</p>