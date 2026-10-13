<h1 id="viscriptshop-121" data-toc-id="viscriptshop-121">ViScriptShop</h1>
<p>ViScriptShop
  是一个面向整合包作者和服务器管理员的可视化商店模组。它使用购物车一次结算多个商品，支持以物换物、虚拟货币买卖、库存、阶段解锁、分层促销和多模组容器联动。
</p>
<h2 id="这个模组解决什么问题" data-toc-id="这个模组解决什么问题">这个模组解决什么问题</h2>
<ul>
  <li>
    <p><strong>可视化建店：</strong>在游戏内用编辑器创建分类和商品，不需要手写 NBT。</p>
  </li>
  <li>
    <p><strong>统一结算：</strong>玩家可以跨分类把多个商品放入购物车，最后由服务端统一核价、校验和结算。</p>
  </li>
  <li>
    <p><strong>进度控制：</strong>用阶段标记锁定整个分类或某一商品，适合剧情、科技线和任务解锁。</p>
  </li>
  <li>
    <p><strong>运营活动：</strong>在全店、分类或商品层级设置折扣、涨价、出售收益加成和买满赠品。</p>
  </li>
  <li>
    <p><strong>整合包联动：</strong>可从部分关联背包或钱包中读取交易物品，并可通过 KubeJS 与任务、NPC 或自定义界面衔接。
    </p>
  </li>
</ul>
<h2 id="推荐阅读顺序" data-toc-id="推荐阅读顺序">推荐阅读顺序</h2>
<ol>
  <li>
    <p>第一次建店：跟着<a
        href="?file=&quot;10-快速开始.创建第一个商店.md&quot;">创建第一个商店</a>完成一个可购买钻石的测试店。
    </p>
  </li>
  <li>
    <p>让玩家会用：阅读<a
        href="?file=&quot;11-快速开始.玩家购买指南.md&quot;">玩家购买指南</a>，了解搜索、购物车、暂存、输出目标和虚拟货币抵扣。
    </p>
  </li>
  <li>
    <p>系统学会编辑器：阅读<a href="?file=&quot;20-编辑器教程.商店与分类.md&quot;">商店与分类</a>和<a
        href="?file=&quot;21-编辑器教程.商品与交易.md&quot;">商品与交易</a>。</p>
  </li>
  <li>
    <p>制作正式整合包：继续配置<a href="?file=&quot;30-进阶系统.库存与阶段.md&quot;">库存与阶段</a>、<a
        href="?file=&quot;31-进阶系统.促销系统.md&quot;">促销系统</a>以及<a
        href="?file=&quot;40-服务器管理.指令与配置.md&quot;">指令与配置</a>。</p>
  </li>
  <li>
    <p>接入整合包生态：阅读<a href="?file=&quot;50-模组联动.md&quot;">模组联动</a>；需要脚本或 Java
      事件时继续阅读<a href="?file=&quot;60-KubeJS与开发者.md&quot;">KubeJS 与开发者</a>。</p>
  </li>
  <li>
    <p>遇到异常：按照<a
        href="?file=&quot;70-排错与维护.md&quot;">排错与维护</a>区分文件、存档、界面和服务端结算问题。</p>
  </li>
</ol>
<h2 id="功能总览" data-toc-id="功能总览">功能总览</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>系统</th>
      <th>适合的用途</th>
      <th>关键特性</th>
    </tr>
    <tr>
      <td>以物换物</td>
      <td>材料兑换、任务物品回收、多材料合成</td>
      <td>一笔交易最多可有两种成本物品</td>
    </tr>
    <tr>
      <td>通用货币</td>
      <td>商店买入、玩家出售、经济循环</td>
      <td>支持小数价格，同一购物车中收支按净额结算</td>
    </tr>
    <tr>
      <td>库存</td>
      <td>限量商品、全服争抢、每人限购</td>
      <td>支持无限、共享和玩家独立库存</td>
    </tr>
    <tr>
      <td>阶段</td>
      <td>剧情、科技线、声望、阵营</td>
      <td>分类和商品均可使用多组 AND、OR、NOT、NOR 条件</td>
    </tr>
    <tr>
      <td>促销</td>
      <td>节日活动、会员价、夜间价、优惠券</td>
      <td>全店、分类、商品三级继承与合并</td>
    </tr>
  </tbody>
</table>
<h2 id="核心概念" data-toc-id="核心概念">核心概念</h2>
<ul>
  <li>
    <p><strong>商店路径：</strong>即 <code>/viscript_shop open</code> 后面的第一个参数，对应服务端
      <code>ldlib2/assets/viscript_shop/shop</code> 目录下不带 <code>.shop</code>
      后缀的文件路径。</p>
  </li>
  <li>
    <p><strong>分类 ID 与商品 ID：</strong>编辑器会生成 UUID。指令、脚本和直达某个商品时依赖它们，发布后不建议随意更改。
    </p>
  </li>
  <li>
    <p><strong>商店文件与存档数据：</strong><code>.shop</code>
      文件是配置源；商店打开后，服务器会把当前商店和库存状态保存到世界数据中。</p>
  </li>
</ul>
<h2 id="安全与结算原则" data-toc-id="安全与结算原则">安全与结算原则</h2>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">服务端最终决定交易结果</div>
  <div data-type="admonition-content">
    <p>客户端只提交分类 ID、商品 ID 和购买数量。服务端会重新读取价格、促销、阶段、库存、成本和产出，任何一项不满足都不会完成购买。</p>
    <p>成交后，客户端会收到基于服务端真实背包的物品数量快照，再刷新商店界面。</p>
  </div>
</div>
<h2 id="下一步" data-toc-id="下一步">下一步</h2>
<p>如果你是商店作者，直接进入<a
    href="?file=&quot;10-快速开始.创建第一个商店.md&quot;">创建第一个商店</a>。如果你只需要学会购买，可以跳到<a
    href="?file=&quot;11-快速开始.玩家购买指南.md&quot;">玩家购买指南</a>。</p>