import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class OrgStore {
  isLoading = false;
  savingOrg = false;
  orgRegistry = new Map();

  // prettier-ignore
  get orgs() {
    const orgsArray = [];
    for (let [key, value] of this.orgRegistry) { // eslint-disable-line no-unused-vars
      orgsArray.push(value);
    }
    return orgsArray;
  }

  loadOrgs() {
    this.isLoading = true;
    this.orgRegistry.clear();
    return agent.Org.all()
      .then(({ schools }) => {
        schools.forEach(school => {
          this.orgRegistry.set(school.id, school);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  createOrg(name, type, country, region) {
    this.savingOrg = true;
    return agent.Org.create(name, type, country, region).finally(() => {
      this.savingOrg = false;
    });
  }
}

decorate(OrgStore, {
  isLoading: observable,
  savingOrg: observable,
  orgRegistry: observable,
  orgs: computed,
  loadOrgs: action,
  createOrg: observable
});

export const orgStore = new OrgStore();

export default createContext(orgStore);
