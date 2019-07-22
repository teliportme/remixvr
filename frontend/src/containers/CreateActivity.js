import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import ActivityTypeStore from '../stores/activityTypeStore';
import ActivityStore from '../stores/activityStore';
import FieldLabel from '../components/FieldLabel';
import FieldInput from '../components/FieldInput';

const CreateActivity = observer(({ history, match }) => {
  const activityTypeStore = useContext(ActivityTypeStore);
  const activityStore = useContext(ActivityStore);

  const [selectedActivityType, setActivityType] = useState();

  useEffect(() => {
    activityTypeStore.loadActivityTypes();
  }, []);

  const handleSubmitForm = event => {
    event.preventDefault();
    activityStore
      .createActivity(match.params.classSlug, selectedActivityType)
      .then(activity => {
        console.log(activity);
        history.push(
          `/classroom/${match.params.classSlug}/activity/${activity.code}`
        );
      });
  };

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Create Activity" />
      <form onSubmit={handleSubmitForm}>
        <section className="w-50-l w-100">
          <h3 className="f2">Create New Activity</h3>
          <FieldLabel htmlFor="activity" className="b mid-gray mt3 db">
            Select Activity
          </FieldLabel>
          <FieldInput>
            {activityTypeStore.activityTypes.map(activityType => (
              <article
                key={activityType.id}
                className="br2 ba dark-gray b--black-10 mv4 w-50 mw5"
              >
                <div className="pa2 ph3-ns pb3-ns bg-white tc">
                  <div className="dt w-100 mt1">
                    <div className="dtc">
                      <h1 className="f5 f4-ns mv0">{activityType.title}</h1>
                    </div>
                    <div className="dtc tr" />
                  </div>
                  {activityType.id === selectedActivityType ? (
                    <button
                      onClick={event => {
                        event.preventDefault();
                        setActivityType('');
                      }}
                      className="bg-dark-green b--green bb bl-0 br-0 br1 br2 bt-0 bw2 dib f6 link mb2 pv1 white pointer mt4"
                    >
                      Activity Selected
                    </button>
                  ) : (
                    <button
                      onClick={event => {
                        event.preventDefault();
                        setActivityType(activityType.id);
                      }}
                      className="b--dark-green bb bg-green bl-0 br-0 br1 br2 bt-0 bw2 dib f6 link mb2 pv1 white pointer mt4"
                    >
                      Use Activity
                    </button>
                  )}
                </div>
              </article>
            ))}
          </FieldInput>
        </section>
        <div className="tc tl-ns">
          <button
            type="submit"
            className="b--dark-blue bb bg-blue bl-0 br-0 br2 bt-0 bw2 lh-title mb0 mt2 normal nowrap pb2 pl3 pointer pr3 pt2 tc white dim outline-0"
            // disabled={inProgress}
            // isLoading={inProgress}
          >
            Create Activity
          </button>
        </div>
      </form>
    </div>
  );
});

export default CreateActivity;
