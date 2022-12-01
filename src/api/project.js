import request from '@/utils/request'
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