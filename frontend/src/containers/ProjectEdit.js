import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import SpacesCarousel from '../components/SpacesCarousel';
import FieldsGenerate from '../components/FieldsGenerate';
import ProjectStore from '../stores/projectStore';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  flex: 1 1 auto;
  overflow-y: auto;
  flex-flow: row;
`;

const ProjectEdit = observer(props => {
  const projectStore = useContext(ProjectStore);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const projectSlug = props.match.params.slug;
    projectStore.getProjectTheme(projectSlug).then(() => {
      projectStore.loadSpaces(projectSlug).then(() => {
        setReady(true);
      });
    });
  }, [projectStore]);

  return (
    ready && (
      <React.Fragment>
        <StyledDiv className="cf">
          <div className="fl w-100 w-80-ns h-100">Main content</div>
          <div className="fl w-100 w-20-ns h-100">
            Sidebar
            <FieldsGenerate config={projectStore.projectTheme.config} />
          </div>
        </StyledDiv>
        <SpacesCarousel spaces={projectStore.spaces} />
      </React.Fragment>
    )
  );
});

export default ProjectEdit;
