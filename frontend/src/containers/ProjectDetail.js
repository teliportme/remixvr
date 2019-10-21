import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ReactModal from 'react-modal';
import { Helmet } from 'react-helmet';
import ProjectStore from '../stores/projectStore';
import useRouter from '../components/useRouter';
import MetaBanner from './Home/remix-vr-classrooms.png';

const ProjectDetail = observer(props => {
  const projectStore = useContext(ProjectStore);
  const projectSlug = props.match.params.slug;

  const [project, setProject] = useState();
  const [showModal, setModal] = useState(false);
  const [title, setTitle] = useState('');
  const { history } = useRouter();

  useEffect(() => {
    projectStore.loadProject(projectSlug).then(project => {
      setProject(project);
    });
  }, []);

  function closeModal() {
    setModal(false);
  }

  function remixProject(event) {
    event.preventDefault();
    projectStore.remixProject(project.slug, { title }).then(({ project }) => {
      console.log(project);
      history.push(`/lesson/${project.slug}/edit/s/0`);
    });
  }

  return (
    project && (
      <div className="w-100 w-80-ns h-100 center ph3 ph0-ns measure-ns">
        <Helmet>
          <title>{project.title}</title>
          <meta
            property="description"
            content={
              project.description ||
              'Start using VR in classrooms to boost student engagement. Remix VR also provides Global citizenship tools for GCED.'
            }
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`https://remixvr.org/lesson/${projectSlug}`}
          />
          <meta property="og:title" content={`${project.title} on RemixVR`} />
          <meta
            property="og:description"
            content={
              project.description ||
              'Start using VR in classrooms to boost student engagement. Remix VR also provides Global citizenship tools for GCED.'
            }
          />
          <meta property="og:image" content={MetaBanner} />

          <meta property="twitter:card" content="summary_large_image" />
          <meta
            property="twitter:url"
            content={`https://remixvr.org/lesson/${projectSlug}`}
          />
          <meta
            property="twitter:title"
            content={`${project.title} on RemixVR`}
          />
          <meta
            property="twitter:description"
            content={
              project.description ||
              'Start using VR in classrooms to boost student engagement. Remix VR also provides Global citizenship tools for GCED.'
            }
          />
          <meta property="twitter:image" content={MetaBanner} />
        </Helmet>
        <h1 className="ttc">{project.title}</h1>
        {project.theme.type.toLowerCase() === 'web' && (
          <a
            className="b--dark-gray ba bg-gray bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white pointer mr3"
            target="_blank"
            href={`/lesson/${project.slug}/view`}
            rel="noopener noreferrer"
          >
            View Project
          </a>
        )}
        <button
          className="b--dark-blue ba bg-blue bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white pointer"
          onClick={() => {
            setModal(true);
          }}
        >
          Remix Project
        </button>
        <p>This is the project description</p>

        <ReactModal
          appElement={document.body}
          isOpen={showModal}
          className="absolute shadow-2 bg-white br2 outline-0 pa2 top-2 bottom-1 left-1 right-1 flex justify-center"
          shouldCloseOnOverlayClick={true}
          shouldCloseOnEsc={true}
          onRequestClose={closeModal}
        >
          <form onSubmit={remixProject}>
            <div className="mb3">
              <label htmlFor="title" className="b mid-gray">
                Enter title for project
              </label>
              <input
                type="text"
                className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 ba br2 w-100"
                id="title"
                placeholder="Project Title"
                required
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                }}
              />
            </div>

            <div className="tr">
              <button
                type="submit"
                className="pt2 pr3 pb2 pl3 mb0 normal lh-title tc nowrap mt2 bn br2 white bg-navy pointer"
                // disabled={inProgress}
                // isLoading={inProgress}
              >
                Remix & Create Project
              </button>
            </div>
          </form>
        </ReactModal>
      </div>
    )
  );
});

export default ProjectDetail;
