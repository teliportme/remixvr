var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(this.camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

function Scene(filename) {

  this.effect = new THREE.VREffect(renderer);
  this.effect.setSize(window.innerWidth, window.innerHeight);

  this.scene = new THREE.Scene();

  var geometry = new THREE.SphereGeometry(500, 60, 40);
  var texture = new THREE.TextureLoader().load('/common/'+filename+'.jpg');

  var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
  this.mesh = new THREE.Mesh(geometry, material);
  this.mesh.position.set(0, controls.userHeight, -1);
  this.scene.add(this.mesh);

  renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
  this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
  this.render = function(rtt) {
    if (rtt) {
      this.effect.render(this.scene, camera, this.fbo, true);
    }
    else {
      this.effect.render(this.scene, camera);
    }
  }
}

var sceneA = new Scene('pano');
var sceneB = new Scene('snow_pano');
var transition = new Transition(sceneA, sceneB, renderer);

document.body.appendChild(renderer.domElement);

var options = {
  color: 'black',
  background: 'white',
  corners: 'square'
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
var clock = new THREE.Clock();
animate();

function animate() {

  transition.render(clock.getDelta());
  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', onResize, false);

function onResize() {
  sceneA.effect.setSize(window.innerWidth, window.innerHeight);
  sceneB.effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
