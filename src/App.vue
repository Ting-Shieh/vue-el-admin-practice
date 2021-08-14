<template>
  <div id="nav">
    <router-view />
  </div>

  <!-- 解決彈出層多次渲染的問題 -->
  <image-dialog ref="imageDialog" :max="maxChooseImageVal"></image-dialog>

  <skus-dialog ref="skusDialog"></skus-dialog>
</template>

<script>
import ImageDialog from '@/components/image/ImageDialog.vue';
import SkusDialog from '@/components/skus/SkusDialog.vue';
export default {
  name: 'app',
  /**
   * 依賴注入 =>　傳入給子組件
   * https://vue3js.cn/docs/zh/guide/component-provide-inject.html
   * */
  provide() {
    return {
      app: this, //當前 this 傳入
    }
  },
  components: {ImageDialog, SkusDialog},
  data() {
    return {
      maxChooseImageVal: 9,
    }
  },
  methods: {
    // 選擇圖片
    chooseImage(callback, max=9){
      this.maxChooseImageVal = max
      this.$refs.imageDialog.chooseImage(callback)
    },

    // 選擇規格
    chooseSkus(callback){

      this.$refs.skusDialog.chooseskus(callback)
    },
  },
  created() {
    // 初始化用戶訊息
    this.$store.commit('initUser')

    // 初始化後台菜單
    this.$store.commit('initNavBar')
  },
}
</script>
<style lang="scss">
/* 全局 */
::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

::-webkit-scrollbar {
  width: 10px;
  height: 10px;
  -webkit-appearance: none;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.25);
  transition: color 0.2s ease;
}
.el-tree-node__content {
  padding: 20px 0px 20px 0px !important;

}
</style>
