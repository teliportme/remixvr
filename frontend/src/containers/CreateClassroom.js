import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import ClassroomStore from '../stores/classroomStore';
import FieldLabel from '../components/FieldLabel';
import FieldInput from '../components/FieldInput';

const CreateClassroom = observer(({ history }) => {
  const classroomStore = useContext(ClassroomStore);

  const [classname, setClassName] = useState('');

  const handleSubmitForm = event => {
    event.preventDefault();
    classroomStore.createClassroom(classname).then(classroom => {
      history.push(`/classroom/${classroom.slug}/activities`);
    });
  };

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Create Classroom" />
      <form onSubmit={handleSubmitForm}>
        <section className="w-50-l w-100">
          <h3 className="f2">Create New Classroom</h3>
          <FieldLabel htmlFor="title" className="b mid-gray">
            Class Name
          </FieldLabel>
          <FieldInput>
            <input
              type="text"
              className="mt1 db pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bn br2 w-100 outline-0"
              id="classname"
              placeholder="Class name. Eg: 3B 2019"
              required
              value={classname}
              onChange={e => {
                setClassName(e.target.value);
              }}
            />
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

export default CreateClassroom;
