import request from '@/utils/request'
//#region 工作流列表
// 获取待办列表
export function fetchTodoList() {
  return request({
    url: '/Workflows/GetWorkflowings',
    method: 'get',
  })
}
// 获取经办列表
export function fetchDoingList() {
  return request({
    url: '/Workflows/GetHandlingWorkflows',
    method: 'get',
  })
}
// 获取完结流程列表
export function fetchDoneList() {
  return request({
    url: '/Workflows/GetCompletedWorkflows',
    method: 'get',
  })
}
//#endregion

//#region 报销流程单
// 初始化报销单
export function newExpense() {
  return request({
    url: '/Workflows/NewExpenseWorkflow',
    method: 'get',
  })
}
// 保存报销单据
export function saveExpense(data) {
  return request({
    url: '/Workflows/SaveExpenseWorkflow',
    method: 'post',
    data: data
  })
}
// 获取报销单详情
export function fetchExpenseDetail(flowId) {
  return request({
    url: '/Workflows/GetExpenseWorkflowDetail?id=' + flowId,
    method: 'get',
  })
}
// 获取报销单的行动日志列表
export function fetchLogList(flowId) {
  return request({
    url: '/Workflows/GetTravelLogs?expenseWorkflowId=' + flowId,
    method: 'get',
  })
}
//#endregion