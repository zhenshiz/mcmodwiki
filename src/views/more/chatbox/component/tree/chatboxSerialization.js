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
  PortraitRenderEvent,
  ThemeRenderEvent,
  ThemePortraitRenderEvent
} from '@/assets/more/chatbox/chatboxTheme.js'
import {
  ChatBoxDialogues,
  Click,
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

export const themeService = {
  /**
   * 辅助方法：实例化渲染事件列表
   * @param {Array} rawEvents JSON 中的原始事件数组
   * @param {Class} EventClass 要实例化的主题渲染事件类
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
        model.dialogBox.renderEvents = this._hydrateRenderEvents(
          jsonContent.dialogBox.renderEvents,
          ThemeRenderEvent,
        )
      }

      // --- Option ---
      if (jsonContent.option) {
        model.option = new Option()
        Object.assign(model.option, jsonContent.option)
        model.option.renderEvents = this._hydrateRenderEvents(
          jsonContent.option.renderEvents,
          ThemeRenderEvent,
        )
      }

      // --- KeyPrompt ---
      if (jsonContent.keyPrompt) {
        model.keyPrompt = new KeyPrompt()
        Object.assign(model.keyPrompt, jsonContent.keyPrompt)
        model.keyPrompt.renderEvents = this._hydrateRenderEvents(
          jsonContent.keyPrompt.renderEvents,
          ThemeRenderEvent,
        )
      }

      // --- FunctionalButton ---
      if (Array.isArray(jsonContent.functionalButton)) {
        model.functionalButton = jsonContent.functionalButton.map((btnData) => {
          const btn = new FunctionButton()
          Object.assign(btn, btnData)
          btn.renderEvents = this._hydrateRenderEvents(btnData.renderEvents, ThemeRenderEvent)
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

          p.renderEvents = this._hydrateRenderEvents(val.renderEvents, ThemePortraitRenderEvent)

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
   * 辅助方法：实例化对话或立绘的渲染事件列表
   */
  _hydrateRenderEvents(rawEvents, EventClass = BaseRenderEvent) {
    if (!Array.isArray(rawEvents)) return []
    return rawEvents.map((evtData) => {
      const evt = new EventClass()
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
              delete frame.dialogBox.renderEvents
            }

            if (frameData.video) {
              frame.video = new DialogueVideo()
              Object.assign(frame.video, frameData.video)
              frame.video.renderEvents = this._hydrateRenderEvents(frameData.video.renderEvents)
            }

            if (Array.isArray(frameData.options)) {
              frame.options = new DialogueOptionList()
              frame.options.options = frameData.options.map((opt) => {
                const instance = new DialogueOption()
                Object.assign(instance, opt)
                instance.click = Object.assign(new Click(), opt.click || {})
                delete instance.renderEvents
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
                  if (Array.isArray(pData.renderEvents)) {
                    p.renderEvents = this._hydrateRenderEvents(pData.renderEvents, PortraitRenderEvent)
                  }
                  return p
                }
              })
            }

            if (Array.isArray(frameData.renderEvents)) {
              frame.renderEvents = this._hydrateRenderEvents(frameData.renderEvents)
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

