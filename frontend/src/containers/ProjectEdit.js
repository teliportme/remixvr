import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import SpacesCarousel from '../components/SpacesCarousel';
import FieldsGenerate from '../components/FieldsGenerate';
import ProjectStore from '../stores/projectStore';
import SpaceList from '../components/SpaceList';

const ProjectEdit = observer(props => {
  const projectStore = useContext(ProjectStore);

  const [ready, setReady] = useState(false);
  const [currentSpace, setCurrentSpace] = useState(0);

  const projectSlug = props.match.params.slug;
  useEffect(() => {
    let spaceNumber = props.match.params.spaceId;

    if (!spaceNumber) spaceNumber = 0;

    projectStore.getProjectTheme(projectSlug).then(() => {
      projectStore.loadSpaces(projectSlug).then(() => {
        setReady(true);
        if (spaceNumber < projectStore.spaces.length && spaceNumber > 0) {
          setCurrentSpace(spaceNumber);
        }
      });
    });
  }, [projectStore]);

  useEffect(() => {
    let spaceNumber = props.match.params.spaceId;
    if (!spaceNumber) spaceNumber = 0;

    setCurrentSpace(spaceNumber);
  }, [props.match.params]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Edit project ${projectSlug}`}</title>
      </Helmet>
      {ready &&
        (projectStore.spaces.length === 0 ? (
          <div className="pa2 flex justify-center">
            <SpaceList
              spaces={projectStore.projectTheme.config.spaces}
              projectSlug={props.match.params.slug}
              history={props.history}
            />
          </div>
        ) : (
          <React.Fragment>
            <div className="w-100 w-80-ns h-100 center ph3 ph0-ns measure-ns">
              <SpacesCarousel
                projectSlug={props.match.params.slug}
                config={projectStore.projectTheme.config}
                spaces={projectStore.spaces}
                spacesLength={projectStore.projectTheme.config.spaces.length}
                history={props.history}
              />
              <h2 className="fw7 f2 mb0">Enter project fields</h2>
              <p className="f5 gray lh-copy">
                Fill the value for each field. These values will be used for
                creating and viewing your project.
              </p>
              <FieldsGenerate
                fields={projectStore.spaces[currentSpace].fields}
                spaceId={projectStore.spaces[currentSpace].id}
              />
              <button className="b--dark-green ba bg-green bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mr3 mt3 ph3 pv2 white pointer">
                Save Project
              </button>
              <a
                className="b--dark-blue ba bg-blue bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white"
                target="_blank"
                href={`/project/${props.match.params.slug}/view`}
                rel="noopener noreferrer"
              >
                View Project
              </a>
            </div>
          </React.Fragment>
        ))}
    </React.Fragment>
  );
});

export default ProjectEdit;
