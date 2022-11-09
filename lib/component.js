class Component {
  constructor({ template, state, methods, name }) {
    this.template = template
    this.state = state
    this.methods = methods
    this.el = $(this.template)
    this.el.attr('data-cname', name);
    this.render()
    this.bindEvents()
    this.updateState = new Reactivity({
      state,
      updateCallback: this.updateElements.bind(this)
    }).updateState
  }

  render() {
    $('body').append(this.el)
  }

  bindEvents() {
    Array.from(this.el.find('[on-click]')).forEach(el => {
      const methodName = $(el).attr('on-click')
      el.addEventListener('click', this.methods[methodName])
    })
  }

  updateElements(evt, key, value) {
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
