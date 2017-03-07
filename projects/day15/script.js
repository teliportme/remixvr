var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.gammaInput = true;
renderer.gammaOutput = true;


var floorMaterial = new THREE.MeshPhongMaterial();
var floorGeometry = new THREE.BoxGeometry(2000, 1, 2000);

floorMaterial.color.set(0x808080);

var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.position.set(0, controls.userHeight - 2, 5);
scene.add(floorMesh);

function createSpotlight(color) {
  var obj = new THREE.SpotLight(color, 2);
  obj.castShadow = true;
  obj.angle = Math.PI/8;
  obj.penumbra = 0.2;
  obj.decay = 2;
  obj.distance = 50;
  obj.shadow.mapSize.width = 1024;
  obj.shadow.mapSize.height = 1024;
  return obj;
}

//Create an AudioListener and add it to the camera
var listener = new THREE.AudioListener();
camera.add( listener );

//Create the PositionalAudio object (passing in the listener)
var sound = new THREE.PositionalAudio( listener );

//Load a sound and set it as the PositionalAudio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load('dance.mp3', function( buffer ) {
  sound.setBuffer( buffer );
  sound.setRefDistance( 30 );
  sound.setLoop(true);
  sound.play();
});


var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/projects/day15/');
mtlLoader.setTexturePath('/projects/day15/');
mtlLoader.load('speaker.mtl', function(materials) {
  materials.preload();
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/projects/day15/');
  objLoader.load('speaker.obj', function(object) {
    object.position.z = -15;
    object.position.x = 3;
    object.position.y = 0;
    object.rotation.y = 3 * Math.PI/2;
    scene.add(object);
    object.add(sound);
  });
});

var pointLight = new THREE.PointLight(0x6C6C6C);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);


var ambient = new THREE.AmbientLight(0x111111);
var spotLight1 = createSpotlight(0xFF700);
var spotLight2 = createSpotlight(0x00FF7F);
var spotLight3 = createSpotlight(0x7F00FF);
var spotLight4 = createSpotlight(0xE7C312);

spotLight1.position.set(555, 10, 45);
spotLight2.position.set(-15, 10, 35);
spotLight3.position.set(-25, 10, 45);
spotLight4.position.set(-25, 10, 25);

scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var options = {
  color: 'black',
  background: 'white',
  corners: 'square'
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

function tween(light) {
  new TWEEN.Tween(light).to({
    angle: (Math.random() * 0.7) + 0.1,
    penumbra: Math.random() + 1
  }, Math.random() * 3000 + 2000)
  .easing( TWEEN.Easing.Quadratic.Out ).start();
  new TWEEN.Tween( light.position ).to( {
    x: ( Math.random() * 30 ) - 15,
    y: ( Math.random() * 10 ) + 15,
    z: ( Math.random() * 30 ) - 15
  }, Math.random() * 3000 + 2000 )
  .easing( TWEEN.Easing.Quadratic.Out ).start();
}
moveLights();

function moveLights() {
  tween(spotLight1);
  tween(spotLight2);
  tween(spotLight3);
  tween(spotLight4);
  setTimeout(moveLights, 2000);
}

function animate() {

  TWEEN.update();
  effect.render(scene, camera);

  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  requestAnimationFrame(animate);
}

animate();

function onDocumentMouseWheel( event ) {
  camera.fov += event.deltaY * 0.05;
  camera.updateProjectionMatrix();
}

document.addEventListener( 'wheel', onDocumentMouseWheel, false );
window.addEventListener('resize', onResize, false);

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
