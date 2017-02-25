var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);
var geometry1 = new THREE.Geometry();
var texture = new THREE.TextureLoader().load('/common/snow_pano-3.jpg');

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, controls.userHeight, -1);
scene.add(mesh);
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var textureLoader = new THREE.TextureLoader();

var snowSprite1 = textureLoader.load('snowflake1.png');
var snowSprite2 = textureLoader.load('snowflake2.png');
var snowSprite3 = textureLoader.load('snowflake3.png');
var snowSprite4 = textureLoader.load('snowflake4.png');
var snowSprite5 = textureLoader.load('snowflake5.png');
scene.fog = new THREE.FogExp2( 0x000000, 0.0008 );

for (var i = 0; i < 10000; i++) {
  var vertex = new THREE.Vector3();
  vertex.x = Math.random() * 2000 - 1000;
  vertex.y = Math.random() * 2000 - 1000;
  vertex.z = Math.random() * 2000 - 1000;
  geometry1.vertices.push( vertex );
}
var materials = [];

var parameters = [
  [ [1.0, 0.2, 0.5], snowSprite1, 20 ],
  [ [0.95, 0.1, 0.5], snowSprite2, 15 ],
  [ [0.90, 0.05, 0.5], snowSprite3, 10 ],
  [ [0.85, 0, 0.5], snowSprite4, 8 ],
  [ [0.80, 0, 0.5], snowSprite5, 5 ]
];

for ( i = 0; i < parameters.length; i ++ ) {
  color  = parameters[i][0];
  sprite = parameters[i][1];
  size   = parameters[i][2];
  materials[i] = new THREE.PointsMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
  materials[i].color.setHSL( color[0], color[1], color[2] );
  particles = new THREE.Points( geometry1, materials[i] );
  particles.rotation.x = Math.random() * 6;
  particles.rotation.y = Math.random() * 6;
  particles.rotation.z = Math.random() * 6;
  scene.add( particles );
}

var vrOptions = {
  color: 'white',
  background: 'black',
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

var interacting;
var pointerX = 0;
var pointerY = 0;
var lat = 0;
var lng = 0;
var savedLat = 0;
var savedLng = 0;
var clock = new THREE.Clock(true);
var tick = 0;
animate();

function animate() {
var time = Date.now() * 0.00005;
  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  for (i = 0; i < scene.children.length; i ++) {
    var object = scene.children[i];
    if (object instanceof THREE.Points) {
      object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
    }
  }

  for (var i = 0; i < materials.length; i ++) {
    color = parameters[i][0];
    h = (360 * (color[0] + time) % 360) / 360;
    materials[i].color.setHSL( h, color[1], color[2] );
  }


  effect.render(scene, camera);
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
