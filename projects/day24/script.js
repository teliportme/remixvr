var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var lineGeo = new THREE.PlaneBufferGeometry(0, 0);
var lineMaterial = new THREE.MeshBasicMaterial();
var lineMesh = new THREE.Mesh(lineGeo, lineMaterial);

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//Create an AudioListener and add it to the camera
var listener = new THREE.AudioListener();
camera.add( listener );

// create a global audio source
var sound = new THREE.Audio(listener);

var audioLoader = new THREE.AudioLoader();

//Load a sound and set it as the Audio object's buffer
audioLoader.load( 'sound.wav', function( buffer ) {
  sound.setBuffer( buffer );
  sound.setVolume(0.5);
  sound.play();
});

// add lines
var parameters = [
  [0.25, 0xffffff, 1, 2 ],
  [ 0.5, 0xffffff, 1, 1 ],
  [ 0.75, 0xF6EBA3, 0.75, 1 ],
  [ 1, 0xffffff, 0.5, 1 ],
  [ 1.25, 0xffffff, 0.8, 1 ],
  [ 3.0, 0xffffff, 0.75, 2 ],
  [ 3.5, 0xffffff, 0.5, 1 ],
  [ 4.5, 0xffffff, 0.25, 1 ],
  [ 5.5, 0xffffff, 0.125, 1 ]
];
var geometry = createGeometry();
for( var i = 0; i < parameters.length; ++ i ) {
  var p = parameters[ i ];
  var material = new THREE.LineBasicMaterial( { color: p[ 1 ], opacity: p[ 2 ], linewidth: p[ 3 ] } );
  var line = new THREE.LineSegments( geometry, material );
  line.scale.x = line.scale.y = line.scale.z = p[ 0 ];
  line.originalScale = p[ 0 ];
  line.rotation.y = Math.random() * Math.PI;
  line.updateMatrix();
  lineMesh.add( line );
}
scene.add(lineMesh);
var lineMesh2 = lineMesh.clone();
scene.add(lineMesh2);
lineMesh2.position.z = -1500;


function createGeometry() {
  var geometry = new THREE.Geometry();
  for ( i = 0; i < 1500; i ++ ) {
    var vertex1 = new THREE.Vector3();
    vertex1.x = Math.random() * 2 - 1;
    vertex1.y = Math.random() * 2 - 1;
    vertex1.z = Math.random() * 2 - 1;
    vertex1.normalize();
    vertex1.multiplyScalar(450);
    var vertex2 = vertex1.clone();
    vertex2.multiplyScalar( Math.random() * 0.09 + 1 );
    geometry.vertices.push( vertex1 );
    geometry.vertices.push( vertex2 );
  }
  return geometry;
}

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
  lineMesh.position.z += 5;
  lineMesh2.position.z += 5;
  if (lineMesh.position.z > 1500) {
    lineMesh.position.z = 0;
    lineMesh2.position.z = 1500;
  }

  var time = performance.now() * 0.0001;
  for ( var i = 0; i < scene.children.length; i ++ ) {
    var object = scene.children[ i ];
    if ( object instanceof THREE.Line ) {
      object.rotation.y = time * ( i < 4 ? ( i + 1 ) : - ( i + 1 ) );
      if ( i < 5 ) object.scale.x = object.scale.y = object.scale.z = object.originalScale * (i/5+1) * (1 + 0.5 * Math.sin( 7*time ) );
    }
  }

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
