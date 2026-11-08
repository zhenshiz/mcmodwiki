<h1 id="kubejs-接入" data-toc-id="kubejs-接入">KubeJS 接入</h1>
<p>LDLib2 将 <code>com.map_lib.util.MapLibServerUtil</code> 注册为全局 <code>MapLibUtil</code>。安装 KubeJS 后可在服务端脚本中直接调用；API 接受真实 Java 对象，使用枚举、资源位置和坐标时应传入对应类型。</p>
<h2 id="可直接使用的导航示例" data-toc-id="可直接使用的导航示例">可直接使用的导航示例</h2>
<p>新建 <code>kubejs/server_scripts/maplib_guide.js</code>，填入下列内容并将目标坐标改为地图中可站立的位置。执行 <code>/reload</code> 后，主手持指南针对空气右键，向当前位置到目标位置请求导航。</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">const MaplibBlockPos = Java.loadClass(&#x27;net.minecraft.core.BlockPos&#x27;)

ItemEvents.rightClicked(&#x27;minecraft:compass&#x27;, event =&gt; {
  if (String(event.hand) !== &#x27;MAIN_HAND&#x27;) return
  const player = event.player
  MapLibUtil.startPathfinding(player, player, new MaplibBlockPos(100, 64, 100))
})</code></pre>
<p>脚本位于服务端目录，因此回调中的玩家为服务端玩家。<code>startPathfinding</code> 返回 <code>true</code> 仅表示请求已发送；客户端稍后才会计算出完整路线、部分路线或失败状态。需要清理时调用 <code>MapLibUtil.clearPathfinding(player)</code>。</p>
<p>脚本目录和事件使用方式可参见 <a href="https://kubejs.com/wiki/folder-structure/server-scripts" target="_blank" rel="noopener noreferrer nofollow">KubeJS 服务端脚本说明</a> 与 <a href="https://kubejs.com/wiki/tutorials/item-interactions" target="_blank" rel="noopener noreferrer nofollow">物品交互事件说明</a>。</p>
<h2 id="过场与音响调用示例" data-toc-id="过场与音响调用示例">过场与音响调用示例</h2>
<p>下面的函数可放入同一个服务端脚本，并在已有剧情事件回调中传入 <code>event.player</code> 调用。先按地图需要修改目标坐标与声音资源。</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">const MaplibVec3 = Java.loadClass(&#x27;net.minecraft.world.phys.Vec3&#x27;)
const MaplibResourceLocation = Java.loadClass(&#x27;net.minecraft.resources.ResourceLocation&#x27;)
const MaplibSoundSource = Java.loadClass(&#x27;net.minecraft.sounds.SoundSource&#x27;)
const MaplibShakeDecay = Java.loadClass(&#x27;com.map_lib.command.CameraCommand$ShakeDecay&#x27;)

function maplibPlayScene(player) {
  MapLibUtil.cameraShake(player, 0.5, 40, MaplibShakeDecay.LINEAR)
  MapLibUtil.blinkTeleport(player, 10, 20, 10, new MaplibVec3(100, 64, 200))
  MapLibUtil.startEntitySpeaker(
    player,
    MaplibResourceLocation.parse(&#x27;minecraft:music_disc.cat&#x27;),
    MaplibSoundSource.RECORDS,
    16, true, 1.0, 1.0
  )
}

function maplibEndScene(player) {
  MapLibUtil.clearScreenAnimation(player)
  MapLibUtil.stopEntitySpeaker(player)
}</code></pre>
<p><code>startEntitySpeaker</code> 的音量与音高是必传参数；指令中省略这两项的写法不等于 Java API 存在短参数重载。音响类别的 Java 枚举为 <code>SoundSource.RECORDS</code>，对应指令的 <code>record</code>。</p>
<h2 id="玩家与输入-api" data-toc-id="玩家与输入-api">玩家与输入 API</h2>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>方法与参数</th><th>说明</th></tr>
    <tr><td>setPlayerName(player, name) / resetPlayerName(player)</td><td>设置或重置显示名</td></tr>
    <tr><td>setPlayerSkin(player, skin) / resetPlayerSkin(player)</td><td>设置或重置皮肤，skin 为玩家名或资源位置字符串</td></tr>
    <tr><td>setPlayerCape(player, cape) / resetPlayerCape(player)</td><td>设置或重置披风，cape 为字符串</td></tr>
    <tr><td>setPlayerPose(player, pose) / resetPlayerPose(player)</td><td>pose 为 net.minecraft.world.entity.Pose 枚举</td></tr>
    <tr><td>glowEntity(players, entities, glowing, color) / resetGlowEntity(players)</td><td>players、entities 为 Java Collection；color 为 RGB 整数</td></tr>
    <tr><td>setInputLock(player, permission, locked)</td><td>permission 为 InputCommand.InputPermission 枚举</td></tr>
    <tr><td>simulateInput(player, action, ticks)</td><td>action 为 InputCommand.InputAction 枚举</td></tr>
    <tr><td>setHudHidden(player, type, hidden)</td><td>type 为 HudCommand.HudType 枚举</td></tr>
  </tbody>
</table>
<p>输入枚举的完整类名分别是 <code>com.map_lib.command.InputCommand$InputPermission</code>、<code>com.map_lib.command.InputCommand$InputAction</code> 和 <code>com.map_lib.command.HudCommand$HudType</code>。用 <code>Java.loadClass</code> 取得类，再传入大写枚举常量。可用值见 <a href="?file=&quot;剧情控制.玩家与输入&quot;">玩家与输入</a>。</p>
<h2 id="镜头与环境-api" data-toc-id="镜头与环境-api">镜头与环境 API</h2>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>方法与参数</th><th>说明</th></tr>
    <tr><td>cameraShake(player, amplitude, ticks, decay)</td><td>decay 为 CameraCommand.ShakeDecay 枚举</td></tr>
    <tr><td>cameraShakeInRadius(level, center, radius, amplitude, ticks, decay)</td><td>level 为 ServerLevel，center 为 Vec3</td></tr>
    <tr><td>setPossessedEntity(player, entity) / clearPossessedEntity(player)</td><td>相机附身与恢复</td></tr>
    <tr><td>setSunTexture(player, texture) / resetSunTexture(player)</td><td>texture 为 ResourceLocation</td></tr>
    <tr><td>setMoonTexture(player, texture) / resetMoonTexture(player)</td><td>texture 为 ResourceLocation</td></tr>
    <tr><td>setSkyColor(player, color) / resetSkyColor(player)</td><td>color 为 RGB 整数</td></tr>
    <tr><td>resetWorldEnv(player)</td><td>清除太阳、月亮与天空自定义环境</td></tr>
    <tr><td>setShader(player, shader) / clearShader(player)</td><td>shader 为后处理 JSON 的 ResourceLocation</td></tr>
  </tbody>
</table>
<h2 id="过场与音响-api" data-toc-id="过场与音响-api">过场与音响 API</h2>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>方法与参数</th><th>说明</th></tr>
    <tr><td>blinkScreen(player, closeTicks, holdTicks, openTicks)</td><td>普通眨眼</td></tr>
    <tr><td>blinkTeleport(player, closeTicks, holdTicks, openTicks, destination)</td><td>遮蔽后同维度传送；destination 为 Vec3</td></tr>
    <tr><td>warpScreen(player, distortTicks, holdTicks, restoreTicks)</td><td>普通环境扭曲</td></tr>
    <tr><td>warpTeleport(player, distortTicks, holdTicks, restoreTicks, destination)</td><td>环境扭曲后同维度传送</td></tr>
    <tr><td>transitionScreen(player, effect, enterTicks, holdTicks, exitTicks)</td><td>通用过场入口</td></tr>
    <tr><td>transitionTeleport(player, effect, enterTicks, holdTicks, exitTicks, destination)</td><td>通用过场传送入口</td></tr>
    <tr><td>clearScreenAnimation(player)</td><td>清理过场并取消尚未发生的传送</td></tr>
    <tr><td>startEntitySpeaker(entity, sound, source, radius, loop, volume, pitch)</td><td>实体音响：sound 为 ResourceLocation，source 为 SoundSource</td></tr>
    <tr><td>startPosSpeaker(level, pos, sound, source, radius, loop, volume, pitch)</td><td>坐标音响：level 为 ServerLevel，pos 为 Vec3</td></tr>
    <tr><td>stopEntitySpeaker(entity) / stopPosSpeaker(level, pos)</td><td>停止音响</td></tr>
  </tbody>
</table>
<p>通用过场的 <code>effect</code> 为 <code>com.map_lib.util.command.screen.TransitionEffect</code> 中的 <code>BLINK</code> 或 <code>WARP</code>。时间单位为 tick。</p>
<h2 id="寻路-api" data-toc-id="寻路-api">寻路 API</h2>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>方法与参数</th><th>说明</th></tr>
    <tr><td>startPathfinding(observer, BlockPos start, BlockPos end)</td><td>两个固定端点</td></tr>
    <tr><td>startPathfinding(observer, Entity start, BlockPos end)</td><td>动态实体起点</td></tr>
    <tr><td>startPathfinding(observer, BlockPos start, Entity end)</td><td>动态实体终点</td></tr>
    <tr><td>startPathfinding(observer, Entity start, Entity end)</td><td>两个动态端点</td></tr>
    <tr><td>clearPathfinding(observer)</td><td>清除观察玩家的手动导航路线</td></tr>
  </tbody>
</table>
<p><code>observer</code> 是接收路线的 <code>ServerPlayer</code>。坐标端点使用 <code>BlockPos</code>，过场传送使用 <code>Vec3</code>，两者不要混用。观察者与端点须在同一维度，两端距离不超过 4096 格；详细行为见 <a href="?file=&quot;路线导航&quot;">路线导航</a>。</p>
<h2 id="常见问题" data-toc-id="常见问题">常见问题</h2>
<h3 id="提示-maplibutil-未定义" data-toc-id="提示-maplibutil-未定义">提示 MapLibUtil 未定义</h3>
<p>确认服务端已加载 MapLib、LDLib2 和 KubeJS，脚本放在 <code>kubejs/server_scripts</code>；检查 KubeJS 日志是否有更早发生的脚本加载错误。</p>
<h3 id="提示找不到匹配方法" data-toc-id="提示找不到匹配方法">提示找不到匹配方法</h3>
<p>检查参数数量、Java 类型及枚举。特别是音响必须传完整的音量与音高，寻路坐标是 <code>BlockPos</code>，Java 枚举使用对应类的常量。计划任务、地图画与语音指令不属于 <code>MapLibUtil</code> 的同名方法；可在服务端流程中执行这些指令。</p>
