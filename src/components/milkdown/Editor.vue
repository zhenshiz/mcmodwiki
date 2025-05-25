<script setup>
import Tooltip from '@/components/milkdown/components/MilkDownTooltip.vue'
import Footer from '@/components/milkdown/components/Footer.vue'
import MilkDownMenu from '@/components/milkdown/MilkDownMenu.vue'
import LinkUpdatePopup from '@/components/milkdown/components/LinkUpdatePopup.vue'
import { defaultValueCtx, Editor, rootCtx } from '@milkdown/core'
import { gfm } from '@milkdown/preset-gfm'
import { Milkdown, useEditor } from '@milkdown/vue'
import { $prose } from '@milkdown/utils'
import { Plugin } from '@milkdown/prose/state'
import { usePluginViewFactory } from '@prosemirror-adapter/vue'
import { useEditTopicStore } from '@/stores/index.js'
import '@/assets/css/editor/code-theme.scss'
import 'katex/dist/katex.min.css'
//milkdown 插件
import { prism, prismConfig } from '@milkdown/plugin-prism'
import { math } from '@milkdown/plugin-math'
import { commonmark } from '@milkdown/preset-commonmark'
import { tooltipFactory } from '@milkdown/plugin-tooltip'
import { clipboard } from '@milkdown/plugin-clipboard'
import { indent } from '@milkdown/plugin-indent'
import { upload } from '@milkdown/plugin-upload'
import { history } from '@milkdown/plugin-history'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { automd } from '@milkdown/plugin-automd'
import { trailing } from '@milkdown/plugin-trailing'
import { insertLinkPlugin } from '@/components/milkdown/plugin/hyperlinkInsert.js'
import { diagram } from '@milkdown/plugin-diagram'

//编程语言支持
import bash from 'refractor/lang/bash'
import c from 'refractor/lang/c'
import cpp from 'refractor/lang/cpp'
import csharp from 'refractor/lang/csharp'
import css from 'refractor/lang/css'
import go from 'refractor/lang/go'
import haskell from 'refractor/lang/haskell'
import python from 'refractor/lang/python'
import java from 'refractor/lang/java'
import javascript from 'refractor/lang/javascript'
import jsx from 'refractor/lang/jsx'
import json from 'refractor/lang/json'
import kotlin from 'refractor/lang/kotlin'
import r from 'refractor/lang/r'
import rust from 'refractor/lang/rust'
import scala from 'refractor/lang/scala'
import sql from 'refractor/lang/sql'
import tsx from 'refractor/lang/tsx'
import typescript from 'refractor/lang/typescript'
import markdown from 'refractor/lang/markdown'
import { video } from '@/components/milkdown/plugin/video.js'

const props = defineProps({
  valueMarkdown: String,
  editorHeight: Number,
  isShowMenu: {
    type: Boolean,
    default: true
  },
  mode: String
})

const editorHeight = computed(() => props.editorHeight + 'px')
const container = ref()
const tooltip = tooltipFactory('Text')
const linkUpdatePopup = tooltipFactory('linkUpdate')
const pluginViewFactory = usePluginViewFactory()
const editorContent = ref('')
const emit = defineEmits(['update:valueMarkdown', 'update:mode'])
const editorInfo = useEditor((root) => {
  const editor = Editor.make()
    .config((ctx) => {
      if (props.mode) useEditTopicStore().setTopicInfo({ editorContext: ctx })

      ctx.set(rootCtx, root)
      ctx.set(defaultValueCtx, props.valueMarkdown)

      const listener = ctx.get(listenerCtx)
      listener.markdownUpdated((ctx, markdown, prevMarkdown) => {
        if (markdown !== prevMarkdown) {
          editorContent.value = markdown
          emit('update:valueMarkdown', markdown)
        }
      })

      ctx.set(prismConfig.key, {
        /*** @param {Refractor} refractor*/
        configureRefractor: (refractor) => {
          refractor.register(c)
          refractor.register(bash)
          refractor.register(cpp)
          refractor.register(csharp)
          refractor.register(css)
          refractor.register(go)
          refractor.register(haskell)
          refractor.register(python)
          refractor.register(markdown)
          refractor.register(java)
          refractor.register(javascript)
          refractor.register(json)
          refractor.register(jsx)
          refractor.register(kotlin)
          refractor.register(r)
          refractor.register(rust)
          refractor.register(scala)
          refractor.register(sql)
          refractor.register(tsx)
          refractor.register(typescript)
        }
      })

      ctx.set(tooltip.key, {
        view: pluginViewFactory({
          component: Tooltip
        })
      })

      ctx.set(linkUpdatePopup.key, {
        view: pluginViewFactory({
          component: LinkUpdatePopup
        })
      })
    })
    //撤回插件
    .use(history)
    //监听milkDown修改
    .use(listener)
    //CommonMark语法标准解析markDown
    .use(commonmark)
    //额外的功能包括链接自动识别删除线标签符号等等
    .use(gfm)
    //剪切板
    .use(clipboard)
    //缩进
    .use(indent)
    //上传和创建图像
    .use(upload)
    //对codeBlock的高亮支持
    .use(prism)
    //自动检测和应用 Markdown 语法
    .use(automd)
    //处理尾部空行
    .use(trailing)
    //工具提示
    .use(tooltip)
    //修改链接
    .use(linkUpdatePopup)
    //新增链接
    .use(insertLinkPlugin)
    //视频
    .use(video)
    //数学
    .use(math)
    //图
    .use(diagram)
    //自动修改字数
  return props.mode ? editor.use(
      $prose(
        () =>
          new Plugin({
            view: pluginViewFactory({
              component: Footer,
              root: () => (container.value ? container.value : root)
            })
          })
      )
  ) : editor
})
</script>

<template>
  <div ref="container">
    <MilkDownMenu v-if="isShowMenu" :editor-info="editorInfo"
                  :mode="mode" @update:mode="arg=>emit('update:mode',arg)" />
    <Milkdown class="content" :style="{minHeight:editorHeight}" />
  </div>
</template>

<style lang="scss" scoped>
.content {
  position: relative;
  width: 100%;

  :deep(.milkdown) {
    width: 90%;
    min-height: 500px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;

    h1, h2, h3, h4, h5, h6 {
      line-height: 1.5; /* 设置行高，确保文本不会与下一行重叠 */
    }

    h1 {
      font-size: 30px;
      font-weight: bold;

      &:before {
        content: '#';
        color: var(--blue-5);
        font-size: 25px;
        font-style: italic;
        font-weight: bold;
        margin-right: 10px;
        line-height: 1.5;
        vertical-align: middle;
      }
    }

    h2 {
      font-size: 28px;
      font-weight: 600;

      &:before {
        content: '#';
        color: var(--blue-5);
        font-size: 23px;
        font-weight: 600;
        font-style: italic;
        margin-right: 10px;
        line-height: 1.5;
        vertical-align: middle;
      }
    }

    h3 {
      font-size: 26px;
      font-weight: 600;

      &:before {
        content: '#';
        color: var(--blue-5);
        font-size: 21px;
        font-weight: 600;
        font-style: italic;
        margin-right: 10px;
        line-height: 1.5;
        vertical-align: middle;
      }
    }

    h4 {
      font-size: 24px;
      font-weight: 600;

      &:before {
        content: '#';
        color: var(--blue-5);
        font-size: 19px;
        font-weight: 600;
        font-style: italic;
        margin-right: 10px;
        line-height: 1.5;
        vertical-align: middle;
      }
    }

    h5 {
      font-size: 22px;
      font-weight: 600;

      &:before {
        content: '#';
        color: var(--blue-5);
        font-size: 17px;
        font-weight: 600;
        font-style: italic;
        margin-right: 10px;
        line-height: 1.5;
        vertical-align: middle;
      }
    }

    h6 {
      font-size: 20px;
      font-weight: 600;

      &:before {
        content: '#';
        color: var(--blue-5);
        font-size: 15px;
        font-weight: 600;
        font-style: italic;
        margin-right: 10px;
        line-height: 1.5;
        vertical-align: middle;
      }
    }

    table {
      padding: 1px;
      margin: 5px 0;

      p {
        padding: 10px 4px;
        border: 1px solid var(--blue-5);
      }
    }

    ul {
      list-style: disc;
    }

    ol {
      list-style: decimal;
    }

    blockquote {
      margin: 17px 0;
      padding: 17px;
      border-left: 5px solid var(--blue-5) !important;
      border-radius: 10px;
      background-color: var(--trans-blue-0) !important;
      line-height: 2rem;

      p {
        margin: 0;
      }
    }

    p {
      word-break: break-all;

      code {
        font-family: SF Mono,
        Menlo,
        Consolas,
        Liberation Mono,
        monospace;
        margin: 0 4px;
        background-color: var(--trans-blue-1);
        padding: 2px 4px;
        border-radius: 8px;
      }
    }

    pre {
      margin: 17px 0;
      border-radius: 5px;
      padding: 17px;
      background-color: var(--trans-white-5);
      position: relative;
      box-shadow: 0 1px 2px hsla(0, 0%, 0%, 0.05),
      0 1px 4px hsla(0, 0%, 0%, 0.05),
      0 2px 8px hsla(0, 0%, 0%, 0.05);
      overflow-x: auto;

      code {
        font-size: 15px;
        font-family: SF Mono,
        Menlo,
        Consolas,
        Liberation Mono,
        monospace;
        float: left;
        min-width: 100%;

        .code-line {
          display: block;
          padding-left: 16px;
          padding-right: 16px;
          margin-left: -16px;
          margin-right: -16px;
          border-left: 4px solid transparent;
        }

        .code-line.inserted {
          color: white;
          background-color: #2da44e;
        }

        .code-line.deleted {
          color: white;
          background-color: #cf222e;
        }

        .highlight-line {
          margin-left: -16px;
          margin-right: -16px;
          background-color: var(--trans-blue-1);
          border-left: 4px solid #80ccff;
        }

        .line-number::before {
          display: inline-block;
          width: 1rem;
          text-align: right;
          margin-right: 16px;
          margin-left: -8px;
          color: #bcc8d4;
          content: attr(line);
        }
      }
    }

    img {
      max-width: 100%;
    }

    a {
      cursor: pointer;
      font-weight: bold;
      color: var(--blue-5);
      text-decoration: underline;
      text-underline-offset: 3px;
      word-break: break-word;
    }

    table {
      border: 1px solid var(--blue-5);
      white-space: pre-wrap;

      th,
      td {
        border: 1px solid var(--blue-5);
        padding: 3px;
        text-align: left;
      }

      tr:nth-child(even) {
        background-color: var(--trans-blue-1);
      }
    }

    * &:not(.katex-html) {
      white-space: pre-wrap;
      word-break: break-word;

    }

    & > div:nth-child(1) {
      transition: all 0.2s;
      margin: 0 auto;
      min-height: v-bind(editorHeight);

      &:focus {
        outline: none;
      }
    }
  }
}
</style>
