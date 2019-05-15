import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import FieldStore from '../../stores/fieldStore';

const Text = observer(({ field }) => {
  const fieldValue = field.text_value || '';
  const [text, setText] = useState(fieldValue);
  const fieldStore = useContext(FieldStore);

  const updateText = event => {
    fieldStore.updateField(field.id, { text_value: event.target.value });
  };

  return (
    <React.Fragment>
      <label htmlFor="text-field" className="b mid-gray">
        {field.label}
      </label>
      <input
        type="text"
        className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
        id="text-field"
        placeholder={field.label}
        required
        value={text}
        onChange={e => {
          setText(e.target.value);
        }}
        onBlur={updateText}
      />
    </React.Fragment>
  );
});

export default Text;
