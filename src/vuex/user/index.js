const user = {
  state: {
    song1: {}
  },
  getters: {
    song1: state => state.song1
  },
  actions: {
    setSong ({commit}, payload) {
      commit('SET_SONG', payload)
    }
  },
  mutations: {
    'SET_SONG' (state, payload) {
      state.song1 = payload
    }
  }
}

export default user
