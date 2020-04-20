import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { QueueItems, Tabs, Tab } from '@bufferapp/publish-shared-components';
import ComposerPopover from '@bufferapp/publish-composer-popover';
import { getURL } from '@bufferapp/publish-server/formatters/src';
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
  translations,
  campaignId,
  hasCampaignsFlip,
  showComposer,
  editMode,
  actions,
  postActions,
  page,
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

  useEffect(() => {
    actions.fetchCampaignsIfNeeded();
  }, []);

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
        translations={translations}
        onCreatePostClick={actions.onCreatePostClick}
        onDeleteCampaignClick={actions.onDeleteCampaignClick}
        onEditCampaignClick={actions.onEditCampaignClick}
        goToAnalyzeReport={actions.goToAnalyzeReport}
        isLoading={isLoading && !hideSkeletonHeader}
      />
      {/* Navigation */}
      <nav role="navigation">
        <Tabs
          selectedTabId={page}
          onTabClick={tabId => actions.onTabClick({ tabId, campaignId })}
        >
          <Tab tabId="scheduled">{translations.scheduled}</Tab>
          <Tab tabId="sent">
            {translations.sent}
          </Tab>
        </Tabs>
      </nav>
      {/* Content */}
      {isLoading && <SkeletonPosts />}
      {!isLoading && (
        <EmptyStateCampaign
          hideAnalyzeReport={hideAnalyzeReport}
          translations={translations}
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
          onImageClick={postActions.onImageClick}
          onImageClickNext={postActions.onImageClickNext}
          onImageClickPrev={postActions.onImageClickPrev}
          onImageClose={postActions.onImageClose}
          type="post"
        />
      )}
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
  translations: PropTypes.object.isRequired, // eslint-disable-line
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
    onTabClick: PropTypes.func.isRequired,
    fetchCampaign: PropTypes.func.isRequired,
    goToAnalyzeReport: PropTypes.func.isRequired,
    onComposerCreateSuccess: PropTypes.func.isRequired,
    onComposerOverlayClick: PropTypes.func.isRequired,
    fetchCampaignsIfNeeded: PropTypes.func.isRequired,
  }).isRequired,
  postActions: PropTypes.shape({
    onEditClick: PropTypes.func.isRequired,
    onDeleteConfirmClick: PropTypes.func.isRequired,
    onSetRemindersClick: PropTypes.func.isRequired,
    onShareNowClick: PropTypes.func.isRequired,
    onRequeueClick: PropTypes.func.isRequired,
    onImageClick: PropTypes.func.isRequired,
    onImageClose: PropTypes.func.isRequired,
    onImageClickPrev: PropTypes.func.isRequired,
    onImageClickNext: PropTypes.func.isRequired,
  }).isRequired,
};

export default ViewCampaign;
