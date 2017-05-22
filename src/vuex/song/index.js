const song = {
  state: {
    song: {},
    songList: [],
    RAudio: null
  },
  getters: {
    song: state => state.song,
    songList: state => state.songList,
    RAudio: state => state.RAudio
  },
  actions: {
    setSong ({commit}, payload) {
      commit('SET_SONG', payload)
    },
    setSongList ({commit}, payload) {
      commit('SET_SONG_LIST', payload)
    },
    setRAudio ({commit}, payload) {
      console.log(payload)
      commit('SET_RAUDIO', payload)
    }
  },
  mutations: {
    'SET_SONG' (state, payload) {
      state.song = payload
    },
    'SET_SONG_LIST' (state, payload) {
      state.songList = payload
    },
    'SET_RAUDIO' (state, payload) {
      state.RAudio = payload
    }
  }
}

export default song
