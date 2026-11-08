<h1 id="计划任务" data-toc-id="计划任务">计划任务</h1>
<p><code>ml:schedule</code> 在延时后执行一组命令，保留创建任务时的执行实体、维度、位置、朝向与锚点。可用于剧情节奏、延时恢复和持续检测。</p>
<h2 id="语法与三种模式" data-toc-id="语法与三种模式">语法与三种模式</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/ml:schedule demo 10t append { say first; say second; }
/ml:schedule demo 1s replace { say replaced; }
/ml:schedule heartbeat 1s loop { say tick; }
/schedule clear map_lib:heartbeat</code></pre>
<table data-type="custom-table" data-with-header-row="true">
  <tbody>
    <tr><th>参数</th><th>规则</th></tr>
    <tr><td>name</td><td>小写字母、数字、下划线、短横线或点；内部名称为 map_lib:&lt;name&gt;</td></tr>
    <tr><td>time</td><td>支持 t、s、d；单次任务允许 0t，最早在下一 tick 执行；循环间隔必须大于 0</td></tr>
    <tr><td>append</td><td>添加任务，保留同名任务</td></tr>
    <tr><td>replace</td><td>删除同名任务后安排新的单次任务</td></tr>
    <tr><td>loop</td><td>添加循环任务，首次在间隔到期后执行</td></tr>
    <tr><td>commands</td><td>用花括号包住，命令之间用分号分隔</td></tr>
  </tbody>
</table>
<p>清除使用原版 <code>schedule clear map_lib:&lt;名称&gt;</code>，会移除该名称下的单次与循环任务。同名且到期 tick 完全相同的任务会被原版计时队列合并为一次；需要分别执行时使用不同名称。</p>
<h2 id="保留执行上下文" data-toc-id="保留执行上下文">保留执行上下文</h2>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">/execute as @p at @s run ml:schedule welcome 2s append { tellraw @s {&quot;text&quot;:&quot;欢迎来到地图&quot;}; }</code></pre>
<p>执行实体按 UUID 保留；到期时若实体未加载或玩家离线，本次执行跳过，循环任务仍等待后续周期。位置和朝向保存为创建任务时的值，不随实体移动；如果执行时需要实体的最新位置，在命令块内部再使用 <code>execute at @s</code>。</p>
<p>任务随世界保存，正常重启后继续计时执行。循环任务不会因本次函数或剧情步骤结束而自动移除，需要显式清除。</p>
<h2 id="延时恢复输入示例" data-toc-id="延时恢复输入示例">延时恢复输入示例</h2>
<p>下面是可放入一个 <code>.mcfunction</code> 的完整片段。先安排恢复任务，再锁定移动；运行函数时须以目标玩家身份执行。</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">ml:schedule restore_movement 3s replace { ml:input lock movement false; }
ml:input lock movement true
ml:transition blink @s 10 40 10</code></pre>
<p>这是单个玩家的示例。多人同时运行时，为每名玩家安排不同任务名，或使用明确面向全体玩家的统一恢复逻辑；<code>replace</code> 的同名替换作用于世界计时队列。</p>
<h2 id="多行与嵌套命令块" data-toc-id="多行与嵌套命令块">多行与嵌套命令块</h2>
<p>在数据包 <code>.mcfunction</code> 中可以直接换行书写命令块，无需在块内加续行反斜杠。分号只分隔当前层命令，JSON/SNBT 引号里的分号不参与分隔，块内支持独占一行的注释。</p>
<pre language="plaintext" isclosed="false"><code class="language-plaintext">ml:schedule outer 10t append {
    say first;
    # 下一段再延时 10 tick
    ml:schedule inner 10t append {
        tellraw @a {&quot;text&quot;:&quot;第二幕; 开始&quot;};
    };
    say last;
}</code></pre>
<h2 id="检查与排错" data-toc-id="检查与排错">检查与排错</h2>
<ul>
  <li><p>先用 <code>say</code> 或 <code>tellraw</code> 验证时间和执行对象，再替换为剧情命令。</p></li>
  <li><p>任务不执行时，检查执行者是否仍在线或已加载，以及花括号、引号和分号是否匹配。</p></li>
  <li><p>重启后循环仍运行时，用原版清除指令结束；不要只删除创建任务的函数文件。</p></li>
</ul>
