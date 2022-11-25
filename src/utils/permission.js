import store from '@/store'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value

    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })
    return hasPermission
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

// 根据权限编码检查是不是含有权限
export function checkAuth(data) {
  if (data && data.length > 0) {
    const auArray = data.split('-')
    const authorize = store.getters && store.getters.authorize
    const aItem = authorize.find(x => x.id === auArray[0]).authorize.find(y => y.id === auArray[1])
    if (aItem === undefined) {
      console.error("authorize ===> " + data + " <=== not exist !")
      return false
    }
    if (aItem.value === '1') {
      return true;
    }
    else {
      return false;
    }
  } else {
    console.error("need authorize ===>" + data)
    return false
  }
}
