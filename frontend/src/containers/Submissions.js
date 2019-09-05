import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SubmissionStore from '../stores/submissionStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import getAPIUrl from '../components/GetAPIUrl';
import ApproveCheckbox from '../components/ApproveCheckbox';

const Submissions = observer(props => {
  const submissionStore = useContext(SubmissionStore);
  const apiUrl = getAPIUrl();

  useEffect(() => {
    submissionStore.loadSubmissions(
      props.match.params.classSlug,
      props.match.params.code
    );
  }, []);

  const toggleApproval = submissionId => {
    submissionStore.toggleSubmissionApproval(
      props.match.params.code,
      submissionId
    );
  };

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Submissions" />
      <h2 className="fw7 f2 mb0">Bubble Submissions</h2>
      {submissionStore.activity && (
        <div className="gray mb4">
          Activity <i>{submissionStore.activity.activity_name}</i> created on{' '}
          {dayjs(submissionStore.activity.created_at).format('MMM D, YYYY')} for{' '}
          <span className="i">
            {submissionStore.activity.classroom.classname}
          </span>
          <p className="f4-ns f5">
            All your bubble's submissions will appear here. Follow the
            instructions for the activity.
          </p>
          {submissionStore.activity.is_reaction && (
            <div>
              <span className="f4 db mt3 mb2 dark-gray">
                You have to react to the following activity
              </span>
              <div className="mb2">
                <div>
                  School:{' '}
                  {submissionStore.activity.reaction_to.classroom.school.name}
                </div>
                <div>
                  Country:{' '}
                  {
                    submissionStore.activity.reaction_to.classroom.school
                      .country
                  }
                </div>
              </div>
              <Link
                target="_blank"
                to={`/activity/view?code=${
                  submissionStore.activity.reaction_to.code
                }`}
                className="b--gold bb bg-yellow black br2 bw2 dib dim f5 link mb2 ph3 pv2"
              >
                View Activity
              </Link>
            </div>
          )}
        </div>
      )}
      <div>
        <Link
          to={`/activity/submit?code=${props.match.params.code}`}
          className="f5 link dim br2 ph3 pv2 mb2 dib white bg-blue bb bw2 b--dark-blue"
        >
          Upload Submissions
        </Link>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/activity/view?code=${props.match.params.code}`}
          className="f5 link dim br2 ph3 pv2 mb2 dib white bb bw2 ml3 bg-gray b--dark-gray"
        >
          View Submissions
        </a>
      </div>
      {submissionStore.submissions.length > 0 ? (
        <ul className="list pl0 ml0 mw6 bn">
          {submissionStore.submissions.map(submission => (
            <li key={submission.id} className="bt pt3 b--light-green">
              <ApproveCheckbox
                id={submission.id}
                checked={submission.approved}
                onCheckboxClick={toggleApproval}
              />
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={apiUrl + submission.file.url}
                className="db f3 fw7 link near-black pt2"
              >
                Submission by {submission.author}
              </a>
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
