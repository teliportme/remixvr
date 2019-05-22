import AFRAME from 'aframe';
import 'aframe-event-set-component';
import 'aframe-template-component';
import { fetchProjectData, getValues, API_ROOT } from './remixvr';
import 'aframe-state-component';
import 'aframe-layout-component';

AFRAME.registerState({
  initialState: {
    currentSpace: 0,
    hasNext: true,
    hasPrevious: false,
    totalSpaces: 1,
    templates: {
      '360image': 'scenes/360image.html',
      '360video': 'scenes/360video.html'
    }
  },

  handlers: {
    nextSpace: function(state) {
      const cs = state.currentSpace;
      console.log(cs);
      state.currentSpace = state.totalSpaces < cs ? cs + 1 : cs;
      if (cs === state.totalSpaces) {
        state.hasNext = false;
      }
    },

    previousSpace: function(state) {
      const cs = state.currentSpace;
      state.currentSpace = state.totalSpaces < cs ? cs + 1 : cs;
      if (cs === 0) {
        state.hasPrevious = false;
      }
    }
  }
});

function createPhotoSphereSpace(photosphereUrl) {
  const sky = document.getElementById('sky');
  sky.setAttribute('material', 'src', API_ROOT + photosphereUrl);
}

function createVideoSphereSpace(videosphereUrl) {
  const videosphere = document.getElementById('videosphere');
  videosphere.setAttribute('material', 'src', API_ROOT + videosphereUrl);
}

AFRAME.registerComponent('cursor-listener', {
  init: function() {
    if (this.el.id === 'start') {
      this.el.addEventListener('click', function(evt) {
        document.getElementById('info-board').setAttribute('visible', false);
      });
    } else if (this.el.id === 'next') {
      this.el.addEventListener('click', function() {
        AFRAME.scenes[0].emit('nextSpace');
      });
    } else if (this.el.id === 'previous') {
      this.el.addEventListener('click', function() {
        AFRAME.scenes[0].emit('previousSpace');
      });
    }
  }
});

AFRAME.registerComponent('load-data', {
  init: function() {
    fetchProjectData(function(spaces) {
      const space = spaces[AFRAME.scenes[0].systems.state.state.currentSpace];
      const spaceType = space.type;
      if (spaceType === '360image') {
        const fields = space.fields;
        const photospheres = getValues(fields, 'type', 'photosphere');
        document
          .getElementById('template')
          .setAttribute(
            'template',
            'src',
            AFRAME.scenes[0].systems.state.state.templates[spaceType]
          );
        setTimeout(function() {
          createPhotoSphereSpace(photospheres[0].file.url);

          const text = getValues(fields, 'type', 'text');
          const titleElement = document.getElementById('title');
          titleElement.setAttribute('text', 'value', text[0].text_value);
        }, 10);
      } else if (spaceType === '360video') {
        const fields = space.fields;
        const videospheres = getValues(fields, 'type', 'videosphere');

        document
          .getElementById('template')
          .setAttribute(
            'template',
            'src',
            AFRAME.scenes[0].systems.state.state.templates[spaceType]
          );
        setTimeout(function() {
          createVideoSphereSpace(videospheres[0].file.url);
        }, 10);
        // const text = getValues(fields, 'type', 'text');
        // const titleElement = document.getElementById('title');
        // titleElement.setAttribute('text', 'value', text[0].text_value);
      }
    });
  }
});
