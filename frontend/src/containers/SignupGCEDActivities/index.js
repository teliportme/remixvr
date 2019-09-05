import React, { useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import DirectionsImg from './directions-monochrome.svg';
import ActivityStore from '../../stores/activityStore';
import ActivityTypeStore from '../../stores/activityTypeStore';
import SavingButton from '../../components/SavingButton';

const SignupGCEDBubbles = observer(({ history, match }) => {
  const activityStore = useContext(ActivityStore);
  const activityTypeStore = useContext(ActivityTypeStore);

  const [bubbleName, setBubbleName] = useState('');

  useEffect(() => {
    activityTypeStore.loadActivityTypes();
  }, []);

  const handleSubmitForm = event => {
    event.preventDefault();
    activityStore
      .createActivity(
        match.params.classSlug,
        bubbleName,
        parseInt(process.env.REACT_APP_SURROUNDING_VR_ACTIVITY_TYPE_ID) || 1
      )
      .then(activity => {
        history.push(
          `/classroom/${match.params.classSlug}/activity/${activity.code}`
        );
      });
  };

  return (
    <div className="cf h-100">
      <Helmet>
        <title>Create a bubble</title>
      </Helmet>
      <div className="bg-light-gray fl w-100 w-50-ns h-25 h-100-ns flex justify-center items-center">
        <img src={DirectionsImg} className="h-75 h-50-ns w-90" alt="map" />
      </div>
      <div className="w-100 w-50-ns fl h-100 flex-ns items-center">
        <div className="center w-100 w-70-l w-90-m mb4 pb4 ph3">
          <h3 className="dark-gray f1-ns f3 mb2 tc">Create Bubble</h3>
          <p className="dark-gray f4-ns f5 mb4 mt2 tc">
            Bubbles are activities you do in your class.
          </p>
          <form onSubmit={handleSubmitForm}>
            <div className="mb3 mt3">
              <label htmlFor="bubblename" className="b mid-gray">
                Bubble Name
              </label>
              <input
                type="text"
                className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
                id="bubblename"
                placeholder="Enter Bubble Name"
                required
                value={bubbleName}
                onChange={e => {
                  setBubbleName(e.target.value);
                }}
              />
            </div>
            <div className="mb3">
              <label htmlFor="bubblename" className="b mid-gray">
                Activity Type you'll be using:
              </label>
              <article className="b--black-10 ba br2 dark-gray mb4 mt1">
                <div className="pa2 ph3-ns pb3-ns bg-light-gray">
                  <div className="dt w-100 mt1">
                    <div className="dtc">
                      <h1 className="f5 f4-ns mv0">Your Surroundings VR</h1>
                      <p>
                        Take 360 photos of your surroundings. You can view
                        detailed steps about this activity in our guide.
                      </p>
                    </div>
                    <div className="dtc tr" />
                  </div>
                </div>
              </article>
            </div>
            <div className="mb3">
              <div className="bg-light-blue br2 dark-blue lh-copy pa2">
                Once you create a bubble, classrooms from around the world can
                react to it. You can also react to other bubbles by creating a
                react bubble. You can see this option inside you classroom after
                creating this activity.
              </div>
            </div>
            <div className="tr">
              <SavingButton
                type="submit"
                className="bg-dark-green bn br2 lh-title mb0 mt2 normal nowrap pl3 pointer pr3 pv3 tc white"
                disabled={activityStore.isCreatingActivity}
                isLoading={activityStore.isCreatingActivity}
              >
                Create Bubble
              </SavingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default SignupGCEDBubbles;
