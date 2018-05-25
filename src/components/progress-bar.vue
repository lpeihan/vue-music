<template>
  <div class="progress-bar" @click="clickProress">
    <div class="bar">
      <div
        class="progress"
        :style="{ width: offsetX + 'px'}">
      </div>
      <div
        class="btn-wrapper"
        :style="{ transform: `translateX(${offsetX}px)` }"
        @touchstart="handleTouchstart"
        @touchmove="handleTouchmove"
        @touchend="handleTouchend"
      >
        <div class="btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      width: 0,
      startX: 0,
      touching: false,
      offsetX: 0
    };
  },
  methods: {
    getPageX(e) {
      return e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
    },
    handleTouchstart(e) {
      this.touching = true;
      this.startX = this.getPageX(e);
    },
    handleTouchmove(e) {
      const deltaX = this.getPageX(e) - this.startX;
      let offsetX = this.width + deltaX;
      offsetX = offsetX < 0 ? 0 : offsetX;
      offsetX = Math.min(offsetX, this.$el.clientWidth);
      this.offsetX = offsetX;
    },
    handleTouchend() {
      this.touching = false;
      this.$emit('update', (this.offsetX) / this.$el.clientWidth);
    },
    clickProress(e) {
      this.$emit('update', (e.offsetX) / this.$el.clientWidth);
    }
  },
  watch: {
    percent() {
      if (!this.touching) {
        const barWidth = this.$el.clientWidth;
        this.width = this.percent * barWidth;
        this.offsetX = this.width;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../styles/variables"
  @import "../styles/mixins"

  .progress-bar
    height: 30px
    .bar
      relative: top 13px
      height: 4px
      border-radius: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        height: 100%
        position: absolute
        background: $color-theme
      .btn-wrapper
        absolute: top -13px left -15px
        box-sizing: border-box
        size: 30px
        padding: 7px
        .btn
          position: relative
          size: 16px
          box-sizing: border-box
          border: 4px solid $white
          background: $color-theme
          border-radius: 50%

</style>
