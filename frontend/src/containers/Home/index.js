import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import RemixvrLogo from './logos/remixvr-logo.png';

const Header = inject("commonStore")(observer(({ commonStore }) => {
  return <nav className="dt w-100 border-box pa2 ph5-ns center bb b--near-white">
    <Link className="dtc-ns v-mid mid-gray link dim w-25" to="/">
      <img src={RemixvrLogo} className="dib h2" alt={commonStore.appName} />
    </Link>
  </nav>
}));

export default Header;