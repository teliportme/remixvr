import React, { useContext, useEffect } from 'react';
import SubmissionStore from '../stores/submissionStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import Slideshow from '../components/slidez';
import getAPIUrl from '../components/GetAPIUrl';
import ReactPannellum from 'react-pannellum';

const SubmissionViewer = observer(props => {
  const submissionStore = useContext(SubmissionStore);
  const apiUrl = getAPIUrl();

  const urlParams = new URLSearchParams(props.location.search);
  const activity_code = urlParams.get('code');

  useEffect(() => {
    submissionStore.loadSubmissionsWithCode(activity_code);
  }, []);

  const getItem = (type, submission) => {
    switch (type) {
      case 'image':
        return (
          <img
            className="h-100"
            key={submission.id}
            src={apiUrl + submission.file.url}
            alt="submission"
          />
        );
      case 'video':
        return (
          <video
            className="h-100"
            controls
            key={submission.id}
            src={apiUrl + submission.file.url}
          />
        );
      case 'pano':
        return (
          <ReactPannellum
            key={submission.id}
            id="pano"
            sceneId="firstScene"
            imageSource={apiUrl + submission.file.url}
            style={{
              width: '100%',
              height: '100%'
            }}
            config={{
              hfov: 90,
              compass: false,
              autoLoad: true
            }}
          />
        );
      default:
        return (
          <img
            className="h-100"
            key={submission.id}
            src={apiUrl + submission.file.url}
            alt="submission"
          />
        );
    }
  };

  return (
    submissionStore.submissions.length > 0 && (
      <React.Fragment>
        <Helmet>
          <title>
            View Submissions for {submissionStore.activity.code} Activity
          </title>
        </Helmet>
        <Slideshow autoplay={false} showIndex>
          {submissionStore.submissions.map(submission =>
            getItem(submission.file_type, submission)
          )}
        </Slideshow>
      </React.Fragment>
    )
  );
});

export default SubmissionViewer;
