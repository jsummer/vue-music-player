<template>
  <div>
    <header class="header">
      <div class="blum-wrap">
        <div class="left">
          <div class="blum-avatar">
            <img src="" alt="">
          </div>
          <div class="blum-info">
            <div class="blum-name"></div>
            <div class="blum-other"></div>
          </div>
        </div>
        <div class="right">
          <div class="options">
          </div>
        </div>
      </div>
    </header>
    <div class="song-list-container" :style="{bottom: current.index ? '60px' : '0px'}">
      <ul class="song-list">
        <li 
          v-for="(song, index) in list"
          key="index"
          class="song"
          :class="{active: index === current.index}"
          @touchstart="selectSongStart($event, index)"
          @touchmove="selectSongMove"
          @touchend="selectSongEnd">
          <div>
            <div class="no">{{prefixNo(index + 1) + '.'}}</div>
            <div class="song-name">{{song.songName}}</div>
          </div>
          <div class="playtime">
            <img class="bar" v-if="index === current.index" src="/static/icon/bars.svg" alt="">
            {{countTime(song.playtime)}}
          </div>
        </li>
      </ul>
    </div>
    <audio :src="songUrl"></audio>
    <footer v-if="current.index || current.index === 0" class="footer" ref="footer">
      <div class="music-info">
        <div class="avatar">
          <img :src="current.image" alt="">
        </div>
        <div>
          <div class="song-name">{{current.name}}</div>
          <div class="singer">{{current.singer}}</div>
        </div>
      </div>
      <div class="music-option">
        <i
          class="fa fa-backward button prev"
          aria-hidden="true"
          @touchstart="prev"></i>
        <i class="fa button play" :class="{'fa-play-circle-o': songStatus === 'stop', 'fa-pause-circle-o': songStatus === 'run'}" aria-hidden="true" @touchstart="play"></i>
        <i 
          class="fa fa-forward button next"
          aria-hidden="true"
          @touchstart="next"></i>
      </div>
      <div class="progress" ref="progress"></div>
    </footer>
  </div>
</template>
<script>
  // import axios from 'axios'
  // import jsonp from 'jsonp'
  // import $ from 'jquery'
  // import getSingle from './utils/singleton.js'
  import JAudio from './utils/audio.js'
  import songlist from './songList.js'
  import {mapGetters, mapActions} from 'vuex'
  export default {
    data () {
      return {
        list: [],
        songUrl: '',
        jaudio: null,
        songStatus: 'stop',
        touchStartIndex: null,
        touchStartPos: {
          x: null,
          y: null
        }
      }
    },
    computed: {
      ...mapGetters({
        current: 'song'
      })
    },
    methods: {
      ...mapActions([
        'setSong'
      ]),
      fetchSongList () {
        this.list = songlist.songlist
        // axios.get('/static/data/songList.json')
        //   .then((res) => {
        //     console.log(typeof res.data)
        //     this.list = res.data.songlist
        //     console.log(this.list)
        //   })
        //   .catch((err) => {
        //     console.error(err.message)
        //   })
      },
      prefixNo (no) {
        if (no < 10) {
          return '0' + no
        }
        return no
      },
      countTime (seconds) {
        let minutes = Math.floor(seconds / 60)
        seconds %= 60
        if (seconds < 10) seconds = '0' + seconds
        if (minutes < 10) minutes = '0' + minutes
        return `${minutes}:${seconds}`
      },
      selectSongStart (e, i) {
        this.touchStartIndex = i
        this.touchStartPos.x = e.changedTouches[0].clientX
        this.touchStartPos.y = e.changedTouches[0].clientY
        // let song = this.list[i]
        // let l = this.list.length
        // let imageUrl = `http://imgcache.qq.com/music/photo/album_300/${song.albumId % 100}/300_albumpic_${song.albumId}_0.jpg`
        // let currentSong = {
        //   id: song.id,
        //   index: i,
        //   prev: i - 1 < 0 ? (l - 1) : (i - 1),
        //   next: i + 1 >= l ? 0 : (i + 1),
        //   name: song.songName,
        //   singer: song.singerName,
        //   image: imageUrl
        // }
        // this.setSong(currentSong)
        // this.playSong(currentSong)
      },
      selectSongMove (e) {
        console.log(e)
      },
      selectSongEnd (e) {
        let clientX = e.changedTouches[0].clientX
        let clientY = e.changedTouches[0].clientY
        let startX = this.touchStartPos.x
        let startY = this.touchStartPos.y
        console.log(clientX, clientY)
        console.log(startX, startY)
        if ((clientX === startX) && (clientY === startY)) {
          this.setCurrentSong(this.touchStartIndex)
        }
      },
      setCurrentSong (i) {
        let song = this.list[i]
        let l = this.list.length
        let imageUrl = `http://imgcache.qq.com/music/photo/album_300/${song.albumId % 100}/300_albumpic_${song.albumId}_0.jpg`
        let currentSong = {
          id: song.id,
          index: i,
          prev: i - 1 < 0 ? (l - 1) : (i - 1),
          next: i + 1 >= l ? 0 : (i + 1),
          name: song.songName,
          singer: song.singerName,
          image: imageUrl
        }
        this.setSong(currentSong)
        this.playSong(currentSong)
      },
      playSong (song) {
        console.log(song)
        if (!this.jaudio) {
          this.jaudio = new JAudio(`/wsmusic/${song.id}.m4a?fromtag=46`, this.progressHandler)
        } else {
          this.jaudio.url = `/wsmusic/${song.id}.m4a?fromtag=46`
        }
        this.jaudio.play()
          .then(() => {
            this.songStatus = 'run'
          })
          .catch(() => {
            this.next()
          })
      },
      next () {
        this.$refs.progress.style.width = '0px'
        this.songStatus = 'stop'
        let current = this.current
        this.setCurrentSong(current.next)
      },
      prev () {
        this.$refs.progress.style.width = '0px'
        this.songStatus = 'stop'
        let current = this.current
        this.setCurrentSong(current.prev)
      },
      play () {
        let songStatus = this.songStatus
        console.log(songStatus)
        switch (songStatus) {
          case 'run':
            this.jaudio.pause()
            this.songStatus = 'stop'
            break
          case 'stop':
            this.jaudio.start()
            this.songStatus = 'run'
            break
        }
      },
      pause () {
        this.jaudio.stop()
      },
      progressHandler (percent) {
        console.log(percent)
        let width = this.$refs.footer.clientWidth
        this.$refs.progress.style.width = width * percent + 'px'
        console.log(percent)
        if (percent >= 1) {
          this.$refs.progress.style.width = '0px'
          this.songStatus = 'stop'
        }
        // if (percent >= 1) {
        //   this.$refs.progress.style.width = '0px'
        //   this.next()
        // }
      }
    },
    created () {
      console.log(songlist)
      console.log(this.current)
      this.fetchSongList()
    }
  }
</script>
<style scoped lang="less">
  .header{
    position: absolute;
    top: 0;
    width: 100%;
    height: 35vh;
    background-color: #ff0;
    .blum-wrap{
      height: 78px;
      position: absolute;
      bottom: -39px;
      left: 3vw;
      width: 94vw;
      background-color: #fff;
      z-index: 100;
      border-radius: 2vw;
    }
  }
  .song-list-container{
    position: absolute;
    top: 35vh;
    bottom: 60px;
    width: 100%;
    overflow-y: scroll;
    background-color: #ecf3fd;
    .song-list{
      padding: 48px 2vw 0;
    }
    .song-name{
      display: inline-block;
    }
    .no{
      display: inline-block;
    }
    .bar{
      width: 5vw;
      vertical-align: -2px;
    }
    .song{
      display: flex;
      justify-content: space-between;
      padding: 14px 0;
      font-size: 13px;
      color: #8e9fcc;
      &.active{
        color: #8094ba;
        font-weight: 700;
      }
    }
    .playtime{
    }
  }
  .footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    background-color: #fff;
    .progress{
      position: absolute;
      bottom: 0;
      left: 0;
      height: 5px;
      background-color: #7daffd; 
    }
  }
  .music-info{
    display: flex;
    align-items: center;
    .avatar{
      width: 50px;
    }
    img{
      width: 100%;
    }
  }
  .music-option{
    display: flex;
    align-items: center;
  }
  .button{
    font-size: 22px;
    margin: 0 4px;
    color: #7daffd;
    &.prev{
    }
    &.play{
      font-size: 39px;
    }
    &.next{
    }
  }
</style>
