import request from '@/utils/request'

export function GetEnterpriseList() {
  return request({
    url: '/HrMain/GetEnterpriseList',
    method: 'post',
  })
}

export function GetChildUser(EnterPriseCode) {
  return request({
    url: '/HrMain/GetChildUser',
    method: 'post',
    params: { EnterPriseCode }
  })
}
export function GetProgramInfoAll(EnterPriseCode) {
  return request({
    url: '/HrMain/GetProgramInfoAll',
    method: 'post',
    params: { EnterPriseCode }
  })
}

export function GetDepartmentList(parameter) {
  return request({
    url: '/HrMain/GetDepartmentList',
    method: 'post',
    data: parameter
  })
}

export function GetStaffList(parameter) {
  return request({
    url: '/HrMain/GetStaffList',
    method: 'post',
    data: parameter
  })
}

export function GetDataConfigData() {
  return request({
    url: '/HrMain/GetDataConfigData',
    method: 'post'
  })
}
export function GetProgramList(parameter) {
  return request({
    url: '/HrMain/GetProgramList',
    method: 'post',
    data: parameter
  })
}
export function GetAddDepartmentList(EnterpriseCode) {
  return request({
    url: '/HrMain/GetAddDepartmentList',
    method: 'post',
    params: { EnterpriseCode }
  })
}

export function GetRangeDate(Flag) {
  return request({
    url: '/HrMain/GetRangeDate',
    method: 'post',
    params: { Flag }
  })
}

export function AddStaffinfo(parameter) {
  return request({
    url: '/HrMain/AddStaffinfo',
    method: 'post',
    data: parameter
  })
}

export function IdentityCardValidated(IdentificationNumber) {
  return request({
    url: '/HrMain/IdentityCardValidated',
    method: 'post',
    params: { IdentificationNumber }
  })
}

export function UpdateStaffinfo(parameter) {
  return request({
    url: '/HrMain/UpdateStaffinfo',
    method: 'post',
    data: parameter
  })
}

export function DeleteData(parameter) {
  return request({
    url: '/HrMain/DeleteData',
    method: 'post',
    data: parameter
  })
}

export function ExportStaffList(param) {
  return request({
    url: '/HrMain/ExportStaffList',
    method: 'post',
    data: param
  })
}

export function ExportStaffListAll(ParentEnterpriseCode, ifNoInsurance) {
  return request({
    url: '/HrMain/ExportStaffListAll',
    method: 'post',
    params: { ParentEnterpriseCode, ifNoInsurance }
  })
}

export function DeleteStaff(StaffCode, ProgramCode, EnterPriseCode) {
  return request({
    url: '/HrMain/DeleteStaff',
    method: 'post',
    params: { StaffCode, ProgramCode, EnterPriseCode }
  })
}

export function GetOverviewData(EnterpriseCode,) {
  return request({
    url: '/HrMain/GetOverviewData',
    method: 'post',
    params: { EnterpriseCode }
  })
}

export function GetOverviewDataDetail(param) {
  return request({
    url: '/HrMain/GetOverviewDataDetail',
    method: 'post',
    data: param
  })
}
export function GetOverviewDataDetailByOrder(param) {
  return request({
    url: '/HrMain/GetOverviewDataDetailByOrder',
    method: 'post',
    data: param
  })
}
export function GetOverviewMoneyByOrder(param) {
  return request({
    url: '/HrMain/GetOverviewMoneyByOrder',
    method: 'post',
    data: param
  })
}

export function OrderExportAll(param) {
  return request({
    url: '/HrMain/OrderExportAll',
    method: 'post',
    data: param
  })
}

export function GetManageSettings(EnterpriseCode) {
  return request({
    url: '/HrMain/GetManageSettings',
    method: 'post',
    params: { EnterpriseCode }
  })
}

export function AddOrUpdateManageSettings(param) {
  return request({
    url: '/HrMain/AddOrUpdateManageSettings',
    method: 'post',
    data: param
  })
}

export function GetOperationLog(param) {
  return request({
    url: '/HrMain/GetOperationLog',
    method: 'post',
    data: param
  })
}

export function ReportOperationLog(param) {
  return request({
    url: '/HrMain/ReportOperationLog',
    method: 'post',
    data: param
  })
}

export function GetLoginLog(param) {
  return request({
    url: '/HrMain/GetLoginLog',
    method: 'post',
    data: param
  })
}

export function GetLoginStatisticsChart(param) {
  return request({
    url: '/HrMain/GetLoginStatisticsChart',
    method: 'post',
    data: param
  })
}

export function GetLoginStatisticsLog(param) {
  return request({
    url: '/HrMain/GetLoginStatisticsLog',
    method: 'post',
    data: param
  })
}

export function GetChartData(param) {
  return request({
    url: '/HrMain/GetChartData',
    method: 'post',
    data: param
  })
}

export function GetContractorList(param) {
  return request({
    url: '/HrMain/GetContractorList',
    method: 'post',
    data: param
  })
}

export function GetChannelInformation() {
  return request({
    url: '/HrMain/GetChannelInformation',
    method: 'post'
  })
}

export function AddEnterpriseinfo(param) {
  return request({
    url: '/HrMain/AddEnterpriseinfo',
    method: 'post',
    data: param
  })
}
export function UpdateEnterpriseInfo(param) {
  return request({
    url: '/HrMain/UpdateEnterpriseInfo',
    method: 'post',
    data: param
  })
}

export function AddEnterpriseChildinfo(param) {
  return request({
    url: '/HrMain/AddEnterpriseChildinfo',
    method: 'post',
    data: param
  })
}

export function GetEnterpriseDetail(EnterPriseCode) {
  return request({
    url: '/HrMain/GetEnterpriseDetail',
    method: 'post',
    params: { EnterPriseCode }
  })
}

export function GetUserList(param) {
  return request({
    url: '/HrMain/GetUserList',
    method: 'post',
    data: param
  })
}

export function AddContract(param) {
  return request({
    url: '/HrMain/AddContract',
    method: 'post',
    data: param
  })
}

export function AddPayer(param) {
  return request({
    url: '/HrMain/AddPayer',
    method: 'post',
    data: param
  })
}

export function GetChildEnterprise(EnterpriseCode) {
  return request({
    url: '/HrMain/GetChildEnterprise',
    method: 'post',
    params: { EnterpriseCode }
  })
}

export function GetCustomerInoperable(UserId) {
  return request({
    url: '/HrMain/GetCustomerInoperable',
    method: 'post',
    params: { UserId }
  })
}

export function UpdateUserInfo(param) {
  return request({
    url: '/HrMain/UpdateUserInfo',
    method: 'post',
    data: param
  })
}

export function DeleteUserInfo(UserID) {
  return request({
    url: '/HrMain/DeleteUserInfo',
    method: 'post',
    params: { UserID }
  })
}

export function GetSettingProgramList(param) {
  return request({
    url: '/HrMain/GetSettingProgramList',
    method: 'post',
    data: param
  })
}

export function AddPrograminfo(param) {
  return request({
    url: '/HrMain/AddPrograminfo',
    method: 'post',
    data: param
  })
}

export function UpdateProgramInfo(ProgramCode, States) {
  return request({
    url: '/HrMain/UpdateProgramInfo',
    method: 'post',
    params: { ProgramCode, States }
  })
}

export function RefreshProgramInfo(EnterpriseCode, ProgramCode) {
  return request({
    url: '/HrMain/RefreshProgramInfo',
    method: 'post',
    params: { EnterpriseCode, ProgramCode }
  })
}

export function GetOrderList(param) {
  return request({
    url: '/HrMain/GetOrderList',
    method: 'post',
    data: param
  })
}
export function AddOrder(param) {
  return request({
    url: '/HrMain/AddOrder',
    method: 'post',
    data: param
  })
}

export function GetSynchronizationList(param) {
  return request({
    url: '/HrMain/GetSynchronizationList',
    method: 'post',
    data: param
  })
}
export function AddSynchronization(param) {
  return request({
    url: '/HrMain/AddSynchronization',
    method: 'post',
    data: param
  })
}

export function DeleteSynchronization(EnterpriseCode) {
  return request({
    url: '/HrMain/DeleteSynchronization',
    method: 'post',
    params: { EnterpriseCode }
  })
}
export function GetBackstageRegion(param) {
  return request({
    url: '/HrMain/GetBackstageRegion',
    method: 'post',
    data: param
  })
}

export function GetBackstageUserList() {
  return request({
    url: '/HrMain/GetBackstageUserList',
    method: 'post'
  })
}

export function AddBackstageRegion(param) {
  return request({
    url: '/HrMain/AddBackstageRegion',
    method: 'post',
    data: param
  })
}

export function DeleteBackstageRegion(param) {
  return request({
    url: '/HrMain/DeleteBackstageRegion',
    method: 'post',
    data: param
  })
}


export function GetEnterpriseInfo(EnterPriseCode) {
  return request({
    url: '/HrMain/GetEnterpriseInfo',
    method: 'post',
    params: { EnterPriseCode }
  })
}

export function UpdateEnterpriseAndUserpwd(param) {
  return request({
    url: '/HrMain/UpdateEnterpriseAndUserpwd',
    method: 'post',
    data: param
  })
}

export function GetAdmin_PermissionByRole() {
  return request({
    url: '/HrMain/GetAdmin_PermissionByRole',
    method: 'post',
  })
}

export function GetAdmin_PermissionByRoleID(PrentEnterpriseCode) {
  return request({
    url: '/HrMain/GetAdmin_PermissionByRoleID',
    method: 'post',
    params: { PrentEnterpriseCode }
  })
}

export function BindRole_Permissions(param) {
  return request({
    url: '/HrMain/BindRole_Permissions',
    method: 'post',
    data: param
  })
}

export function getUserPermissions() {
  return request({
    url: '/HrMain/getUserPermissions',
    method: 'post'
  })
}
export function getInfo(token) {
  return request({
    url: '/HrMain/GetUserInfo',
    method: 'post',
    params: { token }
  })
}

export function UpdatePasswordCommit(param) {
  return request({
    url: '/HrMain/UpdatePasswordCommit',
    method: 'post',
    data: param
  })
}

export function EditOrderBy(EnterPriseCode, OrderBy) {
  return request({
    url: '/HrMain/EditOrderBy',
    method: 'post',
    params: { EnterPriseCode, OrderBy }
  })
}

export function EditProgramOrderBy(ProgramCode, OrderBy) {
  return request({
    url: '/HrMain/EditProgramOrderBy',
    method: 'post',
    params: { ProgramCode, OrderBy }
  })
}

export function GetChildEnterpriseBind(ParentEnterpriseCode, SaveFlag) {
  return request({
    url: '/HrMain/GetChildEnterpriseBind',
    method: 'post',
    params: { ParentEnterpriseCode, SaveFlag }
  })
}

export function SaveChildEnterprise(param) {
  
  return request({
    url: '/HrMain/SaveChildEnterprise',
    method: 'post',
    data: param
  })
}

export function GetChildUserConId(Conid) {
  return request({
    url: '/HrMain/GetChildUserConId',
    method: 'post',
    params: { Conid }
  })
}

export function GetMessageLog() {
  return request({
    url: '/HrMain/GetMessageLog',
    method: 'post',
  })
}