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
    <!-- 規格選項 -->
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">商品規格</label>

        <div class="form-check form-check-inline">
          <label class="form-check-label " for="1"
            ><input
              class="form-check-input "
              type="radio"
              name="skus_type"
              value="0"
              checked="true"
              @change="vModel('skus_type', parseInt($event.target.value))"
            />單規格</label
          >
          <label class="form-check-label ml-2 " for="1"
            ><input
              class="form-check-input "
              type="radio"
              name="skus_type"
              value="1"
              @change="vModel('skus_type', parseInt($event.target.value))"
            />多規格</label
          >
        </div>
      </div>
    </form>

    <!-- 單規格 -->
    <template v-if="skus_type === 0">
      <form>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">市場價格</label>
          <div class="col-sm-4 d-flex">
            <input
              type="number"
              class="form-control w-50 "
              placeholder=""
              v-model="sku_value.oprice"
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
              v-model="sku_value.pprice"
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
              v-model="sku_value.cprice"
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
              v-model="sku_value.weight"
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
              v-model="sku_value.volume"
            />
            <div class="input-group-append">
              <span class="input-group-text">立方公尺</span>
            </div>
          </div>
        </div>
      </form>
    </template>
    <!-- 多規格 -->
    <template v-else>
      <!-- 規格卡 -->

      <form>
        <div class="form-group ">
          <label class="col-form-label">添加規格</label>
          <!-- One 規格卡 -->
          <sku-card
            v-for="(card, idx) in sku_card"
            :key="idx"
            :card="card"
            :idx="idx"
            :total="skuCardTotal"
          ></sku-card>
          <button
            class="btn btn-success btn-sm mt-3"
            @click.prevent="addSkuCardEvent"
          >
            加入規格
          </button>
        </div>
      </form>

      <!--  -->
      <el-form label-width="100px" class="">
        <el-form-item label="批量設置">
          <template v-if="!updateAllStatus">
            <el-button
              type="text"
              v-for="(btn, idx) in updateList"
              :key="idx"
              @click.prevent="openUpdateAllStatus(btn)"
              >{{ btn.name }}</el-button
            >
          </template>

          <div v-else class="d-flex align-items-center">
            <el-input
              type="number"
              size="medium"
              class="mr-2"
              style="width:150px;"
              v-model="UpdateAllValue"
              :placeholder="UpdateAllPlaceholder"
            ></el-input>
            <el-button type="primary" @click.prevent="UpdateAllSubmit"
              >設置</el-button
            >
            <el-button @click.prevent="closeUpdateAllStatus">取消</el-button>
          </div>
        </el-form-item>
        <el-form-item label="規格設置">
          <sku-table ref="table"></sku-table>
        </el-form-item>
      </el-form>
    </template>
    <el-button
      type="primary"
      style="position: fixed; bottom: 50px; right: 50px"
      @click="submit"
      >提交</el-button
    >
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import SingleAttrs from '@/components/shop/create/SingleAttrs.vue'
import SkuCard from '@/components/shop/create/sku/SkuCard.vue'
import SkuTable from '@/components/shop/create/SkuTable.vue'

export default {
  /**
   * 接收依賴注入
   * https://vue3js.cn/docs/zh/guide/component-provide-inject.html
   * */
  inject: ['app', 'layout'],
  data() {
    return {
      id: 0,
      // <!-- 單規格 -->
      sku_type: 0,
      sku_value: {
        oprice: 0,
        pprice: 0,
        cprice: 0,
        weight: 0,
        volume: 0,
      },
      goodsSkus: [],

      updateAllStatus: false, //批量修改
      updateList: [
        { name: '銷售價', key: 'pprice' },
        { name: '市場價', key: 'oprice' },
        { name: '成本價', key: 'cprice' },
        { name: '庫存', key: 'stock' },
        { name: '體積', key: 'volume' },
        { name: '重量', key: 'weight' },
      ],
      UpdateAllPlaceholder: '', // 更新 placeholder
      UpdateAllValue: '',
    }
  },
  props: {
    prop: {
      type: String,
      required: false,
    },
  },
  components: { SkuCard, SkuTable },
  computed: {
    ...mapState({
      // test: (state) => state.goods_create.test,
      // 法1
      skus_type: (state) => state.goods_create.skus_type, // 0 單一規格 | 1 多規格
      sku_card: (state) => state.goods_create.sku_card, // 市場價格
    }),
    // sku_card 總長度
    skuCardTotal() {
      return this.sku_card.length
    },
  },
  watch: {},
  methods: {
    ...mapMutations(['vModelState', 'addSkuCard', 'vModelGoodsAttrs']),
    addSkuCardEvent() {
      this.layout.showLoading()
      this.$axios
        .post(
          '/admin/goods_skus_card',
          {
            goods_id: this.id,
            name: '規格名稱',
            order: 50,
            type: 0,
          },
          { token: true }
        )
        .then((res) => {
          console.log(res)
          let data = res.data.data
          data.list = []
          this.addSkuCard(data)
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // // 修改表單值
    vModel(key, value) {
      this.vModelState({ key, value })
    },

    // 修改批量設置狀態
    openUpdateAllStatus(btn) {
      this.updateAllStatus = btn.key
      this.UpdateAllPlaceholder = btn.name
    },
    // 點擊取消批量設置狀態
    closeUpdateAllStatus() {
      this.updateAllStatus = false
      this.UpdateAllValue = ''
    },
    // 提交批量設置
    UpdateAllSubmit() {
      // console.log(this.$refs.table.list)
      this.$refs.table.list.forEach((item) => {
        item[this.updateAllStatus] = this.UpdateAllValue
      })

      this.closeUpdateAllStatus()
    },
    // 提交
    submit() {
      // 拿到結點
      let list = []
      if (this.$refs.table) {
        list = this.$refs.table.list.map((item) => {
          item.goods_id = this.id // 單獨賦值
          return item
        })
      }

      this.layout.showLoading()
      this.$axios
        .post(
          `/admin/goods/updateskus/${this.id}`,
          {
            sku_type: this.sku_type,
            sku_value: this.sku_value,
            goodsSkus: list,
          },
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
    if (this.id) {
      // 修改
      // 獲取之前商品詳情
      this.layout.showLoading()
      let defaultVal = ['屬性值', '#fff', '/favicon.ico']
      this.$axios
        .get(`/admin/goods/read/${this.id}`, { token: true })
        .then((res) => {
          let data = res.data.data
          this.vModel(
            'sku_card',
            data.goodsSkusCard.map((item) => {
              item.list = item.goodsSkusCardValue
              item.list.map((v) => {
                v.text = item.type === 0 ? v.value : defaultVal[0]
                v.color = item.type === 1 ? v.value : defaultVal[1]
                v.image = item.type === 2 ? v.value : defaultVal[2]
                return v
              })
              return item
            })
          )

          this.vModel('skus_type', data.sku_type)
          this.sku_value = data.sku_value
            ? data.sku_value
            : {
                oprice: 0,
                pprice: 0,
                cprice: 0,
                weight: 0,
                volume: 0,
              }

          this.$nextTick(() => {
            if (this.$refs.table) {
              this.$refs.table.list = data.goodsSkus
            }
          })

          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    } else {
      //發佈
      this.layout.showLoading()
      this.$axios
        .get('/admin/goods/create', { token: true })
        .then((res) => {
          this.cates = res.data.data.cates
          this.express = res.data.data.express.list
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    }
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
