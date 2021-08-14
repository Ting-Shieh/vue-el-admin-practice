/**
 * 管理創建商品狀態
 */
import $Util from '@/common/util.js'
export default {
  state: {
    navBar: {
      active: '0',
      list: [],
    },
    
  },
  getters: {
    // 首頁
    adminIndex (state) {
      if (state.navBar.list.length === 0) return 'error_404';
      let item = state.navBar.list[0].submenu[0]
      if(item) return item.pathname
      
    },
  },
  mutations: {
    // 創建菜單
    createNavBar(state, menus) {
      let list = menus.map((item) => {
        let submenu = item.child.map((v) => {
          return {
            icon: v.icon,
            name: v.name,
            pathname: v.desc,
          }
        })
        return {
          name: item.name,
          subActive: '0',
          submenu: submenu,
        }
      })
      state.navBar.list = list
      window.sessionStorage.setItem('navBar', JSON.stringify(state.navBar))
    },

    // 初始化菜單
    initNavBar(state) {
      let navBar = window.sessionStorage.getItem('navBar')
      navBar = navBar
        ? JSON.parse(navBar)
        : {
            active: '0',
            list: [],
          }
      state.navBar = navBar
    },
    // 
  },
  actions: {},
}
