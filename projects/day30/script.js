var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(40, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = false;
camera.position.y = controls.userHeight;
camera.position.z = -10;

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

var light = new THREE.HemisphereLight(0xffffff, 0x000000, 0.6);
scene.add(light);

var marginbottom = 0, chartwidth = 100, chartheight = 30;
var xscale = d3.scale.linear().range([-50, chartwidth]);
var yscale = d3.scale.linear().range([0, chartheight]);

var sphereGeometry = new THREE.SphereGeometry(100, 60, 40);
var sphereMaterial = new THREE.MeshBasicMaterial();
var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.rotation.y = Math.PI / 2

// add charts
d3.csv('data.csv', census, function(data) {
  xscale.domain([0, data.length - 1]);
  yscale.domain([0, d3.max(data, function(d) { return d.all; })]);
  var columnWidth = (chartwidth / data.length);
  // columnWidth -= columnWidth * 0.1;
  var columnMaterial = new THREE.MeshPhongMaterial({
    color: 0x0000ff
  });
  data.forEach(function(d, i, a) {
    var colheight = yscale(d.all);
    var columngeo = new THREE.BoxGeometry(columnWidth, colheight, columnWidth);
    var columnmesh = new THREE.Mesh(columngeo, columnMaterial);
    columnmesh.position.set(xscale(i), colheight/2 + marginbottom, -100); //Box geometry is positioned at its’ center, so we need to move it up by half the height
    sphere.add(columnmesh);
  });
  yscale.ticks(5).forEach(function(t, i, a){
    //Draw label
    var height = 0;
    var size = 1.5;
    var material = new THREE.MultiMaterial([
      new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.FlatShading } ), // front
      new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.SmoothShading } ) // side
    ]),
    text = "" + (t/1000);
    var fontLoader = new THREE.FontLoader().load('/projects/day10/helvetiker_regular.typeface.json', function(font) {
      function getTextMesh(text) {
        var textGeo = new THREE.TextGeometry( text, {
          size: size,
          height: height,
          curveSegments: 4,
          font: font,
          weight: "normal",
          style: "normal",
          bevelEnabled: false,
          material: 0,
          extrudeMaterial: 1
        });
        textGeo.computeBoundingBox();
        return new THREE.Mesh( textGeo, material );
      }

      
      var label = getTextMesh(text);
    
      var xOffset = ( label.geometry.boundingBox.max.x - label.geometry.boundingBox.min.x );
      label.position.set(-chartwidth/2 - xOffset - 2.5, yscale(t) + marginbottom - 0.5, -100);
      sphere.add(label);

      //Draw line
      var lineGeometry = new THREE.Geometry();
      var vertArray = lineGeometry.vertices;
      vertArray.push( new THREE.Vector3(-chartwidth/2 - 1.5, yscale(t) + marginbottom, 0),
                     new THREE.Vector3(chartwidth/2 + 50, yscale(t) + marginbottom, 0) );
      lineGeometry.computeLineDistances();
      var lineMaterial = new THREE.LineBasicMaterial( { color: 0xaaaaaa } );
      var line = new THREE.Line( lineGeometry, lineMaterial );
      line.position.set(0, 0, -100)
      sphere.add(line);

      // add title
      var title = getTextMesh('US Population by Age, Jan 2000 in Millions');
      title.position.set(-chartwidth/2 + 20, -5, -100);
      sphere.add(title);

      // add x axis text
      var xzeroLabel = getTextMesh('0 years old');
      xzeroLabel.position.set(-chartwidth/2, -2, -100);
      sphere.add(xzeroLabel);

      var x100Label = getTextMesh('100+ years old');
      x100Label.position.set(-chartwidth/2 + chartwidth + 30, -2, -100);
      sphere.add(x100Label);
    });
  });
});

var planeGeometry = new THREE.PlaneGeometry(30, 30);
var loader = new THREE.TextureLoader();
var population = loader.load('population.png');
var planeMaterial = new THREE.MeshBasicMaterial({ map: population, side: THREE.DoubleSide });
var populationImage = new THREE.Mesh(planeGeometry, planeMaterial);
populationImage.rotation.y = - Math.PI / 2;
populationImage.position.x = 50;
sphere.add(populationImage);

var ppt1Geo = new THREE.PlaneGeometry(30, 30);
var ppt1Texture = loader.load('ppt1.jpg');
var ppt1Material = new THREE.MeshBasicMaterial({ map: ppt1Texture, side: THREE.DoubleSide });
var ppt1 = new THREE.Mesh(ppt1Geo, ppt1Material);
ppt1.rotation.y = Math.PI;
ppt1.position.z = 50;
sphere.add(ppt1);

var ppt2Geo = new THREE.PlaneGeometry(30, 30);
var ppt2Texture = loader.load('ppt2.jpg');
var ppt2Material = new THREE.MeshBasicMaterial({ map: ppt2Texture, side: THREE.DoubleSide });
var ppt2 = new THREE.Mesh(ppt2Geo, ppt2Material);
ppt2.rotation.y = 3 * Math.PI / 2;
ppt2.position.x = - 50;
ppt2.scale.x = -1;
sphere.add(ppt2);

function census(d) {
  d.all = +d.all;
  d.male = +d.male;
  d.female = +d.female;
  return d;
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
  startRotation();
});

document.getElementById('vr-button').addEventListener('click', function() {
  startRotation();
});

function startRotation() {
  setInterval(function() {
    sphere.rotation.y -= Math.PI / 2;
  }, 3000);
}

animate();

function animate() {
  effect.render(scene, camera);

  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  requestAnimationFrame(animate);
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
