import request from '@/utils/request'
//#region 财务费用统计信息
// 获取费用归集查询人员始化信息
export function fetchQueryStaffParams() {
  return request({
    url: '/Workflows/GetStaffExpenseStatisticInits',
    method: 'get',
  })
}
// 获取费用归集查询项目初始化信息
export function fetchQueryProjectParams() {
  return request({
    url: '/Workflows/GetProjectExpenseStatisticInits',
    method: 'get',
  })
}
// 获取单个人员费用统计
export function queryStaffSingleCost(pa) {
  return request({
    url: '/Workflows/GetExpensesByStaff',
    method: 'post',
    params: pa
  })
}
// 进行项目经费归集统计
export function queryProjectsCost(pa) {
  return request({
    url: '/Workflows/GetExpensesGroupProject',
    method: 'post',
    params: pa
  })
}

// 进行人员费用归集统计
export function queryStaffCost(pa) {
  return request({
    url: '/Workflows/GetAllStaffExpenses',
    method: 'post',
    params: pa
  })
}
//#endregion