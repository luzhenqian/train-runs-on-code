class GameOver extends Component {
  constructor() {
    super({
      state: {
      },
      methods: {
      }
      ,
      template: `<div
      id="game-over"
      class="fixed w-full h-full bg-black z-50 opacity-90 flex flex-col justify-center items-center gap-[2vw]"
    >
      <div
        class="relative bg-[url('./assets/images/gameover.png')] bg-cover w-[23.5vw] aspect-[1.38/1]"
      ></div>

      <div
        id="restart-button"
        class="bg-[url('./assets/images/restart.png')] bg-cover w-[19.6vw] aspect-[3.6/1] flex justify-center items-center text-[2.4vw] font-[huakang] text-white font-thin cursor-pointer"
      >
        重新开始
      </div>
    </div>
`
    })

  }
}
