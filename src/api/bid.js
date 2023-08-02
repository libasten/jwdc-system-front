import request from '@/utils/request'
import qs from 'qs'
//#region 投标管理
// 分页检索获取投标对象
export function fetchBidsPaged(pa) {
  return request({
    url: '/Bids/GetBids2',
    params: pa,
    method: 'get',
  })
}

// 获取投标列表 不分页
export function fetchBids() {
  return request({
    url: '/Bids/GetBids1',
    method: 'get',
  })
}

// 获取单个投标
export function fetchBidDetail(id) {
  return request({
    url: '/Bids/GetBid?id=' + id,
    method: 'get',
  })
}

// 初始化新建投标
export function newBid() {
  return request({
    url: '/Bids/NewBid?',
    method: 'get',
  })
}
// 新增投标
export function createBid(pa) {
  return request({
    url: '/Bids/CreateBid',
    method: 'post',
    // params: pa,
    data: qs.stringify(pa)
  })
}

// 编辑投标
export function editBid(pa) {
  return request({
    url: '/Bids/EditBid',
    method: 'post',
    // params: pa,
    data: qs.stringify(pa)
  })
}
// 删除投标
export function deleteBid(data) {
  return request({
    url: '/Bids/DeleteBid',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 投标附件
// 获取单个投标的附件列表
export function fetchBidArchive(id) {
  return request({
    url: '/Bids/GetBidArchives?BidId=' + id,
    method: 'get',
  })
}
// 新增投标附件文件
export function createBidArchive(pa, data) {
  return request({
    url: '/Bids/CreateBidArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}
// 编辑投标附件文件
export function editBidArchive(pa, data) {
  return request({
    url: '/Bids/EditBidArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}

// 删除投标附件
export function delBidArchive(data) {
  return request({
    url: '/Bids/DeleteBidArchive',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 保证金基本信息
// 获取单个投标保证金信息
export function fetchBidSecurity(id) {
  return request({
    url: '/Bids/GetBidSecurityFromBid?bidId=' + id,
    method: 'get',
  })
}

// 新增保证金
export function createBidSecurity(pa) {
  return request({
    url: '/Bids/CreateBidSecurity',
    method: 'post',
    // params: pa,
    data: qs.stringify(pa)
  })
}

// 编辑保证金
export function editBidSecurity(pa) {
  return request({
    url: '/Bids/EditBidSecurity',
    method: 'post',
    // params: pa,
    data: qs.stringify(pa)
  })
}

// 删除保证金
export function deleteBidSecurity(data) {
  return request({
    url: '/Bids/DeleteBidSecurity',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion

//#region 保证金附件
// 获取保证金附件列表
export function fetchBidSecurityArchive(id) {
  return request({
    url: '/Bids/GetBidSecurityArchives?bidSecurityId=' + id,
    method: 'get',
  })
}
// 新增保证金附件文件
export function createBidSecurityArchive(pa, data) {
  return request({
    url: '/Bids/CreateBidSecurityArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}
// 编辑保证金附件保证金文件
export function editBidSecurityArchive(pa, data) {
  return request({
    url: '/Bids/EditBidSecurityArchive',
    method: 'post',
    params: pa,
    data: data,
  })
}

// 删除投标保证金附件
export function delBidSecurityArchive(data) {
  return request({
    url: '/Bids/DeleteBidSecurityArchive',
    method: 'delete',
    params: { id: data.id }
  })
}
//#endregion