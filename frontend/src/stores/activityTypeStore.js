import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class ActivityTypeStore {
  isLoading = false;
  activityTypeRegistry = new Map();

  // prettier-ignore
  get activityTypes() {
    const activtyTypesArray = [];
    for (let [key, value] of this.activityTypeRegistry) { // eslint-disable-line no-unused-vars
      activtyTypesArray.push(value);
    }
    return activtyTypesArray;
  }

  loadActivityTypes() {
    this.isLoading = true;
    this.activityTypeRegistry.clear();
    return agent.ActivityType.all()
      .then(({ activityTypes }) => {
        activityTypes.forEach(activityType => {
          this.activityTypeRegistry.set(activityType.slug, activityType);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}

decorate(ActivityTypeStore, {
  isLoading: observable,
  activityTypeRegistry: observable,
  activityTypes: computed,
  loadActivityTypes: action
});

export const activityTypeStore = new ActivityTypeStore();

export default createContext(activityTypeStore);
