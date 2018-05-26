<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input type="text" class="input" :placeholder="placeholder" v-model="text">
    <i class="icon-dismiss"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      text: ''
    };
  },
  create() {
    this.$watch('text', (text) => {
      this.$emit('text', text);
    });
  }
};
</script>

<style lang="stylus" scoped>
  @import "../styles/mixins"
  @import "../styles/variables"

  .search-box
    display: flex
    align-items: center
    height: 40px
    padding: 0 8px
    background: $color-highlight-background
    border-radius: 10px

    .icon-search
      font-size: 24px
      color: $color-background

    .input
      flex: 1
      margin: 0 8px
      height: 28px
      line-height: 28px
      color: $color-text
      background: $color-highlight-background
      outline: none
      &::placeholder
        color: $color-text-d

    .icon-dismiss
      font-size: 18px
      color: $color-background
</style>
