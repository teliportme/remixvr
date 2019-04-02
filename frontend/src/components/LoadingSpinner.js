import React from 'react';
import styled, { keyframes } from 'styled-components';

const loadingSpinner = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    border-top-color: #ec407a;
    transform: rotate(360deg);
  }
`;

const LoadingSpinnerDiv = styled.div.attrs({
  className: 'w3 h3'
})`
  border-radius: 50%;
  margin: ${props => props.managecenter ? 'auto' : '90px auto'};
  position: relative;
  border: 5px solid #ddd;
  border-top: 5px solid #42a5f5;
  transform: translateZ(0);
  animation: ${loadingSpinner} 1s infinite linear;
`;

export default LoadingSpinnerDiv;
