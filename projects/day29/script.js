var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 10000);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var canvases = [1, 2, 3, 4, 5, 6].map(function () {
  return document.createElement('canvas');
});

var listOfClocks = [
  {
    canvas: canvases[0],
    timezone: 'America/Los_Angeles',
    text: 'LA'
  },
  {
    canvas: canvases[1],
    timezone: 'America/New_York',
    text: 'New York'
  },
  {
    canvas: canvases[2],
    timezone: 'Asia/Tokyo',
    text: 'Tokyo'
  },
  {
    canvas: canvases[3],
    timezone: 'Asia/Colombo',
    text: 'Colombo'
  },
  {
    canvas: canvases[4],
    timezone: 'Europe/Madrid',
    text: 'Madrid'
  },
  {
    canvas: canvases[5],
    timezone: 'Australia/Sydney',
    text: 'Sydney'
  }
];

function setUpDates() {
  var date = new Date();

  for (var i = 0; i < listOfClocks.length; i++) {
    showClock(listOfClocks[i].canvas, moment(date).tz(listOfClocks[i].timezone), listOfClocks[i].text);
  }
  for (var k = 0; k < materials.length; k ++) {
    materials[k].map.needsUpdate = true;
  }
}

var materials = [];
function setUpMesh() {
  for (var j = 0; j < listOfClocks.length; j++) {
    var planeGeometry = new THREE.PlaneGeometry(3, 1);

    var planeTexture = new THREE.Texture();
    planeTexture.minFilter = THREE.LinearFilter;
    planeTexture.image = listOfClocks[j].canvas;
    var planeMaterial = new THREE.MeshBasicMaterial({ map: planeTexture, side: THREE.DoubleSide });
    planeMaterial.map.needsUpdate = true;
    materials.push(planeMaterial);
  }

  var boxGeometry = new THREE.BoxGeometry(8000, 8000, 8000);
  var faceMaterial = new THREE.MultiMaterial(materials);

  var mesh = new THREE.Mesh(boxGeometry, faceMaterial);
  mesh.scale.x = -1;
  scene.add(mesh);
}

setUpMesh();

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
  setUpDates();
  effect.render(scene, camera);

  // if (enterVRButton.isPresenting()) {
    controls.update();
  // }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', onResize, false);

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
