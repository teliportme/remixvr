import { createContext, useContext } from 'react';
import { action, decorate, observable, computed } from 'mobx';
import agent from '../agent';
import { userStore } from './userStore';
import { commonStore } from './commonStore';

class AuthStore {
  inProgress = false;
  errors = undefined;

  get isUserLoggedIn() {
    const token = window.localStorage.getItem('jwt');
    return token;
  }

  reset() {
    this.errors = undefined;
  }

  login(email, password) {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth.login(email, password)
      .then(({ user }) => {
        commonStore.setToken(user.token);
      })
      .then(() => {
        userStore.pullUser();
      })
      .catch(error => {
        this.errors =
          error.response && error.response.body && error.response.body.errors;
        throw error;
      })
      .finally(() => {
        this.inProgress = false;
      });
  }
  register(username, email, password) {
    this.inProgress = true;
    this.errors = true;
    return agent.Auth.register(username, email, password)
      .then(({ user }) => {
        commonStore.setToken(user.token);
      })
      .then(() => {
        userStore.pullUser();
      })
      .catch(error => {
        this.errors =
          error.response && error.response.body && error.response.body.errors;
        throw error;
      })
      .finally(() => {
        this.inProgress = false;
      });
  }
  logout() {
    commonStore.setToken(undefined);
    userStore.forgetUser();
    return Promise.resolve();
  }
}

decorate(AuthStore, {
  inProgress: observable,
  errors: observable,
  setUsername: action,
  setEmail: action,
  setPassword: action,
  reset: action,
  clearPassword: action,
  login: action,
  register: action,
  logout: action,
  isUserLoggedIn: computed
});

export const authStore = new AuthStore();

export default createContext(authStore);
