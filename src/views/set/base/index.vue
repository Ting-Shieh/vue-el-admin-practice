<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px;">
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <!--  -->
      <el-tab-pane label="註冊與訪問">
        <el-form :model="form" label-width="160px">
          <el-form-item label="是否允許註冊會員" label-width="">
            <el-radio-group v-model="form.open_reg" size="mini">
              <el-radio-button :label="1"> 是</el-radio-button>
              <el-radio-button :label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="註冊類型" label-width="">
            <el-radio-group v-model="form.reg_method" size="mini">
              <el-radio-button label="username">普通註冊</el-radio-button>
              <el-radio-button label="phone">手機註冊</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密碼最小長度" label-width="">
            <el-input
              type="number"
              v-model="form.password_min"
              placeholder="密碼最小長度"
              size="mini"
              style="width:30%;"
            ></el-input>
          </el-form-item>
          <el-form-item label="強制密碼複雜度" label-width="">
            <el-checkbox-group v-model="form.password_encrypt" size="small">
              <el-checkbox-button label="0">數字</el-checkbox-button>
              <el-checkbox-button label="1">小寫字母</el-checkbox-button>
              <el-checkbox-button label="2">大寫字母</el-checkbox-button>
              <el-checkbox-button label="3">符號</el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <!--  -->
      <el-tab-pane label="上傳設置">
        <el-form :model="form" label-width="160px">
          <el-form-item label="默認上傳方式" label-width="">
            <el-radio-group v-model="form.upload_method" size="mini">
              <el-radio-button label="local">本地存儲</el-radio-button>
              <el-radio-button label="oss">OSS</el-radio-button>
              <!-- <el-radio-button label="AWS">AWS存儲</el-radio-button>
              <el-radio-button label="GCP">GCP存儲</el-radio-button> -->
            </el-radio-group>
          </el-form-item>
          <template v-if="form.upload_method === 'oss'">
            <el-form-item label="Bucket" label-width="">
              <el-input
                type="text"
                v-model="form.upload_config.Bucket"
                placeholder="Bucket"
                size="mini"
                style="width:30%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="ACCESS_KEY" label-width="">
              <el-input
                type="text"
                v-model="form.upload_config.ACCESS_KEY"
                placeholder="ACCESS_KEY"
                size="mini"
                style="width:55%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="SECRET_KEY" label-width="">
              <el-input
                type="text"
                v-model="form.upload_config.SECRET_KEY"
                placeholder="SECRET_KEY"
                size="mini"
                style="width:55%;"
              ></el-input>
            </el-form-item>
            <el-form-item label="空間域名">
              <el-input
                type="text"
                v-model="form.upload_config.http"
                placeholder="空間域名"
                size="mini"
                style="width:55%;"
              ></el-input>
              <small class="d-block">請補全 http:// 或 https://</small>
            </el-form-item></template
          >
        </el-form>
      </el-tab-pane>
      <!--  -->
      <el-tab-pane label="API安全">
        <el-form :model="form" label-width="160px">
          <el-form-item label="是否開啟API安全" label-width="">
            <el-radio-group v-model="form.api_safe" size="mini">
              <el-radio-button :label="1"> 是</el-radio-button>
              <el-radio-button :label="0">否</el-radio-button>
            </el-radio-group>
            <small class="d-block"
              >開啟API安全功能後調用前端api需傳輸簽名串</small
            >
          </el-form-item>
          <el-form-item label="秘鑰" label-width="">
            <el-input
              type="text"
              v-model="form.api_secret"
              placeholder="秘鑰"
              size="mini"
              style="width:40%;"
            ></el-input>
            <small class="d-block"
              >秘鑰設置關係系統中api調用傳輸簽名串編碼規則，以及會員token解析，請慎重設置，注意設定後對應會員要求重新登入獲取token</small
            >
          </el-form-item>
        </el-form></el-tab-pane
      >
    </el-tabs>
    <el-form label-width="160px">
      <el-button type="success" size="small" @click="submit">保存</el-button>
    </el-form>
  </div>
</template>

<script>
import common from '@/common/mixins/common.js'
export default {
  inject: ['layout'],
  mixins: [common],
  data() {
    return {
      preUrl: 'sysconfig',
      tabIndex: 0,
      form: {
        // 註冊與訪問
        open_reg: 1,
        reg_method: 'username',
        password_min: 0,
        password_encrypt: ['0'],
        // 上傳設置
        upload_method: 'local',
        upload_config: {
          Bucket: '',
          ACCESS_KEY: '',
          SECRET_KEY: '',
          http: '',
        },

        // API安全
        api_safe: 1,
        api_secret: '',
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
  computed: {},
  watch: {},
  methods: {
    getListUrl() {
      return `/admin/${this.preUrl}`
    },
    getListResult(e) {
      //  console.log(e)

      this.form = e
      this.form.password_encrypt = this.form.password_encrypt.split(',')
      // console.log(this.form)
    },
    submit() {
       this.form.password_encrypt =this.form.password_encrypt.join(',')
      this.layout.showLoading()
      this.$axios
        .post(`/admin/${this.preUrl}`, this.form, { token: true })
        .then((res) => {
          this.$message({
            message: '修改成功',
            type: 'success',
          })
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // 加載數據
    handleClick(tab, event) {
      console.log(tab, tab.index)
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

<style scoped lang=""></style>
