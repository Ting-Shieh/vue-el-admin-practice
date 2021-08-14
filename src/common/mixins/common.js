export default {
  data() {
    return {
      page: {
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 0,
      },
      multipleSelection: [],
      //
      preUrl: '',
      //
      loading: true,
    }
  },
  computed: {
    // 選中 id 數組
    ids() {
      return this.multipleSelection.map((item) => {
        return item.id
      })
    },
  },
  methods: {
    showLoading() {
      if (this.loading) this.layout.showLoading()
    },
    hideLoading() {
      if (this.loading) this.layout.hideLoading()
    },
    // 處理列表結果
    getListResult(data) {},
    // 獲取請求列表分頁url
    getListUrl() {
      return `/admin/${this.preUrl}/${this.page.currentPage}?limit=${this.page.pageSize}`
    },
    // 獲取列表
    getList() {
      if (this.preUrl === '') return // 中止未配置
      this.showLoading()
      let url = this.getListUrl()
      this.$axios
        .get(url, { token: true })
        .then((res) => {
          // console.log('getList==>', res)
          
          // 分頁(共同)
          let data = res.data.data
          
          this.page.total = data.totalCount
          
          // (非共同部分)
          this.getListResult(data)

          // (共同)
          this.hideLoading()
        })
        .catch((err) => {
          this.hideLoading()
        })
    },
    // 添加或編輯
    addOrEdit(data, id = 0) {
      // id=0 => 添加
      let msg = id > 0 ? '修改' : '添加'
      let url =
        id > 0 ? `/admin/${this.preUrl}/${id}` : `/admin/${this.preUrl}`
      console.log('url=>',url)
      this.showLoading()
      this.$axios
        .post(url, data, { token: true })
        .then((res) => {
          this.$message({
            type: 'success',
            message: msg + '成功!',
          })
          console.log(res)
          this.getList()

          this.hideLoading()
        })
        .catch((err) => {
          console.log("err=>",err)
          this.hideLoading()
        })
    },
    // 批量刪除
    deleteAll() {
      if (this.ids.length === 0) {
        this.$message({
          type: 'error',
          message: '請先選中需要刪除的訊息',
        })
      }
      this.$confirm('是否將此些規格刪除?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // api => 批量删除商品规格
          this.showLoading()
          this.$axios
            .post(
              `/admin/${this.preUrl}/delete_all`,
              { ids: this.ids },
              { token: true }
            )
            .then((res) => {
              this.$message({
                type: 'success',
                message: '選中刪除成功',
              })
              this.multipleSelection = [] // 清空選中
              this.getList()
              this.hideLoading()
            })
            .catch((err) => {
              this.hideLoading()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消刪除',
          })
        })
    },
    // 修改狀態
    changeStatus(item) {
      let status = item.status === 1 ? 0 : 1
      let msg = status === 1 ? '啟用' : '禁用'
      // 請求服務端
      // api => 修改商品规格状态
      this.showLoading()
      this.$axios
        .post(
          `/admin/${this.preUrl}/${item.id}/update_status`,
          { status },
          { token: true }
        )
        .then((res) => {
          item.status = status
          this.$message({
            type: 'success',
            message: msg + '成功!',
          })
          this.hideLoading()
        })
        .catch((err) => {
          this.hideLoading()
        })
    },
    // 刪除當前商品
    deleteItem (item) {
      console.log('===>',item)
      this.$confirm('是否刪除該規格?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          // api => 删除商品规格
          this.showLoading()
          this.$axios
            .post(
              `/admin/${this.preUrl}/${item.id}/delete`,
              {},
              { token: true }
            )
            .then((res) => {
              this.$message({
                type: 'success',
                message: '刪除成功',
              })
              this.getList()
              this.hideLoading()
            })
            .catch((err) => {
              this.hideLoading()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消刪除',
          })
        })
    },
    // 選中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 每頁?條
    handleSizeChange(val) {
      console.log(`每頁 ${val} 條`)
      this.page.pageSize = val
      this.getList()
    },
    // 當前頁:
    handleCurrentChange(val) {
      console.log(`當前頁: ${val}`)
      this.page.currentPage = val
      this.getList()
    },
  },
  created() {
    // console.log("mixin created")
    this.getList()
  },
}
