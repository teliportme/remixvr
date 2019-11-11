import React from 'react';
import { Helmet } from 'react-helmet';
import MetaBanner from '../containers/Home/remix-vr-classrooms.png';

const DefaultMetaTags = () => (
  <React.Fragment>
    <Helmet titleTemplate="%s | RemixVR" defaultTitle="RemixVR" />
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
  </React.Fragment>
);

export default DefaultMetaTags;
