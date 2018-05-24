<template>
  <ul class="song-list">
    <li class="song" v-for="(song, index) in songs" :key="index">
      <h2 class="name">{{song.name}}</h2>
      <p class="desc">{{song.singer}}·{{song.album}}</p>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  }
};
</script>

<style lang="stylus" scoped>
  @import "../styles/variables"
  @import "../styles/mixins"

  .song-list
    padding: 20px
    .song
      margin-bottom: 20px
      line-height: 20px
      .name
        color: $color-text
        no-wrap()
      .desc
        margin-top: 6px
        color: $color-text-d
        no-wrap()
</style>
