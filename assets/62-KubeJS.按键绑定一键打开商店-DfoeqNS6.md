<h1 id="按键绑定一键打开商店" data-toc-id="按键绑定一键打开商店">按键绑定一键打开商店</h1>
<p>本例注册一个可在“控制 → 按键绑定”中修改的“打开商店”按键，默认按 <strong>G</strong> 打开 <code>tutorial_shop</code>。客户端只发送打开请求，服务端脚本固定目标商店，适合给普通玩家提供入口。</p>
<h2 id="准备商店与脚本目录" data-toc-id="准备商店与脚本目录">准备商店与脚本目录</h2>
<p>客户端与服务端需要已安装 ViScriptShop、KubeJS 及各自所需依赖。先按<a href="?file=&quot;快速开始.创建第一个商店&quot;">创建第一个商店</a>上传一份可用商店，示例路径为 <code>tutorial_shop</code>。多人服务器需要把启动与客户端脚本分发给每位玩家，把服务端脚本放在服务器；单人游戏将三份脚本都放在同一实例。</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody><tr><th>文件</th><th>运行位置</th><th>作用</th></tr><tr><td>kubejs/startup_scripts/shop_keybind.js</td><td>玩家客户端启动时</td><td>注册按键、默认键和分组</td></tr><tr><td>kubejs/client_scripts/shop_keybind.js</td><td>玩家客户端</td><td>监听按下事件、发请求、添加名称翻译</td></tr><tr><td>kubejs/server_scripts/shop_keybind.js</td><td>服务器；单人游戏也需要</td><td>接收请求，打开服务端指定商店</td></tr></tbody></table>
<p>三份文件同名没有关系，目录必须不同。注册使用 KubeJS 原生 <code>KeyBindEvents</code>，无需额外安装按键扩展模组。当前源码核对基于 NeoForge 1.21.1 工程中的 KubeJS <code>2101.7.2-build.368</code>；如果自己的构建没有该事件组，请先核对对应构建的 API。</p>
<h2 id="第一步注册按键" data-toc-id="第一步注册按键">第一步：注册按键</h2>
<p>新建 <code>kubejs/startup_scripts/shop_keybind.js</code>：</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">// kubejs/startup_scripts/shop_keybind.js
KeyBindEvents.registry(event =&gt; {
  event.register('viscript_shop_open', 'KEY_G')
    .category('key.categories.viscript_shop')
    .inGame();
});
</code></pre>
<p><code>viscript_shop_open</code> 是本例的按键 ID，客户端监听时必须使用相同值。<code>KEY_G</code> 是这个 API 接受的 GLFW 名称；要改默认键可用 <code>KEY_H</code>、<code>KEY_J</code> 等，不要在这里填写 <code>key.keyboard.g</code>。<code>inGame()</code> 让该按键只在游戏内、没有其他界面时激活。</p>
<p>默认选择 G 是因为当前 KubeJS 自带的 Kubedex 已使用 K。其他模组仍可能使用 G，玩家应在按键绑定界面检查冲突并改键。</p>
<h2 id="第二步监听按下并发送请求" data-toc-id="第二步监听按下并发送请求">第二步：监听按下并发送请求</h2>
<p>新建 <code>kubejs/client_scripts/shop_keybind.js</code>：</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">// kubejs/client_scripts/shop_keybind.js
KeyBindEvents.pressed('viscript_shop_open', event =&gt; {
  if (event.player == null || event.client.currentScreen != null) return;
  event.player.sendData('viscript_shop:open_shop', {});
});

ClientEvents.lang('zh_cn', event =&gt; {
  event.add('kubejs', 'key.kubejs.viscript_shop_open', '打开商店');
  event.add('kubejs', 'key.categories.viscript_shop', 'ViScriptShop');
});

ClientEvents.lang('en_us', event =&gt; {
  event.add('kubejs', 'key.kubejs.viscript_shop_open', 'Open Shop');
  event.add('kubejs', 'key.categories.viscript_shop', 'ViScriptShop');
});
</code></pre>
<p><code>pressed</code> 在按下时触发，不会像 <code>tick</code> 那样在按住期间每个客户端 tick 都执行。空玩家与已有界面的检查避免在菜单或聊天时覆盖当前界面。后两段 <code>ClientEvents.lang</code> 为按键名称与分组提供中英文翻译。<code>event.add</code> 的第一个参数 <code>kubejs</code> 指定资源命名空间，使名称写入与 KubeJS 自动生成按键名称相同的位置。</p>
<p><code>viscript_shop:open_shop</code> 是本例约定的数据通道，三份脚本中实际通信的两端必须一致。<code>sendData</code> 的第二个参数传入空对象 <code>{}</code>；本例不需要客户端上传商店路径。</p>
<h2 id="第三步服务端打开指定商店" data-toc-id="第三步服务端打开指定商店">第三步：服务端打开指定商店</h2>
<p>新建 <code>kubejs/server_scripts/shop_keybind.js</code>：</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">// kubejs/server_scripts/shop_keybind.js
NetworkEvents.dataReceived('viscript_shop:open_shop', event =&gt; {
  var player = event.player;
  if (player == null) return;

  // Limit repeated requests to one every 500 milliseconds per player.
  var now = Date.now();
  var data = player.persistentData;
  var cooldownKey = 'viscript_shop_key_last_open';
  if (data.contains(cooldownKey)) {
    var last = data.getLong(cooldownKey);
    if (now &gt;= last &amp;&amp; now - last &lt; 500) return;
  }
  data.putLong(cooldownKey, now);

  // The server chooses the shop. No shop path is accepted from the client.
  var shop = 'tutorial_shop';
  if (ViScriptShopUtil.getShopInfo(shop) == null) {
    player.tell('商店尚未配置：' + shop);
    return;
  }
  ViScriptShopUtil.serverOpenShop(player, shop);
});
</code></pre>
<p>只需要把服务端脚本中的 <code>tutorial_shop</code> 换成自己的商店路径，不带 <code>.shop</code> 后缀。比如 <code>ldlib2/assets/viscript_shop/shop/events/summer.shop</code> 对应 <code>events/summer</code>。冷却按每位玩家记录，使用服务端脚本的时间，每 500 毫秒最多处理一次请求。</p>
<p>服务端使用收到请求的 <code>event.player</code> 打开界面，不接受客户端指定的玩家或商店。普通玩家不需要 OP；这里提供的是脚本中固定商店的入口。原有库存、余额、阶段和结算校验仍由 ViScriptShop 处理。</p>
<h2 id="改为打开快捷商店选择器" data-toc-id="改为打开快捷商店选择器">改为打开快捷商店选择器</h2>
<p>如果希望按键先显示商店列表，在服务端处理器中保留前面的冷却代码，将从 <code>var shop = ...</code> 开始的商店检查和打开部分替换为：</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">ViScriptShopUtil.serverOpenShopSelector(player);</code></pre>
<p>选择器只列出允许快捷打开的商店。在编辑器打开“是否允许快捷打开”，或由管理员执行 <code>/viscript_shop setQuickOpening tutorial_shop true</code>。这项开关影响选择器列表，不是直接打开指定商店的前提。</p>
<h2 id="可选直达分类和商品" data-toc-id="可选直达分类和商品">可选：直达分类和商品</h2>
<p>服务端打开接口也可以填写分类 ID 和商品 ID。例如，把最后的打开调用改为：</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">ViScriptShopUtil.serverOpenShop(player, shop, 'basic_resources', 'diamond');</code></pre>
<p>这里使用编辑器里的持久 ID，不是分类名称、物品注册 ID 或商品卡片上的数字序号。先在目标商店创建对应分类和商品，并核对 ID。</p>
<h2 id="安装后如何验证" data-toc-id="安装后如何验证">安装后如何验证</h2>
<ol><li><p>保存三份脚本，完整重启客户端。按键注册发生在启动阶段，F3+T 或 /reload 不能代替这一步。多人服务器还需要加载服务端脚本，可重启服务器或由管理员执行 /reload。</p></li><li><p>进入“选项 → 控制 → 按键绑定”，在 ViScriptShop 分组找到“打开商店”。确认默认是 G；若标红有冲突，先改为一个未占用的键。</p></li><li><p>进入世界并关闭聊天、背包等界面，按一次设置好的键。应直接看到 tutorial_shop 的商品；按住时不应持续重开界面。</p></li><li><p>关闭商店，再次按键确认可以重复打开。多人服用普通非 OP 账号验证；若改成选择器，确认快捷列表能显示预期商店。</p></li><li><p>不要把打开界面当作已购买。仍需检查购物车并点击购买，确认服务端结算符合原有配置。</p></li></ol>
<h2 id="常见问题" data-toc-id="常见问题">常见问题</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody><tr><th>现象</th><th>检查方式</th></tr><tr><td>KeyBindEvents 未定义</td><td>核对 KubeJS 构建是否提供此事件组；不要把其他版本或附属模组的事件名直接套用</td></tr><tr><td>控制设置里没有该按键</td><td>检查 startup_scripts 路径、启动日志，然后完整重启客户端</td></tr><tr><td>显示完整翻译键</td><td>确认 client_scripts 已加载；名称键必须为 key.kubejs.viscript_shop_open</td></tr><tr><td>看得到按键，但按下无反应</td><td>检查冲突、当前是否有其他界面、客户端脚本是否加载，以及服务端是否安装接收脚本</td></tr><tr><td>出现“商店尚未配置”</td><td>核对服务端商店文件与路径；文件名后缀 .shop 不写进参数</td></tr><tr><td>选择器为空</td><td>开启目标商店的快捷打开开关；指定路径打开不依赖该开关</td></tr><tr><td>改了默认键，游戏里仍是旧键</td><td>玩家已有改键保存在 options.txt；在按键设置中手动改键或重置，不必删除整份配置</td></tr></tbody></table>
<p>脚本错误可查看实例 <code>logs/kubejs/startup.log</code>、<code>logs/kubejs/client.log</code> 和服务器 <code>logs/kubejs/server.log</code>；具体文件以对应实例实际生成为准。</p>
<h2 id="接口依据与相关文档" data-toc-id="接口依据与相关文档">接口依据与相关文档</h2>
<p>注册与监听事件可核对 <a href="https://github.com/kube-mods/kubejs/blob/2101/src/main/java/dev/latvian/mods/kubejs/plugin/builtin/event/KeyBindEvents.java" target="_blank" rel="noopener noreferrer nofollow">KeyBindEvents</a>，默认键与分组可核对 <a href="https://github.com/kube-mods/kubejs/blob/2101/src/main/java/dev/latvian/mods/kubejs/client/KeybindRegistryKubeEvent.java" target="_blank" rel="noopener noreferrer nofollow">KeybindRegistryKubeEvent</a>。</p>
<p>商店服务端与客户端绑定见<a href="?file=&quot;KubeJS与开发者&quot;">KubeJS 与开发者</a>；商品详情扩展见<a href="?file=&quot;KubeJS.订单商品详情按钮&quot;">订单商品详情按钮</a>。</p>
