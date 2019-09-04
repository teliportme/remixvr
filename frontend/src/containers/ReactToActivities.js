import React, { useContext, useEffect } from 'react';
import ActivityStore from '../stores/activityStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';

const ReactToActivities = observer(props => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadAllActivitiesForReactions();
  }, []);

  const createReactActivity = activity => {
    activityStore
      .createActivity(
        props.match.params.classSlug,
        'reaction',
        activity.activity_type.id,
        activity.id
      )
      .then(activity => {
        props.history.push(
          `/classroom/${props.match.params.classSlug}/activity/${activity.code}`
        );
      });
  };

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="React To Activities" />
      {activityStore.activities.length > 0 ? (
        <ul className="list pl0 ml0 mw6 bn">
          {activityStore.activities.map(activity => (
            <li key={activity.code} className="bt pt3 b--light-green">
              <div>
                <div className="b f3 mb2">
                  {activity.classroom.school.country}
                </div>
                <div className="dark-gray f4 mb1">
                  {activity.classroom.school.region}
                </div>
                <div className="gray i">
                  Type: {activity.activity_type.title}
                </div>
              </div>
              <button
                onClick={createReactActivity.bind(null, activity)}
                className="b--dark-blue bb bg-blue bl-0 br-0 br2 bt-0 bw2 dib dim f5 link mv3 mt3 ph3 pv2 white pointer"
              >
                React To This
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="lh-copy mt3 dark-gray">No activities to react to!</div>
      )}
    </div>
  );
});

export default ReactToActivities;
