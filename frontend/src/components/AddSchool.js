import React, { useState, useContext } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import styled from 'styled-components';
import SchoolStore from '../stores/orgStore';
import CommonStore from '../stores/commonStore';
import SavingButton from './SavingButton';

const AddSchool = ({ closeModal }) => {
  const [schoolName, setSchoolName] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');

  const schoolStore = useContext(SchoolStore);
  const commonStore = useContext(CommonStore);

  const StyledCountryDropdown = styled(CountryDropdown)`
    appearance: none;
  `;
  const StyledRegionDropdown = styled(RegionDropdown)`
    appearance: none;
  `;

  const createSchool = () => {
    schoolStore.createOrg(schoolName, country, region).then(() => {
      commonStore.setSnackMessage(
        'School Added',
        'Now you can search for your school'
      );
      closeModal();
    });
  };

  return (
    <div className="center measure mb4 pb4 ph3">
      <h3 className="f3 f2-ns dark-gray tc">Add new school</h3>
      <div className="mb3">
        <label htmlFor="schoolname" className="b mid-gray">
          School Name
        </label>
        <input
          type="text"
          className="mt1 db w1 pt2 pr3 pb2 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
          id="schoolname"
          placeholder="Enter School Name"
          required
          value={schoolName}
          onChange={e => {
            setSchoolName(e.target.value);
          }}
        />
      </div>
      <div className="mb3">
        <label htmlFor="schoolcountry" className="b mid-gray">
          School Country
        </label>
        <StyledCountryDropdown
          className="ba b--mid-gray mid-gray pa2 pointer w-100 bg-white"
          value={country}
          id="schoolcountry"
          onChange={val => setCountry(val)}
          priorityOptions={['IN', 'US', 'GB', 'CA']}
        />
      </div>
      <div className="mb3">
        <label htmlFor="schoolregion" className="b mid-gray">
          School Region
        </label>
        <StyledRegionDropdown
          disableWhenEmpty={true}
          className="ba b--mid-gray mid-gray pa2 pointer w-100 bg-white"
          id="schoolregion"
          country={country}
          value={region}
          onChange={val => setRegion(val)}
        />
      </div>
      <div className="tr">
        <button
          type="submit"
          className="bg-dark-gray bn br2 lh-title mb0 mr2 mt2 normal nowrap pb2 pl3 pointer pr3 pt2 tc white"
          disabled={schoolStore.savingSchool}
          onClick={closeModal}
        >
          Cancel
        </button>
        <SavingButton
          type="submit"
          className="bg-dark-green bn br2 lh-title mb0 mt2 normal nowrap pb2 pl3 pointer pr3 pt2 tc white"
          disabled={schoolStore.savingSchool}
          isLoading={schoolStore.savingSchool}
          onClick={createSchool}
        >
          Add School
        </SavingButton>
      </div>
    </div>
  );
};

export default AddSchool;
