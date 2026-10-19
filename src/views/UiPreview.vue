<script setup>
import { ref } from 'vue'
import Button from '@/components/Button.vue'
import Input from '@/components/form/Input.vue'
import Select from '@/components/form/Select.vue'
import Switch from '@/components/form/Switch.vue'
import Modal from '@/components/Modal.vue'
import MarkdownReadOnly from '@/components/markdown/MarkDownReadOnly.vue'
import MarkdownEditor from '@/components/markdown/Editor.vue'
import InspectorItem from '@/components/form/InspectorItem.vue'
const query = ref('')
const sort = ref('updated')
const enabled = ref(true)
const modalVisible = ref(false)
const editorMode = ref('preview')
const previewName = ref('Steve')
const editorSample = ref(
  '<h1>编辑器排版</h1><p>选中这段文字试试行内代码样式。</p><p>公式可以嵌入段落：<span data-type="inline-math" data-latex="E=mc^2"></span>，也可以单独成块。</p><div data-type="block-math" data-latex="\\sum_{i=1}^{n} x_i"></div><table><thead><tr><th>配置项</th><th>说明</th></tr></thead><tbody><tr><td>enabled</td><td>启用功能</td></tr></tbody></table><div data-type="mermaid" data-hide-code="false"><div class="mermaid">flowchart TD\n  A[开始] --&gt; B{是否满足条件}\n  B --&gt;|是| C[执行任务]\n  B --&gt;|否| D[结束]\n  C --&gt; D</div></div><p>这里继续编写文档。</p>',
)
const options = [
  { label: '更新时间（新到旧）', value: 'updated' },
  { label: '更新时间（旧到新）', value: 'oldest' },
  { label: '模组名称（A–Z）', value: 'name' },
]
const sample =
  '<h1>模组使用指南</h1><p>方块化界面与清晰的阅读排版。正文保持舒适的行距，<a href="#">链接</a>与<code>配置项</code>拥有明确的视觉区分。</p><div data-type="admonition" type="info"><div data-type="admonition-title">开始之前</div><div data-type="admonition-content"><p>请确认模组版本与当前游戏版本相匹配。</p></div></div><blockquote><p>为每一次探索，留下一份指南。</p></blockquote><pre language="json"><code class="language-json">{ "enabled": true, "language": "zh_cn" }</code></pre><table><thead><tr><th>配置项</th><th>说明</th></tr></thead><tbody><tr><td>enabled</td><td>启用功能</td></tr></tbody></table>'
</script>

<template>
  <main class="mx-auto max-w-5xl px-5 py-10">
    <div class="mc-label">DESIGN SYSTEM / DEVELOPMENT ONLY</div>
    <h1 class="mt-2 mb-8 text-3xl font-bold">组件预览</h1>
    <div class="grid gap-6 md:grid-cols-2">
      <section class="mc-panel p-6">
        <h2 class="mb-5 font-bold">按钮与状态</h2>
        <div class="flex flex-wrap gap-4">
          <Button variant="primary">主要操作</Button><Button variant="secondary">辅助操作</Button
          ><Button>普通操作</Button><Button variant="danger">危险操作</Button
          ><Button variant="ghost">轻量操作</Button><Button disabled>禁用状态</Button>
        </div>
      </section>
      <section class="mc-panel p-6">
        <h2 class="mb-5 font-bold">输入与选择</h2>
        <div class="space-y-4">
          <Input v-model="query" placeholder="搜索模组名称" /><Select
            v-model="sort"
            :options="options"
            placeholder="排序方式"
          /><Select :options="options" disabled placeholder="禁用选择" />
          <div class="flex items-center gap-3">
            <Switch v-model="enabled" aria-label="启用功能" /><span class="text-sm">{{
              enabled ? '已启用' : '已关闭'
            }}</span
            ><Switch :model-value="false" disabled aria-label="禁用开关" />
          </div>
        </div>
      </section>
      <section class="mc-panel p-6">
        <h2 class="mb-5 font-bold">标签与弹窗</h2>
        <div class="mb-6 flex flex-wrap gap-3">
          <span class="mc-tag">NeoForge</span><span class="mc-tag mc-tag--primary">已发布</span
          ><span class="mc-tag mc-tag--secondary">Minecraft 1.21.1</span>
        </div>
        <Button @click="modalVisible = true">打开弹窗</Button>
      </section>
      <section class="mc-panel p-6">
        <h2 class="mb-5 font-bold">交互检查</h2>
        <p class="text-sm leading-7 text-ui-muted">
          切换顶部明暗主题查看组件层级。使用 Tab 检查焦点，使用方向键操作下拉框，使用 Escape
          关闭菜单和弹窗。按钮按下时向右下移动。
        </p>
      </section>
      <section class="mc-panel p-6">
        <h2 class="mb-4 font-bold">参数说明</h2>
        <p class="mb-4 text-sm text-ui-muted">带问号的参数提供说明，悬停、点击或使用 Tab 聚焦问号即可查看。</p>
        <InspectorItem label="预览名字" tips="仅用于预览名字位置，不保存">
          <Input v-model="previewName" />
        </InspectorItem>
        <InspectorItem label="普通参数">
          <Input placeholder="没有说明时不显示问号" />
        </InspectorItem>
      </section>
    </div>
    <section class="mt-8">
      <h2 class="mb-4 font-bold">编辑器交互预览</h2>
      <div class="mc-panel">
        <MarkdownEditor
          v-if="editorMode === 'preview'"
          v-model:value-markdown="editorSample"
          v-model:mode="editorMode"
        />
        <div v-else class="p-4">
          <Button class="mb-4" @click="editorMode = 'preview'">返回预览</Button>
          <textarea
            v-model="editorSample"
            aria-label="文档 HTML"
            class="w-full min-h-[400px] bg-ui-inset p-4 font-mono"
          ></textarea>
        </div>
      </div>
      <details class="mt-4">
        <summary class="cursor-pointer text-sm">查看公式与表格的只读效果</summary>
        <MarkdownReadOnly :content="editorSample" />
      </details>
    </section>
    <section class="mt-8 border border-ui-line bg-ui-surface px-6">
      <MarkdownReadOnly :content="sample" />
    </section>
    <Modal v-model:show="modalVisible" title="方块窗口"
      ><p>窗口、菜单与按钮使用一致的边框和硬阴影。</p>
      <template #footer
        ><Button @click="modalVisible = false">取消</Button
        ><Button variant="primary" @click="modalVisible = false">确定</Button></template
      ></Modal
    >
  </main>
</template>
