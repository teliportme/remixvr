import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SubmissionStore from '../stores/submissionStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';

const Submissions = observer(props => {
  const submissionStore = useContext(SubmissionStore);

  useEffect(() => {
    submissionStore.loadSubmissions(props.match.params.code);
  }, []);

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Submissions" />
      <h2 className="fw7 f2 mb0">Submissions</h2>
      {submissionStore.activity && (
        <div className="gray mb4">
          Activity created at{' '}
          {dayjs(submissionStore.activity.created_at).format('MMM D, YYYY')} for{' '}
          <span className="i">
            {submissionStore.activity.classroom.classname}
          </span>
        </div>
      )}
      <div>
        <Link
          to={`/activity/submit?code=${props.match.params.code}`}
          className="f5 link dim br2 ph3 pv2 mb2 dib white bg-blue bb bw2 b--dark-blue"
        >
          Upload Submissions
        </Link>
      </div>
      {submissionStore.submissions.length > 0 ? (
        <ul className="list pl0 ml0 mw6 bn">
          {submissionStore.submissions.map(submission => (
            <li key={submission.id} className="bt pt3 b--light-green">
              <Link
                to={submission.file.url}
                className="db f3 fw7 link near-black pt2"
              >
                Submission by {submission.author}
              </Link>
              <span className="db f6 gray pv2 truncate">
                {dayjs(submission.created_at).format('MMM D, YYYY')}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="lh-copy mt3 dark-gray">
          There are no submissions yet!
        </div>
      )}
    </div>
  );
});

export default Submissions;
