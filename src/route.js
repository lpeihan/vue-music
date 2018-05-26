import Vue from 'vue';
import Router from 'vue-router';
import Recommends from './pages/recommends/recommends';
import Singers from './pages/singers/singers';
import SingerDetail from './pages/singers/singer-detail';
import Disc from './pages/disc/disc';
import Rank from './pages/rank/rank';

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
      component: Recommends,
      children: [
        {
          path: ':id',
          name: 'disc',
          component: Disc
        }
      ]
    },
    {
      path: '/singers',
      name: 'singers',
      component: Singers,
      children: [
        {
          path: ':id',
          name: 'singerDetail',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank
    }
  ]
});
