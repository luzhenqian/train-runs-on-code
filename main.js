import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { GLTFLoader } from 'GLTFLoader'
import { RoomEnvironment } from "RoomEnvironment"

let renderer;
let scene;
let camera;
let controls;

let terrainMixer;
let trainMixer;
let clock = new THREE.Clock();
let railway;
let train = [];

init()
loadModel()
initEnv()
animate()

let log = console.log

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / (window.innerHeight * 0.8);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
}, false);

function init() {
  // Create a WebGL renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight * 0.8);
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Create a camera
  camera = new THREE.PerspectiveCamera(25, window.innerWidth / (window.innerHeight * 0.8), 0.25, 20);
  camera.position.set(6.4, 2.5, 10);

  // Create a scene
  scene = new THREE.Scene();
  const loader = new THREE.TextureLoader();
  loader.load('./assets/images/game-bg.png', function (texture) {
    scene.background = texture;
  });
  // scene.background = new THREE.Color(0xbfe3dd);
  scene.add(new THREE.AxesHelper(3));

  // Create a Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.update();
  controls.enablePan = false;
  // controls.enableZoom = false;
  // controls.enableRotate = false;
  controls.enableDamping = true;


  // const curve = new THREE.CubicBezierCurve3(
  //   new THREE.Vector3(-10, 0, 0),
  //   new THREE.Vector3(-5, 15, 0),
  //   new THREE.Vector3(20, 15, 0),
  //   new THREE.Vector3(10, 0, 0)
  // );

  // const points = curve.getPoints(50);
  // const geometry = new THREE.BufferGeometry().setFromPoints(points);
  // const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

  // // Create the final object to add to the scene
  // const curveObject = new THREE.Line(geometry, material);

  // scene.add(curveObject);
}


function loadModel() {
  const loader = new GLTFLoader();
  loader.load('./assets/model/terrain.gltf', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.0015, 0.0015, 0.0015);
    scene.add(model);

    // model.children.forEach(child => {
    //   console.log(child.name);
    //   // railway1 铁路
    //   // locomotive-western-head 火车头
    //   // locomotive-wagon-western1
    //   if (child.name === 'railway1') {
    //     railway = child
    //     // console.log('railway', railway)
    //   }
    //   if (child.name.includes('locomotive')) {
    //     train.push(child)
    //     log(child.clone())
    //     scene.add(child.clone())
    //   }
    // })

    // Create a mixer
    terrainMixer = new THREE.AnimationMixer(model);
    terrainMixer.clipAction(gltf.animations[0]).play();
  })


  loader.load('./assets/model/ani.gltf', (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.0015, 0.0015, 0.0015);
    scene.add(model);

    // Create a mixer
    // mixer = new THREE.AnimationMixer(model);
    // mixer.clipAction(gltf.animations[0]).play();

    trainMixer = new THREE.AnimationMixer(model);
    trainMixer.clipAction(gltf.animations[0]).play();
  })


}

function initEnv() {
  // Add a room environment
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture;
}

function animate() {
  // (train).forEach(item => {
  //   item.position.x += 10
  //   item.position.z -= 10
  // })

  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  if (terrainMixer) {
    terrainMixer.update(delta);
  }
  if (trainMixer) {
    trainMixer.update(delta);
  }
  controls.update();
  renderer.render(scene, camera);
}