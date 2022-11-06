import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader'
import { RoomEnvironment } from "RoomEnvironment"

class Game {
  // three arguments
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  terrainMixer = null;
  trainMixer = null;
  clock = new THREE.Clock();
  railway = null;
  trainAnimation = null
  goodsMeshes = []
  height = window.innerHeight * 0.8
  modelScale = 0.0017
  goodsSize = 0.2
  allGoods = {
    'meat': {
      price: 40
    },
    'iron': {
      price: 50
    },
    'coal': {
      price: 60
    },
    'oil': {
      price: 70
    },
    'fish': {
      price: 35
    },
    'cotton': {
      price: 30
    },
    'cpu': {
      price: 80
    },
    'radish': {
      price: 15
    },
    'wood': {
      price: 20
    },
    'gpu': {
      price: 80
    }
  }
  materials = {}
  // ui elements
  producedButtonEls = []
  goodsEls = []
  countdownEl = null
  loadingEl = null
  refreshEl = null
  accountBalanceEl = null
  neededGoodsEls = []
  message = new Message()
  menuEls = {}
  // arguments
  dwellTime = 10_000
  countdown = 10
  start = false
  accountBalance = 500
  energyConsumptionMoney = -50
  carryMoney = -5
  refreshMoney = -20
  // meshes
  cityMeshes = []
  cabinMeshes = []
  loadedGoods = [null, null, null]
  neededGoods = []
  producedGoods = []
  musics = {}
  constructor() {
    this.initCanvas().then(() => {
      this.play()
    });
    this.initUI();
    this.initMusics();
    this.autoScale();
  }
  initCanvas() {
    this.initMaterials()
    this.initRenderer()
    this.initScene()
    this.initCamera()
    this.initControls()
    this.initEnvironment()
    return this.loadModel()
  }
  initUI() {
    this.producedButtonEls = [
      $('#btn-one'),
      $('#btn-two'),
      $('#btn-three'),
    ]
    this.goodsEls = [
      $('#goods-one'),
      $('#goods-two'),
      $('#goods-three'),
    ]

    this.loadingEl = $(`<div
      id="loading"
      class="flex flex-col items-center fixed top-[50vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <span class="text-white font-[huakang] text-[2.8vw]"
        >码上掘金 即将到来</span
      >
      <img />
      <span id="countdown" class="text-white font-[huakang] text-[2.8vw]"
        >10s</span
      >
    </div>`)
    this.loadingImage = new Image()
    this.loadingImage.src = './assets/images/loading.gif'
    this.loadingEl.find('img').attr('src', this.loadingImage.src);

    $('body').append(this.loadingEl)
    this.loadingEl.hide()
    this.countdownEl = $('#countdown')

    this.neededGoodsEls = [
      $("#needed-goods-one"),
      $("#needed-goods-two"),
      $("#needed-goods-three"),
      $("#needed-goods-four"),
      $("#needed-goods-five")
    ]
    this.accountBalanceEl = $('#account-balance')
    this.refreshEl = $('#refresh')
    this.refreshEl.on('click', this.refreshProducedGoods.bind(this))
    $('#refresh-money').text(`${-this.refreshMoney}￥`)

    // 绑定装货/卸货事件
    this.producedButtonEls.forEach((btnEl, idx) => {
      btnEl.on('click', () => {
        // 卸载货物
        if (this.producedGoods[idx].loaded) {
          this.loadedGoods[this.producedGoods[idx].cabin] = null
          this.producedGoods[idx].loaded = false

          this.accountBalance += this.carryMoney
          this.message.show(`卸载成功！${this.carryMoney}`, 'error')
          this.updateAccountBalanceUI()
        }
        // 选择货物
        else {
          const goods = this.producedGoods[idx].name
          for (let i = 0; i < this.loadedGoods.length; i++) {
            if (!!!this.loadedGoods[i]) {
              this.loadedGoods[i] = goods
              this.producedGoods[idx].cabin = i
              this.producedGoods[idx].loaded = true

              this.accountBalance += this.carryMoney
              this.message.show(`搬运成功！${this.carryMoney}`, 'error')
              this.updateAccountBalanceUI()
              break;
            }
          }
        }

        this.musics.load[0].play()
        this.updateButtonUI()
        this.updateLoadedGoodsMesh()
      })
    })

    this.menuEls = {
      'music': $('#bgm'),
    }

    this.menuEls.music.on('click', this.bgmPlay.bind(this))

    this.disableGoodsControl()
  }
  initMusics() {
    this.musics.bgm = $(`<audio src="./assets/audio/bgm.mp3" loop="loop"></audio>`)
    this.musics.load = $(`<audio src="./assets/audio/load.mp3"></audio>`)
    this.musics.refresh = $(`<audio src="./assets/audio/refresh.mp3"></audio>`)
    this.musics.inbound = $(`<audio src="./assets/audio/inbound.mp3"></audio>`)
    this.musics.outbound = $(`<audio src="./assets/audio/outbound.mp3"></audio>`)
    $('body').append(...Object.values(this.musics))
    // this.musics.bgm[0].play()
  }
  initRenderer() {
    // Create a WebGL renderer
    const renderer = this.renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, this.height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement);
  }
  initCamera() {
    // Create a camera
    const camera = this.camera = new THREE.PerspectiveCamera(25, window.innerWidth / (window.innerHeight * 0.8), 0.25, 20);
    camera.position.set(6.4, 2.5, 10);
  }
  initScene() {
    // Create a scene
    const scene = this.scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    loader.load('./assets/images/game-bg.png', function (texture) {
      scene.background = texture;
    });
    // scene.add(new THREE.AxesHelper(3));
  }
  initControls() {
    // Create a Controls
    const controls = this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.update();
    controls.enablePan = false;
    // controls.enableZoom = false;
    // controls.enableRotate = false;
    controls.enableDamping = true;
  }
  initEnvironment() {
    // Add a room environment
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;
  }
  initMaterials() {
    const loader = new THREE.TextureLoader();
    Object.keys(this.allGoods).forEach(goods => {
      loader.load(`./assets/images/goods_${goods}_on@3x.png`, (texture) => {
        texture.needsUpdate = true
        this.materials[goods] = new THREE.MeshBasicMaterial({
          map: texture,
        })
      })
    })
  }
  async loadModel() {
    return Promise.all([this.loadTerrainModel(), this.loadTrainModel()])
  }
  async loadTerrainModel() {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();
      loader.load('./assets/model/terrain.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(this.modelScale, this.modelScale, this.modelScale);
        model.children.forEach(child => {
          if (child.name === 'castle_T1') {
            this.cityMeshes[0] = child
          }
          if (child.name === 'castle_T2') {
            this.cityMeshes[1] = child
          }
          if (child.name === 'castle_T3') {
            this.cityMeshes[2] = child
          }
          if (child.name === 'castle_T4') {
            this.cityMeshes[3] = child
          }
          if (child.name === 'castle_T5') {
            this.cityMeshes[4] = child
          }
        })
        this.scene.add(model);

        const terrainMixer = this.terrainMixer = new THREE.AnimationMixer(model);
        terrainMixer.clipAction(gltf.animations[0]).play();
        resolve(null)
      })
    })
  }
  async loadTrainModel() {
    return new Promise((resolve) => {
      const loader = new GLTFLoader();

      loader.load('./assets/model/train.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(this.modelScale, this.modelScale, this.modelScale);

        model.children.forEach(child => {
          if (child.name === 'locomotive-wagon-western1') {
            this.cabinMeshes[0] = child
          }
          if (child.name === 'locomotive-wagon-western2') {
            this.cabinMeshes[1] = child
          }
          if (child.name === 'locomotive-wagon-western3') {
            this.cabinMeshes[2] = child
          }
          if (child.name === 'box1_') {
            this.goodsMeshes[0] = child;
          }
          if (child.name === 'box2') {
            this.goodsMeshes[1] = child;
          }
          if (child.name === 'box3') {
            this.goodsMeshes[2] = child;
          }
        })

        this.updateLoadedGoodsMesh()

        this.scene.add(model);

        // Create a mixer
        this.trainMixer = new THREE.AnimationMixer(model);
        this.trainAnimation = this.trainMixer.clipAction(gltf.animations[0])
        resolve(null)
      })
    })
  }
  arrival() {
    this.makeProducedGoods()
    this.makeNeededGoods()
    this.updateButtonUI()
    this.producedButtonEls.forEach(btnEl => btnEl.show())
    this.activeGoodsControl()
    this.refreshEl.css('filter', 'none')
    this.loadedGoods = [null, null, null]
    this.updateLoadedGoodsMesh()
    this.neededGoodsEls.forEach(neededGoodsEl => neededGoodsEl.show())
    this.playLoading()
  }
  departure() {
    this.producedButtonEls.forEach(btnEl => btnEl.hide())
    this.disableGoodsControl()
    this.refreshEl.css('filter', 'grayscale(100%)')
    this.trade()

    this.accountBalance += this.energyConsumptionMoney
    this.message.show(`消耗能源！${this.energyConsumptionMoney}`, 'error')
    this.outboundPlay()
    setTimeout(() => {
      this.inboundPlay()
    }, 13_000)
    this.updateAccountBalanceUI()
  }
  autoScale() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, this.height);
    }, false);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();
    if (this.terrainMixer) {
      this.terrainMixer.update(delta);
      this.setAllDemandGoodsPosition()
    }
    if (this.trainMixer) {
      this.trainMixer.update(delta);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  play() {
    this.activeGoodsControl()
    this.makeProducedGoods()
    this.makeNeededGoods()
    setTimeout(this.trainAnimationPlay.bind(this), this.dwellTime)
    this.playLoading()
    this.animate()
  }
  playLoading() {
    let countdown = this.countdown;
    this.countdownEl.text(`${countdown}s`)
    this.loadingEl.show()
    this.loadingEl.find('img').attr('src', this.loadingImage.src);
    const timer = setInterval(() => {
      this.countdownEl.text(`${countdown -= 1}s`)
      if (countdown === 0) {
        this.loadingEl.hide()
        clearInterval(timer)
      }
    }, 1_000)
  }
  makeProducedGoods() {
    for (let i = 0; i < 3; i++) {
      let goods = Object.keys(this.allGoods)[Math.floor(Math.random() * Object.keys(this.allGoods).length)]
      this.producedGoods[i] = {
        name: goods,
        loaded: false
      }
      this.goodsEls[i].css(
        'background-image',
        `url(./assets/images/goods_${goods}_on@2x.png)`)
      this.goodsEls[i].data(
        'goods',
        goods
      )
    }
  }
  makeNeededGoods() {
    const len = Object.keys(this.allGoods).length
    const allGoods = Object.keys(this.allGoods)
    this.neededGoods = [
      allGoods[Math.floor(Math.random() * len)],
      allGoods[Math.floor(Math.random() * len)],
      allGoods[Math.floor(Math.random() * len)],
      allGoods[Math.floor(Math.random() * len)],
      allGoods[Math.floor(Math.random() * len)],
    ]

    this.neededGoods.forEach((goods, idx) => {
      this.neededGoodsEls[idx].find('img').attr(
        'src',
        `./assets/images/goods_${goods}_on@3x.png`
      )
    })
  }
  setAllDemandGoodsPosition() {
    this.neededGoodsEls.forEach((el, idx) => {
      this.setDemandGoodsPosition(this.cityMeshes[idx], el)
    })
  }
  setDemandGoodsPosition(city, goodsEl) {
    const vector = new THREE.Vector3(
      city.position.x * this.modelScale,
      city.position.y * this.modelScale,
      city.position.z * this.modelScale
    ).project(this.camera)
    let halfWidth = window.innerWidth / 2;
    let halfHeight = this.height / 2;
    let left = vector.x * halfWidth + halfWidth
    let top = -vector.y * halfHeight + halfHeight
    goodsEl.css({
      left,
      top
    });
  }
  trainAnimationPlay() {
    this.trainAnimation.play();
    this.departure()
    this.trainMixer.addEventListener('loop', (e) => {
      this.trainAnimation.stop();
      this.arrival()
      setTimeout(() => {
        this.trainAnimation.play();
        this.departure()
      }, this.dwellTime)
    });
  }
  disableGoodsControl() {
    this.goodsEls.forEach((goodsEl, idx) => {
      goodsEl.css(
        'background-image',
        `url(./assets/images/goods_${this.producedGoods[idx]?.name || 'gpu'}_off@2x.png)`
      )
    })
    this.producedButtonEls.forEach((btnEl) => {
      btnEl.hide()
    })
    this.refreshEl.css(
      'filter',
      'grayscale(100%)'
    )
    this.refreshEl.css('pointer-events', 'none');
  }
  activeGoodsControl() {
    this.producedButtonEls.forEach((btnEl) => {
      btnEl.show()
    })

    this.refreshEl.css(
      'filter',
      'none'
    )
    this.refreshEl.css('pointer-events', 'auto');
  }
  trade() {
    const arrivalTime = [
      5, 7, 9, 10, 12
    ]
    arrivalTime.forEach((time, idx) => {
      setTimeout(() => {
        const successIdx = this.loadedGoods.findIndex(goods => goods === this.neededGoods[idx])
        if (successIdx > -1) {
          const goods = this.loadedGoods[successIdx]
          this.goodsMeshes[successIdx].visible = false
          this.loadedGoods[successIdx] = null
          this.neededGoodsEls[idx].hide()
          const money = this.allGoods[goods].price
          this.accountBalance += money
          this.message.show(`交易成功！+${money}`, 'success')
          this.refreshMusicPlay()
          this.updateAccountBalanceUI()
        }
      }, time * 1000)
    })
  }
  refreshProducedGoods() {
    this.producedGoods.forEach(goods => {
      if (!goods.loaded) {
        const keys = Object.keys(this.allGoods)
        const len = keys.length
        goods.name = keys[Math.floor(Math.random() * len)]
      }
    })
    this.refreshMusicPlay()
    this.updateProducedGoodsUI()
  }
  refreshMusicPlay() {
    const refreshMusicPlayer = this.musics.refresh[0]
    refreshMusicPlayer.currentTime = 0
    refreshMusicPlayer.play();
  }
  bgmPlay() {
    const bgmPlayer = this.musics.bgm[0]
    console.log(bgmPlayer, 'bb');
    if (bgmPlayer.paused) {
      bgmPlayer.currentTime = 0
      bgmPlayer.play();
    } else {
      bgmPlayer.pause();
    }
  }
  inboundPlay() {
    const inboundPlayer = this.musics.inbound[0]
    inboundPlayer.currentTime = 0
    inboundPlayer.play();
  }
  outboundPlay() {
    const outboundPlayer = this.musics.outbound[0]
    outboundPlayer.currentTime = 0
    outboundPlayer.play();
  }
  updateLoadedGoodsMesh() {
    this.goodsMeshes.forEach((goodsMesh, idx) => {
      const goods = this.loadedGoods[idx]
      if (!goods) {
        goodsMesh.visible = false
        return
      }
      goodsMesh.material = this.materials[goods]
      goodsMesh.visible = true
    })
  }
  updateButtonUI() {
    this.producedGoods.forEach((goods, idx) => {
      if (goods.loaded) {
        this.goodsEls[idx].css(
          'background-image',
          `url(./assets/images/goods_${goods.name}_off@2x.png)`
        )
        this.producedButtonEls[idx].css(
          'background-image',
          'url("./assets/images/reselect-btn.png")'
        )
        this.producedButtonEls[idx].hover(
          () => {
            this.producedButtonEls[idx]
              .css('background-image', 'url("./assets/images/reselect-btn-hover.png")')
          },
          () => {
            this.producedButtonEls[idx]
              .css('background-image', 'url("./assets/images/reselect-btn.png")')
          }
        )
        this.producedButtonEls[idx].text('卸货')
      } else {
        this.goodsEls[idx].css(
          'background-image',
          `url(./assets/images/goods_${goods.name}_on@2x.png)`
        )
        this.producedButtonEls[idx].css(
          'background-image',
          'url("./assets/images/btn.png")'
        )
        this.producedButtonEls[idx].hover(
          () => {
            this.producedButtonEls[idx]
              .css('background-image', 'url("./assets/images/btn-hover.png")')
          },
          () => {
            this.producedButtonEls[idx]
              .css('background-image', 'url("./assets/images/btn.png")')
          },
        )
        this.producedButtonEls[idx].text('装货')
      }
    })
  }
  updateAccountBalanceUI() {
    this.accountBalanceEl.text(`${this.accountBalance}￥`)
  }
  updateProducedGoodsUI() {
    this.goodsEls.forEach((goodsEl, idx) => {
      const status = this.producedGoods[idx].loaded ? 'off' : 'on'
      goodsEl.css(
        'background-image',
        `url(./assets/images/goods_${this.producedGoods[idx].name}_${status}@2x.png)`
      )
    })
    this.accountBalance += this.refreshMoney
    this.message.show(`刷新成功！${this.refreshMoney}`, 'error')
    this.updateAccountBalanceUI()
  }
}

class Message {
  duration = 1600
  timers = []

  show(text, type = 'info', duration = this.duration) {
    const colors = {
      success: '#C0FF00',
      error: '#FF001E',
      info: '#FFFFFF'
    }
    const color = colors[type]
    const el = $(`<div
    id="msg"
    class="text-[2vw] text-white fixed left-[18vw] bottom-[24vh] font-[huakang] -translate-x-1/2 text-[${color}] -translate-y-[${this.timers.length * 6}vh]"
    style="display: none;">${text}</div>`)
    $('body').append(el)
    el.fadeIn()
    const timer = setTimeout(() => {
      el.fadeOut()
      const idx = this.timers.findIndex(t => t === timer)
      this.timers.splice(idx, 1)
      el.remove()
    }, duration)
    this.timers.push(timer)
  }
}

new Game()