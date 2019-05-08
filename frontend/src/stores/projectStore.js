import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class ProjectStore {
  isLoading = false;
  hasNextPage = true;
  count = 0;
  page = 0;
  projectRegistry = new Map();
  predicate = {};

  get projects() {
    const projects = [];
    console.log('here');
    for (let [key, value] of this.projectRegistry) {
      projects.push(value);
    }
    return projects;
  }

  clear() {
    this.projectRegistry.clear();
    this.page = 0;
    this.hasNextPage = true;
  }

  setPage(page) {
    this.page = page;
  }

  setPredicate(predicate) {
    if (JSON.stringify(predicate) === JSON.stringify(this.predicate)) return;
    this.clear();
    this.predicate = predicate;
  }

  $req() {
    if (this.predicate.myFeed) return agent.Project.feed(this.page);
    if (this.predicate.favoritedBy)
      return agent.Project.byFavorited(this.predicate.favoritedBy, this.page);
    if (this.predicate.tag)
      return agent.Project.byTag(this.predicate.tag, this.page);
    if (this.predicate.author)
      return agent.Project.byAuthor(this.predicate.author, this.page);
    return agent.Project.all(this.page);
  }

  loadProjects() {
    this.isLoading = true;
    if (this.page === 0) {
      this.projectRegistry.clear();
    }
    return this.$req()
      .then(({ projects, projectsCount }) => {
        if (projects.length === 0) {
          this.hasNextPage = false;
          return;
        }
        this.count = projectsCount;
        projects.forEach(project => {
          this.projectRegistry.set(project.slug, project);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}

decorate(ProjectStore, {
  isLoading: observable,
  hasNextPage: observable,
  count: observable,
  page: observable,
  projectRegistry: observable,
  projects: observable,
  predicate: observable,
  projects: computed,
  setPage: action,
  setPredicate: action,
  loadProjects: action
});

export const projectStore = new ProjectStore();

export default createContext(projectStore);
