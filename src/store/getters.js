/*
 * @Author: Tan Xuan
 * @Date: 2020-05-20 10:00:28
 * @LastEditors: Tan Xuan
 * @LastEditTime: 2020-10-12 16:12:57
 * @Description: File content
 */

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  userId: state => state.user.id,
  codes: state => state.user.codes,
  keepAlivePages: state => state.app.keepAlivePages
}
export default getters
