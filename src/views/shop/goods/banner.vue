<template>
  <div class="bg-white px-3 goods_creat" style="margin: -16px -20px 0px -20px">
    <router-link
      :to="{ name: 'shop_goods_list' }"
      style="position: absolute; left: 200px; top: 12px"
    >
      <button type="button" class="btn btn-outline-primary btn-sm">
        回商品列表
      </button>
    </router-link>
    <div class="d-flex flex-wrap">
      <div
        class="d-flex align-items-center justify-content-center border rounded mr-3 mb-3 position-relative"
        style="width:150px; height:150px;cursor: pointer;"
        v-for="(banner, bidx) in banners"
        :key="bidx"
        @click.prevent="chooseImage(bidx)"
      >
        <img
          v-if="banner.url"
          :src="banner.url"
          style="width:100%;height:100%"
        />
        <i v-else class="el-icon-plus text-muted" style="font-size:30px"></i>
        <i
          class="el-icon-delete p-2  text-white position-absolute"
          style="top: 0px; right: 0px;background-color: rgba(0,0,0,0.5)"
          @click.stop="deleteImage(bidx)"
        ></i>
      </div>

      <div
        v-if="banners.length < 9"
        class="d-flex align-items-center justify-content-center border rounded mr-3 mb-3"
        style="width:150px; height:150px;cursor: pointer;"
        @click.prevent="chooseImage(-1)"
      >
        <i class="el-icon-plus text-muted" style="font-size:30px"></i>
      </div>
    </div>
        <div class="">
      <el-button
        type="primary"
        style="position: fixed;bottom:50px; right:50px;"
        @click="submit"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'


export default {
  /**
   * 接收依賴注入
   * https://vue3js.cn/docs/zh/guide/component-provide-inject.html
   * */
  inject: ['app', 'layout'],
  data() {
    return {
      banners:[],
      id:0,
    }
  },

  watch: {},
  methods: {
    
    //選擇圖片
    chooseImage(index) {
      const MAX = 9
      let count = MAX - this.banners.length // 可選剩餘張數

      this.app.chooseImage(
        (res) => {
          let list = []
          // -1 可再選 | 1 只能做圖片替換操作
          if (index === -1) {
            list = [...this.banners, ...res]
          } else {
            list = [...this.banners]
            list[index] = res[0] // 只能做圖片替換操作，故只有1張
          }
          //
          this.banners= list
        },
        index === -1 ? count : 1
      ) // -1 可再選 | 1 只能做圖片替換操作

      
    },
    // 刪除banner
    deleteImage(index) {
      this.$confirm('是否刪除該圖片?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          
         this.banners.splice(index, 1)
        
          this.$message({
            type: 'success',
            message: '刪除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消刪除',
          })
        })
    },

    // 提交
    submit() {
      this.layout.showLoading()
      this.$axios
        .post(
          `/admin/goods/banners/${this.id}`,
          { banners:this.banners.map(v=>v.url) },
          { token: true }
        )
        .then((res) => {
          this.$message({
            message: '提交成功',
            type: 'success',
          })
          this.$router.push({
            name: 'shop_goods_list',
          })
          this.layout.hideLoading()
        })
        .catch((err) => {
          
          this.layout.hideLoading()
        })
    },
  },
  created() {
    this.id = this.$route.params.id
    if (!this.id) {
      this.$message({
        message: '非法參數',
        type: 'error',
      })
      return this.$router.push({
        name: 'shop_goods_list',
      })
    }
    // 獲取之前商品詳情
    this.layout.showLoading()
    this.$axios
      .get(`/admin/goods/read/${this.id}`, { token: true })
      .then((res) => {
        this.banners = res.data.data.goodsBanner
        this.layout.hideLoading()
      })
      .catch((err) => {
        
        this.layout.hideLoading()
      })
  },
  mounted() {
   
  },
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang="scss">
.goods_creat .el-form-item {
  margin-bottom: 15px;
}
</style>
