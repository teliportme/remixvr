var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var ambient = new THREE.AmbientLight(0xffffff);
scene.add( ambient );

var manager = new THREE.LoadingManager();
manager.onProgress = function(item, loaded, total) {

};

// add fireplace object
var loader = new THREE.AssimpJSONLoader();
loader.load('fireplace.json', function(object) {
  object.scale.multiplyScalar(0.4);
  object.position.set(20, controls.userHeight - 40, 25);
  object.rotateZ(Math.PI/180 * -120)
  scene.add(object);
});

// add background pano
var panoTexture = new THREE.TextureLoader().load('Hall.jpg');
var panoGeometry = new THREE.SphereGeometry(500, 32, 32);
var panoMaterial = new THREE.MeshBasicMaterial({ map: panoTexture, side: THREE.DoubleSide });
var pano = new THREE.Mesh(panoGeometry, panoMaterial);
scene.add(pano);

// add fire
var fireTexture = new THREE.TextureLoader().load('Fire.png');
var fire = new THREE.Fire(fireTexture);
fire.position.set(3.5, controls.userHeight - 5, 5);
scene.add(fire);

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

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
  camera.position.set(0, controls.userHeight + 10, 13);
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

var clock = new THREE.Clock();

animate();

function animate() {
  clock.getDelta();
  fire.update(clock.elapsedTime);
  effect.render(scene, camera);

  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  requestAnimationFrame(animate);
}

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
