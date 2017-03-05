var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.position.z = 350;
// camera.target = new THREE.Vector3(0, 0, 0);
// camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);
var texture = new THREE.TextureLoader().load('/common/pano.jpg');
var ambient = new THREE.AmbientLight( 0x444444 );
scene.add( ambient );

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
renderer.setClearColor(0xffffff);

var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* TEXTURE WIDTH FOR SIMULATION */
var WIDTH = 32;
var BIRDS = WIDTH * WIDTH;
// Custom Geometry - using 3 triangles each. No UVs, no normals currently.
THREE.BirdGeometry = function () {
  var triangles = BIRDS * 3;
  var points = triangles * 3;
  THREE.BufferGeometry.call( this );
  var vertices = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
  var birdColors = new THREE.BufferAttribute( new Float32Array( points * 3 ), 3 );
  var references = new THREE.BufferAttribute( new Float32Array( points * 2 ), 2 );
  var birdVertex = new THREE.BufferAttribute( new Float32Array( points ), 1 );
  this.addAttribute( 'position', vertices );
  this.addAttribute( 'birdColor', birdColors );
  this.addAttribute( 'reference', references );
  this.addAttribute( 'birdVertex', birdVertex );
  // this.addAttribute( 'normal', new Float32Array( points * 3 ), 3 );
  var v = 0;
  function verts_push() {
    for (var i=0; i < arguments.length; i++) {
      vertices.array[v++] = arguments[i];
    }
  }
  var wingsSpan = 20;
  for (var f = 0; f<BIRDS; f++ ) {
    // Body
    verts_push(
      0, -0, -20,
      0, 4, -20,
      0, 0, 30
    );
    // Left Wing
    verts_push(
      0, 0, -15,
      -wingsSpan, 0, 0,
      0, 0, 15
    );
    // Right Wing
    verts_push(
      0, 0, 15,
      wingsSpan, 0, 0,
      0, 0, -15
    );
  }
  for( var v = 0; v < triangles * 3; v++ ) {
    var i = ~~(v / 3);
    var x = (i % WIDTH) / WIDTH;
    var y = ~~(i / WIDTH) / WIDTH;
    var c = new THREE.Color(
      0x444444 +
      ~~(v / 9) / BIRDS * 0x666666
    );
    birdColors.array[ v * 3 + 0 ] = c.r;
    birdColors.array[ v * 3 + 1 ] = c.g;
    birdColors.array[ v * 3 + 2 ] = c.b;
    references.array[ v * 2     ] = x;
    references.array[ v * 2 + 1 ] = y;
    birdVertex.array[ v         ] = v % 9;
  }
  this.scale( 0.2, 0.2, 0.2 );
};
THREE.BirdGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
var container, stats;
var camera, scene, renderer, geometry, i, h, color;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var BOUNDS = 800, BOUNDS_HALF = BOUNDS / 2;
var last = performance.now();
var gpuCompute;
var velocityVariable;
var positionVariable;
var positionUniforms;
var velocityUniforms;
var birdUniforms;
init();

function init() {
  
  initComputeRenderer();

  window.addEventListener( 'resize', onWindowResize, false );
  var effectController = {
    seperation: 20.0,
    alignment: 20.0,
    cohesion: 20.0,
    freedom: 0.75
  };
  var valuesChanger = function() {
    velocityUniforms.seperationDistance.value = effectController.seperation;
    velocityUniforms.alignmentDistance.value = effectController.alignment;
    velocityUniforms.cohesionDistance.value = effectController.cohesion;
    velocityUniforms.freedomFactor.value = effectController.freedom;
  };
  valuesChanger();
  initBirds();
}
function initComputeRenderer() {
  gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, renderer );
  var dtPosition = gpuCompute.createTexture();
  var dtVelocity = gpuCompute.createTexture();
  fillPositionTexture( dtPosition );
  fillVelocityTexture( dtVelocity );
  velocityVariable = gpuCompute.addVariable( "textureVelocity", document.getElementById( 'fragmentShaderVelocity' ).textContent, dtVelocity );
  positionVariable = gpuCompute.addVariable( "texturePosition", document.getElementById( 'fragmentShaderPosition' ).textContent, dtPosition );
  gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
  gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );
  positionUniforms = positionVariable.material.uniforms;
  velocityUniforms = velocityVariable.material.uniforms;
  positionUniforms.time = { value: 0.0 };
  positionUniforms.delta = { value: 0.0 };
  velocityUniforms.time = { value: 1.0 };
  velocityUniforms.delta = { value: 0.0 };
  velocityUniforms.testing = { value: 1.0 };
  velocityUniforms.seperationDistance = { value: 1.0 };
  velocityUniforms.alignmentDistance = { value: 1.0 };
  velocityUniforms.cohesionDistance = { value: 1.0 };
  velocityUniforms.freedomFactor = { value: 1.0 };
  velocityUniforms.predator = { value: new THREE.Vector3() };
  velocityVariable.material.defines.BOUNDS = BOUNDS.toFixed( 2 );
  velocityVariable.wrapS = THREE.RepeatWrapping;
  velocityVariable.wrapT = THREE.RepeatWrapping;
  positionVariable.wrapS = THREE.RepeatWrapping;
  positionVariable.wrapT = THREE.RepeatWrapping;
  var error = gpuCompute.init();
  if ( error !== null ) {
      console.error( error );
  }
}
function initBirds() {
  var geometry = new THREE.BirdGeometry();
  // For Vertex and Fragment
  birdUniforms = {
    color: { value: new THREE.Color( 0xff2200 ) },
    texturePosition: { value: null },
    textureVelocity: { value: null },
    time: { value: 1.0 },
    delta: { value: 0.0 }
  };
  // ShaderMaterial
  var material = new THREE.ShaderMaterial( {
    uniforms:       birdUniforms,
    vertexShader:   document.getElementById( 'birdVS' ).textContent,
    fragmentShader: document.getElementById( 'birdFS' ).textContent,
    side: THREE.DoubleSide
  });
  birdMesh = new THREE.Mesh( geometry, material );
  birdMesh.rotation.y = Math.PI / 2;
  birdMesh.matrixAutoUpdate = false;
  birdMesh.updateMatrix();
  scene.add(birdMesh);
}
function fillPositionTexture( texture ) {
  var theArray = texture.image.data;
  for ( var k = 0, kl = theArray.length; k < kl; k += 4 ) {
    var x = Math.random() * BOUNDS - BOUNDS_HALF;
    var y = Math.random() * BOUNDS - BOUNDS_HALF;
    var z = Math.random() * BOUNDS - BOUNDS_HALF;
    theArray[ k + 0 ] = x;
    theArray[ k + 1 ] = y;
    theArray[ k + 2 ] = z;
    theArray[ k + 3 ] = 1;
  }
}
function fillVelocityTexture( texture ) {
  var theArray = texture.image.data;
  for ( var k = 0, kl = theArray.length; k < kl; k += 4 ) {
    var x = Math.random() - 0.5;
    var y = Math.random() - 0.5;
    var z = Math.random() - 0.5;
    theArray[ k + 0 ] = x * 10;
    theArray[ k + 1 ] = y * 10;
    theArray[ k + 2 ] = z * 10;
    theArray[ k + 3 ] = 1;
  }
}
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

var options = {
  color: 'white',
  background: 'black',
  corners: 'square'
};
var enterVRButton = new webvrui.EnterVRButton(renderer.domElement, options);
enterVRButton.on('exit', function() {
  // camera.quaternion.set(0, 0, 0, 1);
  // camera.position.set(0, controls.userHeight, 0);
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
var t =0;
var last = performance.now();
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
animate();

function animate() {

  var now = performance.now();
  var delta = (now - last) / 1000;
  if (delta > 1) delta = 1; // safety cap on large deltas
  last = now;
  positionUniforms.time.value = now;
  positionUniforms.delta.value = delta;
  velocityUniforms.time.value = now;
  velocityUniforms.delta.value = delta;
  birdUniforms.time.value = now;
  birdUniforms.delta.value = delta;
  velocityUniforms.predator.value.set( 0.5 * 10000 / windowHalfX, - 0.5 * 10000 / windowHalfY, 0 );

  gpuCompute.compute();
  birdUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
  birdUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;


  renderer.render(scene, camera);

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
