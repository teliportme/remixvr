import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import authStore from './stores/authStore';

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
  login: (email, password) =>
    requests.post('/users/login', { user: { email, password } }),
  register: (username, email, password) =>
    requests.post('/users', { user: { username, email, password } }),
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
const Theme = {
  get: (page, lim = 20) =>
    requests.get(`/themes?${limit(lim, page)}`),
  getTheme: slug =>
    requests.get(`/themes/${slug}`)
}

export default {
  Auth,
  Profile,
  Theme
};
