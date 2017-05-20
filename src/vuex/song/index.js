const song = {
  state: {
    song: {}
  },
  getters: {
    song: state => state.song
  },
  actions: {
    setSong ({commit}, payload) {
      commit('SET_SONG', payload)
    }
  },
  mutations: {
    'SET_SONG' (state, payload) {
      state.song = payload
    }
  }
}

export default song
