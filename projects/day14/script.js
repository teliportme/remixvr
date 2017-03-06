var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0 , 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;

var scene = new THREE.Scene();
var ambient = new THREE.AmbientLight( 0x444444 );
scene.add( ambient );

var floorMat = new THREE.MeshStandardMaterial( {
  roughness: 0.8,
  color: 0xffffff,
  metalness: 0.2,
  bumpScale: 0.0005
});

var textureLoader = new THREE.TextureLoader();
textureLoader.load( "/common/hardwood2_diffuse.jpg", function(map) {
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = 4;
  map.repeat.set( 10, 24 );
  floorMat.map = map;
  floorMat.needsUpdate = true;
});

var floorGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
var floorMesh = new THREE.Mesh( floorGeometry, floorMat );
floorMesh.position.y = -6.3;
floorMesh.position.z = -11
floorMesh.receiveShadow = true;
floorMesh.rotation.x = -Math.PI / 2.0;
scene.add( floorMesh );

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var options = {
  color: 'bllk',
  background: 'white',
  corners: 'square',
  textEnterVRTitle: 'Enter VR'
};
var enterVRButton = new webvrui.EnterVRButton(renderer.domElement, options);
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
var directionalLight = new THREE.DirectionalLight(0xeeeeee);
directionalLight.position.normalize();
scene.add( directionalLight )

var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;

var dae;
loader.load('bmw.dae', function(collada) {
  dae = collada.scene;
  dae.scale.x = dae.scale.y = dae.scale.z = 0.09;
  dae.position.set(0, controls.userHeight - 8, -16)
  dae.updateMatrix();
  scene.add(dae);

  animate();
});

function animate() {
  var timer = Date.now() * 0.0005;
  dae.rotation.y = Math.cos( timer ) * 3;
  dae.updateMatrix();
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
