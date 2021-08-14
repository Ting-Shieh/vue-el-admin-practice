/**
 * 管理創建商品狀態
 */
import $Util from '@/common/util.js'
export default {
  state: {
    user: {},
    token:false,
  },
  getters: {},
  mutations: {
    // 初始化用戶訊息
    initUser (state) {
      let user = window.sessionStorage.getItem('user')
      if (user) {
        state.user = JSON.parse(user)
        state.token = state.user.token
      }
    },
    // 登入
    login (state, user) {
      // 保存登入狀態
      state.user = user
      state.token = user.token
      // 存儲到本地存儲 sessionStorage => close窗口或標籤頁後會刪除此些數據
      window.sessionStorage.setItem('user', JSON.stringify(state.user))
      window.sessionStorage.setItem('token', state.token)

    },
    // 登出
    logout (state) {
      // 清除狀態
      state.user = {}
      state.token = false
      // 清除本地存儲
      window.sessionStorage.clear()
    },

  },
  actions: {},
}
