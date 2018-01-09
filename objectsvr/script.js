let scene;
let camera;
let renderer;
let object1;
const raycaster = new THREE.Raycaster();
let arrow;
let sound;

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

let objectName = queryStringOptions.object ? queryStringOptions.object : 'Bear_Brown';
let soundFile = queryStringOptions.soundFile ? queryStringOptions.soundFile : 'bear2.mp3';
let color = queryStringOptions.color ? queryStringOptions.color : 'black';
let multiplier = queryStringOptions.multiplier ? queryStringOptions.multiplier : '0.0005';

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(color);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
  camera.target = new THREE.Vector3(0, 0, 0);
  camera.lookAt(camera.target);

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.vr.enabled = true;
  document.body.appendChild(renderer.domElement);

  // add ambient light
  const ambient = new THREE.AmbientLight(0xffffff);
  scene.add(ambient);

  // add point light
  const light = new THREE.PointLight(0x111111, 1, 100);
  light.position.set(0, 0, 0);
  scene.add(light);

  function createSpotlight(color) {
    const obj = new THREE.SpotLight(color, 2);
    obj.angle = Math.PI / 5;
    obj.intensity = 2;
    obj.penumbra = 0.2;
    obj.decay = 2;
    obj.distance = 100;
    return obj;
  }

  const spotLight1 = createSpotlight(0xD8D862);

  //Create an AudioListener and add it to the camera
  const listener = new THREE.AudioListener();
  camera.add(listener);

  //Create the PositionalAudio object (passing in the listener)
  sound = new THREE.PositionalAudio(listener);

  //Load a sound and set it as the PositionalAudio object's buffer
  const audioLoader = new THREE.AudioLoader();
  const soundDirectory = soundFile === 'bear2.mp3' ? 'Bear_Brown' : 'Cat'
  const soundUrl = '/objects/' + soundDirectory + '/' + soundFile;
  audioLoader.load(soundUrl, function (buffer) {
    sound.setBuffer(buffer);
    sound.setRefDistance(30);
    sound.setLoop(false);
  });

  let floorMat = new THREE.MeshStandardMaterial({
    roughness: 0.8,
    color: 0xffffff,
    metalness: 0.2,
    bumpScale: 0.0005
  });

  let textureLoader = new THREE.TextureLoader();
  textureLoader.load( "/common/hardwood2_diffuse.jpg", function(map) {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 4;
    map.repeat.set( 10, 24 );
    floorMat.map = map;
    floorMat.needsUpdate = true;
  });

  let floorGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
  let floorMesh = new THREE.Mesh( floorGeometry, floorMat );
  floorMesh.position.y = -6.3;
  floorMesh.position.z = -11
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI / 2.0;
  floorMesh.name = 'floor'
  scene.add( floorMesh );


  let mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('/objects/' + objectName + '/');
  mtlLoader.setTexturePath('/objects/' + objectName + '/');
  mtlLoader.load(objectName + '.mtl', function (materials) {
    materials.preload();
    let objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('/objects/' + objectName + '/');
    objLoader.load(objectName + '.obj', function (object) {
      object.position.y = -3;
      object.position.z = -7;
      object.name = 'object1';
      object.add(sound);
      scene.add(object);
      object1 = object;
      object.rotation.y = Math.cos(Math.PI / 4);

      if (objectName === 'Cat') {
        object.scale.set(2, 2, 2);
      }

      spotLight1.target = object;
      scene.add(spotLight1);
    });
  });

  arrow = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff);
  scene.add(arrow);

  window.addEventListener('resize', onResize, false);

  if (WEBVR.checkAvailability()) {
    WEBVR.getVRDisplay(function (display) {
      renderer.vr.setDevice(display);
      document.body.appendChild(WEBVR.getButton(display, renderer.domElement));
    });
  }
}

function animate() {
  // update the position of arrow
  arrow.setDirection(raycaster.ray.direction);

  // update the raycaster
  raycaster.set(camera.getWorldPosition(), camera.getWorldDirection());

  // intersect with all scene meshes.
  var intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {

    // if the ray intersects with the object 1 text, start rotating the object
    if (intersects[0].object.name === objectName) {
      // sound.play();
      var timer = Date.now() * multiplier;
      if (object1 && object1.rotation) {
        object1.rotation.y = Math.cos(timer) * 3;
        object1.updateMatrix();
      }
    }
  }

  // var timer = Date.now() * multiplier;
  // if (object1 && object1.rotation) {
  //   object1.rotation.y = Math.cos(timer) * 3;
  //   object1.updateMatrix();
  // }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
