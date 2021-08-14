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
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <el-tab-pane label="基本設置">
        <base-create></base-create>
      </el-tab-pane>
      <el-tab-pane label="商品規格">
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
          <single-attrs></single-attrs>
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
                @click.prevent="addSkuCard"
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
                <el-button @click.prevent="closeUpdateAllStatus"
                  >取消</el-button
                >
              </div>
            </el-form-item>
            <el-form-item label="規格設置">
              <sku-table ref="table"></sku-table>
            </el-form-item>
          </el-form>
        </template>
      </el-tab-pane>
      <el-tab-pane label="商品屬性">
        <el-form ref="form" label-width="100px" class="">
          <el-form-item label="商品類型">
            <el-select
              v-model="goods_type_id"
              placeholder="請選擇商品類型"
              @change="vModel('goods_type_id', $event)"
            >
              <el-option label="111" value="val-1"></el-option>
              <el-option label="222" value="val-2"></el-option>
            </el-select>
          </el-form-item>
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>商品屬性</span>
              </div>
            </template>
            <el-form label-width="100px" class="">
              <el-form-item label="型號" inline>
                <input
                  type="text"
                  class="form-control "
                  placeholder="請輸入型號"
                  :value="goods_attrs.phone_model"
                  @input="
                    vModelGoodsAttrs({
                      key: 'phone_model',
                      value: $event.target.value,
                    })
                  "
                />
              </el-form-item>
            </el-form>
          </el-card>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="媒體設置">
        <el-form model="form" ref="form" label-width="100px" class="">
          <el-form-item label="商品大圖">
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
                <i
                  v-else
                  class="el-icon-plus text-muted"
                  style="font-size:30px"
                ></i>
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
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品詳情">
        <!-- tinymce editor -->
        <tiny-mce></tiny-mce>
      </el-tab-pane>
      <el-tab-pane label="折扣設置">
        <el-form label-width="100px" class="">
          <el-form-item label="會員價">
            <div class="input-group mb-3">
              <input
                type="text"
                class="form-control "
                style="width:150px;"
                placeholder="請輸入會員折扣"
                :value="discount"
                @input="vModel('discount', $event.target.value)"
              />
              <div class="input-group-append">
                <span class="input-group-text">%</span>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import BaseCreate from '@/components/shop/create/BaseCreate.vue'
import SingleAttrs from '@/components/shop/create/SingleAttrs.vue'
import SkuCard from '@/components/shop/create/sku/SkuCard.vue'
import SkuTable from '@/components/shop/create/SkuTable.vue'
import TinyMce from '@/components/common/TinyMce.vue'
export default {
  /**
   * 接收依賴注入
   * https://vue3js.cn/docs/zh/guide/component-provide-inject.html
   * */
  inject: ['app'],
  data() {
    return {
      tabIndex: 0,
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
  components: { BaseCreate, SingleAttrs, SkuCard, SkuTable, TinyMce },
  computed: {
    ...mapState({
      // test: (state) => state.goods_create.test,
      // 法1
      skus_type: (state) => state.goods_create.skus_type, // 0 單一規格 | 1 多規格
      sku_card: (state) => state.goods_create.sku_card, // 市場價格
      banners: (state) => state.goods_create.banners, // 市場價格
      goods_type_id: (state) => state.goods_create.goods_type_id,
      goods_attrs: (state) => state.goods_create.goods_attrs,
      discount: (state) => state.goods_create.discount, //折扣
    }),
    // sku_card 總長度
    skuCardTotal() {
      return this.sku_card.length
    },
  },
  watch: {},
  methods: {
    ...mapMutations(['vModelState', 'addSkuCard', 'vModelGoodsAttrs']),
    // 修改表單值
    vModel(key, value) {
      this.vModelState({ key, value })
    },
    // 加載數據
    handleClick(tab, event) {
      console.log(tab, tab.index)
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
  },
  created() {},
  mounted() {
    // console.log('mounted==>',this.$store.state.goods_create)
    // console.log('mounted==>', this.test)
    // this.vModel({
    //   key:'skus_type',
    //   value:0
    // })
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
