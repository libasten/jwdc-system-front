import request from '@/utils/request'

export function getProjectStatistics() {
  return request({
    url: 'Projects/GetProjectStatistics',
    method: 'get',
  })
}

// 获取未过期的提醒
export function getRemindList() {
  return request({
    url: 'Projects/GetReminds',
    method: 'get',
  })
}

// 设置里程碑完成
export function setMilestoneCompletion(pa) {
  return request({
    url: '/Projects/SetProjectMilestoneCompletion',
    method: 'post',
    params: pa,
  })
}

// 获取全部历史提醒
export function fetchHistoryRreminds() {
  return request({
    url: '/Projects/GetProjectMilestoneReminds',
    method: 'get',
  })
}