<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px">
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <!--  -->
      <el-tab-pane label="運費模板">
        <!--  -->
        <div class="">
          <el-button type="primary" size="small" @click="openModal(false)"
            >新增模板</el-button
          >
        </div>
        <el-table class="mt-3" border :data="tableData" style="width: 100%">
          <el-table-column
            label="模板名稱"
            prop="name"
            width="300"
            align="center"
          >
          </el-table-column>

          <el-table-column
            label="計費方式"
            prop="type"
            width="120"
            align="center"
          >
            <template #default="scope">
              {{ formatType[scope.row.type] }}
            </template>
          </el-table-column>

          <el-table-column label="排序" prop="order" width="300" align="center">
          </el-table-column>

          <el-table-column label="操作" align="center" width="250">
            <template #default="scope">
              <el-button
                type="text"
                size="mini"
                plain
                @click="openModal(scope.$index)"
                >修改</el-button
              >
              <el-button
                type="text"
                size="mini"
                plain
                @click="openDrawer(scope.row)"
                >配置模板({{ scope.row.express_values.length }})</el-button
              >
              <el-button
                type="text"
                size="mini"
                plain
                @click="deleteItem(scope.row)"
                >刪除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--  -->
      <el-tab-pane label="物流跟蹤">
        <el-form :model="form">
          <el-form-item label="快遞-黑貓宅急便(Customer)" label-width="">
            <el-input
              type="text"
              v-model="form.customer"
              placeholder="Bucket"
              size="mini"
              style="width: 30%"
            ></el-input>
            <small class="d-block"
              >用於查詢物流訊息,<a href="" class="">黑貓宅急便申請</a></small
            >
          </el-form-item>
          <el-form-item label="快遞key" label-width="">
            <el-input
              type="text"
              v-model="form.key"
              placeholder="Bucket"
              size="mini"
              style="width: 40%"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
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
    <el-dialog title="添加模板" v-model="createModal" top="5vh">
      <!-- 表單內容 -->
      <el-form :model="modal">
        <el-form-item label="模板名稱" label-width="">
          <el-input
            v-model="modal.name"
            size="mini"
            style="width: 25%"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="">
          <el-input v-model="modal.order"></el-input>
        </el-form-item>
        <el-form-item label="計費類型" label-width="">
          <el-radio-group v-model="modal.type" size="mini">
            <el-radio :label="1" border>按重量</el-radio>
            <el-radio :label="0" border>按件數</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createModel = false">取消</el-button>
          <el-button type="primary" @click="submit">確定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-drawer
      size="70%"
      v-model="drawer"
      :direction="direction"
      :before-close="handleClose"
      destroy-on-close
    >
      <div
        class="border-top p-3"
        style="

        "
      >
        <el-table
          class="mt-3"
          border
          :data="express_values"
          style="width: 100%"
        >
          <el-table-column label="ID" prop="id" width="100" align="center">
          </el-table-column>

          <el-table-column
            label="可配送區域"
            prop="region"
            width=""
            align="center"
          >
            <template #default="scope">
              <el-cascader
                :options="options"
                :props="props"
                collapes-tags
                clearable
                v-model="scope.row.region"
                @change="change(scope.row)"
              ></el-cascader>
            </template>
          </el-table-column>

          <el-table-column
            label="首件(個)/首重(kg)"
            prop="first"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-input
                type="number"
                v-model="scope.row.first"
                @change="change(scope.row)"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="運費(元)"
            prop="first_price"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-input
                type="number"
                v-model="scope.row.first_price"
                @change="change(scope.row)"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="續件/續重)"
            prop="add"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-input
                type="number"
                v-model="scope.row.add"
                @change="change(scope.row)"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column
            label="續費元)"
            prop="add_price"
            width="120"
            align="center"
          >
            <template #default="scope">
              <el-input
                type="number"
                v-model="scope.row.add_price"
                @change="change(scope.row)"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="250">
            <template #default="scope">
              <el-button
                type="text"
                size="mini"
                plain
                @click="deleteValue(scope.row, scope.$index)"
                >刪除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          class="mr-2 mt-3"
          size="medium"
          @click.stop="addValue"
        >
          新增策略
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import common from '@/common/mixins/common.js'
export default {
  inject: ['app', 'layout'],
  mixins: [common],
  data() {
    return {
      preUrl: 'express',
      tabIndex: 0,
      form: {
        // 物流跟蹤
        customer: '',
        key: '',
      },
      tableData: [],
      createModal: false,
      modal: {
        name: '',
        order: 10,
        type: 0,
      },
      modalIndex: -1, // -1 修改

      drawer: false,
      direction: 'rtl',
      drawerId: 0,
      express_values: [],
      options: [],
      props: {
        multiple:true,
        label:"name",
        value:"name",
      },
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
    formatType() {
      let arr = ['按件數', '按尺寸']
      return arr
    },
  },
  watch: {},
  methods: {
    getListResult(e) {
      this.tableData = e.list
      this.options = e.area.map(item=>{
        item.children= item.citys.map(v=>{
          v.children = v.districts
          return v
        })
        return item
      })
    },
    // 加載數據
    handleClick(tab, event) {
      console.log(tab, tab.index)
    },
    submit() {
      let id = 0
      if (this.modalIndex !== -1) {
        // 修改
        id = this.tableData[this.modalIndex].id
      }
      this.createModal = false
      this.addOrEdit(this.modal, id)
    },
    openModal(index) {
      if (index === false) {
        // 新增
        this.modal = {
          name: '',
          order: 10,
          type: 0,
        }
        this.modalIndex = -1
        return (this.createModal = true)
      }
      // 修改
      let item = this.tableData[index]
      this.modal = {
        name: item.name,
        order: item.order,
        type: item.type,
      }
      this.modalIndex = index
      this.createModal = true
    },
    openDrawer(item) {
      this.express_values = item.express_values
      this.drawer = true
      this.drawerId = item.id
    },
    handleClose(done) {
      this.$confirm('確認關閉？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    addValue(item) {
      this.layout.showLoading()
      this.$axios
        .post(
          '/admin/express_value',
          {
            first: 0,
            first_price: 0,
            add: 0,
            add_price: 0,
            express_id: this.drawerId,
            region: [['全國', '所有', '所有']],
          },
          { token: true }
        )
        .then((res) => {
          let data = res.data.data
          this.express_values.push(data)
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    deleteValue(item, index) {
      this.$axios
        .post(`/admin/express_value/${item.id}/delete`, {}, { token: true })
        .then((res) => {
          this.express_values.splice(index, 1)
          this.$message({
            message: '策略刪除成功',
            type: 'success',
          })

          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    change(item){
    
      this.$axios
        .post(
          `/admin/express_value/${item.id}`,
          item,
          { token: true }
        )
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang=""></style>
