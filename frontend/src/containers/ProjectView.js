import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import ProjectStore from '../stores/projectStore';

const ProjectView = observer(props => {
  const projectStore = useContext(ProjectStore);
  const projectSlug = props.match.params.slug;

  useEffect(() => {
    projectStore.getProjectTheme(projectSlug);
    console.log(props.match);
  }, []);

  return (
    projectStore.projectTheme.slug && (
      <iframe
        width="100%"
        height="100%"
        allowvr="yes"
        allowFullScreen="yes"
        scrolling="no"
        src={`${projectStore.projectTheme.url}?project=${projectSlug}&root=${
          process.env.REACT_APP_API_ROOT
        }`}
      />
    )
  );
});

export default ProjectView;
