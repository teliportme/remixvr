import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

const PhotoSphere = observer(({ field }) => {
  const [file, setFile] = useState('');

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
        value={file}
        onChange={e => {
          setFile(e.target.value);
        }}
      />
    </React.Fragment>
  );
});

export default PhotoSphere;
