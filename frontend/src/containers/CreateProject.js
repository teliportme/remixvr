import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import ThemeStore from '../stores/themeStore';
import ProjectStore from '../stores/projectStore';
import FieldLabel from '../components/FieldLabel';
import FieldInput from '../components/FieldInput';

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
        <section className="w-50-l w-100">
          <h3 className="f2">Create New Project</h3>
          <FieldLabel htmlFor="title" className="b mid-gray">
            Project title
          </FieldLabel>
          <FieldInput>
            <input
              type="text"
              className="mt1 db pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bn br2 w-100 outline-0"
              id="title"
              placeholder="Project Title"
              required
              value={title}
              onChange={e => {
                setTitle(e.target.value);
              }}
            />
          </FieldInput>
          <FieldLabel htmlFor="description" className="b mid-gray mt3 db">
            Project description
          </FieldLabel>
          <FieldInput>
            <input
              type="text"
              className="mt1 db pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bn br2 w-100 outline-0"
              id="description"
              placeholder="Project Description"
              value={description}
              onChange={e => {
                setDescription(e.target.value);
              }}
            />
          </FieldInput>
          <FieldLabel htmlFor="description" className="b mid-gray mt3 db">
            Select Theme
          </FieldLabel>
          <FieldInput>
            {themeStore.themes.map(theme => (
              <article
                key={theme.slug}
                className="br2 ba dark-gray b--black-10 mv4 w-50 mw5"
              >
                <img
                  src={theme.cover_image}
                  className="db w-100 br2 br--top"
                  alt="Theme preview"
                />
                <div className="pa2 ph3-ns pb3-ns bg-white">
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
                      className="bg-dark-green b--green bb bl-0 br-0 br1 br2 bt-0 bw2 dib f6 link mb2 pv1 white pointer"
                    >
                      Theme Selected
                    </button>
                  ) : (
                    <button
                      onClick={event => {
                        event.preventDefault();
                        setTheme(theme.slug);
                      }}
                      className="b--dark-green bb bg-green bl-0 br-0 br1 br2 bt-0 bw2 dib f6 link mb2 pv1 white pointer"
                    >
                      Use Theme
                    </button>
                  )}
                </div>
              </article>
            ))}
          </FieldInput>
        </section>
        <div className="tc tl-ns">
          <button
            type="submit"
            className="b--dark-blue bb bg-blue bl-0 br-0 br2 bt-0 bw2 lh-title mb0 mt2 normal nowrap pb2 pl3 pointer pr3 pt2 tc white dim outline-0"
            // disabled={inProgress}
            // isLoading={inProgress}
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
});

export default CreateProject;
