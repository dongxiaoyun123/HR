import request from '@/utils/request'
import CBC from '@/utils/CBC'
export function login(data) {
  const jsonStr = JSON.stringify(data)
  const strParam = CBC.encrypt(jsonStr)
  const obj = {}
  obj.login = strParam
  obj.device = 2; // pc
  return request({
    url: '/HrLogin/AdminLogin',
    method: 'post',
    data: obj
  })
}

