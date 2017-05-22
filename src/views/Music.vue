<template>
  <div>
    <div class="header">
      <router-link tag="div" class="back" to="/">
        <i class="fa fa-arrow-left" aria-hidden="true"></i>
      </router-link>
      <div>
        Dear Michael
      </div>
      <div class="more-options">
        <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
      </div>
    </div>
    <div class="song-body">
      <div class="album-pictures">
        <div class="album-picture">
          <img :src="current.image" alt="">
        </div>
      </div>
      <div class="music-option-container">
        <div class="music-option">
          <i
            class="fa fa-backward button prev"
            aria-hidden="true"
            @touchstart="prev"></i>
          <i class="fa button play" :class="{'fa-play-circle-o': current.state === 'stop', 'fa-pause-circle-o': current.state === 'run'}" aria-hidden="true" @touchstart="play"></i>
          <i 
            class="fa fa-forward button next"
            aria-hidden="true"
            @touchstart="next"></i>
        </div>
        <div class="progress" ref="progress" :style="{width: w + 'px'}">
          <div class="start-time">
            {{countTime(current.ctime)}}
          </div>
          <div class="end-time">
            {{countTime(current.playtime)}}
          </div>
          <div class="progress-cursor" :style="{width: w * current.percent + 'px'}"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import songlist from './songList.js'
  // import JAudio from './utils/audio.js'
  // import {mapGetters, mapActions} from 'vuex'
  import playerMixin from './utils/player-mixin.js'
  export default {
    mixins: [playerMixin],
    data () {
      return {
        list: songlist.songlist,
        w: document.documentElement.clientWidth - 14
      }
    },
    computed: {
      // ...mapGetters({
      //   current: 'song',
      //   RAudio: 'RAudio'
      // }),
      // songStatus () {
      //   return this.current.state || 'stop'
      // }
    },
    methods: {
      // ...mapActions(['setSong', 'setRAudio']),
      // setCurrentSong (i) {
      //   console.log(this.list)
      //   let song = this.list[i]
      //   this.endtime = this.countTime(song.playtime)
      //   let l = this.list.length
      //   let imageUrl = `http://imgcache.qq.com/music/photo/album_300/${song.albumId % 100}/300_albumpic_${song.albumId}_0.jpg`
      //   let currentSong = {
      //     id: song.id,
      //     index: i,
      //     prev: i - 1 < 0 ? (l - 1) : (i - 1),
      //     next: i + 1 >= l ? 0 : (i + 1),
      //     name: song.songName,
      //     singer: song.singerName,
      //     image: imageUrl,
      //     state: 'stop',
      //     percent: 0,
      //     playtime: song.playtime,
      //     ctime: 0
      //   }
      //   this.setSong(currentSong)
      //   this.playSong(currentSong)
      // },
      // playSong (song) {
      //   if (!this.RAudio) {
      //     let jaudio = new JAudio(`/wsmusic/${song.id}.m4a?fromtag=46`, this.progressHandler)
      //     this.setRAudio(jaudio)
      //   } else {
      //     this.RAudio.url = `/wsmusic/${song.id}.m4a?fromtag=46`
      //     this.setRAudio(this.RAudio)
      //   }
      //   this.RAudio.play()
      //     .then(() => {
      //       this.current.state = 'run'
      //       this.setSong(this.current)
      //     })
      //     .catch(() => {
      //       this.next()
      //     })
      // },
      // next () {
      //   let current = this.current
      //   this.setCurrentSong(current.next)
      // },
      // prev () {
      //   let current = this.current
      //   this.setCurrentSong(current.prev)
      // },
      // play () {
      //   let songStatus = this.songStatus
      //   switch (songStatus) {
      //     case 'run':
      //       this.RAudio.pause()
      //       // this.songStatus = 'stop'
      //       this.current.state = 'stop'
      //       break
      //     case 'stop':
      //       this.RAudio.start()
      //       // this.songStatus = 'run'
      //       this.current.state = 'run'
      //       break
      //   }
      //   this.setSong(this.current)
      // },
      // pause () {
      //   this.RAudio.stop()
      // },
      // progressHandler (percent, ctime) {
      //   this.current.ctime = Math.floor(ctime)
      //   this.current.percent = percent
      //   this.setSong(this.current)
      //   if (percent >= 1) {
      //     this.current.percent = 0
      //     this.setSong(this.current)
      //     this.next()
      //   }
      // },
      // countTime (seconds) {
      //   let minutes = Math.floor(seconds / 60)
      //   seconds %= 60
      //   if (seconds < 10) seconds = '0' + seconds
      //   if (minutes < 10) minutes = '0' + minutes
      //   return `${minutes}:${seconds}`
      // }
    },
    created () {
      // if (this.RAudio) {
      //   this.RAudio.progresshandler = this.progressHandler
      //   this.setRAudio(this.RAudio)
      // }
    }
  }
</script>
<style lang="less" scoped>
  .header{
    height: 8vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #eee;
  }
  .song-body{
    height: 92vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .album-picture{
    width: 75vw;
    height: 75vw;
    background-color: #000;
    margin: 4vh 0;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
  .music-option-container{
    width: 100%;
    position: relative;
    padding: 5vh 0;
    .button{
      font-size: 26px;
      color: #7daffd;
      &.play{
        font-size: 58px;
        margin: 0 15vw;
      }
    }
    .progress{
      position: absolute;
      top: 0;
      left: 7px;
      height: 3px;
      width: 100%;
      background-color: #e3eaf5;
    }
    .start-time{
      position: absolute;
      left: 0;
    }
    .end-time{
      position: absolute;
      right: 0;
    }
    .progress-cursor{
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 100%;
      background-color: #7daffd;
      &::after{
        content: '';
        position: absolute;
        width: 14px;
        height: 14px;
        background-color: #fff;
        box-shadow: 0 0px 6px rgba(0, 0, 0, .5);
        position: absolute;
        top: 50%;
        right: -7px;
        border-radius: 50%;
        transform: translate(0, -50%);  
      }
    }
  }
  .music-option{
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
