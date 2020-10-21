/*
 * @Author: Tan Xuan
 * @Date: 2020-05-20 10:00:28
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-05-27 10:41:12
 * @Description: File content
 */

import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import createPersistedState from 'vuex-persistedstate'

const vuexSession = createPersistedState({
  storage: window.sessionStorage,
  reducer(val) {
    return {
      user: val.user,
      app: val.app
    }
  }
})
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters,
  plugins: [vuexSession]
})

export default store
