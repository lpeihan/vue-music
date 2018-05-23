import Vue from 'vue';
import Router from 'vue-router';
import Recommends from './pages/recommends/recommends';
import Singers from './pages/singers/singers';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommends'
    },
    {
      path: '/recommends',
      name: 'recommends',
      component: Recommends
    },
    {
      path: '/singers',
      name: 'singers',
      component: Singers
    }
  ]
});
