<template>
  <div class="">
    <el-container class="full-main-container">
      <el-header class="border-bottom">
        <!-- Header -->
        <div class="d-flex align-items-center " style="padding-top: 12px;">
          <!--  -->
          <div class="d-flex  mr-auto ">
            <el-select
              v-model="searchForm.order"
              class="mr-2"
              placeholder="請選擇圖片排序方式"
              size="medium"
              style="width:150px;"
            >
              <el-option label="降序" value="desc"> </el-option>
              <el-option label="升序" value="asc"> </el-option>
            </el-select>
            <el-input
              v-model="searchForm.keyword"
              class="mr-2"
              size="medium"
              placeholder="輸入圖片名稱"
              style="width:150px;"
            ></el-input>
            <el-button
              type="primary"
              size="medium"
              @click.prevent="getImageList"
              >Search</el-button
            >
          </div>
          <el-button
            type="warning"
            size="medium"
            v-if="chooseList.length"
            @click.prevent="imageUnChoose"
            >取消選中</el-button
          >
          <el-button
            type="danger"
            size="medium"
            v-if="chooseList.length"
            @click.prevent="imageDel({ all: true })"
            >批量刪除</el-button
          >
          <el-button
            type="success"
            size="medium"
            @click.prevent="openAlbumModel(false)"
            >創建相簿</el-button
          >
          <el-button
            type="warning"
            size="medium"
            @click.prevent="uploadModel = true"
            >上傳圖片</el-button
          >
        </div>
      </el-header>
      <el-container>
        <el-aside
          class="target-aside-location bg-white border-right"
          width="200px"
        >
          <!-- 側邊 | 相簿列表-->
          <ul class="list-group list-group-flush">
            <album-item
              v-for="(album, idx) in albums"
              :key="idx"
              :album="album"
              :idx="idx"
              :active="albumIndex === idx"
              @change="albumChange"
              @editAlbum="openAlbumModel"
              @deleteAlbum="albumDel"
            ></album-item>
          </ul>
        </el-aside>
        <el-container>
          <el-main class="target-main-location">
            <!-- 主內容 row=24 -->
            <el-row :gutter="10">
              <el-col
                :span="24"
                :lg="4"
                :md="6"
                :sm="8"
                v-for="(image, idx) in imageList"
                :key="idx"
              >
                <el-card
                  class="box-card mb-3 position-relative "
                  :body-style="{ padding: '0' }"
                  shadow="hover"
                  style="cursor: pointer;"
                >
                  <div :class="{ 'border border-danger': image.ischeck }">
                    <!-- v-if 最好和原生html tag 搭配，效率會比較好。 -->
                    <span
                      v-if="image.ischeck"
                      class="badge badge-danger"
                      style="position: absolute;top: 0px; right:0px;font-size:16px;　z-index:50;"
                      >{{ image.checkOrder }}</span
                    >

                    <img
                      :src="image.url"
                      alt=""
                      class="w-100 "
                      style="height:100px;"
                      @click.prevent="imageChoose(image)"
                    />
                    <div
                      class="w-100 text-white position-absolute px-2"
                      style="background: rgba(0,0,0,0.5);margin-top:-25px;"
                    >
                      <span class="small ">{{ image.name }}</span>
                    </div>
                    <div
                      class="p-2 d-flex align-items-center justify-content-center"
                    >
                      <el-button-group>
                        <el-button
                          icon="el-icon-view"
                          size="medium"
                          @click.prevent="previewImage(image)"
                        ></el-button>
                        <el-button
                          icon="el-icon-edit"
                          size="medium"
                          @click.prevent="imageEdit(image, idx)"
                        ></el-button>
                        <el-button
                          icon="el-icon-delete"
                          size="medium"
                          @click.prevent="imageDel({ idx, image })"
                        ></el-button>
                      </el-button-group>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-container>
      <el-footer class="border-top d-flex align-items-center px-0">
        <!-- Footer -->
        <div
          class="h-100 d-flex justify-content-center align-items-center border-right"
          style="width:200px;flex-shrink: 0;"
        >
          <div class="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              class="btn btn-primary"
              :disabled="albumPage === 1"
              @click.prevent="changeAlbumPage('pre')"
            >
              上一頁
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="albumPage === Math.ceil(albumTotal / 10)"
              @click.prevent="changeAlbumPage('next')"
            >
              下一頁
            </button>
          </div>
        </div>
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
    </el-container>

    <!-- 修改|創建相簿 (module) -->
    <el-dialog :title="albumModelTitle" v-model="albumModel">
      <el-form ref="form" :model="albumForm">
        <el-form-item label="相簿名稱">
          <el-input
            v-model="albumForm.name"
            size="medium"
            placeholder="請輸入相簿名稱"
          ></el-input>
        </el-form-item>
        <el-form-item label="相簿排序">
          <el-input-number
            v-model="albumForm.order"
            :min="0"
            size="medium"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="albumModel = false">取 消</el-button>
          <el-button type="primary" @click.prevent="confirmAlbumModel"
            >確定</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 上傳圖片 (module) -->
    <el-dialog title="上傳圖片" v-model="uploadModel" @closed="__init">
      <div class="d-flex align-items-center justify-content-center text-center">
        <el-upload
          class="upload-demo"
          drag
          action="/admin/image/upload"
          multiple
          :headers="{ token: $store.state.user.token }"
          :data="{ image_class_id: image_class_id }"
          name="img"
          :on-success="uploadSuccess"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            將圖片拖曳到此處，或<em>點擊上傳</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上傳 jpg/png 圖片，且不超過 500kb
            </div>
          </template>
        </el-upload>
      </div>
    </el-dialog>

    <!-- 預覽圖片 (module) -->
    <el-dialog v-model="previewModel" width="50vw" top="10vh">
      <div style="margin: -60px -20px -30px -20px;">
        <img :src="previewUrl" alt="" class="w-100 " style="" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import albumItem from '@/components/image/albumItem.vue'
export default {
  inject: ['layout'],
  data() {
    return {
      searchForm: {
        order: 'desc',
        keyword: '',
      },
      albums: [],
      albumIndex: 0, //當前選中相簿
      albumModel: false, // 是否顯示相簿 Dialog Module
      albumEditIndex: -1, //創建為-1。因存在，索引從0開始。
      albumForm: {
        name: '',
        order: 0,
      },
      uploadModel: false,
      previewModel: false,
      previewUrl: '',
      imageList: [], // 當前相簿下的圖片
      chooseList: [], //圖片選中數組
      currentPage: 1,
      albumPage: 1, // 相簿分頁
      albumTotal: 0, // 相簿總數
      pageSize: 10, // 一頁幾條
      pageSizes: [10, 20, 50, 100], // 一頁幾條的選項
      total: 10, //總共幾條
    }
  },
  props: {
    prop: {
      type: String,
      required: false,
    },
  },
  components: { albumItem },
  computed: {
    albumModelTitle() {
      return this.albumEditIndex > -1 ? '修改相簿' : '創建相簿'
    },
    // 選中相簿 id
    image_class_id() {
      let item = this.albums[this.albumIndex]
      if (item) {
        return item.id
      }
      return 0
    },
    // api => 當前選中相簿的圖片列表url
    getImageListUrl() {
      let other = ''
      if (this.searchForm.keyword !== '') {
        other = `&keyword=${this.searchForm.keyword}`
      }
      return `/admin/imageclass/${this.image_class_id}/image/${this.currentPage}?limit=${this.pageSize}&order=${this.searchForm.order}${other}`
    },
  },
  watch: {},
  methods: {
    // 未串api前的模擬數據
    __initForTest() {
      //
      for (let i = 0; i < 20; i++) {
        this.albums.push({
          name: `相簿第${i + 1}本`,
          num: Math.floor(Math.random() * 100), //1~99 隨機
          order: 0, //多少張圖片
        })
      }
      //
      for (let i = 0; i < 25; i++) {
        this.imageList.push({
          id: i + 1,
          name: `圖片第${i + 1}張`,
          url:
            'https://i1.wp.com/popbee.com/image/2019/05/avengers-endgame-robert-downey-jr-i-am-iron-man-line-explained-.jpg?quality=95&',
          ischeck: false,
          checkOrder: 0,
        })
      }
    },
    // 獲取對應相簿下的圖片列表
    getImageList() {
      this.layout.showLoading()
      this.$axios
        .get(this.getImageListUrl, {
          token: true,
        })
        .then((res) => {
          // console.log(res)
          let result = res.data.data
          this.imageList = result.list.map((item) => {
            return {
              id: item.id,
              name: item.name,
              url: item.url,
              ischeck: false,
              checkOrder: 0,
            }
          })
          this.total = result.totalCount
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // https://axios-http.com/docs/api_intro
    __init() {
      this.layout.showLoading()

      // api => 取得相簿列表
      this.$axios
        .get('/admin/imageclass/' + this.albumPage, {
          token: true,
        })
        .then((res) => {
          // console.log(res)
          let result = res.data.data
          this.albums = result.list
          this.albumTotal = result.totalCount
          // 取得"選中"相簿下的"第一頁"圖片列表
          this.getImageList()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 切換相簿
    albumChange(index) {
      this.albumIndex = index
      this.getImageList()
    },
    // 刪除相簿
    albumDel(index) {
      // console.log(index)
      let id = this.albums[index].id
      this.layout.showLoading()
      this.$axios
        .delete(`/admin/imageclass/${id}`, { token: true })
        .then((res) => {
          this.openAlert(index)
          this.__init() // 重新加載數據
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 修改相簿
    albumEdit() {
      let item = this.albums[this.albumEditIndex]

      // api =>
      this.layout.showLoading()
      this.$axios
        .post(`/admin/imageclass/${item.id}`, this.albumForm, {
          token: true,
        })
        .then((res) => {
          this.$message({ message: '修改成功', type: 'success' })
          this.layout.hideLoading()
          this.__init()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
      // 修改相簿資料
      // item.name = this.albumForm.name
      // item.order = this.albumForm.order
    },
    // 打開相簿修改|創建框 Dialog Module + init 數據
    openAlbumModel(obj) {
      // obj 存在=>相簿修改|不存在=>相簿創建 // console.log(obj)
      console.log(obj)
      /** 修改 */
      if (obj) {
        let { album, idx } = obj //解構賦值
        // init 數據
        this.albumForm.name = album.name
        this.albumForm.order = album.order
        this.albumEditIndex = idx
        // 打開Dialog
        return (this.albumModel = true)
      }

      /** 創建 */
      this.albumForm = {
        name: '',
        order: 0,
      }
      this.albumEditIndex = -1
      // 打開Dialog
      return (this.albumModel = true)
    },
    // 點擊確定 修改|創建相簿
    confirmAlbumModel() {
      // 判斷是否為修改
      if (this.albumEditIndex > -1) {
        this.albumEdit()

        return (this.albumModel = false) // 關閉Dialog
      }

      // api => 追加 album
      this.layout.showLoading()
      this.$axios
        .post('/admin/imageclass', this.albumForm, { token: true })
        .then((res) => {
          this.albumModel = false // 關閉Dialog
          this.layout.hideLoading()
          this.$message({ message: '新增相簿成功', type: 'success' })
          this.__init()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
      // this.albums.unshift({
      //   name: this.albumForm.name,
      //   order: this.albumForm.order,
      //   num: 0,
      // })
      // this.albumModel = false // 關閉Dialog
    },
    // 彈框訊息
    openAlert(index) {
      this.$confirm('此操作將永久刪除此相簿, 是否確定繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.albums.splice(index, 1)
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

    // 上傳圖片成功後的callback
    uploadSuccess(response, file, fileList) {
      console.log(response, file, fileList)
    },
    /** ================================ main ====================================== */
    // 預覽圖片
    previewImage(image) {
      this.previewUrl = image.url
      this.previewModel = true
    },
    // 修改圖片
    imageEdit(image, idx) {
      console.log(image)
      this.$prompt('請輸入新名稱', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        inputValue: image.name, //输入框的初始文本
        inputValidator(newval) {
          if (newval === '') return '圖片名稱不能為空'
        },
      }).then(({ value }) => {
        // image.name = value
        // api =>
        this.layout.showLoading()
        this.$axios
          .post(`/admin/image/${image.id}`, { name: value }, { token: true })
          .then((res) => {
            this.__init()
            this.layout.hideLoading()
          })
          .catch((err) => {
            this.layout.hideLoading()
          })
        this.$message({
          message: '修改成功',
          type: 'success',
        })
      })
    },
    // 刪除圖片
    imageDel(obj) {
      this.$confirm(
        obj.all
          ? '是否刪除選中的圖片?'
          : '此操作將永久刪除此圖片, 是否確定繼續?',
        '提示',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        this.layout.showLoading()
        if (obj.all) {
          // 批量刪除
          let ids = this.chooseList.map((item) => item.id)
          this.$axios
            .post(`/admin/image/delete_all`, { ids: ids }, { token: true })
            .then((res) => {
              this.$message({
                message: '照片群山除成功',
                type: 'success',
              })
              this.__init()
              this.chooseList = []
              this.layout.hideLoading()
            })
            .catch((err) => {
              this.layout.hideLoading()
            })
          // let list = this.imageList.filter((img) => {
          //   return !this.chooseList.some((c) => c.id === img.id)
          // })
          // this.imageList = list
          // this.chooseList = []
        } else {
          // 刪除單個

          this.$axios
            .delete(`/admin/image/${obj.image.id}`, { token: true })
            .then((res) => {
              this.__init()
              this.layout.hideLoading()
            })
            .catch((err) => {
              this.layout.hideLoading()
            })
          // this.imageList.splice(obj.idx, 1)
        }

        this.$message({
          type: 'success',
          message: '刪除成功!',
        })
      })
    },
    // 取消選中圖片
    imageUnChoose() {
      this.imageList.forEach((img) => {
        // 找到所有選中圖片
        let currentIndex = this.chooseList.findIndex(
          (item) => item.id === img.id
        )
        if (currentIndex > -1) {
          //取消選種樣式
          img.ischeck = false
          //排序歸0
          img.checkOrder = 0
          //chooseList 移除
          this.chooseList.splice(currentIndex, 1)
        }
      })
    },
    // 選中圖片
    imageChoose(image) {
      console.log('執行==>imageChoose')
      // 選中
      if (!image.ischeck) {
        // 加入選中
        this.chooseList.push({
          id: image.id,
          url: image.url,
        })

        // 計算序號
        image.checkOrder = this.chooseList.length
        // 修改狀態
        image.ischeck = true
        console.log('結束==>加入選中')
        return
      }
      // 取消選中

      // 找到chooseList當前索引 並刪除
      let currentIndex = this.chooseList.findIndex((v) => v.id === image.id)
      if (currentIndex === -1) return
      // 重新計算序號
      let length = this.chooseList.length
      if (currentIndex + 1 < length) {
        // 為中間段非最後的圖片
        // 重新計算chooseList序號
        for (let i = currentIndex; i < length; i++) {
          let no = this.imageList.findIndex(
            (v) => v.id === this.chooseList[i].id
          )
          if (no > -1) {
            this.imageList[no].checkOrder--
          }
        }
      }
      // 刪除
      this.chooseList.splice(currentIndex, 1)
      // 修改狀態
      image.ischeck = false
      // 重置序號
      image.checkOrder = 0
    },
    /** ================================ footer ====================================== */
    handleSizeChange(val) {
      // console.log(`每頁 ${val} 條`)
      this.pageSize = val
      this.getImageList() // api =>重新加載圖片
    },
    handleCurrentChange(val) {
      // console.log(`當前頁: ${val}`)
      this.currentPage = val
      this.getImageList() // api =>重新加載圖片
    },
    // 相簿分頁功能
    changeAlbumPage(type) {
      switch (type) {
        case 'pre':
          this.albumPage--
          break
        case 'next':
          this.albumPage++
          break
      }
      this.__init()
    },
  },
  created() {
    this.__init()
  },
  mounted() {},
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang="scss">
.this {
  border: 1px solid red;
}
.full-main-container {
  position: absolute;
  left: 0 !important;
  top: 55px !important; //麵包屑導航高
  right: 0 !important;
  bottom: 0 !important;
  overflow: hidden;
}

.target-aside-location {
  position: absolute;
  top: 60px !important; //header高(60)
  left: 0 !important;
  bottom: 60px !important; //footer 高(60)
}

.target-main-location {
  position: absolute;
  top: 60px !important; //header高(60)
  left: 200px !important; //aside 寬(200)
  bottom: 60px !important; //footer 高(60)
  right: 0px !important;
}
</style>
