import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', component: () => import('@/views/LayoutIndex.vue'), redirect: '/main', children: [
        { path: '/main', component: () => import('@/views/main/MainPage.vue') },
        { path: '/author', component: () => import('@/views/author/AuthorPage.vue') },
        { path: '/editor', component: () => import('@/views/editor/EditorPage.vue') },
        { path: '/wiki/:name', component: () => import('@/views/wiki/ModWiki.vue') },

        //神秘小工具
        { path: '/chatbox/theme', component: () => import('@/views/other/chatBox/ChatBoxTheme.vue') },
        { path: '/chatbox/dialogues', component: () => import('@/views/other/chatBox/ChatBoxDialogues.vue') },
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 404,
      component: () => import('@/views/error/NotFound.vue')
    }
  ]
})

export default router
