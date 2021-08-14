<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px;">
    <div class="">
      <el-button
        type="success"
        class="mt-2 mb-3"
        size="medium"
        @click.prevent="createTop(data)"
      >
        創建頂級分類
      </el-button>
    </div>
    <el-tree
      :data="data"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
      draggable
      @node-click="handleNodeClick"
      @node-drop="nodeDrop"
      @node-drag-end="nodeDragEnd"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node" style="">
          <div class="">
            <el-input
              v-if="data.editStatus"
              v-model="data.name"
              size="mini"
            ></el-input>
            <div v-else>{{ node.label }}</div>
          </div>

          <span class="">
            <el-button
              :type="data.status ? 'primary' : 'danger'"
              class="mr-2 "
              size="mini"
              @click.stop="showOrHide(data)"
            >
              {{ data.status ? '顯示' : '隱藏' }}
            </el-button>
            <el-button
              type="success"
              class="mr-2"
              size="mini"
              @click.stop="append(data)"
            >
              增加
            </el-button>
            <el-button
              :type="data.editStatus ? 'default' : 'warning'"
              class="mr-2"
              size="mini"
              @click.stop="edit(data)"
            >
              {{ data.editStatus ? '完成' : '修改' }}
            </el-button>
            <el-button
              type="danger"
              class="mr-2"
              size="mini"
              @click.stop="remove(node, data)"
            >
              刪除
            </el-button>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script>
let id = 1000
export default {
  inject: ['layout'],
  data() {
    return {
      data: [],
      defaultProps: {
        children: 'child',
        label: 'name',
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
    // 排序後的數據
    sortData() {
      // 多維數組轉1維
      let data = []
      let sort = function(arr) {
        arr.forEach((item) => {
          data.push(item)
          if (item.child.length) {
            sort(item.child)
          }
        })
      }
      sort(this.data)
      // 排序
      data = data.map((item, index) => {
        return {
          id: item.id,
          order: index,
          category_id: item.category_id,
        }
      })
      return data
    },
  },
  watch: {},
  methods: {
    // api => 初始化
    __init() {
      this.layout.showLoading()
      this.$axios
        .get('/admin/category', { token: true })
        .then((res) => {
          let data = res.data.data

          let addEditStatus = function(arr) {
            arr.forEach((item) => {
              item.editStatus = false
              if (item.child.length) {
                addEditStatus(item.child)
              }
            })
          }

          addEditStatus(data)
          this.data = data
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 顯示|隱藏
    showOrHide(data) {
      // console.log("===== node ====", node)
      // data.status = data.status ? 0 : 1
      // api => 修改商品分类状态
      let status = data.status ? 0 : 1
      let msg = status ? '顯示' : '隱藏'
      this.layout.showLoading()
      this.$axios
        .post(
          `/admin/category/${data.id}/update_status`,
          { status },
          { token: true }
        )
        .then((res) => {
          data.status = status
          this.layout.hideLoading()
          this.$message({
            message: msg + '成功',
            type: 'success',
          })
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 編輯
    edit(data) {
      if (!data.editStatus) {
        return (data.editStatus = true)
      }
      // api => 修改商品分类
      if (data.name === '') {
        return this.$message.error({
          message: '分類名稱不得為空',
          type: 'error',
        })
      }
      this.layout.showLoading()
      this.$axios
        .post(
          `/admin/category/${data.id}`,
          {
            status: data.status,
            name: data.name,
            category_id: data.category_id,
          },
          { token: true }
        )
        .then((res) => {
          this.$message({
            message: '修改成功',
            type: 'success',
          })
          this.__init()
          data.editStatus = false // 編輯狀態
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 增加子分類
    append(data) {
      // api => 增加商品分类
      this.layout.showLoading()
      this.$axios
        .post(
          '/admin/category',
          {
            status: 0,
            name: 'Test Category',
            category_id: data.id,
          },
          { token: true }
        )
        .then((res) => {
          // console.log(res)  // 拿到的數據
          this.__init()
          // 加 editStatus & child
          let obj = res.data.data
          obj.editStatus = true
          obj.child = []

          // 父級下追加子分類空數組
          data.child.push(obj)

          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 刪除
    remove(node, data) {
      this.$confirm('是否刪除該分類?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //  api => 删除商品分类
          this.layout.showLoading()
          this.$axios
            .delete(`/admin/category/${data.id}`, { token: true })
            .then((res) => {
              this.__init()
              this.$message({
                type: 'success',
                message: '刪除成功!',
              })
              this.layout.hideLoading()
            })
            .catch((err) => {
              this.layout.hideLoading()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消刪除',
          })
        })
    },
    // 拖曳
    nodeDrop(...options) {
      // console.log(options)
      // console.log('sortData==>',this.sortData)
      this.layout.showLoading()
      this.$axios
        .post(
          '/admin/category/sort',
          { sortdata: JSON.stringify(this.sortData) },
          { token: true }
        )
        .then((res) => {
          this.__init()
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 拖曳結束
    nodeDragEnd(...options) {
      console.log(options)

      // 被拖拽节点对应的 Node
      let item = options[0].data
      // 结束拖拽时最后进入的节点（可能为空）
      let obj = options[1].data

      if (obj) {
        if (options[2] === 'before' || options[2] === 'after') {
          item.category_id = obj.category_id
        } else {
          item.category_id = obj.id
        }
      }
    },
    // 創建頂級分類
    createTop() {
      // 驗證
      const inputValidator = function(val) {
        if (val === '' || val === null) {
          return '頂級分類不能為空'
        }
        return true
      }

      this.$prompt('請輸入頂級分類名稱', '頂級分類', {
        confirmButtonText: '創建',
        concelButtonText: '刪除',
        inputValidator: inputValidator,
      })
        .then((val) => {
          // api =>
          this.layout.showLoading()
          this.$axios
            .post(
              '/admin/category',
              {
                status: 0,
                name: val,
                category_id: 0,
              },
              { token: true }
            )
            .then((res) => {
              console.log(res)
              this.__init()
              this.$message({
                message: '頂級分類創建成功',
                type: 'success',
              })

              this.layout.hideLoading()
            })
            .catch((err) => {
              console.log(err)
              this.layout.hideLoading()
            })
          // let msg = inputValidator(val)
          // if (typeof msg === 'string') {
          //   return this.$message({
          //     type: 'danger',
          //     message: msg,
          //   })
          //   //提交
          // }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },

    handleNodeClick() {},
  },
  created() {
    this.__init()
  },
  mounted() {},
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang="css">
.custom-tree-node {
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  font-size: 14px !important;
  padding-right: 8px !important;
}
</style>
