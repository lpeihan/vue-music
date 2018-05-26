<template>
  <div class="rank">
    <scroll class="top-list" :data="topList" ref="topList">
      <ul>
        <li class="top" v-for="(top, index) in topList" :key="index" @click="selectTop(top)">
          <img width="100" height="100" v-lazy="top.picUrl" class="img"/>
          <ul class="song-list">
            <li class="song"
              v-for="(song, index) in top.songList"
              :key="index"
            >
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-container" v-show="!topList.length">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from '../../api/rank';
import { ERR_OK } from '../../api/config';
import Scroll from '../../components/scroll';
import Loading from '../../components/loading';
import { playlistMixin } from '../../utils/mixins';
import { mapMutations } from 'vuex';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    Scroll,
    Loading
  },
  data() {
    return {
      topList: []
    };
  },
  methods: {
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';

      this.$el.style.bottom = bottom;
      this.$refs.topList.refresh();
    },
    selectTop(top) {
      this.$router.push({
        path: `/rank/${top.id}`
      });
      this.setTopList(top);
    },
    getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList;
        }
      });
    }
  },
  created() {
    this.getTopList();
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/mixins"
  @import "../../styles/variables"
  .rank
    fixed: top 100px bottom 0 left 0 right 0
    padding: 20px 20px 0
    .top-list
      height: 100%
      overflow: hidden
      .top
        display: flex
        height: 100px
        margin-bottom: 20px
        &:last-child
          padding-bottom: 20px
        .song-list
          float: left
          width: calc(100% - 100px)
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small + 1
          overflow: hidden
          padding: 11px
          .song
            line-height: 26px
            no-wrap()
    .loading-container
      absolute: top 50% left 50%
      transform: translate(-50%, -50%)
</style>
