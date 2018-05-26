<template>
  <div class="disc">
    <music-list :title="disc.dissname" :image="disc.imgurl"></music-list>
  </div>
</template>

<script>
import MusicList from '../music-list/music-list';
import { mapGetters } from 'vuex';
import { getSongList } from '../../api/recommends';
import { ERR_OK } from '../../api/config';

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
    ...mapGetters(['disc'])
  },
  methods: {
    getSongList() {
      getSongList(this.disc.dissid).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = res.cdlist[0].songlist;
          console.log(this.songs);
        }
      });
    }
  },
  created() {
    this.getSongList();
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"
  .disc
    fixed: top 0 left 0 right 0 bottom 0
</style>
