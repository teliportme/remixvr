import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import ProjectStore from '../stores/projectStore';
import ReactModal from 'react-modal';

const SpacesCarousel = observer(
  ({ config, spaces, spacesLength, projectSlug }) => {
    const [showModal, setModal] = useState(true);
    const projectStore = useContext(ProjectStore);

    const createSpace = spaceType => {
      projectStore.createSpace(projectSlug, spaceType);
    };

    return (
      spacesLength > 1 && (
        <div className="column flex justify-center w-100">
          {spaces.map((space, index) => (
            <div
              className="w3 h3 bg-gray flex justify-center items-center ma2"
              key={space.id}
            >
              {index}
            </div>
          ))}
          <div>Add new space</div>
          <ReactModal
            appElement={document.body}
            isOpen={showModal}
            className="step2 absolute b--black-20 ba bg-white br2 outline-0 pa3 ph4 top-2 bottom-1 left-1 right-1 flex justify-center"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            onRequestClose={() => {
              setModal(false);
            }}
          >
            <div className="flex flex-column">
              <div style={{ flex: '1 1 auto' }}>
                {config.spaces.map(space => (
                  <div key={space.type}>
                    <span>{space.type}</span>
                    <button
                      onClick={() => {
                        createSpace(space.type);
                      }}
                    >
                      Choose
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ flex: '0 1' }} className="tc">
                <button>close</button>
              </div>
            </div>
          </ReactModal>
        </div>
      )
    );
  }
);

export default SpacesCarousel;
