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
          <Link to="https://docs.remixvr.org" className="link dim f6 f5-ns dib mr3 mr4-ns pointer dark-gray">Docs</Link>
        </li>
        <li className="list dib pb2">
          <Link to="https://github.com/teliportme/remixvr" className="link dim f6 f5-ns dib mr3 mr4-ns pointer dark-gray">Github</Link>
        </li>
      </ul>
    </div>
  </nav>
}));

export default Header;