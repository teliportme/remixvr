import React, { useContext, useEffect, useState } from 'react';
import AuthStore from '../../stores/authStore';
import UserStore from '../../stores/userStore';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import useRouter from '../../components/useRouter';
import ErrorMessage from '../../components/ErrorMessage';
import UnlockImg from './unlock-monochrome.svg';
import { IoIosEye } from 'react-icons/io';
import { IoIosEyeOff } from 'react-icons/io';
import SavingButton from '../../components/SavingButton';

const Signup = observer(props => {
  const authStore = useContext(AuthStore);
  const userStore = useContext(UserStore);
  const { history } = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nextUrl] = useState('/add-org');
  const [showPassword, setShowPassword] = useState(false);

  const urlParams = new URLSearchParams(props.location.search);
  const isGCED = urlParams.get('gc') === 't';

  const { errors } = authStore;

  useEffect(() => {
    if (authStore.isUserLoggedIn && !isGCED) {
      history.push(nextUrl);
    } else if (authStore.isUserLoggedIn && isGCED) {
      userStore
        .updateUser({ gced_enabled: true })
        .then(() => history.push(`/gced-dashboard`));
    }
    window.localStorage.removeItem('gced-signup');
    if (isGCED) {
      window.localStorage.setItem('gced-signup', true);
    }
  }, []);

  const handleSubmitForm = event => {
    event.preventDefault();
    if (password !== confirmPassword) {
      authStore.setError('Passwords do not match');
      return;
    }
    authStore.register(username, email, password).then(() => {
      history.push(nextUrl);
    });
  };

  return (
    <div className="cf h-100">
      <div className="bg-light-gray fl w-100 w-50-ns h-25 h-100-ns flex justify-center items-center">
        <img src={UnlockImg} className="h-75 h-50-ns w-90" alt="signup" />
      </div>
      <div className="w-100 w-50-ns fl h-100 flex-ns items-center">
        <div className="center w-100 w-70-l w-90-m mb4 pb4 ph3">
          <Helmet>
            <title>Sign Up</title>
          </Helmet>
          <h3 className="f3 f1-ns dark-gray tc">Sign up for an account</h3>
          <form onSubmit={handleSubmitForm}>
            <div className="mb3">
              <label htmlFor="email" className="b mid-gray">
                Email address
              </label>
              <input
                type="email"
                className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
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
                className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
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
                className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
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
            <div className="mb3">
              <label
                htmlFor="confirmpassword"
                className="b mb1 mid-gray fl mr2"
              >
                Confirm Password
              </label>
              {showPassword ? (
                <IoIosEye
                  className="fl pointer"
                  style={{ width: '1.2em', height: '1.2em' }}
                  fill="#555"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              ) : (
                <IoIosEyeOff
                  className="fl pointer"
                  style={{ width: '1.2em', height: '1.2em' }}
                  fill="#555"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                />
              )}
              <input
                type={showPassword ? 'text' : 'password'}
                className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
                id="confirmpassword"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                }}
              />
            </div>
            <div className="tr">
              <SavingButton
                type="submit"
                className="pr3 pv3 pl3 mb0 normal lh-title tc nowrap mt2 bn br2 white bg-navy pointer"
                disabled={authStore.inProgress}
                isLoading={authStore.inProgress}
              >
                Sign Up
              </SavingButton>
            </div>
          </form>
          <ErrorMessage errors={errors} />
        </div>
      </div>
    </div>
  );
});

export default Signup;
