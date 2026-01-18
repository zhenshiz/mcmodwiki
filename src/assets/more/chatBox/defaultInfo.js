import { translatable, translatableArg } from '@/assets/translatable/translatable.js'
import {
  alignXList,
  alignYList,
  attachmentType,
  easing,
  eventType,
  functionalButtonType,
  portraitType,
  renderEventTrigger,
  textAlign
} from '@/assets/more/chatBox/option.js'
import {
  AutoCompleteField,
  BooleanField,
  ColorField,
  EnumField,
  NumberField,
  ObjectArrField,
  ObjectDialogField,
  ObjectField,
  ObjectMapField,
  StrArrFiled,
  StringField,
  UnionArrField,
  UnionTemplate
} from '@/assets/const/objectClass.js'
import { itemSuggestions } from '@/assets/textures/itemSuggestions.js'
import { useChatBoxEditorStore } from '@/stores/index.js'

export const defaultChatBoxTheme = () => {
  let theme = themeSetting(null)
  let defaultChatBoxTheme = theme.chatBoxTheme.getDefault()
  defaultChatBoxTheme.portrait = { map: theme.portrait.getDefault() }
  defaultChatBoxTheme.functionalButton = [theme.functionButtons.getDefault()]
  defaultChatBoxTheme.customAnimation = { map: [theme.keyPrompt.getDefault()] }
  return defaultChatBoxTheme
}

export const defaultChatBoxDialogues = () => {
  let dialogues = dialoguesSetting(null)
  let defaultChatBoxDialogues = dialogues.dialogBasicConfiguration.getDefault()
  defaultChatBoxDialogues.$introduce = ''
  let dialoguesDefault = dialogues.dialogues.getDefault()
  dialoguesDefault.dialogBox = dialogues.dialogBox.getDefault()
  dialoguesDefault.options = [dialogues.option.getItemDefault()]
  dialoguesDefault.portrait = [undefined, dialogues.replacePortrait.getDefault()]
  dialoguesDefault.removePortrait = [undefined]
  dialoguesDefault.video = dialogues.video.getDefault()
  defaultChatBoxDialogues.dialogues = {
    map: [dialoguesDefault]
  }
  return defaultChatBoxDialogues
}

export const themeSetting = (lang) => {
  const renderEvent = (type) => {
    return new ObjectField({
      properties: {
        trigger: new AutoCompleteField({
          label: translatable(lang, 'chat.box.dialogues.renderEvent.trigger'),
          suggestions: renderEventTrigger(type).values(lang)
        }),
        type: new AutoCompleteField({
          label: translatable(lang, 'chat.box.dialogues.renderEvent.type'),
          suggestions: eventType.values(lang)
        }),
        value1: new StringField({
          key: 'value',
          label: translatable(lang, 'chat.box.dialogues.renderEvent.value'),
          visible: (field, value) => {
            return !['hide', 'show', 'replace'].includes(value.type)
          }
        }),
        value2: new AutoCompleteField({
          key: 'value',
          label: translatable(lang, 'chat.box.dialogues.renderEvent.value'),
          suggestions: [
            { label: '@s', value: '@s' },
            { label: '@portraits', value: '@portraits' },
            { label: '@options', value: '@options' },
            { label: '@buttons', value: '@buttons' },
            { label: '@dialog', value: '@dialog' },
            { label: '@video', value: '@video' }
          ],
          visible: (field, value) => {
            return ['hide', 'show', 'replace'].includes(value.type)
          }
        })
      }
    })
  }

  const listRenderEvent = (type) => {
    return new ObjectArrField({
      label: translatable(lang, 'chat.box.dialogues.renderEvents'),
      title: translatable(lang, 'chat.box.dialogues.renderEvents.title'),
      layout: 'vertical',
      properties: renderEvent(type).properties
    })
  }

  /**
   * 创建基础组件定义
   * @param {Object} overrides 可选：用于覆盖默认 defaultProps 的值
   */
  function createComponent(overrides = {}) {
    // 定义默认属性
    const defaultProps = {
      x: 0,
      y: 0,
      width: 10,
      height: 10,
      scale: 1,
      alignX: 'LEFT',
      alignY: 'TOP',
      renderOrder: undefined,
      brightness: 100,
      opacity: 100,
      angle: 0,
      hidden: false,
      renderEvents: [],
      ...overrides
    }

    return new ObjectDialogField({
      properties: {
        x: new NumberField({
          defaultValue: defaultProps.x,
          label: translatableArg(lang, 'chat.box.theme.component.x', defaultProps.x)
        }),
        y: new NumberField({
          defaultValue: defaultProps.y,
          label: translatableArg(lang, 'chat.box.theme.component.y', defaultProps.y)
        }),
        width: new NumberField({
          defaultValue: defaultProps.width,
          label: translatableArg(lang, 'chat.box.theme.component.width', defaultProps.width),
          min: 0
        }),
        height: new NumberField({
          defaultValue: defaultProps.height,
          label: translatableArg(lang, 'chat.box.theme.component.height', defaultProps.height),
          min: 0
        }),
        scale: new NumberField({
          defaultValue: defaultProps.scale,
          label: translatableArg(lang, 'chat.box.theme.component.scale', defaultProps.scale),
          min: 0,
          max: 1
        }),
        alignX: new EnumField({
          defaultValue: defaultProps.alignX,
          label: translatableArg(lang, 'chat.box.theme.component.align.x', defaultProps.alignX),
          options: alignXList.values(lang)
        }),
        alignY: new EnumField({
          defaultValue: defaultProps.alignY,
          label: translatableArg(lang, 'chat.box.theme.component.align.y', defaultProps.alignY),
          options: alignYList.values(lang)
        }),
        renderOrder: new NumberField({
          defaultValue: defaultProps.renderOrder,
          label: translatableArg(lang, 'chat.box.theme.component.renderOrder', defaultProps.renderOrder)
        }),
        brightness: new NumberField({
          defaultValue: defaultProps.brightness,
          label: translatableArg(lang, 'chat.box.theme.component.brightness', defaultProps.brightness),
          min: 0,
          max: 100
        }),
        opacity: new NumberField({
          defaultValue: defaultProps.opacity,
          label: translatableArg(lang, 'chat.box.theme.component.opacity', defaultProps.opacity),
          min: 0,
          max: 100
        }),
        angle: new NumberField({
          defaultValue: defaultProps.angle,
          label: translatableArg(lang, 'chat.box.theme.component.angle', defaultProps.angle)
        }),
        hidden: new BooleanField({
          defaultValue: defaultProps.hidden,
          label: translatableArg(lang, 'chat.box.theme.component.hidden', defaultProps.hidden)
        }),
        renderEvents: listRenderEvent()
      }
    })
  }

  // DialogBox
  const dialogBoxComponent = createComponent({ renderOrder: 0 })
  dialogBoxComponent.label = translatable(lang, 'chat.box.theme.dialog.box.basic')

  const dialogBox = new ObjectField({
    properties: {
      texture: new StringField({
        label: translatable(lang, 'chat.box.theme.dialog.box.texture')
      }),
      lineWidth: new NumberField({
        label: translatable(lang, 'chat.box.theme.dialog.box.lineWidth')
      }),
      nameX: new NumberField({
        label: translatable(lang, 'chat.box.theme.dialog.box.nameX'),
        defaultValue: 0
      }),
      nameY: new NumberField({
        label: translatable(lang, 'chat.box.theme.dialog.box.nameY'),
        defaultValue: 0
      }),
      textX: new NumberField({
        label: translatable(lang, 'chat.box.theme.dialog.box.textX'),
        defaultValue: 0
      }),
      textY: new NumberField({
        label: translatable(lang, 'chat.box.theme.dialog.box.textY'),
        defaultValue: 0
      }),
      textAlign: new EnumField({
        label: translatable(lang, 'chat.box.theme.dialog.box.textAlign'),
        defaultValue: 'LEFT',
        options: textAlign.values(lang)
      }),
    }
  })

  // functionButtons
  const functionButtonComponent = createComponent({
    x: null,
    width: 5,
    height: 8,
    alignX: 'RIGHT',
    alignY: 'BOTTOM',
    renderOrder: 30
  })

  const functionButtons = new ObjectField({
    label: translatable(lang, 'chat.box.theme.functional.button.basic'),
    layout: 'vertical',
    properties: {
      type: new EnumField({
        label: translatable(lang, 'chat.box.theme.functional.button.type'),
        options: functionalButtonType.values(lang)
      }),
      texture: new StringField({
        label: translatable(lang, 'chat.box.theme.functional.button.texture')
      }),
      hoverTexture: new StringField({
        label: translatable(lang, 'chat.box.theme.functional.button.hoverTexture')
      }),
      ...functionButtonComponent.properties
    }
  })

  // option
  const optionComponent = createComponent({ renderOrder: 10 })
  optionComponent.label = translatable(lang, 'chat.box.theme.option.basic')
  const option = new ObjectField({
    properties: {
      texture: new StringField({
        label: translatable(lang, 'chat.box.theme.option.texture')
      }),
      hoverTexture: new StringField({
        label: translatable(lang, 'chat.box.theme.option.hoverTexture')
      }),
      lockTexture: new StringField({
        label: translatable(lang, 'chat.box.theme.option.lockTexture')
      }),
      optionChatX: new NumberField({
        label: translatable(lang, 'chat.box.theme.option.optionChatX'),
        defaultValue: 0
      }),
      optionChatY: new NumberField({
        label: translatable(lang, 'chat.box.theme.option.optionChatY'),
        defaultValue: 0
      }),
      textAlign: new EnumField({
        label: translatable(lang, 'chat.box.theme.option.textAlign'),
        defaultValue: 'LEFT',
        options: textAlign.values(lang)
      })
    }
  })

  // keyPrompt
  const keyPromptComponent = createComponent({ renderOrder: 40 })
  keyPromptComponent.label = translatable(lang, 'chat.box.theme.KeyPrompt.basic')
  const keyPrompt = new ObjectField({
    properties: {
      visible: new BooleanField({
        label: translatable(lang, 'chat.box.theme.KeyPrompt.visible'),
        defaultValue: true
      }),
      mouseTextureWidth: new NumberField({
        label: translatable(lang, 'chat.box.theme.KeyPrompt.mouseTextureWidth'),
        defaultValue: 16
      }),
      mouseTextureHeight: new NumberField({
        label: translatable(lang, 'chat.box.theme.KeyPrompt.mouseTextureHeight'),
        defaultValue: 16
      }),
      rightClickTexture: new StringField({
        label: translatable(lang, 'chat.box.theme.KeyPrompt.rightClickTexture')
      }),
      scrollTexture: new StringField({
        label: translatable(lang, 'chat.box.theme.KeyPrompt.scrollTexture')
      })
    }
  })

  // Portrait
  const portraitComponent = createComponent({
    renderOrder: 20
  })
  // Attachment
  const attachment = new ObjectField({
    label: translatable(lang, 'chat.box.component.global.portrait.attachment'),
    layout: 'vertical',
    tips: translatable(lang, 'chat.box.component.global.portrait.attachment.tips'),
    properties: {
      type: new EnumField({
        defaultValue: 'TEXTURE',
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.type'),
        options: attachmentType.values(lang)
      }),
      textureValue: new StringField({
        key: 'value',
        defaultValue: '',
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.value.TEXTURE'),
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'texture'
        }
      }),
      textValue: new StringField({
        key: 'value',
        defaultValue: '',
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.value.TEXT'),
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'text'
        }
      }),
      x: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.x'),
        defaultValue: 0
      }),
      y: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.y'),
        defaultValue: 0
      }),
      width: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.width'),
        defaultValue: 0,
        min: 0
      }),
      height: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.height'),
        defaultValue: 0,
        min: 0,
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'text'
        }
      }),
      textAlign: new EnumField({
        defaultValue: 'LEFT',
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.textAlign'),
        options: textAlign.values(lang),
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'text'
        }
      }),
      textColor: new ColorField({
        defaultValue: -1,
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.textColor'),
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'text'
        }
      }),
      lineBreak: new BooleanField({
        defaultValue: false,
        label: translatable(lang, 'chat.box.component.global.portrait.attachment.lineBreak'),
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'text'
        }
      }),
    }
  })
  // Keyframe
  const keyframe = new ObjectField({
    label: translatable(lang, 'chat.box.component.global.portrait.keyframe'),
    layout: 'vertical',
    properties: {
      time: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.time'),
        defaultValue: 1,
        min: 0
      }),
      x: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.x')
      }),
      y: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.y')
      }),
      xOffset: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.xOffset')
      }),
      yOffset: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.yOffset')
      }),
      scale: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.scale'),
        min: 0
      }),
      brightness: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.scale'),
        min: 0
      }),
      opacity: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.opacity'),
        min: 0,
        max: 100
      }),
      angle: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.angle')
      }),
      easing: new EnumField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.easing'),
        options: easing,
        width: 200,
        mode: 'top'
      }),
      texture: new StringField({
        label: translatable(lang, 'chat.box.component.global.portrait.keyframe.texture')
      }),
      attachment: new ObjectArrField({
        label: attachment.label,
        layout: attachment.layout,
        tips: attachment.tips,
        properties: attachment.properties,
      })
    }
  })
 
  const portrait = new ObjectField({
    properties: {
      type: new EnumField({
        defaultValue: 'TEXTURE',
        label: translatable(lang, 'chat.box.component.global.portrait.type'),
        options: portraitType.values(lang)
      }),
      textureTexture: new StringField({
        key: 'texture',
        label: translatable(lang, 'chat.box.component.global.portrait.texture.TEXTURE'),
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'texture'
        }
      }),
      playerHeadTexture: new StringField({
        key: 'texture',
        label: translatable(lang, 'chat.box.component.global.portrait.texture.PLAYER_HEAD'),
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'player_head'
        }
      }),
      itemTexture: new AutoCompleteField({
        key: 'texture',
        label: translatable(lang, 'chat.box.component.global.portrait.texture.ITEM'),
        suggestions: itemSuggestions(lang),
        filterMethod: (value, item) => {
          return item.value.includes(value) || item.label.includes(value)
        },
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'item'
        }
      }),
      hoverTexture: new StringField({
        label: translatable(lang, 'chat.box.component.global.portrait.hoverTexture')
      }),
      attachment: new ObjectArrField({
        label: attachment.label,
        layout: attachment.layout,
        tips: attachment.tips,
        properties: attachment.properties,
      }),
      itemCount: new NumberField({
        defaultValue: 1,
        label: translatable(lang, 'chat.box.component.global.portrait.itemCount'),
        min: 0,
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'item'
        }
      }),
      customModelData: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.customModelData'),
        visible: (field, value) => {
          return value.type?.toLowerCase() === 'item'
        }
      }),
      animation: new AutoCompleteField({
        label: translatable(lang, 'chat.box.component.global.portrait.animation'),
        suggestions: () => useChatBoxEditorStore().animationSuggestions,
        visible: (field, value) => {
          return value.customAnimation == null || value.customAnimation.length === 0
        }
      }),
      customAnimation: new ObjectArrField({
        label: keyframe.label,
        layout: keyframe.layout,
        properties: keyframe.properties,
        visible: (field, value) => {
          return value.animation == null || value.animation === ''
        }
      }),
      loop: new BooleanField({
        label: translatable(lang, 'chat.box.component.global.portrait.loop'),
        defaultValue: false
      }),
      ...portraitComponent.properties,
      renderEvents: listRenderEvent('portrait'),
    }
  })

  //customAnimation
  const customAnimationMap = new ObjectMapField({
    properties: {
      '': new ObjectArrField({
        label: keyframe.label,
        layout: keyframe.layout,
        properties: keyframe.properties
      })
    }
  })

  //all
  const chatBoxTheme = new ObjectField({
    properties: {
      portrait: new ObjectMapField({
        properties: portrait.properties
      }),
      option: option,
      dialogBox: dialogBox,
      functionalButton: new ObjectArrField({
        properties: functionButtons.properties
      }),
      keyPrompt: keyPrompt,
      customAnimation: customAnimationMap
    }
  })

  return {
    listRenderEvent,
    createComponent,
    dialogBoxComponent,
    dialogBox,
    functionButtons,
    optionComponent,
    option,
    keyPromptComponent,
    keyPrompt,
    portrait,
    keyframe,
    customAnimationMap,
    chatBoxTheme
  }
}

export const dialoguesSetting = (lang) => {
  const setting = themeSetting(lang)

  const dialogBasicConfiguration = new ObjectField({
    properties: {
      $introduce: new StringField({
        label: translatable(lang, 'chat.box.dialogues.introduce')
      }),
      animationFPS: new NumberField({
        label: translatable(lang, 'chat.box.dialogues.animationFPS'),
        defaultValue: 60,
        min: 1
      }),
      autoPlayTick: new NumberField({
        label: translatable(lang, 'chat.box.dialogues.autoPlayTick'),
        defaultValue: 20
      }),
      isEsc: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.isEsc'),
        defaultValue: true
      }),
      isPause: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.isPause'),
        defaultValue: true
      }),
      isHistoricalSkip: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.isHistoricalSkip'),
        defaultValue: true
      }),
      maxTriggerCount: new NumberField({
        label: translatable(lang, 'chat.box.dialogues.maxTriggerCount'),
        defaultValue: -1,
        min: -1
      }),
      isScreen: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.isScreen'),
      }),
      theme: new StringField({
        label: translatable(lang, 'chat.box.dialogues.theme'),
        defaultValue: ''
      })
    }
  })
  //dialogBox
  const dialogBox = new ObjectDialogField({
    label: translatable(lang, 'chat.box.dialogues.dialogBox'),
    title: translatable(lang, 'chat.box.dialogues.dialogBox'),
    properties: {
      name: new AutoCompleteField({
        label: translatable(lang, 'chat.box.dialogues.dialogBox.name'),
        suggestions: () => useChatBoxEditorStore().getTranslatableOptions(lang),
        filterMethod: (value, item) => {
          return item.value.includes(value) || item.label.includes(value)
        }
      }),
      text: new AutoCompleteField({
        label: translatable(lang, 'chat.box.dialogues.dialogBox.text'),
        suggestions: () => useChatBoxEditorStore().getTranslatableOptions(lang),
        filterMethod: (value, item) => {
          return item.value.includes(value) || item.label.includes(value)
        }
      }),
      renderEvents: setting.listRenderEvent()
    }
  })

  //option
  const click = new ObjectField({
    properties: {
      type: new AutoCompleteField({
        label: translatable(lang, 'chat.box.dialogues.options.click.type'),
        suggestions: eventType.values(lang)
      }),
      value: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.click.value')
      }),
      renderEvents: setting.listRenderEvent()
    }
  })

  const option = new ObjectArrField({
    label: translatable(lang, 'chat.box.dialogues.option'),
    layout: 'vertical',
    displayTemplate: '{text}',
    properties: {
      text: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.text')
      }),
      isLock: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.options.isLock'),
        defaultValue: false
      }),
      unlockCommand: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.unlockCommand')
      }),
      next: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.next')
      }),
      click: click,
      tooltip: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.tooltip')
      }),
      renderEvents: setting.listRenderEvent()
    }
  })

  //video
  let videoComponent = themeSetting(lang).createComponent({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    renderOrder: -1
  })
  videoComponent.label = translatable(lang, 'chat.box.dialogues.video.basic')
  videoComponent.tips = translatable(lang, 'chat.box.dialogues.video.tips')
  const video = new ObjectDialogField({
    label: translatable(lang, 'chat.box.dialogues.video'),
    title: translatable(lang, 'chat.box.dialogues.video'),
    tips: translatable(lang, 'chat.box.dialogues.video.tips'),
    properties: {
      path: new StringField({
        label: translatable(lang, 'chat.box.dialogues.video.path'),
      }),
      canControl: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.video.canControl'),
        defaultValue: true
      }),
      canSkip: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.video.canSkip'),
        defaultValue: true
      }),
      loop: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.video.loop'),
        defaultValue: false
      }),
      renderEvents: setting.listRenderEvent()
    }
  })

  //portrait
  const replacePortraitComponent = setting.createComponent({
    x: null,
    y: null,
    width: null,
    height: null,
    scale: null,
    alignX: null,
    alignY: null,
    renderOrder: null,
    brightness:null,
    opacity: null,
    angle: null,
    hidden: null,
  })
  const replacePortrait = new ObjectField({
    properties: {
      id: new AutoCompleteField({
        label: translatable(lang, 'chat.box.dialogues.portrait.id'),
        suggestions: () => Object.keys(useChatBoxEditorStore().themeSetting.portrait)
      }),
      ...setting.portrait.properties,
      ...replacePortraitComponent.properties,
      renderEvents: setting.portrait.properties.renderEvents
    }
  })

  // dialogues
  const dialogues = new ObjectField({
    properties: {
      dialogBox: dialogBox,
      options: option,
      portrait: new UnionArrField({
        label: translatable(lang, 'chat.box.dialogues.portrait'),
        layout: 'vertical',
        itemTypes: {
          portraitType: new UnionTemplate({
            displayTemplate: `[${translatable(lang, 'chat.box.dialogues.portrait.reference')}] {value}`,
            groupName: translatable(lang, 'chat.box.dialogues.portrait.reference'),
            field: new AutoCompleteField({
              label: translatable(lang, 'chat.box.dialogues.portrait.id'),
              suggestions: () => Object.keys(useChatBoxEditorStore().themeSetting.portrait)
            })
          }),
          replacePortrait: new UnionTemplate({
            displayTemplate: `[${translatable(lang, 'chat.box.dialogues.portrait.custom')}] {id}`,
            groupName: translatable(lang, 'chat.box.dialogues.portrait.custom'),
            field: replacePortrait
          })
        }
      }),
      sound: new StringField({
        label: translatable(lang, 'chat.box.dialogues.sound'),
        defaultValue: ''
      }),
      command: new StringField({
        label: translatable(lang, 'chat.box.dialogues.command')
      }),
      backgroundImage: new StringField({
        label: translatable(lang, 'chat.box.dialogues.backgroundImage')
      }),
      clearOldPortrait: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.clearOldPortrait'),
        defaultValue: true
      }),
      removePortrait: new StrArrFiled({
        label: translatable(lang, 'chat.box.dialogues.removePortrait'),
        layout: 'vertical',
        suggestions: () => Object.keys(useChatBoxEditorStore().themeSetting.portrait),
        visible: (field, value) => {
          return !value.clearOldPortrait
        }
      }),
      video: video
    }
  })
  return {
    dialogBasicConfiguration,
    dialogues,
    videoComponent,
    replacePortrait,
    dialogBox,
    option,
    video
  }
}


