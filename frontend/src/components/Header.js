import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import RemixvrLogo from './logos/remixvr-logo.png';

const Header = inject("commonStore")(observer(({ commonStore }) => {
  return <nav className="dt w-100 border-box pa2 ph5-ns center b--near-white">
    <Link className="dtc-ns v-mid mid-gray link dim w-25" to="/">
      <img src={RemixvrLogo} className="dib h2" alt={commonStore.appName} />
    </Link>
    <div className="dtc v-mid w-75 tr">
      <ul>
        <li className="list dib pb2">
          <a href="https://docs.remixvr.org" target="_blank" className="link dim f6 f5-ns dib mr3 mr4-ns pointer dark-gray">Docs</a>
        </li>
        <li className="list dib pb2">
          <a href="https://github.com/teliportme/remixvr" target="_blank" className="link dim f6 f5-ns dib mr3 mr4-ns pointer dark-gray">Github</a>
        </li>
        <li className="list dib pb2">
          <a href="https://blog.teliportme.com/tag/remixvr/" target="_blank" className="link dim f6 f5-ns dib mr3 mr4-ns pointer dark-gray">Blog</a>
        </li>
      </ul>
    </div>
  </nav>
}));

export default Header;