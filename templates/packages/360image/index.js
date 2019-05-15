import AFRAME from 'aframe';
import { fetchProjectData, getValues, API_ROOT } from './remixvr';

fetchProjectData(function(spaces) {
  const space = spaces[0];
  const fields = space.fields;
  const photospheres = getValues(fields, 'type', 'photosphere');
  createPhotoSphereSpace(photospheres[0].file.url);
});

function createPhotoSphereSpace(photosphereUrl) {
  const sky = document.getElementById('sky');
  sky.setAttribute('material', 'src', API_ROOT + photosphereUrl);
}
