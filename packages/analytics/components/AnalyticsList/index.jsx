import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// Analyze Components
import AverageTable from '@bufferapp/average-table';
import CompareChart from '@bufferapp/compare-chart';
import PostsTable from '@bufferapp/posts-table';
import SummaryTable from '@bufferapp/summary-table';

import Toolbar from '../Toolbar';

import './analytics.css';
import './store'; // Injects reducers and middlewares

const AnalyticsList = ({
  profile,
  isInstagramBusiness,
  fetchProfiles,
  selectProfile,
}) => {
  useEffect(() => {
    // We need to re-fetch profiles to get them into the analyze stores
    // (the stores are lazy-loaded and dindn't exist for the initial profile fetch)
    fetchProfiles();
    // Now select the profile
    selectProfile(profile);
  }, []);
  return (
    <div id="analytics">
      <Toolbar profile={profile} />
      {!isInstagramBusiness && <SummaryTable />}
      <CompareChart />
      {!isInstagramBusiness && (
        <React.Fragment>
          <AverageTable />
          <PostsTable />
        </React.Fragment>
      )}
    </div>
  );
};

AnalyticsList.propTypes = {
  profile: PropTypes.object.isRequired, // eslint-disable-line
  isInstagramBusiness: PropTypes.bool.isRequired,
  fetchProfiles: PropTypes.func.isRequired,
  selectProfile: PropTypes.func.isRequired,
};

export default AnalyticsList;
