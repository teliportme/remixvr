import AFRAME from 'aframe';
import 'aframe-template-component';
import { fetchProjectData, getValues, API_ROOT } from './remixvr';
import 'aframe-state-component';
import 'aframe-layout-component';

AFRAME.registerState({
  initialState: {
    currentSpace: 0,
    hasNext: true,
    hasPrevious: false,
    totalSpaces: 0,
    templates: {
      '360image': '#image360',
      '360video': '#video360'
    }
  },

  handlers: {
    nextSpace: function(state) {
      const cs = state.currentSpace;
      state.currentSpace = state.totalSpaces > cs ? cs + 1 : cs;

      setupSpace();

      // hide next button if current space is last one
      if (state.currentSpace === state.totalSpaces) {
        state.hasNext = false;
      } else {
        state.hasNext = true;
      }
      if (state.currentSpace <= state.totalSpaces && state.currentSpace !== 0) {
        state.hasPrevious = true;
      }
    },

    previousSpace: function(state) {
      const cs = state.currentSpace;
      state.currentSpace = cs > 0 ? cs - 1 : cs;

      setupSpace();
      if (state.currentSpace === 0) {
        state.hasPrevious = false;
      } else if (state.currentSpace <= state.totalSpaces) {
        state.hasPrevious = true;
      }
      if (state.totalSpaces > 0 && state.currentSpace === 0) {
        state.hasNext = true;
      }
    }
  }
});

function setupSpace() {
  var maskEl = document.querySelector('#mask');
  fetchProjectData(function(spaces) {
    const spaceLength = spaces.length - 1; // zero index
    AFRAME.scenes[0].systems.state.state.totalSpaces = spaceLength;
    if (spaceLength === 0) {
      AFRAME.scenes[0].systems.state.state.hasNext = false;
    }
    document.getElementById('video-element') &&
      document.getElementById('video-element').pause();
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
        maskEl.emit('fade');
      }, 200);
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
        maskEl.emit('fade');
      }, 200);
      // const text = getValues(fields, 'type', 'text');
      // const titleElement = document.getElementById('title');
      // titleElement.setAttribute('text', 'value', text[0].text_value);
    }
  });
}

function createVideoEl(src) {
  var videoEl = document.getElementById('video-element');
  if (!videoEl) {
    var videoEl = document.createElement('video');
    videoEl.id = 'video-element';
    videoEl.width = 0;
    videoEl.height = 0;
    // Support inline videos for iOS webviews.
    videoEl.setAttribute('playsinline', '');
    videoEl.setAttribute('webkit-playsinline', '');
    videoEl.autoplay = true;
    videoEl.loop = true;
    videoEl.crossOrigin = 'anonymous';
    videoEl.addEventListener(
      'error',
      function() {
        warn('`$s` is not a valid video', src);
      },
      true
    );
  }
  videoEl.src = src;
  AFRAME.scenes[0].appendChild(videoEl);
  return videoEl;
}

function createPhotoSphereSpace(photosphereUrl) {
  const sky = document.getElementById('sky');
  sky.setAttribute('material', 'src', API_ROOT + photosphereUrl);
}

function createVideoSphereSpace(videosphereUrl) {
  createVideoEl(API_ROOT + videosphereUrl);
  const videosphere = document.getElementById('videosphere');
  videosphere.setAttribute('src', '#video-element');
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
    setupSpace();
  }
});
