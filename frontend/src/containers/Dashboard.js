import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProjectStore from '../stores/projectStore';
import UserStore from '../stores/userStore';
import { Helmet } from 'react-helmet';
import { observer } from 'mobx-react-lite';
import dayjs from 'dayjs';
import { IoMdOpen } from 'react-icons/io';
import styled from 'styled-components';
import SavingButton from '../components/SavingButton';
import LoadingSpinner from '../components/LoadingSpinner';
import randomColor from 'randomcolor';

const Lesson = ({ project }) => {
  const color = randomColor({ luminosity: 'light' });
  return (
    <article className="br2 dark-gray w-100 center">
      <div className="h3 br--top br2" style={{ background: color }} />
      <div className="pa2 ph3-ns pb3-ns bl br bb b--light-gray br2">
        <button
          className="b--black-05 bg-light-gray br-pill f6 fw7 mv1 pv1 tc"
          style={{ userSelect: 'none' }}
        >
          {project.theme.type || 'Web'}
        </button>
        <div className="b--dashed b--gray ba child code dib fr gray ml3 mt1 pa1 tracked">
          {project.code}
        </div>
        <div className="dt w-100 mt1">
          <div className="dtc">
            <h3 className="f5 f4-ns mv0">
              <Link
                to={`/lesson/${project.slug}/edit/s/0`}
                className="f3 fw7 link near-black"
              >
                {project.title}
              </Link>
            </h3>
          </div>
        </div>
        <span className="db f6 gray pv2 truncate">
          {dayjs(project.created_at).format('MMM D, YYYY')}
        </span>
        <div className="mt3">
          <Link
            to={`/lesson/${project.slug}/edit/s/0`}
            className="b bn gray mt2 pa0 pointer underline-hover mr2 link"
          >
            Edit
          </Link>
          <Link
            to={`/lesson/${project.slug}`}
            target="_blank"
            className="b bn gray mt2 pa0 pointer underline-hover link"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
};

const LessonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 1fr;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;

  @media screen and (min-width: 30em) {
    grid-template-columns: 1fr;
  }
  @media screen and (min-width: 30em) and (max-width: 65em) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (min-width: 65em) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media screen and (min-width: 90em) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media screen and (min-width: 119em) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const Dashboard = observer(() => {
  const projectStore = useContext(ProjectStore);
  const userStore = useContext(UserStore);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const inputEl = useRef(null);

  useEffect(() => {
    if (userStore.currentUser) {
      projectStore.setPredicate({ author: userStore.currentUser.username });
      projectStore.loadProjects();
    }
  }, [projectStore, userStore.currentUser]);

  const handleSearchProjects = event => {
    event.preventDefault();
    projectStore.searchProjects(inputEl.current.value).then(() => {
      setShowSearchResults(true);
    });
  };

  const clearSearch = event => {
    event.preventDefault();
    setShowSearchResults(false);
    inputEl.current.value = '';
  };

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Dashboard" />
      <div className="b--dark-blue bb flex mb3">
        <div className="b b--dark-blue bb black bw2 dark-blue f3 pb2 pt2 tc ph4">
          My Lessons
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
        Create lesson
      </Link>
      <div>
        <form className="pv3 flex" onSubmit={handleSearchProjects}>
          <input
            className="bg-light-gray black-80 bn br--left-ns br2-ns f5-l f6 input-reset lh-solid pa3 outline-0"
            placeholder="Search Lessons"
            type="text"
            name="Search"
            ref={inputEl}
          />
          <SavingButton
            className="bg-animate bg-black-70 bn br--right-ns br2-ns button-reset f5-l f6 hover-bg-black pointer pv3 tc white outline-0 justify-center w4"
            type="submit"
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
            <LessonContainer>
              {projectStore.searchResults.map(project => (
                <Lesson project={project} key={project.slug} />
              ))}
            </LessonContainer>
          ) : (
            <div className="lh-copy mt3 dark-gray">No results found!</div>
          )
        ) : projectStore.count > 0 ? (
          <LessonContainer>
            {projectStore.projects.map(project => (
              <Lesson project={project} key={project.slug} />
            ))}
          </LessonContainer>
        ) : (
          <div className="lh-copy mt3 dark-gray">
            You haven't created any lessons yet!
          </div>
        )
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
});

export default Dashboard;
