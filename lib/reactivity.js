class Reactivity {
  constructor({ state, updateCallback }) {
    this.state = state;
    this.updateState = this.updateState.bind(this)
    this.updateCallback = updateCallback
    this.initUpdate()
    this.bindEvents()
  }

  updateState(key, value) {
    if (typeof value === 'function') {
      $(this).trigger(`state.change`, [key, value(this.state)]);
      return
    }
    $(this).trigger(`state.change`, [key, value]);
  }

  bindEvents() {
    $(this).on(`state.change`, this.updateCallback);
  }

  initUpdate() {
    Object.keys(this.state).forEach((key) => {
      this.updateCallback(null, key, this.state[key]);
    });
  }
}
