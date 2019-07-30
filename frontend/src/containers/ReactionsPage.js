import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ActivityStore from '../stores/activityStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';

const Reactions = observer(props => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadReactions(
      props.match.params.classSlug,
      props.match.params.code
    );
  }, []);

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Classroom Activities" />
      <h2 className="fw7 f2">Reactions</h2>
      {activityStore.reactions.length > 0 ? (
        <ul className="list pl0 ml0 mw6 bn">
          {activityStore.reactions.map(activity => (
            <li key={activity.code} className="bt pt3 b--light-green">
              <Link
                to={`/activity/view?code=${activity.code}`}
                className="db f3 fw7 link near-black pt2"
                target="_blank"
              >
                Reaction from {activity.classroom.school.country},{' '}
                {activity.classroom.school.region}
              </Link>
              <div className="dark-gray mt2">
                {activity.classroom.school.name}
              </div>
              <span className="db f6 gray pv2 truncate">
                {dayjs(activity.created_at).format('MMM D, YYYY')} |{' '}
                {activity.submissions_count} submissions
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="lh-copy mt3 dark-gray">No reactions yet!</div>
      )}
    </div>
  );
});

export default Reactions;
