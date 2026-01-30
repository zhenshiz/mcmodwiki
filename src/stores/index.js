import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default pinia

export * from './modules/page.js'
export * from './modules/editTopic.js'
export * from './modules/chatboxEditor.js'
