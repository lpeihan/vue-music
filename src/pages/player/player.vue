<template>
  <div class="player" v-show="playlist.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="player-normal" v-show="fullScreen">
        <div class="overlay" :style="{ backgroundImage: `url(${currentSong.image})` }"></div>

        <div class="top">
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="sub-title">{{currentSong.singer}}</h2>
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
        </div>

        <div class="middle">
          <div
            class="image"
            ref="image"
            :style="{ backgroundImage: `url(${currentSong.image})` }"
            :class="imageClass">
          </div>
        </div>

        <div class="bottom">
          <div class="operators">
            <div>
              <i class="icon-random"></i>
            </div>
            <div>
              <i class="icon-prev"></i>
            </div>
            <div class="icon-play-wrapper" @click="togglePlaying">
              <i :class="{ 'icon-pause': playing, 'icon-play': !playing }"></i>
            </div>
            <div>
              <i class="icon-next"></i>
            </div>
            <div>
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="player-mini" v-show="!fullScreen" @click="open">
      <div
        ref="miniImage"
        class="mini-image"
        :style="{ backgroundImage: `url(${currentSong.image})` }">
      </div>
    </div>

    <audio ref="audio" :src="url"></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import animations from 'create-keyframe-animation';

export default {
  data() {
    return {
      url: 'http://dl.stream.qqmusic.qq.com/C400001J5QJL1pRQYB.m4a?vkey=BC9EA4501EB70B280E802A8264BF2CD8E287C0EB1F28BDAD33EF98CB9335E682E0F128396645C697D393699F061583F4A1893E93B6AD5874&guid=3446878830&uin=291630202&fromtag=66'
    };
  },
  computed: {
    ...mapGetters([
      'currentSong',
      'fullScreen',
      'playlist',
      'playing'
    ]),
    imageClass() {
      return this.playing ? 'play' : 'play pause';
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING'
    }),
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    togglePlaying() {
      this.setPlaying(!this.playing);
    },
    enter(el, done) {
      const { x, y, scale } = this.getPosAndScale();

      const animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });

      animations.runAnimation(this.$refs.image, 'move', done);
    },
    afterEnter() {
      animations.unregisterAnimation('move');
      this.$refs.image.style.animation = '';
    },
    leave(el, done) {
      this.$refs.image.style.transition = 'all 0.4s';
      const {
        x, y, scale
      } = this.getPosAndScale();

      this.$refs.image.style['transform'] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      this.$refs.image.addEventListener('transitionend', done);
      setTimeout(done, 400); // 解决上面监听 transitionend 不能执行 done 的问题
    },
    afterLeave() {
      this.$refs.image.style.transition = '';
      this.$refs.image.style['transform'] = '';
    },
    getPosAndScale() {
      const width = window.innerWidth * (1 - 0.12 * 2);
      const scale = 40 / width;

      return {
        x: -(window.innerWidth / 2 - 40),
        y: window.innerHeight - 80 - width / 2 - 30,
        scale
      };
    }
  },
  watch: {
    currentSong() {
      this.$nextTick(() => {
        this.$refs.audio.play();
      });
    },
    playing(playing) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        playing ? audio.play() : audio.pause();
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../../styles/variables"
  @import "../../styles/mixins"

  .player

    &-normal
      fixed: top 0 left 0 right 0 bottom 0
      z-index: 150
      background: $color-background
      &.normal
        &-enter-active
        &-leave-active
          transition: all .4s
          .top
          .bottom
            transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        &-enter
        &-leave-to
          opacity: 0
          .top
            transform: translate3d(0, -100px, 0)
          .bottom
            transform: translate3d(0, 100px, 0)

      .overlay
        absolute: left 0 right 0 bottom 0 top 0
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
        background-size: 100% 100%
      .top
        position: relative
        text-align: center
        color: $color-text
        height: 66px
        .back
          absolute: top 15px left 20px
          transform: rotate(-90deg)
          padding: 8px
          font-size: $font-size-large-x
          color: $color-theme
        .title
          width: 80%
          margin: 0 auto
          line-height: 44px
          font-size: $font-size-large
          no-wrap()
        .subtitle
          line-height: 20px
          font-size: $font-size-medium

      .middle
        absolute: top 90px left 0 right 0 bottom 170px
        padding: 0 12%
        .image
          height: 0
          padding-bottom: 100%
          border-radius: 50%
          background-size: 100% 100%
          &.play
            animation: rotate 20s linear infinite
          &.pause
            animation-play-state: paused

      .bottom
        absolute: bottom 50px left 0 right 0
        .operators
          font-size: 32px
          color: $color-theme
          align-items: center
          height: 40px
          display: flex
          justify-content: space-around
          padding: 0 6%
          .icon-play-wrapper
            font-size: 40px

    &-mini
      fixed: left 0 right 0 bottom 0
      padding: 0 20px
      display: flex
      align-items: center
      height: 60px
      z-index: 150
      background: $color-highlight-background
      .mini-image
        size: 40px
        background-size: 100% 100%
        border-radius: 50%

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
