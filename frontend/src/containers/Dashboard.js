import React, { useContext, useEffect } from 'react';
import ProjectStore from '../stores/projectStore';
import UserStore from '../stores/userStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';

const Dashboard = observer(() => {
  const projectStore = useContext(ProjectStore);
  const userStore = useContext(UserStore);

  useEffect(() => {
    if (userStore.currentUser) {
      projectStore.setPredicate({ author: userStore.currentUser.username });
      projectStore.loadProjects().then(() => {
        console.log(projectStore.projects);
      });
    }
  }, [projectStore]);

  return (
    <div>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      {projectStore.count > 0 &&
        projectStore.projects.map(project => (
          <div key={project.slug}>{project.title}</div>
        ))}
    </div>
  );
});

export default Dashboard;
