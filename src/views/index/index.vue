<template>
  <!--DashBoard 首頁 -->
  <div class="">
    <!-- 數據統計 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, idx) in counts" :key="item.name">
        <el-card class="box-card" shadow="hover">
          <div class="d-flex align-items-center ">
            <i
              :class="[item.icon, item.color]"
              class="text-white h4 mb-0 text-center mr-4"
              style="width:40px;height:40px;line-height: 40px;"
            ></i>
            <div class="">
              <h4 class="mb-1">{{ item.num }}</h4>
              <small class="text-muted">{{ item.desc }}</small>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 店鋪，訂單提示 | 統計圖 -->
    <el-row :gutter="20" class="mt-3">
      <!-- 店鋪，訂單，交易提示  -->
      <el-col :span="12" class="d-flex flex-column " style="height: 470px;">
        <el-card
          class="box-card "
          shadow="never"
          v-for="(tip, idx) in tips"
          :key="idx"
        >
          <template #header>
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <span>{{ tip.title }}</span>
              <el-button class="button" type="text">{{ tip.desc }}</el-button>
            </div>
          </template>
          <div class="row ">
            <div :class="list.col" v-for="(list, idx) in tip.list" :key="idx">
              <button class="btn btn-light w-100">
                <h4 class="mb-1">{{ list.value }}</h4>
                <small class="text-center">{{ list.name }}</small>
              </button>
            </div>
          </div>
        </el-card>
        <!-- <el-card class="box-card" shadow="never">
          <template #header>
            <div class="card-header">
              <span>交易提示</span>
              <el-button class="button" type="text">操作按钮</el-button>
            </div>
          </template>
          <div class="row">
            <div class="col-2">
              <button class="btn btn-light w-100">
                <h4 class="mb-1">64</h4>
                <small class="text-center">出售中</small>
              </button>
            </div>
            <div class="col-2">
              <button class="btn btn-light w-100">
                <h4 class="mb-1">64</h4>
                <small class="text-muted">出售中</small>
              </button>
            </div>
            <div class="col-2">
              <button class="btn btn-light w-100">
                <h4 class="mb-1">64</h4>
                <small class="text-center">出售中</small>
              </button>
            </div>
            <div class="col-2">
              <button class="btn btn-light w-100">
                <h4 class="mb-1">64</h4>
                <small class="text-center">出售中</small>
              </button>
            </div>
            <div class="col-2">
              <button class="btn btn-light w-100">
                <h4 class="mb-1">64</h4>
                <small class="text-center">出售中</small>
              </button>
            </div>
            <div class="col-2">
              <button class="btn btn-light w-100">
                <h4 class="mb-1">64</h4>
                <small class="text-center">出售中</small>
              </button>
            </div>
          </div>
        </el-card> -->
      </el-col>
      <!-- 統計圖 -->
      <el-col :span="12">
        <el-card class="box-card" style="height: 470px;" shadow="never">
          <template #header>
            <div class="card-header">
              <span>統計圖</span>
              <el-button class="button" type="text">操作按钮</el-button>
            </div>
          </template>
          <!-- 統計圖容器 -->
          <div ref="myChart" style="width: 100%;height:400px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 銷售情況統計| 商品銷售排名 -->
    <el-row :gutter="20" class="mt-3">
      <!--  -->
      <el-col :span="12" class="">
        <el-card class="box-card" style="height: 370px;" shadow="never">
          <template #header>
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <span>銷售情況統計</span>
              <el-button class="button" type="text"
                >按週期統計商家店舖訂單量和訂單金額</el-button
              >
            </div>
          </template>
          <div
            class="media align-items-center w-100 border"
            style="padding-y:0;"
          >
            <span class="border-right py-4 px-3 bg-light ">昨日銷量</span>

            <div class="media-body " style="margin:0;padding:0;">
              <div class="pl-3 py-1 mb-2 border-bottom">
                <span class="mr-2">訂單量(件)</span>12
              </div>
              <div class="pl-3 mt-2">
                <span class="mr-2">訂單金額(NTD)</span>2400
              </div>
            </div>
          </div>
          <div
            class="media align-items-center w-100 border mt-3"
            style="padding-y:0;"
          >
            <span class="border-right py-4 px-3 bg-light ">本月銷量</span>

            <div class="media-body " style="margin:0;padding:0;">
              <div class="pl-3 py-1 mb-2 border-bottom">
                <span class="mr-2">訂單量(件)</span>12
              </div>
              <div class="pl-3 mt-2">
                <span class="mr-2">訂單金額(NTD)</span>36,000
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <!--  -->
      <el-col :span="12" class="">
        <el-card class="box-card" style="height: 400px;" shadow="never">
          <template #header>
            <div
              class="card-header d-flex justify-content-between align-items-center"
            >
              <span>商品銷售排名</span>
              <el-button class="button" type="text"
                >按週期統計商家店舖訂單量和訂單金額</el-button
              >
            </div>
          </template>
          <el-table :data="tableData" height="250" border style="width: 100%">
            <el-table-column type="index" label="#"  width="100">
            </el-table-column>
            <el-table-column prop="name" label="商品品項" >
            </el-table-column>
            <el-table-column prop="num" label="銷售量" width="150"> </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      // 數據統計
      counts: [
        {
          icon: 'el-icon-user-solid ',
          num: 66,
          desc: '關注人數(人)',
          color: 'bg-primary',
        },
        {
          icon: 'el-icon-s-order',
          num: 56,
          desc: '訂單總數(筆)',
          color: 'bg-success',
        },
        {
          icon: 'el-icon-receiving',
          num: 1688,
          desc: '今日訂單總金額(NTD)',
          color: 'bg-danger',
        },
        {
          icon: 'el-icon-s-data',
          num: 33,
          desc: '本月銷售量(筆)',
          color: 'bg-warning',
        },
      ],
      // 店鋪，訂單，交易提示
      tips: [
        // 店鋪，訂單提示
        {
          title: '店鋪及商品提示',
          desc: '需要關注的店鋪訊息及待處理事項',
          list: [
            {
              name: '出售中',
              value: 37,
              col: 'col-3',
            },
            {
              name: '待回復',
              value: 10,
              col: 'col-3',
            },
            {
              name: '庫存預警',
              value: 0,
              col: 'col-3',
            },
            {
              name: '倉庫中',
              value: 27,
              col: 'col-3',
            },
          ],
        },
        // 交易提示
        {
          title: '交易提示',
          desc: '需要立即處理的交易訂單',
          list: [
            {
              name: '待付款',
              value: 0,
              col: 'col-2',
            },
            {
              name: '待發貨',
              value: 10,
              col: 'col-2',
            },
            {
              name: '已發貨',
              value: 0,
              col: 'col-2',
            },
            {
              name: '已收貨',
              value: 3,
              col: 'col-2',
            },
            {
              name: '退款中',
              value: 3,
              col: 'col-2',
            },
            {
              name: '待售後',
              value: 3,
              col: 'col-2',
            },
          ],
        },
      ],

      //
      option: {
        title: {
          text: '堆叠区域图',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎'],
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            label: {
              show: true,
              position: 'top',
            },
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
      },
      //
      tableData: [
        {
          name: 'Product 1 From USA',
          num: 9
        },
        {
          name: 'Product 2',
          num: 28
        },
        {
          name: 'Product 3',
          num: 33
        },
        {
          name: 'Product 4',
          num: 99
        },
        {
          name: 'Product 5',
          num: 59
        },
        {
          name: 'Product 6',
          num: 109
        },
        {
          name: 'Product 7',
          num: 77
        },
        {
          name: 'Product 8',
          num: 28
        }, 
      ],
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
    // 畫統計圖
    drawLine() {
      // console.log("myChart=>",this.$refs.myChart)  //獲取 dom 元素

      // init echarts
      let myChart = echarts.init(this.$refs.myChart)

      //配置
      myChart.setOption(this.option)
    },
  },
  created() {},
  // Dom 渲染完畢
  mounted() {
    // 畫統計圖
    this.drawLine()
  },
  updated() {},
  unmounted() {},
  // vue3 已拔除
  // filters: {},
}
</script>

<style scoped lang="scss">
.this {
  border: 1px solid red;
}
</style>
