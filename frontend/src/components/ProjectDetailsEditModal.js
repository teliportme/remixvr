import React, { useState, useContext } from 'react';
import ReactModal from 'react-modal';
import FieldInput from './FieldInput';
import FieldLabel from './FieldInput';
import ProjectStore from '../stores/projectStore';
import CommonStore from '../stores/commonStore';

const ProjectDetailsEditModal = ({ showModal, closeModal, project }) => {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);

  const projectStore = useContext(ProjectStore);
  const commonStore = useContext(CommonStore);

  const handleSubmitForm = event => {
    event.preventDefault();
    closeModal();
    projectStore
      .editProject(project.slug, {
        title,
        description
      })
      .then(() => commonStore.setSnackMessage('Lesson details updated'));
  };

  return (
    <ReactModal
      appElement={document.body}
      isOpen={showModal}
      className="absolute shadow-2 bg-white br2 outline-0 pa2 ph3 top-2 left-1 right-1 measure-ns center"
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEsc={true}
      onRequestClose={closeModal}
    >
      <form onSubmit={handleSubmitForm}>
        <h3 className="f2">Update Lesson Details</h3>
        <FieldLabel htmlFor="title" className="b mid-gray">
          Lesson title
        </FieldLabel>
        <FieldInput>
          <input
            type="text"
            className="mt1 db pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bn br2 w-100 outline-0"
            id="title"
            placeholder="Lesson Title"
            required
            value={title}
            onChange={e => {
              setTitle(e.target.value);
            }}
          />
        </FieldInput>
        <FieldLabel htmlFor="description" className="b mid-gray mt3 db">
          Lesson description
        </FieldLabel>
        <FieldInput>
          <textarea
            style={{ resize: 'none' }}
            rows="3"
            className="mt1 db pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bn br2 w-100 outline-0"
            id="description"
            placeholder="Lesson Description"
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
          />
        </FieldInput>
        <div className="tc tl-ns">
          <button
            type="submit"
            className="b--dark-blue bb bg-blue bl-0 br-0 br2 bt-0 bw2 lh-title mb0 mt2 normal nowrap pb2 pl3 pointer pr3 pt2 tc white dim outline-0 mv3"
          >
            Update Lesson
          </button>
          <button
            className="b--gray-1 bb bg-gray-3 bl-0 br-0 br2 bt-0 bw2 dim lh-title mb0 ml3 mt2 mv3 normal nowrap outline-0 pb2 pl3 pointer pr3 pt2 tc white"
            onClick={event => {
              event.preventDefault();
              closeModal();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

export default ProjectDetailsEditModal;
