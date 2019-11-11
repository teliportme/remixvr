import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import SavingButton from '../SavingButton';
import ProjectStore from '../../stores/projectStore';
import FieldLabel from '../FieldLabel';
import FieldInput from '../FieldInput';
import getAPIUrl from '../GetAPIUrl';

const PhotoSphere = observer(({ field, spaceId }) => {
  const [enableUpload, setEnabled] = useState(true);
  const projectStore = useContext(ProjectStore);
  const apiUrl = getAPIUrl();

  const uploadFile = event => {
    const file = event.target.files[0];
    const data = {};
    setEnabled(false);
    projectStore
      .updateField(spaceId, field.id, data, file)
      .then(() => setEnabled(true));
  };

  return (
    <React.Fragment>
      <FieldLabel className="f4 db ttc">{field.label}</FieldLabel>
      <FieldInput className="overflow-hidden">
        <div>
          <input
            type="file"
            id="file"
            disabled={!enableUpload}
            onChange={uploadFile}
            style={{ visibility: 'hidden', width: 0 }}
          />
          <SavingButton
            label
            htmlFor="file"
            disabled={!enableUpload}
            isLoading={!enableUpload}
            className="f6 link dim br2 ph2 pv2 mv2 dib white bg-dark-gray pointer"
          >
            {field.file && enableUpload ? `Replace` : 'Upload'}
          </SavingButton>
        </div>
        <div>
          {field.file && field.file.url && (
            <img alt="photosphere" src={apiUrl + field.file.url} />
          )}
        </div>
      </FieldInput>
    </React.Fragment>
  );
});

export default PhotoSphere;
