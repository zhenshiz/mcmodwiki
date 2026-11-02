<h1 id="order-details-buttons" data-toc-id="order-details-buttons">Order Details Buttons</h1><p>This example adds distinct route details to two paper offers. Both offers use <code>minecraft:paper</code>, but the script identifies them by the shop <strong>offer ID</strong>. It extends the player shop screen without changing the shop file.</p><h2 id="prepare-the-category-and-offers" data-toc-id="prepare-the-category-and-offers">Prepare the Category and Offers</h2><p>Install KubeJS and distribute this client script to every player. Create a currency category with two valid paper offers:</p><table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;"><tbody><tr><th>Entry</th><th>Example ID or item</th></tr><tr><td>Category ID</td><td>delivery_orders</td></tr><tr><td>Timber offer ID</td><td>timber_delivery</td></tr><tr><td>Ore offer ID</td><td>ore_delivery</td></tr><tr><td>Result item for both offers</td><td>minecraft:paper</td></tr></tbody></table><p>Offer IDs are persistent editor identifiers, not registered item IDs or card numbers. Matching uses the category ID; other shops with the same category and offer IDs will also show these details.</p><h2 id="install-the-client-script" data-toc-id="install-the-client-script">Install the Client Script</h2><p>Save the following complete script to <code>kubejs/client_scripts/shop_order_details.js</code> and restart the client. Installing it only in server_scripts cannot add client UI. The sample text is Chinese; replace the order fields and labels with your own text.</p><pre language="javascript" isclosed="false"><code class="language-javascript">// Place in kubejs/client_scripts/shop_order_details.js on each player's client.
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
</code></pre><h2 id="customize-the-orders" data-toc-id="customize-the-orders">Customize the Orders</h2><p>Set <code>ORDER_CATEGORY_ID</code> to your category ID and the <code>ORDER_DETAILS</code> keys to the corresponding offer IDs. Each order has a <code>title</code>, <code>start</code>, <code>end</code>, and <code>description</code>. Coordinates and routes are fixed display text shipped with the client script. Add further entries using the same structure and matching offer IDs.</p><p>Dynamic orders need real state synchronized from the server. Fixed display text is not authoritative order state.</p><h2 id="work-with-the-current-item-list" data-toc-id="work-with-the-current-item-list">Work with the Current Item List</h2><p>The virtual list creates cards for the visible range and recreates them during scrolling, searching, or layout changes. The tick listener finds existing cards and marks them with <code>kjs-order-details-added</code> to prevent duplicate buttons. Card indices retain their original zero-based positions within the category; business matching always uses offer IDs.</p><p>To preserve the fixed row height, the script reuses the first index label: list cards show <code>?</code>, grid cards show an order-details button. This replaces the example order card number without increasing height or covering quantity controls. Card IDs and child order are implementation details; recheck them after upgrades.</p><h2 id="verify-the-result" data-toc-id="verify-the-result">Verify the Result</h2><ol><li><p>Open the shop and check that only the matching category and offers receive buttons.</p></li><li><p>Open both details dialogs and verify their distinct start and end points.</p></li><li><p>Close the dialog, switch list/grid, search, change categories, and scroll away and back. Check that buttons are not duplicated and quantity controls still work.</p></li><li><p>Viewing details must leave quantity, money, and inventory unchanged. Your server order system must validate acceptance, payment, and rewards separately.</p></li></ol>
<figure data-type="local-video" data-width="960" style="width: 960px; max-width: 100%;"><video src="/md/media/viscriptshop-order-details-zh.mp4" poster="/md/media/viscriptshop-order-details-zh.png" controls playsinline preload="metadata"><a href="/md/media/viscriptshop-order-details-zh.mp4">Open video</a></video><figcaption>Actual client-script demo: distinct order details and list/grid switching (about 22 seconds, Chinese UI and captions)</figcaption></figure><p>If buttons are missing, check <code>kubejs/logs/client.log</code>, category and offer IDs, and the script location. Clicking a details button does not buy an offer or accept an order. See <a href="?file=&quot;KubeJS-and-Developers&quot;">KubeJS and Developers</a> for events and side-specific bindings.</p>
