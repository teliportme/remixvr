// adapted from https://github.com/aframevr/aframe/blob/master/tests/helpers.js

module.exports.entityFactory = options => {
  let scene = document.createElement('a-scene');
  let assets = document.createElement('a-assets');
  let entity = document.createElement('a-entity');

  scene.appendChild(assets);
  scene.appendChild(entity);

  options = options || {};

  if (options.assets) {
    options.assets.forEach(asset => {
      assets.appendChild(asset);
    });
  }

  document.body.appendChild(scene);
  return entity;
}