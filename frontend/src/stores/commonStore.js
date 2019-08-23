import { createContext } from 'react';
import { action, reaction, decorate, observable } from 'mobx';

class CommonStore {
  appName = 'RemixVR';
  token = window.localStorage.getItem('jwt');
  appLoaded = false;
  setAppLoaded() {
    this.appLoaded = true;
  }
  setToken(token) {
    this.token = token;
  }

  snackMessage = {
    title: null,
    message: null,
    type: '',
    insert: '',
    container: 'bottom-right',
    dismiss: { duration: 2000 },
    dismissable: { click: true }
  };

  setSnackMessage(
    title = null,
    message = null,
    type = 'success',
    insert = 'bottom',
    container = 'bottom-center',
    duration = 3000,
    dismissable = true
  ) {
    this.snackMessage = {
      title,
      message,
      type,
      insert,
      container,
      dismiss: { duration },
      dismissible: { click: dismissable }
    };
  }

  constructor() {
    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    );
  }
}

decorate(CommonStore, {
  appName: observable,
  token: observable,
  appLoaded: observable,
  setAppLoaded: action,
  setToken: action,
  snackMessage: observable,
  setSnackMessage: action
});

export const commonStore = new CommonStore();

export default createContext(commonStore);
