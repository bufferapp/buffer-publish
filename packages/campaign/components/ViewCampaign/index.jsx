import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { QueueItems, Nav, NavLink } from '@bufferapp/publish-shared-components';
import { campaignScheduled, campaignSent } from '@bufferapp/publish-routes';
import ComposerPopover from '@bufferapp/publish-composer-popover';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import SkeletonPosts from './SkeletonPosts';
import EmptyStateCampaign from './EmptyState';

/* Styles */
const Container = styled.div`
  margin: 18px;
  max-width: 864px;
`;

/* Component */
const ViewCampaign = ({
  campaign,
  campaignPosts,
  isLoading,
  hideSkeletonHeader,
  hideAnalyzeReport,
  showCampaignActions,
  campaignId,
  hasCampaignsFlip,
  showComposer,
  editMode,
  actions,
  postActions,
  page,
  hasAnalyticsOnPosts,
  hasTwitterImpressions,
}) => {
  const sentView = page === 'sent';
  if (!hasCampaignsFlip) {
    window.location = getURL.getPublishUrl();
    return null;
  }

  // Fetch Data
  useEffect(() => {
    if (page) {
      const params = sentView ? { campaignId, past: true } : { campaignId };
      actions.fetchCampaign(params);
    }
  }, [campaignId, page]);

  const { t } = useTranslation();

  // Conditions
  const campaignHasPosts =
    (!sentView && campaign?.scheduled > 0) || (sentView && campaign?.sent > 0);

  return (
    <Container>
      {/* Header */}
      <Header
        campaignDetails={campaign}
        hideAnalyzeReport={hideAnalyzeReport}
        showCampaignActions={showCampaignActions}
        onCreatePostClick={actions.onCreatePostClick}
        onDeleteCampaignClick={actions.onDeleteCampaignClick}
        onEditCampaignClick={actions.onEditCampaignClick}
        goToAnalyzeReport={actions.goToAnalyzeReport}
        isLoading={isLoading && !hideSkeletonHeader}
      />
      {/* Navigation */}

      <Nav>
        <NavLink
          testId="scheduled-tab"
          to={campaignScheduled.getRoute({ campaignId })}
        >
          {t('campaigns.viewCampaign.scheduledTitle')}
        </NavLink>
        <NavLink testId="sent-tab" to={campaignSent.getRoute({ campaignId })}>
          {t('campaigns.viewCampaign.sentTitle')}
        </NavLink>
      </Nav>
      {/* Content */}
      {isLoading && <SkeletonPosts />}
      <main id="main">
        {!isLoading && (
          <EmptyStateCampaign
            hideAnalyzeReport={hideAnalyzeReport}
            campaign={campaign}
            actions={actions}
            sentView={sentView}
          />
        )}
        {!isLoading && campaignHasPosts && (
          <QueueItems
            items={campaignPosts}
            onDeleteConfirmClick={postActions.onDeleteConfirmClick}
            onSetRemindersClick={postActions.onSetRemindersClick}
            onEditClick={postActions.onEditClick}
            onShareNowClick={postActions.onShareNowClick}
            onRequeueClick={postActions.onRequeueClick}
            type="post"
            isSent={sentView}
            hasAnalyticsOnPosts={hasAnalyticsOnPosts}
            hasTwitterImpressions={hasTwitterImpressions}
          />
        )}
      </main>
      {/* Composer */}
      {showComposer && (
        <ComposerPopover
          onSave={actions.onComposerCreateSuccess}
          type="campaign"
          onComposerOverlayClick={actions.onComposerOverlayClick}
          editMode={editMode}
        />
      )}
    </Container>
  );
};

ViewCampaign.propTypes = {
  campaign: PropTypes.object.isRequired, // eslint-disable-line
  campaignPosts: PropTypes.array, // eslint-disable-line
  hideAnalyzeReport: PropTypes.bool.isRequired,
  showCampaignActions: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  hideSkeletonHeader: PropTypes.bool.isRequired,
  campaignId: PropTypes.string.isRequired,
  showComposer: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  page: PropTypes.oneOf(['scheduled', 'sent', null]).isRequired,
  hasCampaignsFlip: PropTypes.bool.isRequired,
  actions: PropTypes.shape({
    onCreatePostClick: PropTypes.func.isRequired,
    onDeleteCampaignClick: PropTypes.func.isRequired,
    onEditCampaignClick: PropTypes.func.isRequired,
    fetchCampaign: PropTypes.func.isRequired,
    goToAnalyzeReport: PropTypes.func.isRequired,
    onComposerCreateSuccess: PropTypes.func.isRequired,
    onComposerOverlayClick: PropTypes.func.isRequired,
  }).isRequired,
  hasAnalyticsOnPosts: PropTypes.bool,
  hasTwitterImpressions: PropTypes.bool,
  postActions: PropTypes.shape({
    onEditClick: PropTypes.func.isRequired,
    onDeleteConfirmClick: PropTypes.func.isRequired,
    onSetRemindersClick: PropTypes.func.isRequired,
    onShareNowClick: PropTypes.func.isRequired,
    onRequeueClick: PropTypes.func.isRequired,
  }).isRequired,
};

ViewCampaign.defaultProps = {
  hasAnalyticsOnPosts: false,
  hasTwitterImpressions: false,
};

export default ViewCampaign;
