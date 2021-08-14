<template>
  <div class="">
    <!-- Btns  (component)-->
    <div class="d-flex align-items-center">
      <!-- Left-slot  -->
      <slot name="left"></slot>

      <!-- Right-slot -->
      <div
        class="ml-auto d-flex align-items-center"
        v-show="!superSearch"
        v-if="showSearch"
      >
        <slot name="right">
          <!-- 無傳過來任意資料，採用下方默認預設 -->
          <input
            type="text"
            v-model="keyword"
            class="form-control mr-2"
            style="width: 150px;"
            :placeholder="placeholder"
          />
          <button
            type="button"
            class="btn btn-secondary mr-1"
            style="width: 60px;"
            @click.prevent="$emit('search', keyword)"
          >
            搜索
          </button>
          <button
            v-if="superSearch"
            type="button"
            class="btn btn-outline-secondary"
            style="width: 100px;"
            @click.prevent="openSuperSearch"
          >
            高級搜索
          </button>
        </slot>
      </div>
    </div>
    <!--  -->
    <el-card class="box-card bg-light my-3" v-show="superSearch">
      <template #header>
        <div
          class="card-header d-flex align-items-center justify-content-between"
          style="margin: -10px;"
        >
          <span>高級搜索</span>
          <el-button
            class="button"
            type="text"
            @click.prevent="closeSuperSearch"
            >收起</el-button
          >
        </div>
      </template>
      <!-- 表單-slot -->
      <slot name="form"></slot>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      superSearch: false,
    }
  },
  props: {
    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    showSearch: {
      type: Boolean,
      default: true,
    },
    superSearch:{
      type: Boolean,
      default: true,
    },
  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    openSuperSearch() {
      this.superSearch = true
    },
    // 關閉高級搜索
    closeSuperSearch(e) {
      console.log(e)
      console.log('closeSuperSearch start', this.superSearch)
      this.superSearch = false
      console.log('===== closeSuperSearch end =====', this.superSearch)
    },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang=""></style>
