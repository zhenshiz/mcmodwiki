import { zh_cn } from './lang/zh_cn.js'
import { en_us } from './lang/en_us.js'
import { usePageStore } from '@/stores/index.js'

const pageStore = usePageStore()

export const language = {
  enum: {
    ZH_CN: { text: '中文', value: 'zh_cn' },
    EN_US: { text: 'English', value: 'en_us' }
  },
  values: function() {
    let languages = []
    Object.entries(this.enum).forEach((k, v) => {
      languages.push(k[1])
    })
    return languages
  }
}

const onlyLang = {}
onlyLang[language.enum.ZH_CN.value] = zh_cn
onlyLang[language.enum.EN_US.value] = en_us

export function translatable(lang) {
  return onlyLang[pageStore.setting.language][lang]
}

export function translatableArg(lang, ...arg) {
  lang = translatable(lang)
  return lang.replace(/%s/g, () => {
    // 从 arg 数组中依次取值进行替换
    return arg.length > 0 ? arg.shift() : ''
  })
}
