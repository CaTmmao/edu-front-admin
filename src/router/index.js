import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '@/layout'

Vue.use(Router)

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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

     // 分类管理
     {
        path: '/category',
        component: Layout,
        redirect: '/category/list',
        name: '分类管理',
        meta: {title: '分类管理', icon: 'el-icon-s-help'},
        children: [
            {
                path: 'list',
                name: '分类列表',
                component: () => import('@/views/category/list'),
                meta: {title: '分类列表', icon: 'table'}
            }
        ]
    },

    // 讲师管理
    {
        path: '/teacher',
        component: Layout,
        redirect: '/teacher/list',
        name: '讲师管理',
        meta: {title: '讲师管理', icon: 'el-icon-s-help'},
        children: [
            {
                path: 'list',
                name: '讲师列表',
                component: () => import('@/views/teacher/list'),
                meta: {title: '讲师列表', icon: 'table'}
            },
            {
                path: 'add',
                name: '添加讲师',
                component: () => import('@/views/teacher/add'),
                meta: {title: '添加讲师', icon: 'table'}
            },
            {
                path: 'edit/:id',
                name: '编辑讲师',
                component: () => import('@/views/teacher/add'),
                meta: {title: '编辑讲师', icon: 'table'},
                // 是否在侧边栏隐藏
                hidden: true
            }
        ]
    },

    // 课程管理
    {
        path: '/course',
        component: Layout,
        redirect: '/course/list',
        name: '课程管理',
        meta: {title: '课程管理', icon: 'el-icon-s-help'},
        children: [
            {
                path: 'list',
                name: '课程列表',
                component: () => import('@/views/course/list'),
                meta: {title: '课程列表', icon: 'table'}
            },
            {
                path: 'add',
                name: '添加课程',
                component: () => import('@/views/course/add'),
                meta: {title: '添加课程', icon: 'table'}
            },
            {
                path: 'editBaseInfo/:id',
                name: '编辑课程基本信息',
                component: () => import('@/views/course/editBaseInfo'),
                meta: {title: '编辑课程基本信息'},
                hidden: true
            },
            {
                path: 'editChapterInfo/:id',
                name: '编辑课程章节信息',
                component: () => import('@/views/course/editChapterInfo'),
                meta: {title: '编辑课程章节信息'},
                hidden: true
            }
        ]
    },

    // 404 page must be placed at the end !!!
    {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
