import { formatUtil } from '@/utils/formatUtil.js'
import { t } from '@/languages/index.js'

export const textAlign = formatUtil.createEnum({
  LEFT: t('左对齐'),
  CENTER: t('居中'),
  RIGHT: t('右对齐')
})

export const alignXList = formatUtil.createEnum({
  LEFT: t('左对齐'),
  CENTER: t('居中'),
  RIGHT: t('右对齐')
})

export const alignYList = formatUtil.createEnum({
  TOP: t('上对齐'),
  CENTER: t('居中'),
  BOTTOM: t('下对齐')
})

export const portraitType = formatUtil.createEnum({
  TEXTURE: t('图片'),
  PLAYER_HEAD: t('玩家头像'),
  ITEM: t('物品')
})

export const attachmentType = formatUtil.createEnum({
  TEXTURE: t('图片'),
  TEXT: t('文本')
})

export const functionalButtonType = formatUtil.createEnum({
  LOG: t('历史记录'),
  FASTFORWARD: t('快进'),
  AUTOPLAY: t('自动播放')
})

export const DEFAULT_BTN_TEXTURES = {
  LOG: 'chatbox:textures/button/default_log.png',
  FASTFORWARD: 'chatbox:textures/button/default_fastforward.png',
  AUTOPLAY: 'chatbox:textures/button/default_autoplay.png'
}

export const renderEventTrigger = (type = '') => {
  const events = {
    start: t('组件渲染开始时'),
    end: t('组件渲染结束时')
  }

  if (type === 'portrait') {
    Object.assign(events, {
      click: t('立绘被点击时'),
      mouse_over: t('鼠标悬停在立绘上时'),
      mouse_out: t('鼠标离开立绘时')
    })
  }

  return formatUtil.createEnum(events)
}

export const eventType = formatUtil.createEnum({
  command: t('执行指令'),
  jump: t('强制跳转对话'),
  goto_next: t('到下一句对话'),
  play_sound: t('播放音效'),
  play_voice: t('播放语音'),
  stop_sound: t('停止特定音效'),
  hide: t('隐藏特定组件'),
  show: t('显示特定组件'),
  replace: t('替换自身为特定组件'),
  set_autoplay: t('设置是否自动播放'),
  scale: t('缩放立绘'),
  play_animation: t('播放一个动画'),
  restart_animation: t('重新播放该立绘拥有的动画'),
  terra_entity_shop: t('打开泰拉生物NPC商店')
})

export const easing = formatUtil.createEnum({
  EASE_IN_SINE: 'EASE_IN_SINE',
  EASE_OUT_SINE: 'EASE_OUT_SINE',
  EASE_IN_OUT_SINE: 'EASE_IN_OUT_SINE',
  EASE_IN_QUAD: 'EASE_IN_QUAD',
  EASE_OUT_QUAD: 'EASE_OUT_QUAD',
  EASE_IN_OUT_QUAD: 'EASE_IN_OUT_QUAD',
  EASE_IN_CUBIC: 'EASE_IN_CUBIC',
  EASE_OUT_CUBIC: 'EASE_OUT_CUBIC',
  EASE_IN_OUT_CUBIC: 'EASE_IN_OUT_CUBIC',
  EASE_IN_QUART: 'EASE_IN_QUART',
  EASE_OUT_QUART: 'EASE_OUT_QUART',
  EASE_IN_OUT_QUART: 'EASE_IN_OUT_QUART',
  EASE_IN_QUINT: 'EASE_IN_QUINT',
  EASE_OUT_QUINT: 'EASE_OUT_QUINT',
  EASE_IN_OUT_QUINT: 'EASE_IN_OUT_QUINT',
  EASE_IN_EXPO: 'EASE_IN_EXPO',
  EASE_OUT_EXPO: 'EASE_OUT_EXPO',
  EASE_IN_OUT_EXPO: 'EASE_IN_OUT_EXPO',
  EASE_IN_CIRC: 'EASE_IN_CIRC',
  EASE_OUT_CIRC: 'EASE_OUT_CIRC',
  EASE_IN_OUT_CIRC: 'EASE_IN_OUT_CIRC',
  EASE_IN_BACK: 'EASE_IN_BACK',
  EASE_OUT_BACK: 'EASE_OUT_BACK',
  EASE_IN_OUT_BACK: 'EASE_IN_OUT_BACK',
  EASE_IN_ELASTIC: 'EASE_IN_ELASTIC',
  EASE_OUT_ELASTIC: 'EASE_OUT_ELASTIC',
  EASE_IN_OUT_ELASTIC: 'EASE_IN_OUT_ELASTIC',
  EASE_IN_BOUNCE: 'EASE_IN_BOUNCE',
  EASE_OUT_BOUNCE: 'EASE_OUT_BOUNCE',
  EASE_IN_OUT_BOUNCE: 'EASE_IN_OUT_BOUNCE'
})

export const autoCompleteDataSources = formatUtil.createEnum({
  TEXTURE: 'TEXTURE',
  ITEM: 'ITEM',
  BLOCK: 'BLOCK',
  ENCHANTMENT: 'ENCHANTMENT',
  EFFECT: 'EFFECT',
  ATTRIBUTE: 'ATTRIBUTE',
  PRESET_ANIMATION: 'PRESET_ANIMATION',
  TRANSLATABLE_KEYS: 'TRANSLATABLE_KEYS',
  PORTRAIT: 'PORTRAIT'
})

export const builtinAnimations = [
  { label: t('FADE_IN (淡入)'), value: 'FADE_IN' },
  { label: t('SLIDE_IN_FROM_BOTTOM (底部滑入)'), value: 'SLIDE_IN_FROM_BOTTOM' },
  { label: t('BOUNCE (弹跳)'), value: 'BOUNCE' }
]

export const USER_DEFINED_PRESETS = {
  'FADE_IN': [
    { 'time': 1, 'opacity': 0 },
    { 'time': 30, 'opacity': 100, 'easing': 'EASE_OUT_SINE' }
  ],
  'SLIDE_IN_FROM_BOTTOM': [
    { 'time': 30, 'yOffset': -5, 'easing': 'EASE_OUT_SINE' }
  ],
  'BOUNCE': [
    { 'time': 15, 'yOffset': -5, 'easing': 'EASE_OUT_SINE' },
    { 'time': 15, 'yOffset': 5, 'easing': 'EASE_OUT_SINE' }
  ]
}
