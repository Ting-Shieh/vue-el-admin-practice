/**
 * 路由配置抽出來好管理
 *
 */

let routes = [
  {
    path: '/',
    name: 'layout', // 主布局
    redirect: { name: 'index' }, //路油重導
    // component: () => import(/* webpackChunkName: "about" */ '@/views/layout'),
    component: 'layout',
    children: [
      {
        // 後臺首頁
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '後臺首頁' },
        component: 'index/index',
      },
      /** ======= 同級 ============== */
      {
        //商品列表
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '商品列表' },
        component: 'shop/goods/list',
      },
      {
        // 創建商品
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '創建商品' },
        component: 'shop/goods/create',
      },
      {
        // 創建商品
        // 自動生成 => path: '/index', name: 'index', 
        meta: { title: '修改商品詳情' },
        component: 'shop/goods/content',
      },
      {
        // 創建商品
        // 自動生成 => path: '/index', name: 'index', 
        meta: { title: '媒體設置' },
        component: 'shop/goods/banner',
      },
      {
        // 創建商品
        // 自動生成 => path: '/index', name: 'index', 
        meta: { title: '商品屬性' },
        component: 'shop/goods/attr',
      },
      {
        // 創建商品
        // 自動生成 => path: '/index', name: 'index', 
        meta: { title: '商品規格' },
        component: 'shop/goods/sku',
      },
      {
        // 創建商品
        // 自動生成 => path: '/index', name: 'index', 
        meta: { title: '商品基礎設置' },
        component: 'shop/goods/create',
      },
      {
        //
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '分類管理' },
        component: 'shop/category/list',
      },
      {
        //
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '商品規格管理' },
        component: 'shop/sku/list',
      },
      {
        //
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '商品類型管理' },
        component: 'shop/type/list',
      },
      {
        //
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '商品評論管理' },
        component: 'shop/comment/list',
      },
      /** ======= 同級 ============== */
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '相簿管理' },
        component: 'image/index',
      },
      /** ======= 同級 ============== */
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '發票管理' },
        component: 'order/invoice/list',
      },
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '售後服務' },
        component: 'order/after-sale/list',
      },
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '訂單列表' },
        component: 'order/order/list',
      },
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '會員列表' },
        component: 'user/user-list/list',
      },
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '會員等級' },
        component: 'user/user-level/list',
      },
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '基礎設置' },
        component: 'set/base/index',
      },
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '物流設置' },
        component: 'set/express/index',
      },
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: '管理員設置' },
        component: 'set/manager/index',
      },
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: "交易設置" },
        component: 'set/payment/index',
      },
      //404
      {
        // 
        // 自動生成 => path: '/index', name: 'index',
        meta: { title: "404錯誤" },
        component: 'error/404',
      },

    ],
  },
  {
    // 自動生成 => path: '/login', name: 'login',
    meta: { title: '登入頁' },
    component: 'login/index',
  },
  {
    /**找不到路由的匹配 */
    //vue3對404配置進行了修改,必須要使用正則匹配
    path: '/:pathMatch(.*)*',
    redirect: { name: 'index' }, //路油重導
  },
]

/**
 * 獲取路由訊息方法
 *
 */
let getRoutes = () => {
  // 生成路由詳細訊息
  createRoute(routes)
  return routes
}

/**
 * 自動生成路由方法(遞迴)
 * 判斷 children 是否有 length>0
 */

const createRoute = (Arr) => {
  for (let i = 0; i < Arr.length; i++) {
    if (!Arr[i].component) return //重定向

    // 去除 index
    let val = getValue(Arr[i].component)
    // 生成 name (如果用戶有設定，則用用戶設定，無則用 自動設定)
    Arr[i].name = Arr[i].name || val.replace(/\//g, '_')
    // 生成 path
    Arr[i].path = Arr[i].path || `/${val}`

    // 自動生成 component
    let componentFun = import(`@/views/${Arr[i].component}.vue`)
    Arr[i].component = () => componentFun

    if (Arr[i].children && Arr[i].children.length > 0) {
      createRoute(Arr[i].children)
    }
  }
}

/**
 * 去除 index
 */
const getValue = (str) => {
  // 獲取最後一個 / 的索引  => str:index</>index
  let index = str.lastIndexOf('/')

  // 獲取最後一個 / 後面值
  let val = str.substring(index + 1, str.length)

  // 判斷是否為 index 結尾
  if (val === 'index') return str.substring(index, -1)

  return str
}

export default getRoutes()
