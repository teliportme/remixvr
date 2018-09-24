import { action, extendObservable } from 'mobx';
import commonStore from './commonStore';
import agent from '../agent';

class UserStore {

  constructor() {
    extendObservable(this, {
      currentUser: undefined,
      loadingUser: false,
      updatingUser: false,
      updatingUserErrors: '',

      pullUser: action(() => {
        this.loadingUser = true;
        return agent.Auth.current()
          .then(action(({ user }) => { this.currentUser = user; }))
          .finally(action(() => { this.loadingUser = false; }));
      }),

      updateUser: action(newUser => {
        this.updatingUser = true;
        return agent.Auth.save(newUser)
          .then(action(({ user }) => { this.currentUser = user; }))
          .finally(action(() => { this.updatingUser = false; }));
      }),

      forgetUser() {
        this.currentUser = undefined;
      }
    })
  }
}

export default new UserStore();