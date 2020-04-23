import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ButtonWithSkeleton,
  TextWithSkeleton,
} from '@bufferapp/publish-shared-components';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import { borderRadius } from '@bufferapp/ui/style/borders';
import { gray, white, grayShadow } from '@bufferapp/ui/style/colors';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import EmptyState from './EmptyState';
import List from './List';
import SkeletonList from './SkeletonList';

/* Styles */
const Wrapper = styled.div`
  padding: 16px 24px;
  height: 100%;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 0px 16px;
  button {
    margin-left: auto;
  }
`;

const Container = styled.div`
  margin: 0px auto;
  min-width: 800px;
  max-width: 1800px;
  border-radius: ${borderRadius};
  border: 1px solid ${gray};
  background-color: ${white};
  box-shadow: ${grayShadow};

  @media (min-width: 1500px) {
    width: 75vw;
  }
`;

const ListCampaigns = ({
  campaigns,
  onEditCampaignClick,
  onDeleteCampaignClick,
  onViewCampaignClick,
  goToAnalyzeReport,
  onOpenCreateCampaignClick,
  showCampaignActions,
  hasCampaignsFlip,
  fetchCampaignsIfNeeded,
  isLoading,
}) => {
  if (!hasCampaignsFlip) {
    window.location = getURL.getPublishUrl();
    return null;
  }
  // Fetch Data
  useEffect(() => {
    fetchCampaignsIfNeeded();
  }, []);

  const { t } = useTranslation();

  if (!isLoading && (!campaigns || campaigns.length === 0)) {
    return <EmptyState onOpenCreateCampaignClick={onOpenCreateCampaignClick} />;
  }

  return (
    <Wrapper>
      <Container>
        <Header>
          <TextWithSkeleton
            type="h2"
            displaySkeleton={isLoading}
            aria-label={isLoading ? t('common.loading') : null}
          >
            {t('campaigns.common.title')}
          </TextWithSkeleton>
          {showCampaignActions && (
            <ButtonWithSkeleton
              type="primary"
              label={t('campaigns.common.createCampaign')}
              onClick={onOpenCreateCampaignClick}
              disabled={isLoading}
              displaySkeleton={isLoading}
            />
          )}
        </Header>
        {!isLoading && (
          <List
            campaigns={campaigns}
            onEditCampaignClick={onEditCampaignClick}
            onDeleteCampaignClick={onDeleteCampaignClick}
            onViewCampaignClick={onViewCampaignClick}
            goToAnalyzeReport={goToAnalyzeReport}
            showCampaignActions={showCampaignActions}
          />
        )}
        {isLoading && (
          <SkeletonList showCampaignActions={showCampaignActions} />
        )}
      </Container>
    </Wrapper>
  );
};

ListCampaigns.propTypes = {
  campaigns: PropTypes.array, // eslint-disable-line
  onOpenCreateCampaignClick: PropTypes.func,
  onEditCampaignClick: PropTypes.func,
  onDeleteCampaignClick: PropTypes.func,
  onViewCampaignClick: PropTypes.func,
  goToAnalyzeReport: PropTypes.func,
  showCampaignActions: PropTypes.bool.isRequired,
  hasCampaignsFlip: PropTypes.bool.isRequired,
  fetchCampaignsIfNeeded: PropTypes.func.isRequired,
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
