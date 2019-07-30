import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import promiseFinally from 'promise.prototype.finally';
// import registerServiceWorker from './registerServiceWorker';

import userStore from './stores/userStore';
import commonStore from './stores/commonStore';
import profileStore from './stores/profileStore';
import authStore from './stores/authStore';
import projectStore from './stores/projectStore';
import themeStore from './stores/themeStore';
import activityStore from './stores/activityStore';
import activityTypeStore from './stores/activityTypeStore';
import classroomStore from './stores/classroomStore';
import submissionStore from './stores/submissionStore';

const stores = {
  userStore,
  commonStore,
  profileStore,
  authStore,
  projectStore,
  themeStore,
  activityStore,
  activityTypeStore,
  classroomStore,
  submissionStore
};

// For easier debugging
// window._____APP_STATE_____ = stores;

promiseFinally.shim();

const render = Component => {
  return ReactDOM.render(<Component />, document.getElementById('root'));
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}
// registerServiceWorker();
