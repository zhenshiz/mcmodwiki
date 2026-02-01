import { ref } from 'vue'
import {
  AnimationSequence,
  Attachment,
  BaseRenderEvent,
  ChatBoxTheme,
  DialogBox,
  FunctionButton,
  Keyframe,
  KeyPrompt,
  Option,
  Portrait,
  PortraitRenderEvent
} from '@/assets/more/chatbox/chatboxTheme.js'
import {
  ChatBoxDialogues,
  DialogueDialogBox,
  DialogueFrame,
  DialogueOption,
  DialogueOptionList,
  DialoguePortrait,
  DialogueReplacePortrait,
  DialogueVideo
} from '@/assets/more/chatbox/chatboxDialogues.js'
import { formatUtil } from '@/utils/formatUtil.js'

const PORTRAIT_MIGRATION_MAP = {
  'value': 'texture',
  'selectTexture': 'hoverTexture'
}

export function useFileSystem() {
  const rootHandle = ref(null)

  /**
   * 递归扫描文件夹，生成符合 Vue 渲染的数据结构
   * 参考了 Demo 中的 renderTree 逻辑，但这里返回数据而非 DOM
   */
  const scanDirectory = async (dirHandle, pathPrefix = '') => {
    const nodes = []

    // 遍历当前目录
    for await (const entry of dirHandle.values()) {
      const fullPath = pathPrefix ? `${pathPrefix}/${entry.name}` : entry.name

      const node = {
        name: entry.name,
        path: fullPath,
        kind: entry.kind,
        isFolder: entry.kind === 'directory',
        handle: entry,
        isOpen: true,
        children: [],
      }

      if (entry.kind === 'directory') {
        // 递归处理子目录
        node.children = await scanDirectory(entry, fullPath)
      } else {
        // 可以在这里做简单的文件类型标记
        if (entry.name.endsWith('.json')) node.type = 'json'
        else if (entry.name.endsWith('.png')) node.type = 'image'
      }

      nodes.push(node)
    }

    // 排序：文件夹在前
    return nodes.sort((a, b) => (a.isFolder === b.isFolder ? 0 : a.isFolder ? -1 : 1))
  }

  /**
   * 动作：打开文件夹
   */
  const openDirectory = async () => {
    try {
      const handle = await window.showDirectoryPicker({
        mode: 'readwrite',
        id: 'chatbox-editor-working-dir',
      })
      rootHandle.value = handle
      const tree = await scanDirectory(handle)
      return { tree, handle }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('打开文件夹失败:', err)
      return null
    }
  }

  /**
   * 动作：读取文件内容
   */
  const readFile = async (fileHandle) => {
    const file = await fileHandle.getFile()
    return await file.text()
  }

  /**
   * 动作：保存文件内容
   */
  const saveFile = async (fileHandle, content) => {
    const writable = await fileHandle.createWritable()
    await writable.write(content)
    await writable.close()
  }

  const scanProjectIndex = async (dirHandle) => {
    const animationKeys = new Set()
    const portraitKeys = new Set()

    const traverse = async (handle) => {
      for await (const entry of handle.values()) {
        if (entry.kind === 'directory') {
          await traverse(entry)
        } else if (entry.kind === 'file' && entry.name.endsWith('.json')) {
          try {
            const file = await entry.getFile()
            const text = await file.text()

            // 简单检查是否包含关键字，避免解析无关大文件
            let shouldParse = false
            if (text.includes('"customAnimation"')) shouldParse = true
            if (text.includes('"portrait"')) shouldParse = true

            if (shouldParse) {
              const json = JSON.parse(text)

              // 提取动画 Key
              if (json.customAnimation) {
                Object.keys(json.customAnimation).forEach(k => animationKeys.add(k))
              }
              // 提取立绘 Key
              if (json.portrait) {
                Object.keys(json.portrait).forEach(k => portraitKeys.add(k))
              }
            }
          } catch (e) {
            // 忽略解析失败
          }
        }
      }
    }

    if (dirHandle) {
      await traverse(dirHandle)
    }

    return {
      animations: Array.from(animationKeys),
      portraits: Array.from(portraitKeys)
    }
  }

  return {
    rootHandle,
    openDirectory,
    readFile,
    saveFile,
    scanDirectory,
    scanProjectIndex
  }
}

export const themeService = {
  /**
   * 辅助方法：实例化渲染事件列表
   * @param {Array} rawEvents JSON 中的原始事件数组
   * @param {Class} EventClass 要实例化的类 (BaseRenderEvent 或 PortraitRenderEvent)
   */
  _hydrateRenderEvents(rawEvents, EventClass) {
    if (!Array.isArray(rawEvents)) return []
    return rawEvents.map((evtData) => {
      const evt = new EventClass()
      Object.assign(evt, evtData)
      return evt
    })
  },

  /**
   * 将 JSON 字符串解析为 ChatBoxTheme 实例 (Hydration)
   */
  parseTheme(jsonString) {
    try {
      const jsonContent = JSON.parse(jsonString)

      // 1. 创建空实例
      const model = new ChatBoxTheme()

      // 2. 浅拷贝基础数据
      Object.assign(model, jsonContent)

      // 3. 恢复嵌套的类实例

      // --- DialogBox ---
      if (jsonContent.dialogBox) {
        model.dialogBox = new DialogBox()
        Object.assign(model.dialogBox, jsonContent.dialogBox)
        // 🔥 恢复渲染事件 (使用基础事件类)
        model.dialogBox.renderEvents = this._hydrateRenderEvents(
          jsonContent.dialogBox.renderEvents,
          BaseRenderEvent,
        )
      }

      // --- Option ---
      if (jsonContent.option) {
        model.option = new Option()
        Object.assign(model.option, jsonContent.option)
        // 🔥 恢复渲染事件
        model.option.renderEvents = this._hydrateRenderEvents(
          jsonContent.option.renderEvents,
          BaseRenderEvent,
        )
      }

      // --- KeyPrompt (通常没有渲染事件，但保持原样) ---
      if (jsonContent.keyPrompt) {
        model.keyPrompt = new KeyPrompt()
        Object.assign(model.keyPrompt, jsonContent.keyPrompt)
      }

      // --- FunctionalButton ---
      if (Array.isArray(jsonContent.functionalButton)) {
        model.functionalButton = jsonContent.functionalButton.map((btnData) => {
          const btn = new FunctionButton()
          Object.assign(btn, btnData)
          // 🔥 恢复渲染事件
          btn.renderEvents = this._hydrateRenderEvents(btnData.renderEvents, BaseRenderEvent)
          return btn
        })
      }

      // 4. 解析全局预设动画 (保持你原有的逻辑)
      if (jsonContent.customAnimation) {
        model.customAnimation = {}
        for (const [key, val] of Object.entries(jsonContent.customAnimation)) {
          const sequence = new AnimationSequence()
          let rawKeyframes = []
          if (Array.isArray(val)) {
            rawKeyframes = val
          } else if (val && Array.isArray(val.keyframes)) {
            rawKeyframes = val.keyframes
          }
          sequence.keyframes = rawKeyframes.map((kfData) => {
            const kf = new Keyframe()
            Object.assign(kf, kfData)
            return kf
          })
          model.customAnimation[key] = sequence
        }
      }

      // 5. 处理立绘 (Portrait)
      if (jsonContent.portrait) {
        model.portrait = {}
        for (const [key, val] of Object.entries(jsonContent.portrait)) {
          const p = new Portrait()
          Object.assign(p, val)

          formatUtil.migrateLegacyProperties(p, val, PORTRAIT_MIGRATION_MAP)

          // 恢复附件
          if (Array.isArray(val.attachment)) {
            p.attachment = val.attachment.map((attData) => {
              const att = new Attachment()
              Object.assign(att, attData)
              return att
            })
          }

          // 恢复自定义动画
          if (Array.isArray(val.customAnimation)) {
            p.customAnimation = val.customAnimation.map((kfData) => {
              const kf = new Keyframe()
              Object.assign(kf, kfData)
              return kf
            })
          }

          p.renderEvents = this._hydrateRenderEvents(val.renderEvents, PortraitRenderEvent)

          model.portrait[key] = p
        }
      }

      return model || {}
    } catch (e) {
      console.error('Theme 解析失败', e)
      throw new Error('文件格式错误或非有效的主题文件')
    }
  },

  /**
   * 将 Model 序列化为 JSON 字符串以便保存
   */
  stringifyTheme(model) {
    return JSON.stringify(model, null, 2)
  },
}

export const dialogueService = {
  /**
   * 辅助方法：实例化渲染事件列表 (复用 themeService 的逻辑或直接调用)
   */
  _hydrateRenderEvents(rawEvents) {
    if (!Array.isArray(rawEvents)) return []
    return rawEvents.map((evtData) => {
      const evt = new BaseRenderEvent()
      Object.assign(evt, evtData)
      return evt
    })
  },

  /**
   * 解析 JSON 字符串为 ChatBoxDialogues 实例
   */
  parseDialogue(jsonString) {
    try {
      const json = JSON.parse(jsonString)
      const model = new ChatBoxDialogues()

      Object.assign(model, json)

      if (json.dialogues) {
        model.dialogues = {}

        for (const [key, frames] of Object.entries(json.dialogues)) {
          // 遍历每一帧
          model.dialogues[key] = frames.map((frameData) => {
            const frame = new DialogueFrame()

            Object.assign(frame, frameData)

            if (frameData.dialogBox) {
              frame.dialogBox = new DialogueDialogBox()
              Object.assign(frame.dialogBox, frameData.dialogBox)
            }

            if (frameData.video) {
              frame.video = new DialogueVideo()
              Object.assign(frame.video, frameData.video)
            }

            if (Array.isArray(frameData.options)) {
              frame.options = new DialogueOptionList()
              frame.options.options = frameData.options.map((opt) => {
                const instance = new DialogueOption()
                Object.assign(instance, opt)
                return instance
              })
            }

            if (Array.isArray(frameData.portrait)) {
              frame.portrait = new DialoguePortrait()

              frame.portrait.portrait = frameData.portrait.map((pData) => {
                if (typeof pData === 'string') {
                  return pData
                } else {
                  const p = new DialogueReplacePortrait()
                  Object.assign(p, pData)

                  formatUtil.migrateLegacyProperties(p, pData, PORTRAIT_MIGRATION_MAP)
                  return p
                }
              })
            }

            if (Array.isArray(frameData.renderEvents)) {
              frame.renderEvents = frameData.renderEvents.map((evt) => {
                const e = new BaseRenderEvent()
                Object.assign(e, evt)
                return e
              })
            }

            return frame
          })
        }
      }

      return model || {}
    } catch (e) {
      console.error('Dialogue 解析失败', e)
      throw new Error('对话文件格式错误')
    }
  },

  stringifyDialogue(model) {
    return JSON.stringify(model, null, 2)
  },
}

export const resourceService = {
  /**
   * 加载资源包文件夹
   * @param {FileSystemDirectoryHandle} rootHandle
   * @returns {Promise<{textureMap: Map, suggestions: Array}>}
   */
  async loadResourcePack(rootHandle) {
    const textureMap = new Map()
    const suggestions = []

    /**
     * 递归遍历
     * @param {FileSystemDirectoryHandle} dirHandle
     * @param {string[]} pathStack 路径栈
     */
    const traverse = async (dirHandle, pathStack) => {
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const lowerName = entry.name.toLowerCase()
          // 支持图片资源
          if (
            lowerName.endsWith('.png') ||
            lowerName.endsWith('.jpg') ||
            lowerName.endsWith('.jpeg')
          ) {
            const file = await entry.getFile()
            const blobUrl = URL.createObjectURL(file)

            const parts = [...pathStack, entry.name]
            let resourceLocation = parts.join('/') // 默认兜底

            // 1. 查找 'assets' 目录的位置
            const assetsIndex = parts.indexOf('assets')

            if (assetsIndex !== -1) {
              if (parts.length > assetsIndex + 2) {
                const namespace = parts[assetsIndex + 1]
                const path = parts.slice(assetsIndex + 2).join('/')
                resourceLocation = `${namespace}:${path}`
              }
            } else {
              if (parts.length > 1) {
                const namespace = parts[0]
                const path = parts.slice(1).join('/')
                resourceLocation = `${namespace}:${path}`
              }
            }
            textureMap.set(resourceLocation, blobUrl)

            suggestions.push({
              label: entry.name,
              value: resourceLocation,
              description: resourceLocation
            })
          }
        } else if (entry.kind === 'directory') {
          await traverse(entry, [...pathStack, entry.name])
        }
      }
    }

    await traverse(rootHandle, [])
    return { textureMap, suggestions }
  },

  /**
   * 清理资源 (释放 BlobURL 内存)
   */
  disposeResources(textureMap) {
    if (!textureMap) return
    for (const url of textureMap.values()) {
      URL.revokeObjectURL(url)
    }
    textureMap.clear()
  },
}
