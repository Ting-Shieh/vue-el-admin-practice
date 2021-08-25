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
    <div class="">
      <!-- web 版 -->
      <!-- <tiny-mce v-model="contnet"></tiny-mce> -->
      <!-- 富文本编辑器 -->
			<tiny-mce ref="editor" v-model="content" @onClick="onClick" toolbar="undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists table | removeformat | imageUpload"/>
    </div>
    <div class="">
      <el-button
        type="primary"
        sstyle="position: fixed;bottom:50px; right:50px;"
        @click="submit"
        >提交</el-button
      >
    </div>
  </div>
</template>

<script>
import TinyMce from '@/components/common/TinyMce.vue'

export default {
  /**
   * 接收依賴注入
   * https://vue3js.cn/docs/zh/guide/component-provide-inject.html
   * */
  inject: ['app', 'layout'],

  data() {
    return {
      contnet: '',
      id: 0,
    }
  },
  components: { TinyMce },

  watch: {},
  methods: {
    // 滑鼠單擊的事件
			onClick (e, editor) {
				console.log('Element clicked')
				console.log(e)
				console.log(editor)
			},
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
          this.vModel('banners', list)
        },
        index === -1 ? count : 1
      ) // -1 可再選 | 1 只能做圖片替換操作

      /** old */
      // console.log('this.app ===>', this.app)
      // this.app.chooseImage((res) => {
      //   console.log(res)
      //   console.log("Before=>",this.banners)
      //   let list= [...this.banners, ...res]
      //   console.log("After=>",list)

      //   this.vModel('banners', list)

      // }, 9)
    },
    // 刪除banner
    deleteImage(index) {
      this.$confirm('是否刪除該圖片?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          let list = [...this.banners]
          list.splice(index, 1)
          this.vModel('banners', list)
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
          `/admin/goods/${this.id}`,
          { content: this.content },
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
          this.content = res.data.data.content
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
        this.content = res.data.data.content
        this.layout.hideLoading()
      })
      .catch((err) => {
        
        this.layout.hideLoading()
      })
  },
  mounted() {},
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang="scss">
.goods_creat .el-form-item {
  margin-bottom: 15px;
}
</style>
