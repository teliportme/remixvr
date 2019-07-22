import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class SubmissionStore {
  isLoading = false;
  submissionRegistry = new Map();

  // prettier-ignore
  get submissions() {
    const submissionArray = [];
    for (let [key, value] of this.submissionRegistry) {// eslint-disable-line no-unused-vars
      submissionArray.push(value);
    }
    return submissionArray;
  }

  loadSubmissions(activity_code) {
    this.isLoading = true;
    this.submissionRegistry.clear();
    return agent.Submission.all(activity_code)
      .then(({ submissions }) => {
        submissions.forEach(submission => {
          this.submissionRegistry.set(submission.id, submission);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}

decorate(SubmissionStore, {
  isLoading: observable,
  submissionRegistry: observable,
  submissions: computed,
  loadSubmissions: action
});

export const submissionStore = new SubmissionStore();

export default createContext(submissionStore);
