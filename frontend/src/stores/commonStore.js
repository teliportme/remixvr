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
  setToken: action
});

export const commonStore = new CommonStore();

export default createContext(commonStore);
