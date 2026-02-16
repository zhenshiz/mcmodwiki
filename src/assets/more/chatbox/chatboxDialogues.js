import { AutoClean } from '@/assets/generator/class'
import { EditorTypes } from '@/assets/generator/editorType'
import { BaseRenderEvent, Component, Portrait, PortraitRenderEvent } from './chatboxTheme.js'
import {
  autoCompleteDataSources,
  eventType,
  renderEventTrigger
} from '@/assets/more/chatbox/enumTypes.js'
import { useChatBoxEditorStore } from '@/stores/index.js'

//对话框
export class DialogueDialogBox extends AutoClean {
  constructor() {
    super()
    this.name = ''
    this.text = ''
    this.renderEvents = []
  }

  static {
    DialogueDialogBox.defineField('name', {
      label: '名称',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TRANSLATABLE_KEYS }
    })
    DialogueDialogBox.defineField('text', {
      label: '对话内容',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TRANSLATABLE_KEYS }
    })
    DialogueDialogBox.defineField('renderEvents', {
      label: '渲染事件',
      type: EditorTypes.OBJECT_ARR,
      tips: '本编辑器无法测试，请配置好到游戏内测试（你也不可能指望我这个编辑器给你执行mc指令吧）',
      props: {
        itemConstructor: BaseRenderEvent,
        itemLabel: '渲染事件',
        displayTemplate: (item) => {
          const triggerEnum = renderEventTrigger('portrait')
          const tLabel = triggerEnum.getLabel(item.trigger) || item.trigger || '未选择时机'
          const eLabel = eventType.getLabel(item.type) || item.type || '未选择类型'
          return `${tLabel.value} -> ${eLabel.value}`
        }
      }
    })
  }
}

//点击事件
export class Click extends AutoClean {
  constructor() {
    super()
    this.type = ''
    this.value = ''
  }

  static {
    Click.defineField('type', {
      label: '点击事件类型',
      type: EditorTypes.SELECT,
      props: { options: eventType.values() }
    })
    Click.defineField('value', { label: '事件参数', type: EditorTypes.INPUT })
  }
}

//选项
export class DialogueOption extends AutoClean {
  constructor() {
    super()
    this.text = ''
    this.isLock = false
    this.unlockCommand = ''
    this.next = ''
    this.tooltip = ''

    this.click = new Click()
  }

  static {
    DialogueOption.defineField('text', {
      label: '选项内容',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TRANSLATABLE_KEYS }
    })
    DialogueOption.defineField('isLock', { label: '是否锁定', type: EditorTypes.SWITCH })
    DialogueOption.defineField('unlockCommand', {
      label: '解锁指令',
      type: EditorTypes.INPUT,
      tips: '例如: execute if score @s ...'
    })
    DialogueOption.defineField('next', {
      label: '跳转对话',
      type: EditorTypes.INPUT,
      tips: '填数字为当前分组对应序号的对话，字符串是跳转到对应的分组，不填默认下一句话，this留在当前对话'
    })
    DialogueOption.defineField('tooltip', { label: '悬浮提示', type: EditorTypes.INPUT })
    DialogueOption.defineField('click', {
      label: '点击事件',
      type: EditorTypes.OBJECT,
      props: { clazz: Click }
    })
  }
}

export class DialogueOptionList extends AutoClean{
  constructor(){
    super()

    this.options = []
    this.renderEvents = []
  }

  static {
    DialogueOptionList.defineField('options', {
      label: '选项配置',
      type: EditorTypes.OBJECT_ARR,
      props: {
        itemLabel: '选项',
        itemConstructor: DialogueOption,
        displayTemplate: (item)=> useChatBoxEditorStore().getTranslatableLabel(item.text)
      }
    })
    DialogueOptionList.defineField('renderEvents', {
      label: '渲染事件',
      type: EditorTypes.OBJECT_ARR,
      tips: '本编辑器无法测试，请配置好到游戏内测试（你也不可能指望我这个编辑器给你执行mc指令吧）',
      props: {
        itemConstructor: BaseRenderEvent,
        itemLabel: '渲染事件',
        displayTemplate: (item) => {
          const triggerEnum = renderEventTrigger('portrait')
          const tLabel = triggerEnum.getLabel(item.trigger) || item.trigger || '未选择时机'
          const eLabel = eventType.getLabel(item.type) || item.type || '未选择类型'
          return `${tLabel.value} -> ${eLabel.value}`
        }
      }
    })
  }

  toJSON() {
    return this.options
  }
}

//视频
export class DialogueVideo extends Component {
  constructor() {
    super()
    // Java Init Block
    this.x = 0
    this.y = 0
    this.width = 100
    this.height = 100
    this.renderOrder = -1

    this.path = ''
    this.canControl = true
    this.canSkip = true
    this.loop = false
  }

  static {
    DialogueVideo.defineField('path', {
      label: '视频路径',
      type: EditorTypes.INPUT,
      tips: '相对于 .minecraft 文件夹或绝对路径'
    })
    DialogueVideo.defineField('canControl', { label: '允许控制', type: EditorTypes.SWITCH })
    DialogueVideo.defineField('canSkip', { label: '允许跳过', type: EditorTypes.SWITCH })
    DialogueVideo.defineField('loop', { label: '循环播放', type: EditorTypes.SWITCH })
  }
}

// 覆盖立绘
export class DialogueReplacePortrait extends Portrait {
  constructor() {
    super()
    //Java init
    this.type = null
    this.texture = null
    this.hoverTexture = null
    this.itemCount = null
    this.customItemData = null
    this.animation = null
    this.loop = false
    this.customAnimation = null
    this.attachment = null
    this.x = null
    this.y = null
    this.width = null
    this.height = null
    this.scale = null
    this.alignX = null
    this.alignY = null
    this.renderOrder = null
    this.brightness = null
    this.opacity = null
    this.angle = null
    this.hidden = false
    this.renderEvents = null

    this.id = ''
    this.replace = false
  }

  static {
    DialogueReplacePortrait.defineField('id', {
      label: '立绘 ID',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.PORTRAIT }
    })

    DialogueReplacePortrait.defineField('replace', {
      label: '覆盖模式',
      type: EditorTypes.SWITCH,
      tips: '开启后，将替换掉场上同 ID 的旧立绘，而不是添加新立绘'
    })
  }
}

export class DialoguePortrait extends AutoClean {
  constructor() {
    super()
    this.portrait = []
    this.renderEvents = []
  }

  static {
    DialoguePortrait.defineField('portrait', {
      label: '立绘列表',
      type: EditorTypes.ANY_ARR,
      props: {
        types: [{
          value: 'string',
          editorType: EditorTypes.AUTOCOMPLETE,
          props: { dataSource: autoCompleteDataSources.PORTRAIT }
        }, 'object'],
        objectConstructor: DialogueReplacePortrait,
        displayTemplate: '{id}'
      }
    })
    DialoguePortrait.defineField('renderEvents', {
      label: '渲染事件',
      type: EditorTypes.OBJECT_ARR,
      props: {
        itemConstructor: PortraitRenderEvent,
        itemLabel: '渲染事件',
        displayTemplate: (item) => {
          const triggerEnum = renderEventTrigger('portrait')
          const tLabel = triggerEnum.getLabel(item.trigger) || item.trigger || '未选择时机'
          const eLabel = eventType.getLabel(item.type) || item.type || '未选择类型'
          return `${tLabel.value} -> ${eLabel.value}`
        }
      }
    })
  }

  toJSON() {
    return this.portrait
  }
}

// 单帧对话 (Dialogues)
export class DialogueFrame extends AutoClean {
  constructor() {
    super()
    this.dialogBox = new DialogueDialogBox()
    this.portrait = new DialoguePortrait() // List<JsonElement>
    this.options = new DialogueOptionList() // List<Option>
    this.video = new DialogueVideo() // Video

    this.sound = ''
    this.command = null
    this.backgroundImage = null

    this.clearOldPortrait = true
    this.removePortrait = [] // List<String>
    this.renderEvents = []
  }

  static {
    DialogueFrame.defineField('sound', {
      label: '播放音效',
      type: EditorTypes.INPUT
    })
    DialogueFrame.defineField('command', { label: '执行指令', type: EditorTypes.INPUT })
    DialogueFrame.defineField('backgroundImage', {
      label: '背景图片',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE }
    })

    // === 立绘控制 ===
    DialogueFrame.defineField('clearOldPortrait', { label: '清除旧立绘', type: EditorTypes.SWITCH })
    DialogueFrame.defineField('removePortrait', {
      label: '移除指定立绘',
      type: EditorTypes.STRING_ARR,
      tips: '输入要移除的立绘 ID'
    })

    DialogueFrame.defineField('renderEvents', {
      label: '渲染事件',
      type: EditorTypes.OBJECT_ARR,
      props: {
        itemConstructor: BaseRenderEvent,
        itemLabel: '渲染事件',
        displayTemplate: (item) => {
          const triggerEnum = renderEventTrigger('portrait')
          const tLabel = triggerEnum.getLabel(item.trigger) || item.trigger || '未选择时机'
          const eLabel = eventType.getLabel(item.type) || item.type || '未选择类型'
          return `${tLabel.value} -> ${eLabel.value}`
        }
      }
    })
  }
}

//对话文件
export class ChatBoxDialogues extends AutoClean {
  constructor() {
    super()
    //全局设置
    this.$introduce = null
    this.isEsc = true
    this.isPause = true
    this.isHistoricalSkip = true
    this.isScreen = null
    this.theme = null
    this.animationFPS = 60
    this.autoPlayTick = 20
    this.maxTriggerCount = -1
    this.criteria = null

    // Map<String, List<DialogueFrame>>
    this.dialogues = {}
  }

  static {
    ChatBoxDialogues.defineField('$introduce', {
      label: '标识',
      type: EditorTypes.INPUT,
      tips: '纯装饰作用，仅提供建议填写'
    })
    ChatBoxDialogues.defineField('isEsc', { label: '允许 ESC 跳过', type: EditorTypes.SWITCH })
    ChatBoxDialogues.defineField('isPause', { label: '对话时暂停游戏', type: EditorTypes.SWITCH })
    ChatBoxDialogues.defineField('isHistoricalSkip', {
      label: '允许历史回溯',
      type: EditorTypes.SWITCH
    })
    ChatBoxDialogues.defineField('isScreen', { label: '是否为屏幕主题', type: EditorTypes.SWITCH })
    ChatBoxDialogues.defineField('theme', {
      label: '绑定的主题文件',
      type: EditorTypes.INPUT,
      tips: '进入对话时会自动设置为这个主题'
    })
    ChatBoxDialogues.defineField('animationFPS', {
      label: '动画 FPS',
      type: EditorTypes.NUMBER_INPUT
    })
    ChatBoxDialogues.defineField('autoPlayTick', {
      label: '自动播放间隔 (Tick)',
      type: EditorTypes.NUMBER_INPUT
    })
    ChatBoxDialogues.defineField('maxTriggerCount', {
      label: '最大触发次数',
      type: EditorTypes.NUMBER_INPUT,
      tips: '-1 为无限'
    })
    ChatBoxDialogues.defineField('criteria', {
      label: '进度触发条件',
      type: EditorTypes.INPUT,
      tips: 'JSON 格式的进度触发器'
    })
  }
}
