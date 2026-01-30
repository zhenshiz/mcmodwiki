<script setup>
import { defineExpose, onBeforeUnmount, ref, watch } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { TableKit } from '@tiptap/extension-table'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Youtube from '@tiptap/extension-youtube'
import { Mathematics } from '@tiptap/extension-mathematics'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

import { BiliBili } from '@/components/markdown/plugin/Bilibili.js'
import { Mermaid } from '@/components/markdown/plugin/Mermaid.js'
import { EnhancedCodeBlock } from '@/components/markdown/plugin/EnhancedCodeBlock.js'
import { HiddenText } from '@/components/markdown/plugin/HiddenText.js'
import {
  Admonition,
  AdmonitionContent,
  AdmonitionTitle
} from '@/components/markdown/plugin/Admonition.js'
import { StepItem, Steps } from '@/components/markdown/plugin/Steps.js'

import mermaid from 'mermaid'
import { common, createLowlight } from 'lowlight'
import 'katex/dist/katex.min.css'
import 'highlight.js/styles/atom-one-dark.css'
import TextAlign from '@tiptap/extension-text-align'
import TableOfContents, { getHierarchicalIndexes } from '@tiptap/extension-table-of-contents'
import { TextSelection } from '@tiptap/pm/state'
import { BetterLink } from '@/components/markdown/plugin/betterLink.js'

const props = defineProps({
  content: { type: String, default: '' }
})

const lowlight = createLowlight(common)
mermaid.initialize({ startOnLoad: false })

// 存储提取的标题
const headings = ref([])

const editor = useEditor({
  content: props.content,
  editable: false,
  editorProps: {
    attributes: {
      spellcheck: 'false'
    },
  },
  extensions: [
    StarterKit.configure({
      codeBlock: false,
      link: false,
      table: false
    }),
    EnhancedCodeBlock,
    CodeBlockLowlight.configure({ lowlight }),
    BetterLink,
    Image.configure({ allowBase64: true }),
    TableKit,
    Superscript,
    Subscript,
    TaskList,
    TaskItem.configure({ nested: true }),
    Mathematics,
    Youtube.configure({ controls: true, nocookie: true }),
    BiliBili,
    Mermaid,
    HiddenText,
    Admonition,
    AdmonitionTitle,
    AdmonitionContent,
    Steps,
    StepItem,
    TextAlign.configure({
      types: ['heading', 'paragraph']
    }),
    TableOfContents.configure({
      getIndex: getHierarchicalIndexes,
      getId: (textContent) => {
        return textContent
          .trim()
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\u4e00-\u9fa5-]/g, '')
      },
      onUpdate: content => {
        headings.value = content
      }
    })
  ]
})

const scrollToHeading = (id) => {
  if (editor.value) {
    const element = editor.value.view.dom.querySelector(`[data-toc-id="${id}"]`)

    if (element) {
      // 1. 设置编辑器焦点与内部选区
      const pos = editor.value.view.posAtDOM(element, 0)
      const tr = editor.value.view.state.tr
      tr.setSelection(new TextSelection(tr.doc.resolve(pos)))
      editor.value.view.dispatch(tr)

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })

      history.pushState(null, null, `#${id}`)
    }
  }
}

// 暴露给 ModWiki 使用
defineExpose({ headings, scrollToHeading })

watch(() => props.content, (newValue) => {
  editor.value.commands.setContent(newValue, false)
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="read-only-container dark:text-white">
    <EditorContent :editor="editor" />
  </div>
</template>

<style lang="scss" scoped>
.read-only-container {
  position: relative;
  width: 100%;

  :deep(.tiptap) {
    outline: none;
    width: 90%;
    margin: 50px auto;
    min-height: 500px;

    &:focus {
      outline: none;
      box-shadow: none;
    }

    [data-toc-id] {
      scroll-margin-top: 40px;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 15px;
      line-height: 1.5;
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

    ul,
    ol {
      margin: 0.5rem 0;
    }

    ul ul,
    ul ol,
    ol ul,
    ol ol {
      margin: 0.2rem 0 0.2rem 1.5rem;
    }

    ul {
      list-style: disc;

      ul {
        list-style-type: circle;

        ul {
          list-style-type: square;
        }
      }
    }

    ol {
      list-style: decimal;
    }

    ul[data-type='taskList'] {
      list-style: none;
      margin-left: 0;
      padding: 0;

      li {
        align-items: flex-start;
        display: flex;
        margin: 8px 0;

        >label {
          flex: 0 0 auto;
          margin-right: 12px;
          user-select: none;
          display: flex;
          align-items: center;
          padding-top: 4px;

          input[type='checkbox'] {
            cursor: pointer;
            appearance: none;
            width: 18px;
            height: 18px;
            background-color: var(--trans-blue-0);
            border: 1.5px solid var(--trans-blue-2);
            border-radius: 4px;
            display: grid;
            place-content: center;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

            &:hover {
              border-color: var(--blue-5);
              background-color: var(--trans-blue-1);
            }

            &:checked {
              background-color: var(--blue-5);
              border-color: var(--blue-5);

              &::before {
                content: "";
                width: 10px;
                height: 10px;
                clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
                background-color: white;
              }
            }
          }
        }

        >div {
          flex: 1 1 auto;
          color: var(--font-color-2);
          line-height: 1.6;

          p {
            margin: 0;
          }
        }

        &[data-checked="true"] {
          >div {
            text-decoration: line-through;
            color: var(--font-color-0);
            opacity: 0.6;
            filter: blur(0.2px);
          }
        }
      }

      ul[data-type='taskList'] {
        padding-left: 1.5rem;
        border-left: 1px dashed var(--trans-blue-1);
        margin-left: 8px;
      }
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

    a {
      color: var(--blue-5);
      text-decoration: none;
      border-bottom: 1px solid rgba(128, 204, 255, 0.4);
      transition: all 0.2s ease-in-out;
      cursor: pointer;
      font-weight: 500;

      &:hover {
        color: var(--blue-5);
        border-bottom: 1.5px solid var(--blue-5);
        border-radius: 2px;
      }

      &:focus {
        outline: none;
        background-color: var(--trans-blue-2);
      }
    }

    img {
      margin: 0 auto;
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

    &>div:nth-child(1) {
      transition: all 0.2s;
      margin: 0 auto;
      min-height: v-bind(editorHeight);

      &:focus {
        outline: none;
      }
    }

    .video-container {
      display: flex;
      justify-content: center;
      margin: 2rem auto;
      width: 100%;
      max-width: 800px;
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
      border: 1px solid var(--trans-blue-1);

      iframe {
        border: none;
        width: 100%;
        aspect-ratio: 16 / 9;
        background: #000;
        display: block;
      }

      &.ProseMirror-selectednode {
        outline: none;
        border-color: var(--blue-5);
        box-shadow: 0 0 20px var(--trans-blue-2);
        transform: scale(1.01);
      }
    }

    span[data-type="hidden-text"] {
      background-color: #333 !important;
      color: #333 !important;
      border-radius: 4px;
      padding: 0 4px;
      transition: all 0.3s ease;

      &:hover {
        background-color: transparent !important;
        color: inherit !important;
      }
    }

    div[data-youtube-video] {
      display: flex;
      justify-content: center;

      iframe {
        aspect-ratio: 16 / 9;
        display: block;
      }
    }


  }
}
</style>
