<template>
  <table class="table table-sm table-bordered">
    <thead>
      <tr>
        <th
          scope="col"
          class="text-center"
          style="vertical-align: middle;"
          v-for="(th, thidx) in tableThs"
          :key="thidx"
          :rowspan="th.rowspan"
          :colspan="th.colspan"
        >
          {{ th.name }}
        </th>
      </tr>
      <tr>
        <th
          scope="col"
          class="text-center"
          style="vertical-align: middle;"
          v-for="(card, cidx) in skuLabels"
          :key="cidx"
          rowspan="1"
          colspan="1"
        >
          {{ card.name }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, tidx) in list" :key="tidx">
        <!-- 商品規格 -->
        <th
          class="text-center"
          scope="row"
          v-for="(sku, skuidx) in item.skus"
          :key="skuidx"
        >
          {{ sku.value }}
        </th>
        <td class="text-center" width="100">
          <span
            v-if="!item.image"
            class="btn btn-light border "
            @click.prevent="chooseImage(item)"
            ><i class="el-icon-plus"></i
          ></span>
          <img
            v-else
            :src="item.image"
            class="rounded"
            style="width:45px;height:45px; cursor: pointer;"
            @click.prevent="chooseImage(item)"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.pprice"
            class="form-control text-center"
          />
        </td>

        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.oprice"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.cprice"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.stock"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="100">
          <input
            type="number"
            v-model="item.volume"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="110">
          <input
            type="number"
            v-model="item.weight"
            class="form-control text-center"
          />
        </td>
        <td class="text-center" width="110">
          <input
            type="text"
            v-model="item.code"
            class="form-control text-center"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  /**
   * 接收依賴注入
   * https://vue3js.cn/docs/zh/guide/component-provide-inject.html
   * */
  inject: ['app'],
  data() {
    return {
      list: [],
    }
  },
  props: {
    prop: {
      type: String,
      required: false,
    },
  },
  components: {},
  computed: {
    ...mapGetters(['tableThs', 'tableData', 'skuLabels']),
    // 分模塊後的寫法
    ...mapState({
      sku_card: (state) => state.goods_create.sku_card,
    }),
  },
  watch: {
    tableData(newVal, oldVal) {
      this.list = this.tableData
    },
  },
  methods: {
    //選擇圖片
    chooseImage(item) {
      // console.log('this.app ===>', item)

      this.app.chooseImage((res) => {
        console.log('image==>', res[0].url)
        item.image=  res[0].url     
      }, 1)
    },
  },
  created() {},
  mounted() {
    // console.log(this.tableData)
    this.list = this.tableData
  },
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang=""></style>
