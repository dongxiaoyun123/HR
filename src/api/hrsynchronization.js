import request from '@/utils/request'

export function HrSynchronizeDataJudge(EnterpriseCode) {
  return request({
    url: '/Hrsynchronization/HrSynchronizeDataJudge',
    method: 'post',
    params: { EnterpriseCode }
  })
}
export function HrSynchronizeData(EnterpriseCode) {
  return request({
    url: '/Hrsynchronization/HrSynchronizeData',
    method: 'post',
    params: { EnterpriseCode }
  })
}

