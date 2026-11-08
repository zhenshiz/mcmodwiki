<h1 id="maplib-地图制作工具" data-toc-id="maplib-地图制作工具">MapLib 地图制作工具</h1>
<p>MapLib 将地图中常用的操作封装成指令和 KubeJS API：在世界内编辑展示实体与交互判定，控制玩家外观、输入和镜头，安排过场与延时任务，并为玩家显示路线导航。模组 ID 为 <code>map_lib</code>，指令前缀为 <code>ml:</code>。</p>
<h2 id="下载与安装" data-toc-id="下载与安装">下载与安装</h2>
<p>在<a href="/resources">资源工坊</a>中搜索 <strong>MapLib</strong>，下载与实例 Minecraft 版本和加载器对应的 JAR。当前提供的构件为 Minecraft 1.21.1 / NeoForge，文件名为 <code>MapLib-neoforge-1.21.1-1.0.2.jar</code>。</p>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>组件</th><th>是否必需</th><th>安装说明</th></tr>
    <tr><td>MapLib</td><td>必需</td><td>客户端与服务端均安装，放入各自实例的 mods 目录</td></tr>
    <tr><td>LDLib2 2.2.41+</td><td>必需</td><td>客户端与服务端均安装，提供注册、网络同步与编辑界面</td></tr>
    <tr><td>Baritone 1.11.3</td><td>已内嵌</td><td>使用 JAR 内的版本计算路线，无需单独下载</td></tr>
    <tr><td>KubeJS</td><td>脚本接入时需要</td><td>使用匹配游戏和加载器的版本，并安装其所需依赖；只用 MapLib 指令和实体编辑器可不装</td></tr>
    <tr><td>Simple Voice Chat</td><td>可选</td><td>语音频道与强制禁言需要；使用支持 API 2.6.0+ 的版本并完成语音服务器配置</td></tr>
    <tr><td>ViScriptQuests 1.0.4beta+</td><td>可选</td><td>为位置任务增加 MapLib 寻路线选项</td></tr>
  </tbody>
</table>
<p>客户端需要 OpenGL 3.2 或更高。下载 LDLib2 可从资源详情中的前置按钮进入；脚本和语音联动的下载入口也在同一弹窗中。</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">内嵌寻路器的使用方式</div>
  <div data-type="admonition-content"><p>MapLib 使用 Baritone 的路线计算能力显示导引线。此集成会关闭该实例中 Baritone 的自动行为入口；不要将同一实例同时用于独立 Baritone 自动挖矿或自动建造。</p></div>
</div>
<h2 id="第一次使用" data-toc-id="第一次使用">第一次使用</h2>
<ul>
  <li><p>启动游戏，在模组列表确认 MapLib 和 LDLib2 已加载。多人游戏也要确认服务端安装成功。</p></li>
  <li><p>进入允许指令的世界，用下面的示例测试 HUD；第二条指令恢复准星。</p></li>
  <li><p>切换创造模式，按 <a href="?file=&quot;实体编辑器&quot;">实体编辑器</a> 中的召唤示例放置一个展示实体，再瞄准中心标记操作。</p></li>
</ul>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/ml:hud crosshair true
/ml:hud crosshair false</code></pre>
<h2 id="指令权限与执行目标" data-toc-id="指令权限与执行目标">指令权限与执行目标</h2>
<p>MapLib 指令需要权限等级 2。聊天栏示例以 <code>/</code> 开头；写入命令方块或数据包 <code>.mcfunction</code> 时去掉开头的斜杠。时间若标为 tick，通常 <code>20 tick = 1 秒</code>。</p>
<p><code>ml:player</code>、<code>ml:pose</code>、<code>ml:input</code>、<code>ml:camera</code>、<code>ml:hud</code>、<code>ml:world</code> 和 <code>ml:shader</code> 作用于执行指令的玩家。在命令方块中先用 <code>execute as</code> 指定玩家；用到相对坐标时再加 <code>at @s</code>。带有玩家选择器的过场、发光和语音指令按其选择器确定目标。</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/execute as @a at @s run ml:hud crosshair true
/execute as @a at @s run ml:hud crosshair false</code></pre>
<h2 id="阅读路线" data-toc-id="阅读路线">阅读路线</h2>
<ul>
  <li><p><a href="?file=&quot;实体编辑器&quot;">实体编辑器</a>：选择、移动、旋转、交互框尺寸与参数窗口。</p></li>
  <li><p><a href="?file=&quot;剧情控制.玩家与输入&quot;">玩家与输入</a>：外观、姿势、按键锁定、HUD、发光和多段跳。</p></li>
  <li><p><a href="?file=&quot;剧情控制.镜头与过场&quot;">镜头与过场</a>：震动、附身、眨眼、扭曲和遮蔽传送。</p></li>
  <li><p><a href="?file=&quot;世界工具&quot;">世界工具</a>：天空环境、后处理、实体音响与图片地图画。</p></li>
  <li><p><a href="?file=&quot;计划任务&quot;">计划任务</a>：延时、循环、执行上下文和嵌套命令块。</p></li>
  <li><p><a href="?file=&quot;路线导航&quot;">路线导航</a>：固定目标、跟随实体和 ViScriptQuests 联动。</p></li>
  <li><p><a href="?file=&quot;语音频道&quot;">语音频道</a>：创建频道、分组与服务端强制禁言。</p></li>
  <li><p><a href="?file=&quot;KubeJS接入&quot;">KubeJS 接入</a>：全局绑定、完整调用示例与 API 参数索引。</p></li>
</ul>
<h2 id="许可证" data-toc-id="许可证">许可证</h2>
<p>MapLib 使用 MIT 许可证。JAR 内嵌的 Baritone 独立使用 LGPL-3.0-or-later，声明和许可文本保留在 <code>META-INF/licenses/baritone/</code> 中；其对应源码与替换方式见同目录的 <code>NOTICE.txt</code>。</p>
