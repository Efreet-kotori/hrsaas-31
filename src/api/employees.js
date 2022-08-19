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

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`,
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data,
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`,
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data,
  })
}

/** *
 * 给用户分配角色
 * ***/
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put',
  })
}
