class Component {
  constructor({ template, state, methods, name }) {
    this.refs = {}
    this.template = template
    this.state = state
    this.methods = methods
    this.el = $(this.template)
    this.el.attr('data-cname', name);
    this.#render()
    this.#bindEvents()
    this.#bindRef()
    this.updateState = new Reactivity({
      state,
      updateCallback: this.#updateElements.bind(this)
    }).updateState
  }

  #render() {
    $('body').append(this.el)
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
    Array.from(this.el.find('[ref]')).forEach(el => {
      const refName = $(el).attr('ref')
      this.refs[refName] = $(el)
    })
  }

  #updateElements(evt, key, value) {
    this.state[key] = value
    // data-bind 
    Array.from([this.el, ...this.el.find(`[data-bind=${key}]`)]).forEach(el => {
      const reg = new RegExp(`{${key}}`, 'g')
      // data-temp
      const temp = $(el).attr('data-temp')
      if (temp) {
        $(el).text(temp.replaceAll(reg, value))
      }
      // data-style
      const styleTemp = $(el).attr('data-style')
      if (styleTemp) {
        $(el).attr('style', styleTemp.replaceAll(reg, value))
      }
    })

    // data-show
    Array.from([this.el, ...this.el.find(`[data-show=${key}]`)]).forEach(el => {
      if (value) {
        $(el).show()
      } else {
        $(el).hide()
      }
    })
  }
}
