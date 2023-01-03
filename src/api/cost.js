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

export function queryStaffSingleCost(pa) {
  return request({
    url: '/Workflows/GetExpensesByStaff',
    method: 'post',
    params: pa
  })
}

//#endregion