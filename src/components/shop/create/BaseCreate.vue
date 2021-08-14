<template>

    <!-- 基礎設置 -->
    <form>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">商品名稱</label>
        <div class="col-sm-6">
          <input
            type="text"
            class="form-control w-50"
            placeholder="請輸入商品名稱，不能超過30個字"
            :value="title"
            @change="vModel('title', $event.target.value)"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">商品分類</label>
        <div class="col-sm-8">
          <el-cascader
            v-model="category"
            @change="vModel('category', $event)"
            :options="options"
          ></el-cascader>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">商品描述</label>
        <div class="col-sm-6">
          <textarea
            type="text"
            class="form-control w-80"
            placeholder="(選填)，商品賣點簡述，EX:此款商品性能極強..."
            :value="desc"
            @change="vModel('desc', $event.target.value)"
          ></textarea>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">商品單位</label>
        <div class="col-sm-6">
          <input
            type="text"
            class="form-control w-50"
            placeholder="請輸入商品單位"
            :value="unit"
            @change="vModel('unit', $event.target.value)"
          />
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">總庫存</label>
        <div class="col-sm-6 d-flex">
          <input
            type="number"
            min="0"
            class="form-control w-50"
            placeholder="請輸入"
            :value="stock"
            @change="vModel('stock', $event.target.value)"
          />
          <div class="input-group-append">
            <span class="input-group-text" id="basic-addon2">件</span>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">庫存預警</label>
        <div class="col-sm-6 d-flex">
          <input
            type="number"
            min="0"
            class="form-control w-50 "
            placeholder=""
            :value="min_stock"
            @change="vModel('min_stock', $event.target.value)"
          />
          <div class="input-group-append">
            <span class="input-group-text" id="basic-addon2">件</span>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">庫存顯示</label>
        <div class="col-sm-8 mt-1">
          <div class="form-check form-check-inline">
            <label class="form-check-label" for="1"
              ><input
                class="form-check-input"
                type="radio"
                name="display_stock"
                value="1"
                @change="vModel('display_stock', parseInt($event.target.value))"
              />是</label
            >
            <label class="form-check-label" for="1"
              ><input
                class="form-check-input  ml-2"
                type="radio"
                name="display_stock"
                value="0"
                @change="vModel('display_stock', parseInt($event.target.value))"
              />否</label
            >
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">是否上架</label>
        <div class="col-sm-8 mt-1">
          <div class="form-check form-check-inline">
            <label class="form-check-label" for="1"
              ><input
                class="form-check-input"
                type="radio"
                name="status"
                value="0"
                @change="vModel('status', parseInt($event.target.value))"
              />放入倉庫</label
            >
            <label class="form-check-label ml-2" for="1"
              ><input
                class="form-check-input"
                type="radio"
                name="status"
                value="1"
                @change="vModel('status', parseInt($event.target.value))"
              />立即上架</label
            >
          </div>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-sm-2 col-form-label">運費模板</label>
        <div class="col-sm-6 d-flex">
          <select
            class="form-control"
            @change="vModel('express', $event.target.value)"
          >
            <option value="1">test1</option>
            <option value="2">test2</option>
          </select>
        </div>
      </div>
    </form>

</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      options: [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致',
                },
                {
                  value: 'fankui',
                  label: '反馈',
                },
                {
                  value: 'xiaolv',
                  label: '效率',
                },
                {
                  value: 'kekong',
                  label: '可控',
                },
              ],
            },
            {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航',
                },
                {
                  value: 'dingbudaohang',
                  label: '顶部导航',
                },
              ],
            },
          ],
        },
        {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局',
                },
                {
                  value: 'color',
                  label: 'Color 色彩',
                },
                {
                  value: 'typography',
                  label: 'Typography 字体',
                },
                {
                  value: 'icon',
                  label: 'Icon 图标',
                },
                {
                  value: 'button',
                  label: 'Button 按钮',
                },
              ],
            },
            {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框',
                },
                {
                  value: 'checkbox',
                  label: 'Checkbox 多选框',
                },
                {
                  value: 'input',
                  label: 'Input 输入框',
                },
                {
                  value: 'input-number',
                  label: 'InputNumber 计数器',
                },
                {
                  value: 'select',
                  label: 'Select 选择器',
                },
                {
                  value: 'cascader',
                  label: 'Cascader 级联选择器',
                },
                {
                  value: 'switch',
                  label: 'Switch 开关',
                },
                {
                  value: 'slider',
                  label: 'Slider 滑块',
                },
                {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器',
                },
                {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器',
                },
                {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器',
                },
                {
                  value: 'upload',
                  label: 'Upload 上传',
                },
                {
                  value: 'rate',
                  label: 'Rate 评分',
                },
                {
                  value: 'form',
                  label: 'Form 表单',
                },
              ],
            },
            {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格',
                },
                {
                  value: 'tag',
                  label: 'Tag 标签',
                },
                {
                  value: 'progress',
                  label: 'Progress 进度条',
                },
                {
                  value: 'tree',
                  label: 'Tree 树形控件',
                },
                {
                  value: 'pagination',
                  label: 'Pagination 分页',
                },
                {
                  value: 'badge',
                  label: 'Badge 标记',
                },
              ],
            },
            {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告',
                },
                {
                  value: 'loading',
                  label: 'Loading 加载',
                },
                {
                  value: 'message',
                  label: 'Message 消息提示',
                },
                {
                  value: 'message-box',
                  label: 'MessageBox 弹框',
                },
                {
                  value: 'notification',
                  label: 'Notification 通知',
                },
              ],
            },
            {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单',
                },
                {
                  value: 'tabs',
                  label: 'Tabs 标签页',
                },
                {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑',
                },
                {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单',
                },
                {
                  value: 'steps',
                  label: 'Steps 步骤条',
                },
              ],
            },
            {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框',
                },
                {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示',
                },
                {
                  value: 'popover',
                  label: 'Popover 弹出框',
                },
                {
                  value: 'card',
                  label: 'Card 卡片',
                },
                {
                  value: 'carousel',
                  label: 'Carousel 走马灯',
                },
                {
                  value: 'collapse',
                  label: 'Collapse 折叠面板',
                },
              ],
            },
          ],
        },
        {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components',
            },
            {
              value: 'sketch',
              label: 'Sketch Templates',
            },
            {
              value: 'jiaohu',
              label: '组件交互文档',
            },
          ],
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
  computed: {
    ...mapState({
      // test: (state) => state.goods_create.test,
      // 法1
      skus_type: (state) => state.goods_create.skus_type, // 0 單一規格 | 1 多規格
      category: (state) => state.goods_create.category,
      title: (state) => state.goods_create.title,
      desc: (state) => state.goods_create.desc,
      unit: (state) => state.goods_create.unit,
      stock: (state) => state.goods_create.stock,
      min_stock: (state) => state.goods_create.min_stock,
      display_stock: (state) => state.goods_create.display_stock,
      status: (state) => state.goods_create.status,
      express: (state) => state.goods_create.express, //運費模板

    }),
    // other computed
  },
  watch: {},
  methods: {
    ...mapMutations(['vModelState']),
    // 修改表單值
    vModel(key, value) {
      this.vModelState({ key, value })
    },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
  
}
</script>

<style scoped lang=""></style>
