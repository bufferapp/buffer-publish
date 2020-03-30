import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ListItem from '../ListItem';

const StyledList = styled.ul`
  padding-left: 0px;
  width: 100%;
  margin-top: 0px;
  margin-bottom: 0px;
`;

const List = ({
  translations,
  campaigns,
  onViewCampaignClick,
  goToAnalyzeReport,
  onDeleteCampaignClick,
  onEditCampaignClick,
  hideAnalyzeReport,
}) => {
  const listItems = campaigns.map(campaign => (
    <ListItem
      key={campaign.id}
      translations={translations}
      campaign={campaign}
      onViewCampaignClick={onViewCampaignClick}
      onDeleteCampaignClick={onDeleteCampaignClick}
      onEditCampaignClick={onEditCampaignClick}
      goToAnalyzeReport={goToAnalyzeReport}
      hideAnalyzeReport={hideAnalyzeReport}
    />
  ));
  return <StyledList>{listItems}</StyledList>;
};

List.propTypes = {
  translations: PropTypes.object.isRequired, // eslint-disable-line
  campaigns: PropTypes.array, // eslint-disable-line
  onEditCampaignClick: PropTypes.func.isRequired,
  onDeleteCampaignClick: PropTypes.func.isRequired,
  onViewCampaignClick: PropTypes.func.isRequired,
  goToAnalyzeReport: PropTypes.func.isRequired,
  hideAnalyzeReport: PropTypes.bool.isRequired,
};

export default List;
