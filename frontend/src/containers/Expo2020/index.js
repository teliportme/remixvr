import React from 'react';
import Svg2020 from './dubai2020.svg';
import RemixVRLogo from '../../components/logos/remixvr-logo.png';
import Teachers1 from './teachers1.JPG';
import Teachers2 from './teachers2.JPG';
import Unicef from './unicef.png';
import Teliportme from './teliportme.svg';

const Expo2020 = () => (
  <div>
    <div className="flex items-center justify-center mt4">
      <img src={Svg2020} className="w4" alt="dubai expo 2020" />
      <img src={RemixVRLogo} className="pl4 w4" alt="remixvr logo" />
    </div>
    <div className="center tc w-50-ns w-90">
      <p className="f2-ns f3 gray pv3 i lh-title">
        Ensure inclusive and equitable quality education and promote lifelong
        learning opportunities for all
      </p>
      <p className="dark-gray f4 lh-copy">
        We use VR to improve engagement in classroom and provide quality
        education. We integrate VR into Global Citizenship Education to promote
        peace and non-violence, inclusivity and diversity in human cultures.
        We're supported by UNICEF Innovation.
      </p>
      <div className="flex items-center justify-center">
        <img src={Unicef} alt="unicef innovation" className="w4 w5-ns mr3" />
        <img src={Teliportme} alt="teliportme logo" className="w4 w5-ns" />
      </div>
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
      <article class="cf">
        <div class="fl w-50-ns w-100 tc pa1">
          <img src={Teachers1} alt="RemixVR teachers" className="w-100" />
        </div>
        <div class="fl w-50-ns w-100 tc pa1">
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
        src="https://staging--remixvr.netlify.com/project/taj-lesson-62791d/view"
      />
    </div>
  </div>
);

export default Expo2020;
