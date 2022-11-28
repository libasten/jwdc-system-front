import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param authorize
 * @param route
 */
function hasPermission(authorize, route) {
  if (route.meta && route.meta.auth) {
    // 通过路由菜单中的meta.auth配置在权限数组中比对，决定这个路由菜单是否可以显示在侧边栏
    const auArray = route.meta.auth.split('-')
    if (auArray[0] == '115') {
      console.log(route)
      console.log(authorize)
    }
    const aItem = authorize.find(x => x.id === auArray[0])
    if (aItem !== undefined) {
      const authInfo = aItem.authorize.find(y => y.id === auArray[1])
      if (authInfo.value === '1') {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      console.error("Can not find ===> " + route.meta.auth + " <=== in authorize !")
      return true;
    }
  }
  // 路由表中没有配置auth属性的，都给显示
  else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param authorize
 */
export function filterAsyncRoutes(routes, authorize) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(authorize, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, authorize)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, authorize) {
    return new Promise(resolve => {
      let accessedRoutes
      if (authorize.length > 0) {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, authorize)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
