import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index.js'
import pinia from './stores/index.js'
import { i18nScope } from '@/languages/index.js'
import { i18nPlugin } from '@voerkai18n/vue'

i18nScope.ready(() => {
  createApp(App)
    .use(i18nPlugin, {
      i18nScope
    })
    .use(pinia)
    .use(router)
    .mount('#app')
})
