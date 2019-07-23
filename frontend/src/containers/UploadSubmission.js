import React, { useContext, useState, useRef } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import EXIF from '../components/Exif';
import { mobilecheck } from '../utils';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize
);

const UploadSubmission = observer(() => {
  const API_ROOT = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const pond = useRef(null);

  const [author, setAuthor] = useState('');

  const getLatLng = coords => {
    return coords[0] + coords[1] / 60 + coords[2] / 3600;
  };

  function getFileArrayBuffer(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function() {
        resolve(new Uint8Array(reader.result));
      };
      reader.readAsArrayBuffer(file);
    });
  }

  const handleSubmitForm = event => {
    event.preventDefault();
    pond.current.processFiles().then(files => {
      console.log(files);
    });
  };

  return (
    <div>
      <Helmet>
        <title>Upload Activity Submission</title>
      </Helmet>
      <form className="center mt5 w-100 w-50-ns" onSubmit={handleSubmitForm}>
        <label htmlFor="userid" className="b mid-gray">
          Enter your name
        </label>
        <input
          type="text"
          className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 ba br2 w-50 mb3"
          id="userid"
          placeholder="Name"
          required
          value={author}
          onChange={e => {
            setAuthor(e.target.value);
          }}
        />
        <div>
          <FilePond
            dropOnPage={true}
            dropOnElement={false}
            instantUpload={false}
            allowMultiple={false}
            allowImagePreview={mobilecheck() ? false : true}
            maxFiles={1}
            acceptedFileTypes={['image/png', 'image/jpg', 'image/jpeg']}
            maxFileSize={'500MB'}
            labelMaxFileSizeExceeded={`File is too large.`}
            labelIdle={`Drag & Drop your files or <span class="blue underline pointer"> Browse </span> to upload`}
            ref={pond}
            onprocessfile={(error, file) => {
              if (!error) pond.current.removeFile(file.id);
            }}
            beforeAddFile={file =>
              new Promise(resolve => {
                let hasXmpData = false;

                getFileArrayBuffer(file.source).then(fileBuffer => {
                  const imageExif = EXIF.readFromBinaryFile(fileBuffer.buffer);
                  const imageXmp = EXIF.findXMPinJPEG(fileBuffer.buffer);

                  const latCoords = imageExif.GPSLatitude;
                  const lngCoords = imageExif.GPSLongitude;

                  const lat = latCoords ? getLatLng(latCoords) : null;
                  const lng = lngCoords ? getLatLng(lngCoords) : null;

                  file.setMetadata('lat', lat);
                  file.setMetadata('lng', lng);

                  if (
                    imageXmp &&
                    imageXmp['x:xmpmeta'] &&
                    imageXmp['x:xmpmeta']['rdf:RDF'] &&
                    imageXmp['x:xmpmeta']['rdf:RDF']['rdf:Description'] &&
                    imageXmp['x:xmpmeta']['rdf:RDF']['rdf:Description'][
                      '@attributes'
                    ] &&
                    imageXmp['x:xmpmeta']['rdf:RDF']['rdf:Description'][
                      '@attributes'
                    ]['xmlns:GPano']
                  ) {
                    hasXmpData = true;
                  }
                });

                const image = document.createElement('img');
                image.src = URL.createObjectURL(file.source);
                image.onerror = function(err) {
                  clearInterval(intervalId);
                  return resolve(false);
                };

                var intervalId = setInterval(function() {
                  if (image.naturalWidth && image.naturalHeight) {
                    clearInterval(intervalId);
                    URL.revokeObjectURL(image.src);
                    const wideImage =
                      image.naturalWidth >= image.naturalHeight * 2;

                    const isPanorama = hasXmpData || wideImage;
                    file.setMetadata('isPano', isPanorama);
                    return resolve(true);
                  }
                }, 1);
              })
            }
            server={{
              process: (
                fieldName,
                file,
                metadata,
                load,
                error,
                progress,
                abort
              ) => {
                const formData = new FormData();
                formData.append('file', file, file.name);
                formData.append('author', author);
                if (metadata.isPano) formData.append('isPano', metadata.isPano);
                if (metadata.lat) formData.append('lat', metadata.lat);
                if (metadata.lng) formData.append('lng', metadata.lng);

                const request = new XMLHttpRequest();
                //update from here
                const url = `${API_ROOT}/users/${
                  this.props.commonStore.userId
                }/media?user_id=${this.props.commonStore.userId}&access_token=${
                  this.props.commonStore.token
                }`;
                request.open('POST', url);

                // Should call the progress method to update the progress to 100% before calling load
                // Setting computable to false switches the loading indicator to infinite mode
                request.upload.onprogress = e => {
                  progress(e.lengthComputable, e.loaded, e.total);
                };

                // Should call the load method when done and pass the returned server file id
                // this server file id is then used later on when reverting or restoring a file
                // so your server knows which file to return without exposing that info to the client
                request.onload = () => {
                  if (request.status >= 200 && request.status < 300) {
                    // the load method accepts either a string (id) or an object
                    const responseJson = JSON.parse(request.responseText);
                    // this.props.panoStore.addPanoToRegistry(responseJson.response);
                    // this.props.userStore.addToCurrentUserPhotoCount();
                    load(responseJson.response.id);
                  } else {
                    // Can call the error method if something is wrong, should exit after
                    error('Error while uploading.');
                  }
                };

                request.send(formData);

                // Should expose an abort method so the request can be cancelled
                return {
                  abort: () => {
                    // This function is entered if the user has tapped the cancel button
                    request.abort();

                    // Let FilePond know the request has been cancelled
                    abort();
                  }
                };
              },
              revert: (uniqueFileId, load, error) => {
                // Should remove the earlier created temp file here
                // this.props.panoStore.deletePanoWithoutConfirm(uniqueFileId);

                // Can call the error method if something is wrong, should exit after
                error('Error while reverting your file.');

                // Should call the load method when done, no parameters required
                load();
              }
            }}
          />
        </div>
        <button
          type="submit"
          className="pt2 pr3 pb2 pl3 mb0 normal lh-title tc nowrap mt2 bn br2 white bg-navy pointer"
          // disabled={inProgress}
          // isLoading={inProgress}
        >
          Submit
        </button>
      </form>
    </div>
  );
});

export default UploadSubmission;
