import React, { useContext, useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import Select from 'react-dropdown-select';
import dayjs from 'dayjs';
import ReactModal from 'react-modal';
import styled from 'styled-components';
import UserStore from '../stores/userStore';
import ClassroomStore from '../stores/classroomStore';
import OrgStore from '../stores/orgStore';
import ProfileStore from '../stores/profileStore';
import CommonStore from '../stores/commonStore';
import LoadingSpinner from '../components/LoadingSpinner';
const AddSchool = lazy(() => import('../components/AddSchool'));

const StyledSchoolSearch = styled(Select)`
  border: 1px solid #555 !important;
  border-radius: 0.25rem !important;
  min-height: 38px;
`;

const GCEDDashboard = observer(() => {
  const userStore = useContext(UserStore);
  const classroomStore = useContext(ClassroomStore);
  const orgStore = useContext(OrgStore);
  const profileStore = useContext(ProfileStore);
  const commonStore = useContext(CommonStore);

  const [showSchool, setShowSchool] = useState(false);
  const [selectedSchool, setSchool] = useState(null);
  const [showModal, setModal] = useState(false);

  useEffect(() => {
    if (userStore.currentUser) {
      classroomStore.loadClassrooms();
    }
  }, [userStore.currentUser]);

  const showSchoolSearch = () => {
    setShowSchool(true);
    orgStore.loadOrgs();
  };

  function closeModal() {
    setModal(false);
  }

  const saveSchoolToProfile = event => {
    event.preventDefault();
    profileStore.saveSchool(selectedSchool.id).then(() => {
      commonStore.setSnackMessage(
        'School Added to your profile',
        'You can now use GCED tools.'
      );
    });
  };

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="GCED Dashboard" />
      <div className="b--dark-blue bb flex mb3">
        <Link
          className="b--black bw2 black f3 pb2 pt2 tc over-bg-light-gray link ph4"
          to="/dashboard"
        >
          My Projects
        </Link>
        <div className="b b--dark-blue dark-blue bw2 f3 h pb2 ph4 pt2 tc bb">
          GCED
        </div>
      </div>
      {userStore.currentUser.school_id ? (
        <React.Fragment>
          <h2 className="fw7 f2">My Classrooms</h2>
          <div>
            <Link
              to="/create-classroom"
              className="f5 link dim br2 ph3 pv2 mb2 dib white bg-blue bb bw2 b--dark-blue"
            >
              New Classroom
            </Link>
          </div>
          {classroomStore.isLoading ? (
            <LoadingSpinner />
          ) : classroomStore.classrooms.length > 0 ? (
            <ul className="list pl0 ml0 mw6 bn">
              {classroomStore.classrooms.map(classroom => (
                <li key={classroom.slug} className="bt pt3 b--light-green">
                  <Link
                    to={`/classroom/${classroom.slug}/activities`}
                    className="db f3 fw7 link near-black pt2"
                  >
                    {classroom.classname}
                  </Link>
                  <span className="db f6 gray pv2 truncate">
                    {dayjs(classroom.created_at).format('MMM D, YYYY')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="lh-copy mt3 dark-gray">
              You haven't created any classrooms yet!
            </div>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p className="f4">
            To use this feature, you need to be associated with a school.
          </p>
          {showSchool ? (
            <form onSubmit={saveSchoolToProfile}>
              <div className="pt3 w-100 w-30-l">
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
                  options={orgStore.schools}
                  placeholder="Search School"
                  labelField="name_with_region"
                  valueField="id"
                  dropdownGap={10}
                  onChange={val => {
                    setSchool(val[0]);
                  }}
                  searchBy="name_with_region"
                  loading={orgStore.isLoading}
                  className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100 f4"
                />
              </div>
              <button
                className="pt2 pr3 pb2 pl3 mb0 normal lh-title tc nowrap mt2 bn br2 white bg-navy pointer"
                type="submit"
              >
                Choose School
              </button>
            </form>
          ) : (
            <button
              className="f5 link dim br2 ph3 pv2 mb2 dib white bg-blue bb bt-0 bl-0 br-0 bw2 b--dark-blue pointer"
              onClick={() => {
                showSchoolSearch();
              }}
            >
              Connect School
            </button>
          )}
        </React.Fragment>
      )}
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

export default GCEDDashboard;
