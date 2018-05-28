<template>
  <scroll class="search-results" :data="results" :pullup="true" ref="results" @scrollToEnd="searchMore">
    <ul>
      <li
        v-for="(result, index) in results"
        :key="index"
        class="result-item"
        @click="selectResult(result)"
      >
        <i :class="getIconCls(result)" class="icon"></i>
        <p class="text">{{getDisplayName(result)}}</p>
      </li>
      <loading v-show="loading" title=""></loading>
    </ul>
  </scroll>
</template>

<script>
import { ERR_OK } from '../../api/config';
import { createSong } from '../../services/song';
import { goSearch } from '../../api/search';
import Scroll from '../../components/scroll';
import Loading from '../../components/loading';
import { mapMutations } from 'vuex';

export default {
  components: {
    Scroll,
    Loading
  },
  props: {
    search: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      results: [],
      perpage: 20,
      loading: false
    };
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    goSearch(search) {
      this.page = 1;
      this.$refs.results.scrollTo(0, 0);
      this.loading = true;
      goSearch(search, this.page, this.showSinger, this.perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.results = this.genResult(res.data);
        }
        this.loading = false;
      });
    },
    searchMore() {
      this.page++;
      this.loading = true;
      goSearch(this.search, this.page, this.showSinger, this.perpage).then((res) => {
        if (res.code === ERR_OK) {
          this.results = this.results.concat(this.genResult(res.data));
        }
        this.loading = false;
      });
    },
    selectResult(result) {
      if (result.type === 'singer') {
        const singer = {
          id: result.singermid,
          name: result.singername,
          avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${result.singermid}.jpg?max_age=2592000`
        };
        this.$router.push({
          path: `/search/${singer.id}`
        });

        this.setSinger(singer);
      }
    },
    getIconCls(result) {
      if (result.type === 'singer') {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName(result) {
      if (result.type === 'singer') {
        return result.singername;
      } else {
        return `${result.name} - ${result.singer}`;
      }
    },
    genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{ type: 'singer' }});
      }
      if (data.song) {
        ret = ret.concat(this.normalizeSongs(data.song.list));
      }
      return ret;
    },
    normalizeSongs(list) {
      let ret = [];
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  watch: {
    search(search) {
      this.goSearch(search);
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/mixins"
  @import "../../styles/variables"

  .search-results
    height: 100%
    overflow: hidden
    ul
      padding-bottom: 20px
    .result-item
      display: flex
      padding-bottom: 20px
    .icon
      color: $color-text-d
      margin-right: 10px
    .text
      flex: 1
      color: $color-text-d
      no-wrap()
</style>
