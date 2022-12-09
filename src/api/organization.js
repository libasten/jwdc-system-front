import request from '@/utils/request'
//#region 员工管理
// 获取员工列表
export function fetchStaffs() {
  return request({
    url: '/Staffs/GetStaffs',
    method: 'get',
  })
}

// 获取单个员工
export function getStaff(id) {
  return request({
    url: '/Staffs/GetStaff?id=' + id,
    method: 'get',
  })
}

// 新增员工
export function createStaff(pa) {
  return request({
    url: '/Staffs/CreateStaff',
    method: 'post',
    params: pa,
  })
}
// 编辑员工
export function editStaff(pa) {
  return request({
    url: '/Staffs/EditStaff',
    method: 'post',
    params: pa,
  })
}

// 获取新建员工时候的参数信息
export function getStaffEnum() {
  return request({
    url: '/Staffs/NewStaff',
    method: 'get',
  })
}

// 离职员工
export function resignStaff(data) {
  return request({
    url: '/Staffs/EditStaffStatus',
    method: 'post',
    params: { id: data.id, status: 0 }
  })
}

//#endregion

//#region 员工类型
// 员工类型列表
export function fetchStaffType() {
  return request({
    url: '/Staffs/GetStaffTypes',
    method: 'get',
  })
}
// 新增员工类型
export function createStaffType(pa) {
  return request({
    url: '/Staffs/CreateStaffType',
    method: 'post',
    params: pa,
  })
}
// 编辑员工类型
export function editStaffType(pa) {
  return request({
    url: '/Staffs/EditStaffType',
    method: 'post',
    params: pa,
  })
}
// 删除员工类型
export function delStaffType(data) {
  return request({
    url: '/Staffs/DeleteStaffType',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 部门管理
// 部门列表
export function fetchDepartment() {
  return request({
    url: '/Departments/GetDepartments',
    method: 'get',
  })
}
// 新增部门
export function createDepartment(pa) {
  return request({
    url: '/Departments/CreateDepartment',
    method: 'post',
    params: pa,
  })
}
// 编辑部门
export function editDepartment(pa) {
  return request({
    url: '/Departments/EditDepartment',
    method: 'post',
    params: pa,
  })
}
// 删除部门
export function delDepartment(data) {
  return request({
    url: '/Departments/DeleteDepartment',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 离职员工管理
// 获取离职员工列表
export function fetchLeaveStaffs() {
  return request({
    url: '/Staffs/GetLeaveStaffs',
    method: 'get',
  })
}
// 恢复员工
export function resumeStaff(data) {
  return request({
    url: '/Staffs/EditStaffStatus',
    method: 'post',
    params: { id: data.id, status: 1 }
  })
}

// 删除员工
export function delStaff(data) {
  return request({
    url: '/Staffs/DeleteStaff',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目备注类型
// 获取角色列表
export function fetchRoles() {
  return request({
    url: '/Roles/GetRoles',
    method: 'get',
  })
}
// 新增角色
export function createRole(pa) {
  return request({
    url: '/Roles/CreateRole',
    method: 'post',
    params: pa,
  })
}
// 编辑项目附件类型
export function editRole(pa) {
  return request({
    url: '/Roles/EditRole',
    method: 'post',
    params: pa,
  })
}
// 删除项目附件类型
export function delRole(data) {
  return request({
    url: '/Roles/DeleteRole',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion