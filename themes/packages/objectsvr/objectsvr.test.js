require('./index');
let entityFactory = require('../../tests/helpers').entityFactory;

const MTL = 'base/objects/Bear_Brown/Bear_Brown.mtl';
const OBJ = 'base/objects/Bear_Brown/Bear_Brown.obj';

suite('objectsvr', () => {

  setup(function (done) {
    var el;
    var objAsset = document.createElement('a-asset-item');
    var mtlAsset = document.createElement('a-asset-item');
    mtlAsset.setAttribute('id', 'mtl');
    mtlAsset.setAttribute('src', MTL);
    objAsset.setAttribute('id', 'obj');
    objAsset.setAttribute('src', OBJ);
    el = this.el = entityFactory({ assets: [mtlAsset, objAsset] });
    if (el.hasLoaded) { done(); }
    el.addEventListener('loaded', function () { done(); });
  });

  test('add object', function(done) {
    let el = this.el;
    let handled = false;
    el.addEventListener('model-loaded', () => {
      if (handled) { return; }
      handled = true;
      assert.ok(el.components['obj-model'].model);
      done();
    });
    el.setAttribute('obj-model', { mtl: '#mtl', obj: '#obj' });
  });
})