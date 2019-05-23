import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import ProjectStore from '../../stores/projectStore';
import FieldLabel from '../FieldLabel';
import FieldInput from '../FieldInput';

const Text = observer(({ field, spaceId }) => {
  const fieldValue = field.text_value || '';
  const [text, setText] = useState(fieldValue);
  const projectStore = useContext(ProjectStore);

  const updateText = event => {
    projectStore.updateField(spaceId, field.id, {
      text_value: event.target.value
    });
  };

  return (
    <React.Fragment>
      <FieldLabel htmlFor="text-field" className="f4 db ttc">
        {field.label}
      </FieldLabel>
      <FieldInput>
        <input
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
        />
      </FieldInput>
    </React.Fragment>
  );
});

export default Text;
