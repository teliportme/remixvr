import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import ReactModal from 'react-modal';
import ProjectStore from '../stores/projectStore';

const ProjectDetail = observer(props => {
  const projectStore = useContext(ProjectStore);
  const projectSlug = props.match.params.slug;

  const [project, setProject] = useState();
  const [showModal, setModal] = useState(false);
  const [title, setTitle] = useState('');

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
    projectStore.remixProject(project.slug, { title }).then(project => {
      console.log(project);
    });
  }

  return (
    project && (
      <div className="w-100 w-80-ns h-100 center ph3 ph0-ns measure-ns">
        <h1 className="ttc">{project.title}</h1>
        <a
          className="b--dark-blue ba bg-blue bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white"
          target="_blank"
          href={`/project/${project.slug}/view`}
          rel="noopener noreferrer"
        >
          View Project
        </a>
        <button
          className="b--dark-blue ba bg-blue bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white"
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
                Login
              </button>
            </div>
          </form>
        </ReactModal>
      </div>
    )
  );
});

export default ProjectDetail;
