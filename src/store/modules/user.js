import { login, getUserInfo, getUserDetail } from '@/api/user.js'

export default {
  namespaced: true,

  state: {
    token: '',
    userInfo: '',
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
    },
    setUserInfo(state, payload) {
      state.userInfo = payload
    },
  },
  actions: {
    async getToken(context, payload) {
      const res = await login(payload)
      context.commit('setToken', res)
      console.log(payload)
    },
    async getUserInfo(context) {
      const userBaseInfo = await getUserInfo()
      const userInfo = await getUserDetail(userBaseInfo.userId)
      // console.log(userInfo)
      // console.log(111);
      context.commit('setUserInfo', { ...userBaseInfo, ...userInfo })
    },
  },
  getters: {},
}
