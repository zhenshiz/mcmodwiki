<h1 id="vsq-使用指南" data-toc-id="vsq-使用指南">VSQ 使用指南</h1>
<p>ViScriptQuests（VSQ）是一套基于 LDLib2
  的任务系统。本页介绍玩家如何查看和追踪任务、整合包作者如何用蓝图编辑器制作任务，以及服务器管理员如何发布、调试和维护任务文件。</p>
<h2 id="玩家使用任务书" data-toc-id="玩家使用任务书">玩家使用任务书</h2>
<div currentstep="4" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">绑定任务书按键</div>
    <div data-type="admonition-content">
      <p>进入“选项 → 控制 → 按键绑定”，找到“打开任务书”并绑定一个按键。这个按键默认未绑定，因此第一次使用时需要手动设置。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">打开任务书</div>
    <div data-type="admonition-content">
      <p>按下“打开任务书”按键。任务书会显示分类、任务列表和当前选中的任务；如果服务器提供了任务，默认可以在“全部”分类中查看。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">查看目标与奖励</div>
    <div data-type="admonition-content">
      <p>选择任务后可以查看标题、描述、任务状态、当前步骤、目标进度和奖励。一个小任务包含多个目标时，通常需要按任务书显示的流程完成目标。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">追踪任务</div>
    <div data-type="admonition-content">
      <p>点击“追踪”或“追踪任务”按钮后，当前目标会同步到 HUD。到达位置目标还可以显示导航标记；可以在客户端配置中分别关闭 HUD 或导航标记。
      </p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">提交可手动提交的目标</div>
    <div data-type="admonition-content">
      <p>需要提交的物品或货币目标会显示“提交目标”。物品和货币可以分批提交，提交时是否扣除物品或货币由任务作者在目标节点中决定。</p>
    </div>
  </div>
</div>
<p>任务书关闭方式包括
  <code>Esc</code>、当前绑定的“开关物品栏”按键和“打开任务书”按键。分类、分类分页和部分任务书状态会按玩家保存，下次打开时恢复。</p>
<p>安装 JEI 后，将鼠标指向物品获取目标的图标或文字，再使用 JEI 自己绑定的“查看配方”或“查看用途”按键即可查询物品。VSQ 不会替换 JEI
  的按键绑定。</p>
<h2 id="任务状态与流程" data-toc-id="任务状态与流程">任务状态与流程</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>状态</th>
      <th>含义</th>
    </tr>
    <tr>
      <td>进行中</td>
      <td>任务已经发放，玩家可以推进当前步骤。</td>
    </tr>
    <tr>
      <td>已完成</td>
      <td>任务的流程已经结束，奖励已进入结算流程。</td>
    </tr>
    <tr>
      <td>未解锁</td>
      <td>任务文件存在，但当前流程还没有到达该任务或步骤。</td>
    </tr>
    <tr>
      <td>已失败</td>
      <td>任务被流程或条件标记为失败。</td>
    </tr>
    <tr>
      <td>已撤销</td>
      <td>管理员或脚本撤销了玩家的任务状态。</td>
    </tr>
  </tbody>
</table>
<p>
  蓝图可以组合线性流程、条件分支、并行目标和汇合节点。任务书显示的是运行时已经编译并同步到玩家的数据；修改项目文件后，需要重新编译并上传运行时文件，旧任务状态不会因为重新上传而自动重置。
</p>
<h2 id="使用蓝图编辑器制作任务" data-toc-id="使用蓝图编辑器制作任务">使用蓝图编辑器制作任务</h2>
<p>编辑器把任务保存为节点图。常见的制作顺序是：先建立任务开始和结束节点，再放置小任务、目标、奖励及流程控制节点，最后检查连线和参数。</p>
<div currentstep="4" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">打开编辑器</div>
    <div data-type="admonition-content">
      <p>在游戏中执行 <code>/viscript_quests editor</code> 创建或编辑项目。也可以执行
        <code>/viscript_quests editor &lt;project&gt;</code> 打开服务端已有的
        <code>.questproj</code> 项目。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">搭建任务流程</div>
    <div data-type="admonition-content">
      <p>使用流程控制节点连接任务开始、小任务、条件分支、汇合和任务结束。小任务节点下面连接目标节点，奖励节点连接到对应的结算位置。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">保存编辑器项目</div>
    <div data-type="admonition-content">
      <p>使用编辑器的项目保存功能保留完整蓝图。上传项目到服务端时使用 <code>.questproj</code>
        后缀；这个文件用于以后继续编辑，不是运行时直接执行的任务文件。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">编译并上传运行时任务</div>
    <div data-type="admonition-content">
      <p>选择“上传任务到服务端”会把蓝图编译为 <code>.quest</code>
        并上传。也可以选择同时上传项目和任务，分别得到可继续编辑的项目文件和可执行的运行时文件。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">重新加载并测试</div>
    <div data-type="admonition-content">
      <p>修改运行时文件后，对目标玩家执行
        <code>/viscript_quests reload &lt;target&gt;</code>，再用发放、提交或触发命令验证任务流程。
      </p>
    </div>
  </div>
</div>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">子图限制</div>
  <div data-type="admonition-content">
    <p>Subgraph 可以用于整理和保存编辑器内容，但当前编译器主要遍历根图。不要把唯一的目标或奖励只放在子图中，否则它们可能不会被编译到
      <code>.quest</code>。</p>
  </div>
</div>
<h2 id="分类配置" data-toc-id="分类配置">分类配置</h2>
<p>分类用于组织任务书中的大任务。分类配置会保存到 LDLib2 资产目录下的
  <code>viscript_quests/category/categories.nbt</code>，由服务器保存并同步给玩家。</p>
<ul>
  <li>
    <p>执行 <code>/viscript_quests category config</code> 打开分类配置界面。</p>
  </li>
  <li>
    <p>每个分类可以设置分类 ID、显示名称、显示图标、默认标签背景贴图和选中标签背景贴图。</p>
  </li>
  <li>
    <p>在分类中填写大任务文件 ID。任务 ID 使用运行时 <code>.quest</code> 文件的逻辑路径，不需要写外层引号，也不需要重复写
      <code>.quest</code> 后缀。</p>
  </li>
  <li>
    <p>任务书始终提供“全部”视图，便于在分类配置不完整或任务尚未归类时查找任务。未归类的任务会进入其他任务视图。</p>
  </li>
</ul>
<p>分类图标和标签贴图只影响任务书显示，不会改变任务 ID、任务流程或玩家进度。删除分类前请先确认其中的大任务已经移动到其他分类。</p>
<h2 id="目标类型" data-toc-id="目标类型">目标类型</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>目标</th>
      <th>用途</th>
    </tr>
    <tr>
      <td>物品</td>
      <td>统计玩家背包、末影箱和已接入容器中的物品，可配置严格组件匹配、自动或手动提交，以及提交时是否扣除物品。</td>
    </tr>
    <tr>
      <td>货币</td>
      <td>在安装 ViScriptShop 时检查余额或提交货币，支持自动提交、手动分批提交和动态数值表达式。</td>
    </tr>
    <tr>
      <td>到达位置</td>
      <td>检查玩家所在维度和坐标半径，并可配合追踪 HUD 显示导航标记。</td>
    </tr>
    <tr>
      <td>击杀实体</td>
      <td>按实体类型或实体标签累计击杀数量。</td>
    </tr>
    <tr>
      <td>破坏方块</td>
      <td>按方块类型累计破坏数量。</td>
    </tr>
    <tr>
      <td>访问维度</td>
      <td>玩家进入指定维度后完成。</td>
    </tr>
    <tr>
      <td>实体交互</td>
      <td>玩家与指定实体类型或带指定标签的实体交互后完成。</td>
    </tr>
    <tr>
      <td>进度</td>
      <td>检测玩家是否完成指定的 Minecraft Advancement。</td>
    </tr>
    <tr>
      <td>自定义触发</td>
      <td>由 VSQ 命令、NeoForge 事件或 KubeJS 等外部逻辑触发，用于剧情和模组联动。</td>
    </tr>
    <tr>
      <td>倒计时、思索、实体死亡</td>
      <td>用于时间限制、Ponder 教程或实体死亡条件；具体可用参数以编辑器节点面板为准。</td>
    </tr>
  </tbody>
</table>
<p>所有目标都可以填写自定义 <code>taskHint</code>。留空时，任务书会使用目标类型的默认提示。</p>
<h2 id="奖励类型" data-toc-id="奖励类型">奖励类型</h2>
<ul>
  <li>
    <p><strong>物品奖励</strong>：向玩家发放指定物品。</p>
  </li>
  <li>
    <p><strong>经验奖励</strong>：给予指定经验点数。</p>
  </li>
  <li>
    <p><strong>指令奖励</strong>：以领奖玩家为命令源执行服务端指令。</p>
  </li>
  <li>
    <p><strong>战利品表奖励</strong>：使用数据包 loot table 或简单的自定义概率物品表。</p>
  </li>
  <li>
    <p><strong>货币奖励</strong>：安装 ViScriptShop 时增加玩家货币；未安装时会跳过该可选奖励，不会把
      ViScriptShop 变成 VSQ 的硬前置。</p>
  </li>
</ul>
<p>安装 ViScriptTeam 后，奖励节点还可以参与队伍联动，例如限制只给队长发放。离线成员的奖励会进入待发列表，并在上线后补发。</p>
<h2 id="管理员命令" data-toc-id="管理员命令">管理员命令</h2>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">权限等级</div>
  <div data-type="admonition-content">
    <p><code>/viscript_quests</code> 根命令需要权限等级
      2。<code>editor</code>、项目上传和运行时任务上传需要权限等级 4。玩家日常打开任务书建议使用按键，不要依赖管理命令。</p>
  </div>
</div>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>命令</th>
      <th>作用</th>
    </tr>
    <tr>
      <td>/viscript_quests book</td>
      <td>为执行命令的玩家打开任务书。</td>
    </tr>
    <tr>
      <td>/viscript_quests editor</td>
      <td>打开一个新的任务蓝图编辑器。</td>
    </tr>
    <tr>
      <td>/viscript_quests editor &lt;project&gt;</td>
      <td>从服务端项目目录打开指定的 .questproj。</td>
    </tr>
    <tr>
      <td>/viscript_quests category config</td>
      <td>打开任务分类配置界面。</td>
    </tr>
    <tr>
      <td>/viscript_quests reload &lt;target&gt;</td>
      <td>刷新目标玩家的任务显示与运行时数据。</td>
    </tr>
    <tr>
      <td>/viscript_quests grant &lt;target&gt; &lt;quest&gt; [autoTrack]</td>
      <td>发放任务；省略或填写 true 时自动追踪，填写 false 时保留玩家当前追踪选择。</td>
    </tr>
    <tr>
      <td>/viscript_quests revoke &lt;target&gt; &lt;quest&gt;</td>
      <td>撤销目标玩家的任务。</td>
    </tr>
    <tr>
      <td>/viscript_quests complete &lt;target&gt; &lt;quest&gt;</td>
      <td>直接将目标玩家的任务标记为完成。</td>
    </tr>
    <tr>
      <td>/viscript_quests submit &lt;target&gt; &lt;quest&gt; &lt;step&gt;</td>
      <td>提交目标玩家指定步骤的当前目标。</td>
    </tr>
    <tr>
      <td>/viscript_quests trigger &lt;target&gt; &lt;trigger_id&gt;</td>
      <td>触发自定义触发目标。</td>
    </tr>
  </tbody>
</table>
<p>任务 ID 和项目 ID 支持目录分隔符。包含空格或需要保留路径的 ID 应使用双引号，例如：</p><pre language="bash" isclosed="false"><code class="language-bash">/viscript_quests grant @s "主线/初次冒险" false
/viscript_quests editor "章节一/新手流程"</code></pre>
<h2 id="客户端配置" data-toc-id="客户端配置">客户端配置</h2>
<p>VSQ 的任务书主题、动画、完成提示、追踪 HUD 和导航标记都属于客户端配置。配置项名称以配置界面显示的翻译为准，百分比位置相对于当前屏幕尺寸计算。
</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>配置组</th>
      <th>作用</th>
      <th>默认值</th>
    </tr>
    <tr>
      <td>任务书</td>
      <td>选择任务书界面主题，或启用、关闭任务界面短动画。</td>
      <td>主题为 Classic Book，动画开启</td>
    </tr>
    <tr>
      <td>任务完成提示</td>
      <td>控制完成提示是否显示，以及提示左上角的横向和纵向百分比。</td>
      <td>显示；X 1%，Y 8%</td>
    </tr>
    <tr>
      <td>追踪任务 HUD</td>
      <td>控制追踪任务卡片是否显示，并设置 X、Y、宽度和高度百分比。</td>
      <td>显示；X 74%，Y 22%，宽 24%，高 13%</td>
    </tr>
    <tr>
      <td>任务导航标记</td>
      <td>控制位置目标的边缘标记，并设置贴近屏幕边缘时的边距和图标大小。</td>
      <td>显示；边距 3%，图标 2.6%</td>
    </tr>
  </tbody>
</table>
<p>如果调整了 HUD 位置后仍然贴边，请同时检查 X、Y 与宽度、高度四个百分比。关闭任务界面动画只影响显示过渡，不会改变任务数据。</p>
<h2 id="可选联动" data-toc-id="可选联动">可选联动</h2>
<ul>
  <li>
    <p><strong>ViScriptTeam</strong>：队伍范围内的任务状态复用、队伍进度同步、队长限定奖励和离线奖励补发。</p>
  </li>
  <li>
    <p><strong>ViScriptShop</strong>：货币目标和货币奖励。</p>
  </li>
  <li>
    <p><strong>JEI</strong>：物品目标的配方和用途查询。</p>
  </li>
  <li>
    <p><strong>Sophisticated Backpacks</strong>：物品目标统计和扣除背包模组中的物品。</p>
  </li>
  <li>
    <p><strong>Beyond Dimensions</strong>：物品目标读取超越维度的统一存储。</p>
  </li>
  <li>
    <p><strong>KubeJS</strong>：监听任务事件，或通过脚本主动操作任务状态。</p>
  </li>
</ul>
<p>可选联动通过兼容层接入。未安装对应模组时，相关目标或奖励不会自动替换为其他类型；制作任务时请在编辑器中确认节点显示的依赖信息。</p>
<h2 id="常见问题" data-toc-id="常见问题">常见问题</h2>
<h3 id="任务书按键没有反应" data-toc-id="任务书按键没有反应">任务书按键没有反应</h3>
<p>确认按键已经在控制设置中绑定，并确认服务端已经加载至少一个有效的 <code>.quest</code> 文件。管理员也可以用
  <code>/viscript_quests book</code> 测试当前玩家是否能打开任务书。</p>
<h3 id="编辑器中的任务没有出现在任务书" data-toc-id="编辑器中的任务没有出现在任务书">编辑器中的任务没有出现在任务书</h3>
<p>检查是否只保存了 <code>.questproj</code>。项目文件只用于继续编辑，必须再编译并上传
  <code>.quest</code>。上传后对目标玩家执行
  <code>/viscript_quests reload &lt;target&gt;</code>，并检查分类是否填写了正确的逻辑任务 ID。</p>
<h3 id="任务目标完成后没有结算" data-toc-id="任务目标完成后没有结算">任务目标完成后没有结算</h3>
<p>先查看任务书中的目标状态和当前步骤。如果目标配置为手动提交，请点击“提交目标”；如果使用了货币目标，请确认 ViScriptShop
  已安装且玩家余额满足条件。管理员可以用 <code>submit</code> 命令验证指定步骤的提交路径。</p>
<h3 id="修改文件后旧任务状态是否会消失" data-toc-id="修改文件后旧任务状态是否会消失">修改文件后旧任务状态是否会消失</h3>
<p>重新上传任务文件不会自动清空玩家已经保存的任务状态。若任务 ID、步骤 ID
  或目标结构发生不兼容变化，建议在测试世界中先撤销并重新发放任务，再进入正式世界。</p>
<h3 id="如何确认任务文件被服务器加载" data-toc-id="如何确认任务文件被服务器加载">如何确认任务文件被服务器加载</h3>
<p>执行 <code>/viscript_quests grant</code> 时使用命令补全查看任务 ID；如果补全中没有任务，检查文件是否位于服务端的
  <code>viscript_quests/quest</code> 目录、后缀是否为 <code>.quest</code>，以及上传者是否拥有权限等级
  4。</p>