import AFRAME from 'aframe';
import 'aframe-event-set-component';
import { fetchProjectData, fetchSpace, getValues, API_ROOT } from './remixvr';

fetchProjectData(function(spaces) {
  // for (let i = 0; i < spaces.length; i++) {
  const space = spaces[0];
  const fields = space.fields;
  const photospheres = getValues(fields, 'type', 'photosphere');
  const hotspots = getValues(fields, 'type', 'position');
  createPhotoSphereSpace(photospheres[0].file.url);
  createHotspots(hotspots);
  // }
});

function createPhotoSphereSpace(photosphereUrl) {
  const sky = document.getElementById('sky');
  sky.setAttribute('material', 'src', API_ROOT + photosphereUrl);
}

function createHotspots(hotspots) {
  const element = document.querySelectorAll('[set-image]');

  for (let index = element.length - 1; index >= 0; index--) {
    element[index].parentNode.removeChild(element[index]);
  }

  for (let i = 0; i < hotspots.length; i++) {
    const hotspot = document.createElement('a-entity');
    hotspot.setAttribute('mixin', 'arrow-up');
    hotspot.setAttribute('face-camera', true);
    hotspot.setAttribute('position', {
      x: hotspots[i].x,
      y: hotspots[i].y,
      z: hotspots[i].z
    });

    hotspot.setAttribute(
      'set-image',
      `on:click; target: #sky;linkTo: ${
        hotspots[i].children[0].linked_space_id
      }`
    );

    const space = document.getElementById('space');
    space.appendChild(hotspot);
  }
}

AFRAME.registerComponent('set-image', {
  schema: {
    on: { type: 'string' },
    target: { type: 'selector', default: '#space' },
    spaceTarget: { type: 'selector' },
    src: { type: 'string' },
    dur: { type: 'number', default: 300 }
  },

  init: function() {
    var data = this.data;
    var el = this.el;

    this.setupFadeAnimation();

    el.addEventListener(data.on, function() {
      data.target.emit('set-image-fade');
      // hide all spaces and make the new space visible
      fetchSpace(data.linkTo, function(space) {
        const fields = space.fields;
        const photospheres = getValues(fields, 'type', 'photosphere');
        const hotspots = getValues(fields, 'type', 'position');
        createPhotoSphereSpace(photospheres[0].file.url);
        createHotspots(hotspots);

        setTimeout(function() {}, data.dur);
      });
    });
  },

  setupFadeAnimation: function() {
    var data = this.data;
    var targetEl = this.data.target;

    if (targetEl.dataset.setImageFadeSetup) {
      return;
    }
    targetEl.dataset.setImageFadeSetup = true;

    targetEl.setAttribute('animation__fade', {
      property: 'material.color',
      startEvents: 'set-image-fade',
      dir: 'alternate',
      dur: data.dur + 700,
      from: '#000',
      to: '#fff'
    });
  }
});

AFRAME.registerComponent('face-camera', {
  init: function() {
    // wait for camera to be added to the scene
    this.el.sceneEl.addEventListener(
      'loaded',
      function() {
        this.el.object3D.lookAt(this.el.sceneEl.camera.getWorldPosition());
      }.bind(this)
    );
  },
  update: function() {
    this.el.sceneEl.camera &&
      this.el.object3D.lookAt(this.el.sceneEl.camera.getWorldPosition());
  }
});
