import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import SavingButton from '../SavingButton';
import ProjectStore from '../../stores/projectStore';
import ReactModal from 'react-modal';
import FieldLabel from '../FieldLabel';
import FieldInput from '../FieldInput';
import getAPIUrl from '../GetAPIUrl';
import LoadingSpinner from '../LoadingSpinner';

const ObjectGooglePoly = observer(({ field, spaceId }) => {
  const [savingModel, setSavingModel] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [assets, setAssets] = useState([]);
  const [isSearching, setSearching] = useState(false);
  const projectStore = useContext(ProjectStore);
  const apiUrl = getAPIUrl();

  const modelSelect = asset => {
    closeModal();
    setAssets([]);
    setSavingModel(true);
    const format = asset.formats.find(format => {
      return format.formatType === 'GLTF2';
    });

    if (format !== 'undefined') {
      const mainObjectItemUrl = format.root.url;
      const objectResources = format.resources.map(item => item.url);
      const data = {
        object_name: asset.displayName,
        main_object_file: mainObjectItemUrl,
        object_files: objectResources,
        thumbnail: asset.thumbnail.url,
        attribute: asset.authorName
      };
      projectStore
        .updateField(spaceId, field.id, data)
        .then(() => setSavingModel(false));
    }
  };

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setAssets([]);
    setSearchTerm('');
  }

  const searchGooglePoly = event => {
    event.preventDefault();
    const API_KEY = process.env.REACT_APP_POLY_API_KEY;
    const url = `https://poly.googleapis.com/v1/assets?keywords=${searchTerm}&format=GLTF2&key=${API_KEY}`;
    setSearching(true);
    const request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.addEventListener('load', function(event) {
      setSearching(false);
      const data = JSON.parse(event.target.response);
      if (data.assets) setAssets(data.assets);
      else {
        setAssets([]);
      }
    });
    request.send(null);
  };

  return (
    <React.Fragment>
      <FieldLabel htmlFor="file" className="f4 db ttc">
        {field.label}
      </FieldLabel>
      <FieldInput className="cf overflow-hidden">
        <div className="fl">
          <SavingButton
            label
            htmlFor="file"
            disabled={savingModel}
            isLoading={savingModel}
            className="f6 link dim br2 ph2 pv2 mv2 dib white bg-dark-gray pointer"
            onClick={openModal}
          >
            Select Model
          </SavingButton>
          <ReactModal
            appElement={document.body}
            isOpen={showModal}
            className="absolute shadow-2 bg-white br2 outline-0 pa2 top-2 bottom-1 left-1 right-1 overflow-scroll"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            onRequestClose={closeModal}
          >
            <React.Fragment>
              <form
                onSubmit={searchGooglePoly}
                className="center w-100 w-30-ns mt2 mb4"
              >
                <div className="cf">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                    }}
                    className="f6 f5-l input-reset bn fl black-80 bg-light-gray pa3 lh-solid w-100 w-60-m w-70-l br2-ns br--left-ns outline-0"
                    placeholder="Search"
                  />
                  <button
                    type="submit"
                    className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-40-m w-30-l br2-ns br--right-ns"
                  >
                    Search
                  </button>
                </div>
              </form>
              <React.Fragment>
                {isSearching ? (
                  <LoadingSpinner />
                ) : assets.length > 0 ? (
                  assets.map((asset, index) => (
                    <img
                      alt={asset.displayName || 'object'}
                      src={asset.thumbnail.url}
                      key={index}
                      className="w4 h4 ma2"
                      onClick={modelSelect.bind(null, asset)}
                    />
                  ))
                ) : (
                  <div className="f4 tc">No items found</div>
                )}
              </React.Fragment>
            </React.Fragment>
          </ReactModal>
        </div>
        <div className="fl">
          {field.folder && field.object_filename && (
            <img
              alt="photosphere"
              src={apiUrl + field.folder + field.thumbnail}
            />
          )}
        </div>
      </FieldInput>
    </React.Fragment>
  );
});

export default ObjectGooglePoly;
