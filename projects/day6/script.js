var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var geometry = new THREE.BoxGeometry(562, 562, 562, 1, 1, 1);

var images = [
  'http://i.imgur.com/JXetxQh.jpg',
  'https://i.imgur.com/2iIh6XL.jpg',
  'https://i.imgur.com/ieSbq5T.jpg',
  'https://i.imgur.com/ihYbYYm.jpg',
  'https://i.imgur.com/nqVjUX3.jpg',
  'https://i.imgur.com/eSVDTjs.jpg'
];

var textures = [];
var materials = [];

for (var i = 0; i< images.length; i++){
  textures.push(getTexture(images[i]))
  materials[i] = new THREE.MeshBasicMaterial({ map: textures[i], side: THREE.DoubleSide});
}

function getTexture(imgUrl) {
  var texture = new THREE.Texture();
  var imgObj = new Image();
  imgObj.onload = function() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    canvas.height=imgObj.height + 1000;
    canvas.width= imgObj.width + 1000;
    context.drawImage(imgObj, (canvas.width - this.width) * 0.5, (canvas.height - this.height) * 0.5);
    texture.image = canvas;
    texture.minFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    texture.repeat.x = - 1;
  }
  imgObj.crossOrigin = 'anonymous';
  imgObj.src = imgUrl;
  return texture;
}

var faces = new THREE.MultiMaterial(materials);


var mesh = new THREE.Mesh(geometry, faces);
mesh.position.set(0, controls.userHeight, -1);
scene.add(mesh);

var light1 = new THREE.PointLight( 0xff0040 );
light1.position.set(0, 0, 0);
scene.add( light1 );
var light2 = new THREE.PointLight( 0x0040ff);
light2.position.set(0, 0, 0);
scene.add( light2 );
var light3 = new THREE.PointLight( 0x80ff80);
light3.position.set(0, 0, 0);
scene.add( light3 );


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

var interacting;
var pointerX = 0;
var pointerY = 0;
var lat = 0;
var lng = 0;
var savedLat = 0;
var savedLng = 0;

animate();

function animate() {
  var time = Date.now() * 0.0007;
  light1.intensity = Math.sin( time * 0.7 );
  light2.intensity = Math.cos( time * 0.8 );

  effect.render(scene, camera);

  if (enterVRButton.isPresenting()) {
    controls.update();
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
