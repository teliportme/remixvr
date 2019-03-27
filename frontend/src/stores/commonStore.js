import { createContext } from 'react';
import { action, reaction, decorate, observable } from 'mobx';

export class CommonStore {
  appName = 'RemixVR';
  token = window.localStorage.getItem('jwt');
  appLoaded = false;
  setAppLoaded() {
    this.appLoaded = true;
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
  setAppLoaded: action
});

export default createContext(new CommonStore());
