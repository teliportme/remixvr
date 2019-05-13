import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import FieldStore from '../../stores/fieldStore';

const PhotoSphere = observer(({ field, spaceId }) => {
  const [file, setFile] = useState(field.file);
  const fieldStore = useContext(FieldStore);

  const uploadFile = event => {
    const file = event.target.files[0];
    const data = {};
    fieldStore.updateField(field.id, data, file);
  };

  return (
    <React.Fragment>
      <label htmlFor="file" className="b mid-gray">
        {field.label}
      </label>
      <input
        type="file"
        className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
        id="file"
        placeholder={field.label}
        required
        onChange={uploadFile}
      />
    </React.Fragment>
  );
});

export default PhotoSphere;
