import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import RemixvrLogo from './logos/remixvr-logo.png';
import styled from 'styled-components';

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
  transition: background .2s ease-out;
  width: 18px;
  &::after, &::before {
    background: #333;
    content: '';
    display: block;
    height: 100%;
    position: absolute;
    transition: all .2s ease-out;
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
  transition: max-height .2s ease-out;

  @media (min-width: 48em) {
    clear: none;
    float: right;
    max-height: none;
  }
`;

const MenuButton = styled.input`
  display: none;
  &:checked ~ ${MenuUl} {
    max-height: 240px;
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
  &:checked ~ ${MenuIcon} ${NavIcon}:before, &:checked ~ ${MenuIcon} ${NavIcon}:after {
    top: 0
  }
`;

const MenuLi = styled.li`
  a {
    padding: 20px 20px;
  }
  @media (min-width: 48em) {
    float: left;

    a {
      padding: 20px 30px;
    }
  }
`;

const Header = inject("commonStore")(observer(({ commonStore }) => {
  return <nav className="w-100 border-box pa2 ph5-ns center b--near-white">
    <Link className="fl pv2 ph3 v-mid mid-gray link dim" to="/">
      <img src={RemixvrLogo} className="dib h2" alt={commonStore.appName} />
    </Link>
    <MenuButton type="checkbox" id="menu-btn" />
    <MenuIcon htmlFor="menu-btn"><NavIcon /></MenuIcon>
    <MenuUl className="ma0 pa0 list overflow-hidden bg-white cb">
      <MenuLi>
        <a href="https://docs.remixvr.org" target="_blank" className="link dim f6 f5-ns db mr3 mr4-ns pointer dark-gray">Docs</a>
      </MenuLi>
      <MenuLi>
        <a href="https://github.com/teliportme/remixvr" target="_blank" className="link dim f6 f5-ns db mr3 mr4-ns pointer dark-gray">Github</a>
      </MenuLi>
      <MenuLi>
        <a href="https://blog.teliportme.com/tag/remixvr/" target="_blank" className="link dim f6 f5-ns db mr3 mr4-ns pointer dark-gray">Blog</a>
      </MenuLi>
    </MenuUl>
  </nav>
}));

export default Header;