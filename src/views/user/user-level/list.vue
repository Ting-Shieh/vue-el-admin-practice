<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px;">
    <!-- component -->
    <button-search
      class="pt-3"
      ref="buttonSearchRef"
      :showSearch="true"
      :superSearch="false"
    >
      <!-- Left (slot) -->
      <template #left>
        <!--  -->
        <button
          type="button"
          class="btn border mr-1 btn btn-success"
          @click.prevent="openModel(false)"
        >
          新增會員等級
        </button>
      </template>

      <template #right>
        <div class="">
          <small class="mr-2">選擇升級標準: </small>

          <el-radio-group v-model.number="level" size="mini">
            <el-radio-button :label="0">累積消費</el-radio-button>
            <el-radio-button :label="1">累積次數</el-radio-button>
          </el-radio-group>
        </div>
      </template>
    </button-search>
    <el-table class="mt-3" border :data="tableData" style="width: 100%">
      <el-table-column label="等級名稱" prop="name" width="300" align="center">
      </el-table-column>

      <el-table-column label="升級條件" width="120" align="center">
        <template #default="scope">
          {{ getLevel.name + ":" + scope.row.[getLevel.value]}}
        </template>
      </el-table-column>

      <el-table-column
        label="折扣率(%)"
        prop="discount"
        width="300"
        align="center"
      >
      </el-table-column>

      <el-table-column label="等級序號" prop="level" width="120" align="center">
      </el-table-column>
      <el-table-column label="狀態" prop="status" align="center" width="100">
        <template #default="scope">
          <el-button
            :type="scope.row.status ? 'success' : 'danger'"
            @click.prevent="changeStatus(scope.row)"
          >
            {{ scope.row.status ? '啟用' : '禁用' }}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="">
        <template #default="scope">
          <el-button
            type="text"
            size="mini"
            plain
            @click.prevent="openModel(scope)"
            >修改</el-button
          >

          <el-button
            type="text"
            size="mini"
            plain
            @click.prevent="deleteItem(scope.row)"
            >刪除</el-button
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

    <!-- 新增|修改 dialog -->
    <el-dialog title="添加會員等級" v-model="createModel" top="5vh">
      <!-- 表單內容 -->
      <el-form :model="form">
        <el-form-item label="會員等級名稱" label-width="">
          <el-input
            v-model="form.name"
            size="mini"
            style="width:25%;"
          ></el-input>
          <small class="d-block text-swcondary">設置會員等級</small>
        </el-form-item>
        <el-form-item label="等級權重" label-width="">
          <el-input v-model="form.level"></el-input>
          <small class="d-block text-swcondary"
            >設置會員等級排序(此參數決定等級高低，排序越大等級越高，請謹慎選擇)</small
          >
        </el-form-item>
        <el-form-item label="是否啟用" label-width="">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio :label="1" border>啟用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="升級條件" label-width="">
          <div class="d-flex align-items-center">
            <small class="mr-2">累計消費滿: </small>
            <el-input
              v-model="form.max_price"
              type="number"
              size="mini"
              style="width:25%;"
              ><template #append>NTD</template></el-input
            >
            <small class="ml-2 text-swcondary">累計消費續大於0，單位 NTD</small>
          </div>
          <div class="d-flex align-items-center">
            <small class="mr-2">累計次數滿: </small>
            <el-input
              v-model="form.max_times"
              type="number"
              size="mini"
              style="width:25%;"
              ><template #append>次</template></el-input
            >
            <small class="ml-2 text-swcondary"
              >累計購買次數續大於0，單位 次</small
            >
          </div>
        </el-form-item>

        <el-form-item label="折扣率(%)" label-width="">
          <div class="d-flex align-items-center">
            <el-input
              type="number"
              size="mini"
              v-model="form.discount"
              placeholder="請輸入折扣率(%)"
              style="width:25%;"
              ><template #append>%</template></el-input
            >
            <small class="d-block text-swcondary ml-2"
              >Ex.輸入90，表示90%折扣率，單位 %</small
            >
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createModel = false">取消</el-button>
          <el-button type="primary" @click="submit">確定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ButtonSearch from '@/components/common/ButtonSearch.vue'
import common from '@/common/mixins/common.js'
export default {
  inject: ['app', 'layout'],
  mixins: [common],
  data() {
    return {
      preUrl: 'user_level',
      level: 0, //升級標準
      tableData: [],

      createModel: false,
      editIndex: -1,
      search: {
        keyword: '',
        group_id: 0,
        time: '',
      },
      form: {
        name: '',
        max_price: 0, //累積消費
        max_times: 0, //累積消費次數
        discount: 0,
        level: 0, // 等級序號
        status: 1, //啟用
      },
    }
  },
  components: {
    ButtonSearch,
  },
  computed: {
    getLevel() {
      let arr = [
        {
          name: '累計消費',
          value: 'max_price',
        },
        {
          name: '累計次數',
          value: 'max_times',
        },
      ]

      return arr[this.level]
    },
  },
  watch: {},
  methods: {
    getListResult(e) {
      this.tableData = e.list
    },
    //選擇頭像
    chooseImage() {
      // console.log('this.app ===>', this.app)
      this.app.chooseImage((res) => {
        this.form.avatar = res[0].url
      }, 1)
    },
    // 打開 Dialog
    openModel(e = false) {
      if (!e) {
        // init form
        this.form = {
          name: '',
          max_price: 0, //累積消費
          max_times: 0, //累積消費次數
          discount: 0,
          level: 0, // 等級序號
          status: 1, //啟用
        }
        this.editIndex = -1
      } else {
        // 修改
        this.form = {
          name: e.row.name,
          max_price: e.row.max_price, //累積消費
          max_times: e.row.max_times, //累積消費次數
          discount: e.row.discount,
          level: e.row.level, // 等級序號
          status: e.row.status, //啟用
        }
        this.editIndex = e.$index
      }

      this.createModel = true //打開
    },

    // 提交
    submit() {
      let id = 0
      if (this.editIndex !== -1) {
        // 修改
        id = this.tableData[this.editIndex].id
      }
      this.createModel = false
      this.addOrEdit(this.form, id)
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
