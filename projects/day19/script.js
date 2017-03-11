var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xefd1b5 );
scene.fog = new THREE.FogExp2( 0xefd1b5, 0.015 );
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);
var loader = new THREE.TextureLoader();
var texture = loader.load('/common/pano.jpg');

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, controls.userHeight, -1);
// scene.add(mesh);

var floorTexture = loader.load('grass1.jpg');
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(160, 160);

var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
var planeMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, map: floorTexture });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, -5, -400);
scene.add(plane);

var planeObjectGeometry = new THREE.PlaneGeometry(2000, 2000);
var planeObjectMaterial = new THREE.MeshPhongMaterial();
var planeObject = new THREE.Mesh(planeObjectGeometry, planeObjectMaterial);
planeObject.receiveShadow = true;
planeObject.position.set(0, -5, -400);
scene.add(planeObject);

var ambient = new THREE.AmbientLight(0xFFFFFF, 0.3);
scene.add(ambient);

var light = new THREE.DirectionalLight(0xffffff, 1, 100, 2 );
light.position.set(10, 20 , 20); 
scene.add(light);

var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/projects/day15/');
mtlLoader.setTexturePath('/projects/day15/');
mtlLoader.load('speaker.mtl', function(materials) {
  materials.preload();
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/projects/day15/');
  objLoader.load('speaker.obj', function(object) {
    for (var x = -80; x < 80; x += 40) {
      for (var z = -400; z < 400; z += 20) {
          var speaker=object.clone();
          speaker.position.set(x+Math.random()*15,0,z+Math.random()*15);
          planeObject.add(speaker)
      }            
  }
  });
});


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

var clock = new THREE.Clock();
animate();

function animate() {
  var delta = clock.getDelta();
  plane.position.z += 4 * delta;
  planeObject.position.z += 4 * delta;

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
