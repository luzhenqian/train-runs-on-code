class GameOver extends Component {
  constructor({ onRestart }) {
    super({
      state: {
        visible: true
      },
      methods: {
        restart: () => {
          this.hide()
          onRestart?.()
        }
      }
      ,
      template: `<div
      data-show="visible"
      class="fixed top-0 bottom-0 left-0 right-0 z-50 flex flex-col justify-center items-center gap-[2vw] z-50"
    >
      <div class="absolute w-full h-full bg-black opacity-90"></div>
      <div
        class="relative bg-[url('./assets/images/gameover.png')] bg-cover w-[23.5vw] aspect-[1.38/1]"
      ></div>

      <div
        class="bg-[url('./assets/images/restart.png')] bg-cover w-[19.6vw] aspect-[3.6/1] flex justify-center items-center text-[2.4vw] font-[huakang] text-white font-thin cursor-pointer z-10"
        on-click="restart"
      >
        重新开始
      </div>
    </div>
`
    })

  }

  show() {
    this.updateState('visible', true)
  }

  hide() {
    this.updateState('visible', false)
  }
}
