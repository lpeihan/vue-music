<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @search="onSearchChange"></search-box>
    </div>

    <div class="hot-key" v-show="!search">
      <h1 class="title">热门搜索</h1>
      <ul>
        <li class="key" v-for="(key, index) in hotKey" :key="index" @click="setSearch(key.k)">
          <span>{{key.k}}</span>
        </li>
      </ul>
    </div>
    <div class="search-results-wrapper" v-show="search">
      <search-results :search="search"></search-results>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from '../../components/search-box';
import { getHotKey } from '../../api/search';
import { ERR_OK } from '../../api/config';
import SearchResults from './search-results';

export default {
  components: {
    SearchBox,
    SearchResults
  },
  data() {
    return {
      hotKey: [],
      search: '',
      histories: []
    };
  },
  methods: {
    getHotKey() {
      getHotKey().then((res) => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    setSearch(key) {
      this.$refs.searchBox.setSearch(key);
    },
    onSearchChange(search) {
      this.search = search;
    }
  },
  watch: {
    search() {
      console.log('search');
    }
  },
  created() {
    this.getHotKey();
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .search
    fixed: top 100px right 0 bottom 0 left 0
    padding: 20px
    .search-box-wrapper
      margin-bottom: 20px
    .hot-key
      font-size: $font-size-medium
      color: $color-text-l
      .title
        margin-bottom: 20px
      .key
        display: inline-block
        padding: 6px 10px
        margin: 0 20px 20px 0
        border-radius: 6px
        background: $color-highlight-background
        color: $color-text-d
    .search-results-wrapper
      absolute: top 80px left 20px right 20px bottom 0
</style>
