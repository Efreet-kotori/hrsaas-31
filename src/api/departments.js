import request from '@/utils/request'

export function getDeptsApi() {
  return request({
    url: '/company/department',
  })
}

export function delDeptsApi(id) {
  return request({
    url: '/company/department/' + id,
    method: 'DELETE',
  })
}

export function addDeptsApi() {
  return request({
    url: '/company/department',
    method: 'POST',
  })
}

export function getEmployeesApi() {
  return request({
    url: '/sys/user/simple',
  })
}

export function addDeptApi(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data,
  })
}

export function getDeptByIdApi(id) {
  return request({
    url: '/company/department/' + id,
  })
}

export function editDeptsApi(data) {
  return request({
    url: '/company/department/' + data.id,
    method: 'PUT',
    data,
  })
}
