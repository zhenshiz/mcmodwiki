import { zh_cn } from './lang/zh_cn.js'
import { en_us } from './lang/en_us.js'

export const language = {
  enum: {
    ZH_CN: { label: '中文', value: 'zh_cn' },
    EN_US: { label: 'English', value: 'en_us' }
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

export function translatable(lang, key) {
  return onlyLang[lang][key]
}

export function translatableArg(key, lang, ...arg) {
  lang = translatable(key, lang)
  return lang.replace(/%s/g, () => {
    // 从 arg 数组中依次取值进行替换
    return arg.length > 0 ? arg.shift() : ''
  })
}
