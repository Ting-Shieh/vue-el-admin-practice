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
    <!-- 基礎設置 -->
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">商品名稱</label>
        <div class="col-sm-6">
          <input
            type="text"
            class="form-control w-50"
            placeholder="請輸入商品名稱，不能超過30個字"
            v-model="form.title"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">封面</label>
        <div class="col-sm-8">
          <div class="">
            <span
              v-if="!form.cover"
              class="btn btn-light border "
              @click.prevent="chooseImage"
              ><i class="el-icon-plus"></i
            ></span>
            <img
              v-else
              :src="form.cover"
              class="rounded"
              style="width:45px;height:45px; cursor: pointer;"
              @click="chooseImage"
            />
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">商品分類</label>
        <div class="col-sm-8">
          <el-select v-model="form.category_id" placeholder="請選擇商品分類">
            <el-option
              v-for="(item, index) in cates"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">商品描述</label>
        <div class="col-sm-6">
          <textarea
            type="text"
            class="form-control w-80"
            placeholder="(選填)，商品賣點簡述，EX:此款商品性能極強..."
            v-model="form.desc"
          ></textarea>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">商品單位</label>
        <div class="col-sm-6">
          <input
            type="text"
            class="form-control w-50"
            placeholder="請輸入商品單位"
            v-model="form.unit"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">總庫存</label>
        <div class="col-sm-6 d-flex">
          <input
            type="number"
            min="0"
            class="form-control w-50"
            placeholder="請輸入"
            v-model="form.stock"
          />
          <div class="input-group-append">
            <span class="input-group-text" id="basic-addon2">件</span>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">庫存預警</label>
        <div class="col-sm-6 d-flex">
          <input
            type="number"
            min="0"
            class="form-control w-50 "
            placeholder=""
            v-model="form.min_stock"
          />
          <div class="input-group-append">
            <span class="input-group-text" id="basic-addon2">件</span>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">最低銷售價</label>
        <div class="col-sm-6 d-flex">
          <input
            type="number"
            min="0"
            class="form-control w-50 "
            placeholder=""
            v-model="form.min_price"
          />
          <div class="input-group-append">
            <span class="input-group-text" id="basic-addon2">元</span>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">最低原價</label>
        <div class="col-sm-6 d-flex">
          <input
            type="number"
            min="0"
            class="form-control w-50 "
            placeholder=""
            v-model="form.min_oprice"
          />
          <div class="input-group-append">
            <span class="input-group-text" id="basic-addon2">元</span>
          </div>
        </div>
      </div>

      <div class="form-group row">
        <label class="col-sm-2 col-form-label">庫存顯示</label>
        <div class="col-sm-8 mt-1">
          <div class="form-check form-check-inline">
            <el-radio-group v-model="form.stock_display" size="mini">
              <el-radio-button :label="1" border>是</el-radio-button>
              <el-radio-button :label="0" border>否</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">是否上架</label>
        <div class="col-sm-8 mt-1">
          <div class="form-check form-check-inline">
            <el-radio-group v-model="form.status" size="mini">
              <el-radio :label="1" border>上架</el-radio>
              <el-radio :label="0" border>下架</el-radio>
            </el-radio-group>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">運費模板</label>
        <div class="col-sm-6 d-flex">
          <el-select v-model="form.express_id" placeholder="請選擇運費模板">
            <el-option
              v-for="(item, index) in express"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
      </div>
    </form>
    <el-button
      type="primary"
      style="position: fixed; bottom: 50px; right: 50px"
      @click="submit"
      >提交</el-button
    >
  </div>
</template>

<script>
export default {
  /**
   * 接收依賴注入
   * https://vue3js.cn/docs/zh/guide/component-provide-inject.html
   * */
  inject: ['app', 'layout'],
  data() {
    return {
     


      id: 0,
      form: {
        title: '', //	商品名称
        category_id: '', //	商品分类
        cover: '', //	商品封面
        desc: '', //商品描述
        unit: '', //	商品单位
        stock: '', //	总库存
        min_stock: '', //	库存预警
        ischeck: 0, //是否审核 0待处理 1通过 2拒绝
        status: 0, //是否上架 0仓库1上架
        stock_display: 0, //	库存显示 0隐藏1禁用
        express_id: '', //运费模板
        min_price: '', //	最低销售价
        min_oprice: '', //	最低原价
      },
      cates: [],
      express: [],
    }
  },

  computed: {},
  watch: {},
  methods: {
    //選擇頭像
    chooseImage() {
      // console.log('this.app ===>', this.app)
      this.app.chooseImage((res) => {
        this.form.cover = res[0].url
      }, 1)
    },
    // 提交
    submit() {
      let url = this.id ? `/admin/goods/${this.id}` : '/admin/goods'
      this.layout.showLoading()
      this.$axios
        .post(url, this.form, { token: true })
        .then((res) => {
          this.$message({
            message: this.id ? '修改成功' : '發佈成功',
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
      this.$axios
        .get(`/admin/goods/read/${this.id}`, { token: true })
        .then((res) => {
          let data = res.data.data
          this.form = data
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    } else {
      //發佈
      this.layout.showLoading()
      this.$axios
        .get('/admin/goods/create/', { token: true })
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
