import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post',
  })
}

export function getUserDetail(id) {
  return request({
    url: '/sys/user/' + id,
  })
}

/** *
 *
 * 保存员工的基本信息
 * **/
export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data,
  })
}
