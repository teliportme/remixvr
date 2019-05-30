import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import SpacesCarousel from '../components/SpacesCarousel';
import FieldsGenerate from '../components/FieldsGenerate';
import ProjectStore from '../stores/projectStore';

const ProjectEdit = observer(props => {
  const projectStore = useContext(ProjectStore);

  const [ready, setReady] = useState(false);
  const [currentSpace, setCurrentSpace] = useState(0);

  useEffect(() => {
    const projectSlug = props.match.params.slug;

    const urlParams = new URLSearchParams(window.location.search);
    let spaceNumber = urlParams.get('s');
    if (!spaceNumber) spaceNumber = 0;

    projectStore.getProjectTheme(projectSlug).then(() => {
      projectStore.loadSpaces(projectSlug).then(() => {
        setReady(true);

        if (
          spaceNumber - 1 < projectStore.spaces.length &&
          spaceNumber - 1 > 0
        ) {
          setCurrentSpace(spaceNumber - 1);
        }
      });
    });
  }, [projectStore]);

  return (
    ready && (
      <React.Fragment>
        <div className="w-100 w-80-ns h-100 center ph3 ph0-ns measure-ns">
          <h2 className="fw7 f2 mb0">Enter project fields</h2>
          <p className="f5 gray lh-copy">
            Fill the value for each field. These values will be used for
            creating and viewing your project.
          </p>
          <FieldsGenerate
            fields={projectStore.spaces[currentSpace].fields}
            spaceId={projectStore.spaces[currentSpace].id}
          />
          <a
            className="b--dark-blue ba bg-blue bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white"
            target="_blank"
            href={`/project/${props.match.params.slug}/view`}
            rel="noopener noreferrer"
          >
            View Project
          </a>
        </div>
        <SpacesCarousel
          spaces={projectStore.spaces}
          spacesLength={projectStore.projectTheme.config.spaces.length}
        />
      </React.Fragment>
    )
  );
});

export default ProjectEdit;
