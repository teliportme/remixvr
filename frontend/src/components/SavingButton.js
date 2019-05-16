import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCircleNotch } from 'react-icons/fa';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const RotatingLoading = styled(FaCircleNotch)`
  animation: ${rotate} 0.75s linear infinite;
`;

const SavingButton = ({
  className,
  children,
  isLoading = false,
  label,
  ...rest
}) => {
  const newClassName = `inline-flex items-center ${className ? className : ''}`;

  // for upload buttons
  if (label) {
    return (
      <label className={newClassName} {...rest}>
        <RotatingLoading className={`h1 w1 dn mr2 ${isLoading ? 'dib' : ''}`} />
        <span className="f5">{children}</span>
      </label>
    );
  }
  return (
    <button className={newClassName} {...rest}>
      <RotatingLoading className={`h1 w1 dn mr2 ${isLoading ? 'dib' : ''}`} />
      <span className="f5">{children}</span>
    </button>
  );
};

export default SavingButton;
