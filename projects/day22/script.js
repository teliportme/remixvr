var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);
var loader = new THREE.TextureLoader();
var texture = loader.load('/common/pano.jpg');

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
material.map.needsUpdate = true;
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, controls.userHeight, -5);
scene.add(mesh);

// hotspot
var sphereGeometry = new THREE.SphereGeometry( .3, 32, 32 );
var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.DoubleSide});
var sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.name = 'hotspot1';
sphere.position.set(-1, controls.userHeight, -5);
scene.add(sphere);

var raycaster = new THREE.Raycaster();
var arrow = new THREE.ArrowHelper( raycaster.ray.direction, raycaster.ray.origin, 100, Math.random() * 0xffffff );
scene.add( arrow );

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

var hotspots = [sphere];
var updateTexture = 0;
var hoverTime = 0;
var clock = new THREE.Clock();
clock.autoStart = true;

var panoList = [
  '/common/snow_pano.jpg',
  '/common/pano1.jpg',
  '/common/pano2.jpg',
  '/common/pano3.jpg',
]
animate();

function animate(delta) {

  // update the position of arrow
  arrow.setDirection(raycaster.ray.direction);

  // update the raycaster
  raycaster.set(camera.getWorldPosition(), camera.getWorldDirection());

  // intersect with all scene meshes.
  var intersects = raycaster.intersectObjects(hotspots);
  if (intersects.length > 0) {
    if (!clock.running) clock.start();

    var scale = Math.abs(Math.sin(delta/5000*Math.PI)) * 2;
    if (scale < 1) {
      scale = 1;
    }
    intersects[1].object.scale.set(scale, scale, scale);
    if (updateTexture < 1) {
      if (clock.getElapsedTime() > 2) {
        updateTexture = 1;
        var newTexture = loader.load(panoList[Math.floor(Math.random()*panoList.length)]);
        material.map = newTexture;
        sphere.position.x = Math.floor(Math.random() * 7) + 1  
        sphere.position.y = Math.floor(Math.random() * 7) + 0  
      }
    }
  } else {
    clock.stop();
    updateTexture = 0;
    for (var i = 0; i < hotspots.length; i ++) {
      hotspots[i].scale.set(1, 1, 1);
    }
  }

  effect.render(scene, camera);

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
