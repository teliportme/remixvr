import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import AuthStore from '../stores/authStore';
import UserStore from '../stores/userStore';
import CommonStore from '../stores/commonStore';
import { Link } from 'react-router-dom';
import useRouter from '../components/useRouter';
import { observer } from 'mobx-react-lite';

const Login = observer(() => {
  const authStore = useContext(AuthStore);
  const userStore = useContext(UserStore);
  const commonStore = useContext(CommonStore);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { errors, inProgress } = authStore;

  const [nextUrl, setNextUrl] = useState('/dashboard');
  useEffect(() => {
    if (authStore.isUserLoggedIn) {
      router.history.push(nextUrl);
    }

    return () => {
      authStore.reset();
    };
  });

  const handleSubmitForm = event => {
    event.preventDefault();
    authStore.login(email, password).then(() => {
      router.history.push(nextUrl);
    });
  };

  return (
    <div className="bg-near-white center measure mb4 pb4 ph3">
      <h3 className="f3 f2-ns dark-gray tc">Log in to your account</h3>
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
        <div className="tl fl mt2">
          <Link
            to="/forgot-password"
            className="f6 db link silver underline-hover"
          >
            Forgot the password?
          </Link>
          <Link
            to="/register"
            className="f6 db link mt1 silver underline-hover"
          >
            Need an account?
          </Link>
        </div>
        <div className="tr">
          <button
            type="submit"
            className="pt2 pr3 pb2 pl3 mb0 normal lh-title tc nowrap mt2 bn br2 white bg-navy pointer"
            // disabled={inProgress}
            // isLoading={inProgress}
          >
            Login
          </button>
        </div>
      </form>
      {/* <ErrorMessage errors={errors} /> */}
    </div>
  );
});

export default Login;
