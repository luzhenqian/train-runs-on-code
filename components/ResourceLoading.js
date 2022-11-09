class ResourceLoading extends Component {
  constructor() {
    super({
      state: {
        visible: true,
        percentage: 0,
      },
      template: `<div
      data-show="visible"
      class="bg-[#443e37] fixed left-0 right-0 top-0 bottom-0 overflow-hidden text-white z-50 flex justify-center items-center text-[2vw]"
    >
      <div
        class="flex justify-between absolute bottom-[11vh] font-[huakang] text-[1.5vw] w-[45vw]"
      >
        <span>正在为您更新游戏资源</span>
        <span data-bind="percentage" data-temp="{percentage}%"></span>
      </div>
      <img src="./assets/images/loading-bg.jpg" class="w-full" />
      <img
        src="./assets/images/element1@2x.png"
        class="absolute top-[1.56vw] left-[4.9vw] w-[18vw]"
      />
      <div
        id="load-resource-process-bar"
        class="flex bg-[url(./assets/images/progress@2x.png)] absolute bottom-[3.3vh] h-[6vh] w-[45vw] aspect-[13.55/1] bg-[size:100%_100%] px-[1.5vh] pt-[1.5vh] pb-[1.2vh]"
      >
        <span
          class="inline-block bg-green bottom-[3.3vh] bg-green-100 w-[0px] rounded-[0.5vw] bg-gradient-to-b from-[#3551A4] to-[#2C8EC4] to-[#31CDB0]"
          data-bind="percentage"
          data-style="width: {percentage}%;"
        ></span>
      </div>
    </div>`
    });
  }

  start() {
    window.queue = new createjs.LoadQueue();
    queue.on("complete", () => {
      this.hide()
      new Game()
    });

    queue.on("progress", (progress) => {
      const parseIdx = (idx) => {
        if (idx < 10) {
          return `100${idx}`
        }
        if (idx < 100) {
          return `10${idx}`
        }
        return `1${idx}`
      }
      const percentage = Math.floor(progress.loaded * 100)
      this.updateState('percentage', percentage)
    });

    queue.loadManifest(resources);
  }

  hide() {
    this.updateState('visible', false)
  }
}
