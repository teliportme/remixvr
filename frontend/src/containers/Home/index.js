import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import video from './video.mp4';
import TutorialsforvrLogo from './logos/tutorialsforvr-logo.png';
import styled from 'styled-components';
import Teachers1 from './teachers1.JPG';
import Teachers2 from './teachers2.JPG';
import Unicef from './unicef.png';
import Teliportme from './teliportme.svg';
import MetaBanner from './remix-vr-classrooms.png';

const BgObject = styled.div.attrs({
  className: 'left-2-ns top--2'
})`
  position: absolute;
  z-index: -1;
  width: 639px;
  height: 600px;
  border-radius: 30% 70% 30% 100%;
  background-color: #ecf3ff;
  background-image: -webkit-linear-gradient(270deg, #ecf3ff, #fff);
  background-image: linear-gradient(180deg, #ecf3ff, #fff);
  @media screen and (max-width: 30em) {
    width: 300px;
    height: 350px;
  }
`;

const VideoPlayer = styled.video.attrs({
  className: 'w-80 mw-100-ns mt4 mt0-ns',
  autoPlay: true,
  muted: true,
  loop: true,
  src: video
})`
  transform: perspective(3190px) rotateY(-29deg) rotateX(4deg) rotate(1deg);
  box-shadow: 1px 1px 5px 0 rgba(26, 26, 67, 0.05),
    39px 62.5px 125px -25px rgba(50, 50, 93, 0.5),
    23.4px 37.5px 75px -37.5px rgba(0, 0, 0, 0.6);
  border: 3px solid black;
  padding: 2px;
  @media screen and (max-width: 30em) {
    transform: none;
  }
`;

const Home = () => (
  <React.Fragment>
    <Helmet>
      <title>RemixVR - Virtual Reality in Classrooms</title>
      <meta
        property="description"
        content="Start using VR in classrooms to boost student engagement. Remix VR also provides Global citizenship tools for GCED."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://remixvr.org`} />
      <meta
        property="og:title"
        content="RemixVR - Virtual Reality in Classrooms"
      />
      <meta
        property="og:description"
        content="Start using VR in classrooms to boost student engagement. Remix VR also provides Global citizenship tools for GCED."
      />
      <meta property="og:image" content={MetaBanner} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://remixvr.org" />
      <meta
        property="twitter:title"
        content="RemixVR - Virtual Reality in Classrooms"
      />
      <meta
        property="twitter:description"
        content="Start using VR in classrooms to boost student engagement. Remix VR also provides Global citizenship tools for GCED."
      />
      <meta property="twitter:image" content={MetaBanner} />
    </Helmet>
    <div className="center w-80-ns w-100 mt4">
      <div className="cf items-center justify-between ph2">
        <div className="fl w-100 w-50-l pl5-ns">
          <div className="tc tl-ns w-100">
            <button className="b--none bg-yellow black br-pill dib f6 fw6 mb2 no-underline outline-0 ph3 pv2 trackedine">
              Open Source
            </button>
          </div>
          <span className="db f1-ns f2 fw5 lh-title tc tl-ns">
            Collaboratively build customizable
            <br />
            <span style={{ color: '#216ef4' }}>VR experiences</span>
          </span>
          <BgObject />
          <div className="cf flex justify-center mt4 mt5-l ph0-ns ph2 tc tl-ns w-100 justify-start-ns">
            <div className="fl">
              <Link
                to="/signup"
                className="b--red ba bg-red br2 bw1 dib dim f3 link mb2 ph3 ph5 pv2 white"
              >
                Create VR Lessons
              </Link>
            </div>
          </div>
        </div>
        <div className="fl w-100 w-50-l tc mt5-ns">
          <VideoPlayer />
        </div>
      </div>
      <div className="mt4 ph7-l ph5-ns pv4 tc">
        <span className="ttu  tracked-mega relative bottom-1 fw6 light-silver f5">
          Supported By
        </span>
        <div className="mt3">
          <a href="https://unicefinnovationfund.org" className="link">
            <img
              className="w-100 w-20-ns mw5 mw6-ns"
              style={{
                top: '0.5rem',
                position: 'relative'
              }}
              src={Unicef}
              alt="unicef innovation fund logo"
            />
          </a>
          <a href="https://tutorialsforvr.com" className="link">
            <img
              className="w-100 w-20-ns mw5 mw6-ns"
              src={TutorialsforvrLogo}
              alt="tutorials for vr logo"
            />
          </a>
          <a href="https://teliportme.com" className="link">
            <img
              className="w-100 w-20-ns mw5 mw6-ns"
              src={Teliportme}
              alt="teliportme logo"
            />
          </a>
        </div>
      </div>
    </div>
    <div className="center tc w-50-ns w-90">
      <p className="f2-ns f3 gray pv3 i lh-title">
        Ensure inclusive and equitable quality education while promoting
        lifelong learning opportunities for all
      </p>
      <p className="dark-gray f4 lh-copy">
        We use VR to improve engagement in classroom and provide quality
        education. We also integrate VR into Global Citizenship Education to
        promote peace and non-violence, inclusivity and diversity in human
        cultures. We're supported by UNICEF Innovation.
      </p>
      <h2 className="f2">How easy is it to create VR content?</h2>
      <p className="dark-gray f4 lh-copy">
        RemixVR makes it as simple as filling a form to create a VR lesson.
        Anyone can create VR lessons without the knowledge of complex 3D
        programming.
      </p>
      <iframe
        title="remixvr easy vr lessons"
        width="560"
        height="315"
        className="mw-100"
        src="https://www.youtube.com/embed/VmQl2yNlM60"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <h2 className="f2">What do teachers think of VR and RemixVR?</h2>
      <p className="dark-gray f4 lh-copy">
        We introduced VR to teachers and asked teachers about what they thought
        of VR and how RemixVR can help them in classrooms. They were really
        excited to use VR in classrooms.
      </p>
      <article className="cf">
        <div className="fl w-50-ns w-100 tc pa1">
          <img src={Teachers1} alt="RemixVR teachers" className="w-100" />
        </div>
        <div className="fl w-50-ns w-100 tc pa1">
          <img src={Teachers2} alt="Teachers using RemixVR" className="w-100" />
        </div>
      </article>
      <iframe
        title="remixvr feedback 1"
        width="560"
        height="315"
        className="mw-100"
        src="https://www.youtube.com/embed/ofEHuai-Ew8"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <iframe
        title="remixvr feedback 2"
        width="560"
        height="315"
        className="mw-100"
        src="https://www.youtube.com/embed/HfXk9SCk9ag"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <h2 className="f2">Let's look a simple demo of RemixVR</h2>
      <p className="dark-gray f4 lh-copy">
        In this demo, we look at a lesson created about Taj Mahal. This VR
        lesson is viewable on any VR headset. It is also viewable on laptops on
        mobiles even without a VR headset. (VR headset provides a more immerisve
        experience.) We use this technology so that any learner can access these
        lessons regardless of which device they use.
      </p>
      <iframe
        title="remixvr demo"
        width="100%"
        style={{ height: '27rem' }}
        allowvr="yes"
        allowFullScreen="yes"
        scrolling="no"
        className="bn mb3"
        src="https://staging--remixvr.netlify.com/lesson/taj-lesson-62791d/view"
      />
    </div>
  </React.Fragment>
);

export default Home;
