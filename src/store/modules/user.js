import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  // 当前用户的授权信息
  authorize: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_AUTHORIZE: (state, authorize) => {
    state.authorize = authorize
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      // 本系统后台的入参是name和password·
      login({ name: username.trim(), password: password }).then(response => {
        const { data } = response
        // 因为本系统后台没有提供token返回，因此这里暂时用data.info作为token存储在浏览器中。
        commit('SET_TOKEN', data.info)
        setToken(data.info)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录！')
        }
        const { name, sex, authorize } = data
        // 后端的asp.net core没有返回role，这里写死用admin，配合vue-element-admin 框架使用。
        var fixedRoles = ['admin']
        data.roles = fixedRoles
        // roles must be a non-empty array
        if (!fixedRoles || fixedRoles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', fixedRoles)
        commit('SET_NAME', name)
        // 暂时固定头像
        if (sex === '女') {
          commit('SET_AVATAR', 'https://bpic.588ku.com/element_origin_min_pic/19/07/30/ae947be98b0054d58fc500deae20dcbd.jpg')
        }
        else {
          commit('SET_AVATAR', 'https://img.51miz.com/Element/00/38/03/97/917488dc_E380397_8f92a53e.png')
        }
        commit('SET_AUTHORIZE', authorize)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
