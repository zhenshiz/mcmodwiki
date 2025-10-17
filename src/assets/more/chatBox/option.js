import { createEnum } from '@/utils/format.js'

export const textAlign = createEnum([
  { label: 'chat.box.theme.component.align.x.left', value: 'LEFT' },
  { label: 'chat.box.theme.component.align.x.center', value: 'CENTER' },
  { label: 'chat.box.theme.component.align.x.right', value: 'RIGHT' }
])

export const alignXList = createEnum([
  { label: 'chat.box.theme.component.align.x.left', value: 'LEFT' },
  { label: 'chat.box.theme.component.align.x.center', value: 'CENTER' },
  { label: 'chat.box.theme.component.align.x.right', value: 'RIGHT' }
])

export const alignYList = createEnum([
  { label: 'chat.box.theme.component.align.y.top', value: 'TOP' },
  { label: 'chat.box.theme.component.align.y.center', value: 'CENTER' },
  { label: 'chat.box.theme.component.align.y.bottom', value: 'BOTTOM' }
])

export const portraitType = createEnum([
  { label: 'chat.box.theme.component.portrait.type.texture', value: 'TEXTURE' },
  { label: 'chat.box.theme.component.portrait.type.player.head', value: 'PLAYER_HEAD' },
  { label: 'chat.box.theme.component.portrait.type.item', value: 'ITEM' }
])

export const functionalButtonType = createEnum([
  { label: 'chat.box.theme.functional.button.type.log', value: 'LOG' },
  { label: 'chat.box.theme.functional.button.type.fast_forward', value: 'FASTFORWARD' },
  { label: 'chat.box.theme.functional.button.type.autoplay', value: 'AUTOPLAY' }
])

export const clickType = createEnum([
  { label: 'chat.box.dialogues.options.click.type.command', value: 'COMMAND' },
  { label: 'chat.box.dialogues.options.click.type.terraEntityShop', value: 'TERRA_ENTITY_SHOP' }
])

export const easing =
  [
    { 'label': 'EASE_IN_SINE', 'value': 'EASE_IN_SINE' },
    { 'label': 'EASE_OUT_SINE', 'value': 'EASE_OUT_SINE' },
    { 'label': 'EASE_IN_OUT_SINE', 'value': 'EASE_IN_OUT_SINE' },
    { 'label': 'EASE_IN_QUAD', 'value': 'EASE_IN_QUAD' },
    { 'label': 'EASE_OUT_QUAD', 'value': 'EASE_OUT_QUAD' },
    { 'label': 'EASE_IN_OUT_QUAD', 'value': 'EASE_IN_OUT_QUAD' },
    { 'label': 'EASE_IN_CUBIC', 'value': 'EASE_IN_CUBIC' },
    { 'label': 'EASE_OUT_CUBIC', 'value': 'EASE_OUT_CUBIC' },
    { 'label': 'EASE_IN_OUT_CUBIC', 'value': 'EASE_IN_OUT_CUBIC' },
    { 'label': 'EASE_IN_QUART', 'value': 'EASE_IN_QUART' },
    { 'label': 'EASE_OUT_QUART', 'value': 'EASE_OUT_QUART' },
    { 'label': 'EASE_IN_OUT_QUART', 'value': 'EASE_IN_OUT_QUART' },
    { 'label': 'EASE_IN_QUINT', 'value': 'EASE_IN_QUINT' },
    { 'label': 'EASE_OUT_QUINT', 'value': 'EASE_OUT_QUINT' },
    { 'label': 'EASE_IN_OUT_QUINT', 'value': 'EASE_IN_OUT_QUINT' },
    { 'label': 'EASE_IN_EXPO', 'value': 'EASE_IN_EXPO' },
    { 'label': 'EASE_OUT_EXPO', 'value': 'EASE_OUT_EXPO' },
    { 'label': 'EASE_IN_OUT_EXPO', 'value': 'EASE_IN_OUT_EXPO' },
    { 'label': 'EASE_IN_CIRC', 'value': 'EASE_IN_CIRC' },
    { 'label': 'EASE_OUT_CIRC', 'value': 'EASE_OUT_CIRC' },
    { 'label': 'EASE_IN_OUT_CIRC', 'value': 'EASE_IN_OUT_CIRC' },
    { 'label': 'EASE_IN_BACK', 'value': 'EASE_IN_BACK' },
    { 'label': 'EASE_OUT_BACK', 'value': 'EASE_OUT_BACK' },
    { 'label': 'EASE_IN_OUT_BACK', 'value': 'EASE_IN_OUT_BACK' },
    { 'label': 'EASE_IN_ELASTIC', 'value': 'EASE_IN_ELASTIC' },
    { 'label': 'EASE_OUT_ELASTIC', 'value': 'EASE_OUT_ELASTIC' },
    { 'label': 'EASE_IN_OUT_ELASTIC', 'value': 'EASE_IN_OUT_ELASTIC' },
    { 'label': 'EASE_IN_BOUNCE', 'value': 'EASE_IN_BOUNCE' },
    { 'label': 'EASE_OUT_BOUNCE', 'value': 'EASE_OUT_BOUNCE' },
    { 'label': 'EASE_IN_OUT_BOUNCE', 'value': 'EASE_IN_OUT_BOUNCE' }
  ]

export const themeList = [
  {
    label: 'RPG',
    value: 'RPG',
    json: JSON.parse(`{"option":{"texture":"chatbox:textures/options/default_no_checked_option.png","selectTexture":"chatbox:textures/options/default_checked_option.png","lockTexture":"chatbox:textures/options/default_lock_checked_option.png","x":0,"y":30,"width":35,"height":8,"alignX":"right","alignY":"top","optionChatX":-12,"optionChatY":-2,"textAlign":"left"},"dialogBox":{"texture":"chatbox:textures/chatbox/default_dialog_box.png","alignX":"left","alignY":"bottom","lineWidth":70,"width":100,"height":40,"nameX":20,"nameY":10,"textX":20,"textY":15},"functionalButton":[{"type":"LOG"},{"type":"FASTFORWARD"},{"type":"AUTOPLAY"}],"keyPrompt": {}}`)
  },
  {
    label: 'GalGame',
    value: 'GalGame',
    json: JSON.parse(`{"option":{"texture":"chatbox:textures/options/gal_no_checked_option.png","selectTexture":"chatbox:textures/options/gal_checked_option.png","lockTexture":"chatbox:textures/options/gal_no_checked_option.png","x":0,"y":20,"optionChatX":0,"optionChatY":-2,"width":50,"height":10,"alignX":"center","alignY":"top","textAlign":"center"},"dialogBox":{"texture":"chatbox:textures/chatbox/gal_dialog_box.png","alignX":"center","alignY":"bottom","x":0,"y":-5,"width":80,"height":40,"lineWidth":60,"nameX":10,"nameY":10,"textX":10,"textY":15},"functionalButton":[{"type":"LOG"},{"type":"FASTFORWARD"},{"type":"AUTOPLAY"}],"keyPrompt": {}}`)
  },
  { label: 'DIY', value: 'DIY' }
]
