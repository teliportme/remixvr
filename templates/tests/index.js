// jest version of https://github.com/aframevr/aframe/blob/master/tests/__init.test.js

navigator.getVRDisplays = function () {
  var resolvePromise = Promise.resolve();
  var mockVRDisplay = {
    cancelAnimationFrame: function (h) { return window.cancelAnimationFrame(1); },
    capabilities: {},
    exitPresent: resolvePromise,
    getPose: function () { return { orientation: null, position: null }; },
    requestAnimationFrame: function () { return 1; },
    requestPresent: resolvePromise,
    submitFrame: function () { return; }
  };
  return Promise.resolve([mockVRDisplay]);
};

require('aframe');

const AScene = AFRAME.AScene;

setup(function () {
  this.sinon = sinon.createSandbox();
  // Stubs to not create a WebGL context since Travis CI runs headless.
  this.sinon.stub(AScene.prototype, 'render');
  this.sinon.stub(AScene.prototype, 'resize');
  // this.sinon.stub(AScene.prototype, 'setupRenderer');
  // Mock renderer.
  AScene.prototype.renderer = {
    vr: {
      getDevice: function () { return { requestPresent: function () { } }; },
      setDevice: function () { },
      setPoseTarget: function () { },
      enabled: false
    },
    getContext: function () { return undefined; },
    shadowMap: {}
  };
});

teardown(function (done) {
  // Clean up any attached elements.
  var attachedEls = ['canvas', 'a-assets', 'a-scene'];
  var els = document.querySelectorAll(attachedEls.join(','));
  for (var i = 0; i < els.length; i++) {
    els[i].parentNode.removeChild(els[i]);
  }
  this.sinon.restore();
  delete AFRAME.components.test;
  delete AFRAME.systems.test;

  // Allow detachedCallbacks to clean themselves up.
  setTimeout(function () {
    done();
  });
});

// var testsContext = require.context("../packages", true, /\.test$/);
// testsContext.keys().forEach(testsContext);
