<template>
  <div class="">
    <!-- <h1>Router 配置成功(主布局)</h1> -->
    <!-- 顯示 children 組件 -->
    <el-container class="full-main-container">
      <el-header
        class="d-flex justify-content-between align-items-center"
        style="background-color:#545c64;"
      >
        <a class="h5 text-white font-weight-bold mb-0" href="">{{
          $conf.logo
        }}</a>
        <el-menu
          :default-active="navBar.active"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            :index="idx.toString()"
            v-for="(navbar, idx) in navBar.list"
            :key="idx"
            >{{ navbar.name }}</el-menu-item
          >
          <el-submenu index="100">
            <template #title>
              <el-avatar
                size="small"
                :src="
                  user.avatar
                    ? user.avatar
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0vprJmavOU1CIoEJxaWURtQII2SRtgOcB1nWoavTXlVgfZxKAwppzubwWBsn-_YaU9Es&usqp=CAU'
                "
              ></el-avatar>
              {{ user.username }}</template
            >
            <el-menu-item index="2-1">修改</el-menu-item>
            <el-menu-item index="2-2">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>

      <el-container style="height: 100%;">
        <!-- 側邊佈局 -->
        <el-aside class="this" width="300px">
          <el-menu
            style="height: 100%;"
            :default-active="slideMenuActive"
            @select="slideSelect"
          >
            <el-menu-item
              :index="idx.toString()"
              v-for="(subbar, idx) in slideMenus"
              :key="idx"
            >
              <i :class="subbar.icon"></i>
              <template #title>{{ subbar.name }}</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 主佈局 -->
        <el-main
          class="bg-light"
          style="padding-bottom: 60px; position:relative;"
          v-loading="loading"
        >
          <!-- 麵包屑 導航 -->
          <div
            class="border-bottom mb-3 bg-white"
            style="padding: 20px;margin:-20px;"
            v-if="bran.length > 0"
          >
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                v-for="(item, idx) in bran"
                :key="idx"
                :to="{ path: item.path }"
                >{{ item.title }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
          <!-- 主內容 -->
          <router-view></router-view>

          <el-backtop target=".el-main" :bottom="100">
            <div
              style="{
                height: 100%;
                width: 100%;
                background-color: #f2f5f6;
                box-shadow: 0 0 6px rgba(0,0,0, .12);
                text-align: center;
                line-height: 40px;
                color: #1989fa;
              }"
            >
              UP
            </div>
          </el-backtop>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import { mapState } from 'vuex'
export default {

  data() {
    return {
      // : [],  // api 串接前用
      bran: [],
      loading: false,
    }
  },
  provide() {
    return {
      layout: this,
    }
  },
  props: {
    prop: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.user.user,
      navBar: (state) => state.menu.navBar,
    }),
    slideMenus() {
      let item = this.navBar.list[this.navBar.active]
      return item ? item.submenu : []
    },
    slideMenuActive: {
      get() {
        let item = this.navBar.list[this.navBar.active]
        return item ? item : '0'
      },
      set(val) {
        // console.log('slideMenuActive =>', val.toString())
        // this.navBar.list[this.navBar.active].subActive = val
        let item = this.navBar.list[this.navBar.active]
        if (item) {
          item.subActive = val
        }
      },
    },
  },
  watch: {
    // 監聽路由
    $route(to, from) {
      // 本地存儲
      localStorage.setItem(
        'navActive',
        JSON.stringify({
          top: this.navBar.active, //上方激活位置紀錄
          left: this.slideMenuActive, //左方激活位置紀錄
        })
      )
      console.log('監聽路由變化')
      this.getRouterBran()
      console.log('監聽路由變化 => getRouterBran 執行完')
    },
  },
  methods: {
    // 顯示loading
    showLoading() {
      this.loading = true
    },
    // 隱藏loading
    hideLoading() {
      this.loading = false
    },
    // 登出
    logout() {
      this.$axios
        .post(
          '/admin/logout',
          {},
          {
            token: true,
            loading: true,
          }
        )
        .then((res) => {
          // console.log(res)
          this.$message('登出成功')
          this.$store.commit('logout') // 清除狀態和儲存
          // 跳轉登入頁
          this.$router.push({ name: 'login' })
        })
        .catch((err) => {
          this.$store.commit('logout') // 清除狀態和儲存
          // 跳轉登入頁
          this.$router.push({ name: 'login' })
        })
    },
    handleSelect(key, keyPath) {
      // console.log(key, keyPath)
      // 修改 / 退出
      if (key === '2-1') {
        return console.log('修改')
      }

      if (key === '2-2') {
        // 登出
        return this.logout()
      }
      this.navBar.active = key

      // 默認選中跳轉到當前激活
      this.slideMenuActive = '0'

      if (this.slideMenus.length > 0) {
        // console.log(this.slideMenuActive)
        this.$router.push({
          name: this.slideMenus[this.slideMenuActive].pathname,
        })
      }
    },
    slideSelect(key, keyPath) {
      console.log('slideSelect - key=>', key)
      // this.navBar.list[this.navBar.active].subActive = key
      this.slideMenuActive = key

      // 跳轉指定頁面
      // console.log(this.slideMenus[key].pathname)
      this.$router.push({
        name: this.slideMenus[key].pathname,
      })
    },

    //獲取麵包屑導航
    getRouterBran() {
      //   console.log(this.$route.matched)
      let matchedRouteArr = this.$route.matched.filter((v) => v.name)
      let arr = []
      matchedRouteArr.forEach((routeObj, idx) => {
        // console.log('v=>', v, idx)

        // 過濾 layout and index
        if (routeObj.name === 'layout' || routeObj.name === 'index') return

        arr.push({
          name: routeObj.name,
          path: routeObj.path,
          title: routeObj.meta.title,
        })
      })

      if (arr.length > 0) {
        arr.unshift({
          name: 'index',
          path: '/index',
          title: '後臺首頁',
        })
      }

      this.bran = arr
      console.log('getRouterBran 執行完')
    },
    // 初始化菜單
    __initNavBar() {
      // 獲取本地存儲
      let r = localStorage.getItem('navActive')
      if (r) {
        r = JSON.parse(r)
        console.log('r=>', r)
        this.navBar.active = r.top
        this.slideMenuActive = r.left
      }
    },
  },
  created() {
    // 初始化 menu => api 串接前用
    // this.navBar = this.$conf.navBar

    //獲取麵包屑導航
    this.getRouterBran()

    // 初始化菜單
    this.__initNavBar()
  },
  mounted() {},
  updated() {},
  unmounted() {},
  filters: {
    numToString(val) {
      return val.toString()
    },
  },
}
</script>

<style scoped lang="scss">
.full-main-container {
  position: absolute;
  left: 0 !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  overflow: hidden;
}
</style>
