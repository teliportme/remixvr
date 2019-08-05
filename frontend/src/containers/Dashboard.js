import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectStore from '../stores/projectStore';
import UserStore from '../stores/userStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import SavingButton from '../components/SavingButton';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = observer(() => {
  const projectStore = useContext(ProjectStore);
  const userStore = useContext(UserStore);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    if (userStore.currentUser) {
      projectStore.setPredicate({ author: userStore.currentUser.username });
      projectStore.loadProjects();
    }
  }, [projectStore, userStore.currentUser]);

  const handleSearchProjects = event => {
    event.preventDefault();
    projectStore.searchProjects(searchTerm).then(() => {
      setShowSearchResults(true);
    });
  };

  const clearSearch = event => {
    event.preventDefault();
    setShowSearchResults(false);
    setSearchTerm('');
  };

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Dashboard" />
      <div className="b--dark-blue bb flex mb3">
        <div className="b b--dark-blue bb black bw2 dark-blue f3 pb2 pt2 tc ph4">
          My Projects
        </div>
        <Link
          to="/gced-dashboard"
          className="b--black black bw2 f3 hover-bg-light-gray link pb2 ph4 pt2 tc"
        >
          GCED
        </Link>
      </div>
      <Link
        to="/create"
        className="f5 link dim br2 ph3 pv2 mb2 dib white bg-blue bb bw2 b--dark-blue"
      >
        Create project
      </Link>
      <div>
        <form className="pv3 flex" onSubmit={handleSearchProjects}>
          <input
            className="bg-light-gray black-80 bn br--left-ns br2-ns f5-l f6 input-reset lh-solid pa3 outline-0"
            placeholder="Search Projects"
            type="text"
            name="Search"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
          />
          <SavingButton
            className="bg-animate bg-black-70 bn br--right-ns br2-ns button-reset f5-l f6 hover-bg-black pointer pv3 tc white outline-0 justify-center w4"
            type="submit"
            disabled={!searchTerm}
            isLoading={projectStore.isSearching}
          >
            Search
          </SavingButton>
          <button
            className="bg-white bn f6 gray ml2 underline outline-0 pointer"
            onClick={clearSearch}
          >
            Clear
          </button>
        </form>
      </div>
      {!projectStore.isLoading && !projectStore.isSearching ? (
        showSearchResults ? (
          projectStore.searchResults.length > 0 ? (
            <ul className="list pl0 ml0 mw6 bn">
              {projectStore.searchResults.map(project => (
                <li key={project.slug} className="bt pt3 b--light-green">
                  <button className="b--light-green bg-washed-green br-pill f6 fw7 pv1 tc ttc">
                    {`${project.theme.title} Theme`}
                  </button>
                  <Link
                    to={`/project/${project.slug}/edit/s/0`}
                    className="db f3 fw7 link near-black pt2"
                  >
                    {project.title}
                  </Link>
                  <span className="db f6 gray pv2 truncate">
                    {dayjs(project.created_at).format('MMM D, YYYY')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="lh-copy mt3 dark-gray">No results found!</div>
          )
        ) : projectStore.count > 0 ? (
          <ul className="list pl0 ml0 mw6 bn">
            {projectStore.projects.map(project => (
              <li key={project.slug} className="bt pt3 b--light-green">
                <button className="b--light-green bg-washed-green br-pill f6 fw7 pv1 tc ttc">
                  {`${project.theme.title} Theme`}
                </button>
                <Link
                  to={`/project/${project.slug}/edit/s/0`}
                  className="db f3 fw7 link near-black pt2"
                >
                  {project.title}
                </Link>
                <span className="db f6 gray pv2 truncate">
                  {dayjs(project.created_at).format('MMM D, YYYY')}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="lh-copy mt3 dark-gray">
            You haven't created any projects yet!
          </div>
        )
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
});

export default Dashboard;
