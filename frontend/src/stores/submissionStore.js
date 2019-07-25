import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class SubmissionStore {
  isLoading = false;
  submissionRegistry = new Map();
  activity = undefined;

  // prettier-ignore
  get submissions() {
    const submissionArray = [];
    for (let [key, value] of this.submissionRegistry) { // eslint-disable-line no-unused-vars
      submissionArray.push(value);
    }
    return submissionArray;
  }

  loadSubmissions(classroom_slug, activity_code) {
    this.isLoading = true;
    this.submissionRegistry.clear();
    return agent.Submission.all(classroom_slug, activity_code)
      .then(({ submissions, activity }) => {
        this.activity = activity;
        submissions.forEach(submission => {
          this.submissionRegistry.set(submission.id, submission);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  loadSubmissionsWithCode(activity_code) {
    this.isLoading = true;
    this.submissionRegistry.clear();
    return agent.Submission.allWithCode(activity_code)
      .then(({ submissions, activity }) => {
        this.activity = activity;
        submissions.forEach(submission => {
          this.submissionRegistry.set(submission.id, submission);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  toggleSubmissionApproval(code, submissionId) {
    return agent.Submission.toggleApproval(code, submissionId).then(
      submission => {
        this.submissionRegistry.set(submission.id, submission);
      }
    );
  }
}

decorate(SubmissionStore, {
  isLoading: observable,
  submissionRegistry: observable,
  submissions: computed,
  loadSubmissions: action,
  toggleSubmissionApproval: action
});

export const submissionStore = new SubmissionStore();

export default createContext(submissionStore);
