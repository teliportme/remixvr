var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var loader = new THREE.TextureLoader();

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

var cubeMap = new THREE.CubeTexture( [] );
cubeMap.format = THREE.RGBFormat;
var loader1 = new THREE.ImageLoader();
loader1.load( 'sunbox.png', function ( image ) {
  var getSide = function ( x, y ) {
    var size = 1024;
    var canvas = document.createElement( 'canvas' );
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext( '2d' );
    context.drawImage( image, - x * size, - y * size );
    return canvas;
  };
  cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
  cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
  cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
  cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
  cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
  cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
  cubeMap.needsUpdate = true;
} );
var cubeShader = THREE.ShaderLib[ 'cube' ];
cubeShader.uniforms[ 'tCube' ].value = cubeMap;
var skyBoxMaterial = new THREE.ShaderMaterial( {
  fragmentShader: cubeShader.fragmentShader,
  vertexShader: cubeShader.vertexShader,
  uniforms: cubeShader.uniforms,
  depthWrite: false,
  side: THREE.BackSide
} );
var skyBox = new THREE.Mesh(
  new THREE.BoxGeometry( 500, 500, 500 ),
  skyBoxMaterial
);
scene.add( skyBox );

scene.add( new THREE.AmbientLight( 0x444444 ) );
var light = new THREE.DirectionalLight( 0xffffbb, 1 );
light.position.set( - 1, 5, - 1 );
scene.add(light);

var waterNormals = loader.load( 'waternormals.jpg' );
waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
waterNormals.repeat.set(160, 160);
var water = new THREE.Water( renderer, camera, scene, {
  textureWidth: 512,
  textureHeight: 512,
  waterNormals: waterNormals,
  alpha:  1.0,
  sunDirection: light.position.clone().normalize(),
  sunColor: 0xffffff,
  waterColor: 0x001e0f,
  distortionScale: 50.0
});


var planeGeometry = new THREE.PlaneGeometry(1000, 1000);
var plane = new THREE.Mesh(planeGeometry, water.material);
plane.add(water);
plane.receiveShadow = true;
plane.rotation.x = -0.5 * Math.PI;
scene.add(plane);

var ballGeometry = new THREE.IcosahedronGeometry( 4, 4 );
for ( var i = 0, j = ballGeometry.faces.length; i < j; i ++ ) {
  ballGeometry.faces[ i ].color.setHex( Math.random() * 0xffffff );
}
var ballMaterial = new THREE.MeshPhongMaterial( {
  vertexColors: THREE.FaceColors,
  shininess: 100,
  envMap: cubeMap
} );
sphere = new THREE.Mesh( ballGeometry, ballMaterial );

var planeObjectGeometry = new THREE.PlaneGeometry(0, 0);
var planeObjectMaterial = new THREE.MeshPhongMaterial();
var planeObject = new THREE.Mesh(planeObjectGeometry, planeObjectMaterial);
planeObject.receiveShadow = true;
planeObject.position.set(10, -5, -400);
// planeObject.rotation.x = - Math.PI * 0.5;
var box = new THREE.BoxHelper( planeObject, 0xffff00 );
scene.add( box );
for (var x = -80; x < 80; x += 40) {
  for (var z = -400; z < 400; z += 20) {
      var speaker=sphere.clone();
      speaker.position.set(x+Math.random()*15,controls.userHeight + 1,z+Math.random()*15);
      planeObject.add(speaker)
  }            
}
scene.add(planeObject);


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
camera.position.y = 20;
animate();

function animate() {

  var time = performance.now() * 0.003;
  // planeObject.position.y = Math.sin( time ) * 5 + 3;
  // planeObject.rotation.x = time * 0.5;
  // planeObject.rotation.z = time * 0.51;

  var delta = clock.getDelta();
  plane.position.z += 4 * delta;
  planeObject.position.z += 4 * delta;
  // plane.position.y = Math.abs(Math.sin(delta/5000*Math.PI)) * 2;
  // mirrorMesh.position.y +=  delta;
  water.material.uniforms.time.value += 1.0 / 60.0;
  water.render();

  effect.render(scene, camera);

  // if (enterVRButton.isPresenting()) {
    controls.update();
  // }

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
