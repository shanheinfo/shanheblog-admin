import { createRouter, createWebHistory } from 'vue-router'
import { setupRouteGuard } from './guard'
import DefaultLayout from '@/layouts/default.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'posts',
          name: 'PostList',
          component: () => import('@/views/post/PostList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'posts/create',
          name: 'PostCreate',
          component: () => import('@/views/post/PostEdit.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'posts/edit/:id',
          name: 'PostEdit',
          component: () => import('@/views/post/PostEdit.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'categories',
          name: 'CategoryList',
          component: () => import('@/views/category/CategoryList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'tags',
          name: 'TagList',
          component: () => import('@/views/tag/TagList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'comments',
          name: 'CommentList',
          component: () => import('@/views/comment/CommentList.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: 'users',
          name: 'UserList',
          component: () => import('@/views/user/UserList.vue'),
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
})

setupRouteGuard(router)

export default router