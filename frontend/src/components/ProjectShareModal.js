import React from 'react';
import ReactModal from 'react-modal';
import { FaUserLock } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';
import { FaSchool } from 'react-icons/fa';

const ProjectShareModal = ({ showModal, closeModal, projectCode }) => (
  <ReactModal
    appElement={document.body}
    isOpen={showModal}
    className="absolute shadow-2 bg-white br2 outline-0 pa2 top-2 bottom-1 left-1 right-1 measure-ns center"
    shouldCloseOnOverlayClick={true}
    shouldCloseOnEsc={true}
    onRequestClose={closeModal}
  >
    <div className="tc relative">
      <span className="b b--dashed b--gray ba br2 code dib f2 mt3 pa2 tracked">
        {projectCode}
      </span>
      <span className="dark-gray db f6 mt1">
        Share this code to access this lesson
      </span>
    </div>
    <h2 className="dark-gray tc mt4">Lesson Sharing</h2>
    <div className="flex justify-center">
      <button className="b--light-blue bg-lightest-blue br2 flex flex-column items-center justify-around mh2 pointer outline-0 dim">
        <FaUserFriends className="h2 w2 blue pt2" />
        <span className="f4 pb2">Public</span>
      </button>
      <button className="b--light-blue br2 flex flex-column items-center justify-around mh2 pointer outline-0 dim">
        <FaUserLock className="h2 w2 blue pt2" />
        <span className="f4 pb2">Private</span>
      </button>
      <button className="b--light-blue br2 flex flex-column items-center justify-around mh2 pointer outline-0 dim">
        <FaSchool className="h2 w2 blue pt2" />
        <span className="f4 pb2">School</span>
      </button>
    </div>
    <div className="absolute bottom-1 tc w-100">
      <button
        className="b--dark-gray ba bg-gray bl-0 br-0 br3 bt-0 bw2 dib dim f6 link mt3 ph3 pv2 white pointer"
        onClick={closeModal}
      >
        close
      </button>
    </div>
  </ReactModal>
);

export default ProjectShareModal;
