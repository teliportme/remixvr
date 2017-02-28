var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);

var particleSystem = new THREE.GPUParticleSystem({
  maxParticles: 250000
});
scene.add( particleSystem);

// options passed during each spawned
var options = {
  position: new THREE.Vector3(),
  positionRandomness: .3,
  velocity: new THREE.Vector3(),
  velocityRandomness: .5,
  color: 0xaa88ff,
  colorRandomness: .2,
  turbulence: .5,
  lifetime: 2,
  size: 5,
  sizeRandomness: 1
};
var spawnerOptions = {
  spawnRate: 15000,
  horizontalSpeed: 1.5,
  verticalSpeed: 1.33,
  timeScale: 1
};


var geometry = new THREE.Geometry();

//Creates 2000000 pixels to fill up the camera
//With random positions
for (var i = 0; i < 200000; i++) {
  var vertex = new THREE.Vector3();
  vertex.x = Math.random() * 2000 - 1000;
  vertex.y = Math.random() * 2000 - 1000;
  vertex.z = -(Math.random() * 1000000 - 1000);
  geometry.vertices.push(vertex);
}

//Setting the material of our points to be white
var material = new THREE.PointsMaterial({
  color: 'white'
});

var particles = new THREE.Points(geometry, material);

scene.add(particles);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

// var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
// var mesh = new THREE.Mesh(geometry, material);
// mesh.position.set(0, controls.userHeight, -1);
// scene.add(mesh);
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var vrOptions = {
  color: 'black',
  background: 'white',
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

var clock = new THREE.Clock(true);
var tick = 0;
animate();

function animate() {
  // geometry.rotateX(0.1);

  var delta = clock.getDelta() * spawnerOptions.timeScale;
  tick += delta;
  if (tick < 0) tick = 0;
  if (delta > 0) {
    options.position.x = Math.sin(tick * spawnerOptions.horizontalSpeed) * 20;
    options.position.y = Math.sin(tick * spawnerOptions.verticalSpeed) * 10;
    options.position.z = Math.sin(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;
    for (var x = 0; x < spawnerOptions.spawnRate * delta; x++) {
      // Yep, that's really it. Spawning particles is super cheap, and once you spawn them, the rest of
      // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
      particleSystem.spawnParticle(options);
    }
  }
  particleSystem.update(tick);


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
