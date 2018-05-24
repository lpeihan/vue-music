<template>
  <div id="app">
    <v-header></v-header>
    <tabs></tabs>

    <keep-alive>
      <router-view></router-view>
    </keep-alive>

    <player></player>
  </div>
</template>

<script>
import VHeader from './pages/header/header';
import Tabs from './pages/tabs/tabs';
import Player from './pages/player/player';

export default {
  components: {
    VHeader,
    Tabs,
    Player
  }
};
</script>

<style lang="stylus">
</style>
