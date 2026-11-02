<h1 id="订单商品详情按钮" data-toc-id="订单商品详情按钮">订单商品详情按钮</h1><p>本例为商店中的两份纸张订单添加不同的路线详情。木材和矿石订单都使用 <code>minecraft:paper</code>，但通过商店里的<strong>商品 ID</strong> 区分。脚本只扩展玩家商店界面，不修改商店文件。</p><h2 id="准备分类与商品" data-toc-id="准备分类与商品">准备分类与商品</h2><p>需要安装 KubeJS，并让每位玩家客户端都有本页脚本。在编辑器创建一个通用货币分类，并配置两条可以正常显示的纸张商品：</p><table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody><tr><th>位置</th><th>示例 ID 或物品</th></tr><tr><td>订单分类 ID</td><td>delivery_orders</td></tr><tr><td>木材订单商品 ID</td><td>timber_delivery</td></tr><tr><td>矿石订单商品 ID</td><td>ore_delivery</td></tr><tr><td>两条商品的返回物品</td><td>minecraft:paper</td></tr></tbody></table><p>商品 ID 是编辑器中每条商品的持久标识，不是物品注册 ID，也不是卡片上的序号。示例按分类 ID 匹配；其他商店若使用同一分类 ID 和相同商品 ID，也会出现这些详情。</p><h2 id="安装客户端脚本" data-toc-id="安装客户端脚本">安装客户端脚本</h2><p>将以下完整脚本保存为 <code>kubejs/client_scripts/shop_order_details.js</code>，然后重启客户端。只放在服务端 <code>server_scripts</code> 里不会添加界面按钮。</p><pre language="javascript" isclosed="false"><code class="language-javascript">// Place in kubejs/client_scripts/shop_order_details.js on each player's client.
const $OrderShopButton = Java.loadClass('com.viscriptshop.gui.components.theme.ShopButton');
const $OrderShopTheme = Java.loadClass('com.viscriptshop.gui.components.theme.ShopTheme');
const $OrderDialog = Java.loadClass('com.lowdragmc.lowdraglib2.gui.ui.elements.Dialog');
const ORDER_CATEGORY_ID = 'delivery_orders';
const ORDER_DETAILS = {
  timber_delivery: {
    title: '木材运输委托',
    start: '橡木镇仓库（主世界 120, 64, -80）',
    end: '河谷港口（主世界 -340, 65, 210）',
    description: '购买后由你自己的服务端订单系统处理接单。'
  },
  ore_delivery: {
    title: '矿石运输委托',
    start: '北方矿场（主世界 260, 72, -500）',
    end: '橡木镇铁匠铺（主世界 135, 64, -65）',
    description: '查看详情不会购买商品或接取订单。'
  }
};

function showOrderDetails(shopUI, order) {
  var message = '起点：' + order.start + '\n\n'
    + '终点：' + order.end + '\n\n' + order.description;
  var dialog = $OrderDialog.showNotification(order.title, message, null);
  dialog.setId('kjs_order_details_dialog');
  dialog.overlay.getLayout().width(240).maxWidthPercent(90);
  dialog.show(shopUI.getModularUI());
}

function addOrderDetailsButton(shopUI, card, order, index, grid) {
  if (card.hasClass('kjs-order-details-added')) return;
  // Both current card layouts put the index label first. Reuse its space.
  // Do not increase list-card height: the virtual list reserves a fixed row height.
  var indexLabel = card.getChildren().getFirst();
  var button = $OrderShopButton.other($OrderShopTheme.current());
  button.setId('kjs_order_details_' + index);
  button.setText(grid ? '订单详情' : '?', false);
  button.textStyle(style =&gt; style.fontSize(grid ? 5 : 6));
  button.layout(layout =&gt; {
    layout.height(grid ? 6 : 14);
    layout.paddingAll(0);
    layout.flexShrink(0);
    if (grid) layout.widthPercent(100);
    else layout.width(10);
  });
  button.setOnClick(click =&gt; showOrderDetails(shopUI, order));
  card.removeChild(indexLabel);
  card.addChildAt(button, 0);
  card.addClass('kjs-order-details-added');
}

ViScriptShopEvents.tick(event =&gt; {
  var shopUI = event.shopUI;
  var category = shopUI.getSelectedCategory();
  if (category == null || String(category.getId()) !== ORDER_CATEGORY_ID) return;
  var merchants = category.getMerchants();
  // Snapshot only the currently materialized cards before changing the tree.
  var cards = shopUI.selectRegex('^shop_merchant_(list|grid)_[0-9]+$').toList();
  for (var position = 0; position &lt; cards.size(); position++) {
    var card = cards.get(position);
    var cardId = String(card.getId());
    var grid = cardId.indexOf('shop_merchant_grid_') === 0;
    var prefix = grid ? 'shop_merchant_grid_' : 'shop_merchant_list_';
    if (cardId.indexOf(prefix) !== 0) continue;
    var suffix = cardId.substring(prefix.length);
    if (!/^[0-9]+$/.test(suffix)) continue;
    var index = parseInt(suffix, 10);
    if (index &gt;= merchants.size()) continue;
    var order = ORDER_DETAILS[String(merchants.get(index).getId())];
    if (order != null) addOrderDetailsButton(shopUI, card, order, index, grid);
  }
});
</code></pre><h2 id="修改订单内容" data-toc-id="修改订单内容">修改订单内容</h2><p>把 <code>ORDER_CATEGORY_ID</code> 改为自己的分类 ID；把 <code>ORDER_DETAILS</code> 的键名改为对应商品 ID。每条数据的 <code>title</code> 为标题，<code>start</code> 为起点，<code>end</code> 为终点，<code>description</code> 为说明。这些坐标与路线都是随客户端脚本提供的固定展示文字。</p><p>增加订单时，在表中追加同样的数据结构，并给商店商品设置相同 ID。需要动态订单时，应由服务端同步真实信息；不要把固定展示文本当作服务端业务状态。</p><h2 id="适应当前商品列表" data-toc-id="适应当前商品列表">适应当前商品列表</h2><p>当前商品列表按可见范围创建卡片，滚动、搜索、切换分类或布局时会销毁并重建卡片。因此脚本在 <code>ViScriptShopEvents.tick</code> 中寻找当前存在的卡片，用 <code>kjs-order-details-added</code> 防止重复添加。卡片索引仍是分类内从 0 开始的原始位置，业务匹配始终使用商品 ID。</p><p>为兼容虚拟列表的固定行高，本例用卡片首个序号标签的空间放按钮：列表显示 <code>?</code>，网格显示“订单详情”。它会替换示例订单卡片上的数字序号，不增加卡片高度，也不覆盖数量控件。依赖的卡片 ID 与子元素顺序属于当前界面实现，升级后应复核。</p><h2 id="验证效果" data-toc-id="验证效果">验证效果</h2><ol><li><p>打开订单商店，确认只有匹配分类与商品 ID 的订单显示按钮。</p></li><li><p>分别点击两份订单，核对木材与矿石订单显示不同起点、终点。</p></li><li><p>关闭弹窗，切换列表与网格，再搜索、切换分类或滚动回来，确认按钮没有重复且数量控件仍可使用。</p></li><li><p>只查看详情时，购买份数、余额和背包应保持不变。接单、扣费和发放奖励应继续由自己的服务端订单系统校验。</p></li></ol>
<figure data-type="local-video" data-width="960" style="width: 960px; max-width: 100%;"><video src="/md/media/viscriptshop-order-details-zh.mp4" poster="/md/media/viscriptshop-order-details-zh.png" controls playsinline preload="metadata"><a href="/md/media/viscriptshop-order-details-zh.mp4">打开视频</a></video><figcaption>真实脚本演示：两份订单详情与列表／网格切换（约 22 秒，中文字幕）</figcaption></figure><p>按钮不出现时，先检查 <code>kubejs/logs/client.log</code> 中的脚本错误，再核对分类 ID、商品 ID 和脚本位置。详情点击回调不会购买商品或接取订单。基础事件与两端绑定见<a href="?file=&quot;KubeJS与开发者&quot;">KubeJS 与开发者</a>。</p>
