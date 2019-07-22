import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class ActivityStore {
  isLoading = false;

  activityRegistry = new Map();

  // prettier-ignore
  get activities() {
    const activitiesArray = [];
    for (let [key, value] of this.activityRegistry) { // eslint-disable-line no-unused-vars
      activitiesArray.push(value);
    }
    return activitiesArray;
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

  createActivity(classroom_slug, activity_type_id) {
    return agent.Activity.create(classroom_slug, activity_type_id);
  }
}

decorate(ActivityStore, {
  isLoading: observable,
  activityRegistry: observable,
  activities: computed,
  loadActivities: action,
  createActivity: action
});

export const activityStore = new ActivityStore();

export default createContext(activityStore);
