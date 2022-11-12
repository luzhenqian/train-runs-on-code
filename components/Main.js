class Main extends Component {
  tradeRecords = []
  setNeedInboundPlayTimer = null
  constructor() {
    super({
      state: {
        accountBalance: 500,
        producedGoods: [],
        atTheStation: true,
        carryMoney: -5,
        refreshMoney: -20,
        energyConsumptionMoney: -50,
        needPlayInbound: false,
        isPaused: false
      },
      methods: {
        carry: (e) => {
          const idx = $(e.target).data('index')
          if (this.state.accountBalance <= -(this.state.energyConsumptionMoney + this.state.carryMoney)) {
            this.Message.show(`操作失败！${this.state.carryMoney}`, 'error')
            return
          }
          const goods = this.state.producedGoods[idx].name
          // 卸载货物
          if (this.state.producedGoods[idx].loaded) {
            const cabinIdx = this.state.producedGoods[idx].cabin
            const { success } = this.Scene.unloadGoods(cabinIdx)
            if (success) {
              const newProducedGoods = deepClone(this.state.producedGoods)
              newProducedGoods[idx].loaded = false
              newProducedGoods[idx].cabin = null
              this.updateState('producedGoods', newProducedGoods)
              this.Message.show(`卸载成功！${this.state.carryMoney}`, 'error')
              this.updateState('accountBalance', this.state.accountBalance + this.state.carryMoney)
              this.Music.replay('carry')
            }
          }
          // 选择货物
          else {
            const goods = this.state.producedGoods[idx].name
            const { success, cabinIdx } = this.Scene.loadGoods(goods)
            if (success) {
              const newProducedGoods = deepClone(this.state.producedGoods)
              newProducedGoods[idx].loaded = true
              newProducedGoods[idx].cabin = cabinIdx
              this.updateState('producedGoods', newProducedGoods)
              this.Message.show(`搬运成功！${this.state.carryMoney}`, 'error')
              this.updateState('accountBalance', this.state.accountBalance + this.state.carryMoney)
              this.Music.replay('carry')
            }
          }
        },
        refreshProducedGoods: () => {
          const { left, top } = this.refs.refreshButton[0].getBoundingClientRect()
          if (this.state.accountBalance + this.state.refreshMoney + this.state.energyConsumptionMoney < 0) {
            this.Message.show('余额不足', 'error', { left, top }, 'transform: translate(50%, -100%);')
            return
          }
          const newProducedGoods = deepClone(this.state.producedGoods.map(goods => {
            if (!goods.loaded) {
              const keys = Object.keys(allGoods)
              const len = keys.length
              goods.name = keys[Math.floor(Math.random() * len)]
            }
            return goods
          }))

          this.Message.show(`刷新成功！${this.state.refreshMoney}`, 'error', { left, top }, 'transform: translate(50%, -100%);')
          this.updateState('producedGoods', newProducedGoods)
          this.updateState('accountBalance', this.state.accountBalance + this.state.refreshMoney)
          this.Music.replay('refresh')
        }
      }
      ,
      template: (state) => `<div class="fixed bottom-0 left-0 right-0 bg">
      <div
        class="absolute bg-[url('./assets/images/money.png')] left-[2.3vw] bottom-[6.3vh] bg-cover w-[28vw] aspect-[2.7/1]"
      >
        <span
          ref="accountBalance"
          class="absolute text-white left-[50%] top-[50%] translate-x-[-2.3vw] translate-y-[-60%] text-[2.4vw] font-[huakang]"
        >${state.accountBalance}￥
        </span>
      </div>

      ${state.producedGoods.map((goods, idx) => `<div
        class="flex flex-col items-center absolute bottom-[7.7vh] left-[${33 + idx * 13}vw]"
      >
        <div ref="producedGoods" class="bg-cover w-[9.6vw] aspect-[1/1]"
          style='background-image: url(./assets/images/goods_${goods.name}_${goods.loaded || !state.atTheStation || state.isPaused ? 'off' : 'on'}@2x.png);'></div>
        ${state.atTheStation && !state.isPaused ? `<div
          ref="producedGoodsButton"
          class="text-[1.35vw] md:scale-75 text-white w-[5vw] aspect-[2/1] flex justify-center items-center font-[huakang] aspect-[2/1] 
          ${goods.loaded ? 'active:bg-[url(./assets/images/reselect-btn-hover.png)] bg-[url(./assets/images/reselect-btn.png)]' : 'active:bg-[url(./assets/images/btn-hover.png)] bg-[url(./assets/images/btn.png)]'} bg-cover bg-center absolute bottom-0 translate-y-1/2 cursor-pointer"
          data-show="atTheStation"
          on-click="carry"
          data-index="${idx}"
        >
          ${goods.loaded ? '卸车' : '装车'}
        </div>` : ''}
      </div>`).join('')
        }

      <div
        ref="refreshButton"
        class="absolute right-[12vw] bottom-[2.6vh] w-[16.7vw] bg-[url('./assets/images/reset.png')] bg-cover aspect-[1/1] z-10 cursor-pointer"
        ${!state.atTheStation || state.isPaused || state.producedGoods.every(goods => goods.loaded) ? 'style="filter: grayscale(100%); pointer-events:none;' : ''}
        on-click="refreshProducedGoods"
      ></div>

      <div
        class="absolute left-[86vw] bottom-[10vh] text-white font-[huakang] z-10"
      >
        <div class="text-[5vw]">${-state.refreshMoney}￥</div>
        <div class="text-[1.55vw]">码上掘金</div>
      </div>

      <div
        class="absolute right-0 bottom-0 w-[27vw] bg-[url('./assets/images/bg.png')] bg-cover aspect-[1.4/1]"
      ></div>
    </div>
`
    })

    this.Countdown = new Countdown({
      onOver: () => {
        this.updateState('atTheStation', false)
        this.Scene.trainAnimationPlay()
      }
    })

    this.Music = new Music();
    this.Message = new Message()
    this.Menu = new Menu({
      onPause: (isPause) => {
        if (isPause) {
          this.pause()
        } else {
          this.resume()
        }
      },
      onBgmPlay: (isPlay) => {
        if (isPlay) {
          this.Music.play('bgm')
        } else {
          this.Music.pause('bgm')
        }
      },
      onHelp: () => {
        if (!this.Help) {
          this.Help = new Help()
        }
        this.Help.show()
      }
    })
    this.Scene = new Scene({
      onInbound: () => {
        this.updateState('atTheStation', true)
        if (this.checkStatus()) {
          this.nextLoop()
        }
      },
      onOutbound: () => {
        this.updateState('atTheStation', false)
        this.setNeedInboundPlayTimer = new Timer(() => {
          this.needPlayInbound = true
        }, 2000)
        this.Music.play('outbound')
        this.updateState('accountBalance', this.state.accountBalance + this.state.energyConsumptionMoney)
        this.Message.show(`消耗能源！${this.state.energyConsumptionMoney}`, 'error')
      },
      onAnimate: () => {
        if (this.Scene.cabinMeshes[1].position.distanceTo(this.Scene.portMesh.position) < 600) {
          if (this.needPlayInbound) {
            this.needPlayInbound = false
            this.Music.play('inbound')
          }
        }
        // 抵达城市
        this.Scene.cityMeshes.forEach((cityMesh, idx) => {
          if (this.Scene.cabinMeshes[1].position.distanceTo(this.Scene.cityMeshes[idx].position) < 800) {
            if (this.tradeRecords[idx]) { return }
            this.tradeRecords[idx] = true
            this.trade(idx)
          }
        })
      }
    });
  }

  start() {
    this.InitMenu = new InitMenu({
      onStart: () => {
        this.Music.play('bgm')
        this.nextLoop()
      }
    })
  }

  nextLoop() {
    this.tradeRecords = []
    this.Countdown.start()
    this.makeProducedGoods()
    this.Scene.makeNeededGoods();
  }

  makeProducedGoods() {
    const goodsEls = [this.refs.producedGoodsOne, this.refs.producedGoodsTwo, this.refs.producedGoodsThree]
    const newProducedGoods = []
    for (let i = 0; i < 3; i++) {
      let goods = Object.values(allGoods)[Math.floor(Math.random() * Object.keys(allGoods).length)]
      newProducedGoods[i] = {
        name: goods.name,
        loaded: false
      }
    }
    this.updateState('producedGoods', newProducedGoods)
  }

  trade(cityIdx) {
    const successIdx = this.Scene.loadedGoods.findIndex(goods => goods === this.Scene.state.neededGoods[cityIdx])
    if (successIdx > -1) {
      const goods = this.Scene.loadedGoods[successIdx]
      this.Scene.goodsMeshes[successIdx].visible = false
      this.Scene.loadedGoods[successIdx] = null
      this.Scene.updateState('neededGoods', this.Scene.state.neededGoods.map((goods, idx) => idx === cityIdx ? null : goods))
      const money = allGoods[goods].price
      this.updateState('accountBalance', this.state.accountBalance += money)
      const vector = this.Scene.cabinMeshes[successIdx].position
      const { left, top } = this.Scene.project3Dto2D(vector)
      this.Message.show(`交易成功！+${money}`, 'success', { left, top: top - 100 })
      this.Music.play('refresh')
    }
  }

  checkStatus() {
    if (this.state.accountBalance < 50) {
      this.over()
      return false
    }
    return true
  }

  pause() {
    this.updateState('isPaused', true)
    this.Countdown.pause()
    this.setNeedInboundPlayTimer?.pause()
    if (this.Countdown.state.countdown === 0) {
      this.Scene.pause()
    }
  }

  resume() {
    this.updateState('isPaused', false)
    this.Countdown.resume()
    this.setNeedInboundPlayTimer?.resume()
    if (this.Countdown.state.countdown === 0) {
      this.Scene.resume()
    }
  }

  over() {
    if (!this.Over) {
      this.Over = new GameOver({
        onRestart: () => {
          this.updateState('accountBalance', 500)
          this.nextLoop()
        }
      })
    }
    this.Over.show()
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
