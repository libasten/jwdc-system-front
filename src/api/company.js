import request from '@/utils/request'
//#region 公司信息
// 获取公司信息
export function fetchCompany() {
  return request({
    url: '/Companies/GetCompany',
    method: 'get',
  })
}

// 编辑公司信息
export function editCompany(pa) {
  return request({
    url: '/Companies/EditCompany',
    method: 'post',
    params: pa,
  })
}

// 获取公司附件
export function fetchCompanyArchive() {
  return request({
    url: '/Companies/GetCompanyArchives',
    method: 'get',
  })
}
// 新增公司附件文件
export function createCompanyArchive(pa, data) {
  return request({
    url: '/Companies/CreateCompanyArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}
// 编辑公司附件文件
export function editCompanyArchive(pa, data) {
  return request({
    url: '/Companies/EditCompanyArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}

// 删除公司附件文件
export function delCompanyArchive(data) {
  return request({
    url: '/Companies/DeleteCompanyArchive',
    method: 'post',
    params: { id: data.id }
  })
}
//#endregion