<template>
  <div
    class="border py-1 px-2 rounded mr-2 position-relative d-flex align-items-center mb-1"
    style="width:200px;"
  >
    <div class="mr-1" v-if="type !== 0">
      <!-- 顏色選擇器 -->
      <el-color-picker
        v-if="type === 1"
        size="mini"
        v-model="item.color"
        @change="onColorChange"
      ></el-color-picker>

      <!-- 圖片選擇器 -->
      <template v-else>
        <span
          v-if="!item.image"
          class="btn btn-light border "
          @click.prevent="chooseImage"
          ><i class="el-icon-plus"></i
        ></span>
        <img
          v-else
          :src="item.image"
          class="rounded"
          style="width:45px;height:45px; cursor: pointer;"
          @click="chooseImage"
        />
      </template>
    </div>
    <input
      type="text"
      class="form-control text-center border-0"
      v-if="type===0"
      :value="item.text"
      style="width:100px; font-size:15px;"
      @input="inputChange"
    />
    <span
      class="btn btn-light p-0 position-absolute"
      style="line-height:1;top:-10px;right: -10px;"
      @click.prevent="delSkuValueEvent"
      ><i class="el-icon-circle-close"></i
    ></span>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data() {
    return {}
  },
  /**
   * 接收依賴注入
   * https://vue3js.cn/docs/zh/guide/component-provide-inject.html
   * */
  inject: ['app', 'layout'],
  props: {
    type: {
      type: Number,
      default: 0,
    },
    item: {
      type: Object,
    },
    index: {
      type: Number,
    },
    cardIndex: {
      type: Number,
    },
  },
  components: {},
  computed: {},
  watch: {
    type(newVal, oldVal) {
      let keys = ['text', 'color', 'image']
      let defaultVal = ['屬性值', '#fff', '/favicon.ico']
      this.item.value = this.item[keys[newVal]]
        ? this.item[keys[newVal]]
        : defaultVal[newVal]

      this.updateSkuValueEvent()
    },
  },
  methods: {
    ...mapMutations(['delSkuValue', 'updateSkuValue']),
    vModel(key, value) {
      this.updateSkuValue({
        cardIndex: this.cardIndex,
        valueIndex: this.index,
        key,
        value,
      })
      this.updateSkuValueEvent()
    },
    delSkuValueEvent() {
      this.layout.showLoading()
      this.$axios
        .post(
          `/admin/goods_skus_card_value'/${this.item.id}/delete`,
          {},
          { token: true }
        )
        .then((res) => {
          console.log(res)

          this.delSkuValue({ cardIndex: this.index, valueIndex: this.index })

          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    updateSkuValueEvent() {
      console.log(this.item)
      let keys = ['text', 'color', 'image']

      this.item.value = this.item[keys[this.type]]

      this.$axios.post(
        `/admin/goods_skus_card_value'/${this.item.id}`,
        this.item,
        {
          token: true,
        }
      )
    },
    inputChange(e) {
      this.vModel('text', e.target.value)
    },
    //選擇圖片
    chooseImage() {
      // console.log('this.app ===>', this.app)
      this.app.chooseImage((res) => {
        this.vModel('image', res[0].url)
      }, 1)
    },
    // 監聽顏色選擇器
    onColorChange(e) {
      // console.log(e)
      this.vModel('color', e)
    },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang=""></style>
