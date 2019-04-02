import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { authStore } from './stores/authStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:5000/api';

const handleErrors = error => {
  if (error && error.response && error.response.status === 401) {
    authStore.logout();
  }
  return error;
};

const responseBody = res => res.body;

const tokenPlugin = req => {
  const token = window.localStorage.getItem('jwt');
  if (token) {
    req.set('authorization', `Token ${token}`);
  }
};

const requests = {
  del: url =>
    superagent
      .del(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  get: url =>
    superagent
      .get(`${API_ROOT}${url}`)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  put: (url, body) =>
    superagent
      .put(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody),
  post: (url, body) =>
    superagent
      .post(`${API_ROOT}${url}`, body)
      .use(tokenPlugin)
      .end(handleErrors)
      .then(responseBody)
};

// prettier-ignore
const Auth = {
  current: () =>
    requests.get('/user'),
  login: (userid, password) =>
    requests.post('/users/login', { userid, password }),
  register: (username, email, password) =>
    requests.post('/users', { username, email, password }),
  save: user =>
    requests.put('/user', { user })
};

// prettier-ignore
const limit = (count, page) => `limit=${count}&offset=${page ? page * count : 0}`;

// prettier-ignore
const Profile = {
  follow: username =>
    requests.post(`/profiles/${username}/follow`),
  unfollow: username =>
    requests.del(`/profiles/${username}/follow`),
  get: username =>
    requests.get(`/profiles/${username}`)
};

// prettier-ignore
const Project = {
  all: (page, lim = 20) =>
    requests.get(`/projects?${limit(lim, page)}`),
  byAuthor: (username, page, lim=20) =>
    requests.get(`/projects?${limit(lim, page)}&author=${username}`),
  byFavorited: (username, page, lim=20) =>
    requests.get(`/projects?${limit(lim,page)}&favorited=${username}`),
  byTag: (tag, page, lim=20) =>
    requests.get(`/projects?${limit(lim, page)}$tag=${tag}`),
  get: slug =>
    requests.get(`/projects/${slug}`),
  edit: (slug, data) =>
    requests.put(`/projects/${slug}`, data),
  delete: slug =>
    requests.delete(`/projects/${slug}`),
  create: data =>
    requests.post('/projects', data),
  feed: (page, lim=20) =>
    requests.get(`/projects/feed?${limit(lim, page)}`),
  favorite: slug =>
    requests.post(`/projects/${slug}/favorite`),
  unfavorite: slug =>
    requests.delete(`/projects/${slug}/favorite`),
  fields: slug =>
    requests.get(`projects/${slug}/fields`)
}

export default {
  Auth,
  Profile,
  Project
};
