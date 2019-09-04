import React, { useState, useContext, useEffect } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet';
import Select from 'react-dropdown-select';
import OrgStore from '../../stores/orgStore';
import ProfileStore from '../../stores/profileStore';
import UserStore from '../../stores/userStore';
import SavingButton from '../../components/SavingButton';
import MapImg from './map-monochrome.svg';

const StyledOrgSearch = styled(Select)`
  border: 1px solid #555 !important;
  border-radius: 0.25rem !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
  min-height: 38px;
`;

const AddOrganization = observer(({ history }) => {
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState({ value: 'school' });
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [showNewOrg, setNewOrg] = useState(false);
  const [selectedOrg, setOrg] = useState(null);
  const [nextUrl, setNextUrl] = useState('/dashboard');

  const orgStore = useContext(OrgStore);
  const profileStore = useContext(ProfileStore);
  const userStore = useContext(UserStore);

  const StyledCountryDropdown = styled(CountryDropdown)`
    appearance: none;
  `;
  const StyledRegionDropdown = styled(RegionDropdown)`
    appearance: none;
  `;

  const addOrgToProfile = event => {
    event.preventDefault();
    // add new org & add to profile
    if (showNewOrg) {
      orgStore
        .createOrg(orgName, orgType.value, country, region)
        .then(org => {
          profileStore.saveSchool(org.id);
        })
        .then(() => {
          history.push(nextUrl);
        });
    } else {
      // add existing org to profile
      profileStore.saveSchool(selectedOrg.id).then(() => {
        history.push(nextUrl);
      });
    }
  };

  useEffect(() => {
    if (userStore.currentUser.school_id) {
      history.push(nextUrl);
    }
    orgStore.loadOrgs();
    const isGCED = window.localStorage.getItem('gced-signup');
    if (isGCED) {
      setNextUrl('/create-classroom');
    }
  }, []);

  return (
    <div className="cf h-100">
      <Helmet>
        <title>Add Organization</title>
      </Helmet>
      <div className="bg-light-gray fl w-100 w-50-ns h-25 h-100-ns flex justify-center items-center">
        <img src={MapImg} className="h-75 h-50-ns w-90" alt="map" />
      </div>
      <div className="w-100 w-50-ns fl h-100 flex-ns items-center">
        <div className="center w-100 w-70-l w-90-m mb4 pb4 ph3">
          <h3 className="f3 f1-ns dark-gray tc">Add organization</h3>
          <form onSubmit={addOrgToProfile}>
            {!showNewOrg ? (
              <div className="mb3 mt3">
                <label htmlFor="schoolname" className="b mid-gray">
                  Select Organization/School{' '}
                  <span
                    className="f6 fr fw4 i underline gray pointer"
                    onClick={() => {
                      setNewOrg(true);
                    }}
                  >
                    Not listed?
                  </span>
                </label>
                <StyledOrgSearch
                  options={orgStore.orgs}
                  placeholder="Search Organization/School"
                  labelField="name_with_region"
                  valueField="id"
                  dropdownGap={10}
                  onChange={val => {
                    setOrg(val[0]);
                  }}
                  searchBy="name_with_region"
                  loading={orgStore.isLoading}
                  className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100 f4"
                />
              </div>
            ) : (
              <React.Fragment>
                <div className="mb3">
                  <label htmlFor="schoolname" className="b mid-gray">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100"
                    id="schoolname"
                    placeholder="Enter Org/School Name"
                    required
                    value={orgName}
                    onChange={e => {
                      setOrgName(e.target.value);
                    }}
                  />
                </div>
                <div className="mb3">
                  <label htmlFor="orgType" className="b mid-gray">
                    Type of Organization
                  </label>
                  <StyledOrgSearch
                    options={[
                      { label: 'School', value: 'school' },
                      { label: 'Non Profit', value: 'nonprofit' },
                      { label: 'Private Company', value: 'private' }
                    ]}
                    placeholder="Choose Organization Type"
                    labelField="label"
                    valueField="value"
                    dropdownGap={10}
                    onChange={val => {
                      setOrgType(val[0]);
                    }}
                    searchBy="label"
                    className="mt1 db w1 pr3 pv3 pl3 lh-title mid-gray bg-white-90 bt br bb bl bt br bb bl br2 w-100 f4"
                  />
                </div>
                <div className="mb3">
                  <label htmlFor="schoolcountry" className="b mid-gray">
                    Country
                  </label>
                  <StyledCountryDropdown
                    className="ba b--mid-gray mid-gray ph2 pv3 pointer w-100 bg-white mt1"
                    value={country}
                    id="schoolcountry"
                    onChange={val => setCountry(val)}
                    priorityOptions={['IN', 'US', 'GB', 'CA']}
                  />
                </div>
                <div className="mb3">
                  <label htmlFor="schoolregion" className="b mid-gray">
                    Region
                  </label>
                  <StyledRegionDropdown
                    disableWhenEmpty={true}
                    className="ba b--mid-gray mid-gray ph2 pv3 pointer w-100 bg-white mt1"
                    id="schoolregion"
                    country={country}
                    value={region}
                    onChange={val => setRegion(val)}
                  />
                </div>
              </React.Fragment>
            )}
            <div className="tr">
              <SavingButton
                type="submit"
                className="bg-dark-green bn br2 lh-title mb0 mt2 normal nowrap pl3 pointer pr3 pv3 tc white"
                disabled={orgStore.savingOrg}
                isLoading={orgStore.savingOrg}
              >
                Add Organization
              </SavingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

export default AddOrganization;
