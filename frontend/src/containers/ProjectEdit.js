import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import SpacesCarousel from '../components/SpacesCarousel';
import FieldsGenerate from '../components/FieldsGenerate';
import ProjectStore from '../stores/projectStore';
import SpaceList from '../components/SpaceList';
import ProjectShareModal from '../components/ProjectShareModal';

const ProjectEdit = observer(props => {
  const projectStore = useContext(ProjectStore);

  const [ready, setReady] = useState(false);
  const [currentSpace, setCurrentSpace] = useState(0);
  const [thisProject, setThisProject] = useState(null);
  const [showShareModal, setShareModal] = useState(false);

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
    projectStore.loadProject(projectSlug).then(project => {
      setThisProject(project);
    });
  }, [projectStore]);

  const deleteSpace = (spaceId, spaceIndex) => {
    if (window.confirm('Are you sure you want to delete this space?')) {
      if (spaceIndex === 0) spaceIndex = 1;
      projectStore.deleteSpace(spaceId);
      // setTimeout is required since click event of NavLink is taking over
      setTimeout(() => {
        props.history.push(`/lesson/${projectSlug}/edit/s/${spaceIndex - 1}`);
      }, 0);
    }
  };

  useEffect(() => {
    let spaceNumber = props.match.params.spaceId;
    if (!spaceNumber) spaceNumber = 0;

    setCurrentSpace(spaceNumber);
  }, [props.match.params]);

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Edit lesson - ${projectSlug}`}</title>
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
          <div className="center cf overflow-hidden w-50-ns">
            <div className="w-100 w-20-ns h-100 fl overflow-auto">
              <SpacesCarousel
                projectSlug={props.match.params.slug}
                config={projectStore.projectTheme.config}
                spaces={projectStore.spaces}
                spacesLength={projectStore.projectTheme.config.spaces.length}
                history={props.history}
                deleteSpace={deleteSpace}
              />
            </div>
            <div className="w-100 w-80-ns h-100 center ph3 ph0-ns fl overflow-auto">
              <div className="ml3-ns mv2">
                <button className="b--dark-green ba bg-green bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mr3 mt3 ph3 pv2 white pointer">
                  Save
                </button>
                {thisProject.theme.type.toLowerCase() === 'web' && (
                  <a
                    className="b--dark-blue ba bg-blue bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white mr3"
                    target="_blank"
                    href={`/lesson/${props.match.params.slug}/view`}
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                )}
                <button
                  onClick={() => {
                    setShareModal(true);
                  }}
                  className="b--dark-red ba bg-red bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mr3 mt3 ph3 pv2 white pointer"
                >
                  Publish
                </button>
              </div>
              <div className="ml3-ns">
                <h2 className="fw7 f2 mv0">Enter lesson fields</h2>
                {projectStore.spaces[currentSpace] && (
                  <FieldsGenerate
                    fields={projectStore.spaces[currentSpace].fields}
                    spaceId={projectStore.spaces[currentSpace].id}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      <ProjectShareModal
        showModal={showShareModal}
        closeModal={() => {
          setShareModal(false);
        }}
        projectCode={thisProject && thisProject.code}
      />
    </React.Fragment>
  );
});

export default ProjectEdit;
