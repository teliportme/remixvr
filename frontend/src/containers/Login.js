import React, { useContext, useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import AuthStore from '../stores/authStore';
import useRouter from '../components/useRouter';
import ErrorMessage from '../components/ErrorMessage';
import { Helmet } from 'react-helmet';

const Login = observer(() => {
  const authStore = useContext(AuthStore);
  const router = useRouter();

  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [nextUrl] = useState('/dashboard');

  const { errors } = authStore;

  useEffect(() => {
    if (authStore.isUserLoggedIn) {
      router.history.push(nextUrl);
    }
  }, []);

  const handleSubmitForm = event => {
    event.preventDefault();
    authStore.login(userid, password).then(() => {
      router.history.push(nextUrl);
    });
  };

  return (
    <div className="bg-near-white center measure mb4 pb4 ph3">
      <Helmet title="Login" />
      <h3 className="f3 f2-ns dark-gray tc">Log in to your account</h3>
      <form onSubmit={handleSubmitForm}>
        <div className="mb3">
          <label htmlFor="userid" className="b mid-gray">
            Username / Email address
          </label>
          <input
            type="text"
            className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 ba br2 w-100"
            id="userid"
            placeholder="Username / Email"
            autoComplete="username"
            required
            value={userid}
            onChange={e => {
              setUserid(e.target.value);
            }}
          />
        </div>
        <div className="mb3">
          <label htmlFor="password" className="b mb1 mid-gray">
            Password
          </label>
          <input
            type="password"
            className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 ba br2 w-100"
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
        {/* <div className="tl fl mt2">
          <Link
            to="/forgot-password"
            className="f6 db link silver underline-hover"
          >
            Forgot the password?
          </Link>
          <Link to="/signup" className="f6 db link mt1 silver underline-hover">
            Need an account?
          </Link>
        </div> */}
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
      <ErrorMessage errors={errors} />
    </div>
  );
});

export default Login;
