import request from '@/utils/request'
//#region 工作流列表
// 获取待办列表
export function fetchTodoList() {
  return request({
    url: '/Workflows/GetWorkflowings',
    method: 'get',
  })
}
// 获取经办
export function fetchDoingList() {
  return request({
    url: '/Workflows/GetHandlingWorkflows',
    method: 'get',
  })
}
// 获取完结流程
export function fetchDoneList() {
  return request({
    url: '/Workflows/GetCompletedWorkflows',
    method: 'get',
  })
}
//#endregion