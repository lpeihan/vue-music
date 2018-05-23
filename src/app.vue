<template>
  <div id="app">
    <v-header />
    <tabs />
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import VHeader from './pages/header/header';
import Tabs from './pages/tabs/tabs';

export default {
  components: {
    VHeader,
    Tabs
  }
};
</script>

<style lang="stylus">
</style>
