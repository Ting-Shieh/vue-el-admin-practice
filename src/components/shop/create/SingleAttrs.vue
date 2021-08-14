<template>
  <form>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">市場價格</label>
      <div class="col-sm-4 d-flex">
        <input
          type="number"
          class="form-control w-50 "
          placeholder=""
          :value="oprice"
          @change="vModel('oprice', parseInt($event.target.value))"
        />
        <div class="input-group-append">
          <span class="input-group-text">元</span>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">銷售價格</label>
      <div class="col-sm-4 d-flex">
        <input
          type="number"
          class="form-control w-50 "
          min="0"
          placeholder=""
          :value="pprice"
          @change="vModel('pprice', parseInt($event.target.value))"
        />
        <div class="input-group-append">
          <span class="input-group-text">元</span>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">成本價格</label>
      <div class="col-sm-4 d-flex">
        <input
          type="number"
          class="form-control w-50 "
          min="0"
          placeholder=""
          :value="cprice"
          @change="vModel('cprice', parseInt($event.target.value))"
        />
        <div class="input-group-append">
          <span class="input-group-text">元</span>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">商品重量</label>
      <div class="col-sm-4 d-flex">
        <input
          type="number"
          class="form-control w-50 "
          min="1"
          placeholder=""
          :value="weight"
          @change="vModel('weight', parseInt($event.target.value))"
        />
        <div class="input-group-append">
          <span class="input-group-text">公斤(kg)</span>
        </div>
      </div>
    </div>
    <div class="form-group row">
      <label class="col-sm-2 col-form-label">商品體積</label>
      <div class="col-sm-4 d-flex">
        <input
          type="number"
          class="form-control w-50 "
          min="1"
          placeholder=""
          :value="weight"
          @change="vModel('weight', parseInt($event.target.value))"
        />
        <div class="input-group-append">
          <span class="input-group-text">立方公尺</span>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {}
  },
  props: {
    prop: {
      type: String,
      required: false,
    },
  },
  computed: {...mapState({
      oprice: (state) => state.goods_create.oprice, // 市場價格
      pprice: (state) => state.goods_create.pprice, // 銷售價格
      cprice: (state) => state.goods_create.cprice, // 成本價格
      weight: (state) => state.goods_create.weight, // 商品重量
      volume: (state) => state.goods_create.volume, // 商品體積
    }),},
  watch: {},
  methods: {
    ...mapMutations(['vModelState']),
    // 修改表單值
    vModel(key, value) {
      this.vModelState({ key, value })
    },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
  // vue3 拿掉 filters
  //filters: {
  //
  //},
}
</script>

<style scoped lang="scss">

  </style>
