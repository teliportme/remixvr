import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import { authStore } from './stores/authStore';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  getTheme: slug =>
    requests.get(`/projects/${slug}/theme`),
  remix: (slug, data) =>
    requests.post(`/projects/${slug}/remix`, data),
  search: term =>
    requests.get(`/projects/search/${term}`)
}

// prettier-ignore
const Field = {
  create: formData =>
    requests.post('/fields', formData),
  edit: (fieldId, formData) =>
    requests.put(`/fields/${fieldId}`, formData)
}

// prettier-ignore
const Space = {
  allSpaces: slug =>
     requests.get(`/projects/${slug}/spaces`),
  create: (slug, type) =>
    requests.post(`/spaces`, { project_slug: slug, type }),
  delete: spaceId =>
    requests.del(`/spaces/${spaceId}`)
}

// prettier-ignore
const Theme = {
  all: () =>
    requests.get('/themes')
}

// prettier-ignore
const ActivityType = {
  all: () => requests.get('/activitytypes')
};

// prettier-ignore
const Activity = {
  all: classroom_slug =>
    requests.get(`/activities/classroom/${classroom_slug}`),
  create: (classroom_slug, activity_type_id, reaction_to_id) =>
    requests.post('/activity', {
      classroom_slug,
      activity_type_id,
      reaction_to_id
    }),
  allForReactions: () => requests.get('/activities'),
  getReactions: (classroom_slug, code) =>
    requests.get(
      `/activity/classroom/${classroom_slug}/activity/${code}/reactions`
    )
};

// prettier-ignore
const Classroom = {
  all: () =>
    requests.get('/classrooms'),
  create: classname => 
    requests.post(`/classroom`, { classname })
}

// prettier-ignore
const Submission = {
  all: (class_slug, code) =>
    requests.get(`/submission/classroom/${class_slug}/activity/${code}`),
  allWithCode: code =>
    requests.get(`/submission/activity/${code}`),
  toggleApproval: (code, submissionId) =>
    requests.post(`/submission/${submissionId}`, { code })
};

export default {
  Auth,
  Profile,
  Project,
  Space,
  Field,
  Theme,
  Activity,
  ActivityType,
  Classroom,
  Submission
};
