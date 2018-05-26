<template>
  <transition name="slide">
    <div class="top-list">
      <music-list :title="topList.topTitle" :image="image" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
import { getMusicList } from '../../api/rank';
import { ERR_OK } from '../../api/config';
import { mapGetters } from 'vuex';
import { createSong } from '../../services/song';
import MusicList from '../music-list/music-list';

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(['topList']),
    image() {
      if (this.songs.length) {
        return this.songs[0].image;
      }
      return '';
    }
  },
  methods: {
    getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank');
        return;
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this.normalizeSongs(res.songlist);
        }
      });
    },
    normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        const musicData = item.data;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  created() {
    this.getMusicList();
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/mixins"
  .top-list
    fixed: top 0 left 0 right 0 bottom 0
    &.slide
      &-enter-active
      &-leave-active
        transition: all .4s
      &-enter
      &-leave-to
        transform: translateX(100%)
</style>
