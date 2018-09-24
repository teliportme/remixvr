import { action, extendObservable, reaction } from 'mobx';

class CommonStore {

  constructor() {
    extendObservable(this, {
      appName: 'RemixVR',
      token: window.localStorage.getItem('jwt'),
      appLoaded: false,
      
    });

    reaction(
      () => this.token,
      token => {
        if (token) {
          window.localStorage.setItem('jwt', token);
        } else {
          window.localStorage.removeItem('jwt');
        }
      }
    )
  }
}

export default new CommonStore();
