import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  QueueItems,
  Tabs,
  Tab,
  BufferLoading,
} from '@bufferapp/publish-shared-components';
import ComposerPopover from '@bufferapp/publish-composer-popover';
import TabTag from '@bufferapp/publish-tabs/components/TabTag';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import Header from './Header';
import EmptyState from './EmptyState';
import ExamplePost from './ExamplePost';

/* Styles */
const Container = styled.div`
  margin: 18px;
  max-width: 864px;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 5rem;
`;

/* Component */
const ViewCampaign = ({
  campaign,
  campaignPosts,
  isLoading,
  hideAnalyzeReport,
  translations,
  campaignId,
  hasCampaignsFlip,
  showComposer,
  editMode,
  actions,
  postActions,
  sentView,
}) => {
  if (!hasCampaignsFlip) {
    window.location = getURL.getPublishUrl();
    return null;
  }
  // Fetch Data
  useEffect(() => {
    const params = sentView ? { campaignId, past: true } : { campaignId };
    actions.fetchCampaign(params);
  }, [campaignId, sentView]);

  useEffect(() => {
    actions.fetchCampaigns();
  }, []);
  
  // Conditions
  const selectedtTabId = sentView ? 'sent' : 'scheduled';
  const campaignHasPosts = campaign?.scheduled > 0 || campaign?.sent > 0;
  const allPostsSent = campaign?.scheduled === 0 && campaign?.sent > 0;
  const noPostsSent = campaign?.scheduled > 0 && campaign?.sent === 0;

  if (isLoading) {
    return (
      <Container>
        <LoadingContainer>
          <BufferLoading size={64} />
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header
        campaignDetails={campaign}
        hideAnalyzeReport={hideAnalyzeReport}
        translations={translations}
        onCreatePostClick={actions.onCreatePostClick}
        onDeleteCampaignClick={actions.onDeleteCampaignClick}
        onEditCampaignClick={actions.onEditCampaignClick}
        goToAnalyzeReport={actions.goToAnalyzeReport}
      />
      {showComposer && (
        <ComposerPopover
          onSave={actions.onComposerCreateSuccess}
          type="campaign"
          onComposerOverlayClick={actions.onComposerOverlayClick}
          editMode={editMode}
        />
      )}
      {campaignHasPosts ? (
        <React.Fragment>
          <nav role="navigation">
            <Tabs
              selectedTabId={selectedtTabId}
              onTabClick={tabId => actions.onTabClick({ tabId, campaignId })}
            >
              <Tab tabId="scheduled">{translations.scheduled}</Tab>
              <Tab tabId="sent">
                {translations.sent}
                <TabTag type="new" labelName="Coming Soon" />
              </Tab>
            </Tabs>
          </nav>
          {
            allPostsSent
            // Coming soon, empty state
          }
          {
            noPostsSent
            // Coming soon, empty state
          }
          <QueueItems
            items={campaignPosts}
            onDeleteConfirmClick={postActions.onDeleteConfirmClick}
            onEditClick={postActions.onEditClick}
            onShareNowClick={postActions.onShareNowClick}
            onRequeueClick={postActions.onRequeueClick}
            onImageClick={postActions.onImageClick}
            onImageClickNext={postActions.onImageClickNext}
            onImageClickPrev={postActions.onImageClickPrev}
            onImageClose={postActions.onImageClose}
            type="post"
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <EmptyState
            translations={translations}
            onCreatePostClick={actions.onCreatePostClick}
          />
          <ExamplePost />
          <ExamplePost />
        </React.Fragment>
      )}
    </Container>
  );
};

ViewCampaign.propTypes = {
  translations: PropTypes.object.isRequired, // eslint-disable-line
  campaign: PropTypes.object.isRequired, // eslint-disable-line
  campaignPosts: PropTypes.array, // eslint-disable-line
  hideAnalyzeReport: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  campaignId: PropTypes.string.isRequired,
  showComposer: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  sentView: PropTypes.bool,
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
    fetchCampaigns: PropTypes.func.isRequired,
  }).isRequired,
  postActions: PropTypes.shape({
    onEditClick: PropTypes.func.isRequired,
    onDeleteConfirmClick: PropTypes.func.isRequired,
    onShareNowClick: PropTypes.func.isRequired,
    onRequeueClick: PropTypes.func.isRequired,
    onImageClick: PropTypes.func.isRequired,
    onImageClose: PropTypes.func.isRequired,
    onImageClickPrev: PropTypes.func.isRequired,
    onImageClickNext: PropTypes.func.isRequired,
  }).isRequired,
};

ViewCampaign.defaultProps = {
  sentView: false,
};

export default ViewCampaign;
