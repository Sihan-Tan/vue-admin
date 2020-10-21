/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}
/**
 * @param {Object}
 * @returns {string} url
 */
export function convertUrlObj(data) {
  var _result = []
  for (var key in data) {
    var value = data[key]
    value = Array.isArray(value) ? value.join(',') : value
    _result.push(key + '=' + value)
    // if (Array.isArray(value)) {
    //   value.forEach(function(_value) {
    //     _result.push(key + '=' + _value)
    //   })
    // } else {
    //   _result.push(key + '=' + value)
    // }
  }
  return _result.join('&')
}

// 防抖
export function debounce(func, delay) {
  let timer
  // ...args指func的参数，args指func的参数组,相当于arguments,var args = arguments
  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    // console.log(arguments, args)
    timer = setTimeout(() => {
      // 调用func,传入args参数数组
      func.apply(this, args)
    }, delay)
  }
}

export function createPassword(min, max) {
  // 可以生成随机密码的相关数组
  var num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  var english = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]
  var ENGLISH = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z'
  ]
  var special = ['-', '_', '#']
  var config = num
    .concat(english)
    .concat(ENGLISH)
    .concat(special)

  // 先放入一个必须存在的
  var arr = []
  arr.push(getOne(num))
  arr.push(getOne(english))
  arr.push(getOne(ENGLISH))
  arr.push(getOne(special))

  // 获取需要生成的长度
  var len = min + Math.floor(Math.random() * (max - min + 1))

  for (var i = 4; i < len; i++) {
    // 从数组里面抽出一个
    arr.push(config[Math.floor(Math.random() * config.length)])
  }

  // 乱序
  var newArr = []
  for (var j = 0; j < len; j++) {
    newArr.push(arr.splice(Math.random() * arr.length, 1)[0])
  }

  // 随机从数组中抽出一个数值
  function getOne(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  return newArr.join('')
}
