<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px">
    <!-- component -->
    <button-search class="pt-3">
      <!-- 採用默認故不需要寫 <template #right></template> -->
      <template #right>
        <!-- 高級搜索表單 (slot)-->
        <div class="d-flex align-items-center">
          <el-date-picker
            v-model="search.time"
            type="daterange"
            size="medium"
            class="ml-1"
            style="width:420px;"
            range-separator="至"
            start-placeholder="開始日期"
            end-placeholder="結束日期"
          >
          </el-date-picker>
          <el-input type="" v-model="search.keyword" size="medium" placeholder="請輸入訂單號" class="ml-2" style="width:200px;"></el-input>
          <el-button type="info" class="ml-2" size="medium">搜尋</el-button>
        </div>
        
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
      <el-table-column label="訂單編號" prop="name" width="200" align="center">
      </el-table-column>

      <el-table-column prop="username" label="用戶名" width="" align="center">
      </el-table-column>

      <el-table-column prop="price" label="發票金額" width="" align="center">
      </el-table-column>

      <el-table-column prop="" label="抬頭" width="" align="center">
      </el-table-column>

      <el-table-column prop="content" label="發票內容" width="" align="center">
      </el-table-column>

      <el-table-column prop="code" label="納稅人編號" width="" align="center">
      </el-table-column>

      <el-table-column
        prop="create_time"
        label="創建時間"
        width=""
        align="center"
      >
      </el-table-column>

      <el-table-column prop="status" label="操作" align="center" width="">
        <template #default="scope">
          <el-button-group>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="medium"
              plain
              @click.prevent="deleteItem(scope)"
              >刪除</el-button>
            
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
          :current-page="currentPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
        >
        </el-pagination>
      </div>
    </el-footer>
  </div>
</template>

<script>
import ButtonSearch from '@/components/common/ButtonSearch.vue'
export default {
  data() {
    return {
      multipleSelection: [],
      tableData: [],
      currentPage: 1,
      search:{
        time:"",
        kwywrd:"",
      }
    }
  },
  components: {
    ButtonSearch,
  },
  computed: {},
  watch: {},
  methods: {
    // 多選
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // 刪除當前商品
    deleteItem(scope) {
      this.$confirm('是否刪除該規格?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.tableData.splice(scope.$index, 1)
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

    /** ================================ footer ====================================== */
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
  },
  created() {},
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
