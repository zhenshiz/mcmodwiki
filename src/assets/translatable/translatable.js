import { zh_cn } from './lang/zh_cn.js'
import { en_us } from './lang/en_us.js'
import { mcZh_Cn } from '@/assets/translatable/mc/zh_cn.js'
import { mcEn_Us } from '@/assets/translatable/mc/en_us.js'

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

export function translatable(lang = language.enum.EN_US.value, key) {
  if (onlyLang[lang] && onlyLang[lang][key]) {
    return onlyLang[lang][key]
  }
  return key
}

export function translatableArg(key, lang = language.enum.EN_US.value, ...arg) {
  const translatedText = translatable(key, lang)

  if (translatedText === key) {
    return key
  }

  return translatedText.replace(/%s/g, () => {
    return arg.length > 0 ? arg.shift() : ''
  })
}

export function mcTranslatable(lang = language.enum.EN_US.value, key) {
  if (lang === language.enum.ZH_CN.value) {
    return mcZh_Cn[key]
  } else if (lang === language.enum.EN_US.value) {
    return mcEn_Us[key]
  }
  return key
}

export const mcLanguageOptions = [
  { label: 'af_za', value: 'af_za' },
  { label: 'ar_sa', value: 'ar_sa' },
  { label: 'ast_es', value: 'ast_es' },
  { label: 'az_az', value: 'az_az' },
  { label: 'ba_ru', value: 'ba_ru' },
  { label: 'bar', value: 'bar' },
  { label: 'be_by', value: 'be_by' },
  { label: 'be_latn', value: 'be_latn' },
  { label: 'bg_bg', value: 'bg_bg' },
  { label: 'br_fr', value: 'br_fr' },
  { label: 'brb', value: 'brb' },
  { label: 'bs_ba', value: 'bs_ba' },
  { label: 'ca_es', value: 'ca_es' },
  { label: 'cs_cz', value: 'cs_cz' },
  { label: 'cy_gb', value: 'cy_gb' },
  { label: 'da_dk', value: 'da_dk' },
  { label: 'de_at', value: 'de_at' },
  { label: 'de_ch', value: 'de_ch' },
  { label: 'de_de', value: 'de_de' },
  { label: 'el_gr', value: 'el_gr' },
  { label: 'en_au', value: 'en_au' },
  { label: 'en_ca', value: 'en_ca' },
  { label: 'en_gb', value: 'en_gb' },
  { label: 'en_nz', value: 'en_nz' },
  { label: 'en_pt', value: 'en_pt' },
  { label: 'en_ud', value: 'en_ud' },
  { label: 'en_us', value: 'en_us' },
  { label: 'enp', value: 'enp' },
  { label: 'enws', value: 'enws' },
  { label: 'eo_uy', value: 'eo_uy' },
  { label: 'es_ar', value: 'es_ar' },
  { label: 'es_cl', value: 'es_cl' },
  { label: 'es_ec', value: 'es_ec' },
  { label: 'es_es', value: 'es_es' },
  { label: 'es_mx', value: 'es_mx' },
  { label: 'es_uy', value: 'es_uy' },
  { label: 'es_ve', value: 'es_ve' },
  { label: 'esan', value: 'esan' },
  { label: 'et_ee', value: 'et_ee' },
  { label: 'eu_es', value: 'eu_es' },
  { label: 'fa_ir', value: 'fa_ir' },
  { label: 'fi_fi', value: 'fi_fi' },
  { label: 'fil_ph', value: 'fil_ph' },
  { label: 'fo_fo', value: 'fo_fo' },
  { label: 'fr_ca', value: 'fr_ca' },
  { label: 'fr_fr', value: 'fr_fr' },
  { label: 'fra_de', value: 'fra_de' },
  { label: 'fur_it', value: 'fur_it' },
  { label: 'fy_nl', value: 'fy_nl' },
  { label: 'ga_ie', value: 'ga_ie' },
  { label: 'gd_gb', value: 'gd_gb' },
  { label: 'gl_es', value: 'gl_es' },
  { label: 'hal_ua', value: 'hal_ua' },
  { label: 'haw_us', value: 'haw_us' },
  { label: 'he_il', value: 'he_il' },
  { label: 'hi_in', value: 'hi_in' },
  { label: 'hn_no', value: 'hn_no' },
  { label: 'hr_hr', value: 'hr_hr' },
  { label: 'hu_hu', value: 'hu_hu' },
  { label: 'hy_am', value: 'hy_am' },
  { label: 'id_id', value: 'id_id' },
  { label: 'ig_ng', value: 'ig_ng' },
  { label: 'io_en', value: 'io_en' },
  { label: 'is_is', value: 'is_is' },
  { label: 'isv', value: 'isv' },
  { label: 'it_it', value: 'it_it' },
  { label: 'ja_jp', value: 'ja_jp' },
  { label: 'jbo_en', value: 'jbo_en' },
  { label: 'ka_ge', value: 'ka_ge' },
  { label: 'kk_kz', value: 'kk_kz' },
  { label: 'kn_in', value: 'kn_in' },
  { label: 'ko_kr', value: 'ko_kr' },
  { label: 'ksh', value: 'ksh' },
  { label: 'kw_gb', value: 'kw_gb' },
  { label: 'ky_kg', value: 'ky_kg' },
  { label: 'la_la', value: 'la_la' },
  { label: 'lb_lu', value: 'lb_lu' },
  { label: 'li_li', value: 'li_li' },
  { label: 'lmo', value: 'lmo' },
  { label: 'lo_la', value: 'lo_la' },
  { label: 'lol_us', value: 'lol_us' },
  { label: 'lt_lt', value: 'lt_lt' },
  { label: 'lv_lv', value: 'lv_lv' },
  { label: 'lzh', value: 'lzh' },
  { label: 'mk_mk', value: 'mk_mk' },
  { label: 'mn_mn', value: 'mn_mn' },
  { label: 'ms_my', value: 'ms_my' },
  { label: 'mt_mt', value: 'mt_mt' },
  { label: 'nah', value: 'nah' },
  { label: 'nds_de', value: 'nds_de' },
  { label: 'nl_be', value: 'nl_be' },
  { label: 'nl_nl', value: 'nl_nl' },
  { label: 'nn_no', value: 'nn_no' },
  { label: 'no_no', value: 'no_no' },
  { label: 'oc_fr', value: 'oc_fr' },
  { label: 'ovd', value: 'ovd' },
  { label: 'pl_pl', value: 'pl_pl' },
  { label: 'pls', value: 'pls' },
  { label: 'pt_br', value: 'pt_br' },
  { label: 'pt_pt', value: 'pt_pt' },
  { label: 'qcb_es', value: 'qcb_es' },
  { label: 'qid', value: 'qid' },
  { label: 'qya_aa', value: 'qya_aa' },
  { label: 'ro_ro', value: 'ro_ro' },
  { label: 'rpr', value: 'rpr' },
  { label: 'ru_ru', value: 'ru_ru' },
  { label: 'ry_ua', value: 'ry_ua' },
  { label: 'sah_sah', value: 'sah_sah' },
  { label: 'se_no', value: 'se_no' },
  { label: 'sk_sk', value: 'sk_sk' },
  { label: 'sl_si', value: 'sl_si' },
  { label: 'so_so', value: 'so_so' },
  { label: 'sq_al', value: 'sq_al' },
  { label: 'sr_cs', value: 'sr_cs' },
  { label: 'sr_sp', value: 'sr_sp' },
  { label: 'sv_se', value: 'sv_se' },
  { label: 'sxu', value: 'sxu' },
  { label: 'szl', value: 'szl' },
  { label: 'ta_in', value: 'ta_in' },
  { label: 'th_th', value: 'th_th' },
  { label: 'tl_ph', value: 'tl_ph' },
  { label: 'tlh_aa', value: 'tlh_aa' },
  { label: 'tok', value: 'tok' },
  { label: 'tr_tr', value: 'tr_tr' },
  { label: 'tt_ru', value: 'tt_ru' },
  { label: 'tzo_mx', value: 'tzo_mx' },
  { label: 'uk_ua', value: 'uk_ua' },
  { label: 'val_es', value: 'val_es' },
  { label: 'vec_it', value: 'vec_it' },
  { label: 'vi_vn', value: 'vi_vn' },
  { label: 'vp_vl', value: 'vp_vl' },
  { label: 'yi_de', value: 'yi_de' },
  { label: 'yo_ng', value: 'yo_ng' },
  { label: 'zh_cn', value: 'zh_cn' },
  { label: 'zh_hk', value: 'zh_hk' },
  { label: 'zh_tw', value: 'zh_tw' },
  { label: 'zlm_arab', value: 'zlm_arab' }
]
