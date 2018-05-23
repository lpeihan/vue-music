import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import getters from './getters';
import mutations from './mutations';
import actions from './actions';

import createLogger from 'vuex/dist/logger';

const isProduction = process.env.NODE_ENV === 'production';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  getters,
  actions,
  plugins: !isProduction ? [createLogger()] : []
});
