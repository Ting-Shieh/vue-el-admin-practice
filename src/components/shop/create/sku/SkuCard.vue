<template>
  <!-- <el-form>
      <el-form-item label="添加規格"> -->
  <div class="card mb-2 mx-auto" style="line-height: 1.2!important;width: 80%">
    <div class="card-header d-flex align-items-center ">
      <div class="input-group col-4 ">
        <label class="col-form-label mr-3 " style="font-weight: bold;"
          >規格項:</label
        >
        <div class="d-flex">
          <input
            type="text"
            class="form-control "
            placeholder="請輸入"
            :value="card.name"
            @input="vModel('name', idx, $event.target.value)"
          />
          <div class="input-group-append">
            <span class="input-group-text" @click.prevent="chooseSkus"
              >...</span
            >
          </div>
        </div>
      </div>

      <el-radio-group
        class="d-flex"
        v-model.number="card.type"
        @input="vModel('type', idx, parseInt($event.target.value))"
      >
        <el-radio :label="0">無</el-radio>
        <el-radio :label="1">顏色</el-radio>
        <el-radio :label="2">圖片</el-radio>
      </el-radio-group>

      <!-- 上移 -->
      <el-button
        class="ml-auto"
        icon="el-icon-top"
        size="mini"
        :disabled="idx === 0"
        @click.prevent="sortCard('moveUp', idx)"
      ></el-button>
      <!-- 下移 -->
      <el-button
        icon="el-icon-bottom"
        size="mini"
        :disabled="total === idx + 1"
        @click.prevent="sortCard('moveDown', idx)"
      ></el-button>
      <el-button type="text" size="mini" @click.prevent="delSkuCardEvent"
        >刪除</el-button
      >
    </div>
    <div class="card-body">
      <!-- 規格屬性列表 -->
      <draggable
        v-model="cardList"
        class="d-flex align-items-center flex-wrap"
        :list="cardList"
        group="`skuItem${idx}`"
        @change="log"
        @end="onEnd"
        :move="checkMove"
      >
        <sku-card-children
          v-for="(cardlist, idx2) in cardList"
          :key="idx2"
          :type="card.type"
          :item="cardlist"
          :index="idx2"
          :cardIndex="idx"
        ></sku-card-children>
      </draggable>
      <!-- 增加規格 -->
      <div class="mt-2" :list="list">
        <el-button
          type="text"
          size="mini"
          icon="el-icon-plus"
          @click.prevent="addSkuValueEvent"
          >增加規格值</el-button
        >
      </div>
    </div>
  </div>
  <!-- </el-form-item>
  </el-form> -->
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { VueDraggableNext } from 'vue-draggable-next' // 拖曳排序  for Vue3 |awe-dnd for vue2
import SkuCardChildren from './SkuCardChildren.vue'
let defaultVal = [
  '屬性值',
  '#fff',
  'https://static.newmobilelife.com/wp-content/uploads/2016/05/apple-car-project-titan-800k-sq-feet-land_00.jpg',
]
export default {
  inject: ['app', 'layout'],
  props: {
    card: {
      type: Object,
    },
    idx: {
      type: Number,
    },
    total: {
      type: Number,
    },
  },
  data() {
    return {
      cardList: this.card.list,
    }
  },
  components: {
    SkuCardChildren,
    draggable: VueDraggableNext,
  },
  computed: {
    ...mapState({
      sku_card: (state) => state.goods_create.sku_card,
    }),
  },
  watch: {},
  methods: {
    ...mapMutations([
      'delSkuCard',
      'vModelSkuCard',
      'sortSkuCard',
      'addSkuValue',
      'sortSkuValue',
    ]),
    vModel(key, index, value) {
      console.log(
        'vModel|key =>',
        key,
        'vModel|index =>',
        index,
        'vModel|value =>',
        value
      )
      this.vModelSkuCard({ key, index, value })
      this.updateSkuCard()
    },
    // api =>
    delSkuCardEvent() {
      this.layout.showLoading()
      this.$axios
        .post(
          `/admin/goods_skus_card'/${this.card.id}/delete`,
          {},
          { token: true }
        )
        .then((res) => {
          console.log(res)
          let data = res.data.data
          this.delSkuCard(this.idx)

          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // api =>
    addSkuValueEvent(value = false) {
      this.layout.showLoading()
      this.$axios
        .post(
          '/admin/goods_skus_card_value',
          {
            goods_skus_card_id: this.card.item,
            name: this.card.name,
            order: 50,
            value:
              typeof value === 'string' ? value : defaultVal[this.card.type],
          },
          { token: true }
        )
        .then((res) => {
          console.log(res)
          let data = res.data.data
          data.text = this.card.type === 0 ? data.value : defaultVal[0]
          data.image = this.card.type === 2 ? data.value : defaultVal[2]
          data.color = this.card.type === 1 ? data.value : defaultVal[1]
          this.addSkuValue({
            index: this.idx,
            data,
          })
          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },
    // api =>
    updateSkuCard() {
      console.log(this.card)
      this.$axios.post(`/admin/goods_skus_card'/${this.card.id}`, this.card, {
        token: true,
      })
    },
    // 排序規格卡
    // https://github.com/SortableJS/Sortable#options
    // https://www.npmjs.com/package/vue-draggable-next
    // https://blog.csdn.net/weixin_47180815/article/details/109841448
    sortCard(action, index) {
      this.sortSkuCard({ action, index })
      this.$axios
        .post(
          '/admin/goods_skus_card/sort',
          {
            sortdata: this.sku_card.map((item, index) => {
              return {
                id: item.id,
                order: index + 1,
              }
            }),
          },
          { token: true }
        )
        .then((res) => {
          console.log(res)
          let data = res.data.data

          this.layout.hideLoading()
        })
        .catch((err) => {
          this.layout.hideLoading()
        })
    },

    // 選擇規格
    chooseSkus() {
      this.app.chooseSkus((res) => {
        // console.log(res)

        this.vModel('name', this.idx, res.name)
        this.vModel('type', this.idx, res.type)
        // this.vModel('list', this.idx, res.list)
        // this.cardList = res.list
        res.cardList.forEach((item) => {
          this.addSkuValueEvent(item.name)
        })
      })
    },

    // ============= 拖曳功能 ==============
    log(event) {
      console.log('當前拖曳 =>', event.moved.element)
    },
    // 結束拖曳
    onEnd(event) {
      console.log('End|to =>', event.to)
      console.log('End|from =>', event.from)
      console.log('End|oldIndex =>', event.oldIndex)
      console.log('End|newIndex =>', event.newIndex)
      console.log('End|oldDraggableIndex =>', event.oldDraggableIndex)
      console.log('End|newDraggableIndex =>', event.newDraggableIndex)
      console.log('End|clone  =>', event.clone)
      console.log('End|pullMode =>', event.pullMode)
      console.log('End|pullMode =>', event.pullMode)
      // console.log(this.cardList)
      this.sortSkuValue({
        cardIndex: this.idx,
        value: this.cardList,
      })
    },
    checkMove(e) {
      console.log('checkMove', event)
    },
  },
  created() {},
  mounted() {
    this.$watch('card.list', (newVal, oldVal) => {
      this.cardList = newVal
    });
      // 監聽結束
      this.$dragging.$on('dragend', (e) => {
        if (e.group === 'skuItem' + this.index) {
          this.sortSkuValue({
            cardIndex: this.idx,
            value: this.cardList,
          })

        // api =>
        this.$axios.post(
          '/admin/goods_skus_card_value/sort',
          {
            sortdata: this.cardList.map((item, index) => {
              return {
                id: item.id,
                order: index + 1,
              }
            }),
          },
          { token: true }
        )
        }
      })
  },
}
</script>

<style scoped lang="scss">
.this {
  border: 1px solid red;
}
</style>
