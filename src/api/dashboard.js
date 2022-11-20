import request from '@/utils/request'

export function getProjectStatistics() {
  return request({
    url: 'Projects/GetProjectStatistics',
    method: 'get',
  })
}