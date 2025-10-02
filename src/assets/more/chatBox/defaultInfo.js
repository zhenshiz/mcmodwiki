import { translatable, translatableArg } from '@/assets/translatable/translatable.js'
import {
  alignXList,
  alignYList,
  easing,
  functionalButtonType
} from '@/assets/more/chatBox/option.js'

export const defaultTheme = `{
  theme: '',
  portrait: {},
  option: {},
  dialogBox: {},
  functionalButton: [],
  keyPrompt: {}
}`

export const defaultDialogues = `{
  $introduce: '',
  dialogues: [],
  isTranslatable: false,
  isEsc: true,
  isPause: true,
  isHistoricalSkip: true,
  maxTriggerCount: -1,
  theme: ''
}`

export const optionSetting = lang => {
  // 创建字段描述对象
  const fieldDescriptions = {}

  // 添加text字段
  fieldDescriptions['options[].text'] = {
    label: translatable(lang, 'chat.box.dialogues.options.text'),
    type: 'string'
  }

  // 添加isLock字段
  fieldDescriptions['options[].isLock'] = {
    default: false,
    label: translatable(lang, 'chat.box.dialogues.options.isLock'),
    type: 'boolean'
  }

  // 添加lock对象字段
  fieldDescriptions['options[].lock'] = {
    label: translatable(lang, 'chat.box.dialogues.options.lock'),
    type: 'object',
    condition: 'options[].isLock',
    properties: {
      objective: {
        label: translatable(lang, 'chat.box.dialogues.options.lock.objective'),
        type: 'string'
      },
      value: {
        label: translatable(lang, 'chat.box.dialogues.options.lock.value'),
        type: 'string'
      }
    }
  }

  // 添加isHidden字段
  fieldDescriptions['options[].isHidden'] = {
    default: false,
    label: translatable(lang, 'chat.box.dialogues.options.isHidden'),
    type: 'boolean'
  }

  // 添加hidden对象字段
  fieldDescriptions['options[].hidden'] = {
    label: translatable(lang, 'chat.box.dialogues.options.hidden'),
    type: 'object',
    condition: 'options[].isHidden',
    properties: {
      objective: {
        label: translatable(lang, 'chat.box.dialogues.options.hidden.objective'),
        type: 'string'
      },
      value: {
        label: translatable(lang, 'chat.box.dialogues.options.hidden.value'),
        type: 'string'
      }
    }
  }

  // 添加next字段
  fieldDescriptions['options[].next'] = {
    label: translatable(lang, 'chat.box.dialogues.options.next'),
    type: 'string'
  }

  // 添加click对象字段
  fieldDescriptions['options[].click'] = {
    label: translatable(lang, 'chat.box.dialogues.options.click'),
    type: 'object',
    properties: {
      type: {
        label: translatable(lang, 'chat.box.dialogues.options.click.type'),
        type: 'string'
      },
      value: {
        label: translatable(lang, 'chat.box.dialogues.options.click.value'),
        type: 'string'
      }
    }
  }

  // 添加tooltip字段
  fieldDescriptions['options[].tooltip'] = {
    label: translatable(lang, 'chat.box.dialogues.options.tooltip'),
    type: 'string'
  }

  return fieldDescriptions
}

export const customAnimationSetting = lang => {
  // 创建字段描述对象
  const fieldDescriptions = {}

  // 添加texture字段
  fieldDescriptions['customAnimation[].texture'] = {
    label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.texture'),
    type: 'string'
  }

  // 添加time字段
  fieldDescriptions['customAnimation[].time'] = {
    label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.time'),
    type: 'integer',
    required: true
  }

  // 添加x字段
  fieldDescriptions['customAnimation[].x'] = {
    label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.x'),
    type: 'float'
  }

  // 添加y字段
  fieldDescriptions['customAnimation[].y'] = {
    label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.y'),
    type: 'float'
  }

  // 添加scale字段
  fieldDescriptions['customAnimation[].scale'] = {
    label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.scale'),
    type: 'float',
    default: 1.0
  }

  // 添加opacity字段
  fieldDescriptions['customAnimation[].opacity'] = {
    label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.opacity'),
    type: 'float',
    min: 0,
    max: 100,
    default: 100
  }

  // 添加easing字段
  fieldDescriptions['customAnimation[].easing'] = {
    label: translatable(lang, 'chat.box.component.global.portrait.custom.animation.easing'),
    type: 'enum',
    default: 'EASE_IN_SINE',
    mode:'bottom',
    enumOptions: easing
  }

  return fieldDescriptions
}

export const functionalButtonSetting = lang => {
  // 创建字段描述对象
  const fieldDescriptions = {}

  // 添加type字段
  fieldDescriptions['functionalButton[].type'] = {
    label: translatable(lang, 'chat.box.theme.functional.button.type'),
    type: 'enum',
    enumOptions: functionalButtonType.values(lang)
  }

  // 添加texture字段
  fieldDescriptions['functionalButton[].texture'] = {
    label: translatable(lang, 'chat.box.theme.functional.button.texture'),
    type: 'string'
  }

  // 添加hoverTexture字段
  fieldDescriptions['functionalButton[].hoverTexture'] = {
    label: translatable(lang, 'chat.box.theme.functional.button.hover_texture'),
    type: 'string'
  }

  // 添加x字段
  const xDefault = 0
  fieldDescriptions['functionalButton[].x'] = {
    default: xDefault,
    label: translatableArg(lang, 'chat.box.theme.component.x', xDefault),
    type: 'float'
  }

  // 添加y字段
  const yDefault = 0
  fieldDescriptions['functionalButton[].y'] = {
    default: yDefault,
    label: translatableArg(lang, 'chat.box.theme.component.y', yDefault),
    type: 'float'
  }

  // 添加width字段
  const widthDefault = 5
  fieldDescriptions['functionalButton[].width'] = {
    default: widthDefault,
    label: translatableArg(lang, 'chat.box.theme.component.width', widthDefault),
    min: 0,
    type: 'float'
  }

  // 添加height字段
  const heightDefault = 8
  fieldDescriptions['functionalButton[].height'] = {
    default: heightDefault,
    label: translatableArg(lang, 'chat.box.theme.component.height', heightDefault),
    min: 0,
    type: 'float'
  }

  // 添加alignX字段
  const alignXDefault = 'RIGHT'
  fieldDescriptions['functionalButton[].alignX'] = {
    default: alignXDefault,
    label: translatableArg(lang, 'chat.box.theme.component.align.x', translatable(lang, alignXList.of(alignXDefault))),
    type: 'enum',
    enumOptions: alignXList.values(lang)
  }

  // 添加alignY字段
  const alignYDefault = 'BOTTOM'
  fieldDescriptions['functionalButton[].alignY'] = {
    default: alignYDefault,
    label: translatableArg(lang, 'chat.box.theme.component.align.y', translatable(lang, alignYList.of(alignYDefault))),
    type: 'enum',
    enumOptions: alignYList.values(lang)
  }

  // 添加opacity字段
  const opacityDefault = 100
  fieldDescriptions['functionalButton[].opacity'] = {
    default: opacityDefault,
    label: translatableArg(lang, 'chat.box.theme.component.opacity', opacityDefault),
    type: 'float',
    min: 0,
    max: 100
  }

  // 添加renderOrder字段
  const renderOrderDefault = 30
  fieldDescriptions['functionalButton[].renderOrder'] = {
    default: renderOrderDefault,
    label: translatableArg(lang, 'chat.box.theme.component.renderOrder', renderOrderDefault),
    type: 'integer',
  }

  return fieldDescriptions
}
