import Vue from 'vue';
import App from './app';
import router from './route';
import store from './store';

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
  store,
  components: { App },
  template: '<App/>'
});
