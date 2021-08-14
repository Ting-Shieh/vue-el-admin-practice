<template>
  <div class="container">
    <div class="row">
      <div
        class=" col-12  col-sm-9 col-md-8 col-lg-6 m-auto pt-5"
        style="height:500px;"
      >
        <div class="card mt-5">
          <div class="card-header bg-white">
            <h3 class="text-center mb-0 text-secondary font-weight-bold">
              {{ $conf.logo }}
            </h3>
          </div>
          <div class="card-body">
            <el-form ref="ruleForm" :model="form" :rules="rules">
              <el-form-item prop="username">
                <el-input
                  v-model="form.username"
                  size="medium"
                  placeholder="請輸入帳號"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="form.password"
                  size="medium"
                  @input="change($event)"
                  placeholder="請輸入密碼"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="medium"
                  class="w-100"
                  @click="submitForm"
                  :loading="loading"
                  >{{loading?'Login...請稍等':'Login'}}</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      loading:false,
      form: {
        username: 'admin',
        password: 'admin',
      },
      rules: {
        username: [
          { required: true, message: '請輸入帳號(必填)', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '請輸入密碼(必填)', trigger: 'blur' },
        ],
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
    ...mapGetters(['adminIndex',])
  },
  watch: {},
  methods: {
    // type your function
    change(e) {
      this.$forceUpdate()
    },
    submitForm(e) {
      // console.log(this.$refs)

      // this.$refs[formName].validate((valid) => {
      //   if (!e) return
      //   //提交表單
      //   this.$router.puah({ name: 'index' })
      // })
      this.$refs.ruleForm.validate((e) => {
        if (!e) return

        //提交表單
        this.loading=true
        this.$axios
          .post('/admin/login', this.form)
          .then((res) => {
            // console.log(res)
            let data = res.data.data
            // 存儲到 vuex
            // 存儲到 本地存儲
            this.$store.commit('login', data)
            // 存儲權限rules
            if(data.role && data.role.rules){
              window.sessionStorage.setItem('rules',JSON.stringify(data.role.rules))
            }
            
            // 生成後臺菜單
            this.$store.commit('createNavBar', data.tree)
            // 成功提示
            this.$message("登入成功")
            this.loading=false
            // 跳轉後台首頁
            this.$router.push({name: this.adminIndex})
          }).catch(err=>{
            this.loading=false
          })
          
        // this.$router.puah({name: 'index'})
      })
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
</style>
