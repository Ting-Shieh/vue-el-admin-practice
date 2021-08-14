<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px;">
    <!-- component -->
    <button-search class="pt-3" :showSearch="false">
      <!-- Left (slot) -->
      <template #left>
        <!--  -->
        <button
          type="button"
          class="btn border mr-1 btn btn-success"
          @click.prevent="openModel(false)"
        >
          添加規格
        </button>
        <button
          type="button"
          class="btn border mr-1 btn btn-danger"
          @click.prevent="deleteAll"
        >
          批量刪除
        </button>
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
      <el-table-column label="規格名稱" prop="name" width="200" align="center">
      </el-table-column>
      <el-table-column label="規格值" prop="default" width="380" align="center">
      </el-table-column>
      <el-table-column label="排序" prop="order" width="" align="center">
      </el-table-column>
      <el-table-column label="狀態" prop="status" align="center" width="">
        <template #default="scope">
          <div
            class="d-flex flex-column align-items-center justify-content-center"
          >
            <el-button
              :type="scope.row.status ? 'success' : 'danger'"
              @click.prevent="changeStatus(scope.row)"
            >
              {{ scope.row.status ? '啟用' : '禁用' }}
            </el-button>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="">
        <template #default="scope">
          <el-button-group>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="medium"
              plain
              @click.prevent="openModel(scope)"
              >編輯</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="medium"
              plain
              @click.prevent="deleteItem(scope.row)"
              >刪除</el-button
            >
          </el-button-group>
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
    <el-dialog
      :title="editIndex > -1 ? '修改規格' : '添加規格'"
      v-model="createModel"
      top="5vh"
    >
      <!-- 表單內容 -->
      <el-form ref="ruleForm" :model="form" :rules="validateRules">
        <el-form-item label="規格名稱" label-width="" prop="name">
          <el-input
            v-model="form.name"
            placeholder="規格名稱"
            size="mini"
            style="width:25%;"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="">
          <el-input-number
            v-model="form.order"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>

        <el-form-item label="規格狀態" label-width="">
          <el-radio-group v-model.number="form.stauts" class="mt-1">
            <el-radio :label="1" border size="mini">啟用</el-radio>
            <el-radio :label="0" border size="mini">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="規格類型" label-width="">
          <el-radio-group v-model.number="form.type" class="mt-1">
            <el-radio :label="0" border size="mini">顏色</el-radio>
            <el-radio :label="1" border size="mini">文字</el-radio>
            <el-radio :label="2" border size="mini">圖片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="規格值" label-width="" prop="default">
          <el-input
            type="textarea"
            :row="3"
            v-model="form.default"
            placeholder="一行為一個規格項，多個規格用換行輸入"
          ></el-input>
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
  inject: ['layout'],
  mixins: [common],
  data() {
    return {
      /**
       * 移到mixins統一管理
       */
      // multipleSelection: [],
      // page: {
      //   currentPage: 1,
      //   pageSizes: [10, 20, 50, 100],
      //   pageSize: 10,
      //   total: 0,
      // },
      tableData: [],

      //
      preUrl: 'skus',
      createModel: false,
      editIndex: -1,
      form: {
        name: '',
        order: 50,
        status: 1,
        type: 0,
        default: '',
      },
      // Form 驗證
      validateRules: {
        name: [
          { required: true, message: '規格名稱不能為空', trigger: 'blur' },
        ],
        default: [
          { required: true, message: '規格值不能為空', trigger: 'blur' },
        ],
      },
    }
  },
  components: {
    ButtonSearch,
  },
  computed: {
    /**
     * 移到mixins統一管理
     * => 選中 id 數組
     *     ids()
     */
  },
  watch: {},
  methods: {
    /**
     * 移到mixins統一管理
     * => 初始化 : getList()
     * => 多選 : handleSelectionChange(val)
     * => 批量刪除 :　deleteAll()
     * => 修改狀態 : changeStatus(item)
     * => 刪除當前商品 : deleteItem(item)
     * => 每頁?條 : handleSizeChange(val)
     * => 當前頁 : handleCurrentChange(val)
     */
    
    /** 重寫 mixins 方法 */
    getListResult(e) {
      this.tableData = e.list
    },
    /** 重寫 mixins 方法 */
    getListUrl() {
      return `/admin/${this.preUrl}/${this.page.currentPage}?limit=${this.page.pageSize}`
    },

    // 打開 Dialog
    openModel(e = false) {
      if (!e) {
        // init form
        this.form = {
          name: '',
          order: 50,
          status: 1,
          type: 0,
          default: '',
        }
        this.editIndex = -1
      } else {
        // 修改
        this.form = {
          name: e.row.name,
          order: e.row.order,
          status: e.row.status,
          type: e.row.type,
          default: e.row.default.replace(',', /\n/g),
        }
        this.editIndex = e.$index
      }

      this.createModel = true //打開
    },

    // 提交
    submit(e) {
      this.$refs.ruleForm.validate((e) => {
        if (e) {
          this.form.default = this.form.default.replace('\n', ',')
          let id = 0
          if (this.editIndex !== -1) {
            // 提交表單(修改)
            id = this.tableData[this.editIndex].id
          }
          this.addOrEdit(this.form, id)
          this.createModel = false
        }
      })
    },
  },
  created() {
    this.getList()
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
