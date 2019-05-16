import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectStore from '../stores/projectStore';
import UserStore from '../stores/userStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';

const Dashboard = observer(() => {
  const projectStore = useContext(ProjectStore);
  const userStore = useContext(UserStore);

  useEffect(() => {
    if (userStore.currentUser) {
      projectStore.setPredicate({ author: userStore.currentUser.username });
      projectStore.loadProjects();
    }
  }, [projectStore]);

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Dashboard" />
      <div>
        <Link
          to="/create"
          className="f6 link dim br2 ph3 pv2 mb2 dib white bg-blue"
        >
          Create project
        </Link>
      </div>
      <ul className="list pl0 ml0 center mw6 ba b--light-silver br2">
        {projectStore.count > 0 &&
          projectStore.projects.map(project => (
            <li key={project.slug} className="bb b--light-silver">
              <Link
                to={`/project/${project.slug}/edit`}
                className="blue db f4 fw5 link ph3 pt3"
              >
                {project.title}
              </Link>
              <span className="db f6 gray i pb3 ph3 pt1 truncate">
                {dayjs(project.created_at).format('MMM D, YYYY')}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
});

export default Dashboard;
