import request from '@/utils/request'
//#region 合同管理
// 获取合同列表
export function fetchContracts() {
  return request({
    url: '/Contracts/GetContracts',
    method: 'get',
  })
}

// 获取单个合同
export function getContract(id) {
  return request({
    url: '/Contracts/GetContract?id=' + id,
    method: 'get',
  })
}

// 新增合同
export function createContract(pa) {
  return request({
    url: '/Contracts/CreateContract',
    method: 'post',
    params: pa,
  })
}

// 编辑合同
export function editContract(pa) {
  return request({
    url: '/Contracts/EditContract',
    method: 'post',
    params: pa,
  })
}
// 删除合同
export function deleteContract(data) {
  return request({
    url: '/Contracts/DeleteContract',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion