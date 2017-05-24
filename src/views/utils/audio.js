// let audio
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext
let context
export default class JAudio {
  constructor (url, progresshandler) {
    this.url = url
    this.progresshandler = progresshandler
    if (!context) {
      context = new window.AudioContext()
    }
    this.context = context
    this.source = null
    this.timer = null
    this.startTime = 0
    this.percent = 0
    this.position = null
  }
  loadSound () {
    return new Promise((resolve, reject) => {
      let context = this.context
      console.log(context)
      let url = this.url
      // let url = '/ximalay/group26/M07/C2/30/wKgJWFkZI2eQQt5xAKLXrs5LlLA084.m4a'
      let request = new XMLHttpRequest()
      request.open('GET', url, true)
      request.setRequestHeader('Range', 'bytes=0-200000')
      // request.setRequestHeader('Host', 'http://ws.stream.qqmusic.qq.com')
      request.responseType = 'arraybuffer'
      request.onload = function (e) {
        if (this.status === 200 || this.status === 304 || this.status === 206) {
          context.decodeAudioData(request.response, (buffer) => {
            resolve(buffer)
          }, (error) => {
            reject(error)
          })
        } else if (this.status === 404) {
          reject({
            message: '404'
          })
        }
      }
      request.send()
    })
  }
  play () {
    if (this.timer) {
      cancelAnimationFrame(this.timer)
    }
    if (this.source && this.source.buffer) {
      this.stop()
    }
    let context = this.context
    let source = context.createBufferSource()
    this.source = source
    return new Promise((resolve, reject) => {
      this.loadSound()
        .then((buffer) => {
          source.buffer = buffer
          source.connect(context.destination)
          source.start(0)
          this.startTime = context.currentTime
          this.updatePosition()
          // source.onended = () => {
          //   console.log('ended')
          //   this.endhandler()
          // }
          resolve()
        })
        .catch((error) => {
          console.error(error)
          reject()
        })
    })
  }
  pause () {
    this.context.suspend()
  }
  stop () {
    this.source.stop()
    // this.context.suspend()
  }
  start () {
    this.context.resume()
  }
  stopTimer () {
    cancelAnimationFrame(this.timer)
  }
  dragPlay (percent) {
    let context = this.context
    let source = this.source
    let buffer = source.buffer
    this.source.stop()
    this.source = null
    this.source = context.createBufferSource()
    this.source.buffer = buffer
    this.source.connect(context.destination)
    this.source.start(0, buffer.duration * percent)
    this.startTime = context.currentTime
    // console.log(percent)
    this.position = percent
    this.updatePosition()
  }
  updatePosition () {
    let currentTime = this.context.currentTime - this.startTime
    let duration = this.source.buffer.duration
    if (this.position || this.position === 0) {
      duration = duration * (1 - this.position)
      // console.log(duration)
    }
    // let state = this.context.state
    let percent = currentTime / duration
    // console.log(percent)
    if (this.position || this.position === 0) {
      percent = this.position + percent / (1 / (1 - this.position))
      currentTime = this.source.buffer.duration * this.position + currentTime
      console.log(percent)
    }
    this.percent = percent
    // switch (state) {
    //   case 'running':
    //     percent = currentTime / duration
    //     this.percent = percent
    //     break
    //   case 'suspended':
    //     percent = this.percent
    //     break
    // }
    this.progresshandler(percent, currentTime)
    this.timer = requestAnimationFrame(this.updatePosition.bind(this))
    if (percent >= 1) {
      this.position = null
      cancelAnimationFrame(this.timer)
    }
  }
}

// function singleton (obj) {
//   if (!obj) {
//     audio = new window.AudioContext()
//   }
//   loadSound(url)
//   return audio
// }

// function loadSound (url) {
//   var request = new XMLHttpRequest()
//   console.log(request)
//   request.open('GET', url, true)
//   request.responseType = 'arraybuffer'
//   request.onload = function () {
//     audioContext.decodeAudioData(request.response, function (buffer) {
//       // dogBarkingBuffer = buffer
//       console.log(buffer)
//       playSound(buffer)
//     }, function (error) {
//       console.log(error)
//     })
//   }
//   request.send()
// }

// function playSound (buffer) {
//   var source = audioContext.createBufferSource()
//   source.buffer = buffer
//   source.connect(audioContext.destination)
//   source.start(0)
// }
