import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import ProjectStore from '../stores/projectStore';

const SpaceList = observer(({ spaces, projectSlug, history, closeModal }) => {
  const projectStore = useContext(ProjectStore);
  const createSpace = spaceType => {
    projectStore.createSpace(projectSlug, spaceType).then(() => {
      history.push(
        `/project/${projectSlug}/edit/s/${projectStore.spaces.length - 1}`
      );
    });
  };

  return (
    <div className="flex flex-column">
      <div style={{ flex: '1 1 auto' }}>
        {spaces.map(space => (
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
                if (closeModal) closeModal();
              }}
            >
              Choose
            </button>
          </div>
        ))}
      </div>
      {closeModal && (
        <div style={{ flex: '0 1' }} className="tc">
          <button
            className="b--dark-gray ba bg-gray bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white pointer"
            onClick={closeModal}
          >
            close
          </button>
        </div>
      )}
    </div>
  );
});

export default SpaceList;
