import Vue from 'vue';
import App from './app';
import router from './route';

import lazyload from 'vue-lazyload';

import './styles/index.styl';
import './utils/axios';

Vue.use(lazyload, {
  loading: require('./assets/logo.png')
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
