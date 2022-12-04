import request from '@/utils/request'
//#region 员工管理
// 获取目员工
export function fetchStaff() {
  return request({
    url: '/Staffs/GetStaffs',
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
// 员工离职
export function delStaff(data) {
  return request({
    url: '/Staffs/DeleteStaff',
    method: 'delete',
    params: { id: data.id }
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

//#region 项目附件类型
// 项目附件类型列表
export function fetchProjectArchiveType() {
  return request({
    url: '/Projects/GetProjectArchiveTypes',
    method: 'get',
  })
}
// 新增项目附件类型
export function createProjectArchiveType(pa) {
  return request({
    url: '/Projects/CreateProjectArchiveType',
    method: 'post',
    params: pa,
  })
}
// 编辑项目附件类型
export function editProjectArchiveType(pa) {
  return request({
    url: '/Projects/EditProjectArchiveType',
    method: 'post',
    params: pa,
  })
}
// 删除项目附件类型
export function delProjectArchiveType(data) {
  return request({
    url: '/Projects/DeleteProjectArchiveType',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目备注类型
// 项目附件备注列表
export function fetchProjectNoteType() {
  return request({
    url: '/Projects/GetProjectNoteTypes',
    method: 'get',
  })
}
// 新增项目附件类型
export function createProjectNoteType(pa) {
  return request({
    url: '/Projects/CreateProjectNoteType',
    method: 'post',
    params: pa,
  })
}
// 编辑项目附件类型
export function editProjectNoteType(pa) {
  return request({
    url: '/Projects/EditProjectNoteType',
    method: 'post',
    params: pa,
  })
}
// 删除项目附件类型
export function delProjectNoteType(data) {
  return request({
    url: '/Projects/DeleteProjectNoteType',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion