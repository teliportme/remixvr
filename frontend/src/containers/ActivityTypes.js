import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';

const Tag = props => (
  <span className="bg-dark-gray white ph1 br2 f6 ma1">{props.children}</span>
);

const ActivityTypes = observer(() => {
  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet>
        <title>GCED Activities</title>
        <meta
          name="description"
          content="Global Citizenship Education on RemixVR offers different types of activities that can be done in classrooms."
        />
      </Helmet>
      <h1 className="center f3 fw5 lh-title w-50-l">
        Global Citizenship Activities by RemixVR are designed to build
        curiosity, empathy and kindness among student communities around the
        world.
      </h1>
      {/* <section>
        <div className="cf">
          <div className="fl w-50-ns w-100 tc">image</div>
          <div className="fl w-50-ns w-100">
            RemixVR activities help students practice social skills such as
            respectful communication, perspective taking, cooperation, and
            critical thinking, as they experience positive connections with
            peers around the world. All of our activities are standards- and
            research-based, and they fit easily into existing curriculum. Our
            activity plans can be followed step-by-step or tailored to meet your
            classroom’s needs, and classrooms can do an RemixVR activity as
            frequently as they would like. We encourage partner classrooms to
            stay connected throughout the year to deepen relationships among
            students and explore new topics!
          </div>
        </div>
      </section> */}
      <section className="center cf flex-ns justify-center w-100 w-80-ns">
        <article className="fl pa2-ns w-100 w-50-l">
          <h2 className="b--gold bb bw2 mb0 pa1 tc">Your Surroundings VR</h2>
          <p className="bg-washed-yellow f4 lh-copy mv0 ph2 pv3">
            Get to know the surroundings of students from another part of the
            world by sharing 360 images.
            <br />
            <Tag>Good first experience</Tag>
            <Tag>Good for ages 8-12</Tag>
          </p>
          <Link
            to=""
            className="b bg-gold black db hover-bg-yellow link pa2 tc"
          >
            View Activity
          </Link>
        </article>
      </section>
    </div>
  );
});

export default ActivityTypes;
