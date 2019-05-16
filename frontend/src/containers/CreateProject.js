import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import ThemeStore from '../stores/themeStore';
import ProjectStore from '../stores/projectStore';

const CreateProject = observer(({ history }) => {
  const themeStore = useContext(ThemeStore);
  const projectStore = useContext(ProjectStore);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTheme, setTheme] = useState('');

  useEffect(() => {
    themeStore.loadThemes();
  }, []);

  const handleSubmitForm = event => {
    event.preventDefault();
    projectStore
      .createProject(title, description, selectedTheme)
      .then(({ project }) => {
        history.push(`/project/${project.slug}/edit`);
      });
  };

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Create Project" />
      <form onSubmit={handleSubmitForm}>
        <section className="w-30-l w-100">
          <h3 className="f2">Create New Project</h3>
          <label htmlFor="title" className="b mid-gray">
            Project title
          </label>
          <input
            type="text"
            className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
            id="title"
            placeholder="Project Title"
            required
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
          <label htmlFor="description" className="b mid-gray mt3 db">
            Project description
          </label>
          <input
            type="text"
            className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
            id="description"
            placeholder="Project Description"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
          />
        </section>
        <section>
          <h3>Select Theme</h3>
          {themeStore.themes.map(theme => (
            <article
              key={theme.slug}
              className="br2 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw5"
            >
              <img
                src={theme.cover_image}
                className="db w-100 br2 br--top"
                alt="Theme preview"
              />
              <div className="pa2 ph3-ns pb3-ns">
                <div className="dt w-100 mt1">
                  <div className="dtc">
                    <h1 className="f5 f4-ns mv0">{theme.title}</h1>
                    <h2 className="gray f6 fw4 pt1 mv0">
                      By {theme.author.username}
                    </h2>
                  </div>
                  <div className="dtc tr" />
                </div>
                <p className="f6 lh-copy measure mt2 mid-gray">
                  {theme.description}
                </p>
                {theme.slug === selectedTheme ? (
                  <button
                    onClick={() => setTheme('')}
                    className="f6 link dim br1 ph3 pv2 mb2 dib white bg-dark-gray"
                  >
                    Theme Selected
                  </button>
                ) : (
                  <button
                    onClick={event => {
                      event.preventDefault();
                      setTheme(theme.slug);
                    }}
                    className="f6 link dim br1 ph3 pv2 mb2 dib white bg-dark-gray"
                  >
                    Use Theme
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
        <div className="tl">
          <button
            type="submit"
            className="pt2 pr3 pb2 pl3 mb0 normal lh-title tc nowrap mt2 bn br2 white bg-navy pointer"
            // disabled={inProgress}
            // isLoading={inProgress}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
});

export default CreateProject;
