import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import ProjectStore from '../stores/projectStore';

const ProjectView = observer(props => {
  const projectStore = useContext(ProjectStore);
  const projectSlug = props.match.params.slug;
  const [project, setProject] = useState();

  useEffect(() => {
    projectStore.getProjectTheme(projectSlug);
    projectStore.loadProject(projectSlug).then(project => {
      setProject(project);
    });
  }, []);

  return (
    <React.Fragment>
      {project && (
        <Helmet>
          <title>{project.title}</title>
        </Helmet>
      )}
      {projectStore.projectTheme.slug && (
        <div
          className="w-100 h-100 overflow-hidden"
          style={{ background: '#111' }}
        >
          <iframe
            title={projectSlug}
            className="bn"
            width="100%"
            height="100%"
            allowvr="yes"
            allowFullScreen="yes"
            scrolling="no"
            src={`${
              projectStore.projectTheme.url
            }?project=${projectSlug}&root=${process.env.REACT_APP_API_ROOT}`}
          />
        </div>
      )}
    </React.Fragment>
  );
});

export default ProjectView;
