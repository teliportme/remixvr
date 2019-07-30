import React, { useContext, useEffect } from 'react';
import SubmissionStore from '../stores/submissionStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import Slideshow from '../components/slidez';
import getAPIUrl from '../components/GetAPIUrl';

const SubmissionViewer = observer(props => {
  const submissionStore = useContext(SubmissionStore);
  const apiUrl = getAPIUrl();

  const urlParams = new URLSearchParams(props.location.search);
  const activity_code = urlParams.get('code');

  useEffect(() => {
    submissionStore.loadSubmissionsWithCode(activity_code);
  }, []);

  return (
    submissionStore.submissions.length > 0 && (
      <Slideshow autoplay={false} showIndex>
        {submissionStore.submissions.map(
          submission =>
            submission.file_type === 'image' && (
              <img
                key={submission.id}
                src={apiUrl + submission.file.url}
                alt="submission"
              />
            )
        )}
      </Slideshow>
    )
  );
});

export default SubmissionViewer;
