import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader'
import { RoomEnvironment } from "RoomEnvironment"

class Game {
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  terrainMixer = null;
  trainMixer = null;
  clock = new THREE.Clock();
  railway = null;
  train = [];
  start = false
  trainAnimation = null;
  cabin1 = null
  cabin2 = null
  cabin3 = null
  goods1 = null
  goods2 = null
  goods3 = null
  height = window.innerHeight * 0.8
  modelScale = 0.0015
  // ui elements
  btn1 = null
  btn2 = null
  btn3 = null
  countdownEl = null
  loadingEl = null
  // arguments
  dwellTime = 3_000
  countdown = 3
  start = false
  constructor() {
    this.initCanvas();
    this.initUI();
    this.autoScale();
  }
  initCanvas() {
    this.initRenderer()
    this.initScene()
    this.initCamera()
    this.initControls()
    this.loadModel()
    this.initEnvironment()
  }
  initUI() {
    this.btn1 = $('#btn1')
    this.btn2 = $('#btn2')
    this.btn3 = $('#btn3')
    this.countdownEl = $('#countdown')
    this.loadingEl = $('#loading')
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
    scene.add(new THREE.AxesHelper(3));
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
  loadModel() {
    const loader = new GLTFLoader();
    loader.load('./assets/model/terrain.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(this.modelScale, this.modelScale, this.modelScale);
      this.scene.add(model);

      const terrainMixer = this.terrainMixer = new THREE.AnimationMixer(model);
      terrainMixer.clipAction(gltf.animations[0]).play();
    })

    loader.load('./assets/model/ani.gltf', (gltf) => {
      const model = gltf.scene;
      model.scale.set(this.modelScale, this.modelScale, this.modelScale);

      model.children.forEach(child => {
        if (child.name === 'locomotive-wagon-western1') {
          this.western1 = child
          this.goods1 = this.makeGoods(child, 'food')
        }
        if (child.name === 'locomotive-wagon-western2') {
          this.western2 = child
          this.goods2 = this.makeGoods(child, 'display')
        }
        if (child.name === 'locomotive-wagon-western3') {
          this.western3 = child
          this.goods3 = this.makeGoods(child, 'wood');
        }
      })

      this.scene.add(model);

      // Create a mixer
      const trainMixer = this.terrainMixer = new THREE.AnimationMixer(model);
      const trainAnimation = trainMixer.clipAction(gltf.animations[0])
      setTimeout(() => {
        trainAnimation.play();
        this.departure()
      }, this.dwellTime)
      trainMixer.addEventListener('loop', (e) => {
        trainAnimation.stop();
        this.arrival()
        setTimeout(() => {
          trainAnimation.play();
          this.departure()
        }, this.dwellTime)
      });
    })
  }
  arrival() {
    this.goods1.visible = true;
    this.goods2.visible = true;
    this.goods3.visible = true;
    this.btn1.show()
    this.btn2.show()
    this.btn3.show()
  }
  departure() {
    this.goods1.visible = false;
    this.goods2.visible = false;
    this.goods3.visible = false;
    this.btn1.hide()
    this.btn2.hide()
    this.btn3.hide()
  }
  makeGoods(containerMesh, goodsName) {
    const geometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(`./assets/images/${goodsName}.png`)
    });
    const goods = new THREE.Mesh(geometry, material);
    var { x, y, z } = containerMesh.position;
    goods.position.x = x * this.modelScale
    goods.position.y = y * this.modelScale + 0.2
    goods.position.z = z * this.modelScale
    containerMesh.children.push(goods)
    return goods;
  }
  autoScale() {
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / this.height;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, this.height);
    }, false);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    const delta = this.clock.getDelta();
    if (this.terrainMixer) {
      this.terrainMixer.update(delta);
    }
    if (this.start && this.trainMixer) {
      this.trainMixer.update(delta);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
  play() {
    let countdown = this.countdown;
    this.countdownEl.text(`${countdown -= 1}s`)
    const timer = setInterval(() => {
      this.countdownEl.text(`${countdown -= 1}s`)
      if (countdown === 0) {
        this.loadingEl.hide()
        clearInterval(timer)
        this.start = true
      }
    }, 1_000)

    this.animate()
  }
}

new Game().play()