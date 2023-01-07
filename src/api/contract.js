import request from '@/utils/request'
//#region 合同管理
// 获取合同列表
export function fetchContracts() {
  return request({
    url: '/Contracts/GetContracts1',
    method: 'get',
  })
}

// 获取单个合同
export function fetchContractDetail(id) {
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

//#region 合同附件
// 获取单个合同的附件列表
export function fetchContractArchive(id) {
  return request({
    url: '/Contracts/GetContractArchives?contractId=' + id,
    method: 'get',
  })
}
// 新增合同附件文件
export function createContractArchive(pa, data) {
  return request({
    url: '/Contracts/CreateContractArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}
// 编辑合同附件文件
export function editContractArchive(pa, data) {
  return request({
    url: '/Contracts/EditContractArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}

// 删除合同附件
export function delContractArchive(data) {
  return request({
    url: '/Contracts/DeleteContractArchive',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion