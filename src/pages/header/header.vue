<template>
  <div class="header">
    <div class="icon"></div>
    <h1 class="text">Chicken Music</h1>
  </div>
</template>

<style lang="stylus">
  @import "../../styles/variables"
  @import "../../styles/mixins"

  $height = 50px

  .header
    height: $height
    color: $color-theme
    display: flex
    justify-content: center
    align-items: center
    .icon
      size: 24px 26px
      background: url('./logo.png')
      background-size: 100% 100%
    .text
      margin-left: 10px
      font-size: $font-size-large

</style>
