<h1 id="世界工具" data-toc-id="世界工具">世界工具</h1>
<p>环境、后处理和音响用于布置玩家看到与听到的地图场景；图片地图画将图片转换为原版地图物品。环境与后处理默认作用于执行玩家，音响按实体或当前维度内的坐标定位。</p>
<h2 id="天空与太阳月亮" data-toc-id="天空与太阳月亮">天空与太阳月亮</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/ml:world sky 304060
/ml:world sun minecraft:textures/environment/sun.png
/ml:world moon minecraft:textures/environment/moon_phases.png
/ml:world sky clear
/ml:world sun clear
/ml:world moon clear
/ml:world clear</code></pre>
<p><code>sky</code> 接受 RGB 十六进制颜色，可带 <code>#</code>，雾色会跟随天空色。<code>sun</code> 和 <code>moon</code> 接受资源贴图位置；例如 <code>demo:textures/environment/sun.png</code> 对应客户端资源包中的 <code>assets/demo/textures/environment/sun.png</code>。修改只针对目标玩家的视觉环境，不改变世界时间。<code>world clear</code> 一次清除这三项自定义设置。</p>
<h2 id="动态后处理" data-toc-id="动态后处理">动态后处理</h2>
<p>语法为 <code>ml:shader &lt;后处理JSON资源位置&gt;</code>，解除使用 <code>ml:shader clear</code>。资源需要已存在于客户端，例如资源包文件 <code>assets/demo/shaders/post/scene.json</code> 对应 <code>demo:shaders/post/scene.json</code>。先准备有效的后处理配置再运行下面的加载示例：</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/ml:shader demo:shaders/post/scene.json
/ml:shader clear</code></pre>
<p>这里加载的是 Minecraft 后处理配置，不是 Iris 光影包。资源不存在或配置无效时，先检查客户端日志与资源包路径。</p>
<h2 id="实体音响与坐标音响" data-toc-id="实体音响与坐标音响">实体音响与坐标音响</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/ml:sound play minecraft:music_disc.cat record 16 true bind @s
/ml:sound stop bind @s
/ml:sound play minecraft:music_disc.cat record 16 true at 100 64 100 0.8 1
/ml:sound stop at 100 64 100</code></pre>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>语法</th><th>说明</th></tr>
    <tr><td>ml:sound play &lt;sound&gt; &lt;category&gt; &lt;radius&gt; &lt;loop&gt; bind &lt;entities&gt; [volume] [pitch]</td><td>声音跟随实体移动</td></tr>
    <tr><td>ml:sound play &lt;sound&gt; &lt;category&gt; &lt;radius&gt; &lt;loop&gt; at &lt;x y z&gt; [volume] [pitch]</td><td>固定坐标音响</td></tr>
    <tr><td>ml:sound stop bind &lt;entities&gt;</td><td>停止指定实体音响</td></tr>
    <tr><td>ml:sound stop at &lt;x y z&gt;</td><td>停止指定坐标音响</td></tr>
  </tbody>
</table>
<p><code>radius</code> 为传播半径，超出范围静音，回到范围可继续听；<code>loop</code> 为是否循环。音量与音高省略时均为 1，可分别填写，数值不小于 0。<code>category</code> 使用 <code>master</code>、<code>music</code>、<code>record</code>、<code>weather</code>、<code>block</code>、<code>hostile</code>、<code>neutral</code>、<code>player</code>、<code>ambient</code> 或 <code>voice</code>。</p>
<p>坐标音响的停止位置必须与开始位置一致；移动玩家后再用 <code>~ ~ ~</code> 停止，会指向新的坐标。客户端需要拥有对应声音资源，并在声音设置中开启所选分类。</p>
<h2 id="从图片生成地图画" data-toc-id="从图片生成地图画">从图片生成地图画</h2>
<p>将一张真实图片放到服务端工作目录的 <code>config/maplib/art.png</code>，再由有权限的玩家执行：</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/ml:map_generator &quot;config/maplib/art.png&quot; 2 1 color
/ml:map_generator &quot;config/maplib/art.png&quot; 1 1 bw</code></pre>
<p>语法为 <code>ml:map_generator &lt;图片路径或URL&gt; &lt;横向地图数&gt; &lt;纵向地图数&gt; &lt;color|bw&gt;</code>。宽、高各为 1～16，单位是地图张数，每张为 128×128 像素；例如 2×1 会把图片缩放到 256×128 并发放两张地图。<code>color</code> 使用地图色板并抖动，<code>bw</code> 转换为灰度。</p>
<p>也可使用服务器能够直接访问的 HTTP/HTTPS 图片地址，并用双引号包住整个地址。路径在服务端读取，不会读取远程玩家电脑上的文件；仅装在客户端资源包里的图片不能作为服务器本地文件读取。</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">生成时机</div>
  <div data-type="admonition-content"><p>当前图片读取与生成在服务端执行，网络等待和较大拼图会占用服务器处理时间。制作阶段先用本地图片和小尺寸确认结果，再生成完整地图画。</p></div>
</div>
