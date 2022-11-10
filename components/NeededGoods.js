class NeededGoods extends Component {
  constructor() {
    super({
      state: {
      },
      methods: {
      }
      ,
      template: `    <div>
      <div
        class="flex justify-center items-center w-[8.85vw] fixed aspect-[1.3/1] -translate-x-full -translate-y-1/2"
        id="needed-goods-one"
      >
        <div
          class="absolute w-full h-full bg-[url('./assets/images/bubble.jpg')] bg-cover opacity-50"
        ></div>
        <img class="w-1/2 z-10" />
      </div>

      <div
        class="flex justify-center items-center w-[8.85vw] fixed aspect-[1.3/1] -translate-x-[100%] -translate-y-[150%]"
        id="needed-goods-two"
      >
        <div
          class="absolute w-full h-full bg-[url('./assets/images/bubble.jpg')] bg-cover opacity-50"
        ></div>
        <img class="w-1/2 z-10" />
      </div>

      <div
        class="flex justify-center items-center w-[8.85vw] fixed aspect-[1.3/1] -translate-x-full -translate-y-[150%]"
        id="needed-goods-three"
      >
        <div
          class="absolute w-full h-full bg-[url('./assets/images/bubble.jpg')] bg-cover opacity-50"
        ></div>
        <img class="w-1/2 z-10" />
      </div>

      <div
        class="flex justify-center items-center w-[8.85vw] fixed aspect-[1.3/1] -translate-x-full -translate-y-full"
        id="needed-goods-four"
      >
        <div
          class="absolute w-full h-full bg-[url('./assets/images/bubble.jpg')] bg-cover opacity-50"
        ></div>
        <img class="w-1/2 z-10" />
      </div>

      <div
        class="flex justify-center items-center w-[8.85vw] fixed aspect-[1.3/1] -translate-x-full -translate-y-full"
        id="needed-goods-five"
      >
        <div
          class="absolute w-full h-full bg-[url('./assets/images/bubble.jpg')] bg-cover opacity-50"
        ></div>
        <img class="w-1/2 z-10" />
      </div>
    </div>
`
    })

  }
}
