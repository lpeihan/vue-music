<template>
  <div class="recommends">
    <scroll :data="discList" class="recommends-content" ref="scroll">
      <div>
        <div class="slider-wrapper" ref="sliderWrapper" v-if="sliders.length">
          <swiper :interval="4000">
            <slide
              v-for="(slide, index) in sliders"
              :key="index"
            >
              <a :href="slide.linkUrl">
                <img
                  @load="loadImage"
                  class="slide-img"
                  :src="slide.picUrl" width="100%" :height="slideHeight">
              </a>
            </slide>
          </swiper>
        </div>

        <div class="disc-list">
          <h1 class="title">热门歌单推荐</h1>
          <div
            class="disc-item"
            v-for="(disc, index) in discList"
            :key="index"
            @click="selectDisc(disc)"
          >
            <div class="img">
              <img v-lazy="disc.imgurl" alt="img" width="60" height="60">
            </div>
            <div class="text">
              <h2 class="name">{{disc.creator.name}}</h2>
              <p class="desc" v-html="disc.dissname"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getRecommends, getDiscList } from '../../api/recommends';
import { ERR_OK } from '../../api/config';
import { Swiper, Slide } from 'vue-swiper-component';
import Scroll from '../../components/scroll';
import Loading from '../../components/loading';
import { playlistMixin } from '../../utils/mixins';
import { mapMutations } from 'vuex';

export default {
  mixins: [
    playlistMixin
  ],
  data() {
    return {
      sliders: [],
      discList: [],
      slideHeight: 0
    };
  },
  components: {
    Swiper,
    Slide,
    Scroll,
    Loading
  },
  methods: {
    ...mapMutations({
      setDisc: 'SET_DISC'
    }),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$el.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    getRecommends() {
      getRecommends().then((res) => {
        if (res.code === ERR_OK) {
          this.sliders = res.data.slider;
          this.songList = res.data.slider;
        }
      });
    },
    selectDisc(disc) {
      this.$router.push(`/recommends/${disc.dissid}`);
      this.setDisc(disc);
    },
    getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true;
        this.$refs.scroll.refresh();
      }
    }
  },
  mounted() {
    const clientWidth = document.body.clientWidth || document.documentElement.clientWidth;

    this.slideHeight = Math.round(150 / 375 * clientWidth);
  },
  created() {
    this.getRecommends();
    this.getDiscList();
  }
};
</script>

<style lang="stylus">
  @import "../../styles/variables"
  .recommends
    position: fixed
    width: 100%
    top: 100px
    bottom: 0
    .recommends-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .disc-list
        .title
            height: 65px
            line-height: 65px
            text-align: center
            font-size: $font-size-medium
            color: $color-theme
        .disc-item
          display: flex
          padding: 0 20px 20px
          .img
            flex: 0 0 60px
          .text
            margin-left: 10px
            flex: 1
            .name
              margin-bottom: 10px
            .desc
              color: $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
