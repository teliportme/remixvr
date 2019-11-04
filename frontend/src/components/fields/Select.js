import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import ProjectStore from '../../stores/projectStore';
import FieldLabel from '../FieldLabel';
import FieldInput from '../FieldInput';
import Dropdown from '../react-dropdown';

const Select = observer(({ field, spaceId }) => {
  const projectStore = useContext(ProjectStore);

  const updateField = item => {
    projectStore.updateField(spaceId, field.id, {
      selected_value: item.value
    });
  };

  return (
    <React.Fragment>
      <FieldLabel htmlFor="text-field" className="f4 db ttc">
        {field.label}
      </FieldLabel>
      <FieldInput>
        {/* <input
          type="text"
          className="mt1 db pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bn br2 w-100 outline-0"
          id="text-field"
          placeholder={`Enter ${field.label}`}
          required
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
          onBlur={updateText}
        /> */}
        <Dropdown
          options={field.possible_values}
          placeholder={field.label}
          className="br2"
          value={field.selected_value}
          controlClassName="relative overflow-hidden mid-gray bg-white br2 outline-0 pa2 w-100"
          menuClassName="mt1 db pt2 pr3 pb2 pl3 lh-title mid-gray bg-white bn br2 w-100 outline-0 absolute"
          onChange={updateField}
        />
      </FieldInput>
    </React.Fragment>
  );
});

export default Select;
