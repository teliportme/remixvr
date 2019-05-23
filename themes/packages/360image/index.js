import AFRAME from 'aframe';
import 'aframe-event-set-component';
import { fetchProjectData, getValues, API_ROOT } from './remixvr';

fetchProjectData(function(spaces) {
  const space = spaces[0];
  const fields = space.fields;
  const photospheres = getValues(fields, 'type', 'photosphere');
  createPhotoSphereSpace(photospheres[0].file.url);

  const text = getValues(fields, 'type', 'text');
  const titleElement = document.getElementById('project-title');
  titleElement.setAttribute('text', 'value', text[0].text_value);
});

function createPhotoSphereSpace(photosphereUrl) {
  const sky = document.getElementById('sky');
  sky.setAttribute('material', 'src', API_ROOT + photosphereUrl);
}

AFRAME.registerComponent('cursor-listener', {
  init: function() {
    this.el.addEventListener('click', function(evt) {
      document.getElementById('info-board').setAttribute('visible', false);
    });
  }
});
