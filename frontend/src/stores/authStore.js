import { createContext } from 'react';
import { action, decorate, observable, computed } from 'mobx';
import agent from '../agent';
import { userStore } from './userStore';
import { commonStore } from './commonStore';

class AuthStore {
  inProgress = false;
  errors = undefined;

  get isUserLoggedIn() {
    const isUserLoggedIn = userStore.currentUser ? true : false;
    return isUserLoggedIn;
  }

  login(userid, password) {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth.login(userid, password)
      .then(({ user }) => {
        commonStore.setToken(user.token);
        userStore.setUser(user);
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
    this.errors = undefined;
    return agent.Auth.register(username, email, password)
      .then(({ user }) => {
        commonStore.setToken(user.token);
        userStore.setUser(user);
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
  clearPassword: action,
  login: action,
  register: action,
  logout: action,
  isUserLoggedIn: computed
});

export const authStore = new AuthStore();

export default createContext(authStore);
