// https://www.gushiciku.cn/pl/gzql/zh-tw
import { ElMessage } from 'element-plus'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/**
 * 引入全局配置文件
 */
import $conf from '@/common/config/config.js'

/**
 * 全局 loading 配置
 */
let loading = null
let requestCount = 0 // 請求數
// 顯示loading
const showLoading = () => {
  if (requestCount === 0) {
    loading = ElMessage({
      message: '載入中...',
      duration: 0,
    })
  }
  requestCount++
}
// 隱藏loading
const hideLoading = () => {
  if (requestCount > 0) {
    requestCount--
  }

  if (loading && requestCount === 0) {
    loading.close()
  }
}

/**
 * 請求攔截器
 */

axios.interceptors.request.use(
  (config) => {
    // 添加全局 Header頭 token
    let token = window.sessionStorage.getItem('token')
    if (config.token === true) {
      config.headers['token'] = token
    }

    // 顯示loading
    if (config.loading === true) {
      showLoading()
    }

    return config
  },
  (err) => {
    hideLoading() // 隱藏loading
    //  全局錯誤提示
    if (err.response && err.response.data && err.response.data.errorCose) {
      ElMessage.error(err.response.data.msg)
    }

    return Promise.reject(err)
  }
)

/**
 * 響應攔截器
 */

axios.interceptors.response.use(
  (res) => {
    hideLoading() // 隱藏loading
    return res
  },
  (err) => {
    //  全局錯誤提示
    if (err.response && err.response.data && err.response.data.errorCose) {
      ElMessage.error(err.response.data.msg)
    }
    hideLoading() // 隱藏loading

    return Promise.reject(err)
  }
)

const vm = createApp(App)

// 注册一个全局自定义指令 `v-focus`
vm.directive('auth', {
  // 当被绑定的元素挂载到 DOM 中时……  vue2 的 inserted
  mounted(el, binding, vnode, prevNnode) {
    let user = window.sessionStorage.getItem('user')
    user = user ? JSON.parse(user) : {}

    // 如果不是超級管理員 才需要驗證
    if (!user.super) {
      // ruleNames: ["规则管理", "添加规则", "更新规则", "删除规则", "规则列表", "更新规则状态", "角色管理", "添加角色", "更新角色", "删除角色", "角色列表", "更新角色状态"]"
      let rules = user.ruleNames ? user.ruleNames : []
      let v = rules.find((item) => item === binding.value)
      // console.log(v)
      if (!v) {
        el.parentNode.removeChild(el)
      }
    }
  },
})

vm.config.globalProperties.$conf = $conf

// vue 3 要放 createApp 之後
import axios from 'axios'
vm.config.globalProperties.$axios = axios

vm.use(ElementPlus)
vm.use(store)
vm.use(router)
vm.mount('#app')
