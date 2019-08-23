import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class SchoolStore {
  isLoading = false;
  savingSchool = false;
  schoolRegistry = new Map();

  // prettier-ignore
  get schools() {
    const schoolsArray = [];
    for (let [key, value] of this.schoolRegistry) { // eslint-disable-line no-unused-vars
      schoolsArray.push(value);
    }
    return schoolsArray;
  }

  loadSchools() {
    this.isLoading = true;
    this.schoolRegistry.clear();
    return agent.School.all()
      .then(({ schools }) => {
        schools.forEach(school => {
          this.schoolRegistry.set(school.id, school);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  createSchool(name, country, region) {
    this.savingSchool = true;
    return agent.School.create(name, country, region)
      .then(school => {
        this.schoolRegistry.set(school.id, school);
      })
      .finally(() => {
        this.savingSchool = false;
      });
  }
}

decorate(SchoolStore, {
  isLoading: observable,
  savingSchool: observable,
  schoolRegistry: observable,
  schools: computed,
  loadSchools: action,
  createSchool: observable
});

export const schoolStore = new SchoolStore();

export default createContext(schoolStore);
