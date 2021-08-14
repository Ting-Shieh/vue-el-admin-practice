<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px;">
    <!-- component -->
    <button-search
      class="pt-3"
      :showSearch="true"
      ref="buttonSearchRef"
      placeholder="要搜索的商品名稱"
      :superSearch="false"
      @search="searchEvent"
    >
      <!-- Right (slot) -->
      <!-- 採用默認故不需要寫 <template #right></template> -->
      <template #form>
        <!-- 高級搜索表單 (slot)-->
        <!-- <el-form inline :model="form" ref="form" label-width="100px">
          <el-form-item class="mb-0" label="評價用戶">
            <el-input
              v-model="form.name"
              size="medium"
              placeholder="ex: 評價用戶"
            ></el-input
          ></el-form-item>
          <el-form-item class="mb-0" label="評價類型">
            <el-select v-model="form.type" placeholder="評價類型" size="mini">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option> </el-select
          ></el-form-item>
          <el-form-item class="mb-0" label="發布時間">
            <el-date-picker
              v-model="form.time"
              type="daterange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item class="mb-0">
            <el-button
              class="btn btn-secondary mr-1"
              style="width: 60px;"
              @click.prevent="searchEvent"
            >
              搜索
            </el-button>
            <el-button
              class="btn btn-outline-secondary"
              style="width: 150px;"
              @click.prevent="clearSearch"
            >
              清空篩選條件
            </el-button>
          </el-form-item>
        </el-form> -->
      </template>
    </button-search>
    <el-table class="mt-3" border :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template #default="scope">
          <div class="media mt-3 bg-light p-2 rounded">
            <img
              :src="scope.row.user.avatar"
              class="mr-3"
              style="width:70px;height:70px;border-radius:100%;"
            />
            <div class="media-body">
              <h6 class="mt-0 d-flex">
                {{ scope.row.user.username }}
                <small>{{ scope.row.review_time }}</small>
                <el-button
                  v-if="!scope.row.extra && !textareaEdit"
                  class="ml-auto"
                  type="info"
                  size="mini"
                  @click="textareaEdit = true"
                  >回復</el-button
                >
              </h6>
              <p>{{ scope.row.review.data }}</p>
              <div class="py-2">
                <img
                  v-for="(item, index) in scope.row.review.image"
                  :key="index"
                  :src="item"
                  alt=""
                  style="max-width:70px;max-height:70px;border-radius:100%;"
                />
              </div>
              <div v-if="textareaEdit" class="">
                <el-input
                  type="textarea"
                  v-model="textarea"
                  placeholder="請輸入評價內容"
                ></el-input>
                <div class="py-2">
                  <el-button
                    class="ml-auto mr-2"
                    type="success"
                    size="mini"
                    @click="review(scope.row.id)"
                    >回復</el-button
                  >
                  <el-button
                    class="ml-auto"
                    type="info"
                    size="mini"
                    @click="closeTextarea"
                    >取消回復</el-button
                  >
                </div>
              </div>

              <div v-if="scope.row.extra">
                <div
                  class="media mt-3"
                  v-for="(item, index) in scope.row.extra"
                  :key="index"
                >
                  <div class="media-body">
                    <h6 class="mt-0 d-flex">
                      客服
                      <el-button
                        v-if="!textareaEdit"
                        class="ml-auto"
                        type="info"
                        size="mini"
                        @click.prevent="openTextarea(item.data)"
                        >修改</el-button
                      >
                    </h6>
                    <p>{{ item.data }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" width="80" align="center">
      </el-table-column>
      <el-table-column label="商品" prop="id" width="75" align="center">
        <!-- vue 3 新寫法 --><!-- {{scope.$index }}{{scope.row }} -->
        <template #default="scope">
          <div class="media align-items-center">
            <img
              :src="scope.row.goods_item.cover"
              style="width:64px;height:64px;"
              class="mr-3"
            />
            <div class="media-body ">
              <h6 class="mt-0">{{ scope.row.goods_item.title }}</h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="評價訊息" width="250">
        <template #default="scope">
          <div class="d-flex flex-column">
            <p>用戶:{{ scope.row.user.username }}</p>
            <p>
              評分:<el-rate
                v-model.number="scope.row.rating"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
            </p>
          </div>
        </template>
      </el-table-column>
      <div class="">
        <el-table-column
          label="評價時間"
          prop="review_time"
          align="center"
          width=""
        >
        </el-table-column>
        <div class=""></div>
      </div>

      <el-table-column prop="status" label="是否顯示" align="center" width="">
        <template #default="scope">
          <el-button
            :type="scope.row.status ? 'success' : 'danger'"
            @click.prevent="changeStatus(scope.row)"
          >
            {{ scope.row.status ? '啟用' : '禁用' }}
          </el-button>
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
      preUrl: 'goods_comment',
      tableData: [],
      textarea: '',
      textareaEdit: false,
      title:"",
      
    }
  },
  components: {
    ButtonSearch,
  },
  computed: {},
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

    /** 複寫 */
    getListResult(e) {
      console.log(e.list)

      this.tableData = e.list
    },
    // 關閉回復
    closeTextarea() {
      this.textarea = ''
      this.textareaEdit = false
    },
    // 修改回復
    openTextarea(data) {
      this.textarea = data
      this.textareaEdit = true
    },
    //
    review(id) {
      if (this.textarea === '') {
        return this.$message({
          message: '回復內容不得維空',
          type: 'error',
        })
      }
      this.layout.showLoading()
      this.$axios
        .post(
          `/admin/goods_comment/review/${id}`,
          { data: this.textarea, id: id },
          { token: true }
        )
        .then((res) => {
          this.closeTextarea()
          this.$message({
            message: '評論回復成功',
            type: 'success',
          })

          this.getList()
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
   
    /**複寫 mixins */
    getListUrl() {
      return `/admin/${this.preUrl}/${this.page.currentPage}?limit=${this.page.pageSize}&title=${this.title}`
    },
    //
    searchEvent(e) {
      // console.log(e)
      this.title = e
      this.getList()
    },
    //
    clearSearch() {},
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
