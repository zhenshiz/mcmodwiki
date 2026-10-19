<h1 id="编辑器基础操作" data-toc-id="编辑器基础操作">编辑器基础操作</h1>
<p>本文介绍采用 ViScriptLib（VSL）文件流程的 LDLib2 编辑器如何使用：认识界面、打开和保存文件、导出运行时数据、上传到服务器，以及处理打不开的物品。它适用于多种附属模组的编辑器；具体节点、字段和业务规则由对应模组的文档说明。</p>
<p>其它 ViScript 系列模组的编辑器教程会把本页当作基础操作参考：本页只讲所有编辑器共用的文件与窗口操作，打开各模组教程前可以先通读一遍。</p>
<div type="info" data-type="admonition" data-admo-type="info">
  <div data-type="admonition-title">适用环境</div>
  <div data-type="admonition-content">
    <p>本教程按当前 VSL 工程的 Minecraft 1.21.1、NeoForge 21.1 系列与 LDLib2 2.2.40 编辑器实现编写。不同附属模组可以调整布局、添加菜单或隐藏某些窗口，因此实际界面以该模组为准。</p>
  </div>
</div>

<h2 id="先认识两种编辑器" data-toc-id="先认识两种编辑器">先认识两种编辑器</h2>
<p>开始操作前，先看编辑器保存的是哪种文件。两种编辑器的画布或表单可能很相似，但“保存”的含义不同。</p>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr><th>编辑器模式</th><th>文件关系</th><th>“保存”写入什么</th><th>何时使用</th></tr>
    <tr><td>功能文件一体型</td><td>只有一种功能文件；编辑文件也是运行时使用的文件。</td><td>本地功能文件，例如 .shop。</td><td>编辑器不需要单独保留编译前的工程数据。</td></tr>
    <tr><td>工程文件分离型</td><td>工程文件保留可继续编辑的数据，功能文件由工程生成。</td><td>本地工程文件，例如 .questproj；运行时文件需另行导出或上传。</td><td>编辑器需要保存蓝图、布局或其他制作信息。</td></tr>
  </tbody>
</table>
<p>VSL 为这两种模式提供通用的文件菜单和路径规则。附属模组决定具体文件后缀、编辑内容、进入编辑器的方式，以及上传后是否需要额外的重载或发布步骤。</p>

<h2 id="认识编辑器界面" data-toc-id="认识编辑器界面">认识编辑器界面</h2>
<ul>
  <li><p><strong>顶部菜单</strong>：通常包含“文件”“视图”；采用 VSL 文件流程的编辑器还会显示“异常物品”，以及按模式提供的“上传”菜单。</p></li>
  <li><p><strong>主编辑区域</strong>：用于编辑当前项目。它可能是节点图、表单或其他视图，取决于附属模组。</p></li>
  <li><p><strong>检查器</strong>：选中可编辑对象时显示其参数；某些模组会把它放在右侧，或改为自己的属性区域。</p></li>
  <li><p><strong>资源与历史视图</strong>：LDLib2 编辑器可提供资源浏览和编辑历史；附属模组可以移除不需要的视图，因此看不到并不表示功能故障。</p></li>
  <li><p><strong>窗口按钮</strong>：关闭、最小化和窗口尺寸按钮取决于编辑器使用的窗口以及模组的布局设置。</p></li>
</ul>
<p>“文件 → 新建”中的项目类型也由附属模组提供。新建后，再在主编辑区域完成内容制作；本教程只说明通用的文件操作。</p>

<h2 id="文件菜单的通用操作" data-toc-id="文件菜单的通用操作">文件菜单的通用操作</h2>
<table data-type="custom-table" data-with-header-row="true" style="min-width: 100px;">
  <tbody>
    <tr><th>菜单操作</th><th>作用</th><th>使用时机</th></tr>
    <tr><td>新建</td><td>创建当前编辑器支持的新项目。</td><td>从空白项目开始制作。</td></tr>
    <tr><td>打开</td><td>从当前编辑器对应的本地目录读取文件，并按后缀筛选。</td><td>继续修改已有文件。</td></tr>
    <tr><td>最近项目</td><td>重新打开此编辑器最近使用的有效本地文件；菜单中也可清空记录。</td><td>经常往返编辑同一文件。</td></tr>
    <tr><td>保存</td><td>覆盖当前已关联的本地文件；首次保存会进入另存为流程。</td><td>保留当前编辑结果。</td></tr>
    <tr><td>另存为</td><td>选择新的本地文件名或位置，保存一份当前项目。</td><td>建立副本或开始新版本。</td></tr>
    <tr><td>导出运行时文件</td><td>根据工程生成本地功能文件；仅工程文件分离型提供。</td><td>需要把可编辑工程转换为运行时文件。</td></tr>
    <tr><td>导出数据到剪贴板</td><td>复制当前项目的序列化数据。</td><td>临时交换或检查项目数据。</td></tr>
    <tr><td>从剪贴板导入数据</td><td>用剪贴板数据替换当前编辑内容。</td><td>确认数据来源与格式后再使用。</td></tr>
  </tbody>
</table>
<p>“打开”“保存”和“另存为”操作的是<strong>当前客户端的本地文件</strong>。在多人服务器上，它们不会自动改动服务端文件；服务端使用的数据需要通过对应的“上传”菜单提交。</p>
<p>LDLib2 编辑器还提供可调整的快捷键：默认使用 <code>Ctrl+S</code> 保存、<code>Ctrl+Shift+S</code> 另存为、<code>Ctrl+Z</code> 撤销、<code>Ctrl+Y</code> 或 <code>Ctrl+Shift+Z</code> 重做。复制、剪切和粘贴分别使用 <code>Ctrl+C</code>、<code>Ctrl+X</code>、<code>Ctrl+V</code>。快捷键作用于当前有焦点的视图，实际绑定可以在编辑器“文件 → 设置”中查看和修改。</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">剪贴板导入会替换当前内容</div>
  <div data-type="admonition-content">
    <p>使用“从剪贴板导入数据”前，请先保存当前项目。导入会新建内存中的项目并替换正在编辑的内容；不匹配或损坏的数据也可能导致解析失败。</p>
  </div>
</div>

<h2 id="功能文件一体型的操作流程" data-toc-id="功能文件一体型的操作流程">功能文件一体型的操作流程</h2>
<p>这种模式只有一种文件。以 <code>.shop</code> 为例，编辑器打开和保存的就是该功能文件，不存在额外的 <code>.shopproj</code> 工程文件。</p>
<div currentstep="0" data-type="steps">
  <div data-type="step-item"><div data-type="admonition-title">新建或打开文件</div><div data-type="admonition-content"><p>从“文件 → 新建”选择项目类型，或使用“文件 → 打开”选择现有功能文件。打开对话框会定位到该模组的功能文件目录，并筛选当前编辑器支持的后缀。</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">编辑内容</div><div data-type="admonition-content"><p>在主编辑区域修改内容；字段、画布操作和校验规则以所属模组的教程为准。</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">保存本地文件</div><div data-type="admonition-content"><p>使用“文件 → 保存”或“另存为”。首次保存需要选定文件名；以后“保存”会写回当前本地文件。</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">需要时上传服务器</div><div data-type="admonition-content"><p>若该编辑器提供“上传 → 上传到服务端”，填写文件名并提交。等待服务端返回“创建”或“覆盖”的结果提示，再按所属模组的方式验证内容是否生效。</p></div></div>
</div>
<p>本地文件位于当前游戏实例的 <code>ldlib2/assets/&lt;modid&gt;/&lt;domain&gt;/</code>。实际后缀和目录名由附属模组指定。</p>

<h2 id="工程文件分离型的操作流程" data-toc-id="工程文件分离型的操作流程">工程文件分离型的操作流程</h2>
<p>这种模式有两种文件。<strong>工程文件</strong>保留可继续编辑的原始数据；<strong>功能文件</strong>由工程生成，供模组运行。以 <code>.questproj</code> 和 <code>.quest</code> 为例，保存工程并不等于生成新的运行时文件。</p>
<div currentstep="0" data-type="steps">
  <div data-type="step-item"><div data-type="admonition-title">新建或打开工程</div><div data-type="admonition-content"><p>从“文件 → 新建”创建项目，或使用“文件 → 打开”选择本地工程文件。打开对话框按当前编辑器的工程后缀筛选。</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">编辑并保存工程</div><div data-type="admonition-content"><p>完成内容后先“保存”或“另存为”。这一步保留继续编辑所需的数据，例如原始蓝图和编辑器信息。</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">生成运行时文件</div><div data-type="admonition-content"><p>若需要本地文件，选择“文件 → 导出运行时文件”；若需要直接提交到服务器，可使用“上传 → 上传功能文件”。导出或上传时会从当前工程生成运行时数据。</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">保留服务端工程副本</div><div data-type="admonition-content"><p>需要以后从服务端继续编辑时，再用“上传工程文件”。“上传工程和功能文件”会使用同一个基础文件名提交两种文件，适合一次完成保存与发布。</p></div></div>
  <div data-type="step-item"><div data-type="admonition-title">核对服务器结果</div><div data-type="admonition-content"><p>等待服务端分别回传文件写入结果；如果所属模组要求重载、重新打开界面或重新发放内容，再按对应模组文档执行。</p></div></div>
</div>
<p>工程文件的本地目录是 <code>ldlib2/assets/&lt;modid&gt;/project/</code>，运行时文件的本地目录是 <code>ldlib2/assets/&lt;modid&gt;/&lt;domain&gt;/</code>。工程后缀由功能文件后缀派生，例如 <code>.quest</code> 对应 <code>.questproj</code>。多个编辑器可以共用同一模组的 <code>project</code> 目录，打开时按后缀区分。</p>
<div type="important" data-type="admonition" data-admo-type="important">
  <div data-type="admonition-title">保存工程与发布内容是两步</div>
  <div data-type="admonition-content">
    <p>只保存或上传工程文件，服务端并不会因此得到新的运行时文件。请根据需要导出或上传功能文件，并在服务器确认实际加载的版本。</p>
  </div>
</div>

<h2 id="上传到服务端" data-toc-id="上传到服务端">上传到服务端</h2>
<ul>
  <li><p>“上传”菜单仅显示当前编辑器提供的动作。一体型通常只有一个上传动作；分离型可提供上传工程、上传功能文件和同时上传两者三种动作。</p></li>
  <li><p>VSL 通用上传需要服务端权限等级 4。没有权限时，服务端会返回拒绝提示。</p></li>
  <li><p>点击上传后先出现“已发送上传请求”；真正写入成功后，还会收到服务端的创建或覆盖结果。如果返回失败，请以服务端结果为准。</p></li>
  <li><p>服务端文件写入该服务器游戏目录下的 <code>ldlib2/assets/&lt;modid&gt;/project/</code> 或 <code>ldlib2/assets/&lt;modid&gt;/&lt;domain&gt;/</code>。同名文件会被覆盖。</p></li>
  <li><p>上传文件名建议只用英文字母、数字、下划线、连字符和点。VSL 的通用上传会规范化名称，去掉输入中的目录部分并替换其他字符；不要把输入框当作填写服务器绝对路径的地方。</p></li>
</ul>
<p>对于已发布的内容，上传成功只证明文件写入成功；具体模组是否立刻重新加载文件，要查阅该模组自己的说明。</p>

<h2 id="窗口与视图" data-toc-id="窗口与视图">窗口与视图</h2>
<p>“视图”菜单可以调整编辑器的界面缩放。LDLib2 的编辑器可包含主视图、检查器、资源和历史记录等区域；附属模组可以重新安排或删除这些区域。需要编辑对象参数时，先选中对象，再查看该模组保留的属性视图。</p>
<p>部分编辑器使用 VSL 扩展窗口，可把窗口缩到指定的屏幕区域，以便露出游戏界面或其他模组的物品列表；也可能保留 LDLib2 默认的最大化与还原按钮。最小化、缩小窗口和关闭编辑器都<strong>不会替你保存文件</strong>。编辑完毕后先按当前模式保存，再进行导出或上传。</p>

<h2 id="无法解析的物品与备份" data-toc-id="无法解析的物品与备份">无法解析的物品与备份</h2>
<p>对于使用 VSL 异常物品数据类型保存物品的项目，打开本地文件时，如果其中的物品、组件或附魔在当前环境无法解析，编辑器会显示警告。选择“备份并打开”后，会先在原文件同目录创建 <code>.missing-items-backup</code> 备份，再用屏障占位符显示异常物品；取消则不打开，也不会写备份。</p>
<p>占位符会保留完整原始数据。若只是临时缺少模组，建议先保留占位符，恢复依赖后重新打开文件；主动把占位符替换成别的物品，会覆盖它保存的原始内容。</p>
<div type="warning" data-type="admonition" data-admo-type="warning">
  <div data-type="admonition-title">批量删除会修改当前项目</div>
  <div data-type="admonition-content">
    <p>“异常物品 → 批量删除缺失物品 ID”会按所选 ID 清理当前内存项目中的全部对应物品。它不会立即写入磁盘，但一旦保存就会覆盖文件；操作前请确认备份可用。</p>
  </div>
</div>

<h2 id="常见问题" data-toc-id="常见问题">常见问题</h2>
<h3 id="已经保存为什么服务器看不到修改" data-toc-id="已经保存为什么服务器看不到修改">已经保存，为什么服务器看不到修改？</h3>
<p>先确认保存的是本地文件还是服务端文件。一体型需要在提供上传动作时上传功能文件；分离型还要确认上传的是运行时功能文件，而不只是工程文件。若服务端提示写入成功但内容仍旧未更新，检查对应模组是否需要重载。</p>
<h3 id="为什么文件菜单没有保存" data-toc-id="为什么文件菜单没有保存">为什么文件菜单没有“保存”？</h3>
<p>尚未打开项目，或当前项目还没有关联本地文件时，菜单可能只显示“另存为”。先新建或打开项目，再选择“另存为”建立本地文件；之后可继续使用“保存”。</p>
<h3 id="为什么上传菜单没有对应动作" data-toc-id="为什么上传菜单没有对应动作">为什么上传菜单没有对应动作？</h3>
<p>上传菜单根据当前项目和附属模组提供的上传动作生成。先确认项目已打开；若一体型编辑器仍没有上传选项，则该模组可能未提供通用上传功能，请按该模组自己的发布流程操作。</p>
