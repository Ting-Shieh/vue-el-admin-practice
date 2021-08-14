<template>
  <div class="bg-white px-3" style="margin: -16px -20px 0px -20px;">
    <el-tabs v-model="tabIndex" @tab-click="handleClick">
      <!--  -->
      <el-tab-pane label="支付設定">
        <el-table class="mt-3" border :data="tableData" style="width: 100%">
          <el-table-column label="支付方式" align="center">
            <template #default="scope">
              <div class="d-flex align-items-center justify-content-around">
                <img
                  :src="scope.row.imageurl"
                  alt=""
                  class="rounded"
                  style="width:70px;height:70px;"
                />
                <div class="d-flex flex-column">
                  <h5 class="">{{ scope.row.name }}</h5>
                  <h6 class="text-secondary">{{ scope.row.desc }}</h6>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="">
            <template #default="scope">
              <el-button
                type="text"
                size="mini"
                plain
                @click="openDrawer(scope.row.key)"
                >配置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!--  -->
      <el-tab-pane label="購物設定">
        <el-form :model="form">
          <el-form-item label="尚未支付訂單" label-width="">
            <el-input
              type="number"
              v-model="form.close_order_minute"
              size="mini"
              style="width:30%;"
              ><template #append>天後自動關閉</template></el-input
            >
            <small class="d-block"
              >訂單下定後未付款,n天後將自動關閉，設定0天將不自動關閉</small
            >
          </el-form-item>
          <el-form-item label="已發貨訂單" label-width="">
            <el-input
              type="number"
              v-model="form.auto_received_day"
              size="mini"
              style="width:30%;"
              ><template #append>天後自動確認收貨</template></el-input
            >
            <small class="d-block"
              >如果在期間未確認收貨，系統將自動完成，設定0天將不自動收貨</small
            >
          </el-form-item>

          <el-form-item label="已完成訂單" label-width="">
            <el-input
              type="number"
              v-model="form.after_sale_day"
              size="mini"
              style="width:30%;"
              ><template #append>天後允許申請退貨</template></el-input
            >
            <small class="d-block"
              >訂單完成後,用戶可以在n天內發起退貨申請，設定0天將不允許申請退貨</small
            >
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" @click="submit"
              >保存</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 配置權限  -->
    <el-drawer
      title="配置"
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
          class="p-2"
          style="
            position: absolute;
            top: 0px;
            bottom: 60px;
            left: 0px;
            right: 0px;
            overflow-y: auto;
          "
        >
          <el-form v-if="drawerType === 'alipay'">
            <el-form-item label="app_id" label-width="">
              <el-input v-model="form.alipay.app_id"></el-input>
            </el-form-item>
            <el-form-item label="公鑰" label-width="">
              <el-input
                type="textarea"
                rows="4"
                v-model="form.alipay.ali_public_key"
              ></el-input>
            </el-form-item>

            <el-form-item label="私鑰" label-width="">
              <el-input
                type="textarea"
                rows="4"
                v-model="form.alipay.private_key"
              ></el-input>
            </el-form-item>
          </el-form>

          <el-form v-if="drawerType === 'wxpay'">
            <el-form-item label="公眾號 APPID" label-width="">
              <el-input v-model="form.wxpay.app_id"></el-input>
            </el-form-item>
            <el-form-item label="小程序 APPID" label-width="">
              <el-input v-model="form.wxpay.miniapp_id"></el-input>
            </el-form-item>
            <el-form-item label="小程序 secret" label-width="">
              <el-input v-model="form.wxpay.secret"></el-input>
            </el-form-item>
            <el-form-item label="APPID" label-width="">
              <el-input v-model="form.wxpay.app_id"></el-input>
            </el-form-item>
            <el-form-item label="商號" label-width="">
              <el-input v-model="form.wxpay.mch_id"></el-input>
            </el-form-item>
            <el-form-item label="API密鑰" label-width="">
              <el-input v-model="form.wxpay.key"></el-input>
            </el-form-item>
            <el-form-item label="cert_client" label-width="">
              <el-upload
                action="/admin/sysconfig/upload"
                :on-success="uploadClientSuccess"
                :limit="1"
                accept=".pem"
                :headers="{ token: $store.state.user.token }"
              >
                <el-button size="small" type="primary">點擊上傳</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    <div class="text-danger">
                      {{
                        form.wxpay.cert_client
                          ? form.wxpay.cert_client
                          : '未配置'
                      }}
                    </div>
                    <div class="text-muted small">EX: apiclient_cert.pem</div>
                  </div>
                </template>
              </el-upload>
            </el-form-item>

            <el-form-item label="cert_key" label-width="">
              <el-upload
                action="/admin/sysconfig/upload"
                :on-success="uploadKeySuccess"
                :limit="1"
                accept=".pem"
                :headers="{ token: $store.state.user.token }"
              >
                <el-button size="small" type="primary">點擊上傳</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    <div class="text-danger">
                      {{ form.wxpay.cert_key ? form.wxpay.cert_key : '未配置' }}
                    </div>
                    <div class="text-muted small">EX: apiclient_key.pem</div>
                  </div>
                </template>
              </el-upload>
            </el-form-item>
          </el-form>
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
            @click.stop="submit"
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
  inject: ['layout'],
  mixins: [common],
  data() {
    return {
      tabIndex: 0,
      form: {
        // 物流跟蹤
        customer: '',
        key: '',
      },
      tableData: [
        {
          name: '阿里支付',
          key: 'alipay',
          desc: '該系統支持信用卡支付',
          imageurl: 'https://pic.pimg.tw/ayaka527/1442821821-2545659404.jpg',
        },
        {
          name: '微信支付',
          key: 'wxpay',
          desc: '該系統支持即時到帳接口',
          imageurl:
            'https://media.cakeresume.com/image/upload/s--jpvT46Pl--/c_pad,fl_png8,h_400,w_400/v1553049103/wmkol6okuyb0gjpukxev.png',
        },
        // {
        //   name: 'LinePay',
        //   key:'alipay',
        //   desc: '該系統支持掃描QR碼支付',
        //   imageurl:
        //     'https://image-cdn-flare.qdm.cloud/q5951d0a27a335/image/data/925645ea38460b193a01fb92fb543933.jpg',
        // },
      ],
      preUrl: 'sysconfig',
      form: {
        close_order_minute: 0,
        auto_received_day: 0,
        after_sale_day: 0,
        alipay: { app_id: '', ali_public_key: '', private_key: '' },
        wxpay: {
          app_id: '', // 公众号 APPID
          miniapp_id: '', // 小程序 APPID
          secret: '', // 小程序secret
          appid: '', // appid
          mch_id: '', // 商户号
          key: '', // API 密钥
          cert_client: '',
          cert_key: '',
        },
      },
      drawer: false,
      drawerType: 'alipay', //
      direction: 'rtl', // right to left
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
    // 加載數據
    handleClick(tab, event) {
      console.log(tab, tab.index)
    },
    uploadClientSuccess(response, file, fileList) {
      this.form.wxpay.cert_client = response.data
    },
    uploadKeySuccess(response, file, fileList) {
      this.form.wxpay.cert_key = response.data
    },
    submit() {
      this.drawer = false
      this.layout.showLoading()
      this.$axios
        .post(`/admin/${this.preUrl}`, this.form, { token: true })
        .then((res) => {
          this.$message({
            message: '上傳成功',
            type: 'success',
          })
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    //
    openDrawer(key) {
      this.drawerType = key
      this.drawer = true
    },
    // 關閉drawer
    handleClose(done) {
      this.$confirm('確認關閉？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang=""></style>
