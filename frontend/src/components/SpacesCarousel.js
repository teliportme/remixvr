import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import ProjectStore from '../stores/projectStore';
import ReactModal from 'react-modal';

const SpacesCarousel = observer(
  ({ config, spaces, spacesLength, projectSlug, history }) => {
    const [showModal, setModal] = useState(false);
    const projectStore = useContext(ProjectStore);

    const createSpace = spaceType => {
      projectStore.createSpace(projectSlug, spaceType).then(() => {
        history.push(
          `/project/${projectSlug}/edit/s/${projectStore.spaces.length - 1}`
        );
      });
    };

    function closeModal() {
      setModal(false);
    }

    return (
      spacesLength > 1 && (
        <div className="column flex justify-center w-100">
          {spaces.map((space, index) => (
            <NavLink
              activeClassName="bg-blue"
              className="b--dark-blue ba br3 bw1 dark-blue flex h3 items-center justify-center no-underline ma2 outline-0 pointer w3 b f4 outline-0"
              key={space.id}
              to={`/project/${projectSlug}/edit/s/${index}`}
            >
              {index + 1}
            </NavLink>
          ))}
          <button
            onClick={() => {
              setModal(true);
            }}
            className="w3 h3 ma2 bg-dark-blue white f6 bn pointer outline-0 br3"
          >
            Add new space
          </button>
          {/* Model lists the different space types, when clicked on choose button, space of the specified type is created */}
          <ReactModal
            appElement={document.body}
            isOpen={showModal}
            className="absolute shadow-2 bg-white br2 outline-0 pa2 top-2 bottom-1 left-1 right-1 flex justify-center"
            shouldCloseOnOverlayClick={true}
            shouldCloseOnEsc={true}
            onRequestClose={closeModal}
          >
            <div className="flex flex-column">
              <div style={{ flex: '1 1 auto' }}>
                {config.spaces.map(space => (
                  <div
                    key={space.type}
                    className="pa3 bg-light-gray br2 mb3 flex items-center justify-between ba b--black-05"
                  >
                    <div className="flex flex-column mr4">
                      <span className="f4 b ttc dark-gray">{space.title}</span>
                      <span className="pt1 dark-gray">
                        Add 360 images and text description.
                      </span>
                    </div>
                    <button
                      className="f6 link dim br2 ph3 pv2 dib white bg-purple br3 ba bw2 bl-0 br-0 bt-0 b--black pointer"
                      onClick={() => {
                        createSpace(space.type);
                        closeModal();
                      }}
                    >
                      Choose
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ flex: '0 1' }} className="tc">
                <button
                  className="b--dark-gray ba bg-gray bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white pointer"
                  onClick={closeModal}
                >
                  close
                </button>
              </div>
            </div>
          </ReactModal>
        </div>
      )
    );
  }
);

export default SpacesCarousel;
