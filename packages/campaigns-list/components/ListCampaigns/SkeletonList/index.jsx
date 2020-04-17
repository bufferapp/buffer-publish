import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { AnimatedList } from '@bufferapp/publish-shared-components';
import ListItem from '../ListItem';

const StyledList = styled(AnimatedList)`
  padding-left: 0px;
  width: 100%;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const skeletonCampaign = {
  color: null,
  id: null,
  name: 'Loading Name',
  sent: 0,
  scheduled: 0,
  lastUpdated: 'Loading date',
  dateRange: null,
};

const numberItems = [1, 2, 3, 4, 5];

const SkeletonList = ({ translations, hideAnalyzeReport }) => {
  const listItems = numberItems.map(number => (
    <ListItem
      key={`skeleton-${number}`}
      translations={translations}
      campaign={skeletonCampaign}
      hideAnalyzeReport={hideAnalyzeReport}
      displaySkeleton
    />
  ));
  return <StyledList>{listItems}</StyledList>;
};

SkeletonList.propTypes = {
  translations: PropTypes.object.isRequired, // eslint-disable-line
  hideAnalyzeReport: PropTypes.bool.isRequired,
};

export default SkeletonList;
