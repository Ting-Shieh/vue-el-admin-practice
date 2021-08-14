<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px;">
    <!-- Tab -->
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
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
      placeholder="要搜索的訂單編號"
      @search="searchEvent"
      :showSearch="true"
    >
      <!-- Left (slot) -->
      <template #left>
        <!--  -->

        <button
          type="button"
          class="btn btn-warning mr-1"
          @click="exportModal = true"
        >
          導出數據
        </button>
        <button
          type="button"
          class="btn border mr-1"
          @click.prevent="deleteAll"
        >
          批量刪除
        </button>
      </template>

      <!-- Right (slot) -->
      <!-- 採用默認故不需要寫 <template #right></template> -->
      <template #form>
        <!-- 高級搜索表單 (slot)-->
        <el-form inline :model="form" ref="form" label-width="100px">
          <el-form-item class="mb-0" label="訂單編號">
            <el-input
              v-model="form.no"
              size="medium"
              placeholder="ex: 2021年xx產品"
            ></el-input
          ></el-form-item>

          <el-form-item class="mb-0" label="下單時間">
            <el-date-picker
              v-model="form.time"
              type="daterange"
              size="medium"
              class="ml-1"
              style="width:420px;"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item class="mb-0" label="收貨人">
            <el-input
              v-model="form.name"
              size="medium"
              placeholder="收貨人"
            ></el-input
          ></el-form-item>
          <el-form-item class="mb-0" label="手機號碼">
            <el-input
              v-model="form.phone"
              size="medium"
              placeholder="手機號碼"
            ></el-input
          ></el-form-item>
          <el-form-item class="mb-0" label="">
            <el-button
              class="btn btn-secondary mr-1"
              size="medium"
              style="width: 60px;"
              @click.prevent="searchEvent"
            >
              搜索
            </el-button>
            <el-button
              class="btn btn-outline-secondary"
              size="medium"
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
      <el-table-column label="商品" width="350" align="center">
        <!-- vue 3 新寫法 --><!-- {{scope.$index }}{{scope.row }} -->
        <template #default="scope">
          <div class="d-flex justify-content-around">
            <div class="" style="flex-1">
              <p class="mb-1">訂單編號</p>
              <p class="mb-1">
                <small class="">{{ scope.row.no }}</small>
              </p>
            </div>
            <div class="" style="flex-1"></div>
            <div class="" style="=flex-1">
              <p class="mb-1">下單時間:</p>
              <p class="mb-1">
                <small class="">{{ scope.row.create_time }}</small>
              </p>
            </div>
          </div>
          <div
            class="media align-items-center border-top py-2"
            v-for="(item, index) in scope.row.order_items"
            :key="index"
          >
            <img
              :src="item.goods_item.cover"
              style="width:64px;height:64px;"
              class="mr-3"
            />
            <div class="media-body ">
              <p class="mt-0">
                <a href="" class="text-primary"> {{ item.goods_item.title }}</a>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="實付款" prop="type" width="120" align="center">
        <template #default="scope">
          <span class="">NTD:{{ scope.row.total_price }}</span>
          <p class=""><small>(含運費: NTD:0)</small></p>
        </template>
      </el-table-column>
      <el-table-column
        label="買家"
        prop="sale_count"
        width="120"
        align="center"
      >
        <template #default="scope">
          <span class="">{{ scope.row.user.username }}</span>
          <p class="">
            <small>(userid:{{ scope.row.user.id }})</small>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" align="center" width="" prop="order">
        <template #default="scope">
          <span
            class="badge badge-success badge-lg"
            v-if="scope.row.payment_method === 'wechat'"
            >微信支付</span
          >
          <span
            class="badge badge-primary badge-lg"
            v-else-if="scope.row.payment_method === 'alipay'"
            >支付寶支付</span
          >
          <!-- <span class="badge badge-info badge-lg" v-if="scope.row.payment_method === ''">Line-Pay</span> -->
          <span class="badge badge-warning badge-lg" v-else>未支付</span>
        </template>
      </el-table-column>
      <el-table-column label="配送方式" align="center" width="">
        <!-- 黑貓宅急便 -->
        <template #default="scope">
          <div
            v-if="scope.row.ship_data"
            class="d-flex flex-column align-items-center"
          >
            <div class="">
              {{ scope.row.ship_data.express_company }}
            </div>
            <div class="">
              {{ scope.row.ship_data.express_no }}
            </div>
          </div>
          <div v-else>
            <span class="badge badge-warning badge-lg">未配送</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="交易狀態" width="170" align="center">
        <template #default="scope">
          <div class="d-flex flex-column align-items-center">
            <div class="d-flex">
              付款狀態:

              <span
                class="badge  badge-lg ml-1"
                :class="
                  scope.row.payment_method ? 'badge-success' : 'badge-warning'
                "
                >{{ scope.row.payment_method ? '已付款' : '未付款' }}</span
              >
            </div>
            <div class="d-flex">
              物流狀態:
              <span
                class="badge  badge-lg ml-1"
                :class="scope.row.ship_data ? 'badge-success' : 'badge-warning'"
                >{{ scope.row.ship_data ? '已發貨' : '未發貨' }}</span
              >
            </div>
            <div class="d-flex">
              收貨狀態:
              <span
                class="badge  badge-lg ml-1"
                :class="
                  scope.row.ship_status === 'received'
                    ? 'badge-success'
                    : 'badge-warning'
                "
                >{{
                  scope.row.ship_status === 'received' ? '已收貨' : '未收貨'
                }}</span
              >
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="id" label="操作" align="center" width="">
        <template #default="scope">
          <el-button type="text" size="medium">訂單詳情</el-button>
          <el-button
            v-if="
              scope.row.ship_status === 'pending' &&
                scope.row.closed === 0 &&
                scope.row.payment_method &&
                scope.row.refund_status === 'pending'
            "
            type="text"
            size="medium"
            @click.prevent="ship(scope.row)"
            >訂單發貨</el-button
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

    <!--  -->
    <el-dialog
      title="訂單發貨"
      v-model="shipModal"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="shipForm" label-width="100px" class="">
        <el-form-item label="快遞公司" prop="express_company">
          <el-select
            v-model="shipForm.express_company"
            placeholder="請選擇快遞公司"
          >
            <el-option
              v-for="(item, index) in express_company_options"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快遞單號" prop="express_no">
          <el-input type="text" v-model="shipForm.express_no"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shipModal = false">取消</el-button>
          <el-button type="primary" @click="shipSubmit">確定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 導出數據 -->
    <el-dialog
      title="導出數據"
      v-model="exportModal"
      width="40%"
      :before-close="handleClose"
    >
      <el-form :model="exportForm" label-width="100px" class="">
        <el-form-item label="訂單類型" prop="tab">
          <el-select v-model="exportForm.tab" placeholder="請選擇快遞公司">
            <el-option
              v-for="(item, index) in tabbars"
              :key="index"
              :label="item.name"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="時間範圍" prop="express_no">
          <el-date-picker
            v-model="exportForm.time"
            type="daterange"
            size="medium"
            class="ml-1"
            style="width:420px;"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
            value-format="YYYY-MM-DD"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="exportModal = false">取消</el-button>
          <el-button type="primary" @click="exportExcel">確定</el-button>
        </span>
      </template>
    </el-dialog>
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
      shipModal: false,
      preUrl: 'order',
      tabIndex: 0,
      tabbars: [
        { name: '全部', key: 'all' },
        { name: '待付款', key: 'nopay' },
        { name: '待發貨', key: 'noship' },
        { name: '待收貨', key: 'shiped' },
        { name: '已收貨', key: 'received' },
        { name: '已完成', key: 'finish' },
        { name: '已關閉', key: 'closed' },
        { name: '退款中', key: 'refunding' },
      ],
      form: {
        no: '',

        time: '',
        name: '',
        phone: '',
      },
      shipId: 0,
      shipForm: {
        express_no: '',
        express_company: '',
      },
      tableData: [],
      express_company_options: [],
      exportModal: false,
      exportForm: {
        tab: '',
        time: '',
      },
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
          if (Array.isArray(val)) {
            str += `&starttime=${val[0]}`
            str += `&endtime=${val[1]}`
          } else {
            str += `&${key}=${val}`
          }
        }
      }
      return str
    },
  },
  watch: {},
  methods: {
    getListResult(e) {
      // console.log(e.list)
      this.tableData = e.list
    },
    getListUrl() {
      return `/admin/${this.preUrl}/${this.page.currentPage}?limit=${this.page.pageSize}&tab=${this.tab}${this.params}`
    },

    // 加載數據
    handleClick(tab, event) {
      // console.log(tab, tab.index)
      this.getList()
    },
    // 搜索事件
    searchEvent(e = false) {
      // 簡單搜索
      if (typeof e === 'string') {
        // console.log('簡單搜索事件 待 API 串接 =>', e)
        this.form.no = e
        this.getList()
        return
      }
      // 高級搜索
      // console.log('高級搜索事件 待 API 串接')
      this.getList()
    },
    // 清空篩選條件
    clearSearch() {
      this.form = {
        no: '',
        time: '',
        name: '',
        phone: '',
      }

      console.log('$refs.buttonSearch =>', this.$refs)
      console.log(this.tabIndex)

      // this.$refs.buttonSearchRef.closeSuperSearch()
    },
    // 訂單發貨
    ship(item) {
      this.shipId = item.id
      this.shipModal = true
    },
    // 發貨提交
    shipSubmit() {
      this.layout.showLoading()
      this.$axios
        .post(`/admin/order/${this.shipId}/ship`, this.shipForm, {
          token: true,
        })
        .then((res) => {
          this.shipModal = false
          this.getList()
          this.$message({
            message: '發貨提交成功',
            type: 'success',
          })

          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 導出數據
    exportExcel() {
      if (!this.exportForm.tab) {
        return this.$message({
          message: '訂單類型不得為空!',
          type: 'error',
        })
      }
      let params = ''
      let val = this.exportForm.time
      if (val && Array.isArray(this.exportForm.time)) {
        params += `&starttime=${val[0]}`
        params += `&endtime=${val[1]}`
      }
      this.layout.showLoading()
      this.$axios
        .post(
          `/admin/${this.preUrl}/excelexport?tab=${this.exportForm.tab}${params}`,
          {},
          {
            token: true,
            responseType: 'blob', // 重要
          }
        )
        .then((res) => {
          if (res.status == 200) {
            let url = window.URL.createObjectURL(new Blob([res.data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            let filename = new Date().getTime() + '.xlsx'
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
          }
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
  },
  created() {
    this.$axios
      .get('/admin/express_company/1?limit=50', { token: true })
      .then((res) => {
        this.express_company_options = res.data.data.list
      })
      .catch((err) => {})
  },
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
