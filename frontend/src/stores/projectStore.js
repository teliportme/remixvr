import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class ProjectStore {
  isLoading = false;
  isLoadingSpaces = false;
  hasNextPage = true;
  count = 0;
  projectPage = 0;
  projectRegistry = new Map();
  predicate = {};
  spacesRegistry = new Map();
  projectTheme = undefined;

  get projects() {
    const projects = [];
    for (let [key, value] of this.projectRegistry) {
      projects.push(value);
    }
    return projects;
  }

  get spaces() {
    const spaces = [];
    for (let [key, value] of this.spacesRegistry) {
      spaces.push(value);
    }
    return spaces;
  }

  clear() {
    this.projectRegistry.clear();
    this.spacesRegistry.clear();
    this.projectPage = 0;
    this.hasNextPage = true;
    this.projectTheme = undefined;
    this.count = 0;
  }

  setPage(page) {
    this.projectPage = page;
  }

  setPredicate(predicate) {
    if (JSON.stringify(predicate) === JSON.stringify(this.predicate)) return;
    this.clear();
    this.predicate = predicate;
  }

  $req() {
    if (this.predicate.myFeed) return agent.Project.feed(this.projectPage);
    if (this.predicate.favoritedBy)
      return agent.Project.byFavorited(
        this.predicate.favoritedBy,
        this.projectPage
      );
    if (this.predicate.tag)
      return agent.Project.byTag(this.predicate.tag, this.projectPage);
    if (this.predicate.author)
      return agent.Project.byAuthor(this.predicate.author, this.projectPage);
    return agent.Project.all(this.projectPage);
  }

  loadProjects() {
    this.isLoading = true;
    if (this.projectPage === 0) {
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

  loadProject(slug) {
    this.isLoading = true;
    const exsistingProject = this.projectRegistry.get(slug);
    if (exsistingProject) return Promise.resolve(exsistingProject);

    return agent.Project.get(slug).then(({ project }) => {
      this.projectRegistry.set(project.slug, project);
      return project;
    });
  }

  loadSpaces(slug) {
    this.isLoadingSpaces = true;
    return agent.Space.allSpaces(slug)
      .then(spaces => {
        spaces.forEach(space => {
          this.spacesRegistry.set(space.id, space);
        });
      })
      .finally(() => {
        this.isLoadingSpaces = false;
      });
  }

  createSpace(slug) {
    return agent.Space.create(slug).then(space => {
      this.spacesRegistry.set(space.id, space);
      return space;
    });
  }

  getProjectTheme(slug) {
    if (this.projectTheme) return this.projectTheme;
    return agent.Project.getTheme(slug).then(({ theme }) => {
      this.projectTheme = theme;
      return theme;
    });
  }
}

decorate(ProjectStore, {
  isLoading: observable,
  isLoadingSpaces: observable,
  hasNextPage: observable,
  count: observable,
  projectPage: observable,
  projectRegistry: observable,
  spacesRegistry: observable,
  projects: observable,
  predicate: observable,
  projectTheme: observable,

  projects: computed,
  spaces: computed,
  setPage: action,
  setPredicate: action,
  loadProjects: action,
  loadProject: action,
  loadSpaces: action,
  createSpace: action,
  getProjectTheme: action
});

export const projectStore = new ProjectStore();

export default createContext(projectStore);
