import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import RemixvrLogo from './logos/remixvr-logo.png';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import AuthStore from '../stores/authStore';
import useRouter from '../components/useRouter';

const MenuIcon = styled.label`
  cursor: pointer;
  float: right;
  padding: 28px 20px;
  position: relative;
  user-select: none;

  @media (min-width: 48em) {
    display: none;
  }
`;

const NavIcon = styled.span`
  background: #333;
  display: block;
  height: 2px;
  position: relative;
  transition: background 0.2s ease-out;
  width: 18px;
  &::after,
  &::before {
    background: #333;
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    transition: all 0.2s ease-out;
    width: 100%;
  }
  &::after {
    top: -5px;
  }
  &::before {
    top: 5px;
  }
`;

const MenuUl = styled.ul`
  max-height: 0;
  transition: max-height 0.2s ease-out;

  @media (min-width: 48em) {
    clear: none;
    float: right;
    max-height: none;
  }
`;

const MenuButton = styled.input`
  display: none;
  &:checked ~ ${MenuUl} {
    max-height: 400px;
  }
  &:checked ~ ${MenuIcon} ${NavIcon} {
    background: transparent;
  }
  &:checked ~ ${MenuIcon} ${NavIcon}:before {
    transform: rotate(-45deg);
  }
  &:checked ~ ${MenuIcon} ${NavIcon}:after {
    transform: rotate(45deg);
  }
  /* prettier-ignore */
  &:checked ~ ${MenuIcon} ${NavIcon}:before, &:checked ~ ${MenuIcon} ${NavIcon}:after {
    top: 0
  }
`;

const MenuLi = styled.li`
  a,
  button {
    padding: 20px 20px;
  }
  @media (min-width: 48em) {
    float: left;

    a,
    button {
      padding: 20px 30px;
    }
  }
`;

const Header = observer(() => {
  const authStore = useContext(AuthStore);
  const isUserLoggedIn = authStore.isUserLoggedIn;
  const { history } = useRouter();

  const logout = () => {
    authStore.logout().then(() => {
      history.push('/');
    });
  };
  return (
    <nav className="b--black-10 bb border-box center pa2 ph5-ns w-100">
      <Link className="fl pv2 ph3 v-mid mid-gray link dim" to="/">
        <img src={RemixvrLogo} className="dib h2" alt="RemixVR" />
      </Link>
      <MenuButton type="checkbox" id="menu-btn" />
      <MenuIcon htmlFor="menu-btn">
        <NavIcon />
      </MenuIcon>
      <MenuUl className="ma0 pa0 list overflow-hidden cb">
        {isUserLoggedIn && (
          <MenuLi>
            <Link
              to="/dashboard"
              className="link dim f6 f5-ns db  pointer dark-gray"
            >
              Dashboard
            </Link>
          </MenuLi>
        )}
        <MenuLi>
          <a
            href="https://docs.remixvr.org"
            target="_blank"
            rel="noopener noreferrer"
            className="link dim f6 f5-ns db  pointer dark-gray"
          >
            Docs
          </a>
        </MenuLi>
        <MenuLi>
          <a
            href="https://github.com/teliportme/remixvr"
            target="_blank"
            rel="noopener noreferrer"
            className="link dim f6 f5-ns db  pointer dark-gray"
          >
            Github
          </a>
        </MenuLi>
        <MenuLi>
          <a
            href="https://blog.teliportme.com/tag/remixvr/"
            target="_blank"
            rel="noopener noreferrer"
            className="link dim f6 f5-ns db  pointer dark-gray"
          >
            Blog
          </a>
        </MenuLi>
        {isUserLoggedIn ? (
          <MenuLi>
            <button
              onClick={logout}
              className="link dim f6 f5-ns db  pointer dark-gray bn bg-transparent"
            >
              Logout
            </button>
          </MenuLi>
        ) : (
          <React.Fragment>
            <MenuLi>
              <Link
                to="/signup"
                className="link dim f6 f5-ns db  pointer dark-gray"
              >
                Sign Up
              </Link>
            </MenuLi>
            <MenuLi>
              <Link
                to="/login"
                className="link dim f6 f5-ns db  pointer dark-gray"
              >
                Login
              </Link>
            </MenuLi>
          </React.Fragment>
        )}
      </MenuUl>
    </nav>
  );
});

export default Header;
