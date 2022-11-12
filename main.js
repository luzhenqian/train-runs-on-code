class Game {
  // ui elements
  gameOverEl = null
  restartButtonEl = null
  // arguments
  isPause = false
  accountBalance = 500
  energyConsumptionMoney = -50
  carryMoney = -5
  constructor() {
    this.initUI();
  }

  initUI() {
    this.Main = new Main()
    this.Main.start()

    this.gameOverEl = $('#game-over')
    this.gameOverEl.hide()
    this.restartButtonEl = $('#restart-button')
    this.restartButtonEl.on('click', this.restart.bind(this))
  }

  arrival() {
    if (this.checkStatus()) {
      this.makeProducedGoods()
      this.loadedGoods = [null, null, null]
      this.updateLoadedGoodsMesh()
      this.nextLoop()
      this.tradeRecords = []
    }
  }
  departure() {
    this.accountBalance += this.energyConsumptionMoney
    // this.message.show(`消耗能源！${this.energyConsumptionMoney}`, 'error')
    this.outboundPlay()
    if (this.setNeedInboundPlayTimer !== null) {
      this.setNeedInboundPlayTimer.clear()
    }
    this.setNeedInboundPlayTimer = new Timer(() => {
      this.needInboundPlay = true
    }, 2_000)
  }
  play() {
    this.makeProducedGoods()
    this.nextLoop()
  }
  pause() {
    this.isPause = true
    this.menuEls.pause.attr('src', './assets/images/start@2x.png')
    this.menuEls.pauseText.text('开始')
    if (this.setNeedInboundPlayTimer) { this.setNeedInboundPlayTimer.pause() }
    this?.trainAnimationTimer?.pause()
    this?.loadingControl?.pause()
  }
  resume() {
    this.isPause = false
    this.menuEls.pause.attr('src', './assets/images/pause@2x.png')
    this.menuEls.pauseText.text('暂停')
    if (this.setNeedInboundPlayTimer) { this.setNeedInboundPlayTimer.resume() }
    this?.trainAnimationTimer?.resume()
    this?.loadingControl?.resume()
  }
  nextLoop() {
    this.Main.nextLoop()
  }
  makeProducedGoods() {
    this.Main.makeProducedGoods()
  }
  over() {
    this.gameOverEl.show()
  }
  restart() {
    this.gameOverEl.hide()
    this.accountBalance = 5_00
    // this.makeNeededGoods()
    this.makeProducedGoods()
    this.bgmPlay()
    this.play()
  }
}

new ResourceLoading().start()
