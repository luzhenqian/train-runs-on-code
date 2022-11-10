class Help extends Component {
  constructor({ onClose } = {}) {
    super({
      state: {
        visible: true,
      },
      methods: {
        onClose: () => {
          this.hide()
          onClose?.()
        },
        scrollbarMouseDown: (e) => {
          e.preventDefault()
          const scrollbarButtonEl = this.refs.scrollbarButton
          const scrollbarTrackEl = this.refs.scrollbarTrack
          const helpContentEl = this.refs.helpContent
          const body = $('body')
          const top = Number(scrollbarButtonEl.css('top').replace('px', ''))
          const start = e.originalEvent.clientY - top
          const moveCallback = (e) => {
            e.preventDefault()
            const clientY = e.originalEvent.clientY
            let delta = clientY - start
            if (delta < 0) {
              delta = 0
            }
            if (delta > scrollbarTrackEl.height() - scrollbarButtonEl.height()) {
              delta = scrollbarTrackEl.height() - scrollbarButtonEl.height()
            }

            scrollbarButtonEl.css('top', `${delta}px`)
            const ratio = delta / (scrollbarTrackEl.height() - scrollbarButtonEl.height())
            helpContentEl.css('transform', `translateY(calc(-${ratio * (helpContentEl.height() - body.height())}px))`)
          }
          body.on('mousemove', moveCallback)
          const upCallback = () => {
            body.off('mousemove', moveCallback)
            body.off('mouseup', upCallback)
          }
          body.on('mouseup', upCallback)
        },
        scrollbarMouseWheel: (e) => {
          e.preventDefault()
          const scrollbarButtonEl = this.refs.scrollbarButton
          const scrollbarTrackEl = this.refs.scrollbarTrack
          const helpContentEl = this.refs.helpContent
          const body = $('body')
          const top = Number(scrollbarButtonEl.css('top').replace('px', ''))
          let delta = top - e.originalEvent.wheelDelta / 20

          if (delta < 0) {
            delta = 0
          }
          if (delta > scrollbarTrackEl.height() - scrollbarButtonEl.height()) {
            delta = scrollbarTrackEl.height() - scrollbarButtonEl.height()
          }

          scrollbarButtonEl.css('top', `${delta}px`)
          const ratio = delta / (scrollbarTrackEl.height() - scrollbarButtonEl.height())
          helpContentEl.css('transform', `translateY(calc(-${ratio * (helpContentEl.height() - body.height())}px))`)
        }
      }
      ,
      template: `<div
      data-show="visible"
      on-mousewheel="scrollbarMouseWheel"
      class="fixed top-0 bottom-0 left-0 right-0 bg-black z-50 opacity-90 flex flex-col justify-center items-center gap-[2vw]"
    >
      <div
        class="relative bg-[url('./assets/images/Div@2x.png')] bg-cover h-[81.5vh] aspect-[1.25/1] pl-[3.125vw] pr-[1.67vw]"
      >
        <img
          on-click='onClose'
          class="absolute left-0 top-0 w-[5.3vw] aspect-[1/1] -translate-x-[20%] -translate-y-[20%] z-10"
          src="./assets/images/close@2x.png"
        />
        <div class="flex w-full h-full justify-between">
          <div class="overflow-hidden w-[calc(100%-2.4vw)] my-[0.9375vw]">
            <div ref="helpContent" class="flex flex-col">
              <img
                src="./assets/images/element1@2x.png"
                class="w-[17.5vw] aspect-[1.86/1]"
              />
              <pre
                class="p-[1.25vw] text-[0.935vw] text-white bg-[#140805] rounded-[20px] w-[fit-content]"
              >长久以来，
南方是一个拥有富饶资源的国家，而北方则是拥有金矿资源的五个国度
在拥有6大国家的<span class="text-[#06AAFF]">“码上大陆”</span>，有条不成文的规定，那便是——以物换物
然而，金矿5国打算矿石结算…
于是，为了实现一带一路，南方国家修建了一条贯穿世界的铁路———</pre>
              <div>
                <div
                  class="text-[#F7AF65] text-[1.25vw] my-[2.6vh] font-[huakang]"
                >
                  铁路上唯一的火车——
                </div>
                <pre class="text-[0.935vw] text-white">
火车将<span class="text-[#06AAFF]">拥有 3 节车厢</span>，每节车厢可以<span class="text-[#06AAFF]">装载 1 项货物</span>资源。
货物的种类是可以重复的。是的！ 3 节车厢中可以全部装载 AMD 显卡！</pre>
              </div>
              <div class="flex justify-between">
                <div>
                  <div
                    class="text-[#F7AF65] text-[1.25vw] my-[2.6vh] font-[huakang]"
                  >
                    千变万化——买卖各取所需
                  </div>
                  <pre class="text-[0.935vw] text-white">
国家中，<span class="text-[#06AAFF]">货物和需求都是随机的</span>，买卖各取所需！
当你的火车抵达其他国家时，只有你车上拥有它们需要的资源，才会和你交易。
                </pre>
                </div>
                <img
                  src="./assets/images/element2@2x.png"
                  class="w-[5.7vw] h-[5.7vw]"
                />
              </div>

              <div
                class="text-[#F7AF65] text-[1.25vw] my-[2.6vh] font-[huakang]"
              >
                你需要给火车装货——
              </div>

              <div class="inline-flex justify-between">
                <div>
                  <pre class="text-[0.935vw] text-white">
火车回到港口后， 你需要给火车装货
火车出港前只有 <span class="text-[#06AAFF]">10 秒钟</span>的时间操作货物
火车出发会消耗 <span class="text-[#06AAFF]">50 矿石</span>的能源费用
                </pre>
                </div>
                <img
                  src="./assets/images/element3@2x.png"
                  class="w-[19.5vw] h-[fit-content]"
                />
              </div>

              <div class="inline-flex justify-between">
                <div>
                  <div
                    class="text-[#F7AF65] text-[1.25vw] my-[2.6vh] font-[huakang]"
                  >
                    你可以使用“码上掘金”进行货物刷新——
                  </div>
                  <pre class="text-[0.935vw] text-white">
你可以缴纳 <span class="text-[#06AAFF]">20 矿石</span>的费用，用<span class="text-[#06AAFF]">码上掘金</span>进行资源刷新
试试看——刷出你想要的货物！</pre>
                  <div
                    class="text-[#F7AF65] text-[1.25vw] my-[2.6vh] font-[huakang]"
                  >
                    你可以选择卸货——
                  </div>
                  <pre class="text-[0.935vw] text-white">
火车只有 3 节车厢，货装满后将无法继续装货 
但你可以<span class="text-[#06AAFF]">选择卸货</span>，重新把你想要的货物装到车上！</pre>
                </div>
                <img
                  src="./assets/images/reset.png"
                  class="w-[10.9375vw] h-[fit-content]"
                />
              </div>

              <div class="inline-flex flex-col justify-between">
                <div
                  class="text-[#F7AF65] text-[1.25vw] my-[2.6vh] font-[huakang]"
                >
                  卖出的货物价格，收益如下——
                </div>
                <div class="grid grid-rows-2 grid-cols-5 gap-[2vw]">
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img
                      src="./assets/images/goods_gpu_on@3x.png"
                      alt="AMD 显卡"
                    />
                    <div class="text-white text-[0.935vw]">AMD 显卡</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      80￥
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img
                      src="./assets/images/goods_cpu_on@3x.png"
                      alt="AMD 芯片"
                    />
                    <div class="text-white text-[0.935vw]">AMD 芯片</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      80￥
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img src="./assets/images/goods_oil_on@3x.png" alt="石油" />
                    <div class="text-white text-[0.935vw]">石油</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      70￥
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img
                      src="./assets/images/goods_coal_on@3x.png"
                      alt="煤炭"
                    />
                    <div class="text-white text-[0.935vw]">煤炭</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      60￥
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img
                      src="./assets/images/goods_iron_on@3x.png"
                      alt="金属"
                    />
                    <div class="text-white text-[0.935vw]">金属</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      50￥
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img
                      src="./assets/images/goods_meat_on@3x.png"
                      alt="牛肉"
                    />
                    <div class="text-white text-[0.935vw]">牛肉</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      40￥
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img
                      src="./assets/images/goods_fish_on@3x.png"
                      alt="鱼肉"
                    />
                    <div class="text-white text-[0.935vw]">鱼肉</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      35￥
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img
                      src="./assets/images/goods_wood_on@3x.png"
                      alt="木材"
                    />
                    <div class="text-white text-[0.935vw]">木材</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      20￥
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img
                      src="./assets/images/goods_radish_on@3x.png"
                      alt="萝卜"
                    />
                    <div class="text-white text-[0.935vw]">萝卜</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      15￥
                    </div>
                  </div>
                  <div
                    class="flex flex-col items-center w-[5.2vw] gap-[0.46875vw]"
                  >
                    <img
                      src="./assets/images/goods_cotton_on@3x.png"
                      alt="棉花"
                    />
                    <div class="text-white text-[0.935vw]">棉花</div>
                    <div class="text-[#F7AF65] text-[1.25vw] font-[huakang]">
                      10￥
                    </div>
                  </div>
                </div>
              </div>

              <div class="inline-flex flex-col">
                <div
                  class="text-[#F7AF65] text-[1.25vw] my-[2.6vh] font-[huakang]"
                >
                  记住——你有500矿石的启动资金
                </div>
                <pre class="text-[0.935vw] text-white">
你的国家初始只有 <span class="text-[#06AAFF]">500 矿石</span>，当你的矿石为 0 时，你将面临破产，也就是说游戏失败了</pre>
              </div>

              <div class="text-white text-[2vw] font-[huakang] my-[2.8125vw]">
                好了，开始你强国的之旅吧！
              </div>
            </div>
          </div>

          <div
            ref='scrollbarTrack'
            class="relative bg-[rgba(255,255,255,0.12)] w-[1.8vw] my-[2.2vh] h-[calc(100%-4.4vh)] rounded-[0.935vw]"
          >
            <img
              on-mousedown="scrollbarMouseDown"
              ref="scrollbarButton"
              src="./assets/images/drop_down box@2x.png"
              class="inline-block absolute -translate-x-[0.53vw] w-[2.86vw] aspect-[0.64/1] max-w-[fit-content]"
            />
          </div>
        </div>
      </div>
    </div>
`
    })

    // TODO: unmount when off the event
    $('body').on('keyup', (e) => {
      e.preventDefault()
      if (e.key === 'Escape') {
        this.hide()
        onClose?.()
      }
    })
  }

  hide() {
    this.updateState('visible', false)
  }

  show() {
    this.updateState('visible', true)
  }
}
