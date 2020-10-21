/*
 * @Author: Tan Xuan
 * @Date: 2020-04-13 17:08:54
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-04-26 19:43:55
 * @Description: File content
 */
import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/doctorlabels/list',
    method: 'get',
    params
  })
}

export function save(params) {
  if (!params.id) {
    return request({
      url: '/doctorlabels/add',
      method: 'post',
      data: params
    })
  } else {
    return request({
      url: '/doctorlabels/edit',
      method: 'post',
      data: params
    })
  }
}

export function remove(id) {
  return request({
    url: '/doctorlabels/delete?id=' + id,
    method: 'delete'
  })
}
