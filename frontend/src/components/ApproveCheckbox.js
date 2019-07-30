import React, { useState } from 'react';

const Checkbox = ({ checked, onCheckboxClick, id }) => {
  const [currentChecked, setChecked] = useState(checked);

  return (
    <label className="pointer">
      <input
        type="checkbox"
        name="check"
        className="mr2"
        checked={currentChecked}
        onChange={() => {
          setChecked(!currentChecked);
          onCheckboxClick && onCheckboxClick(id);
        }}
      />
      {currentChecked ? (
        <span className="green b">Approved</span>
      ) : (
        <span className="orange b">Not approved</span>
      )}
    </label>
  );
};

export default Checkbox;
