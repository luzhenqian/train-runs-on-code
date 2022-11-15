class Component {
  constructor({ template, state, methods } = {}) {
    this.refs = {}
    this.template = template || ``
    this.state = state || {}
    this.methods = methods || {}
    this.type = typeof this.template === 'string' ? 'static' : 'dynamic'
    this.el = typeof this.template === 'string' ? $(this.template) : $(this.template(this.state))
    this.mount()
    this.#bindEvents()
    this.#bindRef()
    this.updateState = new Reactivity({
      state: this.state,
      updateCallback: this.#updateElements.bind(this)
    }).updateState
  }

  mount() {
    $('body').append(this.el)
  }

  unmount() {
    this.el.remove()
  }

  #bindEvents() {
    const events = [
      'click',
      'change',
      'input',
      'blur',
      'focus',
      'keydown',
      'keyup',
      'keypress',
      'mouseenter',
      'mouseleave',
      'mouseover',
      'mouseout',
      'mousedown',
      'mouseup',
      'touchstart',
      'touchend',
      'touchmove',
      'touchcancel',
      'wheel',
      'scroll',
      'resize',
      'load',
      'unload',
      'abort',
      'error',
      'select',
      'contextmenu',
      'dblclick',
      'drag',
      'dragend',
      'dragenter',
      'dragleave',
      'dragover',
      'dragstart',
      'drop',
      'copy',
      'cut',
      'paste',
      'reset',
      'submit',
      'focusin',
      'focusout',
      'animationstart',
      'animationend',
      'animationiteration',
      'transitionend',
      'transitionstart',
      'transitioncancel',
      'transitionrun',
      'mousewheel'
    ]

    events.forEach(evt => {
      Array.from([this.el, ...this.el.find(`[on-${evt}]`)]).forEach(el => {
        const methodName = $(el).attr(`on-${evt}`)
        if (methodName) {
          $(el).on(evt, this.methods[methodName])
        }
      })
    })
  }

  #bindRef() {
    Array.from([this.el, ...this.el.find('[ref]')]).forEach(el => {
      const refName = $(el).attr('ref')
      if (refName) {
        this.refs[refName] = $(el)
      }
    })
  }

  #updateElements(evt, key, value) {
    this.state[key] = value
    if (this.type === 'dynamic') {
      this.unmount()
      this.el = $(this.template(this.state))
      this.mount()
      this.#bindEvents()
      this.#bindRef()
    }
    this.#render(this.el, key, value)
  }

  #render(el, key, value) {
    // data-class
    // FIXME: selector not working
    Array.from([el, ...el.find(`*[data-class*='${key}']`)]).forEach(el => {
      const reg = new RegExp(`{${key}}`, 'g')
      const classTemp = $(el).attr('data-class')
      if (classTemp) {
        const classRaw = classTemp.replaceAll(reg, value)
        $(el).attr('class', (i, val) => `${val} ${classRaw}`)
      }
    })

    // data-style
    Array.from([el, ...el.find(`*[data-style*=${key}]`)]).forEach(el => {
      const styleTemp = $(el).data('style')
      if (styleTemp) {
        const reg = new RegExp(`{${key}}`, 'g')
        const styleRaw = styleTemp.replaceAll(reg, value)
        $(el).attr('style', (i, val) => `${val || ''} ${styleRaw} `)
      }
    })

    // data-bind 
    Array.from([el, ...el.find(`[data-bind=${key}]`)]).forEach(el => {
      const reg = new RegExp(`{${key}}`, 'g')
      // data-temp
      const temp = $(el).data('temp')
      if (temp) {
        $(el).text(temp.replaceAll(reg, value))
      }
    })

    // data-show
    const dataShowEls = Array.from(el.find(`[data-show=${key}]`))
    const show = el.data('show')
    if (show) {
      dataShowEls.push(el)
    }
    dataShowEls.forEach(el => {
      if (value) {
        $(el).show()
      } else {
        $(el).hide()
      }
    })
  }
}
