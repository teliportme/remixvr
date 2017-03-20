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
mesh.position.set(0, controls.userHeight, -1);
scene.add(mesh);

var listOfPanos = [
  {
    "thumb": "pano2_thumb.jpg",
    "pano": "/common/pano2.jpg"
  },
  {
    "thumb": "pano3_thumb.jpg",
    "pano": "/common/pano3.jpg"
  },
  {
    "thumb": "pano1_thumb.jpg",
    "pano": "/common/pano1.jpg"
  },
  {
    "thumb": "pano4_thumb.jpg",
    "pano": "/common/snow_pano.jpg"
  }
];

var lastLoadedPano = '';
var positionY = controls.userHeight + 3;
// adding the list
for (var i = 0; i < listOfPanos.length; i++) {
  var planeGeometry = new THREE.PlaneGeometry(3, 1);
  var planeMaterial = new THREE.MeshBasicMaterial({ map: loader.load(listOfPanos[i].thumb), side: THREE.DoubleSide })
  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.position.y = positionY;
  positionY += 1.5;
  plane.userData = { pano: listOfPanos[i].pano }
  plane.position.z = -10;
  plane.rotation.x = Math.PI / 180 * 20;
  scene.add(plane);

  Reticulum.add( plane, {
    clickCancelFuse: true, // Overrides global setting for fuse's clickCancelFuse
    reticleHoverColor: 0x00fff6, // Overrides global reticle hover color
    fuseVisible: true, // Overrides global fuse visibility
    fuseDuration: 1.5, // Overrides global fuse duration
    fuseColor: 0xffffcc, // Overrides global fuse color
    onGazeOver: function(){
      // do something when user targets object
      this.scale.set(1.1, 1.1, 1.1, 1.1);
    },
    onGazeOut: function(){
      // do something when user moves reticle off targeted object
      this.scale.set(1, 1, 1);
    },
    onGazeLong: function(){
      // do something user targetes object for specific time
      // this.material.emissive.setHex( 0x0000cc );
      var userPano = this.userData.pano;
      loader.load(userPano, function(texture) {
        if (userPano !== lastLoadedPano) {
          material.map = texture;
        }
        lastLoadedPano = userPano;
      });
    },
    onGazeClick: function(){
      // have the object react when user clicks / taps on targeted object
    }
  });
}
scene.add(camera);

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

Reticulum.init(camera, {
  proximity: false,
  clickevents: true,
  near: null, //near factor of the raycaster (shouldn't be negative and should be smaller than the far property)
  far: null, //far factor of the raycaster (shouldn't be negative and should be larger than the near property)
  reticle: {
    visible: true,
    restPoint: 1000, //Defines the reticle's resting point when no object has been targeted
    color: 0xcc0000,
    innerRadius: 0.0001,
    outerRadius: 0.003,
    hover: {
      color: 0xcc0000,
      innerRadius: 0.009,
      outerRadius: 0.011,
      speed: 5,
      vibrate: [] //Set to 0 or [] to disable
    }
  },
  fuse: {
    visible: true,
    duration: 1.5,  
    color: 0x00fff6,
    innerRadius: 0.035,
    outerRadius: 0.04,
    vibrate: [], //Set to 0 or [] to disable
    clickCancelFuse: false //If users clicks on targeted object fuse is canceled
  }
});

animate();

function animate() {
  Reticulum.update();
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
