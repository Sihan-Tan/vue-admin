/*
 * @Author: Tan Xuan
 * @Date: 2020-05-20 10:00:28
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-06-18 16:36:39
 * @Description: File content
 */

import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getList(params) {
  return request({
    url: '/user/manageList',
    params
  })
}

export function add(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/user/deleteAdmin/' + id,
    method: 'delete'
  })
}
