var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);

var videoElement = document.createElement('video');
videoElement.src = '/common/360-video.mp4';
videoElement.load();
videoElement.crossOrigin = 'anonymous';
videoElement.setAttribute('webkit-playsinline', 'true');
videoElement.setAttribute('playsinline', 'true');

var videoTexture = new THREE.Texture(videoElement);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;


var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
var mesh = new THREE.Mesh(geometry, material);
mesh.scale.x = -1;
mesh.position.set(0, controls.userHeight, -1);
scene.add(mesh);
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var options = {
  color: 'black',
  background: 'white',
  corners: 'square',
  textEnterVRTitle: 'Play Video'
};
var enterVRButton = new webvrui.EnterVRButton(renderer.domElement, options);
enterVRButton.on('exit', function() {
  renderer.domElement.removeEventListener('click', onClick, false);
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
  videoElement.play();
});

document.getElementById('vr-button').addEventListener('click', function() {
  videoElement.play();
});

var interacting;
var pointerX = 0;
var pointerY = 0;
var lat = 0;
var lng = 0;
var savedLat = 0;
var savedLng = 0;
var phi = 0;
var theta = 0;

animate();

function animate() {
  effect.render(scene, camera);
  lat = Math.max( -85, Math.min( 85, lat ) );
  phi = THREE.Math.degToRad( 90 - lat );
  theta = THREE.Math.degToRad( lng );
  camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
  camera.target.y = - 500 * Math.cos( phi );
  camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );
  camera.lookAt( camera.target );

  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  if( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA ){
    videoTexture.needsUpdate = true;
  }

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

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
