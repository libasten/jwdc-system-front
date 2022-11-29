import request from '@/utils/request'

// 项目阶段列表
export function fetchProjectStage() {
  return request({
    url: '/Projects/GetProjectStages',
    method: 'get',
  })
}
// 新增项目阶段
export function createProjectStage(data) {
  return request({
    url: '/Projects/CreateProjectStage',
    method: 'post',
    data: {
      name: data.newName,
      description: data.newDescription,
      order: data.newOrder,
    },
  })
}
// 编辑项目阶段
export function editProjectStage(data) {
  return request({
    url: '/Projects/EditProjectStage',
    method: 'post',
    data: {
      id: '',
      name: data.newName,
      description: data.newDescription,
      order: data.newOrder,
    },
  })
}
// 删除项目阶段
export function delProjectStage(data) {
  return request({
    url: '/Projects/DeleteProjectStage',
    method: 'get',
    params: { id: data }
  })
}



export function fetchList(query) {
  return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })
}

export function createArticle(data) {
  return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })
}
