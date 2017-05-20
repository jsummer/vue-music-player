import Vue from 'vue'
import Vuex from 'vuex'
import song from './song/'
import user from './user/'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  modules: {
    song,
    user
  }
})
