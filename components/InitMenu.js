class InitMenu extends Component {
  constructor({ onStart, onHelp } = {}) {
    super({
      state: {
        visible: true,
      },
      methods: {
        onStart: () => {
          this.unmount()
          this?.help?.unmount()
          onStart?.()
        },
        onHelp: () => {
          this.hide()
          this.help = new Help({
            onClose: () => {
              this.help.hide()
              this.show()
              console.log('123')
            }
          })
          onHelp?.()
        }
      },
      template: `<div
      data-show="visible"
      id="init-menu"
      class="fixed w-full h-full bg-black z-50 opacity-90 flex flex-col justify-center items-center gap-[2vw]"
      >
      <div
        class="relative bg-[url('./assets/images/bggame.png')] bg-cover w-[30.5vw] aspect-[1.033/1]"
      >
        <div
          id="start-button"
          class="absolute top-[15vw] left-[5.4vw] bg-[url('./assets/images/go.png')] bg-cover w-[19.6vw] aspect-[3.6/1] flex justify-center items-center text-[2.4vw] font-[huakang] text-white font-thin cursor-pointer"
          on-click="onStart"
        >
          开始游戏
        </div>
        <div
          id="help-button"
          class="absolute top-[22vw] left-[5.4vw] bg-[url('./assets/images/rule.png')] bg-cover w-[19.6vw] aspect-[3.6/1] flex justify-center items-center text-[2.4vw] font-[huakang] text-white font-thin cursor-pointer"
          on-click="onHelp"
        >
          查看规则
        </div>
      </div>
      
      <div class="flex flex-col items-center">
        <div class="text-[1.4vw] font-[huakang] text-white font-thin">
          鸣谢：@掘金 @AMD
        </div>
        <div class="text-[1.4vw] font-[huakang] text-white font-thin">
          作者：<a
            href="https://juejin.cn/user/571401777717031"
            class="text-blue-400"
            >代码与野兽</a
          >
        </div>
      </div>
      </div>
      `
    })
  }

  hide() {
    this.updateState('visible', false)
  }

  show() {
    this.updateState('visible', true)
  }
}
