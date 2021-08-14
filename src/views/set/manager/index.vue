<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px">
    <el-tabs v-model="preUrl" @tab-click="getList">
      <!-- 管理員列表 -->
      <el-tab-pane label="管理員列表" name="manager">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="small" @click="openDialog('manager')"
            >新增管理員</el-button
          >
          <div class="d-flex align-items-center ml-auto">
            <el-input
              type="text"
              size="small"
              v-model="keyword"
              class="mr-2"
              style="width: 250px"
              placeholder="請輸入用戶名.."
            ></el-input>
            <el-button type="primary" size="small" @click="getList"
              >搜尋</el-button
            >
          </div>
        </div>
        <el-table class="mt-3" border :data="managerList" style="width: 100%">
          <el-table-column label="用戶頭像" width="120" align="center">
            <template #default="scope">
              <el-avatar size="large" :src="scope.row.avatar"></el-avatar>
            </template>
          </el-table-column>

          <el-table-column
            label="登入帳號"
            prop="username"
            width="180"
            align="center"
          >
          </el-table-column>

          <el-table-column label="所屬管理員" width="150" align="center">
            <template #default="scope">
              {{ scope.row.role.name }}
            </template>
          </el-table-column>
          <el-table-column
            label="狀態"
            prop="status"
            align="center"
            width="100"
          >
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
                @click="openDialog('manager', scope.row)"
                >修改</el-button
              >

              <el-button type="text" size="mini" @click="deleteItem(scope.row)"
                >刪除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 角色列表 -->
      <el-tab-pane label="角色列表" name="role">
        <div class="d-flex align-items-center">
          <el-button type="primary" size="small" @click="openDialog('role')"
            >新增角色</el-button
          >
        </div>
        <el-table class="mt-3" border :data="roleList" style="width: 100%">
          <el-table-column label="角色名稱" prop="name" width="" align="center">
          </el-table-column>

          <el-table-column label="角色描述" prop="desc" width="" align="center">
          </el-table-column>

          <el-table-column label="狀態" prop="" align="center" width="">
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
                @click="openDialog('role', scope.row)"
                >修改</el-button
              >
              <el-button type="text" size="mini" @click="openDrawer(scope.row)"
                >配置權限</el-button
              >
              <el-button type="text" size="mini" @click="deleteItem(scope.row)"
                >刪除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 權限列表 -->
      <el-tab-pane label="權限列表" name="rule">
        <div class="">
          <el-button
            type="success"
            class="mt-2 mb-3"
            size="medium"
            @click.prevent="openDialog('rule')"
          >
            新增規則
          </el-button>
        </div>
        <el-tree
          :data="ruleList"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
        >
          <template #default="{ node, data }">
            <span class="custom-tree-node" style="">
              <div class="">
                <span
                  v-if="data.menu"
                  class="mr-2 text-muted"
                  :class="data.icon ? data.icon : 'el-icon-star-off'"
                ></span>
                <small v-else class="mr-2 text-muted">{{ data.method }}</small>
                <span>{{ data.name }} </span>
                <span v-if="data.menu" class="badge ml-2">{{
                  data.frontpath
                }}</span>
                <span v-else class="badge badge-secondary ml-2">{{
                  data.condition
                }}</span>
              </div>

              <span class="">
                <el-button
                  size="mini"
                  :type="data.status ? 'success' : 'danger'"
                  @click.prevent="changeStatus(data)"
                >
                  {{ data.status ? '啟用' : '禁用' }}
                </el-button>
                <!-- v-auth="'添加规则'" 要照課程給的api 內容填 -->
                <el-button
                  type="text"
                  class="mr-2"
                  size="mini"
                  v-auth="'添加规则'"
                  @click.stop="openDialog('rule', data.id)"
                >
                  增加
                </el-button>
                <el-button
                  type="text"
                  class="mr-2"
                  size="mini"
                  @click.stop="openDialog('rule', data)"
                >
                  修改
                </el-button>
                <el-button
                  type="text"
                  class="mr-2"
                  size="mini"
                  @click.stop="deleteItem(data)"
                >
                  刪除
                </el-button>
              </span>
            </span>
          </template>
        </el-tree>
      </el-tab-pane>
    </el-tabs>

    <!-- 佔位 -->
    <div class="" style="height: 65px"></div>
    <!-- 分頁 -->
    <el-footer
      v-if="preUrl !== 'rule'"
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

    <!-- dialog -->
    <el-dialog
      title="提示"
      v-model="dialogVisible"
      width="70%"
      :before-close="handleClose"
    >
      <!-- 表單內容 -->
      <!-- 新增/修改 管理員 -->
      <el-form v-if="preUrl === 'manager'" :model="form.manager">
        <el-form-item label="用戶名稱" prop="username" label-width="">
          <el-input v-model="form.manager.username"></el-input>
        </el-form-item>
        <el-form-item label="密碼" label-width="" prop="password">
          <el-input v-model="form.manager.password"></el-input>
        </el-form-item>

        <el-form-item label="頭像" label-width="">
          <div class="">
            <span
              v-if="!form.manager.avatar"
              class="btn btn-light border"
              @click.prevent="chooseImage"
              ><i class="el-icon-plus"></i
            ></span>
            <img
              v-else
              :src="form.manager.avatar"
              class="rounded"
              style="width: 45px; height: 45px; cursor: pointer"
              @click="chooseImage"
            />
          </div>
        </el-form-item>

        <el-form-item label="角色" label-width="">
          <el-select
            v-model="form.manager.role_id"
            size="medium"
            placeholder="所屬角色"
          >
            <el-option
              v-for="(role, index) in roleOptions"
              :key="index"
              :label="role.name"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="狀態" label-width="">
          <el-radio-group v-model="form.manager.status" size="mini">
            <el-radio :label="1" border>啟用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 新增/修改 角色 -->
      <el-form v-if="preUrl === 'role'" :model="form.role">
        <el-form-item label="角色名稱" prop="name" label-width="">
          <el-input v-model="form.role.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="" prop="desc">
          <el-input type="textarea" v-model="form.role.desc"></el-input>
        </el-form-item>

        <el-form-item label="狀態" label-width="">
          <el-radio-group v-model="form.role.status" size="mini">
            <el-radio :label="1" border>啟用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!-- 新增/修改 權限 -->
      <el-form v-if="preUrl === 'rule'" :model="form.rule">
        <el-form-item label="上級規則" label-width="">
          <el-select
            v-model="form.rule.rule_id"
            size="medium"
            placeholder="上級規則"
          >
            <el-option label="頂級規則" :value="0"></el-option>
            <el-option
              v-for="(rule, index) in ruleOptions"
              :key="index"
              :label="rule.name"
              :value="rule.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜單規則" label-width="">
          <el-radio-group v-model="form.rule.menu" size="mini">
            <el-radio :label="1" border>菜單</el-radio>
            <el-radio :label="0" border>規則</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名稱" label-width="">
          <el-input v-model="form.rule.name"></el-input>
        </el-form-item>

        <!--  -->
        <el-form-item v-if="form.rule.menu" label="圖標" label-width="">
          <el-input v-model="form.rule.icon"></el-input>
        </el-form-item>
        <el-form-item
          v-if="form.rule.menu && form.rule.rule_id > 0"
          label="前端路徑"
          label-width=""
        >
          <el-input v-model="form.rule.frontpath"></el-input>
        </el-form-item>
        <el-form-item v-if="form.rule.menu" label="前端路徑名稱" label-width="">
          <el-input v-model="form.rule.desc"></el-input>
        </el-form-item>

        <el-form-item v-if="!form.rule.menu" label="後端規則" label-width="">
          <el-input v-model="form.rule.condition"></el-input>
        </el-form-item>
        <el-form-item v-if="!form.rule.menu" label="請求方式" label-width="">
          <el-select
            v-model="form.rule.method"
            size="medium"
            placeholder="請求方式"
          >
            <el-option label="GET" value="GET"></el-option>
            <el-option label="POST" value="POST"></el-option>
            <el-option label="PUT" value="PUT"></el-option>
            <el-option label="DELETE" value="DELETE"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="狀態" label-width="">
          <el-radio-group v-model="form.rule.status" size="mini">
            <el-radio :label="1" border>啟用</el-radio>
            <el-radio :label="0" border>禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submit">確定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 配置權限  -->
    <el-drawer
      title="配置權限"
      size="40%"
      v-model="drawer"
      :direction="direction"
      :before-close="handleClose"
      destroy-on-close
    >
      <div
        class="border-top"
        style="
          position: absolute;
          top: 55px;
          bottom: 0px;
          left: 0px;
          right: 0px;
        "
      >
        <div
          class=""
          style="
            position: absolute;
            top: 0px;
            bottom: 60px;
            left: 0px;
            right: 0px;
            overflow-y: auto;
          "
        >
          <el-tree
            :data="ruleList"
            show-checkbox
            node-key="id"
            default-expanded-all
            :default-checked-keys="checkedKeys"
            :props="defaultProps"
            :check-strictly="true"
            @check="check"
          >
          </el-tree>
        </div>
        <div
          class="
            d-flex
            align-items-center
            border-top
            position-absolute
            justify-content-center
            bg-white
          "
          style="height: 60px; bottom: 0px; right: 0px; left: 0px; width: 100%"
        >
          <el-button
            type="danger"
            class="mr-2"
            size="medium"
            @click="drawer = false"
          >
            取消 </el-button
          ><el-button
            type="success"
            class="mr-2"
            size="medium"
            @click.stop="submitRules"
          >
            確定
          </el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import common from '@/common/mixins/common.js'
export default {
  inject: ['layout', 'app'],
  mixins: [common],
  data() {
    return {
      preUrl: 'manager',
      // tabIndex: 0,
      keyword: '',
      managerList: [],
      roleList: [],

      ruleList: [],
      defaultProps: {
        children: 'child',
        label: 'name',
      },
      dialogVisible: false,
      dialogType: 'manager',
      roleOptions: [],
      ruleOptions: [],
      dialogId: 0, // 0 新增|
      form: {
        manager: {
          username: '',
          password: '',
          avatar: '',
          role_id: '',
          status: 1,
        },
        role: {
          name: '',
          desc: '',
          status: 1,
        },
        rule: {
          menu: 0, // 0 規則
          rule_id: '',
          name: '',
          status: 1,
          frontpath: '',
          desc: '',
          condition: '',
          icon: '',
          method: 'GET',
          order: 50,
        },
      },
      // 配置權限
      drawer: false,
      drawerId: 0, // 選中人的ID
      direction: 'rtl', // right to left
      //
      checkedKeys: [],
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
    labelTree() {
      // 閉包傳參
      return function(item) {
        if (item.level === 0) {
          return item.name
        }
        let str = ''
        for (let i = 0; item.level; i++) {
          str += i === 0 ? '|--' : '--'
        }
        return str + ' ' + item.name
      }
    },
  },
  watch: {},
  methods: {
    getListUrl() {
      return `/admin/${this.preUrl}/${this.page.currentPage}?limit=${this.page.pageSize}&keyword=${this.keyword}`
    },

    getListResult(e) {
      switch (this.preUrl) {
        case 'manager':
          this.managerList = e.list
          this.roleOptions = e.role
          break
        case 'role':
          console.log(e.list)
          this.roleList = e.list
          break
        case 'rule':
          this.ruleList = e.list
          this.ruleOptions = e.rules
          break
      }
    },

    // 加載數據
    handleClick(tab, event) {
      console.log(tab, tab.index)
    },
    // 打開dialog
    openDialog(type, item = false) {
      // 確認類型
      this.dialogType = type
      // 初始化表單
      switch (type) {
        case 'manager':
          if (!item) {
            // 新增
            this.form.manager = {
              username: '',
              password: '',
              avatar: '',
              role_id: 0,
              status: 1,
            }
            this.dialogId = 0
          } else {
            // 修改
            this.form.manager = {
              username: item.username,
              password: item.password,
              avatar: item.avatar,
              role_id: item.role_id,
              status: item.status,
            }
            this.dialogId = item.id
          }

          break
        case 'role':
          if (!item) {
            this.form.role = {
              name: '',
              desc: '',
              status: 1,
            }
            this.dialogId = 0
          } else {
            // 修改
            this.form.role = {
              name: item.name,
              desc: item.desc,
              status: item.status,
            }
            this.dialogId = item.id
          }
          break
        case 'rule':
          if (!item || typeof item === 'number') {
            this.form.rule = {
              menu: 0, // 0 規則
              rule_id: '',
              name: '',
              status: 1,
              frontpath: '',
              desc: '',
              condition: '',
              icon: '',
              method: 'GET',
              order: 50,
            }
            this.form.rule.rule_id = item
            this.dialogId = 0
          } else {
            // 修改
            this.form.rule = {
              menu: item.menu,
              rule_id: item.rule_id,
              name: item.name,
              status: item.status,
              frontpath: item.frontpath,
              desc: item.desc,
              condition: item.condition,
              icon: item.icon,
              method: item.method,
              order: 50,
            }
            this.dialogId = item.id
          }
          break
      }
      // show dialog
      this.dialogVisible = true
    },
    //選擇頭像
    chooseImage() {
      // console.log('this.app ===>', this.app)
      this.app.chooseImage((res) => {
        this.form.manager.avatar = res[0].url
      }, 1)
    },
    // 提交
    submit() {
      this.addOrEdit(this.form[this.preUrl], this.dialogId)
      this.dialogVisible = false
    },
    // 關閉dialog
    handleClose(done) {
      this.$confirm('確認關閉？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },

    // 打開抽屜
    openDrawer(item) {
      this.layout.showLoading()
      this.$axios
        .get('/admin/rule/1', { token: true })
        .then((res) => {
          this.drawer = true
          let data = res.data.data
          this.ruleList = data.list
          this.checkedKeys = item.rules.map((item) => item.id)
          ;(this.drawerId = item.id), // 選中人的ID
            this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // tree 選中
    check(...e) {
      this.checkedKeys = e[1].checkedKeys
    },
    // 配置權限提交
    submitRules() {
      this.layout.showLoading()
      this.$axios
        .post(
          '/admin/role/set_rules',
          {
            rule_ids: this.checkedKeys,
            id: this.drawerId,
          },
          { token: true }
        )
        .then((res) => {
          this.drawer = false
          this.getList()
          this.$message({
            message: '配置權限成功',
            type: 'success',
          })
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
  // vue3 拿掉 filters
  //filters: {
  //
  //},
}
</script>

<style scoped lang="scss">
.custom-tree-node {
  flex: 1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  font-size: 14px !important;
  padding-right: 8px !important;
}
</style>
