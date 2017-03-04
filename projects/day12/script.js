var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);
var texture = new THREE.TextureLoader().load('/common/pano.jpg');

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var ambient = new THREE.AmbientLight( 0x444444 );
scene.add( ambient );

var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
var mesh = new THREE.Mesh(geometry, material);
mesh.position.set(0, controls.userHeight, -1);
scene.add(mesh);

// lens flares
var textureLoader = new THREE.TextureLoader();
var textureFlare0 = textureLoader.load( "lensflare0.png" );
var textureFlare2 = textureLoader.load( "lensflare2.png" );
var textureFlare3 = textureLoader.load( "lensflare3.png" );

addLight( 0.995, 0.5, 0.9, 15, 5, 14 );

function addLight( h, s, l, x, y, z ) {
  var light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
  light.color.setHSL( h, s, l );
  light.position.set( x, y, z );
  scene.add( light );
  var flareColor = new THREE.Color( 0xffffff );
  flareColor.setHSL( h, s, l + 0.5 );
  var lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );
  lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
  lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );
  lensFlare.customUpdateCallback = lensFlareUpdateCallback;
  lensFlare.position.copy( light.position );
  scene.add( lensFlare );
}

function lensFlareUpdateCallback( object ) {
  var f, fl = object.lensFlares.length;
  var flare;
  var vecX = -object.positionScreen.x * 2;
  var vecY = -object.positionScreen.y * 2;
  for( f = 0; f < fl; f++ ) {
    flare = object.lensFlares[ f ];
    flare.x = object.positionScreen.x + vecX * flare.distance;
    flare.y = object.positionScreen.y + vecY * flare.distance;
    flare.rotation = 0;
  }
  object.lensFlares[ 2 ].y += 0.025;
  object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
}


var renderer = new THREE.WebGLRenderer({ alpha: true });
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
  effect.render(scene, camera);

  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  requestAnimationFrame(animate);
}
function onDocumentMouseWheel( event ) {
  camera.fov += event.deltaY * 0.05;
  camera.updateProjectionMatrix();
}

document.addEventListener( 'wheel', onDocumentMouseWheel, false );
window.addEventListener('resize', onResize, false);

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
