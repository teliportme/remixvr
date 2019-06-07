import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import ProjectStore from '../../stores/projectStore';
import FieldLabel from '../FieldLabel';
import FieldInput from '../FieldInput';

const Color = observer(({ field, spaceId }) => {
  const fieldValue = field.color_code || '#fff';
  const [text, setText] = useState(fieldValue);
  const projectStore = useContext(ProjectStore);

  const updateColor = event => {
    projectStore.updateField(spaceId, field.id, {
      color_code: event.target.value
    });
  };

  return (
    <React.Fragment>
      <FieldLabel htmlFor="color-field" className="f4 db ttc">
        {field.label}
      </FieldLabel>
      <FieldInput>
        <input
          type="color"
          className="bn h2 w-100"
          id="color-field"
          required
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
          onBlur={updateColor}
        />
      </FieldInput>
    </React.Fragment>
  );
});

export default Color;
