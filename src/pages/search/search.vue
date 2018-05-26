<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box></search-box>
    </div>
  </div>
</template>

<script>
import SearchBox from '../../components/search-box';

export default {
  components: {
    SearchBox
  }
};
</script>

<style lang="stylus" scoped>
  .search
    .search-box-wrapper
      margin: 20px
</style>
