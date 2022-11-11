class Game {
  // ui elements
  goodsEls = []
  gameOverEl = null
  restartButtonEl = null
  // arguments
  countdown = 10
  isPause = false
  accountBalance = 500
  energyConsumptionMoney = -50
  carryMoney = -5
  constructor() {
    this.initUI();
  }

  initUI() {
    this.Main = new Main()
    this.initMenu = new InitMenu({
      onStart: () => {
        this.play()
        // this.Main.Music.play('bgm')
        this.Main.Scene.makeNeededGoods()
      }
    })

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
  checkStatus() {
    if (this.accountBalance < 50) {
      this.over()
      return false
    }
    return true
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
    this.countdownTimer.pause()
    this?.trainAnimationTimer?.pause()
    this?.loadingControl?.pause()
  }
  resume() {
    this.isPause = false
    this.menuEls.pause.attr('src', './assets/images/pause@2x.png')
    this.menuEls.pauseText.text('暂停')
    if (this.setNeedInboundPlayTimer) { this.setNeedInboundPlayTimer.resume() }
    this.countdownTimer.resume()
    this?.trainAnimationTimer?.resume()
    this?.loadingControl?.resume()
  }
  nextLoop() {
    this.Main.nextLoop()
  }
  makeProducedGoods() {
    this.Main.makeProducedGoods()
  }
  trainAnimationPlay() {
    this.trainAnimation.play();
    this.departure()
    this.trainMixer.addEventListener('loop', (e) => {
      this.trainAnimation.stop();
      this.arrival()
    });
  }
  trade(cityIdx) {
    const successIdx = this.loadedGoods.findIndex(goods => goods === this.neededGoods[cityIdx])
    if (successIdx > -1) {
      const goods = this.loadedGoods[successIdx]
      this.goodsMeshes[successIdx].visible = false
      this.loadedGoods[successIdx] = null
      // this.neededGoodsEls[cityIdx].hide()
      const money = allGoods[goods].price
      this.accountBalance += money
      const vector = this.cabinMeshes[successIdx].position
      // const { left, top } = this.project3Dto2D(vector)
      // this.message.show(`交易成功！+${money}`, 'success', { left, top: top - 100 })
      this.refreshMusicPlay()
    }
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
