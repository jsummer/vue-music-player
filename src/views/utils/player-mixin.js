import {mapGetters, mapActions} from 'vuex'
import JAudio from './audio2.js'

const playerMixin = {
  computed: {
    ...mapGetters({
      current: 'song',
      RAudio: 'RAudio'
    }),
    songStatus () {
      return this.current.state || 'stop'
    }
  },
  created () {
    if (this.RAudio) {
      this.RAudio.progresshandler = this.progressHandler
      this.setRAudio(this.RAudio)
    }
  },
  methods: {
    ...mapActions([
      'setSong',
      'setRAudio'
    ]),
    setCurrentSong (i) {
      console.log(this.list)
      let song = this.list[i]
      this.endtime = this.countTime(song.playtime)
      let l = this.list.length
      let imageUrl = `http://imgcache.qq.com/music/photo/album_300/${song.albumId % 100}/300_albumpic_${song.albumId}_0.jpg`
      let currentSong = {
        id: song.id,
        index: i,
        prev: i - 1 < 0 ? (l - 1) : (i - 1),
        next: i + 1 >= l ? 0 : (i + 1),
        name: song.songName,
        singer: song.singerName,
        image: imageUrl,
        state: 'stop',
        percent: 0,
        playtime: song.playtime,
        ctime: 0
      }
      this.setSong(currentSong)
      this.playSong(currentSong)
    },
    playSong (song) {
      if (!this.RAudio) {
        let jaudio = new JAudio(`/wsmusic/${song.id}.m4a?fromtag=46`, this.progressHandler)
        this.setRAudio(jaudio)
      } else {
        this.RAudio.position = null
        this.RAudio.url = `/wsmusic/${song.id}.m4a?fromtag=46`
        this.setRAudio(this.RAudio)
      }
      this.RAudio.play()
        .then(() => {
          this.current.state = 'run'
          this.setSong(this.current)
        })
        .catch(() => {
          this.next()
        })
    },
    next () {
      let current = this.current
      this.setCurrentSong(current.next)
    },
    prev () {
      let current = this.current
      this.setCurrentSong(current.prev)
    },
    play () {
      let songStatus = this.songStatus
      switch (songStatus) {
        case 'run':
          this.RAudio.pause()
          this.current.state = 'stop'
          break
        case 'stop':
          this.RAudio.start()
          this.current.state = 'run'
          break
      }
      this.setSong(this.current)
    },
    pause () {
      this.RAudio.stop()
    },
    progressHandler (percent, ctime) {
      this.current.ctime = Math.floor(ctime)
      this.current.percent = percent
      this.setSong(this.current)
      if (percent >= 1) {
        this.current.percent = 0
        this.setSong(this.current)
        this.next()
      }
    },
    countTime (seconds) {
      let minutes = Math.floor(seconds / 60)
      seconds %= 60
      if (seconds < 10) seconds = '0' + seconds
      if (minutes < 10) minutes = '0' + minutes
      return `${minutes}:${seconds}`
    }
  }
}

export default playerMixin
