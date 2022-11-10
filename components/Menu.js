class Menu extends Component {
  constructor({ onPause, onBgmPlay, onHelp } = {}) {
    super({
      state: {
        paused: false,
        bgm: true,
        help: false,
      },
      methods: {
        onPause: () => {
          onPause?.(!this.state.paused);
          if (this.state.paused) {
            this.updateState('paused', false)
          } else {
            this.updateState('paused', true)
          }
        },
        onBgmPlay: () => {
          onBgmPlay?.(!this.state.bgm);
          if (this.state.bgm) {
            this.updateState('bgm', false)
          } else {
            this.updateState('bgm', true)
          }
        },
        onHelp: () => {
          onHelp?.(!this.state.help);
          if (this.state.help) {
            this.updateState('help', false)
          } else {
            this.updateState('help', true)
          }
        },
      },
      template: (state) => `<div>
      <div class="fixed right-[21vw] top-[3.2vw] flex flex-col items-center">
        <img
          src="./assets/images/${state.paused ? 'start' : 'pause'}@2x.png"
          on-click="onPause"
          class="w-[6.25vw] aspect-[1/1]"
        />
        <div class="text-[2vw] text-white font-[huakang]">
          ${state.paused ? '继续' : '暂停'}
        </div>
      </div>
      <div class="fixed right-[13vw] top-[3.2vw] flex flex-col items-center">
        <img
          src="./assets/images/music_${state.bgm ? 'off' : 'on'}@2x.png"
          class="w-[6.25vw] aspect-[1/1]"
          on-click="onBgmPlay"
        />
        <div class="text-[2vw] text-white font-[huakang]">音乐</div>
      </div>
      <div class="fixed right-[5vw] top-[3.2vw] flex flex-col items-center">
        <img
          src="./assets/images/explain@2x.png"
          class="w-[6.25vw] aspect-[1/1]"
          on-click="onHelp"
        />
        <div class="text-[2vw] text-white font-[huakang]">帮助</div>
      </div>
    </div>
`
    })

  }
}
