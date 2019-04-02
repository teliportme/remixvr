let scene;
let camera;
let renderer;
let videoElement;
let videoTexture;

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

let videoUrl = queryStringOptions.videoUrl ? queryStringOptions.videoUrl : 'patagonia.mp4';

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
  camera.target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(camera.target);

  scene = new THREE.Scene();
  const ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  const light = new THREE.PointLight(0xFFFFDD, 1, 100);
  light.position.set(0, 0, 0);
  scene.add(light);

  videoElement = document.createElement('video');
  videoTexture = new THREE.Texture(videoElement);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;

  const mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('/movievr/');
  mtlLoader.setTexturePath('/movievr/');
  mtlLoader.load('theatre.mtl', function (materials) {
    materials.preload();
    const objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('/movievr/');
    objLoader.load('theatre.obj', function (object) {
      scene.add(object);
    });

    videoElement.src = '/common/' + videoUrl;
    videoElement.crossOrigin = 'anonymous';
    videoElement.setAttribute('webkit-playsinline', 'true');
    videoElement.setAttribute('playsinline', 'true');
    videoElement.load();

    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
    const videoGeometry = new THREE.PlaneGeometry(13.738, 7.728);
    const videoScreen = new THREE.Mesh(videoGeometry, videoMaterial);
    videoScreen.position.set(0, 1, -15.8);
    camera.position.set(0, 0, 0);
    camera.lookAt(videoScreen.position);
    scene.add(videoScreen);
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.vr.enabled = true;

  document.body.appendChild(renderer.domElement);
  function startVideo() {
    videoElement.play();

    // turn off lights after 2 seconds
    setTimeout(function () {
      scene.remove(light);
      // add a less powerfull light
      const light2 = new THREE.PointLight(0xFFFFDD, .2, 100);
      light2.position.set(0, 0, 0);
      scene.add(light2);
    }, 2000);
  }

  // WebVR
  if (WEBVR.checkAvailability()) {
    WEBVR.getVRDisplay(function (display) {
      renderer.vr.setDevice(display);
      document.body.appendChild(WEBVR.getButton(display, renderer.domElement));
      document.getElementById('enter-vr').addEventListener('click', startVideo);
    });
  }

  document.addEventListener('wheel', onDocumentMouseWheel, false);
  window.addEventListener('resize', onResize, false);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA) {
    videoTexture.needsUpdate = true;
  }
}

function onDocumentMouseWheel(event) {
  camera.fov += event.deltaY * 0.05;
  camera.updateProjectionMatrix();
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
