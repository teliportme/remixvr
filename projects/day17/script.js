var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight, 1, 1100);
camera.target = new THREE.Vector3(0, 0, 0);
camera.lookAt(camera.target);

var controls = new THREE.VRControls(camera);
controls.standing = true;
camera.position.y = controls.userHeight;

// VR adaptation of https://github.com/Raathigesh/HTML5AudioVisualizer/blob/master/scripts/Site.js

// music bars
var numberOfBars = 60;
var bars = new Array();

//get the audio context
var audioContext = new AudioContext();
var javascriptNode;
var sourceBuffer;

//create the analyser node
var analyser = audioContext.createAnalyser();
//iterate and create bars
for (var i = 0; i < numberOfBars; i++) {

  //create a bar
  var barGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

  //create a material
  var material = new THREE.MeshPhongMaterial({
      color: getRandomColor(),
      ambient: 0x808080,
      specular: 0xffffff
  });

  //create the geometry and set the initial position
  bars[i] = new THREE.Mesh(barGeometry, material);
  bars[i].position.set(i - numberOfBars/2, 0, 0);

  //add the created bar to the scene
  scene.add(bars[i]);
}

// add ambient light
var light = new THREE.AmbientLight(0xffffff);
scene.add(light);

function setupAudioProcessing () {

  //create the javascript node
  var javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);
  javascriptNode.connect(audioContext.destination);

  //create the source buffer
  sourceBuffer = audioContext.createBufferSource();

  analyser.smoothingTimeConstant = 0.3;
  analyser.fftSize = 512;

  //connect source to analyser
  sourceBuffer.connect(analyser);
  sourceBuffer.loop = true;

  //analyser to speakers
  analyser.connect(javascriptNode);

  //connect source to analyser
  sourceBuffer.connect(audioContext.destination);

  // audio file
  var fileLoader = new THREE.FileLoader();
  fileLoader.setResponseType('arraybuffer');
  var filebuffer;
  fileLoader.load('/projects/day15/dance.mp3', function(buffer) {
    filebuffer = buffer;
    start(filebuffer);
  });

};

function start (buffer) {
  audioContext.decodeAudioData(buffer, decodeAudioDataSuccess, decodeAudioDataFailed);

  function decodeAudioDataSuccess(decodedBuffer) {
    sourceBuffer.buffer = decodedBuffer;
    sourceBuffer.start(0);
  }

  function decodeAudioDataFailed() {
    debugger
  }
};

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

setupAudioProcessing();

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
  // get the average for the first channel
  var array = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(array);

  var step = Math.round(array.length / numberOfBars);

  //Iterate through the bars and scale the z axis
  for (var i = 0; i < numberOfBars; i++) {
    var value = array[i * step] / 4;
    value = value < 1 ? 1 : value;
    bars[i].scale.z = value;
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
