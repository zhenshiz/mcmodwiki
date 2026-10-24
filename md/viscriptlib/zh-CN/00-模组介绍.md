<h1 id="viscriptlibvsl模组介绍" data-toc-id="viscriptlibvsl模组介绍">
  ViScriptLib（VSL）模组介绍</h1>
<p><strong>ViScriptLib，简称 VSL</strong>，是 ViScript
  系列模组共用的开发基础库，面向模组开发者和需要扩展系列功能的整合包作者。它在 LDLib2
  的基础上，提供编辑器文件管理、界面组件、物品与容器操作、玩家阶段数据等可复用能力，帮助开发者把精力集中在商店、任务、配方等具体功能上。</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">使用 ViScript 系列模组时无需单独下载</div>
  <div data-type="admonition-content">
    <p>
      <strong>ViScript 系列模组均已通过 Jar-in-Jar 内置 VSL，因此使用这些模组时，无需专门下载或额外安装 VSL。</strong>安装所需的系列模组后，加载器会一并加载内置的
      VSL。</p>
    <p>LDLib2 等其他前置依赖，请按对应模组页面的要求安装。</p>
  </div>
</div>
<p>本文介绍当前项目中可供开发者复用的功能。持久化与 RPC 等基础能力依托 LDLib2。</p>
<h2 id="适合哪些开发场景" data-toc-id="适合哪些开发场景">适合哪些开发场景</h2>
<ul>
  <li>
    <p><strong>制作可视化内容编辑器</strong>：为商店、任务、配方或自定义配置提供游戏内编辑入口，复用打开、保存、导出和上传流程。</p>
  </li>
  <li>
    <p>
      <strong>开发物品驱动的玩法</strong>：在提交材料、兑换商品、领取奖励等场景中，统一处理物品匹配、数量统计、扣除和发放。并提供了大量库存的模组的兼容，包括且不限于精妙背包、超越维度等等。
    </p>
  </li>
  <li>
    <p><strong>组织跨功能的进度解锁</strong>：让不同功能读取同一份玩家阶段标记，用于判断内容是否开放，并向玩家显示锁定原因。</p>
  </li>
  <li>
    <p><strong>扩展 ViScript 系列模组</strong>：沿用系列已有的数据和界面约定，减少重复实现文件管理、容器兼容和基础表单的工作。
    </p>
  </li>
</ul>
<h2 id="主要功能" data-toc-id="主要功能">主要功能</h2>
<h3 id="编辑器与文件流程" data-toc-id="编辑器与文件流程">编辑器与文件流程</h3>
<p>VSL 提供两类基于 LDLib2 的编辑器基类，开发者可以根据数据结构选择：</p>
<ul>
  <li>
    <p><code>FunctionFileEditor</code>：编辑文件与运行时文件合一，适合商店配置等直接保存后即可供业务读取的数据。</p>
  </li>
  <li>
    <p><code>ProjectFileEditor</code>：工程文件与运行时文件分离，适合需要保留节点图、编辑布局或编译前数据的项目；通过
      <code>IRuntimeFileProject</code> 定义运行时数据的生成方式。</p>
  </li>
</ul>
<p>配合 <code>EditorFileFormat</code>、<code>EditorAssetPaths</code> 和
  <code>EditorAssetFiles</code>，可以统一文件后缀、目录定位、文件扫描和路径解析。例如，扫描已有功能文件后，可以用于指令补全或运行时加载。
</p>
<p>编辑器还可以复用上传菜单，将工程或功能文件通过 LDLib2 RPC
  提交到服务器。通用上传会检查服务端权限，并返回创建、覆盖或失败的结果。上传后的数据校验、重新加载和业务生效流程由接入模组负责。</p>
<h3 id="搜索与配置界面组件" data-toc-id="搜索与配置界面组件">搜索与配置界面组件</h3>
<p>制作配置界面时，可以直接使用 VSL
  预设的自动补全输入框，选择物品、方块、实体类型、流体、效果、附魔、维度、生物群系、结构及多种标签，也可以搜索资源包或数据包中的 JSON 文件。</p>
<p>这些组件把候选搜索、结果展示和选中值连接起来。例如，<code>ItemSearchBox</code> 可以按物品 ID
  或本地化名称搜索；<code>EntityTypeSearchBox</code> 可以进一步筛选生物或
  Mob。开发者获得对应类型的值，便于直接连接配置数据。</p>
<p>VSL 同时提供编辑器窗口扩展、可拖动界面和物品栈配置支持，适合在系列编辑器之间复用交互方式。</p>
<h3 id="物品匹配与容器兼容" data-toc-id="物品匹配与容器兼容">物品匹配与容器兼容</h3>
<p><code>ItemUtil</code> 提供玩家物品数量查询与扣除等操作，并通过 <code>IContainerHelper</code>
  统一接入不同容器。当前包含玩家背包、Backpacked、Sophisticated Backpacks、Beyond Dimensions
  等容器适配；对应模组存在时启用相应兼容。</p>
<p>物品匹配可以按全部数据组件比较，也可以只比较指定组件，或排除指定组件。例如，材料提交可以忽略耐久变化，自定义装备兑换则可以要求关键组件一致。</p>
<p>发放物品时，<code>ItemOutputTargets</code>
  提供输出目标选择、不可用目标回退和剩余物品处理。默认流程会把目标容器装不下的部分掉落在玩家脚下，开发者也可以提供自己的余量处理回调。新增容器适配时，查询、扣除与输出能力可以分别实现。
</p>
<h3 id="保留无法解析的物品数据" data-toc-id="保留无法解析的物品数据">保留无法解析的物品数据</h3>
<p>整合包调整模组或数据内容后，已保存的物品 ID、组件或附魔可能暂时无法解析。<code>ViScriptItemStack</code>
  为这类持久化数据提供容错表示：显示占位物品，同时保留原始物品 ID、数量和组件数据。</p>
<p>
  在没有主动替换占位内容的前提下，再次保存仍可保留原始数据；恢复对应模组或兼容数据后，可以在后续载入时重新解析。接入该类型的编辑器还可以结合异常物品提示、备份和清理操作，帮助作者处理项目中的缺失内容。
</p>
<h3 id="共享玩家阶段与解锁条件" data-toc-id="共享玩家阶段与解锁条件">共享玩家阶段与解锁条件</h3>
<p>VSL 提供共享的玩家阶段数据。开发者可以通过 <code>StageUtil</code>
  查询、添加或移除阶段标记；数据会持久化保存，在死亡后保留，并同步给所属玩家的客户端。</p>
<p><code>StageRestriction</code>
  提供可持久化、可编辑的阶段条件，支持条件分组、逻辑组合及锁定提示。例如，可以在玩家完成指定目标后添加一个阶段，再由商店或其他功能检查该阶段，决定是否开放内容。具体解锁行为由接入模组执行。
</p>
<p>安装 KubeJS 时，客户端和服务端脚本可使用 <code>ViScriptStageUtil</code>
  绑定访问阶段工具。阶段修改在服务端进行，客户端可以读取同步后的自身阶段，便于整合包作者连接脚本事件与模组功能。</p>
<h3 id="ldlib2-数据与通信扩展" data-toc-id="ldlib2-数据与通信扩展">LDLib2 数据与通信扩展</h3>
<p>当自定义对象需要作为 LDLib2 RPC 参数时，可以使用 <code>@ViScriptRegisterAccessors</code>
  标记静态注册方法。VSL 会在 RPC 扫描前调用这些方法，使自定义类型的访问器及时就绪，也支持按可选模组是否加载来决定是否注册。</p>
<p>对于字段较多的持久化数据类，VSL 还提供
  <code>ISkipDefaultedSerialize</code>，用于在符合约定的类中省略等于默认值的字段；需要始终保留的字段可以用
  <code>@DontSkipPersisted</code> 标记。此外，库内提供 NBT、Codec、文本和数量显示等辅助工具。</p>
<h2 id="开发者从哪里开始" data-toc-id="开发者从哪里开始">开发者从哪里开始</h2>
<p>可以按当前需求选择一个入口接入，无需一次使用全部功能：</p>
<ol>
  <li>
    <p>
      <strong>要做编辑器</strong>：先确定工程数据是否需要与运行时数据分离，再选择编辑器基类和文件格式，接入项目数据、配置面板与上传动作。
    </p>
  </li>
  <li>
    <p><strong>要做物品交互</strong>：先确定物品组件的匹配规则，再接入数量查询、扣除和输出目标，并处理接口返回的未完成数量。</p>
  </li>
  <li>
    <p><strong>要做进度解锁</strong>：通过服务端逻辑或 KubeJS 修改阶段标记，在需要限制的功能入口检查阶段条件。</p>
  </li>
</ol>
<p>开发自己的模组时，需要在开发工程中声明 VSL 与所需前置依赖，并按发布方式安排运行时依赖或 Jar-in-Jar 嵌入。ViScript
  系列已经完成内置，因此玩家安装系列模组时无需额外下载 VSL。</p>
<p>想了解接入后提供给内容作者的操作流程，可以继续阅读<a
    href="?file=&quot;编辑器.基础操作&quot;">编辑器基础操作</a>和<a
    href="?file=&quot;编辑器.常用组件&quot;">编辑器常用组件操作</a>。</p>