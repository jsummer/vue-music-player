import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Music from '@/views/Music'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: 'music/:id',
      name: 'music',
      component: Music
    }
  ]
})
