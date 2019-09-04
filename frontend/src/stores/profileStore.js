import { createContext } from 'react';
import { action, decorate, observable } from 'mobx';
import agent from '../agent';
import { userStore } from './userStore';

class ProfileStore {
  profile = undefined;
  isLoadingProfile = false;

  loadProfile(username) {
    this.isLoadingProfile = true;
    agent.Profile.get(username)
      .then(({ profile }) => {
        this.profile = profile;
      })
      .finally(() => {
        this.isLoadingProfile = false;
      });
  }

  saveSchool(school_id) {
    return agent.Profile.saveSchool(school_id).then(() => {
      userStore.currentUser.school_id = school_id;
    });
  }

  follow() {
    if (this.profile && !this.profile.following) {
      this.profile.following = true;
      agent.Profile.follow(this.profile.username).catch(() => {
        this.profile.following = false;
      });
    }
  }

  unfollow() {
    if (this.profile && this.profile.following) {
      this.profile.following = false;
      agent.Profile.unfollow(this.profile.username).catch(() => {
        this.profile.following = true;
      });
    }
  }
}

decorate(ProfileStore, {
  profile: observable,
  isLoadingProfile: observable,
  loadProfile: action,
  follow: action,
  unfollow: action
});

export default createContext(new ProfileStore());
