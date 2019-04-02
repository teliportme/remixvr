let scene;
let camera;
let renderer;
let particleGroup;

const queryStringOptions = (function queryStringOptions(a) {
  if (a === "") return {};
  const b = {};
  for (let i = 0; i < a.length; ++i) {
    const p = a[i].split('=', 2);
    if (p.length === 1) {
      b[p[0]] = "";
    } else {
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
  }
  return b;
}(window.location.search.substr(1).split('&')));

let rainImage = queryStringOptions.rainImage ? queryStringOptions.rainImage : 'raindrop.png';
let particleNumber = queryStringOptions.particleNumber ? parseInt(queryStringOptions.particleNumber) : 30000;
let pano = queryStringOptions.pano ? queryStringOptions.pano : 'pano1.jpg';

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
  camera.target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(camera.target);

  geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry1 = new THREE.Geometry();
  texture = new THREE.TextureLoader().load('/common/' + pano);

  material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.vr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // WebVR
  if (WEBVR.checkAvailability()) {
    WEBVR.getVRDisplay(function (display) {
      renderer.vr.setDevice(display);
      document.body.appendChild(WEBVR.getButton(display, renderer.domElement));
    });
  }

  const rainTexture = new THREE.TextureLoader().load(rainImage);

  const light = new THREE.AmbientLight(0x848484);
  scene.add(light);

  particleGroup = new SPE.Group({
    texture: {
      value: rainTexture
    },
    fog: true
  });

  const sizeValue = rainImage === 'unicef.png' ? 1 : 0.2;

  const emitter = new SPE.Emitter({
    maxAge: {
      value: 5
    },
    position: {
      value: new THREE.Vector3(0, 5, 0),
      spread: new THREE.Vector3(9, 0, 9)
    },
    acceleration: {
      value: new THREE.Vector3(0, -5, 0),
    },
    velocity: {
      value: new THREE.Vector3(0, -5, 0),
      spread: new THREE.Vector3(0.5, -0.01, 0.2)
    },
    color: {
      value: [new THREE.Color(0x5196d8)]
    },
    opacity: {
      value: [0.8, 0.8]
    },
    rotation: {
      value: [-1, -10]
    },
    size: {
      value: [sizeValue, -  0.01],
      spread: [0.05, 0.5]
    },
    activeMultiplier: 0.5,
    particleCount: particleNumber
  });

  particleGroup.addEmitter(emitter);
  scene.add(particleGroup.mesh);
  // particleGroup.tick(16);

  // adding audio
  const audioListener = new THREE.AudioListener();
  camera.add(audioListener);

  // const sound = new THREE.Audio(audioListener);
  // const audioLoader = new THREE.AudioLoader();
  // audioLoader.load('rain.mp3', function (buffer) {
  //   sound.setBuffer(buffer);
  //   sound.setLoop(true);
  //   sound.setVolume(0.5);
  //   sound.play();
  // });

  window.addEventListener('resize', onResize, false);
}

function animate() {
  var clock = new THREE.Clock(true);
  var tick = 0;
  var delta = clock.getDelta();
  particleGroup.tick(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
