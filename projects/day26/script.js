var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

scene.add( new THREE.AmbientLight( 0x444444 ) );
var light = new THREE.DirectionalLight( 0xffffbb, 1 );
light.position.set( - 1, 5, - 1 );
scene.add(light);

var loader = new THREE.TextureLoader();
var waterNormals = loader.load( '/projects/day23/waternormals.jpg' );
waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
waterNormals.repeat.set(160, 160);
var water = new THREE.Water( renderer, camera, scene, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: waterNormals,
  alpha:  1.0,
  sunDirection: light.position.clone().normalize(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 50.0
});

var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
var plane = new THREE.Mesh(planeGeometry, water.material);
plane.add(water);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

//Create an AudioListener and add it to the camera
var listener = new THREE.AudioListener();
camera.add( listener );

//Create the PositionalAudio object (passing in the listener)
var sound = new THREE.PositionalAudio( listener );

//Load a sound and set it as the PositionalAudio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load('jaws_x.wav', function( buffer ) {
  sound.setBuffer( buffer );
  sound.setRefDistance( 30 );
  sound.setLoop(true);
});

// add the shark
var shark;
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/projects/day26/');
mtlLoader.setTexturePath('/projects/day26/');
mtlLoader.load('Shark.mtl', function(materials) {
  materials.preload();
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/projects/day26/');
  objLoader.load('Shark.obj', function(object) {
    shark = object;
    object.position.y = -1.5;
    object.position.z = -100;
    object.add(sound);
    scene.add(object);
    animate();
  });
});

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var options = {
  color: 'black',
  background: 'white',
  corners: 'square',
  textEnterVRTitle: 'Start in VR'
};
var enterVRButton = new webvrui.EnterVRButton(renderer.domElement, options);
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
var start = false;

document.getElementById('vr-button').addEventListener('click', function() {
  start = true;
  sound.play();
});
document.getElementById('no-vr').addEventListener('click', function() {
  start = true;
  sound.play();
});


function animate() {
  var time = performance.now() * 0.003;
  water.material.uniforms.time.value += 1.0 / 60.0;
  if (start) {
    shark.position.z += 0.1;
    if (shark.position.z > 0 && shark.position.z < 15 || shark.position.z > -15) {
      shark.position.z = Math.floor(Math.random() * -100) + -50  ;
      shark.position.x = Math.floor(Math.random() * -100) + -50  ;
    }
  }

  effect.render(scene, camera);

  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', onResize, false);

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
