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


const stores = {
  userStore,
  commonStore,
  profileStore,
  authStore
};

// For easier debugging
window._____APP_STATE_____ = stores;


promiseFinally.shim();
 
ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
