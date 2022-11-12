class Countdown extends Component {
  constructor({ onOver } = {}) {
    super({
      state: {
        visible: false,
        countdown: 10,
      },
      methods: {
      }
      ,
      template: `<div
      data-show="visible"
      class="flex flex-col items-center fixed top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <span class="text-white font-[huakang] text-[2.8vw]">
        码上掘金 即将到来
      </span>
      <img ref="loadingImage" />
      <span 
        class="text-white font-[huakang] text-[2.8vw]"
        data-bind='countdown'
        data-temp='{countdown}s'></span>
    </div>`
    })

    this.onOver = onOver

    const parseIdx = (idx) => {
      if (idx < 10) {
        return `00${idx}`
      }
      if (idx < 100) {
        return `0${idx}`
      }
      return `${idx}`
    }

    const getUrl = (idx) => queue.getResult(`assets.images.loading.进度条${parseIdx(idx)}.png`)

    this.loadingControl = new Loading({
      el: this.refs.loadingImage,
      getUrl,
      time: 10_000,
      frame: 250
    })
  }

  start() {
    this?.timer?.clear()
    this.updateState('countdown', 10)
    const cbFn = () => {
      this.updateState('countdown', this.state.countdown - 1)
      if (this.state.countdown === 0) {
        this.hide()
        this.onOver?.()
        return
      }

      this?.timer?.clear()
      this.timer = new Timer(cbFn, 1_000)
    }

    this.timer = new Timer(cbFn, 1_000)
    this.loadingControl.play()
  }

  pause() {
    if (this.state.countdown === 0) {
      return
    }
    this.loadingControl.pause()
    this.timer.pause()
  }

  resume() {
    if (this.state.countdown === 0) {
      return
    }
    this.loadingControl.resume()
    this.timer.resume()
  }

  hide() {
    this?.timer?.clear()
    this.updateState('visible', false)
  }
}

class Loading {
  el = null
  idx = 0
  time = 0
  frame = 0
  constructor({ el, getUrl, time, frame } = {}) {
    this.el = el
    this.getUrl = getUrl
    this.time = time
    this.frame = frame
  }
  play() {
    const next = () => {
      const nextEl = this.getUrl(this.idx++)
      if (this.el) {
        this.el.replaceWith(nextEl)
        this.el = nextEl
        this.timer.clear()
        if (this.idx === 250) {
          this.idx = 0
          return
        }
        this.timer = new Timer(next, this.time / this.frame)
      }
    }
    this.timer = new Timer(next, this.time / this.frame)
  }
  pause() {
    this.timer.pause()
  }
  resume() {
    this.timer.resume()
  }
}
