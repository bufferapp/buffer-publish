import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, Button } from '@bufferapp/ui';
import { BufferLoading } from '@bufferapp/publish-shared-components';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import { borderRadius } from '@bufferapp/ui/style/borders';
import {
  grayLighter,
  gray,
  white,
  grayShadow,
} from '@bufferapp/ui/style/colors';
import styled from 'styled-components';
import EmptyState from './EmptyState';
import List from './List';

/* Styles */
const Wrapper = styled.div`
  background-color: ${grayLighter};
  height: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 0 16px;
  button {
    margin-left: auto;
  }
`;

const Container = styled.div`
  margin: 13px;
  min-width: 750px;
  max-width: 1008px;
  border-radius: ${borderRadius};
  border: 1px solid ${gray};
  background-color: ${white};
  box-shadow: ${grayShadow};
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 5rem;
`;

const ListCampaigns = ({
  translations,
  campaigns,
  onEditCampaignClick,
  onDeleteCampaignClick,
  onViewCampaignClick,
  goToAnalyzeReport,
  onOpenCreateCampaignClick,
  hideAnalyzeReport,
  hasCampaignsFlip,
  fetchCampaigns,
  isLoading,
}) => {
  if (!hasCampaignsFlip) {
    window.location = getURL.getPublishUrl();
    return null;
  }
  // Fetch Data
  useEffect(() => {
    fetchCampaigns();
  }, []);

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <BufferLoading size={64} />
        </LoadingContainer>
      </Container>
    );
  }

  if (campaigns.length === 0) {
    return (
      <EmptyState
        translations={translations.emptyState}
        onOpenCreateCampaignClick={onOpenCreateCampaignClick}
      />
    );
  }

  return (
    <Wrapper>
      <Container>
        <Header>
          <Text type="h2">Campaigns</Text>
          <Button
            type="primary"
            label="Create Campaign"
            onClick={onOpenCreateCampaignClick}
          />
        </Header>
        <List
          campaigns={campaigns}
          onEditCampaignClick={onEditCampaignClick}
          onDeleteCampaignClick={onDeleteCampaignClick}
          onViewCampaignClick={onViewCampaignClick}
          goToAnalyzeReport={goToAnalyzeReport}
          translations={translations.viewCampaign}
          hideAnalyzeReport={hideAnalyzeReport}
        />
      </Container>
    </Wrapper>
  );
};

ListCampaigns.propTypes = {
  translations: PropTypes.object.isRequired, // eslint-disable-line
  campaigns: PropTypes.array, // eslint-disable-line
  onOpenCreateCampaignClick: PropTypes.func,
  onEditCampaignClick: PropTypes.func,
  onDeleteCampaignClick: PropTypes.func,
  onViewCampaignClick: PropTypes.func,
  goToAnalyzeReport: PropTypes.func,
  hideAnalyzeReport: PropTypes.bool.isRequired,
  hasCampaignsFlip: PropTypes.bool.isRequired,
  fetchCampaigns: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

ListCampaigns.defaultProps = {
  onOpenCreateCampaignClick: () => {},
  onEditCampaignClick: () => {},
  onDeleteCampaignClick: () => {},
  onViewCampaignClick: () => {},
  goToAnalyzeReport: () => {},
};

export default ListCampaigns;
