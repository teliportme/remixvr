import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserStore from '../stores/userStore';
import ClassroomStore from '../stores/classroomStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';

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
      <h2 className="fw7 f2">My Classrooms</h2>
      <div>
        <Link
          to="/create-classroom"
          className="f5 link dim br2 ph3 pv2 mb2 dib white bg-blue bb bw2 b--dark-blue"
        >
          New Classroom
        </Link>
      </div>
      {classroomStore.classrooms.length > 0 ? (
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
    </div>
  );
});

export default GCEDDashboard;
