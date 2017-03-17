var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(40, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0 , 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
// controls.standing = true;

var scene = new THREE.Scene();
var ambient = new THREE.AmbientLight( 0xffffff );
scene.add( ambient );

var light = new THREE.PointLight( 0xFFFFDD, 1, 100 );
light.position.set( 0, 0, 0 );
// scene.add( light );

var mesh;
var mtlLoader = new THREE.MTLLoader();
mtlLoader.setPath('/projects/day25/');
mtlLoader.setTexturePath('/projects/day25/');
mtlLoader.setMaterialOptions({
  side: THREE.DoubleSide,
  wrap: THREE.ClampToEdgeWrapping
});
mtlLoader.load('test1.mtl', function(materials) {
  materials.preload();
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.setPath('/projects/day25/');
  objLoader.load('test1.obj', function(object) {
    object.position.y = 1;
    object.position.z = 2;
    object.position.x = -5;
    object.name = 'house';
    mesh = object;
    scene.add(object);
    // var box = new THREE.BoxHelper(object, 0xffff00);
    // scene.add( box );

    animate(object);
  });
});

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

var  path = new THREE.Path([
  new THREE.Vector3(),
  new THREE.Vector3(0, controls.userHeight, 2),
  new THREE.Vector3(-5, controls.userHeight, 2),
  new THREE.Vector3(-5, 0.3, 4),
  new THREE.Vector3(-7, 0.3, 4),
  new THREE.Vector3(-7, -1, 4),
  new THREE.Vector3(-9, -1, 4),
  new THREE.Vector3(-7, -1, 4),
  new THREE.Vector3(-7, 0.3, 4),
  new THREE.Vector3(-5, 0.3, 4),
  new THREE.Vector3(-5, 3.5, -2),
  new THREE.Vector3(-9, 3.5, -2),
  new THREE.Vector3(-9, 4.5, -2),
  new THREE.Vector3(-9, 3.5, -2),
  new THREE.Vector3(-5, 3.5, -2),
  new THREE.Vector3(-5, controls.userHeight, 2),
  new THREE.Vector3(0, controls.userHeight, 2),
]);

var position = 0;

drawPath();

function drawPath() {
  var point;

  var vertices = path.getSpacedPoints(10);

  // Change 2D points to 3D points
  for (var i = 0; i < vertices.length; i++) {
    point = vertices[i]
    vertices[i] = new THREE.Vector3(point.x, -15, point.y);
  }
  var lineGeometry = new THREE.Geometry();
  lineGeometry.vertices = vertices;
  var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff
  });
  var line = new THREE.Line(lineGeometry, lineMaterial)
  scene.add(line);
}
var direction = 'forward';

function move() {
  // get the point at position
  var point = path.getPointAt(position);

  if (direction === 'forward') {
    // add up to position for movement
    position += 0.0005;
    if (!point) {
      direction = 'backward';
      position -=0.001;
      point = path.getPointAt(position);
    }
  } else {
    position -= 0.0005;
    if (!point) {
      direction = 'forward';
      position += 0.001;
      point = path.getPointAt(position);
    }
  }

  if (point) {
    camera.position.x = point.x;
    camera.position.z = point.y;
  }
}

function animate(object) {
  move()
  effect.render(scene, camera);
  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  requestAnimationFrame(animate.bind(this, object));
}

document.addEventListener( 'wheel', onDocumentMouseWheel, false );
window.addEventListener('resize', onResize, false);

function onDocumentMouseWheel( event ) {
  camera.fov += event.deltaY * 0.05;
  camera.updateProjectionMatrix();
}

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
