import request from '@/utils/request'

export function getcompanyApi(id) {
  return request({
    url: `/company/${id}`,
  })
}
