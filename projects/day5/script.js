var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);
var geometry1 = new THREE.Geometry();
var texture = new THREE.TextureLoader().load('/common/snow_pano-3.jpg');

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.DoubleSide });
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, controls.userHeight, -1);
scene.add(mesh);
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var rainTexture = new THREE.TextureLoader().load('raindrop.png');
rainTexture.flipY = false;

var light = new THREE.AmbientLight( 0x848484 );
scene.add( light );

var particleGroup = new SPE.Group({
  texture: {
    value: rainTexture
  },
  fog: true
});

var emitter = new SPE.Emitter({
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
    value: [ new THREE.Color(0x5196d8)]
  },
  opacity: {
    value: [0.8, 0.8]
  },
  rotation: {
    value: [-1, -10]
  },
  size: {
    value: [0.05, -  0.01],
    spread: [0.05, 0.1]
  },
  activeMultiplier: 0.5,
  particleCount: 30000
});

particleGroup.addEmitter(emitter);
scene.add(particleGroup.mesh);
particleGroup.tick(16);

var vrOptions = {
  color: 'black',
  background: 'yellow',
  corners: 'square'
};
var enterVRButton = new webvrui.EnterVRButton(renderer.domElement, vrOptions);
enterVRButton.on('exit', function() {
  camera.quaternion.set(0, 0, 0, 1);
  camera.position.set(0, controls.userHeight, 0);
});
enterVRButton.on('hide', function() {
  document.getElementById('ui').style.display = 'none';
});
enterVRButton.on('show', function() {
  document.getElementById('ui').style.display = 'inherit';
});
document.getElementById('vr-button').appendChild(enterVRButton.domElement);
document.getElementById('no-vr').addEventListener('click', function() {
  enterVRButton.requestEnterFullscreen();
});

// adding audio
var audioListener = new THREE.AudioListener();
camera.add(audioListener);

var sound = new THREE.Audio(audioListener);
var audioLoader = new THREE.AudioLoader();
audioLoader.load('rain.mp3', function(buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

var interacting;
var pointerX = 0;
var pointerY = 0;
var lat = 0;
var lng = 0;
var savedLat = 0;
var savedLng = 0;
var clock = new THREE.Clock(true);
var tick = 0;
animate();


function animate() {
  var delta = clock.getDelta();
  particleGroup.tick(delta);
  if (enterVRButton.isPresenting()) {
    controls.update();
  }
  effect.render(scene, camera);
  requestAnimationFrame(animate);
}

renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('resize', onResize, false);

function onMouseDown(event) {
  event.preventDefault();
  interacting = true;
  pointerX = event.clientX;
  pointerY = event.clientY;
  savedLng = lng;
  savedLat = lat;
}

function onMouseMove(event) {
  if (interacting) {
    lng = ( pointerX - event.clientX ) * 0.1 + savedLng;
    lat = ( pointerY - event.clientY ) * 0.1 + savedLat;
  }
}

function onMouseUp(event) {
  event.preventDefault();
  interacting = false;
}

function onTouchDown(event) {
  event.preventDefault();
  interacting = true;
  pointerX = event.touches[0].clientX;
  pointerY = event.touches[0].clientY;
  savedLng = lng;
  savedLat = lat;
}

function onTouchMove(event) {
  if (interacting) {
    lng = ( pointerX - event.touches[0].clientX ) * 0.1 + savedLng;
    lat = ( pointerY - event.touches[0].clientY ) * 0.1 + savedLat;
  }
}

function onTouchEnd(event) {
  event.preventDefault();
  interacting = false;
}

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
