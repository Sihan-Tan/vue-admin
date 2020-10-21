/*
 * @Author: Tan Xuan
 * @Date: 2020-10-21 18:11:36
 * @LastEditTime: 2020-10-21 18:41:11
 * @LastEditors: Tan Xuan
 * @Description: 
 */
const tokens = {
  admin: {
    token: "admin-token",
  },
  editor: {
    token: "editor-token",
  },
};

const users = {
  "admin-token": {
    id: 1,
    name: "管理员",
    username: "管理员",
    role_id: 1,
    role_name: "管理员",
    menus: [100],
    token: "00ucd9pgjq3isdbl64jgps84pmok5u26",
  },
  "editor-token": {
    id: 2,
    name: "访客",
    username: "访客",
    role_id: 2,
    role_name: "访客",
    menus: [100],
    token: "00ucd9pgjq3isdbl64jgps84pmok5u26",
  },
};

export default [
  // user login
  {
    url: "/vue-admin-template/user/login",
    type: "post",
    response: (config) => {
      const { username } = config.body;
      const token = tokens[username];

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: "Account and password are incorrect.",
        };
      }

      return {
        code: 20000,
        data: token,
      };
    },
  },

  // get user info
  {
    url: "/vue-admin-template/user/info.*",
    type: "get",
    response: (config) => {
      const { token } = config.query;
      const info = users[token];

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: "Login failed, unable to get user details.",
        };
      }

      return {
        code: 20000,
        data: info,
      };
    },
  },

  // user logout
  {
    url: "/vue-admin-template/user/logout",
    type: "post",
    response: (_) => {
      return {
        code: 20000,
        data: "success",
      };
    },
  },
];
