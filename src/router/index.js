import { createRouter, createWebHistory } from 'vue-router'

// 定义路由配置
const routes = [
  {
    path: '/', component: () => import('@/views/LayoutIndex.vue'), children: [
      { path: '/', component: () => import('@/views/main/MainPage.vue') },
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

// 只在开发环境下添加测试路由
if (import.meta.env.DEV) {
  routes[0].children.push({
    path: '/test',
    name: 'test',
    component: () => import('@/views/Test.vue')
  })
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
