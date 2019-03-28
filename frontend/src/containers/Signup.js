import React, { useContext, useEffect, useState } from 'react';
import AuthStore from '../stores/authStore';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import useRouter from '../components/useRouter';
import ErrorMessage from '../components/ErrorMessage';

const Signup = observer(() => {
  const authStore = useContext(AuthStore);
  const { history } = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nextUrl, setNextUrl] = useState('/dashboard');

  const { errors, inProgress } = authStore;

  useEffect(() => {
    if (authStore.isUserLoggedIn) {
      history.push(nextUrl);
    }
  }, []);

  const handleSubmitForm = event => {
    event.preventDefault();
    authStore.register(username, email, password).then(() => {
      history.push(nextUrl);
    });
  };

  return (
    <div className="bg-near-white center measure mb4 pb4 ph3">
      <h3 className="f3 f2-ns dark-gray tc">Sign up for an account</h3>
      <form onSubmit={handleSubmitForm}>
        <div className="mb3">
          <label htmlFor="email" className="b mid-gray">
            Email address
          </label>
          <input
            type="email"
            className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
            id="email"
            placeholder="Email"
            autoComplete="username"
            required
            value={email}
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mb3">
          <label htmlFor="username" className="b mid-gray">
            Username
          </label>
          <input
            type="text"
            className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
            id="username"
            placeholder="Username"
            autoComplete="username"
            required
            value={username}
            onChange={e => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="mb3">
          <label htmlFor="password" className="b mb1 mid-gray">
            Password
          </label>
          <input
            type="password"
            className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
            id="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="tr">
          <button
            type="submit"
            className="pt2 pr3 pb2 pl3 mb0 normal lh-title tc nowrap mt2 bn br2 white bg-navy pointer"
            // disabled={inProgress}
            // isLoading={inProgress}
          >
            Sign Up
          </button>
        </div>
      </form>
      <ErrorMessage errors={errors} />
    </div>
  );
});

export default Signup;
