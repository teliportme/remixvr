import React, { useContext, useEffect, useState, lazy, Suspense } from 'react';
import AuthStore from '../stores/authStore';
import SchoolStore from '../stores/schoolStore';
import CommonStore from '../stores/commonStore';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import useRouter from '../components/useRouter';
import ErrorMessage from '../components/ErrorMessage';
import styled from 'styled-components';
import Select from 'react-dropdown-select';
import ReactModal from 'react-modal';
import LoadingSpinner from '../components/LoadingSpinner';
const AddSchool = lazy(() => import('../components/AddSchool'));

const StyledSchoolSearch = styled(Select)`
  border: 1px solid #555 !important;
  border-radius: 0.25rem !important;
  min-height: 38px;
`;

const Signup = observer(() => {
  const authStore = useContext(AuthStore);
  const schoolStore = useContext(SchoolStore);
  const commonStore = useContext(CommonStore);
  const { history } = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nextUrl] = useState('/dashboard');
  const [isTeacher, setTeacher] = useState(true);
  const [showModal, setModal] = useState(false);
  const [selectedSchool, setSchool] = useState(null);

  const { errors } = authStore;

  useEffect(() => {
    schoolStore.loadSchools();
    if (authStore.isUserLoggedIn) {
      history.push(nextUrl);
    }
  }, []);

  const handleSubmitForm = event => {
    event.preventDefault();
    if (isTeacher && !selectedSchool) {
      commonStore.setSnackMessage(
        'School Not Selected',
        'Please mention the school you work for.',
        'danger'
      );
      return null;
    }
    const school_id = selectedSchool && isTeacher ? selectedSchool.id : null;
    authStore.register(username, email, password, school_id).then(() => {
      history.push(nextUrl);
    });
  };

  function closeModal() {
    setModal(false);
  }

  return (
    <div className="bg-near-white center measure mb4 pb4 ph3">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
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
        <label className="pointer">
          <input
            type="checkbox"
            name="check"
            className="mr2"
            checked={isTeacher}
            onChange={() => {
              setTeacher(!isTeacher);
            }}
          />
          {isTeacher ? (
            <span className="green b">I work at a school</span>
          ) : (
            <span className="blue b">I'm not associated with a school</span>
          )}
        </label>
        {isTeacher && (
          <div className="mb3 mt3">
            <label htmlFor="schoolname" className="b mid-gray">
              Select School{' '}
              <span
                className="f6 fr fw4 i underline gray pointer"
                onClick={() => {
                  setModal(true);
                }}
              >
                School not listed?
              </span>
            </label>
            <StyledSchoolSearch
              options={schoolStore.schools}
              placeholder="Search School"
              labelField="name_with_region"
              valueField="id"
              dropdownGap={10}
              onChange={val => {
                setSchool(val[0]);
              }}
              searchBy="name_with_region"
              loading={schoolStore.isLoading}
              className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100 f4"
            />
          </div>
        )}
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
      <ReactModal
        appElement={document.body}
        isOpen={showModal}
        className="absolute shadow-2 bg-white br2 outline-0 pa2 top-2 bottom-1 left-1 right-1 flex justify-center"
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        onRequestClose={closeModal}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <AddSchool closeModal={closeModal} />
        </Suspense>
      </ReactModal>
    </div>
  );
});

export default Signup;
