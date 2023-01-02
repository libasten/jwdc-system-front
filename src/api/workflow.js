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
export function saveExpense(pa) {
  return request({
    url: '/Workflows/SaveExpenseWorkflow',
    method: 'post',
    params: pa
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
// 初始化报销明细
export function newExpenseCategory() {
  return request({
    url: '/Workflows/NewExpenseCategory',
    method: 'get',
  })
}
// 创建报销明细
export function createExpenseCategory(pa) {
  return request({
    url: '/Workflows/CreateExpenseCategory',
    method: 'post',
    params: pa
  })
}
// 获取报销明细项
export function fetchExpenseCategory(expenseItemId) {
  return request({
    url: '/Workflows/GetExpenseCategory?id=' + expenseItemId,
    method: 'get',
  })
}
// 编辑报销明细
export function editExpenseCategory(pa) {
  return request({
    url: '/Workflows/EditExpenseCategory',
    method: 'post',
    params: pa
  })
}
// 删除报销明细
export function delExpenseCategory(data) {
  return request({
    url: '/Workflows/DeleteExpenseCategory',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 报销行动日志
// 创建行动日志
export function createLog(pa) {
  return request({
    url: '/Workflows/CreateTravelLog',
    method: 'post',
    params: pa
  })
}
// 编辑行动日志
export function editLog(pa) {
  return request({
    url: '/Workflows/EditTravelLog',
    method: 'post',
    params: pa
  })
}
// 删除行动日志
export function delLog(data) {
  return request({
    url: '/Workflows/DeleteTravelLog',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 报销工作流操作
// 同意报销
export function approveExpense(pa) {
  return request({
    url: '/Workflows/ApproveExpenseWorkflow',
    method: 'post',
    params: pa
  })
}
// 拒绝报销流程
export function rejectExpense(pa) {
  return request({
    url: '/Workflows/RejectExpenseWorkflow',
    method: 'post',
    params: pa
  })
}
//#endregion