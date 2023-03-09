import request from '@/utils/request'
import CBC from '@/utils/CBC'
export function login(data) {
  let jsonStr = JSON.stringify(data)
  let strParam = CBC.encrypt(jsonStr)
  let obj = {}
  obj.login = strParam
  obj.device = 2; //pc
  return request({
    url: '/HrLogin/AdminLogin',
    method: 'post',
    data:obj
  })
}






