import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Select from 'react-dropdown-select';
import CommunityImg from './community-class.svg';
import ClassroomStore from '../../stores/classroomStore';
import SavingButton from '../../components/SavingButton';

const StyledAgeSearch = styled(Select)`
  border: 1px solid #555 !important;
  border-radius: 0.25rem !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
  min-height: 38px;
`;

const SignupGCEDClass = observer(({ history }) => {
  const classroomStore = useContext(ClassroomStore);

  const [classname, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [age, setAge] = useState(null);

  const handleSubmitForm = event => {
    event.preventDefault();
    classroomStore
      .createClassroom(classname, subject, age.value)
      .then(classroom => {
        history.push(`/gced-signup-create-bubble/classroom/${classroom.slug}`);
      });
  };

  return (
    <div className="cf h-100">
      <Helmet>
        <title>Create Classroom</title>
      </Helmet>
      <div className="bg-light-gray fl w-100 w-50-ns h-25 h-100-ns flex justify-center items-center">
        <img src={CommunityImg} className="h-75 h-50-ns w-90" alt="map" />
      </div>
      <div className="w-100 w-50-ns fl h-100 flex-ns items-center">
        <div className="center w-100 w-70-l w-90-m mb4 pb4 ph3">
          <h3 className="f3 f1-ns dark-gray tc">Create Classroom</h3>
          <form onSubmit={handleSubmitForm}>
            <div className="mb3 mt3">
              <label htmlFor="classname" className="b mid-gray">
                Classroom Name
              </label>
              <input
                type="text"
                className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
                id="classname"
                placeholder="Enter Class Name"
                required
                value={classname}
                onChange={e => {
                  setClassName(e.target.value);
                }}
              />
            </div>
            <div className="mb3">
              <label htmlFor="subject" className="b mid-gray">
                Subject
              </label>
              <input
                type="text"
                className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
                id="subject"
                placeholder="Enter class subject"
                value={subject}
                onChange={e => {
                  setSubject(e.target.value);
                }}
              />
            </div>
            <div className="mb3">
              <label htmlFor="subject" className="b mid-gray">
                Select Age Range
              </label>
              <StyledAgeSearch
                options={[
                  { label: '3-5', value: '3-5' },
                  { label: '6-7', value: '6-7' },
                  { label: '8-10', value: '8-10' },
                  { label: '11-13', value: '11-13' },
                  { label: '14-18', value: '14-18' },
                  { label: '18+', value: '18+' }
                ]}
                placeholder="Choose age range"
                labelField="label"
                valueField="value"
                dropdownGap={10}
                onChange={val => {
                  setAge(val[0]);
                }}
                searchBy="label"
                className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100 f4"
              />
            </div>
            <div className="tr">
              <SavingButton
                type="submit"
                className="bg-dark-green bn br2 lh-title mb0 mt2 normal nowrap pl3 pointer pr3 pv3 tc white"
                disabled={classroomStore.isCreatingClassroom}
                isLoading={classroomStore.isCreatingClassroom}
              >
                Create Class
              </SavingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default SignupGCEDClass;
