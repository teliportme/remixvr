import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class ActivityStore {
  isLoading = false;
  isCreatingActivity = false;
  activityRegistry = new Map();
  reactionsRegistry = new Map();

  // prettier-ignore
  get activities() {
    const activitiesArray = [];
    for (let [key, value] of this.activityRegistry) { // eslint-disable-line no-unused-vars
      activitiesArray.push(value);
    }
    return activitiesArray;
  }

  // prettier-ignore
  get reactions() {
    const reactionsArray = [];
    for (let [key, value] of this.reactionsRegistry) { // eslint-disable-line no-unused-vars
      reactionsArray.push(value);
    }
    return reactionsArray;
  }

  loadActivities(classroom_slug) {
    this.isLoading = true;
    this.activityRegistry.clear();
    return agent.Activity.all(classroom_slug)
      .then(({ activities }) => {
        activities.forEach(activity => {
          this.activityRegistry.set(activity.code, activity);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  loadAllActivitiesForReactions() {
    this.isLoading = true;
    this.activityRegistry.clear();
    return agent.Activity.allForReactions()
      .then(({ activities }) => {
        activities.forEach(activity => {
          this.activityRegistry.set(activity.code, activity);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  loadReactions(classroom_slug, code) {
    this.isLoading = true;
    this.reactionsRegistry.clear();
    return agent.Activity.getReactions(classroom_slug, code)
      .then(({ activities }) => {
        activities.forEach(activity => {
          this.reactionsRegistry.set(activity.code, activity);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  createActivity(
    classroom_slug,
    activity_name,
    activity_type_id,
    reaction_to_id
  ) {
    this.isCreatingActivity = true;
    return agent.Activity.create(
      classroom_slug,
      activity_name,
      activity_type_id,
      reaction_to_id
    ).finally(() => {
      this.isCreatingActivity = false;
    });
  }
}

decorate(ActivityStore, {
  isLoading: observable,
  activityRegistry: observable,
  reactionsRegistry: observable,
  reactions: computed,
  activities: computed,
  loadActivities: action,
  createActivity: action,
  loadAllActivitiesForReactions: action,
  loadReactions: action
});

export const activityStore = new ActivityStore();

export default createContext(activityStore);
