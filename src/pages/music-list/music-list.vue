<template>
  <div class="music-list">
    <div class="header">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title">{{title}}</h1>
    </div>
    <div class="bg-image" :style="{ backgroundImage: `url(${image})` }" ref="image">
      <div class="play" ref="play">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
    </div>
    <div class="overlay" ref="overlay"></div>
    <scroll
      class="song-list-scroll"
      ref="list"
      :data="songs"
      :probe-type="3"
      :listen-scroll="true"
      @scroll="scroll"
    >
      <song-list :songs="songs"></song-list>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import SongList from '../../components/song-list';
import Scroll from '../../components/scroll';
import loading from '../../components/loading';

export default {
  components: {
    SongList,
    Scroll,
    loading
  },
  props: {
    image: {
      type: String
    },
    title: {
      type: String
    },
    songs: {
      type: Array
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    scroll(pos) {
      let translateY;
      const maxY = this.maxY;
      const image = this.$refs.image;
      let scale = 1;
      let zIndex = 0;
      const percent = Math.abs(pos.y / this.imageHeight);

      if (pos.y > 0) {
        scale = 1 + percent;
        zIndex = 10;
      }

      if (maxY + pos.y >= 0) {
        translateY = pos.y;
        image.style.paddingBottom = '70%';
        image.style.height = 0;
        image.style.zIndex = 0;
        this.$refs.play.style.display = '';
      } else {
        translateY = -maxY;
        image.style.paddingBottom = 0;
        image.style.height = 50 + 'px';
        zIndex = 10;
        this.$refs.play.style.display = 'none';
      }

      image.style.zIndex = zIndex;
      image.style['transform'] = `scale(${scale})`;

      this.$refs.overlay.style['transform'] = `translate3d(0, ${translateY}px, 0)`;
    }
  },
  mounted() {
    this.imageHeight = this.$refs.image.clientHeight;
    this.maxY = this.imageHeight - 50;
    this.$refs.list.$el.style.top = this.$refs.image.clientHeight + 'px';
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .music-list
    height: 100%

    .header
      position: absolute
      z-index: 20
      size: 100% 50px
      line-height: 50px
      .back
        absolute: left 20px top 50%
        font-size: 22px
        color: $color-theme
        transform: translateY(-50%)
      .title
        text-align: center
        font-size: $font-size-large

    .bg-image
      position: relative
      size: 100% 0
      padding-bottom: 70%
      background-size: cover
      &::before
        content: ''
        absolute: top 0 left 0 right 0 bottom 0
        background: rgba(7, 17, 27, 0.4)
      .play
        absolute: bottom 30px left 50%
        size: 142px 32px
        display: flex
        justify-content: center
        align-items: center
        color: $color-theme
        border: 1px solid $color-theme
        border-radius: 50px
        transform: translateX(-50%)
        .text
          margin-left: 10px
          font-size: $font-size-medium
    .overlay
      position: relative
      height: 100%
      background: $color-background

    .song-list-scroll
      absolute: top 0 left 0 right 0 bottom 0
      background: $color-background
      .loading-container
        absolute: top 50% left 50%
        transform: translate(-50%, -50%)

</style>
