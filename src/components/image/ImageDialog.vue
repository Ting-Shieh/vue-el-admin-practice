<template>
  <!-- 解決彈出層多次渲染的問題 -->
  <el-dialog title="圖片管理" v-model="imageModel" width="80%" top="5vh">
    <el-container class="dialog-full-main-container">
      <el-header class="border-bottom">
        <!-- Header -->
        <div class="d-flex align-items-center" style="padding-top: 12px">
          <!--  -->
          <div class="d-flex mr-auto">
            <el-select
              v-model="searchForm.order"
              class="mr-2"
              placeholder="請選擇圖片排序方式"
              size="medium"
              style="width: 150px"
            >
              <el-option label="降序" value="desc"> </el-option>
              <el-option label="升序" value="asc"> </el-option>
            </el-select>
            <el-input
              v-model="searchForm.keyword"
              class="mr-2"
              size="medium"
              placeholder="輸入相簿名稱"
              style="width: 150px"
            ></el-input>
            <el-button type="primary" size="medium" @click.prevent="getImageList">Search</el-button>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside
          class="target-aside-location bg-white border-right"
          width="200px"
          v-loading="asideLoading"
        >
          <!-- 側邊 | 相簿列表-->
          <ul class="list-group list-group-flush">
            <album-item
              v-for="(album, idx) in albums"
              :key="idx"
              :album="album"
              :idx="idx"
              :active="albumIndex === idx"
              :showOptions="false"
              @change="albumChange"
            ></album-item>
          </ul>
        </el-aside>
        <el-container>
          <el-main class="target-main-location" v-loading="mainLoading">
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
                  class="box-card mb-3 position-relative"
                  :body-style="{ padding: '0' }"
                  shadow="hover"
                  style="cursor: pointer"
                >
                  <div :class="{ 'border border-danger': image.ischeck }">
                    <!-- v-if 最好和原生html tag 搭配，效率會比較好。 -->
                    <span
                      v-if="image.ischeck"
                      class="badge badge-danger"
                      style="
                        position: absolute;
                        top: 0px;
                        right: 0px;
                        font-size: 16px;
                        　z-index: 50;
                      "
                      >{{ image.checkOrder }}</span
                    >

                    <img
                      :src="image.url"
                      alt=""
                      class="w-100"
                      style="height: 100px"
                      @click.prevent="imageChoose(image)"
                    />
                    <div
                      class="w-100 text-white position-absolute px-2"
                      style="background: rgba(0, 0, 0, 0.5); margin-top: -25px"
                    >
                      <span class="small">{{ image.name }}</span>
                    </div>
                    <div
                      class="
                        p-2
                        d-flex
                        align-items-center
                        justify-content-center
                      "
                    >
                      <el-button-group>
                        <el-button
                          icon="el-icon-edit"
                          size="medium"
                          @click.prevent="imageEdit(image, idx)"
                        ></el-button>
                        <el-button
                          icon="el-icon-delete"
                          size="medium"
                          @click.prevent="imageDel({ idx })"
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
          class="
            h-100
            d-flex
            justify-content-center
            align-items-center
            border-right
          "
          style="width: 200px; flex-shrink: 0"
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
        <div class="px-2" style="flex: 1">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </el-footer>
    </el-container>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click.prevent="hide">取 消</el-button>
        <el-button type="primary" @click.prevent="confirm">確定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import albumItem from '@/components/image/albumItem.vue'
export default {
  data() {
    return {
      imageModel: false,
      callback: false,

      //
      searchForm: {
        order: '',
        keyword: '',
      },
      albums: [],
      albumIndex: 0, //當前選中相簿
      albumPage: 1, // 相簿分頁
      albumTotal: 0, // 相簿總數
      imageList: [],
      chooseList: [], //圖片選中數組
      currentPage: 1,
      pageSize: 10, // 一頁幾條
      pageSizes: [10, 20, 50, 100], // 一頁幾條的選項
      total: 10, //總共幾條
      //
      mainLoading: false,
      asideLoading: false,
    }
  },
  props: {
    // 選中數量限制
    max: {
      type: Number,
      default: 9,
    },
  },
  components: { albumItem },
  computed: {
 
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
    /**
     * 打開彈出層
     */
    chooseImage(callback) {
      // callback('123123')
      
      this.__init()
      this.callback = callback
      this.imageModel = true
      this.imageUnChoose() //取消選中
    },
    // 關閉彈出層
    hide() {
      this.callback = false
      this.imageModel = false
    },
    // 確定
    confirm() {
      // 選中的圖片 url
      if (typeof this.callback === 'function') {
        this.callback(this.chooseList)
      }
      // 隱藏
      this.hide()
    },

    // ------------- 相簿方法 ----------------
    __init() {
      // api => 取得相簿列表
      this.asideLoading=true
      this.$axios
        .get('/admin/imageclass/' + this.albumPage, {
          token: true,
        })
        .then((res) => {
          // console.log(res)
          let result = res.data.data
          this.albums = result.list
          this.albumTotal = result.totalCount
          this.asideLoading=false
          // 取得"選中"相簿下的"第一頁"圖片列表
          this.getImageList()
        })
        .catch((err) => {this.asideLoading=false})
    },
    // 獲取對應相簿下的圖片列表
    getImageList() {
      this.mainLoading=true
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
          this.mainLoading=false
        })
        .catch((err) => this.mainLoading=false)
    },
    // 切換相簿
    albumChange(index) {
      this.albumIndex = index
      this.getImageList()
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

    /** ================================ main ====================================== */

    // 修改圖片
    imageEdit(image, idx) {
      this.$prompt('請輸入新名稱', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        inputValue: image.name, //输入框的初始文本
        inputValidator(newval) {
          if (newval === '') return '圖片名稱不能為空'
        },
      }).then(({ value }) => {
        image.name = value
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
        if (obj.all) {
          // 批量刪除
          let list = this.imageList.filter((img) => {
            return !this.chooseList.some((c) => c.id === img.id)
          })
          this.imageList = list
          this.chooseList = []
        } else {
          this.imageList.splice(obj.idx, 1)
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
        // 限制選中數量
        if (this.chooseList.length >= this.max) {
          return this.$message({
            type: 'warning',
            message: `最多選擇${this.max}張圖片`,
          })
        }

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
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
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
  created() {},
  mounted() {},
}
</script>

<style scoped lang="scss">
.dialog-full-main-container {
  position: relative;
  margin: -30px -20px;
  height: 70vh;
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
