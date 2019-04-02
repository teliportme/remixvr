import AFRAME from 'aframe';
import 'aframe-event-set-component';

document.addEventListener('loaded', function() {
  console.log('all items loaded')
})

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
      var spaces = document.getElementsByClassName('space');
      for (var i = 0; i < spaces.length; i++) {
        spaces[i].setAttribute('visible', 'false')
      }
      data.spaceTarget.setAttribute('visible', 'true');
      setTimeout(function() {
        data.target.setAttribute('material', 'src', data.src);
      }, data.dur);
    });
  },

  setupFadeAnimation: function() {
    var data = this.data;
    var targetEl = this.data.target;

    if (targetEl.dataset.setImageFadeSetup) { return; }
    targetEl.dataset.setImageFadeSetup = true;

    targetEl.setAttribute('animation__fade', {
      property: 'material.color',
      startEvents: 'set-image-fade',
      dir: 'alternate',
      dur: data.dur + 700,
      from: '#000',
      to: '#fff'
    })
  }
});

AFRAME.registerComponent('face-camera', {

  init: function() {
    // wait for camera to be added to the scene
    this.el.sceneEl.addEventListener('loaded', function() {
      this.el.object3D.lookAt(this.el.sceneEl.camera.getWorldPosition());
    }.bind(this))
    
  }
});