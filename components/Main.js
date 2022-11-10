class Main extends Component {
  constructor() {
    super({
      state: {
        accountBalance: 500,
        producedGoods: [],
        atTheStation: true,
        carryMoney: -5,
        loadedGoods: [],
      },
      methods: {
        carry: (e) => {
          const idx = $(e.target).data('index')
          // 卸载货物
          if (this.state.producedGoods[idx].loaded) {
            // this.loadedGoods[this.producedGoods[idx].cabin] = null
            // this.producedGoods[idx].loaded = false
            const newVal = deepClone(this.state.producedGoods)

            newVal[idx].loaded = false
            this.updateState('producedGoods', newVal)
            // this.accountBalance += this.carryMoney
            // this.message.show(`卸载成功！${this.carryMoney}`, 'error')
            // this.updateAccountBalanceUI()
            this.updateState('accountBalance', this.state.accountBalance + this.state.carryMoney)
          }
          // 选择货物
          else {
            // const goods = this.state.producedGoods[idx].name
            const newVal = deepClone(this.state.producedGoods)
            newVal[idx].loaded = true
            this.updateState('producedGoods', newVal)
            // for (let i = 0; i < this.loadedGoods.length; i++) {
            //   if (!!!this.loadedGoods[i]) {
            //     this.loadedGoods[i] = goods
            //     this.producedGoods[idx].cabin = i
            //     this.producedGoods[idx].loaded = true

            //     // this.accountBalance += this.carryMoney
            //     // this.message.show(`搬运成功！${this.carryMoney}`, 'error')
            //     // this.updateAccountBalanceUI()
            //     break;
            //   }
            // }
          }
          // TODO: 播放音乐
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
        >
        </span>
      </div>

      ${state.producedGoods.map((goods, idx) => `<div
        class="flex flex-col items-center absolute bottom-[7.7vh] left-[${33 + idx * 13}vw]"
      >
        <div ref="producedGoods" class="bg-cover w-[9.6vw] aspect-[1/1]"
          style='background-image: url(./assets/images/goods_${goods.name}_${goods.loaded ? 'off' : 'on'}@2x.png);'></div>
        <div
          ref="producedGoodsButton"
          class="text-[1.35vw] md:scale-75 text-white w-[5vw] aspect-[2/1] flex justify-center items-center font-[huakang] aspect-[2/1] 
          ${goods.loaded ? 'active:bg-[url(./assets/images/reselect-btn-hover.png)] bg-[url(./assets/images/reselect-btn.png)]' : 'active:bg-[url(./assets/images/btn-hover.png)] bg-[url(./assets/images/btn.png)]'} bg-cover bg-center absolute bottom-0 translate-y-1/2 cursor-pointer"
          data-show="atTheStation"
          on-click="carry"
          data-index="${idx}"
        >
          ${goods.loaded ? '卸车' : '装车'}
        </div>
      </div>`).join('')
        }

      <div
        class="absolute right-[12vw] bottom-[2.6vh] w-[16.7vw] bg-[url('./assets/images/reset.png')] bg-cover aspect-[1/1] z-10 cursor-pointer"
        id="refresh"
      ></div>

      <div
        class="absolute left-[86vw] bottom-[10vh] text-white font-[huakang] z-10"
      >
        <div id="refresh-money" class="text-[5vw]"></div>
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
        // TODO
        // this.trainAnimationPlay()
      }
    })

  }

  nextLoop() {
    this.Countdown.start()
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
      // this.goodsEls[i].css(
      //   'background-image',
      //   `url(./assets/images/goods_${goods}_on@2x.png)`)
      // this.goodsEls[i].data(
      //   'goods',
      //   goods
      // )
    }
    this.updateState('producedGoods', newProducedGoods)
  }
}

const allGoods = {
  'meat': {
    name: 'meat',
    price: 40
  },
  'iron': {
    name: 'iron',
    price: 50
  },
  'coal': {
    name: 'coal',
    price: 60
  },
  'oil': {
    name: 'oil',
    price: 70
  },
  'fish': {
    name: 'fish',
    price: 35
  },
  'cotton': {
    name: 'cotton',
    price: 30
  },
  'cpu': {
    name: 'cpu',
    price: 80
  },
  'radish': {
    name: 'radish',
    price: 15
  },
  'wood': {
    name: 'wood',
    price: 20
  },
  'gpu': {
    name: 'gpu',
    price: 80
  }
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}