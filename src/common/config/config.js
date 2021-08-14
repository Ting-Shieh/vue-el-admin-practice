/**
 * 點選面版 Data
 */
export default {
  logo: 'UNI-ADMIN',
  navBars: {
    active: '0',
    list: [
      {
        name: '首頁',
        subActive: '0',
        submenu: [
          /** 側選單 */
          {
            icon: 'el-icon-s-home',
            name: '後臺首頁',
            pathname:"index",
          },
          {
            icon: 'el-icon-s-goods',
            name: '商品列表',
            pathname:"shop_goods_list",  //此為自動生成
          },
          {
            icon: 'el-icon-picture',
            name: '相簿管理側選單',
            pathname:"image",  //此為自動生成
          },
        ],
      },
      {
        name: '商品',
        subActive: '0',
        submenu: [
          {
            icon: 'el-icon-s-home',
            name: '商品列表',
            pathname:"shop_goods_list",
          },
          {
            icon: 'el-icon-s-claim',
            name: '分類列表',
            pathname:"shop_category_list",
          },
          {
            icon: 'el-icon-film',
            name: '商品規格',
            pathname:"shop_sku_list",
          },
          {
            icon: 'el-icon-film',
            name: '商品類型',
            pathname:"shop_type_list",
          },
          {
            icon: 'el-icon-film',
            name: '商品評論',
            pathname:"shop_comment_list",
          },
        ],
      },
      {
        name: '訂單',
        subActive: '0',
        submenu: [
          {
            icon: 'el-icon-s-service',
            name: '訂單管理',
            pathname:"order_order_list",  //此為自動生成 
          },
          {
            icon: 'el-icon-s-home',
            name: '發票管理',
            pathname:"order_invoice_list",  //此為自動生成
          },
          {
            icon: 'el-icon-s-service',
            name: '售後服務',
            pathname:"order_after-sale_list",  //此為自動生成 
          },
          
        ],
      },
      {
        name: '會員',
        subActive: '0',
        submenu: [
          {
            icon: 'el-icon-s-home',
            name: '會員列表',
            pathname:"user_user-list_list",  //此為自動生成 
          },
          {
            icon: 'el-icon-s-home',
            name: '會員等級',
            pathname:"user_user-level_list",  //此為自動生成 
          },
        ],
      },
      {
        name: '設置',
        subActive: '0',
        submenu: [
          {
            icon: 'el-icon-s-claim',
            name: '基礎設置',
            pathname:"set_base",  //此為自動生成 
          },
          {
            icon: 'el-icon-s-claim',
            name: '物流設置',
            pathname:"set_express",  //此為自動生成 
          },
          {
            icon: 'el-icon-s-claim',
            name: '管理員設置',
            pathname:"set_manager",  //此為自動生成 
          },
          {
            icon: 'el-icon-s-claim',
            name: '交易設置',
            pathname:"set_payment",  //此為自動生成 
          },
        ],
      },
      
    ],
  },
}
