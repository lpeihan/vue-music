<template>
  <div class="singers">
    <listview :data="singers" @select="selectSinger" ref="list"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from '../../api/singers';
import { ERR_OK } from '../../api/config';
import Listview from '../../components/listview';
import { mapMutations } from 'vuex';

export default {
  components: {
    Listview
  },
  data() {
    return {
      singers: []
    };
  },
  methods: {
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this.normalizeSingers(res.data.list);
        }
      });
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singers/${singer.id}`
      });
      this.setSinger(singer);
    },
    normalizeSingers(singers) {
      const HOT_NAME = '热门';
      const HOT_SINGER_LEN = 10;

      const map = {
        hot: { title: HOT_NAME, items: [] }
      };

      singers.forEach((singer, index) => {
        const id = singer.Fsinger_mid;
        const name = singer.Fsinger_name;
        const avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`;

        if (index < HOT_SINGER_LEN) {
          map.hot.items.push({ name, id, avatar });
        }

        const key = singer.Findex;

        if (!map[key]) {
          map[key] = { title: key, items: [] };
        }

        map[key].items.push({ name, id, avatar });
      });

      const res = [];
      const hot = [];
      for (let key in map) {
        const val = map[key];
        if (/[a-zA-Z]/.test(val.title)) {
          res.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      res.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return hot.concat(res);
    }
  },
  created() {
    this.getSingerList();
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/mixins"

  .singers
    fixed: top 100px left 0 right 0 bottom 0
</style>
