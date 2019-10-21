import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import ReactModal from 'react-modal';
import SpaceList from '../components/SpaceList';
import SpaceImage from '../components/SpaceImage';
import { IoIosCloseCircle } from 'react-icons/io';

const SpacesCarousel = observer(
  ({ config, spaces, spacesLength, projectSlug, history, deleteSpace }) => {
    const [showModal, setModal] = useState(false);

    function closeModal() {
      setModal(false);
    }

    return (
      spacesLength > 1 && (
        <div className="absolute bg-white h-100 overflow-auto relative-ns w-100">
          {spaces.map((space, index) => (
            <NavLink
              activeClassName="bg-lightest-blue"
              className="b b--light-blue ba br3 f4 flex h3 items-center justify-center mh2 mv3 no-underline outline-0 pointer relative hide-child w-80"
              key={space.id}
              to={`/lesson/${projectSlug}/edit/s/${index}`}
            >
              <SpaceImage type={space.type} />
              <IoIosCloseCircle
                onClick={deleteSpace.bind(null, space.id, index)}
                className="absolute dark-gray child"
                style={{ top: '-0.6rem', right: '-0.5rem' }}
              />
            </NavLink>
          ))}
          <button
            onClick={() => {
              setModal(true);
            }}
            className="w-80 h3 ma2 bg-blue white f6 bn pointer outline-0 br3"
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
