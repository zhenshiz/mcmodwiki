<script setup>
import { useChatBoxEditorStore } from '@/stores'
import { computed, ref, watch } from 'vue'
import InteractItem from '@/components/InteractItem.vue'
import rightMouse from '@/assets/more/chatbox/assets/chatbox/textures/key/right_mouse.png'
import scrollMouse from '@/assets/more/chatbox/assets/chatbox/textures/key/scroll_mouse.png'
import { getHeadUrl } from '@/utils/mcHelper.js'
import { formatUtil } from '@/utils/formatUtil.js'
import {
  attachmentType,
  DEFAULT_BTN_TEXTURES,
  portraitType,
  USER_DEFINED_PRESETS
} from '@/assets/more/chatbox/enumTypes.js'
import { itemSuggestions } from '@/assets/textures/mcTextures'
import gsap from 'gsap'
import { t } from '../../../../../languages/index.js'

const store = useChatBoxEditorStore()
const model = computed(() => store.currentModel)

const props = defineProps({
    initialScale: { type: Number, default: 0.6 },
    dimensions: { type: Object }
})

const baseDimensions = computed(() => props.dimensions)

const scale = computed(() => props.initialScale)

const getSpecialStyle = (component, containerW, containerH) => {
    const style = component.getStyle(containerW, containerH)

    if (formatUtil.equalsIgnoreCase(component.type, portraitType.PLAYER_HEAD)) {
        const wPercent = (component.width ?? 10) / 100
        const hPercent = (component.height ?? 10) / 100

        const size = wPercent * containerW + hPercent * containerH

        style.width = `${size}px`
        style.height = `${size}px`
    } else if (formatUtil.equalsIgnoreCase(component.type, portraitType.ITEM)) {
        const BASE_ITEM_SIZE = 64
        style.width = `${BASE_ITEM_SIZE}px`
        style.height = `${BASE_ITEM_SIZE}px`
    }

    return style
}

// === 动画播放逻辑 (GSAP) ===
const componentRefs = ref({})
const setComponentRef = (el, key) => {
    if (el) componentRefs.value[key] = el
}

watch(() => store.previewAnimationKey, (key) => {
    if (key && model.value.portrait[key]) {
        runAnimation(key, model.value.portrait[key])
    }
})

const mapEasing = (mcEasing) => {
    if (!mcEasing) return 'none'
    const lower = mcEasing.toLowerCase()

    let type = 'none'
    if (lower.includes('sine')) type = 'sine'
    else if (lower.includes('quad')) type = 'power1'
    else if (lower.includes('cubic')) type = 'power2'
    else if (lower.includes('quart')) type = 'power3'
    else if (lower.includes('quint')) type = 'power4'
    else if (lower.includes('expo')) type = 'expo'
    else if (lower.includes('circ')) type = 'circ'
    else if (lower.includes('back')) type = 'back(1.7)'
    else if (lower.includes('elastic')) type = 'elastic(1, 0.3)'
    else if (lower.includes('bounce')) type = 'bounce'

    let direction = 'out'
    if (lower.includes('in_out')) direction = 'inOut'
    else if (lower.includes('in')) direction = 'in'
    else if (lower.includes('out')) direction = 'out'

    if (type === 'none') return 'none'
    return `${type}.${direction}`
}

const runAnimation = (key, portrait) => {
    const componentInstance = componentRefs.value[key]
    if (!componentInstance) return

    const targetDom = componentInstance.$el || componentInstance
    const imgElement = targetDom.querySelector('img')
    let originalSrc = ''
    if (imgElement) originalSrc = imgElement.src

    gsap.killTweensOf(targetDom)
    if (imgElement) gsap.killTweensOf(imgElement)

    // 1. 获取关键帧
    let rawKeyframes = []
    if (portrait.customAnimation && portrait.customAnimation.length > 0) {
        rawKeyframes = portrait.customAnimation
    } else if (portrait.animation) {
        const preset = model.value.customAnimation?.[portrait.animation]
        const builtin = typeof USER_DEFINED_PRESETS !== 'undefined' ? USER_DEFINED_PRESETS[portrait.animation] : null

        const targetPreset = preset || builtin

        if (targetPreset) {
            if (Array.isArray(targetPreset)) rawKeyframes = targetPreset
            else if (Array.isArray(targetPreset.keyframes)) rawKeyframes = targetPreset.keyframes
        }
    }

    if (!rawKeyframes || rawKeyframes.length === 0) {
        return
    }

    const keyframes = rawKeyframes

    const containerW = baseDimensions.value.width
    const containerH = baseDimensions.value.height

    // 2. 创建时间轴
    const tl = gsap.timeline({
        onComplete: () => {
            setTimeout(() => {
                gsap.set(targetDom, { clearProps: 'all' })
                const baseStyle = getSpecialStyle(portrait, containerW, containerH)
                if (portrait.renderOrder !== null) {
                    targetDom.style.zIndex = Number(portrait.renderOrder)
                }
                Object.assign(targetDom.style, baseStyle)
                if (imgElement && originalSrc) imgElement.src = originalSrc
            }, 500)
        }
    })

    const getProps = (kf) => {
        const props = {}
        const { width: W, height: H } = baseDimensions.value

        const rawW = (portrait.width / 100) * W
        const rawH = (portrait.height / 100) * H

        let baseX = 0
        if (formatUtil.equalsIgnoreCase(portrait.alignX, 'CENTER')) baseX = W * 0.5 - rawW / 2
        else if (formatUtil.equalsIgnoreCase(portrait.alignX, 'RIGHT')) baseX = W - rawW

        let baseY = 0
        if (formatUtil.equalsIgnoreCase(portrait.alignY, 'CENTER')) baseY = H * 0.5 - rawH / 2
        else if (formatUtil.equalsIgnoreCase(portrait.alignY, 'BOTTOM')) baseY = H - rawH

        if (kf.x != null) {
            const kfPx = (kf.x / 100) * W
            props.left = baseX + kfPx

            props.x = kf.xOffset != null ? (kf.xOffset / 100) * W : 0
        } else if (kf.xOffset != null) {
            props.x = (kf.xOffset / 100) * W
        }

        if (kf.y != null) {
            const kfPx = (kf.y / 100) * H
            props.top = baseY + kfPx

            props.y = kf.yOffset != null ? (kf.yOffset / 100) * H : 0
        } else if (kf.yOffset != null) {
            props.y = (kf.yOffset / 100) * H
        }

        if (kf.scale != null) props.scale = kf.scale
        if (kf.angle != null) props.rotation = kf.angle
        if (kf.opacity != null) props.opacity = kf.opacity / 100
        if (kf.brightness != null) props.filter = `brightness(${kf.brightness}%)`

        return props
    }

    keyframes.forEach((kf) => {
        const durationFrames = kf.time || 1
        const durationSeconds = durationFrames / 60

        const vars = getProps(kf)
        vars.ease = mapEasing(kf.easing)

        tl.to(targetDom, { duration: durationSeconds, ...vars })

        if (kf.texture && imgElement) {
            const nextUrl = store.getTextureUrl(kf.texture)
            if (nextUrl) {
                tl.set(imgElement, { attr: { src: nextUrl } })
            }
        }
    })
}

const canvasStyle = computed(() => {
    let bgColor = 'rgba(0, 21, 41, 0.9)'

    if (model.value && model.value._bgColor !== undefined && model.value._bgColor !== null) {
        bgColor = intToCssColor(model.value._bgColor)
    }

    return {
        width: `${baseDimensions.value.width}px`,
        height: `${baseDimensions.value.height}px`,
        transformOrigin: '0 0',
        backgroundColor: bgColor,
        transition: 'background-color 0.3s ease'
    }
})
const isSel = (comp) => store.selectedComponent === comp

const getSmartButton = (btn, index) => {
    return new Proxy(btn, {
        get(target, prop) {
            if (prop === 'x') {
                if (target.x === null || target.x === undefined) {
                    const step = target.alignX === 'left' ? 5 : -5
                    return step * index
                }
                return target.x
            }
            return target[prop]
        },
        set(target, prop, value) {
            if (prop === 'x') {
                target.x = value
                return true
            }
            target[prop] = value
            return true
        }
    })
}

const getAttachmentWrapper = (portrait, attachment) => {
    return new Proxy(attachment, {
        get(target, prop) {
            const { width: W, height: H } = baseDimensions.value

            if (prop === 'x' || prop === 'y') {
                const rawW = (portrait.width / 100) * W
                const rawH = (portrait.height / 100) * H

                let parentBaseX = 0
                if (formatUtil.equalsIgnoreCase(portrait.alignX, 'CENTER')) parentBaseX = W * 0.5 - rawW / 2
                else if (formatUtil.equalsIgnoreCase(portrait.alignX, 'RIGHT')) parentBaseX = W - rawW

                let parentBaseY = 0
                if (formatUtil.equalsIgnoreCase(portrait.alignY, 'CENTER')) parentBaseY = H * 0.5 - rawH / 2
                else if (formatUtil.equalsIgnoreCase(portrait.alignY, 'BOTTOM')) parentBaseY = H - rawH

                const parentAbsX = parentBaseX + (portrait.x / 100) * W
                const parentAbsY = parentBaseY + (portrait.y / 100) * H

                const attOffsetPx = ((target[prop] || 0) / 100) * (prop === 'x' ? W : H)

                const finalPx = (prop === 'x' ? parentAbsX : parentAbsY) + attOffsetPx

                return (finalPx / (prop === 'x' ? W : H)) * 100
            }

            return target[prop]
        },

        set(target, prop, value) {
            if (prop === 'x' || prop === 'y') {
                const { width: W, height: H } = baseDimensions.value
                const rawW = (portrait.width / 100) * W
                const rawH = (portrait.height / 100) * H

                // 1. 计算父组件绝对位置
                let parentBaseX = 0
                if (formatUtil.equalsIgnoreCase(portrait.alignX, 'CENTER')) parentBaseX = W * 0.5 - rawW / 2
                else if (formatUtil.equalsIgnoreCase(portrait.alignX, 'RIGHT')) parentBaseX = W - rawW

                let parentBaseY = 0
                if (formatUtil.equalsIgnoreCase(portrait.alignY, 'CENTER')) parentBaseY = H * 0.5 - rawH / 2
                else if (formatUtil.equalsIgnoreCase(portrait.alignY, 'BOTTOM')) parentBaseY = H - rawH

                const parentAbsX = parentBaseX + (portrait.x / 100) * W
                const parentAbsY = parentBaseY + (portrait.y / 100) * H

                const currentAbsPx = (value / 100) * (prop === 'x' ? W : H)

                const attOffsetPx = currentAbsPx - (prop === 'x' ? parentAbsX : parentAbsY)

                target[prop] = Number(((attOffsetPx / (prop === 'x' ? W : H)) * 100).toFixed(2))
                return true
            }
            target[prop] = value
            return true
        }
    })
}

const intToCssColor = (intVal) => {
    if (intVal === -1 || intVal === undefined || intVal === null) return '#ffffff'
    if (typeof intVal === 'string') return intVal
    const hex = (intVal >>> 0).toString(16).padStart(8, '0')
    const a = hex.slice(0, 2)
    const r = hex.slice(2, 4)
    const g = hex.slice(4, 6)
    const b = hex.slice(6, 8)
    return `#${r}${g}${b}${a}`
}

const getAttachmentTextStyle = (att) => {
    const color = intToCssColor(att.textColor)
    return {
        color: color,
        textAlign: att.textAlign || 'left',
        whiteSpace: att.lineBreak ? 'normal' : 'nowrap',
        wordBreak: att.lineBreak ? 'break-word' : 'normal',
        fontSize: '20px',
        fontFamily: 'Minecraft, monospace',
        lineHeight: '1.2',
        textShadow: '2px 2px 0px rgba(0,0,0,0.5)'
    }
}

const getOptionRankStyle = (option, index, dims) => {
    const { width: W, height: H } = dims

    const baseStyle = option.getStyle(W, H)

    const hVal = parseFloat(baseStyle.height)
    const topVal = parseFloat(baseStyle.top)

    const list = option._text && option._text.length ? option._text : ['Preview']
    const num = list.length

    const alignY = (option.alignY || 'TOP').toUpperCase()

    let finalTop = topVal + index * hVal

    if (alignY === 'CENTER') {
        finalTop -= (num - 1) * hVal / 2
    } else if (alignY === 'BOTTOM') {
        finalTop -= (num - 1) * hVal
    }

    const style = {
        ...baseStyle,
        top: `${finalTop}px`,
        zIndex: (option.renderOrder || 10)
    }

    if (index > 0) {
        style.pointerEvents = 'none'
        style.userSelect = 'none'
        style.zIndex = style.zIndex - 1
    }

    return style
}

const getFunctionButtonUrl = (btn) => {
    if (btn.texture) {
        const userUrl = store.getTextureUrl(btn.texture)
        if (userUrl) return userUrl
    }

    const type = btn.type.toUpperCase() || btn.functionType.toUpperCase()

    if (type && DEFAULT_BTN_TEXTURES[type]) {
        return store.getTextureUrl(DEFAULT_BTN_TEXTURES[type])
    }

    return null
}

const keyBtnClass = 'bg-[#505050] border-t-2 border-l-2 border-[#707070] border-b-2 border-r-2 border-[#202020] px-0.5 h-[40px] flex items-center justify-center min-w-[16px] box-border'
const keyTextClass = 'text-[30px] text-white font-mono leading-none shadow-sm mt-[-2px]'
const labelClass = 'text-[30px] text-white font-bold drop-shadow-md ml-0.5'
</script>

<template>
  <div v-if="store.viewMode === 'theme' && model" :key="store.currentFile?.path || 'theme-view'"
       class="relative border border-slate-700 shadow-2xl origin-top-left" :style="canvasStyle"
       @mousedown.stop="store.selectComponent(null)">

    <div class="absolute -top-8 left-0 text-white/40 text-xs pointer-events-none whitespace-nowrap font-mono">
      {{ baseDimensions.width }} x {{ baseDimensions.height }}
    </div>

    <template v-if="model.portrait">
      <template v-for="(portrait, key) in model.portrait" :key="key">
        <InteractItem :ref="(el) => setComponentRef(el, key)" v-show="!portrait._hidden" :component="portrait"
                      :container-w="baseDimensions.width" :container-h="baseDimensions.height" :scale="scale"
                      :is-selected="isSel(portrait)"
                      :resizable="formatUtil.equalsIgnoreCase(portrait.type, portraitType.TEXTURE)" :label="key"
                      @select="store.selectComponent(portrait, key)"
                      :override-style="getSpecialStyle(portrait, baseDimensions.width, baseDimensions.height)">

          <div class="w-full h-full flex items-center justify-center overflow-hidden relative"
               :class="{
                            'border border-purple-500/30 text-purple-300': formatUtil.equalsIgnoreCase(portrait.type, portraitType.TEXTURE),
                            'border border-blue-500/30 text-blue-300': formatUtil.equalsIgnoreCase(portrait.type, portraitType.PLAYER_HEAD),
                            'border border-yellow-500/30 text-yellow-300': formatUtil.equalsIgnoreCase(portrait.type, portraitType.ITEM)
                        }">
            <template
              v-if="formatUtil.equalsIgnoreCase(portrait.type, portraitType.TEXTURE) || !portrait.type">
              <img v-if="store.getTextureUrl(portrait.texture)"
                   :src="store.getTextureUrl(portrait.texture)" class="w-full h-full object-fill pixelated"
                   draggable="false" />
              <span v-else class="text-xs">{{ key }}</span>
            </template>

            <template v-else-if="formatUtil.equalsIgnoreCase(portrait.type, portraitType.PLAYER_HEAD)">
              <img :key="portrait.texture" :src="getHeadUrl((portrait.texture))"
                   class="w-full h-full object-contain pixelated drop-shadow-sm" draggable="false"
                   @error="(e) => e.target.src = getHeadUrl('@s')" />
            </template>

            <template v-else-if="formatUtil.equalsIgnoreCase(portrait.type, portraitType.ITEM)">
              <img v-if="itemSuggestions.find(item => item.value.replace('minecraft:', '') === portrait.texture.replace('minecraft:', ''))"
                   :src="itemSuggestions.find(item => item.value.replace('minecraft:', '') === portrait.texture.replace('minecraft:', '')).icon"
                   class="w-full h-full object-contain pixelated drop-shadow-sm" draggable="false" />
              <div v-else class="flex flex-col items-center justify-center p-1 text-center w-full h-full">
                                <span class="text-[10px] font-mono leading-tight break-all">{{ portrait.texture ||
                                'Item'
                                  }}</span>
              </div>
            </template>
          </div>
        </InteractItem>

        <template v-if="portrait.attachment && !portrait._hidden">
          <InteractItem v-for="(att, idx) in portrait.attachment" :key="`${key}_att_${idx}`"
                        :component="getAttachmentWrapper(portrait, att)" :container-w="baseDimensions.width"
                        :container-h="baseDimensions.height" :scale="scale" :is-selected="isSel(att)"
                        :label="`Attach #${idx + 1}`" @select="store.selectComponent(att, `${key}_att_${idx}`)">
            <div class="w-full h-full border border-dashed border-green-400/30 relative overflow-hidden flex"
                 :class="{ 'items-center justify-center': formatUtil.equalsIgnoreCase(att.type, attachmentType.TEXTURE) }">
              <template v-if="formatUtil.equalsIgnoreCase(att.type, attachmentType.TEXTURE)">
                <img v-if="att.value && store.getTextureUrl(att.value)"
                     :src="store.getTextureUrl(att.value)" class="w-full h-full object-fill pixelated"
                     draggable="false" />
                <span v-else class="text-[8px] text-green-300 opacity-70">{{ t('图片附件') }}</span>
              </template>
              <template v-else-if="formatUtil.equalsIgnoreCase(att.type, attachmentType.TEXT)">
                <div class="w-full h-full p-1" :style="getAttachmentTextStyle(att)">
                  {{ att.value || 'Text' }}
                </div>
              </template>
              <span v-else
                    class="text-[8px] text-green-300 opacity-70 flex items-center justify-center w-full">{{ t('未知类型')
                }}</span>
            </div>
          </InteractItem>
        </template>
      </template>
    </template>

    <InteractItem v-if="model.dialogBox && !model.dialogBox._hidden" :component="model.dialogBox"
                  :container-w="baseDimensions.width" :container-h="baseDimensions.height" :scale="scale"
                  :is-selected="isSel(model.dialogBox)" label="DialogBox"
                  @select="store.selectComponent(model.dialogBox, '@dialog')">

      <div class="w-full h-full relative">

        <img v-if="store.getTextureUrl(model.dialogBox.texture)"
             :src="store.getTextureUrl(model.dialogBox.texture)"
             class="absolute inset-0 w-full h-full object-fill pixelated select-none pointer-events-none"
             draggable="false" />

        <div v-else
             class="w-full h-full border-2 border-dashed border-blue-500/30 flex items-center justify-center">
          <div class="text-center p-1 pointer-events-none">
            <span class="text-blue-300 text-xs font-bold">{{ t('对话框') }}</span><br>
            <span class="opacity-50 text-[10px] text-blue-200">{{ t('请在右侧设置贴图') }}</span>
          </div>
        </div>

        <div class="absolute text-yellow-200 font-bold whitespace-nowrap pointer-events-none select-none"
             :style="{
                        left: `${(model.dialogBox.nameX || 0) / 100 * baseDimensions.width}px`,
                        top: `${(model.dialogBox.nameY || 0) / 100 * baseDimensions.height}px`,
                        textAlign: (model.dialogBox.textAlign || 'left').toLowerCase(),
                        fontSize: '30px',
                        fontFamily: 'Minecraft, monospace',
                        textShadow: '2px 2px 0px #3f3f3f'
                    }">
          {{ model.dialogBox._name }}
        </div>

        <div class="absolute text-white pointer-events-none select-none" :style="{
                    left: `${(model.dialogBox.textX || 0) / 100 * baseDimensions.width}px`,
                    top: `${(model.dialogBox.textY || 0) / 100 * baseDimensions.height}px`,
                    width: model.dialogBox.lineWidth ? `${(model.dialogBox.lineWidth / 100) * baseDimensions.width}px` : 'auto',
                    textAlign: (model.dialogBox.textAlign || 'left').toLowerCase(),
                    fontSize: '30px',
                    fontFamily: 'Minecraft, monospace',
                    lineHeight: '1.2',
                    whiteSpace: model.dialogBox.lineWidth ? 'normal' : 'nowrap',
                    wordBreak: 'break-word',
                    textShadow: '2px 2px 0px #3f3f3f'
                }">
          {{ model.dialogBox._text }}
        </div>

      </div>
    </InteractItem>

    <template v-if="model.option && !model.option._hidden">
      <template
        v-for="(text, index) in (model.option._text && model.option._text.length ? model.option._text : ['test'])"
        :key="index">

        <InteractItem v-if="index === 0" :component="model.option" :container-w="baseDimensions.width"
                      :container-h="baseDimensions.height" :scale="scale" :is-selected="isSel(model.option)"
                      label="Options" :override-style="getOptionRankStyle(model.option, 0, baseDimensions)"
                      @select="store.selectComponent(model.option, '@option')">

          <div class="w-full h-full relative">
            <img v-if="store.getTextureUrl(model.option.texture)"
                 :src="store.getTextureUrl(model.option.texture)"
                 class="absolute inset-0 w-full h-full object-fill pixelated select-none pointer-events-none"
                 draggable="false" />
            <div v-else
                 class="w-full h-full border-2 border-dashed border-green-500/50 flex items-center justify-center">
              <span class="text-[10px] text-green-200 opacity-50 font-mono"
                    v-if="!text">{{ t('选项') }}</span>
            </div>

            <div class="absolute pointer-events-none select-none whitespace-nowrap" :style="{
                            width: '100%',
                            left: `${(model.option.optionChatX || 0) / 100 * baseDimensions.width}px`,
                            top: `${(model.option.optionChatY || 0) / 100 * baseDimensions.height}px`,
                            textAlign: (model.option.textAlign || 'left').toLowerCase(),
                            fontSize: '30px',
                            fontFamily: 'Minecraft, monospace',
                            lineHeight: '1.2',
                            textShadow: '2px 2px 0px #3f3f3f',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }">
              {{ text }}
            </div>
          </div>
        </InteractItem>

        <div v-else class="absolute select-none"
             :style="getOptionRankStyle(model.option, index, baseDimensions)">

          <div class="w-full h-full relative">
            <img v-if="store.getTextureUrl(model.option.texture)"
                 :src="store.getTextureUrl(model.option.texture)"
                 class="absolute inset-0 w-full h-full object-fill pixelated" draggable="false" />
            <div v-else class="w-full h-full border border-dashed border-green-500/30">
            </div>

            <div class="absolute whitespace-nowrap" :style="{
                            width: '100%',
                            left: `${(model.option.optionChatX || 0) / 100 * baseDimensions.width}px`,
                            top: `${(model.option.optionChatY || 0) / 100 * baseDimensions.height}px`,
                            textAlign: (model.option.textAlign || 'left').toLowerCase(),
                            fontSize: '30px',
                            fontFamily: 'Minecraft, monospace',
                            lineHeight: '1.2',
                            color: 'white',
                            textShadow: '2px 2px 0px #3f3f3f'
                        }">
              {{ text }}
            </div>
          </div>
        </div>

      </template>
    </template>

    <InteractItem v-if="model.keyPrompt && model.keyPrompt.visible" :component="model.keyPrompt"
                  :container-w="baseDimensions.width" :container-h="baseDimensions.height" :scale="scale"
                  :is-selected="isSel(model.keyPrompt)" :resizable="false" label="KeyPrompt" :auto-size="true"
                  @select="store.selectComponent(model.keyPrompt, '@keyPrompt')">
      <div class="flex items-center gap-1 px-1 py-0.5 whitespace-nowrap pointer-events-none select-none">
        <div class="flex items-center gap-0.5"><img :src="rightMouse"
                                                    class="w-[40px] h-[40px] object-contain pixelated" /><span
          :class="labelClass">{{ t('确定') }}</span></div>
        <div class="flex items-center gap-0.5"><img :src="scrollMouse"
                                                    class="w-[40px] h-[40px] object-contain pixelated" /><span
          :class="labelClass">{{ t('切换选项') }}</span></div>
        <div class="w-1"></div>
        <div class="flex items-center gap-0.5">
          <div :class="keyBtnClass"><span :class="keyTextClass">Esc</span></div>
          <span :class="labelClass">{{ t('关闭对话框') }}</span>
        </div>
        <div class="w-1"></div>
        <div class="flex items-center gap-0.5">
          <div :class="keyBtnClass"><span :class="keyTextClass">Ctrl</span></div>
          <span :class="labelClass">{{ t('快进对话') }}</span>
        </div>
        <div class="w-1"></div>
        <div class="flex items-center gap-0.5">
          <div :class="keyBtnClass"><span :class="keyTextClass">F6</span></div>
          <span :class="labelClass">{{ t('自动播放') }}</span>
        </div>
      </div>
    </InteractItem>

    <template v-if="model.functionalButton">
      <InteractItem v-for="(btn, index) in model.functionalButton" :key="index" v-show="!btn._hidden"
                    :component="getSmartButton(btn, index)" :container-w="baseDimensions.width"
                    :container-h="baseDimensions.height" :scale="scale" :is-selected="isSel(btn)"
                    :label="`Btn ${index + 1}`" @select="store.selectComponent(btn, `btn_${index}`)">

        <div class="w-full h-full relative">
          <img v-if="getFunctionButtonUrl(btn)" :src="getFunctionButtonUrl(btn)"
               class="w-full h-full object-fill pixelated select-none pointer-events-none" draggable="false" />

          <div v-else
               class="w-full h-full border border-orange-500/30 flex items-center justify-center text-orange-300 text-[10px]">
            {{ btn.type || btn.functionType || 'BTN' }}
          </div>
        </div>
      </InteractItem>
    </template>

    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 pointer-events-none text-4xl font-bold select-none whitespace-nowrap z-0" />
  </div>
</template>
