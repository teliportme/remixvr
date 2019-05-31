import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import SavingButton from '../SavingButton';
import ProjectStore from '../../stores/projectStore';
import FieldLabel from '../FieldLabel';
import FieldInput from '../FieldInput';
import getAPIUrl from '../GetAPIUrl';

const VideoSphere = observer(({ field, spaceId }) => {
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
      <FieldLabel htmlFor="file" className="f4 db ttc">
        {field.label}
      </FieldLabel>
      <FieldInput className="cf overflow-hidden">
        <div className="fl">
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
        <div className="fl">
          {field.file && field.file.url && (
            <video alt="videosphere" src={apiUrl + field.file.url} />
          )}
        </div>
      </FieldInput>
      {/* {
        logo && enabled &&
        <img src={logo.url} className="mw4 br1 pa2 bg-white-60 db" />
      } */}
    </React.Fragment>
  );
});

export default VideoSphere;
