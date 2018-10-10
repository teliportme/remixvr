import React from 'react';
import video from './video.mp4'
import TeliportmeLogo from './logos/teliportme-logo.png';
import TutorialsforvrLogo from './logos/tutorialsforvr-logo.png';

const Home = () => (
  <React.Fragment>
    <div className="cf flex-ns items-center justify-between">
      <div className="fl w-100 w-50-l">
        <div className="center mt5-l mt4 mw7 pl3-ns tc tl-ns w-100">
          <button className="b--none bg-yellow black br-pill dib f6 fw6 mb2 no-underline outline-0 ph3 pv2 trackedine">Open Source</button>
        </div>
        <span className="db f1 f-subheadline-l fw5 center mw7 tc tl-ns ph2 lh-title">Collaboratively build customizable<span style={{ color: '#216ef4' }}>VR experiences</span></span>
        <div className="bg-object left-2-ns top--2"></div>
        <div className="cf center mt5-l mt4 mw7 pl3-ns tc tl-ns w-100 flex ph2 ph0-ns">
          <div className="fl">
            <a href="https://github.com/teliportme/remixVR" className="link bg-red br2 ba bw1 dib dim f3 fw4 mb2 ph3 pv3 tracked white b--red">View on Github</a>
          </div>
          <div className="fl">
            <a className="link ml3 ba bw1 br2 dib dim f3 fw4 mb2 ph3 pv3 tracked red b--red" href="https://blog.teliportme.com/remixvr/">Learn More</a>
          </div>
        </div>
      </div>
      <div className="fl w-100 w-50-l tc">
        <video src={video} className="w-80 mw-100-ns mt4 mt0-ns" autoPlay muted loop></video>
      </div>
    </div>
    <div className="mt5 ph7-l ph5-ns pv4 tc">
      <span className="ttu  tracked-mega relative bottom-1 fw6 light-silver f5">Supported By</span>
      <div className="mt3">
        <a href="https://tutorialsforvr.com" className="link"><img className="w-100 w-20-ns mw5 mw6-ns" src={TutorialsforvrLogo} /></a>
        <a href="https://teliportme.com" className="link"><img className="w-100 w-20-ns mw5 mw6-ns" src={TeliportmeLogo} /></a>
      </div>
    </div>
  </React.Fragment>
);

export default Home;