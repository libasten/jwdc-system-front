import request from '@/utils/request'

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