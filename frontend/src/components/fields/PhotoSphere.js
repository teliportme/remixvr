import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import SavingButton from '../SavingButton';
import FieldStore from '../../stores/fieldStore';
import FieldLabel from '../FieldLabel';
import FieldInput from '../FieldInput';
import getAPIUrl from '../GetAPIUrl';

const PhotoSphere = observer(({ field }) => {
  const [file] = useState(field.file);
  const [enableUpload, setEnabled] = useState(true);
  const fieldStore = useContext(FieldStore);
  const apiUrl = getAPIUrl();

  const uploadFile = event => {
    const file = event.target.files[0];
    const data = {};
    setEnabled(false);
    fieldStore.updateField(field.id, data, file).then(() => setEnabled(true));
  };

  return (
    <React.Fragment>
      <FieldLabel htmlFor="file" className="f4 db ttc">
        {field.label}
      </FieldLabel>
      <FieldInput className="cf">
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
            {file && enableUpload ? `Replace` : 'Upload'}
          </SavingButton>
        </div>
        <div className="fl">
          {file && file.url && <img src={apiUrl + file.url} />}
        </div>
      </FieldInput>
      {/* {
        logo && enabled &&
        <img src={logo.url} className="mw4 br1 pa2 bg-white-60 db" />
      } */}
    </React.Fragment>
  );
});

export default PhotoSphere;
