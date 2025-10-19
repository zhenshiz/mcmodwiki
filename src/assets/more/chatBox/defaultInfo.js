import { translatable, translatableArg } from '@/assets/translatable/translatable.js'
import {
  alignXList,
  alignYList,
  clickType,
  easing,
  functionalButtonType,
  portraitType,
  textAlign
} from '@/assets/more/chatBox/option.js'
import {
  AutoCompleteField,
  BooleanField,
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
  defaultChatBoxTheme.customAnimation = { map: [theme.customAnimation.getDefault()] }
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
      alignX: 'LEFT',
      alignY: 'TOP',
      opacity: 100,
      renderOrder: undefined,
      angle: 0,
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
          min: 10
        }),
        height: new NumberField({
          defaultValue: defaultProps.height,
          label: translatableArg(lang, 'chat.box.theme.component.height', defaultProps.height),
          min: 10
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
        opacity: new NumberField({
          defaultValue: defaultProps.opacity,
          label: translatableArg(lang, 'chat.box.theme.component.opacity', defaultProps.opacity),
          min: 0,
          max: 100
        }),
        renderOrder: new NumberField({
          defaultValue: defaultProps.renderOrder,
          label: translatableArg(lang, 'chat.box.theme.component.renderOrder', defaultProps.renderOrder)
        }),
        angle: new NumberField({
          defaultValue: defaultProps.angle,
          label: translatableArg(lang, 'chat.box.theme.component.angle', defaultProps.angle)
        })
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
      textAlign: new EnumField({
        label: translatable(lang, 'chat.box.theme.dialog.box.texture'),
        defaultValue: 'LEFT',
        options: textAlign.values(lang)
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
      })
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
      selectTexture: new StringField({
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
  // customAnimation
  const customAnimation = new ObjectField({
    label: translatable(lang, 'chat.box.component.global.portrait.custom.animation'),
    layout: 'vertical',
    properties: {
      texture: new StringField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.texture')
      }),
      time: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.time'),
        defaultValue: 0,
        min: 0
      }),
      x: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.x')
      }),
      y: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.y')
      }),
      xOffset: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.xOffset')
      }),
      yOffset: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.yOffset')
      }),
      scale: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.scale'),
        min: 0,
      }),
      opacity: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.opacity'),
        min: 0,
        max: 100
      }),
      angle: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.angle')
      }),
      easing: new EnumField({
        label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.easing'),
        options: easing,
        width: 200,
        mode: 'top'
      })
    }
  })
  // Attachment
  const attachment = new ObjectField({
    label: translatable(lang, 'chat.box.component.global.portrait.set.component.attachment'),
    layout: 'vertical',
    tips: translatable(lang, 'chat.box.component.global.portrait.set.component.attachment.tips'),
    properties: {
      value: new StringField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.texture.value')
      }),
      x: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.component.attachment.x'),
        defaultValue: 0
      }),
      y: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.component.attachment.y'),
        defaultValue: 0
      }),
      width: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.component.attachment.width'),
        defaultValue: 0,
        min: 0
      }),
      height: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.component.attachment.height'),
        defaultValue: 0,
        min: 0
      })
    }
  })

  const portrait = new ObjectField({
    properties: {
      type: new EnumField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.type'),
        options: portraitType.values(lang)
      }),
      textureValue: new StringField({
        key: 'value',
        label: translatable(lang, 'chat.box.component.global.portrait.get.TEXTURE.value'),

        visible: (field, value) => {
          return value.type === 'TEXTURE'
        }
      }),
      attachment: new ObjectArrField({
        label: attachment.label,
        layout: attachment.layout,
        tips: attachment.tips,
        properties: attachment.properties,
        visible: (field, value) => {
          return value.type === 'TEXTURE'
        }
      }),
      playerHeadValue: new StringField({
        key: 'value',
        label: translatable(lang, 'chat.box.component.global.portrait.get.PLAYER_HEAD.value'),
        visible: (field, value) => {
          return value.type === 'PLAYER_HEAD'
        }
      }),
      itemValue: new AutoCompleteField({
        key: 'value',
        label: translatable(lang, 'chat.box.component.global.portrait.get.ITEM.value'),
        suggestions: itemSuggestions(lang),
        filterMethod: (value, item) => {
          return item.value.includes(value) || item.label.includes(value)
        },
        visible: (field, value) => {
          return value.type === 'ITEM'
        }
      }),
      customItemData: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.item.customItemData'),
        visible: (field, value) => {
          return value.type === 'ITEM'
        }
      }),
      scale: new NumberField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.component.scale'),
        defaultValue: 1,
        min: 0,
        step: 0.1
      }),
      animation: new AutoCompleteField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.component.attachment'),
        suggestions: () => useChatBoxEditorStore().animationSuggestions,
        visible: (field, value) => {
          return value.customAnimation == null || value.customAnimation.length === 0
        }
      }),
      customAnimation: new ObjectArrField({
        label: customAnimation.label,
        layout: customAnimation.layout,
        properties: customAnimation.properties,
        visible: (field, value) => {
          return value.animation == null || value.animation === ''
        }
      }),
      loop: new BooleanField({
        label: translatable(lang, 'chat.box.component.global.portrait.set.component.loop'),
        defaultValue: false
      }),
      ...portraitComponent.properties
    }
  })

  //customAnimation
  const customAnimationMap = new ObjectMapField({
    properties: {
      '': new ObjectArrField({
        label: customAnimation.label,
        layout: customAnimation.layout,
        properties: customAnimation.properties
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
    createComponent,
    dialogBoxComponent,
    dialogBox,
    functionButtons,
    optionComponent,
    option,
    keyPromptComponent,
    keyPrompt,
    portrait,
    customAnimation,
    customAnimationMap,
    chatBoxTheme
  }
}

export const dialoguesSetting = (lang) => {
  const dialogBasicConfiguration = new ObjectField({
    properties: {
      $introduce: new StringField({
        label: translatable(lang, 'chat.box.dialogues.introduce')
      }),
      isTranslatable: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.isTranslatable'),
        defaultValue: false
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
  const dialogBox = new ObjectField({
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
      })
    }
  })

  //option
  const condition = new ObjectField({
    properties: {
      objective: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.condition.objective')
      }),
      value: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.condition.value')
      })
    }
  })
  const click = new ObjectField({
    properties: {
      type: new AutoCompleteField({
        label: translatable(lang, 'chat.box.dialogues.options.click.type'),
        suggestions: clickType.values(lang)
      }),
      value: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.click.value')
      })
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
      lock: new ObjectField({
        properties: condition.properties,
        visible: (field, value) => {
          return value.isLock
        }
      }),
      isHidden: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.options.isHidden'),
        defaultValue: false
      }),
      hidden: new ObjectField({
        properties: condition.properties,
        visible: (field, value) => {
          return value.isHidden
        }
      }),
      next: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.next')
      }),
      click: click,
      tooltip: new StringField({
        label: translatable(lang, 'chat.box.dialogues.options.tooltip')
      })
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
  const video = new ObjectField({
    properties: {
      path: new StringField({
        label: translatable(lang, 'chat.box.dialogues.video.path'),
        tips: translatable(lang, 'chat.box.dialogues.video.tips')
      }),
      canControl: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.video.canControl'),
        tips: translatable(lang, 'chat.box.dialogues.video.tips'),
        defaultValue: true
      }),
      canSkip: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.video.canSkip'),
        tips: translatable(lang, 'chat.box.dialogues.video.tips'),
        defaultValue: true
      }),
      loop: new BooleanField({
        label: translatable(lang, 'chat.box.dialogues.video.loop'),
        tips: translatable(lang, 'chat.box.dialogues.video.tips'),
        defaultValue: false
      })
    }
  })

  //portrait
  const replacePortraitComponent = themeSetting(lang).createComponent({
    x: null,
    y: null,
    width: null,
    height: null,
    alignX: null,
    alignY: null,
    opacity: null,
    renderOrder: null,
    angle: null,
    scale: null,
    loop: null
  })
  const replacePortrait = new ObjectField({
    properties: {
      id: new AutoCompleteField({
        label: translatable(lang, 'chat.box.dialogues.portrait.id'),
        suggestions: () => Object.keys(useChatBoxEditorStore().themeSetting.portrait)
      }),
      ...replacePortraitComponent.properties
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
      volume: new NumberField({
        label: translatable(lang, 'chat.box.dialogues.volume'),
        defaultValue: 1,
        min: 0,
        step: 0.1
      }),
      pitch: new NumberField({
        label: translatable(lang, 'chat.box.dialogues.pitch'),
        defaultValue: 1,
        min: 0,
        step: 0.1
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


