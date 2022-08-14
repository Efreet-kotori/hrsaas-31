import request from '@/utils/request'

export function getEmployeesApi() {
  return request({
    url: '/sys/user/simple',
  })
}

export function getEmployeesInfoApi(params) {
  return request({
    url: '/sys/user',
    params,
  })
}

export function removeEmployeesApi(id) {
  return request({
    url: '/sys/user/' + id,
    method: 'DELETE',
  })
}

export function addEmployees(data) {
  return request({
    url: '/sys/user',
    method: 'POST',
    data,
  })
}

export function importEmployees(data) {
  return request({
    url: '/sys/user/batch',
    method: 'POST',
    data,
  })
}
