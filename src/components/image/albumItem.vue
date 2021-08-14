<template>
  <li
    class="list-group-item list-group-item-action d-flex align-items-center"
    style="cursor:pointer;"
    :class="{ 'active album-active': active }"
    @click.stop="$emit('change', idx)"
  >
    {{ album.name }}
    <span class="btn btn-light btn-sm border ml-auto" v-if="!showOptions">
        <!-- {{ album.num }} -->
        {{ album.images_count }}
      </span>
    <el-dropdown :hide-on-click="false" class="ml-auto" v-else>
      <span class="btn btn-light btn-sm border">
        <!-- {{ album.num }} -->
        {{ album.images_count }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu> 
          <el-dropdown-item @click.stop.native="$emit( 'editAlbum',{ album, idx })"
            >修改</el-dropdown-item
          >
          <el-dropdown-item @click.prevent="$emit('deleteAlbum',idx)"
            >刪除</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </li>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    album: {
      type: Object,

    },
    idx:{
      type: Number,
    },
    active:{
      type: Boolean,
      default: false
    },
    showOptions:{
      type: Boolean,
      default: true,
    },

  },
  components: {},
  computed: {},
  watch: {},
  methods: {
    // albumChange(index) {
    //   this.$emit('change', index) //通知父組件監聽'change'，可收到 index
    // },
  },
  created() {},
  mounted() {},
  updated() {},
  unmounted() {},
}
</script>

<style scoped lang="scss">

.album-active {
  color: #67c23a;
  background-color: #f0f9eb;
  border-color: #c2e7b0;
}
</style>
