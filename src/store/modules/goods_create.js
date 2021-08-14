/**
 * 管理創建商品狀態
 */
import $Util from '@/common/util.js'
export default {
  state: {
    skus_type: 0, // 0 單一規格 | 1 多規格
    category: [],
    title: '',
    desc: '',
    unit: '',
    stock: 0,
    min_stock: 0,
    display_stock: '',
    status: 0,
    express: '', //運費模板
    // 商品大圖
    banners: [
      // for test
      // {
      //   id: 0,
      //   url:
      //     'https://inside-assets1.inside.com.tw/2021/6/473r4gjgbm05avy2mf9f3pfo7wka2q.png?w=730&fit=max&q=80',
      // },
    ], 
    //
    oprice: 0, // 市場價格
    pprice: 0, // 銷售價格
    cprice: 0, // 成本價格
    weight: 0, // 商品重量
    volume: 0, // 商品體積

    // 規格卡片
    sku_card: [],
    // 規格卡片table 表頭
    ths: [
      { name: '商品規格', rowspan: 1, colspan: 1, width: '' },
      { name: 'Sku Image', rowspan: 2, colspan: 1, width: '' },
      { name: '銷售價', rowspan: 2, colspan: 1, width: '' },
      { name: '市場價', rowspan: 2, colspan: 1, width: '' },
      { name: '成本價', rowspan: 2, colspan: 1, width: '' },
      { name: '庫存', rowspan: 2, colspan: 1, width: '' },
      { name: '體積', rowspan: 2, colspan: 1, width: '' },
      { name: '重量', rowspan: 2, colspan: 1, width: '' },
      { name: '編號', rowspan: 2, colspan: 1, width: '' },
    ],
    // 商品類型
    goods_type_id: "",
    // 商品屬性
    goods_attrs: {
      phone_model:"",
    },
    // 折扣
    discount: 0,
  },
  getters: {
    // 防止空的規格屬性卡
    skuLabels(state) {
      return state.sku_card.filter((v) => {
        return v.list.length > 0
      })
    },

    //獲取表頭
    tableThs(state, getters) {
      let length = getters.skuLabels.length
      state.ths[0].colspan = length
      state.ths[0].rowspan = length > 0 ? 1 : 2
      return state.ths
    },
    // 獲取規格表格數據
    tableData(state) {
      // 判斷 當前是否有規格卡片
      if (state.sku_card.length === 0) return []

      /**組成 */
      let sku_list = []

      for (let i = 0; i < state.sku_card.length; i++) {
        if (state.sku_card[i].list.length > 0)
          sku_list.push(state.sku_card[i].list)
      }

      //
      if (sku_list.length === 0) return []

      //
      let arr = $Util.cartesianProductOf(...sku_list)
      return arr.map((v) => {
        let obj = {
          skus: [],
          image: '', // sku 圖片
          oprice: 0, // 市場價格
          pprice: 0, // 銷售價格
          cprice: 0, // 成本價格
          stock: 0, // 庫存
          weight: 0, // 商品重量
          volume: 0, // 商品體積
          code: '', // 編碼
        }
        obj.skus = v
        return obj
      })
    },
  },
  mutations: {
    // 修改 state ， 並賦值
    vModelState(state, { key, value }) {
      state[key] = value
      console.log("key=>",key,"key typeof=>",typeof value, '---', value)
    },
    // 增加規格卡片
    addSkuCard(state,data) {
      state.sku_card.push(data)
    },
    // 刪除規格卡片
    delSkuCard(state, index) {
      state.sku_card.splice(index, 1)
    },
    // 修改卡片(屬性,規格索引,屬性值)
    vModelSkuCard(state, { key, index, value }) {
      state.sku_card[index][key] = value
    },
    // 規格卡片排序(上移)
    sortSkuCard(state, { action, index }) {
      $Util[action](state.sku_card, index)
    },
    // 增加指定規格卡片的規格屬性
    addSkuValue (state, {index, data }) {
      state.sku_card[index].list.push(data)
    },
    // 刪除指定規格卡片的規格屬性
    delSkuValue(state, { cardIndex, valueIndex }) {
      state.sku_card[cardIndex].list.splice(valueIndex, 1)
    },
    // 修改指定規格卡片的規格屬性
    updateSkuValue(state, { cardIndex, valueIndex, key, value }) {
      // console.log("----",cardIndex, valueIndex, key, value)
      state.sku_card[cardIndex].list[valueIndex][key] = value
    },
    // 拖曳排序規格卡片的規格屬性列表
    sortSkuValue(state, { cardIndex, value }) {
      state.sku_card[cardIndex].list = value
      console.log('更新後的List => ', state.sku_card[cardIndex].list)
    },
    // 修改商品屬性
    vModelGoodsAttrs (state, { key, value }) {
      // console.log('value ===> ', value)
      state.goods_attrs[key] = value
    },
  },
  actions: {},
}
