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

//#region 项目类型
// 项目类型列表
export function fetchProjectType() {
  return request({
    url: '/Projects/GetProjectTypes',
    method: 'get',
  })
}
// 新增项目类型
export function createProjectType(pa) {
  return request({
    url: '/Projects/CreateProjectType',
    method: 'post',
    params: pa,
  })
}
// 编辑项目类型
export function editProjectType(pa) {
  return request({
    url: '/Projects/EditProjectType',
    method: 'post',
    params: pa,
  })
}
// 删除项目类型
export function delProjectType(data) {
  return request({
    url: '/Projects/DeleteProjectType',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 项目难易程度
// 项目难易程度列表
export function fetchProjectImportance() {
  return request({
    url: '/Projects/GetProjectImportances',
    method: 'get',
  })
}
// 新增项目难易程度
export function createProjectImportance(pa) {
  return request({
    url: '/Projects/CreateProjectImportance',
    method: 'post',
    params: pa,
  })
}
// 编辑项目难易程度
export function editProjectImportance(pa) {
  return request({
    url: '/Projects/EditProjectImportance',
    method: 'post',
    params: pa,
  })
}
// 删除项目难易程度
export function delProjectImportance(data) {
  return request({
    url: '/Projects/DeleteProjectImportance',
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