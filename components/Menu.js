class Menu extends Component {
  constructor() {
    super({
      state: {
      },
      methods: {
      }
      ,
      template: `<div>
      <div class="fixed right-[21vw] top-[3.2vw] flex flex-col items-center">
        <img
          id="pause"
          src="./assets/images/pause@2x.png"
          class="w-[6.25vw] aspect-[1/1]"
        />
        <div id="pause-text" class="text-[2vw] text-white font-[huakang]">
          暂停
        </div>
      </div>
      <div class="fixed right-[13vw] top-[3.2vw] flex flex-col items-center">
        <img
          id="bgm"
          src="./assets/images/music_on@2x.png"
          class="w-[6.25vw] aspect-[1/1]"
        />
        <div class="text-[2vw] text-white font-[huakang]">音乐</div>
      </div>
      <div class="fixed right-[5vw] top-[3.2vw] flex flex-col items-center">
        <img
          id="help"
          src="./assets/images/explain@2x.png"
          class="w-[6.25vw] aspect-[1/1]"
        />
        <div class="text-[2vw] text-white font-[huakang]">帮助</div>
      </div>
    </div>
`
    })

  }
}
