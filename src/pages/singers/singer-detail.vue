<template>
  <transition name="slide">
    <div class="singer-detail">
      singer-detail
    </div>
  </transition>
</template>

<style lang="stylus">
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
