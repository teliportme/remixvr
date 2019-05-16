import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import SpacesCarousel from '../components/SpacesCarousel';
import FieldsGenerate from '../components/FieldsGenerate';
import ProjectStore from '../stores/projectStore';

// const StyledDiv = styled.div`
//   display: flex;
//   flex: 1 1 auto;
//   overflow-y: auto;
//   flex-flow: row;
// `;

const ProjectEdit = observer(props => {
  const projectStore = useContext(ProjectStore);

  const [ready, setReady] = useState(false);
  const [currentSpace, setCurrentSpace] = useState(0);

  useEffect(() => {
    const projectSlug = props.match.params.slug;
    const currentSpace = props.match.params.space;
    if (!currentSpace) setCurrentSpace(0);
    projectStore.getProjectTheme(projectSlug).then(() => {
      projectStore.loadSpaces(projectSlug).then(() => {
        setReady(true);
        if (projectStore.spaces.length > currentSpace) {
          setCurrentSpace(0);
          console.log('space', currentSpace);
        }
      });
    });
  }, [projectStore]);

  return (
    ready && (
      <React.Fragment>
        {/* <StyledDiv className="cf"> */}
        {/* <div className="fl w-100 w-80-ns h-100">Main content</div> */}
        <div className="w-100 w-80-ns h-100 center pa2 measure">
          <FieldsGenerate fields={projectStore.spaces[currentSpace].fields} />
        </div>
        {/* </StyledDiv> */}
        <SpacesCarousel spaces={projectStore.spaces} />
      </React.Fragment>
    )
  );
});

export default ProjectEdit;
