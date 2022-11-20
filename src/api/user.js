import request from '@/utils/request'

export function login(pa) {
  return request({
    url: 'Accounts/Login',
    method: 'post',
    params: pa
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/vue-element-admin/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

// 重写经纬地诚系统后台获取用户信息的方法-无需token
export function getInfo() {
  return request({
    url: 'UserInfos/Get',
    method: 'get',
  })
}


export function getSta() {
  return request({
    url: 'Projects/GetProjectStatistics',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: 'Accounts/LogOut',
    method: 'post'
  })
}
