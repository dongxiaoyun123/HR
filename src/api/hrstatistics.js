import request from '@/utils/request'

export function GetInsvCount(ParentCode, EnterPriseCode) {
  return request({
    url: '/HrStatistics/GetInsvCount',
    method: 'post',
    params: { ParentCode, EnterPriseCode }
  })
}

export function GetInsStateListOfCon(parameter) {
  return request({
    url: '/HrStatistics/GetInsStateListOfCon',
    method: 'post',
    data: parameter
  })
}

export function LoadInsurePsns(parameter) {
  return request({
    url: '/HrStatistics/LoadInsurePsns',
    method: 'post',
    data: parameter
  })
}

export function GetDataFinancial(parameter) {
  return request({
    url: '/HrStatistics/GetDataFinancial',
    method: 'post',
    data: parameter
  })
}

export function GetDataBriefs(parameter) {
  return request({
    url: '/HrStatistics/GetDataBriefs',
    method: 'post',
    data: parameter
  })
}

export function GetDetails(parameter) {
  return request({
    url: '/HrStatistics/GetDetails',
    method: 'post',
    data: parameter
  })
}

export function GetDetailsRev(parameter) {
  return request({
    url: '/HrStatistics/GetDetailsRev',
    method: 'post',
    data: parameter
  })
}

export function ComprehensiveStatisticsData(parameter) {
  return request({
    url: '/HrStatistics/ComprehensiveStatisticsData',
    method: 'post',
    data: parameter
  })
}

export function GenderAgeStatisticsData(parameter) {
  return request({
    url: '/HrStatistics/GenderAgeStatisticsData',
    method: 'post',
    data: parameter
  })
}

export function GetCropTypeH(parameter) {
  return request({
    url: '/HrStatistics/GetCropTypeH',
    method: 'post',
    data: parameter
  })
}

export function GetillnesslistNew(parameter) {
  return request({
    url: '/HrStatistics/GetillnesslistNew',
    method: 'post',
    data: parameter
  })
}











