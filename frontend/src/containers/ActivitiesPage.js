import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserStore from '../stores/userStore';
import ActivityStore from '../stores/activityStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';

const Activities = observer(props => {
  const userStore = useContext(UserStore);
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    if (userStore.currentUser) {
      activityStore.loadActivities(props.match.params.classSlug);
    }
  }, [userStore.currentUser]);

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="GCED Activities" />
      <h2 className="fw7 f2">My Activities</h2>
      <div>
        <Link
          to="/create-activity"
          className="f5 link dim br2 ph3 pv2 mb2 dib white bg-blue bb bw2 b--dark-blue"
        >
          New Activity
        </Link>
      </div>
      {activityStore.activities.length > 0 ? (
        <ul className="list pl0 ml0 mw6 bn">
          {activityStore.activities.map(activity => (
            <li key={activity.code} className="bt pt3 b--light-green">
              <Link
                to={`/classroom/${props.match.params.classSlug}/activity/${
                  activity.code
                }`}
                className="db f3 fw7 link near-black pt2"
              >
                {activity.activity_type.title}
              </Link>
              <span className="db f6 gray pv2 truncate">
                {dayjs(activity.created_at).format('MMM D, YYYY')}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="lh-copy mt3 dark-gray">
          You haven't created any activities yet!
        </div>
      )}
    </div>
  );
});

export default Activities;
