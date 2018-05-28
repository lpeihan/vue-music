import Vue from 'vue';
import Router from 'vue-router';
import Recommends from './pages/recommends/recommends';
import Singers from './pages/singers/singers';
import SingerDetail from './pages/singers/singer-detail';
import Disc from './pages/disc/disc';
import Rank from './pages/rank/rank';
import TopList from './pages/rank/top-list';
import Search from './pages/search/search';

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
      component: Rank,
      children: [
        {
          path: ':id',
          name: 'topList',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      children: [
        {
          path: ':id',
          name: 'singerDetail',
          component: SingerDetail
        }
      ]
    }
  ]
});
