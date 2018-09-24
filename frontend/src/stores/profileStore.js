import { action, extendObservable } from 'mobx';
import agent from '../agent';

class ProfileStore {

  constructor() {
    extendObservable(this, {
      profile: undefined,
      isLoadingProfile: false,

      loadProfile: action(username => {
        this.isLoadingProfile = true;
        agent.Profile.get(username)
          .then(action(({ profile }) => { this.profile = profile; }))
          .finally(action(() => { this.isLoadingProfile = false; }));
      }),

      follow: action(() => {
        if (this.profile && !this.profile.following) {
          this.profile.following = true;
          agent.Profile.follow(this.profile.username)
            .catch(action(() => { this.profile.following = false; }));
        }
      }),

      unfollow: action(() => {
        if (this.profile && this.profile.following) {
          this.profile.following = false;
          agent.Profile.unfollow(this.profile.username)
            .catch(action(() => { this.profile.following = true; }));
        }
      })
    });
  }
}

export default new ProfileStore();
