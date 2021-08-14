<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px;">
    <!-- Tab -->
    <el-tabs v-model="tabIndex" @tab-click="getList">
      <el-tab-pane
        v-for="(tab, tabIdx) in tabbars"
        :key="tabIdx"
        :label="tab.name"
      >
      </el-tab-pane>
    </el-tabs>

    <!-- component -->
    <button-search
      ref="buttonSearchRef"
      placeholder="要搜索的商品名稱"
      @search="searchEvent"
      :showSearch="true"
    >
      <!-- Left (slot) -->
      <template #left>
        <!--  -->
        <router-link class="mr-2" :to="{ name: 'shop_goods_create' }">
          <button type="button" class="btn btn-primary mr-1">發布商品</button>
        </router-link>

        <button
          v-if="tab === 'delete'"
          type="button"
          class="btn btn-warning mr-1"
          @click.prevent="doEvent('restore')"
        >
          恢復商品
        </button>
        <button
          v-if="tab === 'delete'"
          type="button"
          class="btn btn-warning mr-1"
          @click.prevent="doEvent('destroy')"
        >
          徹底刪除
        </button>
        <button
          v-if="tab !== 'delete'"
          type="button"
          class="btn btn-secondary mr-1"
          @click.prevent="deleteAll"
        >
          批量刪除
        </button>
        <button
          v-if="tab === 'all' || tab === 'off'"
          type="button"
          class="btn border mr-1"
          @click.prevent="changeStatus(1)"
        >
          上架
        </button>
        <button
          v-if="tab === 'all' || tab === 'saling'"
          type="button"
          class="btn border mr-1"
          @click.prevent="changeStatus(0)"
        >
          下架
        </button>
      </template>

      <!-- Right (slot) -->
      <!-- 採用默認故不需要寫 <template #right></template> -->
      <template #form>
        <!-- 高級搜索表單 (slot)-->
        <el-form inline :model="form" ref="form" label-width="100px">
          <el-form-item class="mb-0" label="商品名稱">
            <el-input
              v-model="form.title"
              size="medium"
              placeholder="ex: 2021年xx產品"
            ></el-input
          ></el-form-item>

          <el-form-item class="mb-0" label="商品分類">
            <el-select v-model="form.categor_id" placeholder="請選擇商品分類">
              <el-option
                v-for="(cate, index) in cateList"
                :key="index"
                :label="cate.name"
                :value="cate.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="mb-0">
            <el-button
              class="btn btn-secondary mr-1"
              style="width: 60px;"
              @click.prevent="searchEvent"
            >
              搜索
            </el-button>
            <el-button
              class="btn btn-outline-secondary"
              style="width: 150px;"
              @click.prevent="clearSearch"
            >
              清空篩選條件
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </button-search>
    <el-table
      class="mt-3"
      border
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45" align="center">
      </el-table-column>
      <el-table-column label="商品" width="450" align="center">
        <!-- vue 3 新寫法 --><!-- {{scope.$index }}{{scope.row }} -->
        <template #default="scope">
          <div class="media align-items-center">
            <img
              :src="scope.row.cover"
              style="width:64px;height:64px;"
              class="mr-3"
            />
            <div class="media-body ">
              <h6 class="mt-0">{{ scope.row.title }}</h6>
              <p class="mb-0">分類: {{ scope.row.category.name }}</p>
              <p class="mb-0">創立時間: {{ scope.row.create_time }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="sale_count"
        label="實際銷售量"
        width="80px"
        align="center"
      >
      </el-table-column>
      <el-table-column label="商品排序" align="center" width="" prop="order">
      </el-table-column>
      <el-table-column prop="status" label="商品狀態" align="center" width="">
        <template #default="scope">
          <span
            class="badge"
            :class="scope.row.status ? 'badge-success' : 'badge-danger'"
            >{{ scope.row.status ? '上架' : '倉庫中' }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="status" label="審核狀態" align="center" width="">
        <template #default="scope">
          <div
            v-if="!scope.row.ischeck"
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <button
              class="btn btn-success"
              @click.prevent="checkGoods(scope.row, 1)"
            >
              審核通過
            </button>
            <el-button
              class="btn btn-danger mt-1"
              @click.prevent="checkGoods(scope.row, 2)"
            >
              審核拒絕
            </el-button>
          </div>
          <span v-else>{{ scope.row.ischeck === 1 ? '通過' : '拒絕' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="總庫存量" width="" align="center">
      </el-table-column>
      <el-table-column prop="pprice" label="價格(NTD)" width="" align="center">
        <template #default="scope">
          <span class="text-danger">$ {{ scope.row.min_price }}</span>
          <span> / </span>
          <span class="text-danger">$ {{ scope.row.min_oprice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" align="center" width="">
        <template #default="scope">
          <el-button
            type="text"
            size="mini"
            @click.prevent="navigate('shop_goods_create', scope.row.id)"
            >基礎設定</el-button
          >
          <el-button
            type="text"
            size="mini"
            :class="
              (scope.row.sku_type === 0 && !scope.row.sku_value) ||
              (scope.row.sku_type === 1 && !scope.row.goods_skus.length)
                ? 'text-danger'
                : ''
            "
            @click.prevent="navigate('shop_goods_sku', scope.row.id)"
            >商品規格</el-button
          >
          <el-button
            type="text"
            size="mini"
            :class="scope.row.goods_attrs.length === 0 ? 'text-danger' : ''"
            @click.prevent="navigate('shop_goods_attr', scope.row.id)"
            >商品屬性</el-button
          >
          <el-button
            type="text"
            size="mini"
            :class="scope.row.goods_banner.length === 0 ? 'text-danger' : ''"
            @click.prevent="navigate('shop_goods_banner', scope.row.id)"
            >媒體設定</el-button
          >
          <el-button
            type="text"
            :class="!scope.row.content ? 'text-danger' : ''"
            size="mini"
            @click.prevent="navigate('shop_goods_content', scope.row.id)"
            >商品詳情</el-button
          >
          <el-button type="text" size="mini">折扣設定</el-button>
          <el-button type="text" size="mini" @click="deleteItem(scope.row)"
            >刪除商品</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 佔位 -->
    <div class="" style="height: 65px"></div>
    <!-- 分頁 -->
    <el-footer
      class="border-top d-flex align-items-center px-0 bg-white position-fixed"
      style="bottom: 0px;right:0px; left:300px;z-index: 100;"
    >
      <div class="px-2" style="flex:1;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page.currentPage"
          :page-sizes="page.pageSizes"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        >
        </el-pagination>
      </div>
    </el-footer>
  </div>
</template>

<script>
import ButtonSearch from '@/components/common/ButtonSearch.vue'
import common from '@/common/mixins/common.js'
export default {
  inject: ['layout'],
  mixins: [common],
  data() {
    return {
      preUrl: 'goods',
      tabIndex: 0,

      tabbars: [
        { name: '全部', key: 'all' },
        { name: '審核中', key: 'checking' },
        { name: '出售中', key: 'saling' },
        { name: '已下架', key: 'off' },
        { name: '庫存預警', key: 'min_stock' },
        { name: '回收站', key: 'delete' },
      ],
      form: {
        title: '',

        category_id: '',
      },
      cateList: [],
      tableData: [],
    }
  },
  components: {
    ButtonSearch,
  },
  computed: {
    tab() {
      return this.tabbars[this.tabIndex].key
    },
    params() {
      let str = ''
      for (let key in this.form) {
        let val = this.form[key]
        if (val) {
          str += `&${key}=${val}`
        }
      }
      return str
    },
  },
  watch: {},
  methods: {
    getListUrl() {
      return `/admin/${this.preUrl}/${this.page.currentPage}?limit=${this.page.pageSizes}&tab=${this.tab}`
    },

    getListResult(e) {
      this.tableData = e.list
      this.cateList = e.cates
    },

    // 搜索事件
    searchEvent(e = false) {
      // 簡單搜索
      if (typeof e === 'string') {
        // return console.log('簡單搜索事件 待 API 串接 =>', e)
        this.form.title = e
      }
      // 高級搜索
      console.log('高級搜索事件 待 API 串接')
      this.getList()
    },
    // 清空篩選條件
    clearSearch() {
      this.form = {
        title: '',

        category_id: '',
      }
    },

    // 批量恢复商品
    doEvent(type) {
      if (this.ids.length === 0) {
        return this.$message({
          message: '請選擇商品',
          type: 'error',
        })
      }
      this.layout.hideLoading()
      this.$axios
        .post(`/admin/goods/${type}`, { ids: this.ids }, { token: true })
        .then((res) => {
          this.$message({
            message: '批量恢复成功',
            type: 'success',
          })
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 上下架
    changeStatus(status) {
      if (this.ids.length === 0) {
        return this.$message({
          message: '請選擇商品',
          type: 'error',
        })
      }
      this.layout.hideLoading()
      this.$axios
        .post(
          '/admin/goods/changestatus',
          { ids: this.ids, status },
          { token: true }
        )
        .then((res) => {
          this.$message({
            message: '上下架成功',
            type: 'success',
          })
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },

    // 商品詳情
    navigate(name, id) {
      this.$router.push({ name, params: { id } })
    },
    // 審核通過與否
    checkGoods(item, ischeck) {
      this.layout.showLoading()
      this.$axios
        .post(`/admin/goods/${item.id}/check`, { ischeck }, { token: true })
        .then((res) => {
          this.getList()
          this.$message({
            message: '更改審核成功',
            type: 'success',
          })
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
  filters: {},
}
</script>

<style scoped lang="css">
.this {
  border: 1px solid red;
}
.el-tabs__item {
  font-size: 24px;
}
</style>
