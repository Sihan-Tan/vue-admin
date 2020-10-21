import { login, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    role: '',
    id: '',
    codes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_CODES: (state, codes) => {
    state.codes = codes
  },
  SET_ID: (state, id) => {
    state.id = id
  }
}

const ADMIN = {
  id: 1,
  name: "管理员",
  username: "管理员",
  role_id: 1,
  role_name: "管理员",
  menus: [100],
  token: "00ucd9pgjq3isdbl64jgps84pmok5u26",
}

const EDITOR = {
  id: 2,
  name: "访客",
  username: "访客",
  role_id: 2,
  role_name: "访客",
  menus: [100],
  token: "00ucd9pgjq3isdbl64jgps84pmok5u26",
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username: inputUserName } = userInfo
    return new Promise((resolve, reject) => {
      let data
      if (inputUserName.trim() === 'admin') {
        data = ADMIN
      } else {
        data = EDITOR
      }
      const { name, username, avatar, role_id, menus, id } = data
      commit('SET_NAME', name || username)
      commit('SET_AVATAR', avatar)
      commit('SET_ROLE', role_id)
      commit('SET_CODES', menus)
      commit('SET_ID', id)
      setToken(data.token)
      resolve()
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // logout(state.token)
      //   .then(() => {
      //     removeToken(); // must remove  token  first
      //     resetRouter();
      //     commit("RESET_STATE");
      //     resolve();
      //   })
      //   .catch(error => {
      //     reject(error);
      //   });
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
