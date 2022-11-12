
class Message {
  duration = 1600
  timers = []

  show(text, type = 'info', position = undefined, style = '', duration = this.duration) {
    const colors = {
      success: '#C0FF00',
      error: '#FF001E',
      info: '#FFFFFF'
    }
    const color = colors[type]
    const el = $(`<div
    class="text-[2vw] text-white fixed left-[18vw] bottom-[24vh] font-[huakang] -translate-x-1/2 text-[${color}] -translate-y-[${this.timers.length * 6}vh]"
    style="display: none; ${position ? `left: ${position.left}px; top: ${position.top}px; ${style}` : ''}" > ${text}</div > `)
    $('body').append(el)
    el.fadeIn()
    const timer = setTimeout(() => {
      el.fadeOut()
      const idx = this.timers.findIndex(t => t === timer)
      this.timers.splice(idx, 1)
      el.remove()
    }, duration)
    this.timers.push(timer)
  }
}
