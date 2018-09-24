import { action, extendObservable } from 'mobx';
import agent from '../agent';
import userStore from './userStore';
import commonStore from './commonStore';

class AuthStore {

  constructor() {
    extendObservable(this, {
      inProgress: false,
      errors: undefined,
      values: {
        username: '',
        email: '',
        password: ''
      },
      setUsername: action(username => this.values.username = username),
      setEmail: action(email => this.values.email = email),
      setPassword: action(password => this.values.password = password),
      reset: action(() => {
        this.values.username = '';
        this.values.email = '';
        this.values.password = '';
        this.errors = undefined;
      }),
      clearPassword: action(() => {
        this.values.password = '';
      }),
      login: action(() => {
        this.inProgress = true;
        this.errors = undefined;
        return agent.Auth.login(this.values.email, this.values.password)
        .then(({ user }) => commonStore.setToken(user.token))
        .then(() => userStore.pullUser())
        .catch(action(error => {
          this.errors = error.response && error.response.body && error.response.body.errors;
          throw error;
        }))
        .finally(action(() => { this.inProgress = false; }));
      }),
      register: action(() => {
        this.inProgress = true;
        this.errors = undefined;
        return agent.Auth.register(this.values.username, this.values.email, this.values.password)
          .then(({ user }) => commonStore.setToken(user.token))
          .then(() => userStore.pullUser())
          .catch(action(error => {
            this.errors = error.response && error.response.body && error.response.body.errors;
            throw error;
          }))
          .finally(action(() => { this.inProgress = false; }));
      }),
      logout: action(() => {
        commonStore.setToken(undefined);
        userStore.forgetUser();
        return Promise.resolve();
      })
    })
  }
}

export default new AuthStore();
