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

// 进行所有人员费用归集统计
export function queryStaffCost(pa) {
  return request({
    url: '/Workflows/GetAllStaffExpenses',
    method: 'post',
    params: pa
  })
}

// 进行项目下挂人员经费归集统计
export function queryProjectCost(pa) {
  return request({
    url: '/Workflows/GetExpensesGroupProject',
    method: 'post',
    params: pa
  })
}

// 进行所有人员下挂项目经费归集统计
export function queryStaffProjectCost(pa) {
  return request({
    url: '/Workflows/GetExpensesGroupStaff',
    method: 'post',
    params: pa
  })
}


// 进行项目结款信息归集统计
export function queryProjectCollection(pa) {
  return request({
    url: '/Workflows/GetProjectCollections',
    method: 'post',
    params: pa
  })
}


//#endregion