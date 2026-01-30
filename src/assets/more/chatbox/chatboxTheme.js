import { AutoClean } from '@/assets/generator/class'
import { EditorTypes } from '@/assets/generator/editorType'
import {
  alignXList,
  alignYList,
  attachmentType,
  autoCompleteDataSources,
  easing,
  eventType,
  functionalButtonType,
  portraitType,
  renderEventTrigger,
  textAlign
} from '@/assets/more/chatbox/enumTypes.js'
import { formatUtil } from '@/utils/formatUtil'

const DEFAULT_FLOAT = 0.0

const EDITOR_NONE = '游戏内生效，本编辑器无效'

const showOnlyIn = (...types) => {
  return (model) => types.some((t) => formatUtil.equalsIgnoreCase(model.type, t))
}
const hideIn = (...types) => {
  return (model) => !types.some((t) => formatUtil.equalsIgnoreCase(model.type, t))
}

// 基础渲染事件
export class BaseRenderEvent extends AutoClean {
  constructor() {
    super()
    this.trigger = renderEventTrigger().start
    this.type = ''
    this.value = ''
  }

  static {
    BaseRenderEvent.defineField('trigger', {
      label: '触发时机',
      type: EditorTypes.SELECT,
      props: {
        options: renderEventTrigger().values()
      }
    })
    BaseRenderEvent.defineField('type', {
      label: '事件类型',
      type: EditorTypes.SELECT,
      props: {
        options: eventType.values()
      }
    })
    BaseRenderEvent.defineField('value', {
      label: '事件参数',
      type: EditorTypes.INPUT
    })
  }
}

// 立绘渲染事件
export class PortraitRenderEvent extends BaseRenderEvent {
  constructor() {
    super()
  }

  static {
    PortraitRenderEvent.defineOverride('trigger', {
      props: {
        options: renderEventTrigger('portrait').values()
      }
    })
  }
}

// 渲染附件
export class Attachment extends AutoClean {
  constructor() {
    super()
    this.type = attachmentType.TEXTURE
    this.value = ''
    this.x = 0
    this.y = 0
    this.width = 10
    this.height = 10
    this.textAlign = textAlign.LEFT
    this.textColor = -1
    this.lineBreak = false
  }

  static {
    Attachment.defineField('type', {
      label: '附件类型',
      type: EditorTypes.SELECT,
      props: { options: attachmentType.values() }
    })
    Attachment.defineField('texture_value', {
      modelKey: 'value',
      label: '图片路径',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE },
      showIf: showOnlyIn(attachmentType.TEXTURE)
    })
    Attachment.defineField('text_value', {
      modelKey: 'value',
      label: '文本内容',
      type: EditorTypes.INPUT,
      showIf: showOnlyIn(attachmentType.TEXT)
    })
    Attachment.defineField('x', { label: 'X 坐标 (%)', type: EditorTypes.NUMBER_INPUT })
    Attachment.defineField('y', { label: 'Y 坐标 (%)', type: EditorTypes.NUMBER_INPUT })
    Attachment.defineField('height', {
      label: '高度',
      type: EditorTypes.NUMBER_INPUT,
      showIf: showOnlyIn(attachmentType.TEXTURE)
    })
    Attachment.defineField('texture_width', {
      modelKey: 'width',
      label: '宽度',
      type: EditorTypes.NUMBER_INPUT,
      showIf: showOnlyIn(attachmentType.TEXTURE)
    })
    Attachment.defineField('text_width', {
      modelKey: 'width',
      label: '行宽',
      type: EditorTypes.NUMBER_INPUT,
      showIf: showOnlyIn(attachmentType.TEXT)
    })
    Attachment.defineField('textAlign', {
      label: '文本对齐',
      type: EditorTypes.SELECT,
      props: { options: textAlign.values() },
      showIf: showOnlyIn(attachmentType.TEXT)
    })
    Attachment.defineField('lineBreak', {
      label: '自动换行',
      type: EditorTypes.SWITCH,
      showIf: showOnlyIn(attachmentType.TEXT)
    })
    Attachment.defineField('textColor', {
      label: '文本颜色',
      type: EditorTypes.COLOR,
      showIf: showOnlyIn(attachmentType.TEXT)
    })
  }

  getStyle(screenW, screenH) {
    const rawX = (this.x / 100) * screenW
    const rawY = (this.y / 100) * screenH
    const rawW = (this.width / 100) * screenW
    const rawH = (this.height / 100) * screenH

    const style = {
      position: 'absolute',
      left: `${rawX}px`,
      top: `${rawY}px`,
      display: 'block',
      zIndex: 2000
    }

    if (formatUtil.equalsIgnoreCase(this.type, attachmentType.TEXTURE)) {
      style.width = `${rawW}px`
      style.height = `${rawH}px`
    } else {
      style.width = `${rawW}px`
      style.whiteSpace = this.lineBreak ? 'normal' : 'nowrap'
    }

    return style
  }
}

//动画
export class Keyframe extends AutoClean {
  constructor() {
    super()
    this.time = 1
    this.x = null
    this.y = null
    this.xOffset = null
    this.yOffset = null
    this.scale = null
    this.brightness = null
    this.opacity = null
    this.angle = null
    this.easing = null
    this.texture = null
    this.attachment = []
  }

  static {
    Keyframe.defineField('time', {
      label: '持续时间 (帧)',
      tips: '动画持续的帧数 (默认60帧=1秒)',
      type: EditorTypes.NUMBER_INPUT
    })
    Keyframe.defineField('easing', {
      label: '缓动函数',
      type: EditorTypes.SELECT,
      props: { options: easing.values() }
    })
    Keyframe.defineField('x', {
      label: 'X 坐标 (%)',
      tips: '绝对定位：直接移动到屏幕宽度的百分比位置',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 0.5 }
    })
    Keyframe.defineField('y', {
      label: 'Y 坐标 (%)',
      tips: '绝对定位：直接移动到屏幕高度的百分比位置',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 0.5 }
    })
    Keyframe.defineField('xOffset', {
      label: 'X 偏移 (%)',
      tips: '相对偏移：基于当前位置，再叠加屏幕宽度的百分比位移',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 0.5 }
    })
    Keyframe.defineField('yOffset', {
      label: 'Y 偏移 (%)',
      tips: '相对偏移：基于当前位置，再叠加屏幕高度的百分比位移',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 0.5 }
    })
    Keyframe.defineField('scale', {
      label: '缩放',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 0.1 }
    })
    Keyframe.defineField('angle', {
      label: '旋转',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 1 }
    })
    Keyframe.defineField('opacity', {
      label: '透明度',
      type: EditorTypes.SLIDER,
      props: { min: 0, max: 100 }
    })
    Keyframe.defineField('brightness', {
      label: '亮度',
      type: EditorTypes.SLIDER,
      props: { min: 0, max: 200 }
    })
    Keyframe.defineField('texture', {
      label: '切换材质',
      tips: EDITOR_NONE,
      type: EditorTypes.INPUT
    })
  }
}

//基础组件
export class Component extends AutoClean {
  constructor() {
    super()
    this.x = 0
    this.y = 0
    this.width = 10
    this.height = 10
    this.scale = 1
    this.alignX = alignXList.LEFT
    this.alignY = alignYList.TOP
    this.renderOrder = null
    this.brightness = 100
    this.opacity = 100
    this.angle = 0
    this.hidden = false

    // Java: public List<RenderEvent> renderEvents;
    this.renderEvents = []
  }

  static {
    Component.defineField('hidden', { label: '默认隐藏', type: EditorTypes.SWITCH })
    Component.defineField('x', {
      label: 'X坐标 (%)',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 0.5 }
    })
    Component.defineField('y', {
      label: 'Y坐标 (%)',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 0.5 }
    })
    Component.defineField('renderOrder', {
      label: '层级 (Z)',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 1 }
    })
    Component.defineField('width', {
      label: '宽度 (%)',
      type: EditorTypes.NUMBER_INPUT,
      props: { min: 0 }
    })
    Component.defineField('height', {
      label: '高度 (%)',
      type: EditorTypes.NUMBER_INPUT,
      props: { min: 0 }
    })
    Component.defineField('alignX', {
      label: '水平对齐',
      type: EditorTypes.SELECT,
      props: { options: alignXList.values() }
    })
    Component.defineField('alignY', {
      label: '垂直对齐',
      type: EditorTypes.SELECT,
      props: { options: alignYList.values() }
    })
    Component.defineField('scale', {
      label: '缩放',
      type: EditorTypes.NUMBER_INPUT,
      props: { step: 0.1 }
    })
    Component.defineField('angle', {
      label: '旋转',
      type: EditorTypes.SLIDER,
      props: { min: -180, max: 180 }
    })
    Component.defineField('opacity', {
      label: '透明度',
      type: EditorTypes.SLIDER,
      props: { min: 0, max: 100 }
    })
    Component.defineField('brightness', {
      label: '亮度',
      type: EditorTypes.SLIDER,
      props: { min: 0, max: 200 }
    })
    Component.defineField('renderEvents', {
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

  getStyle(screenW, screenH) {
    const rawX = (this.x / 100) * screenW
    const rawY = (this.y / 100) * screenH
    const rawW = (this.width / 100) * screenW
    const rawH = (this.height / 100) * screenH

    let finalX = rawX
    if (formatUtil.equalsIgnoreCase(this.alignX, 'CENTER')) {
      finalX = rawX + screenW * 0.5 - rawW / 2
    } else if (formatUtil.equalsIgnoreCase(this.alignX, 'RIGHT')) {
      finalX = rawX + screenW - rawW
    }

    let finalY = rawY
    if (formatUtil.equalsIgnoreCase(this.alignY, 'CENTER')) {
      finalY = rawY + screenH * 0.5 - rawH / 2
    } else if (formatUtil.equalsIgnoreCase(this.alignY, 'BOTTOM')) {
      finalY = rawY + screenH - rawH
    }

    return {
      position: 'absolute',
      left: `${finalX}px`,
      top: `${finalY}px`,
      width: `${rawW}px`,
      height: `${rawH}px`,
      transform: `rotate(${this.angle}deg) scale(${this.scale})`,
      transformOrigin: 'center center',
      opacity: this.opacity / 100,
      filter: `brightness(${this.brightness}%)`,
      zIndex: this.renderOrder + 1000,
      display: this.hidden ? 'none' : 'block'
    }
  }
}

// 按键提示
export class KeyPrompt extends Component {
  constructor() {
    super()
    // Java Init Block
    this.renderOrder = 40

    this.visible = true
    this.mouseTextureWidth = 16.0
    this.mouseTextureHeight = 16.0
    this.rightClickTexture = null
    this.scrollTexture = null
  }

  static {
    KeyPrompt.defineField('visible', { label: '启用提示', type: EditorTypes.SWITCH })
    KeyPrompt.defineField('mouseTextureWidth', {
      label: '鼠标图标宽 (px)',
      type: EditorTypes.NUMBER_INPUT
    })
    KeyPrompt.defineField('mouseTextureHeight', {
      label: '鼠标图标高 (px)',
      type: EditorTypes.NUMBER_INPUT
    })
    KeyPrompt.defineField('rightClickTexture', {
      label: '右键图标',
      tips: EDITOR_NONE,
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE }
    })
    KeyPrompt.defineField('scrollTexture', {
      label: '滚轮图标',
      tips: EDITOR_NONE,
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE }
    })

    KeyPrompt.excludeFields(['width', 'height', 'angle', 'opacity', 'brightness'])
  }
}

// 立绘
export class Portrait extends Component {
  constructor() {
    super()
    // Java Init Block: { this.renderOrder = 20; }
    this.renderOrder = 20

    this.type = portraitType.TEXTURE
    this.texture = null
    this.hoverTexture = null
    this.itemCount = 1
    this.customItemData = []
    this.animation = null
    this.loop = false

    // Java: public List<Keyframe> customAnimation;
    this.customAnimation = []
    // Java: public Attachment[] attachment;
    this.attachment = []
  }

  static {
    Portrait.defineField('type', {
      label: '类型',
      type: EditorTypes.SELECT,
      props: { options: portraitType.values() }
    })

    // 仅当类型为图片时
    Portrait.defineField('texture_texture', {
      modelKey: 'texture',
      label: '图片路径',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE },
      showIf: showOnlyIn(portraitType.TEXTURE)
    })
    Portrait.defineField('texture_hoverTexture', {
      modelKey: 'hoverTexture',
      label: '鼠标悬浮时图片',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE },
      showIf: showOnlyIn(portraitType.TEXTURE)
    })
    // 仅当类型为 ITEM 时
    Portrait.defineField('item_texture', {
      modelKey: 'texture',
      label: '物品 ID',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.ITEM },
      showIf: showOnlyIn(portraitType.ITEM)
    })
    Portrait.defineField('item_hoverTexture', {
      modelKey: 'hoverTexture',
      label: '鼠标悬浮时物品',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.ITEM },
      showIf: showOnlyIn(portraitType.ITEM)
    })
    Portrait.defineField('itemCount', {
      label: '数量',
      type: EditorTypes.NUMBER_INPUT,
      props: { min: 1, step: 1 },
      showIf: showOnlyIn(portraitType.ITEM)
    })
    Portrait.defineField('customItemData', {
      label: '自定义物品模型数据',
      type: EditorTypes.NUMBER_INPUT,
      tips: EDITOR_NONE,
      props: { step: 1 },
      showIf: showOnlyIn(portraitType.ITEM)
    })
    // 仅当类型为 PLAYER_HEAD 时
    Portrait.defineField('player_head_texture', {
      modelKey: 'texture',
      label: '玩家 ID',
      type: EditorTypes.INPUT,
      showIf: showOnlyIn(portraitType.PLAYER_HEAD)
    })
    Portrait.defineField('player_head_hoverTexture', {
      modelKey: 'hoverTexture',
      label: '鼠标悬浮时玩家ID',
      type: EditorTypes.INPUT,
      showIf: showOnlyIn(portraitType.PLAYER_HEAD)
    })
    Portrait.defineField('animation', {
      label: '预设动画',
      type: EditorTypes.AUTOCOMPLETE,
      tips: '只能获取当前主题文件的预设动画补全，但是你可以使用其它主题文件的预设动画',
      props: { dataSource: autoCompleteDataSources.PRESET_ANIMATION }
    })
    Portrait.defineField('customAnimation', {
      label: '自定义动画',
      type: EditorTypes.OBJECT_ARR,
      props: { itemConstructor: Keyframe, itemLabel: 'Keyframe', displayTemplate: '{time}帧' }
    })
    Portrait.defineField('loop', { label: '循环播放', type: EditorTypes.SWITCH })
    Portrait.defineField('attachment', {
      label: '渲染附件',
      type: EditorTypes.OBJECT_ARR,
      props: { itemConstructor: Attachment, itemLabel: '渲染附件' }
    })

    //item要去除width和height
    Portrait.defineOverride('width', {
      showIf: hideIn(portraitType.ITEM)
    })
    Portrait.defineOverride('height', {
      showIf: hideIn(portraitType.ITEM)
    })
    // 覆盖渲染事件使用更加丰富的那版
    Portrait.defineOverride('renderEvents', {
      props: {
        itemConstructor: PortraitRenderEvent
      }
    })
  }
}

// 功能按钮
export class FunctionButton extends Portrait {
  constructor() {
    super()
    // Java Init Block 里的覆写
    this.width = 5.0
    this.height = 8.0
    this.alignX = alignXList.RIGHT
    this.alignY = alignYList.BOTTOM
    this.renderOrder = 30

    this.x = null
  }

  static {
    FunctionButton.defineField('functionType', {
      modelKey: 'type',
      label: '功能类型',
      type: EditorTypes.SELECT,
      props: { options: functionalButtonType.values() }
    })
    FunctionButton.defineField('texture', {
      label: '贴图',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE }
    })
    FunctionButton.defineField('hoverTexture', {
      label: '鼠标悬浮时或功能激活时的贴图',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE }
    })

    FunctionButton.defineOverride('renderEvents', {
      props: {
        itemConstructor: BaseRenderEvent
      }
    })

    //排除无用参数
    FunctionButton.excludeFields([
      'type',
      'animation',
      'customAnimation',
      'attachment',
      'loop'
    ])
  }
}

//选项
export class Option extends Portrait {
  constructor() {
    super()
    // Java Init Block: { this.renderOrder = 10; }
    this.renderOrder = 10

    this._text = []
    this.lockTexture = null
    this.optionChatX = DEFAULT_FLOAT
    this.optionChatY = DEFAULT_FLOAT
    this.textAlign = textAlign.LEFT
  }

  static {
    Option.defineField('_text', {
      label: '预览内容',
      type: EditorTypes.STRING_ARR,
      tips: '仅用于预览内容，不保存'
    })

    Option.defineField('texture', {
      label: '选项贴图',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE }
    })
    Option.defineField('textAlign', {
      label: '文字对齐',
      type: EditorTypes.SELECT,
      props: { options: textAlign.values() }
    })
    Option.defineField('lockTexture', {
      label: '锁定图标',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE }
    })
    Option.defineField('optionChatX', {
      label: '文字 X 偏移',
      type: EditorTypes.NUMBER_INPUT
    })
    Option.defineField('optionChatY', {
      label: '文字 Y 偏移',
      type: EditorTypes.NUMBER_INPUT
    })

    //排除无用参数
    Option.excludeFields([
      'type',
      'texture_texture',
      'animation',
      'customAnimation',
      'attachment',
      'loop'
    ])

    Option.defineOverride('renderEvents', {
      props: {
        itemConstructor: BaseRenderEvent
      }
    })
  }
} 

// 对话框
export class DialogBox extends Portrait {
  constructor() {
    super()
    // Java Init Block: { this.renderOrder = 0; }
    this.renderOrder = 0

    this._name = 'Steve'
    this._text = 'Ciallo～(∠・ω< )⌒★'
    this.lineWidth = null
    this.nameX = DEFAULT_FLOAT
    this.nameY = DEFAULT_FLOAT
    this.textX = DEFAULT_FLOAT
    this.textY = DEFAULT_FLOAT
    this.textAlign = textAlign.LEFT
  }

  static {
    DialogBox.defineField('_name', {
      label: '预览名字',
      type: EditorTypes.INPUT,
      tips: '仅用于预览名字位置，不保存'
    })
    DialogBox.defineField('_text', {
      label: '预览内容',
      type: EditorTypes.INPUT,
      tips: '仅用于预览内容位置和换行，不保存'
    })

    DialogBox.defineField('texture', {
      label: '对话框贴图',
      type: EditorTypes.AUTOCOMPLETE,
      props: { dataSource: autoCompleteDataSources.TEXTURE }
    })
    DialogBox.defineField('lineWidth', {
      label: '换行宽度',
      type: EditorTypes.NUMBER_INPUT
    })
    DialogBox.defineField('textAlign', {
      label: '文字对齐',
      type: EditorTypes.SELECT,
      props: { options: textAlign.values() }
    })
    DialogBox.defineField('nameX', {
      label: '名字 X偏移',
      type: EditorTypes.NUMBER_INPUT
    })
    DialogBox.defineField('nameY', {
      label: '名字 Y偏移',
      type: EditorTypes.NUMBER_INPUT
    })
    DialogBox.defineField('textX', {
      label: '内容 X偏移',
      type: EditorTypes.NUMBER_INPUT
    })
    DialogBox.defineField('textY', {
      label: '内容 Y偏移',
      type: EditorTypes.NUMBER_INPUT
    })

    //排除无用参数
    DialogBox.excludeFields([
      'type',
      'texture_hoverTexture',
      'texture_texture',
      'animation',
      'customAnimation',
      'attachment',
      'loop'
    ])

    DialogBox.defineOverride('renderEvents', {
      props: {
        itemConstructor: BaseRenderEvent
      }
    })
  }
}

// 预设动画序列
export class AnimationSequence extends AutoClean {
  constructor() {
    super()
    this.keyframes = []
  }

  static {
    AnimationSequence.defineField('keyframes', {
      label: '关键帧列表',
      type: EditorTypes.OBJECT_ARR,
      props: { itemConstructor: Keyframe, itemLabel: 'Keyframe', displayTemplate: '{time}帧' }
    })
  }
}

//主题文件
export class ChatBoxTheme extends AutoClean {
  constructor() {
    super()
    this._bgColor = -16766400

    // Java: public Map<String, Portrait> portrait = new HashMap<>();
    this.portrait = {}

    // Java: public Option option = new Option();
    this.option = new Option()

    // Java: public DialogBox dialogBox = new DialogBox();
    this.dialogBox = new DialogBox()

    // Java: public List<FunctionButton> functionalButton = new ArrayList<>();
    this.functionalButton = []

    // Java: public KeyPrompt keyPrompt = new KeyPrompt();
    this.keyPrompt = new KeyPrompt()

    // Java: public Map<String, List<Keyframe>> customAnimation = new HashMap<>();
    this.customAnimation = {}
  }

  static {
    ChatBoxTheme.defineField('_bgColor', {
      label: '背景颜色',
      type: EditorTypes.COLOR
    })
    ChatBoxTheme.defineField('customAnimation', {
      label: '全局动画库',
      type: EditorTypes.MAP,
      props: { valueConstructor: AnimationSequence, keyLabel: '动画 ID' }
    })
  }

  // 对应 Java 的 setDefaultValue 方法 (业务逻辑)
  // 这个方法可以在前端点击 "Reset Layout" 时调用
  applyDefaultButtonLayout() {
    this.functionalButton.forEach((button, i) => {
      if (button.x === null) {
        button.x = (formatUtil.equalsIgnoreCase(button.alignX, alignXList.LEFT) ? 5 : -5) * i
      }
    })
  }
}
