<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px">
    <!-- component -->
    <button-search class="pt-3" :showSearch="false">
      <!-- Left (slot) -->
      <template #left>
        <!--  -->
        <button
          type="button"
          class="btn border mr-1 btn btn-success"
          @click="openModel(false)"
        >
          添加類型
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
      <el-table-column label="類型名稱" prop="name" width="200" align="center">
      </el-table-column>
      <el-table-column label="屬性標籤" width="380" align="center">
        <template #default="scope">
          {{ filterValueList(scope.row.value_list) }}
        </template>
      </el-table-column>
      <el-table-column prop="order" label="排序" width="" align="center">
      </el-table-column>
      <el-table-column prop="status" label="狀態" align="center" width="">
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

      <el-table-column prop="status" label="操作" align="center" width="">
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
      style="bottom: 0px; right: 0px; left: 300px; z-index: 100"
    >
      <div class="px-2" style="flex: 1">
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
    <el-dialog title="添加類型" v-model="createModel" top="5vh" width="80%">
      <!-- 表單內容 -->
      <el-form ref="ruleForm" :model="form" :rules="validateRules">
        <el-form-item label="類型名稱" label-width="" prop="name">
          <el-input
            v-model="form.name"
            placeholder="類型名稱"
            size="mini"
            style="width: 25%"
          ></el-input>
        </el-form-item>
        <el-form-item label="排 序 " label-width="">
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

        <el-form-item label="關聯規格" label-width="">
          <div class="d-flex">
            <span
              class="sku-list-item px-3 py-2 border rounded mr-3"
              style="line-height: initial"
              v-for="(item, index) in form.sku_list"
              :key="index"
              ><font>{{ item.name }}</font>
              <i
                class="el-icon-delete"
                @click.prevent="deleteFormSkusList(index)"
              ></i
            ></span>
            <el-button size="mini" @click.prevent="chooseSkus"
              ><i class="el-icon-plus"></i
            ></el-button>
          </div>
        </el-form-item>
        <el-form-item label="屬性列表">
          <el-table :data="value_list" style="width: 100%">
            <el-table-column prop="order" label="排序" width="80">
              <template #default="scope">
                <el-input
                  type=""
                  v-model="scope.row.order"
                  width="60"
                  placeholder="排序"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="屬性名稱" width="130">
              <template #default="scope">
                <el-input
                  type=""
                  v-model="scope.row.name"
                  size="mini"
                  placeholder="屬性名稱"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="所屬類型" width="130">
              <template #default="scope">
                <el-select
                  v-model="scope.row.type"
                  placeholder="所屬類型"
                  size="mini"
                >
                  <el-option label="輸入框" value="input"></el-option>
                  <el-option label="單選框" value="radio"></el-option>
                  <el-option label="多選框" value="checkbox"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否顯示" width="150">
              <template #default="scope"
                ><el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="屬性值"
              width="300"
              v-if="scope.row.type !== 'input'"
            >
              <template #default="scope">
                <el-input
                  v-if="scope.row.isedit"
                  type="textarea"
                  v-model="scope.row.default"
                  size="mini"
                  placeholder="一行為一個屬性值，換行輸入"
                  >删除</el-input
                >
                <span v-else class="">{{ scope.row.default }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button
                  v-if="scope.row.type !== 'input'"
                  size="mini"
                  type="text"
                  @click.prevent="editRow(scope)"
                  >{{ scope.row.isedit ? '完成' : '編輯屬性值' }}</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  @click.prevent="delRow(scope.$index)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="" label-width="">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-plus"
            @click.prevent="addValue"
            >新增一屬性</el-button
          >
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
  inject: ['layout', 'appv'], // 依賴注入不會再 mixins
  mixins: [common],
  data() {
    return {
      /**
       * 移入mixins
       * => multipleSelection: []
       * => 分頁所需參數
       */
      preUrl: 'goods_type',
      // tableData: [
      //   {
      //     id: 1,
      //     name: '鞋子',
      //     order: 50,
      //     status: 1,
      //     sku_list: [
      //       { id: 1, name: '顏色' },
      //       { id: 2, name: '尺寸' },
      //     ],
      //     value_list: [
      //       { order: 50, name: '特性', type: 'input', value: '' },
      //       { order: 50, name: '前置鏡頭', type: 'input', value: '' },
      //     ],
      //   },
      // ],
      tableData: [],
      createModel: false,
      editIndex: -1,
      form: {
        name: '',
        order: 50,
        status: 1,

        sku_list: [],
      },
      value_list: [],

      // Form 驗證
      validateRules: {
        name: [
          { required: true, message: '類型名稱不能為空', trigger: 'blur' },
        ],
      },
    }
  },
  components: {
    ButtonSearch,
  },
  computed: {
    filterValueList() {
      // 閉包傳參
      return function(value_list) {
        let arr = value_list.map((v) => v.name)
        return arr.join(',')
      }
    },
    // 關聯規格id 組成的一維數組
    skus_id() {
      return this.form.sku_list.map((v) => v.id)
    },
  },
  watch: {},
  methods: {
    /**
     * 移入mixins
     * => 多選 : handleSelectionChange(val)
     * => 批量刪除 : deleteAll()
     * => 修改狀態 : changeStatus(item)
     * => 刪除當前商品 : deleteItem(scope)
     * => 批量刪除 : deleteAll()
     * => 每頁?條 : handleSizeChange(val)
     * => 當前頁 : handleCurrentChange(val)
     */
    /** 複寫mixins */

    getListResult(e) {
      // console.log("getListResult(e) ==>　",e)
      this.tableData = e.list.map((item) => {
        // 資料庫為goods_type_values，在此複製為 value_list
        item.value_list = item.goods_type_values
        item.sku_list = item.skus
        return item
      })
    },

    // 打開 Dialog
    openModel(e = false) {
      // console.log(e)
      if (!e) {
        // init form
        this.form = {
          name: '',
          order: 50,
          status: 1,
          sku_list: [],
        }
        this.value_list = []

        this.editIndex = -1
      } else {
        // 修改
        this.form = { ...e.row }
        this.value_list = [e.row.value_list]
        this.editIndex = e.$index
      }

      this.createModel = true //打開
    },

    // 注入依賴
    chooseSkus() {
      this.app.chooseSkus((e) => {
        // console.log(e)
        let index = this.form.sku_list.findIndex((item) => {
          return item.id === e.id
        })
        if (index === -1) {
          this.form.sku_list.push(e)
        }
      })
    },

    // 刪除關聯規格
    deleteFormSkusList(index) {
      this.form.sku_list.splice(index, 1)
    },
    // 提交類型
    submit(e) {
      this.$refs.ruleForm.validate((e) => {
        if (!e) return
        // 驗證屬性列
        var result = true
        var message = []
        this.value_list.forEach((item, index) => {
          let no = index + 1
          if (item.order === '') {
            result = result && false
            message.push('第' + no + '行:排序不得為空')
          }
          if (item.order === '') {
            result = result && false
            message.push('第' + no + '行:屬性名稱不得為空')
          }
          if (item.type !== 'input' && item.default === '') {
            result = result && false
            message.push('第' + no + '行:屬性值不得為空')
          }
        })
        if (!result) {
          var temp = ''
          message.forEach((v) => {
            temp += `<li>${v}</li>`
          })
          return this.$notify({
            title: '提示',
            type: 'warning',
            dangerouslyUseHTMLString: true,
            duration: 3000,
            message: `<ul>${temp}</ul>`,
          })
        }
        let msg = ''
        if (e) {
          let value_list = this.value_list.map((item) => {
            if (item.default) {
              item.default = item.default.replace(/\n/g, ',')
            }
            return item
          })

          let data = {
            ...this.form,
            value_list: [...value_list],
            skus_id: this.skus_id,
          }
          let id = 0
          if (this.editIndex !== -1) {
            // 修改
            id = this.tableData[this.editIndex].id
          }
          this.addOrEdit(data, id)
          this.createModel = false
        }
      })
    },

    // 新增一屬性
    addValue() {
      this.value_list.push({ order: 50, name: '', type: 'input', value: '' })
    },
    // 編輯屬性值
    editRow(scope) {
      scope.row.isedit = !scope.row.isedit
    },
    // 刪除屬性值
    delRow(index) {
      this.$confirm('是否刪除該屬性值?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.value_list.splice(index, 1)
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
  created() {
    /** mixins vu0 先執行 */
  },
  mounted() {},
  updated() {},
  unmounted() {},
  filters: {},
}
</script>

<style scoped lang="scss">
.this {
  border: 1px solid red;
}
.sku-list-item {
  i {
    display: none;
    cursor: pointer;
  }
  &:hover {
    background-color: #f4f4f4;
    font {
      display: none;
    }
    i {
      display: inline-block;
    }
  }
}
</style>
