import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const float = keyframes`
  100% {
    transform: translateY(20px);
  }
`;

const Path1 = styled.path`
  animation: ${float} 1s infinite ease-in-out alternate;
  stroke-width: 6px;
`;

const Path2 = styled.path`
  animation: ${float} 1s infinite ease-in-out alternate;
  stroke-width: 6px;
  animation-delay: 0.2s;
`;

const Path3 = styled.path`
  animation: ${float} 1s infinite ease-in-out alternate;
  stroke-width: 6px;
  animation-delay: 0.4s;
`;

const Path4 = styled.path`
  animation: ${float} 1s infinite ease-in-out alternate;
  stroke-width: 6px;
  animation-delay: 0.6s;
`;

const Path5 = styled.path`
  animation: ${float} 1s infinite ease-in-out alternate;
  stroke-width: 6px;
  animation-delay: 0.8s;
`;

const Page404 = () => (
  <div className="center cf flex flex-wrap pa2 w-100 w-50-ns">
    <Helmet>
      <title>Page not found</title>
    </Helmet>
    <div className="fl flex items-center justify-center w-100 w-50-ns pa5 flex-column">
      <h1 className="f-headline lh-solid mid-gray mb0">404</h1>
      <p className="f3 lh-copy gray">Page not found!</p>
      <Link
        to="/"
        className="f6 link dim br2 ph3 pv2 mb2 dib white bg-dark-green"
      >
        Go to home
      </Link>
    </div>
    <div className="fl w-100 w-50-ns dn db-ns">
      <svg
        className="w-100"
        viewBox="0 0 837 1105"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xlink="http://www.w3.org/1999/xlink"
      >
        <Path1
          d="M353,9 L626.664028,170 L626.664028,487 L353,642 L79.3359724,487 L79.3359724,170 L353,9 Z"
          id="Polygon-1"
          stroke="#007FB2"
          stroke-width="6"
          fill="transparent"
        />
        <Path2
          d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
          id="Polygon-2"
          stroke="#EF4A5B"
          stroke-width="6"
          fill="transparent"
        />
        <Path3
          d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
          id="Polygon-3"
          stroke="#795D9C"
          stroke-width="6"
          fill="transparent"
        />
        <Path4
          d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
          id="Polygon-4"
          stroke="#F2773F"
          stroke-width="6"
          fill="transparent"
        />
        <Path5
          d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
          id="Polygon-5"
          stroke="#36B455"
          stroke-width="6"
          fill="transparent"
        />
      </svg>
    </div>
  </div>
);

export default Page404;
