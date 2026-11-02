<h1 id="open-a-shop-with-a-keybind" data-toc-id="open-a-shop-with-a-keybind">Open a Shop with a Keybind</h1>
<p>Register an Open Shop key that players can rebind in Controls → Key Binds. Its default is <strong>G</strong>, opening <code>tutorial_shop</code>. The client sends a request and the server chooses the target shop, providing an entry point for regular players.</p>
<h2 id="prepare-the-shop-and-script-folders" data-toc-id="prepare-the-shop-and-script-folders">Prepare the Shop and Script Folders</h2>
<p>Install ViScriptShop, KubeJS, and their required dependencies on the relevant sides. Upload a working shop following <a href="?file=&quot;Quick-Start.Your-First-Shop&quot;">Your First Shop</a>; this example uses <code>tutorial_shop</code>. Distribute startup/client scripts to each player and install the server script on the server. Single-player needs all three files in the same instance.</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody><tr><th>File</th><th>Runs on</th><th>Purpose</th></tr><tr><td>kubejs/startup_scripts/shop_keybind.js</td><td>Player client at startup</td><td>Register the key, default binding, and category</td></tr><tr><td>kubejs/client_scripts/shop_keybind.js</td><td>Player client</td><td>Handle presses, send requests, and add translations</td></tr><tr><td>kubejs/server_scripts/shop_keybind.js</td><td>Server, including integrated single-player</td><td>Receive requests and open the chosen shop</td></tr></tbody></table>
<p>The matching filenames are intentional; their folders differ. This uses native <code>KeyBindEvents</code>, without a keybind addon. The source check used KubeJS <code>2101.7.2-build.368</code> in the NeoForge 1.21.1 project. If your build does not expose this event group, check its own API before adapting the example.</p>
<h2 id="step-1-register-the-key" data-toc-id="step-1-register-the-key">Step 1: Register the Key</h2>
<p>Create <code>kubejs/startup_scripts/shop_keybind.js</code>:</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">// kubejs/startup_scripts/shop_keybind.js
KeyBindEvents.registry(event =&gt; {
  event.register('viscript_shop_open', 'KEY_G')
    .category('key.categories.viscript_shop')
    .inGame();
});
</code></pre>
<p><code>viscript_shop_open</code> is the key ID; the client listener must use the same value. This API accepts GLFW names such as <code>KEY_G</code>, <code>KEY_H</code>, or <code>KEY_J</code>, rather than <code>key.keyboard.g</code>. <code>inGame()</code> limits activation to gameplay without another screen.</p>
<p>The example chooses G because the current KubeJS Kubedex already uses K. Other mods may still use G; check conflicts and rebind it in Controls.</p>
<h2 id="step-2-handle-the-press-and-send-a-request" data-toc-id="step-2-handle-the-press-and-send-a-request">Step 2: Handle the Press and Send a Request</h2>
<p>Create <code>kubejs/client_scripts/shop_keybind.js</code>:</p>
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
<p><code>pressed</code> runs on a press rather than every client tick while held. The player and screen checks prevent opening over a menu or chat. The two <code>ClientEvents.lang</code> listeners supply Chinese and English labels. The first <code>event.add</code> argument, <code>kubejs</code>, writes to the same resource namespace as the generated key names.</p>
<p><code>viscript_shop:open_shop</code> is the example request channel; the sending and receiving scripts must match. Pass an empty object <code>{}</code> as the second argument to <code>sendData</code>. No shop path is sent by the client.</p>
<h2 id="step-3-open-the-shop-on-the-server" data-toc-id="step-3-open-the-shop-on-the-server">Step 3: Open the Shop on the Server</h2>
<p>Create <code>kubejs/server_scripts/shop_keybind.js</code>:</p>
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
<p>Replace <code>tutorial_shop</code> in the server script with your shop path, without the <code>.shop</code> suffix. For example, <code>ldlib2/assets/viscript_shop/shop/events/summer.shop</code> uses <code>events/summer</code>. The per-player cooldown uses the server script clock and handles at most one request every 500 milliseconds. The example missing-shop message is Chinese; translate it for your pack.</p>
<p>The server opens the screen for the requesting <code>event.player</code>; it accepts no client-selected player or shop. Regular players do not need OP for this fixed entry point. ViScriptShop still validates stock, money, phases, and purchases normally.</p>
<h2 id="open-the-quick-shop-selector-instead" data-toc-id="open-the-quick-shop-selector-instead">Open the Quick Shop Selector Instead</h2>
<p>Keep the cooldown logic, but replace the section starting with <code>var shop = ...</code>, including its validation and open call, with:</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">ViScriptShopUtil.serverOpenShopSelector(player);</code></pre>
<p>The selector lists only shops allowing quick opening. Enable it in the editor or have an administrator run <code>/viscript_shop setQuickOpening tutorial_shop true</code>. This controls selector visibility; opening a fixed shop path does not require it.</p>
<h2 id="optional-jump-to-a-category-and-offer" data-toc-id="optional-jump-to-a-category-and-offer">Optional: Jump to a Category and Offer</h2>
<p>The server open call also accepts persistent category and offer IDs:</p>
<pre language="javascript" isclosed="false"><code class="language-javascript">ViScriptShopUtil.serverOpenShop(player, shop, 'basic_resources', 'diamond');</code></pre>
<p>Use the IDs from the editor, rather than category names, registered item IDs, or numeric card indices. Create the corresponding entries in your target shop and check their IDs first.</p>
<h2 id="verify-the-setup" data-toc-id="verify-the-setup">Verify the Setup</h2>
<ol><li><p>Save the three scripts and fully restart the client. Key registration happens at startup; F3+T or /reload cannot replace this step. On multiplayer, also load the server script by restarting the server or running /reload as an administrator.</p></li><li><p>Open Options → Controls → Key Binds and find Open Shop in the ViScriptShop category. Check its default G binding and resolve any conflict by rebinding it.</p></li><li><p>Enter a world and close chat/inventory screens. Press the configured key once; tutorial_shop should open. Holding it must not continuously reopen the screen.</p></li><li><p>Close the shop and press again. On multiplayer, verify with a regular non-OP account. If using the selector variant, check its expected shop entries.</p></li><li><p>Opening the UI does not buy anything. Review the cart and press Buy to perform a normal server-validated purchase.</p></li></ol>
<h2 id="troubleshooting" data-toc-id="troubleshooting">Troubleshooting</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody><tr><th>Symptom</th><th>Check</th></tr><tr><td>KeyBindEvents is undefined</td><td>Check whether your KubeJS build provides this group; event names from other versions or addons are not interchangeable</td></tr><tr><td>Key is missing from Controls</td><td>Check startup_scripts and startup logs, then fully restart the client</td></tr><tr><td>A translation key is shown</td><td>Load the client script; the name key must be key.kubejs.viscript_shop_open</td></tr><tr><td>Key exists but does nothing</td><td>Check conflicts, open screens, the client listener, and the server receiving script</td></tr><tr><td>Missing-shop message</td><td>Check the server shop file and path; omit the .shop suffix</td></tr><tr><td>Selector is empty</td><td>Enable quick opening on the target shops; direct path opening does not require it</td></tr><tr><td>Changing the script default does not change an existing binding</td><td>Existing player bindings are saved in options.txt; change or reset the key in Controls without deleting the entire file</td></tr></tbody></table>
<p>Check the instance <code>logs/kubejs/startup.log</code>, <code>logs/kubejs/client.log</code>, and server <code>logs/kubejs/server.log</code> for script errors; use the actual logs generated by your build.</p>
<h2 id="api-sources-and-related-pages" data-toc-id="api-sources-and-related-pages">API Sources and Related Pages</h2>
<p>Check registration and listener APIs in <a href="https://github.com/kube-mods/kubejs/blob/2101/src/main/java/dev/latvian/mods/kubejs/plugin/builtin/event/KeyBindEvents.java" target="_blank" rel="noopener noreferrer nofollow">KeyBindEvents</a> and default keys/categories in <a href="https://github.com/kube-mods/kubejs/blob/2101/src/main/java/dev/latvian/mods/kubejs/client/KeybindRegistryKubeEvent.java" target="_blank" rel="noopener noreferrer nofollow">KeybindRegistryKubeEvent</a>.</p>
<p>For side-specific bindings, see <a href="?file=&quot;KubeJS-and-Developers&quot;">KubeJS and Developers</a>; for custom offer UI, see <a href="?file=&quot;KubeJS.Order-Details-Buttons&quot;">Order Details Buttons</a>.</p>
