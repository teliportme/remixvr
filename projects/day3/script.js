var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0 , 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;

var scene = new THREE.Scene();
var ambient = new THREE.AmbientLight( 0x444444 );
scene.add( ambient );

var light = new THREE.PointLight( 0xFFFFDD, 1, 100 );
light.position.set( 0, 0, 0 );
scene.add( light );

var videoElement = document.createElement('video');
var videoTexture = new THREE.Texture(videoElement);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;

var videoImage = document.createElement('canvas');
videoImage.width = 480;
videoImage.height = 204;

var videoImageContext = videoImage.getContext('2d');
videoImageContext.fillStyle = '#000000';
videoImageContext.fillRect( 0, 0, videoImage.width, videoImage.height );

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/projects/day3/');
mtlLoader.setTexturePath('/projects/day3/');
mtlLoader.load('theatre.mtl', function(materials) {
  materials.preload();
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/projects/day3/');
  objLoader.load('theatre.obj', function(object) {
    // object.position.y = -95;
    scene.add(object);
  });

  videoElement.src = '/common/patagonia.mp4';
  videoElement.crossOrigin = 'anonymous';
  videoElement.setAttribute('webkit-playsinline', 'true');
  videoElement.setAttribute('playsinline', 'true');
  videoElement.load();

  var videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
  var videoGeometry = new THREE.PlaneGeometry(13.738, 7.728);
  var videoScreen = new THREE.Mesh(videoGeometry, videoMaterial);
  videoScreen.position.set(0, 1, -15.8);
  camera.position.set(0, 0, 0);
  camera.lookAt(videoScreen.position);
  scene.add(videoScreen);
});

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
  textEnterVRTitle: 'Play Video'
};
var enterVRButton = new webvrui.EnterVRButton(renderer.domElement, options);
enterVRButton.on('hide', function() {
  document.getElementById('ui').style.display = 'none';
});
enterVRButton.on('exit', function() {
  scene.add(light);
});

enterVRButton.on('show', function() {
  document.getElementById('ui').style.display = 'inherit';
});
document.getElementById('vr-button').appendChild(enterVRButton.domElement);
document.getElementById('no-vr').addEventListener('click', function() {
  enterVRButton.requestEnterFullscreen();
  videoElement.play();

  // turn off lights after 2 seconds
  setTimeout(function() {
    scene.remove(light);
    // add a less powerfull light
    var light2 = new THREE.PointLight( 0xFFFFDD, .2, 100 );
    light2.position.set( 0, 0, 0 );
    scene.add( light2 );
  }, 2000);
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

animate();

function animate() {
  effect.render(scene, camera);

  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  if( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA ){
    videoImageContext.drawImage( videoElement, 0, 0 );
    videoTexture.needsUpdate = true;
  }

  requestAnimationFrame(animate);
}

renderer.domElement.addEventListener('mousedown', onMouseDown, false);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mouseup', onMouseUp, false);
document.addEventListener( 'wheel', onDocumentMouseWheel, false );
window.addEventListener('resize', onResize, false);

function onDocumentMouseWheel(event){
  camera.fov += event.deltaY * 0.05;
  camera.updateProjectionMatrix();
}

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
