import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import UserStore from '../stores/userStore';
import ClassroomStore from '../stores/classroomStore';
import LoadingSpinner from '../components/LoadingSpinner';

const GCEDDashboard = observer(() => {
  const userStore = useContext(UserStore);
  const classroomStore = useContext(ClassroomStore);

  useEffect(() => {
    if (userStore.currentUser) {
      classroomStore.loadClassrooms();
    }
  }, [userStore.currentUser]);

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
                    to={`/classroom/${classroom.slug}/bubbles`}
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
            To use this feature, you need to be associated with an organization
            or school.
          </p>
          <Link
            to="/add-org"
            className="bg-navy bn br2 dib link pl3 pointer pr3 pv3 tc white"
          >
            Connect Organization
          </Link>
        </React.Fragment>
      )}
    </div>
  );
});

export default GCEDDashboard;
