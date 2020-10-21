/*
 * @Author: Tan Xuan
 * @Date: 2020-03-16 10:00:27
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-10-21 18:34:37
 * @Description: File content
 */
import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

// CODE MAX  1700

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // mode: 'history',
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    component: Layout,
    redirect: '/welcome/index',
    children: [{
      path: 'index',
      name: 'Welcome',
      component: () => import('@/views/welcome')
    }]
  },
  {
    path: '/labels',
    component: Layout,
    meta: {
      title: '标签管理',
      code: 100
    },
    children: [{
      path: 'index',
      name: 'Labels',
      component: () => import('@/views/labels/index'),
      meta: {
        title: '标签管理',
        icon: 'nav_label_',
        code: 101,
      }
    }]
  },
  {
    path: '/manager',
    component: Layout,
    meta: {
      title: '管理员管理',
      code: 200
    },
    children: [{
      path: 'index',
      name: 'Manager',
      component: () => import('@/views/manager/index'),
      meta: {
        title: '管理员管理',
        icon: 'nav_assistant_',
        code: 201
      }
    }]
  },
  {
    path: '/role',
    component: Layout,
    meta: {
      title: '角色管理',
      code: 300
    },
    children: [{
      path: 'index',
      name: 'Role',
      component: () => import('@/views/role/index'),
      meta: {
        title: '角色管理',
        icon: 'nav_assistant_',
        code: 301,
      }
    }]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = routes =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
    // mode: "history"
  })

const router = createRouter()

router.beforeEach((to, from, next) => {
  if (to.name !== from.name) {
    store.commit('app/SET_PAGES', to.name)
  }
  // console.log(store.state.app.keepAlivePages)
  next()
})

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export const minLength = 5

export default router
