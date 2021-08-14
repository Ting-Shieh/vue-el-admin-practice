import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/common/config/router.js'

// const routes = [
//   {
//     path: '/',
//     name: 'layout',
//     component: () => import(/* webpackChunkName: "about" */ '@/views/layout'),
//     children: [
//       // UserHome will be rendered inside User's <router-view>
//       // when /user/:id is matched
//       {
//         // 後臺首頁
//         path: '/index',
//         name: 'index',
//         component: () => import(/* webpackChunkName: "about" */ '@/views/index/index.vue')
//       }

//       // ...other sub routes
//     ]
//   },
//   {
//     path: '/login',
//     name: 'login',
//     component: () => import(/* webpackChunkName: "about" */ '@/views/login/index.vue')
//   },
//   // {
//   //   path: '/about',
//   //   name: 'About',
//   //   // route level code-splitting
//   //   // this generates a separate chunk (about.[hash].js) for this route
//   //   // which is lazy-loaded when the route is visited.
//   //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
//   // }
// ]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

// 全局前置守衛  // BAD
router.beforeEach((to, from, next) => {
  // 獲取 token
  let token = window.sessionStorage.getItem('token')
  // 
  let user = window.sessionStorage.getItem('user')
  
  if (token) {
    /**
     * 已登入
     * */
    // 防止重複登入
    if (to.path === '/login') {
      return next({ name: from.name ? from.name : 'index' })
    }

    // 其他驗證...
    if (to.name !== 'error_404') {
      // 超級管理員跳過驗證
      if (user ) {
        user = JSON.parse(user)
        if(user.super === 1) return next()
      }
      // 驗證
      let rules = window.sessionStorage.getItem('rules')
      rules = rules ? JSON.parse(rules) : []

      let index = rules.findIndex((item) => {
        return item.rule_id > 0 && item.desc === to.name //找到表示有權限
      })

      if (index === -1) {
        this.$message.error('你無此權限')
        return next({ name: from.name ? from.name : 'error_404' }) // 跳到固定頁面-404
      }
    }

    next()
  } else {
    /**
     * 未登入
     * */

    // 跳過登入頁驗證
    if (to.path === '/login') {
      return next()
    }
    next({ path: '/login' })
  }
  // if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // // 如果用户未能验证身份，则 `next` 会被调用两次
  // next()
})
export default router
