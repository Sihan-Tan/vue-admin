/*
 * @Author: Tan Xuan
 * @Date: 2020-06-18 10:38:07
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-06-19 11:21:55
 * @Description: File content
 */
import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/adminRole/list',
    params
  })
}

export function edit(data) {
  return request({
    url: '/adminRole/edit',
    method: 'post',
    data
  })
}

export function info(id) {
  return request({
    url: '/adminRole/info/' + id
  })
}

export function setRole(data) {
  return request({
    url: '/adminRole/setRole',
    method: 'post',
    data
  })
}

export function remove(id) {
  return request({
    url: '/adminRole/remove/' + id,
    method: 'delete'
  })
}
