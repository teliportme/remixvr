import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

const GradientDiv = styled.div`
  background: linear-gradient(180deg, #efefef 0%, rgba(255, 255, 255, 0) 100%);
`;

const GCEDLanding = () => (
  <React.Fragment>
    <Helmet>
      <title>Global Citizenship Education (GCED) on RemixVR</title>
    </Helmet>
    <GradientDiv>
      <div className="center pv3 w-100 w-50-l w-80-m ph3 tc">
        <h1 className="f2 ttc lh-title remixvr-blue">
          Connect students from around the world with RemixVR's Global
          Citizenship Education
        </h1>
        <p className="center dark-gray f3 lh-copy tc">
          RemixVR's GCED tool provides various activities and allows students
          from around the world to interact.
        </p>
        <Link
          to="/signup"
          className="f3 link dim br2 ph3 pv2 mb2 dib white bg-blue bb bw2 b--dark-blue mt3"
        >
          Sign Up Now
        </Link>
      </div>
    </GradientDiv>
    <div className="center pv3 w-100 w-50-l w-80-m ph3 mt4 mt5-ns">
      <h2 className="f2 ttc tc lh-title">
        Classroom in different timezones?
        <br /> No problem!
      </h2>
      <p className="f4 lh-copy w-80-l center">
        We have developed a unique system that allows students to interact with
        partner classroom from anywhere in the world regarless of the timezone.
      </p>
    </div>
    <div className="center pv3 w-100 w-50-l w-80-m ph3">
      <h2 className="f2 ttc tc lh-title">How does it work?</h2>
      <p className="f4 lh-copy w-80-l center">
        There are different GCED activities on RemixVR that students can do.
        Once a classroom completes one of the activities, another classroom from
        anywhere in the world can react & interact with it at a different time.
        This way, the classrooms doesn't need to be online at the same time.
      </p>
    </div>
  </React.Fragment>
);

export default GCEDLanding;
