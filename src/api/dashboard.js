import request from '@/utils/request'

export function getProjectStatistics() {
  return request({
    url: 'Projects/GetProjectStatistics',
    method: 'get',
  })
}

export function getRemindList() {
  return request({
    url: 'Projects/GetReminds',
    method: 'get',
  })
}
