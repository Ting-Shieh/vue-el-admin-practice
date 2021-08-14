<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px;">
    <!-- component -->
    <button-search
      class="pt-3"
      ref="buttonSearchRef"
      :showSearch="true"
      :superSearch="true"
      placeholder="手機,Email,用戶名"
      @search="searchEvent"
    >
      <!-- Left (slot) -->
      <template #left>
        <!--  -->
        <button
          type="button"
          class="btn border mr-1 btn btn-success"
          @click.prevent="openModel(false)"
        >
          新增會員
        </button>
      </template>

      <template #form>
        <!-- 高級搜索表單 (slot)-->
        <el-form inline :model="search" label-width="100px">
          <el-form-item class="mb-0" label="搜索內容">
            <el-input
              v-model="search.keyword"
              size="medium"
              placeholder="Phone/Email/Username"
            ></el-input
          ></el-form-item>
          <el-form-item class="mb-0" label="會員等級">
            <el-select
              v-model="search.user_level_id"
              placeholder="會員等級"
              size="medium"
            >
              <el-option
                v-for="(level, index) in user_level"
                :key="index"
                :label="level.name"
                :value="level.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="mb-0" label="">
            <el-button
              class="btn btn-secondary mr-1"
              size="medium"
              style="width: 60px;"
              @click.prevent="searchEvent"
            >
              搜索
            </el-button>
            <el-button
              class="btn btn-outline-secondary"
              size="medium"
              style="width: 150px;"
              @click.prevent="clearSearch"
            >
              清空篩選條件
            </el-button>
          </el-form-item>
        </el-form>
      </template>
    </button-search>
    <el-table class="mt-3" border :data="tableData" style="width: 100%">
      <el-table-column label="會員" prop="username" width="300" align="center">
        <template #default="scope">
          <div class="media">
            <img
              :src="scope.row.avatar"
              class="mr-3"
              style="width:50px;height:50px;border-radius:100%;"
            />
            <div class="media-body">
              <h6 class="mt-0 d-flex align-items-center">
                {{ scope.row.username }}
                <el-button type="text" size="mini" class="ml-auto">
                  詳情
                </el-button>
              </h6>
              <h6 class="mt-0 d-flex align-items-center">
                用戶id: {{ scope.row.id }}
              </h6>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="會員等級" width="120" align="center">
        <template #default="scope">
          {{ scope.row.user_level.name }}
        </template>
      </el-table-column>
      <el-table-column label="登入/註冊" width="300" align="center">
        <template #default="scope">
          <div class="">登入時間: {{ scope.row.last_login_time }}</div>
          <div class="">註冊時間: {{ scope.row.create_time }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="狀態" align="center" width="100">
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
            @click.prevent="deleteItem(scope)"
            >重設密碼</el-button
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
    <el-dialog title="添加規格" v-model="createModel" top="5vh">
      <!-- 表單內容 -->
      <el-form :model="form">
        <el-form-item label="用戶名稱" prop="username" label-width="">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密碼" label-width="" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="暱稱" prop="nickname" label-width="">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>

        <el-form-item label="頭像" label-width="">
          <div class="">
            <span
              v-if="!form.avatar"
              class="btn btn-light border "
              @click.prevent="chooseImage"
              ><i class="el-icon-plus"></i
            ></span>
            <img
              v-else
              :src="form.avatar"
              class="rounded"
              style="width:45px;height:45px; cursor: pointer;"
              @click="chooseImage"
            />
          </div>
        </el-form-item>

        <el-form-item label="等級" label-width="">
          <el-select v-model="form.user_level_id" size="medium">
            <el-option
              v-for="(level, index) in user_level"
              :key="index"
              :label="level.name"
              :value="level.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手機號碼" prop="phone" label-width="">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email" label-width="">
          <el-input v-model="form.email"></el-input>
        </el-form-item>

        <el-form-item label="狀態" label-width="" prop="value">
          <el-radio-group v-model="form.status" size="mini">
            <el-radio :label="1" border>啟用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
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
      preUrl: 'user',
      tableData: [],

      user_level: [],

      createModel: false,
      editIndex: -1,
      search: {
        keyword: '',
        user_level_id: '',
      },
      form: {
        username: '',
        password: '',
        nickname: '',
        avatar: '',
        user_level_id: 1,
        phone: '',
        email: '',
        status: 1,
      },
    }
  },
  components: {
    ButtonSearch,
  },
  computed: {},
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
      console.log(e)
      this.tableData = e.list
      this.user_level = e.user_level
    },
    /**複寫 mixins */
    getListUrl() {
      return `/admin/${this.preUrl}/${this.page.currentPage}?limit=${this.page.pageSize}&keyword=${this.search.keyword}&user_level_id=${this.user_level_id}`
    },
    // 搜索事件
    searchEvent(e = false) {
      // 簡單搜索
      if (typeof e === 'string') {
        console.log('簡單搜索事件 待 API 串接 =>', e)
        this.search.keyword = e
        this.getList()
        return
      }
      // 高級搜索
      console.log('高級搜索事件 待 API 串接')
      this.getList()
    },
    // 清空篩選條件
    clearSearch() {
      this.search = {
        keyword: '',
        user_level_id: '',
      }
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
          username: '',
          password: '',
          nickname: '',
          avatar: '',
          user_level_id: 3,
          phone: '',
          email: '',
          status: 1,
        }
        this.editIndex = -1
      } else {
        // 修改
        this.form = {
          username: e.row.username,
          password: '',
          nickname: e.row.nickname,
          avatar: e.row.avatar,
          user_level_id: e.row.user_level_id,
          phone: e.row.phone,
          email: e.row.email,
          status: e.row.status,
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
      this.addOrEdit(this.form, id)
      this.createModel = false
      
    },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
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
