<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list :title="singer.name" :image="singer.avatar" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
import { getSingerDetail } from '../../api/singers';
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
    ...mapGetters(['singer'])
  },
  methods: {
    getSingerDetail() {
      if (!this.singer.id) {
        this.$router.push('/singers');
        return;
      }
      getSingerDetail(this.singer.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this.normalizeSongs(res.data.list);
        }
      });
    },
    normalizeSongs(list) {
      let ret = [];
      list.forEach((item) => {
        let {musicData} = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    }
  },
  created() {
    this.getSingerDetail();
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/mixins"
  @import "../../styles/variables"

  .singer-detail
    fixed: top 0 left 0 right 0 bottom 0
    z-index: 100
    background: $color-background
    &.slide
      &-enter-active
      &-leave-active
        transition: all .3s
      &-enter
      &-leave-to
        transform: translate3d(100%, 0, 0)

</style>
