var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);
var loader = new THREE.TextureLoader();
var texture = new THREE.TextureLoader().load('/common/pano.jpg');
scene.background = texture;
var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, controls.userHeight, -1);
scene.add(mesh);
var spheres = [];

var bubbleGeometry = new THREE.SphereGeometry(3, 60, 60);
texture.mapping = THREE.EquirectangularRefractionMapping;
var material1 = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: texture, refractionRatio: 0.95 } );
for ( var i = 0; i < 1500; i ++ ) {
  var mesh = new THREE.Mesh( bubbleGeometry, material1 );
  mesh.position.x = Math.random() * 50 - 15;
  mesh.position.y = Math.random() * 50 - 15;
  mesh.position.z = Math.random() * 1000 - 500;
  mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 5 + 1;
  scene.add(mesh);
  spheres.push(mesh);
}

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

animate();

function animate() {
  effect.render(scene, camera);

  var timer = 0.0001 * Date.now();
  for ( var i = 0, len = spheres.length; i < len; i ++ ) {
    var sphere = spheres[i];
    sphere.position.x = 500 * Math.cos( timer + i );
    sphere.position.y = 500 * Math.sin( timer + i * 1.1 );
  }
  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  requestAnimationFrame(animate);
}

document.addEventListener( 'wheel', onDocumentMouseWheel, false );
window.addEventListener('resize', onResize, false);

function onDocumentMouseWheel(event){
  camera.fov += event.deltaY * 0.05;
  camera.updateProjectionMatrix();
}


function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
