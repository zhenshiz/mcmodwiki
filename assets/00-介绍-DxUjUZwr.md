<h1 id="viscriptrecipe" data-toc-id="viscriptrecipe">ViScriptRecipe</h1>
<p><a href="?file=&quot;兼容索引&quot;">按模组阅读兼容教程与版本</a> · <a href="?file=&quot;使用指南.兼容配方编辑流程&quot;">兼容配方编辑流程</a></p>
<p>ViScriptRecipe 是一款面向整合包作者与服务器管理员的游戏内可视化配方编辑、覆盖和热重载模组。它把原本需要手写 JSON、编写脚本并反复重载数据包的工作，整理成“选择工作站、编辑槽位、上传文件、重载验证”的可视化流程。</p>
<h2 id="功能总览" data-toc-id="功能总览">功能总览</h2>
<ul>
  <li>
    <p>在游戏内编辑 <code>.recipe</code> 运行时文件，一个文件可以包含多个不同工作站的配方。</p>
  </li>
  <li>
    <p>支持新增、替换和删除配方，并可临时停用某个条目。</p>
  </li>
  <li>
    <p>左侧按工作站筛选配方，中间以工作站或 JEI 风格布局预览，右侧只显示当前选中槽位或配方的参数。</p>
  </li>
  <li>
    <p>支持物品、物品标签、流体、流体标签、化学品、化学品标签、实体、方块、维度、结构、附魔等参数；可检索的数据尽量使用自动补全。</p>
  </li>
  <li>
    <p>支持通过配方 ID 导入当前世界已经加载且能够无损映射的配方。</p>
  </li>
  <li>
    <p>支持只重载本模组的配方，并可对 JEI 执行增量更新，避免完整数据包重载。</p>
  </li>
  <li>
    <p>当前注册原版配方编辑器，并为 34 个可选模组提供专用编辑器和导入器。</p>
  </li>
</ul>
<h2 id="快速开始" data-toc-id="快速开始">快速开始</h2>
<h3 id="从打开编辑器到配方生效" data-toc-id="从打开编辑器到配方生效">从打开编辑器到配方生效</h3>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">进入世界并打开编辑器</div>
    <div data-type="admonition-content">
      <p>进入单人世界、局域网世界或专用服务器后执行 <code>/viscript_recipe editor</code>。编辑器需要服务端环境和权限等级 4，不能在主菜单中完成配方导入或服务端上传。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">新建或打开配方文件</div>
    <div data-type="admonition-content">
      <p>在编辑器中选择“文件 → 新建 → ViScript 配方文件”，也可以执行 <code>/viscript_recipe editor &lt;file&gt;</code> 直接打开或创建指定的运行时文件。命令参数是文件名或相对路径，不是配方 ID。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">设置新配方 ID 命名空间</div>
    <div data-type="admonition-content">
      <p>默认自动生成的 ID 使用 <code>viscript_recipe</code> 命名空间。需要为整合包或其它模组生成 ID 时，打开“配方 → 设置新配方 ID 命名空间”，填入合法命名空间，例如 <code>my_pack</code>。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">选择工作站</div>
    <div data-type="admonition-content">
      <p>在左侧“工作站”搜索框中按名称、所属模组或 ID 搜索并选择工作站。只有已经安装并成功加载的联动模组，其工作站才会出现。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">新增或导入配方</div>
    <div data-type="admonition-content">
      <p>点击“新增配方”从默认值开始编辑；如果要修改已有配方，点击“导入已加载配方”，搜索完整的 <code>namespace:path</code> ID 后确认导入。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">编辑槽位与参数</div>
    <div data-type="admonition-content">
      <p>点击中间工作区的物品、流体或化学品槽位，右侧属性面板会切换到该槽位的信息。点击工作区空白处或重新选择配方，可返回配方级参数。</p>
      <p>配方 ID 必须填写完整的 <code>namespace:path</code>。操作模式按目的选择“添加”“替换”或“删除”。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">检查本文件修改范围</div>
    <div data-type="admonition-content">
      <p>打开“配方 → 查看本文件修改的工作站”。窗口会按工作站折叠列出全部条目、启用数量、操作模式和配方 ID。点击具体条目可以直接定位回编辑器。 </p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">保存并上传</div>
    <div data-type="admonition-content">
      <p>“文件 → 保存/另存为”保存当前文件。多人环境中还需要使用“上传 → 上传配方文件”，把文件发送到服务端的 <code>ldlib2/assets/viscript_recipe/recipes</code> 目录。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">重载并验证</div>
    <div data-type="admonition-content">
      <p>编辑期间优先执行 <code>/viscript_recipe reload delta</code>。随后在 JEI、实际工作站或 <code>/viscript_recipe status</code> 中检查结果。需要刷新原版配方书时改用普通重载，涉及标签变化时使用完整重载。</p>
    </div>
  </div>
</div>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">服务端文件才会被重载</div>
  <div data-type="admonition-content">
    <p>重载命令读取的是服务端 <code>ldlib2/assets/viscript_recipe/recipes</code> 目录。仅在客户端保存一份文件，不会自动修改专用服务器上的配方；请上传文件或由管理员把文件复制到服务器目录。</p>
  </div>
</div>
<h2 id="编辑器界面教程" data-toc-id="编辑器界面教程">编辑器界面教程</h2>
<h3 id="三栏界面" data-toc-id="三栏界面">三栏界面</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>区域</th>
      <th>主要用途</th>
      <th>常用操作</th>
    </tr>
    <tr>
      <td>左侧配方列表</td>
      <td>选择工作站、添加、导入、复制、删除和排序条目</td>
      <td>搜索工作站、显示所有配方、拖拽排序</td>
    </tr>
    <tr>
      <td>中间工作区</td>
      <td>按工作站或 JEI 布局显示输入、输出、机器和流程</td>
      <td>点击槽位聚焦、右键清空、Shift 加左键拖拽复制</td>
    </tr>
    <tr>
      <td>右侧属性</td>
      <td>编辑当前配方或当前槽位的实际 Codec 参数</td>
      <td>切换类型、ID、操作、数量、时间、概率和条件</td>
    </tr>
  </tbody>
</table>
<h3 id="工作站选择与配方列表" data-toc-id="工作站选择与配方列表">工作站选择与配方列表</h3>
<ul>
  <li>
    <p><strong>工作站搜索：</strong>候选项同时显示工作站名称与所属模组。可以搜索本地化名称、模组 ID、工作站类别 ID 或对应工作站物品 ID。</p>
  </li>
  <li>
    <p><strong>新增：</strong>在当前工作站中创建默认类型，并按文件当前命名空间生成 <code>recipe_数字</code> ID。 </p>
  </li>
  <li>
    <p><strong>导入：</strong>只列出当前客户端 RecipeManager 中本模组知道如何导入的配方。</p>
  </li>
  <li>
    <p><strong>显示所有配方：</strong>关闭时只显示当前工作站；开启后显示本文件所有已识别条目。新增配方不会自动改变这个开关。</p>
  </li>
  <li>
    <p><strong>复制：</strong>在当前条目下方创建副本，并生成 <code>原路径_copy</code>、<code>原路径_copy_2</code> 等不重复 ID。</p>
  </li>
  <li>
    <p><strong>拖拽排序：</strong>拖动条目前方把手改变当前可见条目的顺序，便于按用途整理大型配方文件。</p>
  </li>
  <li>
    <p><strong>删除列表条目：</strong>删除的是当前 <code>.recipe</code> 文件中的编辑条目。如果目标是删除世界里已有的配方，应保留条目并把“操作”改为“删除”。</p>
  </li>
</ul>
<h3 id="可视化槽位与右侧属性" data-toc-id="可视化槽位与右侧属性">可视化槽位与右侧属性</h3>
<ul>
  <li>
    <p>左键点击输入、输出、流体、化学品或额外物品槽位，右侧只显示对应槽位的可编辑内容，避免把所有参数堆在全局面板中。</p>
  </li>
  <li>
    <p>右键点击可编辑槽位可清空该槽位。清空必需输入或输出后，重载时可能被记为失败。</p>
  </li>
  <li>
    <p>按住 Shift 后左键拖动一个物品槽位，可以把内容复制到另一个兼容槽位。安装 JEI 时也可把 JEI 物品拖入虚拟槽位。</p>
  </li>
  <li>
    <p>物品标签和流体标签会在槽位中轮换预览匹配内容；保存的仍是标签 ID，而不是当前显示的样例物品。</p>
  </li>
  <li>
    <p>工作区中的机器、燃料、容器、催化剂、说明文本或动画可能只是 JEI 阅读提示。只有右侧出现对应字段时，这项信息才属于当前配方 Codec 并可被修改。</p>
  </li>
  <li>
    <p>安装 JEI 时优先使用对应配方分类的贴图；未安装 JEI 时使用模组内置槽位和箭头贴图，编辑能力保持可用。</p>
  </li>
</ul>
<h3 id="通用输入类型与自动补全" data-toc-id="通用输入类型与自动补全">通用输入类型与自动补全</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>参数类型</th>
      <th>编辑方式</th>
      <th>注意事项</th>
    </tr>
    <tr>
      <td>物品与物品栈</td>
      <td>物品槽或物品选择器</td>
      <td>输出通常可编辑数量；输入数量是否有效由原生配方类型决定</td>
    </tr>
    <tr>
      <td>物品标签</td>
      <td>标签自动补全</td>
      <td>保存标签 ID，预览只展示其中的候选物品</td>
    </tr>
    <tr>
      <td>工具动作</td>
      <td>枚举下拉框</td>
      <td>主要用于 Farmer's Delight 砧板工具，例如刀、斧、锹和剪刀动作</td>
    </tr>
    <tr>
      <td>流体与流体标签</td>
      <td>流体选择器或注册表自动补全</td>
      <td>同时编辑流体量；并非所有原生 Codec 都接受标签</td>
    </tr>
    <tr>
      <td>Mekanism 化学品</td>
      <td>化学品名称与 ID 自动补全</td>
      <td>支持单一化学品和化学品标签；复合表达式不能无损导入</td>
    </tr>
    <tr>
      <td>方块与方块标签</td>
      <td>注册表自动补全</td>
      <td>方块结果字段保存方块 ID，不应填写普通物品 ID</td>
    </tr>
    <tr>
      <td>实体与实体标签</td>
      <td>本地化名称和 ID 自动补全</td>
      <td>实体类型与实体标签是两种不同参数，按字段要求选择</td>
    </tr>
    <tr>
      <td>附魔与药水效果</td>
      <td>注册表自动补全</td>
      <td>候选按本地化名称展示，同时可用完整 ID 搜索</td>
    </tr>
    <tr>
      <td>结构与结构标签</td>
      <td>服务端注册表快照自动补全</td>
      <td>Goety 定位结构保存的是结构标签，界面会用熟悉名称帮助检索</td>
    </tr>
    <tr>
      <td>群系标签与维度类型</td>
      <td>服务端同步候选目录</td>
      <td>用于 Industrial Foregoing 与 Confluence 等条件配方</td>
    </tr>
    <tr>
      <td>枚举参数</td>
      <td>下拉框</td>
      <td>例如龙息类型、热量、仪式环境、处理方向和熔炉等级</td>
    </tr>
  </tbody>
</table>
<h3 id="配方条目通用参数" data-toc-id="配方条目通用参数">配方条目通用参数</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>参数</th>
      <th>作用</th>
      <th>建议</th>
    </tr>
    <tr>
      <td>配方类型</td>
      <td>选择当前工作站内具体的原生配方类型</td>
      <td>切换类型会应用新类型默认数据，先确认再切换</td>
    </tr>
    <tr>
      <td>启用</td>
      <td>决定该条目是否参与下一次重载</td>
      <td>用于暂时停用测试条目，不必删除编辑内容</td>
    </tr>
    <tr>
      <td>配方 ID</td>
      <td>RecipeManager 中的唯一 namespace:path 标识</td>
      <td>可直接填写任意合法模组命名空间，不会强制 minecraft 前缀</td>
    </tr>
    <tr>
      <td>添加</td>
      <td>写入新配方；同名 ID 已存在时会覆盖并记录警告</td>
      <td>用于新建内容</td>
    </tr>
    <tr>
      <td>替换</td>
      <td>覆盖已有配方；目标不存在时会作为新增并记录警告</td>
      <td>导入已有配方后修改时使用</td>
    </tr>
    <tr>
      <td>删除</td>
      <td>从最终 RecipeManager 中移除目标 ID</td>
      <td>只需要正确 ID；缺失目标会被统计为跳过</td>
    </tr>
    <tr>
      <td>解锁提示</td>
      <td>控制支持该参数的配方是否弹出解锁提示</td>
      <td>只在工作台、切石和锻造等支持类型中显示</td>
    </tr>
  </tbody>
</table>
<h3 id="新配方-id-命名空间" data-toc-id="新配方-id-命名空间">新配方 ID 命名空间</h3>
<p>菜单“配方 → 设置新配方 ID 命名空间”只影响之后由编辑器自动生成的 ID，包括新增配方和复制配方。默认值是 <code>viscript_recipe</code>。</p>
<ul>
  <li>
    <p>设置为 <code>my_pack</code> 后，新条目会生成类似 <code>my_pack:recipe_1</code> 的 ID。 </p>
  </li>
  <li>
    <p>修改命名空间不会批量重写文件中已有条目，也不会修改导入配方保留的原始 ID。</p>
  </li>
  <li>
    <p>右侧“配方 ID”仍可手动填写任何合法的完整 ID，例如 <code>minecraft:iron_ingot</code> 或 <code>create:custom_pressing</code>。</p>
  </li>
  <li>
    <p>命名空间只能使用 ResourceLocation 允许的字符；空值和非法字符不会被接受。</p>
  </li>
</ul>
<h3 id="本文件修改的工作站" data-toc-id="本文件修改的工作站">本文件修改的工作站</h3>
<p>当一个文件包含大量工作站和配方时，打开“配方 → 查看本文件修改的工作站”快速检查影响范围。</p>
<ul>
  <li>
    <p>顶部显示工作站总数、配方总数和已启用条目数。</p>
  </li>
  <li>
    <p>配方按工作站分组，每组默认收起，避免一个工作站条目过多导致滚动困难。</p>
  </li>
  <li>
    <p>工作站标题显示所属模组和“总条目数 / 已启用数”。</p>
  </li>
  <li>
    <p>展开后显示配方 ID、配方类型、操作和启用状态。</p>
  </li>
  <li>
    <p>点击配方条目会关闭汇总窗口，并在左侧和中间工作区定位到该配方。</p>
  </li>
</ul>
<h3 id="导入已加载配方" data-toc-id="导入已加载配方">导入已加载配方</h3>
<div currentstep="0" data-type="steps">
  <div data-type="step-item">
    <div data-type="admonition-title">获取配方 ID</div>
    <div data-type="admonition-content">
      <p>可从 JEI 高级信息、日志或其它工具获取完整 <code>namespace:path</code>。导入搜索框也会列出当前世界中已经加载且本模组支持导入的 ID。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">搜索并导入</div>
    <div data-type="admonition-content">
      <p>在左侧点击“导入已加载配方”，按 ID、命名空间、路径、配方类型或序列化器 ID 搜索，选择候选并确认。</p>
    </div>
  </div>
  <div data-type="step-item">
    <div data-type="admonition-title">检查映射结果</div>
    <div data-type="admonition-content">
      <p>导入成功后，条目会插入当前选中条目的下方并默认使用“替换”操作。逐个点击槽位检查标签、数量、概率和专用参数是否符合预期。</p>
    </div>
  </div>
</div>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">不能导入不等于不能手动创建</div>
  <div data-type="admonition-content">
    <p>JEI 动态信息页、Data Map、运行时 synthetic 分类和不在 RecipeManager 中的展示对象不是普通配方，不能按 ID 导入。复杂 Ingredient、FluidIngredient 或 ChemicalIngredient 无法无损映射时，导入器会明确拒绝，不会静默篡改数据；对应编辑器存在时仍可手动创建受支持的参数组合。</p>
  </div>
</div>
<h2 id="文件保存上传与服务器目录" data-toc-id="文件保存上传与服务器目录">文件保存、上传与服务器目录</h2>
<p><code>.recipe</code> 是 ViScriptRecipe 的二进制运行时配方文件，不是原版 JSON 数据包文件。每个文件可以保存多个配方条目。</p>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>操作</th>
      <th>写入位置</th>
      <th>是否会立即修改服务器配方</th>
    </tr>
    <tr>
      <td>保存或另存为</td>
      <td>当前编辑器所操作的本地运行时文件</td>
      <td>不会自动应用，仍需确认服务端文件并执行重载</td>
    </tr>
    <tr>
      <td>上传配方文件</td>
      <td>服务端 ldlib2/assets/viscript_recipe/recipes</td>
      <td>上传后仍需执行重载命令</td>
    </tr>
  </tbody>
</table>
<h3 id="通过指令直接打开文件" data-toc-id="通过指令直接打开文件">通过指令直接打开文件</h3><pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_recipe editor
/viscript_recipe editor example
/viscript_recipe editor subfolder/example</code></pre>
<p>不带参数时只打开编辑器。带 <code>&lt;file&gt;</code> 时，命令会在运行时配方目录中打开已有文件或创建新文件，并为已有文件名提供补全。无效路径会被拒绝，不能借此访问配方目录之外的任意文件。</p>
<h2 id="重载与-jei-更新" data-toc-id="重载与-jei-更新">重载与 JEI 更新</h2>
<p>ViScriptRecipe 的重载只重新读取和应用本模组的 <code>.recipe</code> 文件，不会触发完整数据包 reload，也不会顺带重载其它模组的战利品表、进度、函数或全部数据监听器。</p>
<h3 id="三种重载方式" data-toc-id="三种重载方式">三种重载方式</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>指令</th>
      <th>同步内容</th>
      <th>适用场景</th>
    </tr>
    <tr>
      <td>/viscript_recipe reload delta</td>
      <td>只发送本次新增、修改和删除的配方，并局部更新 JEI；不刷新原版配方书和标签</td>
      <td>编辑期间频繁预览普通配方，通常最轻量</td>
    </tr>
    <tr>
      <td>/viscript_recipe reload</td>
      <td>发送新的完整配方包并同步原版配方书；不额外同步标签包</td>
      <td>需要让原版配方书和搜索数据同步更新</td>
    </tr>
    <tr>
      <td>/viscript_recipe reload full</td>
      <td>在普通重载基础上额外同步标签包</td>
      <td>新增、删除或修改标签相关输入后使用，开销最高</td>
    </tr>
  </tbody>
</table>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">增量重载会自动保障一致性</div>
  <div data-type="admonition-content">
    <p>展示模式开启、变化数量过多、配方无法安全编码或客户端版本状态不一致时，增量重载会自动回退到完整配方同步。某些 JEI 分类使用专用展示对象时，系统可能只重建 JEI 页面。Create 自动酿造和 Iron's Spells 奥术铁砧属于需要特殊处理的分类。</p>
  </div>
</div>
<h3 id="查看加载统计" data-toc-id="查看加载统计">查看加载统计</h3>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/viscript_recipe status</code></pre>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>统计项</th>
      <th>含义</th>
    </tr>
    <tr>
      <td>文件</td>
      <td>本次成功读取并反序列化的 .recipe 文件数量</td>
    </tr>
    <tr>
      <td>条目</td>
      <td>文件中的全部条目数量，包括未启用条目</td>
    </tr>
    <tr>
      <td>启用</td>
      <td>参与本次应用流程的条目数量</td>
    </tr>
    <tr>
      <td>应用</td>
      <td>成功执行添加、替换或删除的条目数量</td>
    </tr>
    <tr>
      <td>跳过</td>
      <td>未启用、删除目标不存在或当前条件不满足的条目数量</td>
    </tr>
    <tr>
      <td>失败</td>
      <td>因 ID、类型、参数或原生配方构造错误而失败的条目数量</td>
    </tr>
    <tr>
      <td>基础配方</td>
      <td>应用 ViScriptRecipe 文件前保存的 RecipeManager 配方总数</td>
    </tr>
    <tr>
      <td>当前配方</td>
      <td>本次应用完成后的 RecipeManager 配方总数</td>
    </tr>
  </tbody>
</table>
<p>如果“失败”大于 0，请查看服务端日志中的具体配方 ID、来源文件和异常。统计成功只说明条目被写入 RecipeManager，还应到对应机器或 JEI 页面验证实际行为。</p>
<h3 id="没有安装-jei-时" data-toc-id="没有安装-jei-时">没有安装 JEI 时</h3>
<p>JEI 不是打开编辑器和应用配方的必需前置。未安装 JEI 时，中间工作区使用 ViScriptRecipe 与 LDLib2 提供的内置槽位、箭头和机器布局；配方保存、上传、导入候选、服务端重载与实际机器行为仍然可用。区别是无法通过 JEI 页面查看结果，也没有 JEI 运行时页面需要刷新。</p>
<h2 id="配置项" data-toc-id="配置项">配置项</h2>
<p>配置文件位于 <code>config/viscript_recipe_config.toml</code>。执行任意 ViScriptRecipe 重载命令时，模组会重新读取该配置文件。</p>
<h3 id="展示模式" data-toc-id="展示模式">展示模式</h3>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>配置路径</th>
      <th>默认值</th>
      <th>作用</th>
    </tr>
    <tr>
      <td>recipes.showcase_only_viscript_recipes</td>
      <td>false</td>
      <td>开启后清空基础 RecipeManager 配方，只保留应用后的 ViScriptRecipe 配方，便于检查当前配方包</td>
    </tr>
  </tbody>
</table><pre language="toml" isclosed="false"><code class="language-toml">[recipes]
showcase_only_viscript_recipes = false</code></pre>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">展示模式不建议直接用于正式服务器</div>
  <div data-type="admonition-content">
    <p>展示模式会改变完整配方集合，并让增量重载回退为完整同步。部分模组还有不经过 RecipeManager 的动态或专用配方，这些内容不会被展示模式统一清除。</p>
  </div>
</div>
<h2 id="原版配方教程" data-toc-id="原版配方教程">原版配方教程</h2>
<table data-type="custom-table" data-with-header-row="true"
  style="min-width: 100px;">
  <tbody>
    <tr>
      <th>工作站</th>
      <th>支持的类型</th>
      <th>主要参数</th>
    </tr>
    <tr>
      <td>工作台</td>
      <td>minecraft:crafting_shaped；minecraft:crafting_shapeless</td>
      <td>图案或无序材料、物品或标签、结果、剩余物、解锁提示</td>
    </tr>
    <tr>
      <td>熔炉</td>
      <td>minecraft:smelting</td>
      <td>输入、结果、经验、烧制时间</td>
    </tr>
    <tr>
      <td>高炉</td>
      <td>minecraft:blasting</td>
      <td>输入、结果、经验、烧制时间</td>
    </tr>
    <tr>
      <td>烟熏炉</td>
      <td>minecraft:smoking</td>
      <td>输入、结果、经验、烧制时间</td>
    </tr>
    <tr>
      <td>营火</td>
      <td>minecraft:campfire_cooking</td>
      <td>输入、结果、经验、处理时间</td>
    </tr>
    <tr>
      <td>切石机</td>
      <td>minecraft:stonecutting</td>
      <td>输入、结果、数量、解锁提示</td>
    </tr>
    <tr>
      <td>锻造台</td>
      <td>minecraft:smithing_transform</td>
      <td>模板、基础物品、附加材料、结果、解锁提示</td>
    </tr>
  </tbody>
</table>
<p>有序合成按槽位保存图案；无序合成只保存有效材料。烧炼工作区中的燃料槽是机器运行提示，不属于单条烧炼配方，真正可编辑的是输入、输出、经验和时间。</p>
<h2 id="联动模组配方教程" data-toc-id="联动模组配方教程">联动模组配方教程</h2>
<p>兼容教程已按模组拆分。请从<a href="?file=&quot;兼容索引&quot;">兼容索引</a>查看全部 34 个配方模块与 JEI；AE2 附属等已归入主模组的三级菜单。</p>
<h2 id="常见问题" data-toc-id="常见问题">常见问题</h2>
<h3 id="为什么改完没有生效" data-toc-id="为什么改完没有生效">为什么改完没有生效</h3>
<ol>
  <li>
    <p>确认文件已经上传或复制到服务端的 <code>ldlib2/assets/viscript_recipe/recipes</code>。</p>
  </li>
  <li>
    <p>确认条目“启用”开关已打开。</p>
  </li>
  <li>
    <p>确认配方 ID 和操作模式正确；修改已有配方建议先导入并使用“替换”。</p>
  </li>
  <li>
    <p>执行重载后运行 <code>/viscript_recipe status</code>，检查失败和跳过数量。</p>
  </li>
  <li>
    <p>查看服务端日志中的具体异常；缺失联动模组、非法注册表 ID、空必需槽位和超出原生 Codec 范围都会导致失败。</p>
  </li>
</ol>
<h3 id="为什么-jei-页面没有更新" data-toc-id="为什么-jei-页面没有更新">为什么 JEI 页面没有更新</h3>
<ul>
  <li>
    <p>普通编辑优先执行 <code>/viscript_recipe reload delta</code>；系统会局部隐藏旧页面并加入新页面。</p>
  </li>
  <li>
    <p>如果改了标签，使用 <code>/viscript_recipe reload full</code>。</p>
  </li>
  <li>
    <p>如果该分类是动态展示页或专用对象，系统可能重建整个 JEI 而不是局部替换。</p>
  </li>
  <li>
    <p>确认配方本身已经成功应用；JEI 不会展示构造失败的条目。</p>
  </li>
</ul>
<h3 id="为什么右侧没有某段文字或机器提示的编辑框" data-toc-id="为什么右侧没有某段文字或机器提示的编辑框">
  为什么右侧没有某段文字或机器提示的编辑框</h3>
<p>JEI 页面会把配方数据、机器信息、催化剂、动画和派生文字组合在一起。ViScriptRecipe 只编辑原生配方 Codec 实际保存的数据。由机器注册信息、输入内容或 JEI 分类动态推导的文字和图标没有独立字段，因此只作为只读预览。</p>
<h3 id="为什么某个-jei-分类不在编辑器里" data-toc-id="为什么某个-jei-分类不在编辑器里">为什么某个 JEI 分类不在编辑器里
</h3>
<p>只有对应模组自己注册、由 RecipeManager 或已实现专用覆盖系统管理、并且能够安全构造的配方才会成为编辑类型。注册表信息页、Data Map、运行时 synthetic 分类、机器运行演示和其它模组或原版配方不会为了凑数量而伪装成可上传配方。</p>
<h3 id="怎样避免大型配方文件难以查询" data-toc-id="怎样避免大型配方文件难以查询">怎样避免大型配方文件难以查询</h3>
<p>按用途拆分多个 <code>.recipe</code> 文件，并使用“查看本文件修改的工作站”检查每个文件。汇总窗口的工作站默认收起，可查看每组总数和启用数；点击条目即可定位。左侧也可打开“显示所有配方”后统一排序。 </p>
<h2 id="宣传视频" data-toc-id="宣传视频">宣传视频</h2>
<div class="video-container"><iframe
    src="//player.bilibili.com/player.html?bvid=BV1nzMp6WEPp&amp;page=1&amp;high_quality=1&amp;danmaku=0"
    width="640" height="480" allowfullscreen="true" frameborder="0"></iframe>
</div>
<p></p>