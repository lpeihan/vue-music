<template>
  <div class="tabs">
    <router-link tag="div" class="tab-item" to="/recommends">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singers">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行</span>
    </router-link>
        <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<style lang="stylus" scoped>
  @import "../../styles/variables"

  $height = 50px

  .tabs
    display: flex
    height: $height
    align-items: center
    .tab-item
      text-align: center
      flex: 1
      .tab-link
        color: $color-text-l
      &.router-link-active
        .tab-link
          color: $color-theme
</style>
