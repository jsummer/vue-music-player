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
  }
  loadSound () {
    return new Promise((resolve, reject) => {
      let context = this.context
      console.log(context)
      let url = this.url
      let request = new XMLHttpRequest()
      request.open('GET', url, true)
      request.responseType = 'arraybuffer'
      request.onload = function (e) {
        if (this.status === 200 || this.status === 304) {
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
          source.start(0, 200)
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
  updatePosition () {
    let currentTime = this.context.currentTime - this.startTime
    let duration = this.source.buffer.duration - 200
    let state = this.context.state
    let percent
    switch (state) {
      case 'running':
        percent = currentTime / duration
        this.percent = percent
        break
      case 'suspended':
        percent = this.percent
        break
    }
    this.progresshandler(percent, currentTime)
    this.timer = requestAnimationFrame(this.updatePosition.bind(this))
    if (percent >= 1) {
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
