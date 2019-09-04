import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import Select from 'react-dropdown-select';
import ClassroomStore from '../stores/classroomStore';
import FieldLabel from '../components/FieldLabel';
import FieldInput from '../components/FieldInput';

const CreateClassroom = observer(({ history }) => {
  const classroomStore = useContext(ClassroomStore);

  const [classname, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [age, setAge] = useState(null);

  const handleSubmitForm = event => {
    event.preventDefault();
    classroomStore
      .createClassroom(classname, subject, age.value)
      .then(classroom => {
        history.push(`/classroom/${classroom.slug}/sessions`);
      });
  };

  return (
    <div className="w-80-ns w-100 pa3 center">
      <Helmet title="Create Classroom" />
      <form onSubmit={handleSubmitForm}>
        <section className="w-50-l w-100">
          <h3 className="f2">Create New Classroom</h3>
          <FieldLabel htmlFor="classname" className="b mid-gray">
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
          <FieldLabel htmlFor="subject" className="b mid-gray">
            Subject
          </FieldLabel>
          <FieldInput>
            <input
              type="text"
              className="mt1 db pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bn br2 w-100 outline-0"
              id="subject"
              placeholder="Enter class subject"
              value={subject}
              onChange={e => {
                setSubject(e.target.value);
              }}
            />
          </FieldInput>
          <FieldLabel htmlFor="subject" className="b mid-gray">
            Age
          </FieldLabel>
          <FieldInput>
            <Select
              options={[
                { label: '3-5', value: '3-5' },
                { label: '6-7', value: '6-7' },
                { label: '8-10', value: '8-10' },
                { label: '11-13', value: '11-13' },
                { label: '14-18', value: '14-18' },
                { label: '18+', value: '18+' }
              ]}
              placeholder="Choose Organization Type"
              labelField="label"
              valueField="value"
              dropdownGap={10}
              onChange={val => {
                setAge(val[0]);
              }}
              searchBy="label"
              className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100 f4"
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
            Create Classroom
          </button>
        </div>
      </form>
    </div>
  );
});

export default CreateClassroom;
