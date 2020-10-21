/*
 * @Author: Tan Xuan
 * @Date: 2020-04-13 17:08:54
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-06-16 10:42:54
 * @Description: File content
 */
/**
 * Created by PanJiaChen on 16/11/18.
 */
import { Message } from 'element-ui'

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  return str && str.length >= 4
}

export function validateRequire(rule, value, callback) {
  if (value === '') {
    Message({
      message: rule.name + '为必传项',
      type: 'error'
    })
    callback(new Error(rule.name + '为必传项'))
  } else {
    callback()
  }
}

// 校验手机号
export function testPhone(phone) {
  phone += ''
  return phone.match(/^1\d{10}$/gi)
}

// 校验身份证
export function testIdCard(sId) {
  if (!sId) {
    return false
  }
  sId = String(sId)
  if (!sId.match(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/gi)) {
    return false
  }
  return true
}
