import React from 'react';

const ErrorMessage = ({ errors, type = 'error' }) => {
  let background = 'bg-red';
  if (type === 'warning') background = 'bg-orange';
  if (!errors) return null;
  return (
    <div className={`${background} br2 f6 mt3 pa2 tc white lh-copy`}>
      {errors.body.map((error, index) => (
        <div key={index}>{error}</div>
      ))}
    </div>
  );
};

export default ErrorMessage;
