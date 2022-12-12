import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import chartsRouter from './modules/charts'
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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// 动态菜单参考
// https://blog.csdn.net/weixin_42349568/article/details/113385910
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页概览', icon: 'dashboard', affix: true }
      }
    ]
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/project',
    component: Layout,
    meta: { title: '项目管理', icon: 'el-icon-suitcase' },
    children: [
      {
        path: 'list',
        component: () => import('@/views/project/project-list'),
        // 若要页面不被刷新，这个name必须和vue页面的export名称一致。
        name: 'ProjectList',
        noCache: true,
        meta: { title: '项目管理', icon: 'el-icon-suitcase-1' },
      },
      {
        path: 'detail',
        component: () => import('@/views/project/project-detail'),
        name: 'Detail',
        hidden: true,
        meta: { title: '项目详情', }
      },
    ]
  },
  {
    path: '/projectProperty',
    component: Layout,
    meta: { title: '项目属性', icon: 'el-icon-receiving', auth: '8-1' },
    children: [
      {
        path: 'type',
        component: () => import('@/views/project/project-type'),
        name: 'Type',
        meta: { title: '项目类型', icon: 'documentation', auth: '8-1' }
      },
      {
        path: 'stage',
        component: () => import('@/views/project/project-stage'),
        name: 'stage',
        meta: { title: '项目阶段', icon: 'documentation', auth: '9-1' }
      },
      {
        path: 'importance',
        component: () => import('@/views/project/project-importance'),
        name: 'Importance',
        meta: { title: '难易程度', icon: 'documentation', auth: '10-1' }
      },
      {
        path: 'archiveType',
        component: () => import('@/views/project/project-archiveType'),
        name: 'ArchiveType',
        meta: { title: '附件类型', icon: 'documentation', auth: '12-1' }
      },
      {
        path: 'noteType',
        component: () => import('@/views/project/project-noteType'),
        name: 'NoteType',
        meta: { title: '备注类型', icon: 'documentation', auth: '13-1' }
      },
    ]
  },
  {
    path: '/organization',
    component: Layout,
    meta: { title: '组织管理', icon: 'el-icon-office-building', auth: '8-1' },
    children: [
      {
        path: 'staff',
        component: () => import('@/views/organization/staff'),
        name: 'Staff',
        meta: { title: '员工管理', icon: 'documentation' }
      },
      {
        path: 'role',
        component: () => import('@/views/organization/role'),
        name: 'Role',
        meta: { title: '角色管理', icon: 'documentation', auth: '22-1' }
      },
      {
        path: 'staffType',
        component: () => import('@/views/organization/staffType'),
        name: 'Separtment',
        meta: { title: '员工类型', icon: 'documentation', auth: '5-1' }
      },
      {
        path: 'department',
        component: () => import('@/views/organization/department'),
        name: 'Department',
        meta: { title: '部门管理', icon: 'documentation', auth: '3-1' }
      },
      {
        path: 'staffLeave',
        component: () => import('@/views/organization/staff-leave'),
        name: 'StaffLeave',
        meta: { title: '离职员工', icon: 'documentation', auth: '24-1' }
      },
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  /** when your routing map is too long, you can split it into small modules **/
  // chartsRouter,

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
