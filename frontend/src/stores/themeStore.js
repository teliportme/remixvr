import { createContext } from 'react';
import { observable, decorate, computed, action } from 'mobx';
import agent from '../agent';

class ThemeStore {
  isLoading = false;
  page = 0;
  count = 0;
  hasNextPage = 0;
  themeRegistry = new Map();

  // prettier-ignore
  get themes() {
    const themes = [];
    for (let [key, value] of this.themeRegistry) { // eslint-disable-line no-unused-vars
      themes.push(value);
    }
    return themes;
  }

  loadThemes() {
    this.isLoading = true;
    if (this.page === 0) {
      this.themeRegistry.clear();
    }
    return agent.Theme.all()
      .then(({ themes }) => {
        if (themes.length === 0) {
          this.hasNextPage = false;
          return;
        }
        themes.forEach(theme => {
          this.themeRegistry.set(theme.slug, theme);
        });
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}

decorate(ThemeStore, {
  isLoading: observable,
  page: observable,
  count: observable,
  hasNextPage: observable,
  themeRegistry: observable,
  themes: computed,
  loadThemes: action
});

export const themeStore = new ThemeStore();

export default createContext(themeStore);
