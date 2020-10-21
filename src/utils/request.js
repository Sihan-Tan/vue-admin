import axios from 'axios'
import qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// import { getToken } from '@/utils/auth'

const isDev = window.location.href.includes('localhost')

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: isDev ? 5000 : 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // do something before request is sent
    if (config.method === 'post') {
      if (config.useForm) {
        // 传递文件用 form-data
        console.log('上传文件……')
        console.log(config.data)
        // config.headers["Content-type"] = "multipart/form-data";
        config.headers['Content-type'] = 'application/json'
      } else if (config.json) {
        // 传递 json 数据
        config.headers['Content-type'] = 'application/json'
        config.data = JSON.stringify(config.data)
      } else {
        // post 正常数据
        config.data = qs.stringify(config.data)
        config.headers['Content-type'] = 'application/x-www-form-urlencoded'
      }
    }
    if (config.method === 'delete') {
      // post 正常数据
      config.data = qs.stringify(config.data)
      config.headers['Content-type'] = 'application/x-www-form-urlencoded'
    }

    // if (store.getters.token) {
    // let each request carry token
    // ['X-Token'] is a custom headers key
    // please modify it according to the actual situation
    // config.headers['X-Token'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 0, it is judged as an error.
    if (res.code !== 0) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 401) {
        // to re-login
        MessageBox.confirm('请重新登录！', '确定登出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // store.dispatch('user/login').then(() => {
          //   location.reload()
          // })
          store.commit('user/SET_ROLE', '')
          router.replace(`/login?redirect=/welcome`)
        })
      }
      return res
    } else {
      return res
    }
  },
  error => {
    Message.closeAll()
    console.log('err' + error) // for debug
    let msg = '网络错误'
    if (error.message) {
      msg =
        error.message && error.message.includes('timeout')
          ? '请求超时,请稍后再试'
          : error.message
    }
    Message({
      message: msg,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

// 响应拦截器
// service.interceptors.response.use(
//   (response) => {
//     const route = router.history.current;
//     console.log(11)
//     if (response.status === 200) {
//       // 去授权
//       console.log(22)
//       if (response.data.code === 401) {
//         let beforeUrl = `${location.href.split('#')[0]}#${route.fullPath}`;
//         console.log(beforeUrl);
//         if (!beforeUrl.split('dist/#/')[1]) {
//           beforeUrl = document.URL;
//         }
//         const url = encodeURIComponent(beforeUrl);
//         document.cookie = `hospital_return_url=${url};path=/`;
//         location.replace(response.data.data);
//       }
//     } else {
//       return Promise.reject(response);
//     }
//     console.log(33)
//     return Promise.resolve(response.data);
//   },
//   (err) => {
//     // 对不同返回码对相应处理
//     // Toast('请求超时，请稍后重试')
//     // 请求超时， 重新请求
//     const { config } = err.config;
//     // If config does not exist or the retry option is not set, reject
//     if (!config || !config.retry) {
//       store.commit('SET_LOADING', false);
//       return Promise.reject(err);
//     }

//     // Set the variable for keeping track of the retry count
//     config.__retryCount = config.__retryCount || 0;

//     // Check if we've maxed out the total number of retries
//     if (config.__retryCount >= config.retry) {
//       // Reject with the error
//       store.commit('SET_LOADING', false);
//       return Promise.reject(err);
//     }

//     // Increase the retry count
//     config.__retryCount += 1;

//     // Create new promise to handle exponential backoff
//     const backoff = new Promise((resolve) => {
//       setTimeout(() => {
//         resolve();
//       }, config.retryDelay || 1);
//     });

//     // Return the promise in which recalls axios to retry the request
//     return backoff.then(() => {
//       return axios(config);
//     });
//   }
// );

export default service
