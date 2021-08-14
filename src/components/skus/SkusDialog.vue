<template>
  <!-- 解決彈出層多次渲染的問題 -->
  <el-dialog title="商品規格選擇" v-model="createModel" width="80%" top="5vh">
    <el-container class="dialog-full-main-container">
      <el-container>
        <el-aside
          class="target-aside-location bg-white border-right"
          width="200px"
        >
          <!-- 側邊 | 規格卡片標題-->
          <ul class="list-group list-group-flush">
            <li
              class="list-group-item list-group-item-action"
              :class="skuIndex === index ? 'sum-active' : ''"
              v-for="(item, index) in skusList"
              :key="index"
              @click.prevent="changeSku(index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </el-aside>
        <!-- 分頁 -->
        <el-footer
          class="
            border-top
            d-flex
            align-items-center
            justify-content-center
            px-0
            bg-white
            position-absolute
          "
          style="bottom: 0px; left: 0px; height: 50px;z-index: 100;width:200px;"
        >
          <div class="px-2" style="flex: 1">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="page.pageSizes"
              :page-size="page.pageSize"
              layout="prev, next"
              :total="page.total"
            >
            </el-pagination>
          </div>
        </el-footer>
        <el-container>
          <el-header
            class="border-top border-bottom"
            style="
              position: absolute;
              top: 0px;
              left: 200px;
              right: 0px;
              height: 60px;
              line-height: 60px;
            "
          >
            <el-button
              type="primary"
              size="medium"
              @click.prevent="doChooseAll"
              >{{ isChooseAll ? "取消全選" : "全選" }}</el-button
            >
          </el-header>
          <el-main class="target-main-location">
            <div class="d-flex flex-wrap">
              <span
                class="border rounded py-1 px-2 m-2"
                :class="skuitem.ischeck ? 'sum-active' : ''"
                style="cursor: pointer"
                v-for="(skuitem, index) in skuItems"
                :key="index"
                @click.prevent="choose(skuitem)"
                >{{ skuitem.name }}</span
              >
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click.prevent="hide">取 消</el-button>
        <el-button type="primary" @click.prevent="confirm">確定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import common from "@/common/mixins/common.js";
export default {
  mixins: [common],
  data() {
    return {
      preUrl: "skus",
      loading: false,
      // 規格卡片
      skusList: [],
      // skusList: [
      //   {
      //     name: '顏色',
      //     type: 0, // 0 無| 1 顏色| 2 圖片
      //     // 規格屬性列表
      //     list: [
      //       {
      //         id: 1,
      //         name: 'Blue',
      //         color: '',
      //         image: '',
      //         isCheck: false,
      //       },
      //       {
      //         id: 2,
      //         name: 'Yellow',
      //         color: '',
      //         image: '',
      //         isCheck: false,
      //       },
      //       {
      //         id: 3,
      //         name: 'Green',
      //         color: '',
      //         image: '',
      //         isCheck: false,
      //       },
      //     ],
      //   },
      //   {
      //     name: '顏色v2',
      //     type: 1, // 0 無| 1 顏色| 2 圖片
      //     // 規格屬性列表
      //     list: [
      //       {
      //         id: 4,
      //         name: 'Blue-v2',
      //         color: '',
      //         image: '',
      //         isCheck: false,
      //       },
      //       {
      //         id: 5,
      //         name: 'Yellow-v2',
      //         color: '',
      //         image: '',
      //         isCheck: false,
      //       },
      //       {
      //         id: 6,
      //         name: 'Green-v2',
      //         color: '',
      //         image: '',
      //         isCheck: false,
      //       },
      //     ],
      //   },
      // ],
      skuIndex: 0,
      createModel: false,
      callback: false,
      chooseList: []
    };
  },
  props: {},
  components: {},
  computed: {
    // 當前規格下的規格屬性列表
    skuItems() {
      let item = this.skusList[this.skuIndex];
      return item ? item.list : [];
    },
    // 是否全選
    isChooseAll() {
      return this.skuItems.length === this.chooseList.length;
    }
  },
  watch: {},
  methods: {
    getListResult(e) {
      // console.log(e)
      this.skusList = e.list.map(item => {
        let list = item.default.splice(",");
        item.list = list.map(name => {
          return {
            name: name,
            image: "",
            color: "",
            ischeck: false
          };
        });
        return item;
      });
    },
    /**
     * 打開彈出層
     */
    chooseskus(callback) {
      this.callback = callback;
      this.createModel = true;
    },
    // 關閉彈出層
    hide() {
      this.unChooseAll();
      this.callback = false;
      this.createModel = false;
    },
    // 確定
    confirm() {
      // 選中的 skus
      if (typeof this.callback === "function") {
        let item = this.skusList[this.skuIndex];
        this.callback({
          id: item.id,
          name: item.name,
          type: item.type,
          list: this.chooseList
        });
      }
      // 隱藏
      this.hide();
    },

    // 切換規格卡片
    changeSku(index) {
      this.unChooseAll();
      this.skuIndex = index;
    },
    //選中規格屬性
    choose(skuitem) {
      // 之前沒選中
      if (!skuitem.ischeck) {
        // 加入選中列表
        this.chooseList.push(skuitem);
        // 修改選中狀態
        return (skuitem.ischeck = true);
      }
      // 之前選中 找到當前對象在 chooseList中的索引
      let index = this.chooseList.findIndex(v => {
        return v.id === skuitem.id;
      });

      if (index < 0) return;
      // 選中列表移除
      this.chooseList.splice(index, 1);
      skuitem.ischeck = false;
    },

    // 選中和取消
    doChooseAll() {
      let list = this.skusList[this.skuIndex].list;

      // 已全選 -> 取消全選
      if (this.isChooseAll) {
        return this.unChooseAll();
      }

      // 取消全選  ->  全選
      this.chooseList = list.map(v => {
        // set 全選
        v.ischeck = true;
        return v;
      });
    },

    // 取消選中所有
    unChooseAll() {
      let list = this.skusList[this.skuIndex].list;
      // 取消選中狀態
      list.forEach(v => {
        v.ischeck = false;
      });
      //清空chooseList
      return (this.chooseList = []);
    },
    __init() {
      //
      for (let i = 0; i < 20; i++) {
        this.albums.push({
          name: `相簿第${i + 1}本`,
          num: Math.floor(Math.random() * 100), //1~99 隨機
          order: 0 //多少張圖片
        });
      }
      //
      for (let i = 0; i < 25; i++) {
        this.imageList.push({
          id: i + 1,
          name: `圖片第${i + 1}張`,
          url:
            "https://i1.wp.com/popbee.com/image/2019/05/avengers-endgame-robert-downey-jr-i-am-iron-man-line-explained-.jpg?quality=95&",
          ischeck: false,
          checkOrder: 0
        });
      }
    }
  },
  created() {},
  mounted() {}
};
</script>

<style scoped lang="scss">
.dialog-full-main-container {
  position: relative;
  margin: -30px -20px;
  height: 70vh;
}

.target-aside-location {
  position: absolute;
  top: 0px !important; //header高(60)
  left: 0 !important;
  bottom: 50px !important; //footer 高(60)
}

.target-main-location {
  position: absolute;
  top: 60px !important; //header高(60)
  left: 200px !important; //aside 寬(200)
  bottom: 0px !important; //footer 高(60)
  right: 0px !important;
}

.sum-active {
  background-color: teal;
  color: white;
}
</style>
