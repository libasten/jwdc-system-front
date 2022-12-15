import request from '@/utils/request'
//#region 项目管理
// 获取项目列表（不分页，备用）
export function fetchProjectList() {
  return request({
    url: '/Projects/GetProjects',
    method: 'get',
  })
}
// 获取项目列表（后台分页）
export function fetchProjectListPaged(pa) {
  return request({
    url: '/Projects/GetProjects1',
    method: 'get',
    params: pa
  })
}
// 获取单个项目详情
export function fetchProjectBase(id) {
  return request({
    url: '/Projects/GetProject?id=' + id,
    method: 'get',
  })
}
// 获取单个项目详情
export function fetchProjectDetail(id) {
  return request({
    url: '/Projects/GetProjectDetail?id=' + id,
    method: 'get',
  })
}

//#endregion

//#region 项目阶段
// 项目阶段列表
export function fetchProjectStage() {
  return request({
    url: '/Projects/GetProjectStages',
    method: 'get',
  })
}
// 新增项目阶段
export function createProjectStage(pa) {
  return request({
    url: '/Projects/CreateProjectStage',
    method: 'post',
    params: pa,
  })
}
// 编辑项目阶段
export function editProjectStage(pa) {
  return request({
    url: '/Projects/EditProjectStage',
    method: 'post',
    params: pa,
  })
}
// 删除项目阶段
export function delProjectStage(data) {
  return request({
    url: '/Projects/DeleteProjectStage',
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