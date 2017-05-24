// let audio
let context
export default class JAudio {
  constructor (url, progresshandler) {
    this.url = url
    this.progresshandler = progresshandler
    if (!context) {
      context = new Audio()
    }
    this.context = context
    this.timer = null
    this.percent = 0
    this.position = null
  }
  loadSound () {
    return new Promise((resolve, reject) => {
      this.context.src = this.url
      this.context.addEventListener('canplay', () => {
        resolve()
      })
      this.context.addEventListener('error', () => {
        reject()
      })
    })
  }
  play () {
    return new Promise((resolve, reject) => {
      this.loadSound()
        .then(() => {
          // this.context.currentTime = 200
          this.context.play()
          this.updatePosition()
          resolve()
        })
        .catch(() => {
          reject()
        })
    })
  }
  pause () {
    this.context.pause()
  }
  stop () {
    this.context.pause()
    // this.context.suspend()
  }
  start () {
    this.context.play()
  }
  stopTimer () {
    cancelAnimationFrame(this.timer)
  }
  dragPlay (percent) {
    let context = this.context
    let duration = context.duration
    // this.context.pause()
    if (this.timer) {
      cancelAnimationFrame(this.timer)
    }
    console.log(duration)
    this.context.currentTime = duration * percent
    this.context.play()
    this.position = percent
    this.updatePosition()
  }
  updatePosition () {
    let currentTime = this.context.currentTime
    let duration = this.context.duration
    if (this.position || this.position === 0) {
      // duration = duration * (1 - this.position)
      // console.log(duration)
    }
    // let state = this.context.state
    let percent = currentTime / duration
    // console.log(percent)
    if (this.position || this.position === 0) {
      // percent = this.position + percent / (1 / (1 - this.position))
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
    // console.log(currentTime)
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
