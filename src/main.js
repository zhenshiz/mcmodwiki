import { createApp } from 'vue'

import App from './App.vue'
import router from './router/index.js'
import pinia from './stores/index.js'

const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
