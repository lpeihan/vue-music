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
          <div class="progress-container">
            <div class="current-time">
              {{currentTime | time}}
            </div>
            <div class="progress-bar-container">
              <progress-bar :percent="percent" @update="updateProgress"></progress-bar>
            </div>
            <div class="duration">
              {{currentSong.duration | time}}
            </div>
          </div>
          <div class="operators">
            <div @click="changeMode">
              <i :class="modeClass"></i>
            </div>
            <div @click="prevSong" :class="playDisabled">
              <i class="icon-prev"></i>
            </div>
            <div class="icon-play-wrapper" @click="togglePlaying" :class="playDisabled">
              <i :class="playClass"></i>
            </div>
            <div @click="nextSong" :class="playDisabled">
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
        :class="imageClass"
        :style="{ backgroundImage: `url(${currentSong.image})` }">
      </div>
      <div class="text">
        <h2 class="name">{{currentSong.name}}</h2>
        <p class="singer">{{currentSong.singer}}</p>
      </div>
      <div class="right-btns">
        <i @click.stop="togglePlaying" :class="playClass"></i>
        <i class="icon-playlist"></i>
      </div>
    </div>

    <audio
      ref="audio"
      :src="url"
      @play="ready"
      @timeupdate="updateTime"
      @error="error"
      @ended="end">
    </audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import animations from 'create-keyframe-animation';
import { leftpad, shuffle } from '../../utils';
import ProgressBar from '../../components/progress-bar';
import { playMode } from '../../services/config';

export default {
  components: {
    ProgressBar
  },
  data() {
    return {
      songReady: false,
      currentTime: 0,
      url: 'http://dl.stream.qqmusic.qq.com/C400001J5QJL1pRQYB.m4a?vkey=BC9EA4501EB70B280E802A8264BF2CD8E287C0EB1F28BDAD33EF98CB9335E682E0F128396645C697D393699F061583F4A1893E93B6AD5874&guid=3446878830&uin=291630202&fromtag=66'
    };
  },
  computed: {
    ...mapGetters([
      'currentSong',
      'fullScreen',
      'playlist',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    imageClass() {
      return this.playing ? 'play' : 'play pause';
    },
    playClass() {
      return this.playing ? 'icon-pause' : 'icon-play';
    },
    playDisabled() {
      return this.songReady ? '' : 'disabled';
    },
    percent() {
      // 为了解决 percent 在切换歌曲的瞬间大于 0 的 bug
      // 在切换歌曲的瞬间，currentTime 还是上一首，但duration已经变成下一首
      const percent = this.currentTime / this.currentSong.duration;
      return Math.min(1, percent);
    },
    modeClass() {
      const mode = this.mode;
      return mode === playMode.sequence ? 'icon-sequence' : mode === playMode.loop
        ? 'icon-loop' : 'icon-random';
    }
  },
  filters: {
    time(time) {
      time = time | 0;
      const minute = time / 60 | 0;
      const second = leftpad(time % 60);
      return `${minute}:${second}`;
    }
  },
  methods: {
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlaying: 'SET_PLAYING',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST'
    }),
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlaying(!this.playing);
    },
    prevSong() {
      if (!this.songReady) {
        return;
      }

      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist - 1;
      }
      this.setCurrentIndex(index);

      !this.playing && this.togglePlaying();
      this.songReady = false;
    },
    nextSong() {
      if (!this.songReady) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      !this.playing && this.togglePlaying();
      this.songReady = false;
    },
    ready() {
      this.songReady = true;
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.nextSong();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
    },
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    updateProgress(percent) {
      this.$refs.audio.currentTime = percent * this.currentSong.duration;
      if (!this.playing) {
        this.togglePlaying();
      }
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;

      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlaylist(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });

      this.setCurrentIndex(index);
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
    currentSong(newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return;
      }
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
        padding: 0 10%
        .progress-container
          height: 50px
          display: flex
          align-items: center
          .progress-bar-container
            flex: 1
            margin: 0 10px
          .current-time
          .duration
            font-size: $font-size-small + 1
            color: $color-text-ll
        .operators
          font-size: 32px
          color: $color-theme
          align-items: center
          height: 40px
          display: flex
          justify-content: space-between
          .disabled
            color: $color-theme-d
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
        &.play
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state: paused
      .text
        width: calc(100% - 80px - 40px)
        margin-left: 10px
        .name
          margin-bottom: 8px
          font-size: $font-size-medium
          no-wrap()
        .singer
          font-size: $font-size-small
          color: $color-text-d
      .right-btns
        width: 80px
        display: flex
        justify-content: space-between
        font-size: 30px
        color: $color-theme-d
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
