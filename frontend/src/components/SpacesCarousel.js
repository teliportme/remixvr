import React, { useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import ProjectStore from '../stores/projectStore';
import ReactModal from 'react-modal';
import SpaceList from '../components/SpaceList';

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
            <SpaceList
              spaces={config.spaces}
              projectSlug={projectSlug}
              history={history}
              closeModal={closeModal}
            />
          </ReactModal>
        </div>
      )
    );
  }
);

export default SpacesCarousel;
