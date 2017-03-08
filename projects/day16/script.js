var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(40, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0 , 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;

// add ambient light
var ambient = new THREE.AmbientLight( 0xffffff );
scene.add( ambient );

// add point light
var light = new THREE.PointLight( 0x111111, 1, 100 );
light.position.set( 0, 0, 0 );
scene.add( light );

var object1;
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/projects/day16/dancer07/');
mtlLoader.setTexturePath('/projects/day16/dancer07/');
mtlLoader.load('dancer07.mtl', function(materials) {
  materials.preload();
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/projects/day16/dancer07/');
  objLoader.load('dancer07.obj', function(object) {
    object.position.y = -3;
    object.position.z = -10;
    scene.add(object);
    object1 = object;

    spotLight1.target = object;
    scene.add(spotLight1);
  });
});

var object2;
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/projects/day16/olga/');
mtlLoader.setTexturePath('/projects/day16/olga/');
mtlLoader.load('olga.mtl', function(materials) {
  materials.preload();
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/projects/day16/olga/');
  objLoader.load('olga.obj', function(object) {
    object.position.y = -3;
    object.position.z = 1;
    object.position.x = 10;
    object.rotation.y = - Math.PI /2;
    scene.add(object);
    object2 = object;

    spotLight2.target = object;
    scene.add(spotLight2);
  });
});

var object3;
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/projects/day16/alexia/');
mtlLoader.setTexturePath('/projects/day16/alexia/');
mtlLoader.load('alexia.mtl', function(materials) {
  materials.preload();
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/projects/day16/alexia/');
  objLoader.load('alexia.obj', function(object) {
    object.position.y = -3;
    object.position.z = 1;
    object.position.x = -10;
    scene.add(object);
    object3 = object;
    
    spotLight3.target = object;
    scene.add(spotLight3);
  });
});

// adding text
var textMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
var priceMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
var fontLoader = new THREE.FontLoader().load('helvetiker_regular.typeface.json', function(font) {

  // title of first item
  var name1Geo = new THREE.TextGeometry('Dress', {
    font: font,
    size: 0.3,
    bevelEnabled: false,
    height: 0
  });
  name1 = new THREE.Mesh(name1Geo, textMaterial);
  name1.position.set(1, 2, -10);
  scene.add(name1);

  // price of first item
  var price1Geo = new THREE.TextGeometry('$20', {
    font: font,
    size: 0.4,
    bevelEnabled: false,
    height: 0.1
  });
  price1 = new THREE.Mesh(price1Geo, textMaterial);
  price1.position.set(1, 1.3, -10);
  scene.add(price1);

  var name2Geo = new THREE.TextGeometry('Formals', {
    font: font,
    size: 0.3,
    bevelEnabled: false,
    height: 0
  });
  name2 = new THREE.Mesh(name2Geo, textMaterial);
  name2.position.set(10, 2, -1);
  name2.rotation.y = -Math.PI/2;
  scene.add(name2);
  var price2Geo = new THREE.TextGeometry('$25', {
    font: font,
    size: 0.4,
    bevelEnabled: false,
    height: 0.1
  });
  price2 = new THREE.Mesh(price2Geo, textMaterial);
  price2.position.set(10, 1.3, -1);
  price2.rotation.y = -Math.PI/2;
  scene.add(price2);

  var name3Geo = new THREE.TextGeometry('Jacket', {
    font: font,
    size: 0.3,
    bevelEnabled: false,
    height: 0
  });
  name3 = new THREE.Mesh(name3Geo, textMaterial);
  name3.position.set(-10, 2, 0);
  name3.rotation.y = Math.PI / 2;
  scene.add(name3);
  var price3Geo = new THREE.TextGeometry('$15', {
    font: font,
    size: 0.4,
    bevelEnabled: false,
    height: 0.1
  });
  price3 = new THREE.Mesh(price3Geo, textMaterial);
  price3.position.set(-10, 1.3, 0);
  price3.rotation.y = Math.PI / 2;
  scene.add(price3);
});

function createSpotlight(color) {
  var obj = new THREE.SpotLight(color, 2);
  obj.castShadow = true;
  obj.angle = Math.PI/5;
  obj.intensity = 2;
  obj.penumbra = 0.2;
  obj.decay = 2;
  obj.distance = 100;
  obj.shadow.mapSize.width = 1024;
  obj.shadow.mapSize.height = 1024;
  return obj;
}

var spotLight1 = createSpotlight(0xD8D862);
var spotLight2 = createSpotlight(0xD8D862);
var spotLight3 = createSpotlight(0xD8D862);

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
var effect = new THREE.VREffect(renderer);
effect.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var options = {
  color: 'bllk',
  background: 'white',
  corners: 'square',
  textEnterVRTitle: 'Enter VR'
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

animate();

function animate() {
  var timer = Date.now() * 0.0005;
  if (object1 && object1.rotation) {
    object1.rotation.y = Math.cos( timer ) * 3;
    object1.updateMatrix();
  }
  if (object3 && object3.rotation) {
    object3.rotation.y = Math.cos( timer ) * 3;
    object3.updateMatrix();
  }
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
