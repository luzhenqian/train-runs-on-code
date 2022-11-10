class Game {
  // ui elements
  goodsEls = []
  menuEls = {}
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
    this.Scene = new Scene();
    // this.initCanvas().then(() => {
    //   // 
    // })
  }
  
  initUI() {

    // this.menuEls = {
    //   'music': $('#bgm'),
    //   'pause': $('#pause'),
    //   'pauseText': $('#pause-text'),
    //   'help': $('#help'),
    // }

    // this.menuEls.music.on('click', this.bgmPlay.bind(this))
    // this.menuEls.pause.on('click', () => {
    //   this.isPause ? this.resume() : this.pause()
    // })
    // this.menuEls.help.on('click', () => {
    //   this.pause()
    //   new Help()
    // })

    this.Main = new Main()
    this.initMenu = new InitMenu({
      onStart: () => {
        this.play()
        this.Main.Music.play('bgm')
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
      // this.makeNeededGoods()
      this.activeGoodsControl()
      this.loadedGoods = [null, null, null]
      this.updateLoadedGoodsMesh()
      // this.neededGoodsEls.forEach(neededGoodsEl => neededGoodsEl.show())
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
    this.activeGoodsControl()
    this.makeProducedGoods()
    // this.makeNeededGoods()
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
    this.activeGoodsControl()
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
  activeGoodsControl() {
    this.goodsEls.forEach((goodsEl, idx) => {
      goodsEl.css(
        'background-image',
        `url(./assets/images/goods_${this.producedGoods[idx]?.name || 'gpu'}_on@2x.png)`
      )
    })
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
  updateProducedGoodsUI() {
    this.goodsEls.forEach((goodsEl, idx) => {
      const status = this.producedGoods[idx].loaded ? 'off' : 'on'
      goodsEl.css(
        'background-image',
        `url(./assets/images/goods_${this.producedGoods[idx].name}_${status}@2x.png)`
      )
    })
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
