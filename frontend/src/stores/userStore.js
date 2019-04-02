import { action, decorate, observable } from 'mobx';
import { createContext } from 'react';
import agent from '../agent';

class UserStore {
  currentUser = undefined;
  loadingUser = false;
  updatingUser = false;
  updatingUserErrors = false;

  pullUser() {
    this.loadingUser = true;
    return agent.Auth.current()
      .then(({ user }) => {
        this.currentUser = user;
      })
      .finally(() => {
        this.loadingUser = false;
      });
  }

  updateUser(newUser) {
    this.updatingUser = true;
    return agent.Auth.save(newUser)
      .then(response => {
        this.currentUser = response.user;
      })
      .finally(() => {
        this.updatingUser = false;
      });
  }

  forgetUser() {
    this.currentUser = undefined;
  }
}

decorate(UserStore, {
  currentUser: observable,
  loadingUser: observable,
  updatingUser: observable,
  updatingUserErrors: observable,
  pullUser: action,
  updateUser: action,
  forgetUser: action
});

export const userStore = new UserStore();

export default createContext(userStore);
