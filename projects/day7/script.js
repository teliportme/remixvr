var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);
var geometry = new THREE.SphereGeometry(500, 60, 40);

var videoElement = document.createElement('video');
videoElement.src = '/common/public_speaking.mp4';
videoElement.load();
videoElement.crossOrigin = 'anonymous';
videoElement.setAttribute('webkit-playsinline', 'true');
videoElement.setAttribute('playsinline', 'true');

var videoTexture = new THREE.Texture(videoElement);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;
var material = new THREE.MeshBasicMaterial({ map: videoTexture, side: THREE.DoubleSide });
var mesh = new THREE.Mesh(geometry, material);
mesh.scale.x = -1;
mesh.position.set(0, controls.userHeight, -1);

scene.add(mesh);
      

var planeGeometry = new THREE.PlaneGeometry(1, 1);
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var maxWidth = canvas.width;
var lineHeight = 25;
var startScroll = false;


var text = 'I am happy to join with you today in what will go down in history as the greatest demonstration for freedom in the history of our nation.' +

'Five score years ago, a great American, in whose symbolic shadow we stand today, signed the Emancipation Proclamation. This momentous decree came as a great beacon light of hope to millions of Negro slaves who had been seared in the flames of withering injustice. It came as a joyous daybreak to end the long night of their captivity.' + 

'But one hundred years later, the Negro still is not free. One hundred years later, the life of the Negro is still sadly crippled by the manacles of segregation and the chains of discrimination. One hundred years later, the Negro lives on a lonely island of poverty in the midst of a vast ocean of material prosperity. One hundred years later, the Negro is still languished in the corners of American society and finds himself an exile in his own land. And so we\'ve come here today to dramatize a shameful condition.' + 

'In a sense we\'ve come to our nation\'s capital to cash a check. When the architects of our republic wrote the magnificent words of the Constitution and the Declaration of Independence, they were signing a promissory note to which every American was to fall heir. This note was a promise that all men, yes, black men as well as white men, would be guaranteed the "unalienable Rights" of "Life, Liberty and the pursuit of Happiness." It is obvious today that America has defaulted on this promissory note, insofar as her citizens of color are concerned. Instead of honoring this sacred obligation, America has given the Negro people a bad check, a check which has come back marked "insufficient funds."';
var x = 0;
var y = 60;

function wrapText(x, y) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.translate(x, y);
  var words = text.split(' ');
  var line = '';

  for(var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + ' ';
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
  context.setTransform(1, 0, 0, 1, 0, 0);
}
wrapText(x, y);

context.font = '11pt Calibri';
context.fillStyle = 'yellow';

var textTexture = new THREE.Texture(canvas);
textTexture.minFilter = THREE.LinearFilter;
textTexture.needsUpdate = true;
var textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, side: THREE.DoubleSide, transparent: true });
var textMesh = new THREE.Mesh(planeGeometry, textMaterial);
textMesh.position.set(0, controls.userHeight, -1.5);

var pivot = new THREE.Object3D();
scene.add(pivot);

pivot.add(textMesh);


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
  videoElement.play();
  startScroll = true;
});

document.getElementById('vr-button').addEventListener('click', function() {
  videoElement.play();
  startScroll = true;
});

var xaxis = new THREE.Vector3(1, 0, 0);
var yaxis = new THREE.Vector3(0, 1, 0);
var zaxis = new THREE.Vector3(0, 0, 1);
var pos = 60;

animate();
function animate() {
  if(startScroll) {
    textTexture.needsUpdate = true;
    wrapText(0, pos);
    pos -= 0.1;
  }
  var direction = zaxis.clone();
  // Apply the camera's quaternion onto the unit vector of one of the axes
  // of our desired rotation plane (the z axis of the xz plane, in this case).
  direction.applyQuaternion(camera.quaternion);
  // Project the direction vector onto the y axis to get the y component
  // of the direction.
  var ycomponent = yaxis.clone().multiplyScalar(direction.dot(yaxis));
  var xcomponent = xaxis.clone().multiplyScalar(direction.dot(xaxis));
  // Subtract the y component from the direction vector so that we are
  // left with the x and z components.
  direction.sub(ycomponent);
  // direction.sub(xcomponent);
  // Normalize the direction into a unit vector again.
  direction.normalize();
  // Set the pivot's quaternion to the rotation required to get from the z axis
  // to the xz component of the camera's direction.
  pivot.quaternion.setFromUnitVectors(zaxis, direction);
  pivot.position.copy(camera.position);
  pivot.position.y = -0.5;

  if( videoElement.readyState === videoElement.HAVE_ENOUGH_DATA ){
    videoTexture.needsUpdate = true;
  }


  effect.render(scene, camera);
  if (enterVRButton.isPresenting()) {
    controls.update();
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', onResize, false);
document.addEventListener( 'wheel', onDocumentMouseWheel, false );
function onDocumentMouseWheel( event ) {
  camera.fov += event.deltaY * 0.05;
  camera.updateProjectionMatrix();
}

function onResize() {
  effect.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
