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
    <el-form ref="form" label-width="100px" class="">
      <el-form-item label="商品類型">
        <el-select
          v-model="goods_type_id"
          placeholder="請選擇商品類型"
          @change="change"
        >
          <el-option
            v-for="type in typeOptions"
            :key="type.id"
            :label="type.name"
            :value="type.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>商品屬性</span>
          </div>
        </template>
        <el-form label-width="100px" class="">
          <el-form-item
            :label="item.name"
            inline
            v-for="(item, index) in goods_type_values"
            :key="index"
          >
            <el-input
              v-if="item.type === 'input'"
              type=""
              v-model="item.value"
            ></el-input>
            <el-radio-group
              v-else-if="item.type === 'radio'"
              v-model="item.value"
            >
              <el-radio
                v-for="(radio, index) in item.default"
                :key="index"
                :label="radio"
                >{{ radio }}</el-radio
              >
            </el-radio-group>
            <el-checkbox-group
              v-else-if="item.type === 'checkbox'"
              v-model="item.value"
            >
              <el-checkbox
                v-for="(checkbox, index) in item.default"
                :key="index"
                :label="checkbox"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-card>
      <el-button
        type="primary"
        style="position: fixed; bottom: 50px; right: 50px"
        @click="submit"
        >提交</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  /**
   * 接收依賴注入
   * https://vue3js.cn/docs/zh/guide/component-provide-inject.html
   * */
  inject: ["app", "layout"],
  data() {
    return {
      id: 0,
      goods_type_id: "",
      typeOptions: [],
      goods_type_values: []
    };
  },

  computed: {},
  watch: {},
  methods: {
    //
    change(id) {
      let index = this.typeOptions.findIndex(item => item.id === id);
      if (index === -1) {
        return (this.goods_type_values = []);
      }
      let options = this.typeOptions[index].goods_type_values;
      // 組織格式
      this.goods_type_values = options.map(item => {
        let def = [];
        if (item.type !== "input") {
          def = item.default ? item.default.split(",") : [];
        }

        return {
          goods_id: this.id,
          value: "",
          name: item.name,

          type: item.type,
          default: def
        };
      });
    },
    // 提交
    submit() {
      this.layout.showLoading();
      this.$axios
        .post(
          `/admin/goods/attrs/${this.id}`,
          {
            goods_attrs: this.goods_type_values.map(item => {
              
              if (item.type !== "input") {
                item.default = item.default.join(',')
              }
              return item
            })
          },
          { token: true }
        )
        .then(res => {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.$router.push({
            name: "shop_goods_list"
          });
          this.layout.hideLoading();
        })
        .catch(err => {
          this.layout.hideLoading();
        });
    }
  },
  created() {
    this.id = this.$route.params.id;
    if (!this.id) {
      this.$message({
        message: "非法參數",
        type: "error"
      });
      return this.$router.push({
        name: "shop_goods_list"
      });
    }
    // 獲取之前商品詳情
    this.layout.showLoading();
    this.$axios
      .get(`/admin/goods/read/${this.id}`, { token: true })
      .then(res => {
        this.typeOptions = res.data.data.types;
        this.goods_type_values = res.data.data.goodsAttrs.map(item=>{
          item.default = item.type !== 'input'? item.default.split(','):[]
          return item
        })
        this.layout.hideLoading();
      })
      .catch(err => {
        this.layout.hideLoading();
      });
  },
  updated() {},
  unmounted() {}
};
</script>

<style scoped lang="scss">
.goods_creat .el-form-item {
  margin-bottom: 15px;
}
</style>
