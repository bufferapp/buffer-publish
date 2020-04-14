import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  PostLists,
  EmptyState,
  BufferLoading,
  BitlyClickNotification,
} from '@bufferapp/publish-shared-components';
import { Divider, Text } from '@bufferapp/components';
import { Button } from '@bufferapp/ui';
import ComposerPopover from '@bufferapp/publish-composer-popover';
import LockedProfileNotification from '@bufferapp/publish-locked-profile-notification';
import { WithFeatureLoader } from '@bufferapp/product-features';
import getErrorBoundary from '@bufferapp/publish-web/components/ErrorBoundary';
import ProfilesDisconnectedBanner from '@bufferapp/publish-profiles-disconnected-banner';

const ErrorBoundary = getErrorBoundary(true);

const headerStyle = {
  marginBottom: '1.5rem',
  width: '100%',
};

const loadingContainerStyle = {
  width: '100%',
  height: '100%',
  textAlign: 'center',
  paddingTop: '5rem',
};

const topBarContainerStyle = {
  display: 'flex',
};

const composerStyle = {
  flexGrow: '1',
};

const loadMoreButtonStyle = {
  textAlign: 'center',
  paddingBottom: '3rem',
};

const NoPostsPublished = ({ total, isBusinessAccount, features }) => {
  if (typeof total === 'undefined' || total > 0) {
    return null;
  }
  return (
    <Fragment>
      <EmptyState
        height="initial"
        title={
          isBusinessAccount || !features.isFreeUser()
            ? 'You haven’t published any posts with this account!'
            : 'You haven’t published any posts with this account in the past 30 days!'
        }
        subtitle="Once a post has gone live via Buffer, you can track its performance here to learn what works best with your audience!"
        heroImg="https://s3.amazonaws.com/buffer-publish/images/empty-sent2x.png"
        heroImgSize={{ width: '270px', height: '150px' }}
      />
    </Fragment>
  );
};

NoPostsPublished.propTypes = {
  total: PropTypes.number,
  isBusinessAccount: PropTypes.bool,
  features: PropTypes.shape({ isFreeUser: PropTypes.func }),
};

NoPostsPublished.defaultProps = {
  total: undefined,
  isBusinessAccount: false,
  features: {},
};

const SentPosts = ({
  total,
  loading,
  postLists,
  onEditClick,
  onShareAgainClick,
  onImageClick,
  onImageClickNext,
  onImageClickPrev,
  onImageClose,
  onCampaignTagClick,
  onComposerCreateSuccess,
  showComposer,
  editMode,
  isManager,
  isLockedProfile,
  isDisconnectedProfile,
  isBusinessAccount,
  features,
  hasFirstCommentFlip,
  hasCampaignsFeature,
  moreToLoad,
  tabId,
  profileId,
  page,
  loadMore,
  showAnalyzeBannerAfterFirstPost,
  isAnalyzeCustomer,
  fetchSentPosts,
  linkShortening,
  hasBitlyPosts,
  fetchCampaignsIfNeeded,
  profileServiceType,
  profileService,
}) => {
  useEffect(() => {
    fetchSentPosts();
  }, [profileId]);

  useEffect(() => {
    fetchCampaignsIfNeeded();
  }, []);

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <BufferLoading size={64} />
      </div>
    );
  }

  if (isLockedProfile) {
    return <LockedProfileNotification />;
  }

  const loadMorePosts = () => {
    loadMore({ profileId, page, tabId });
  };

  const header =
    isBusinessAccount || !features.isFreeUser()
      ? 'Your sent posts'
      : 'Your sent posts for the last 30 days';
  return (
    <ErrorBoundary>
      {isDisconnectedProfile && <ProfilesDisconnectedBanner />}
      <NoPostsPublished
        features={features}
        isBusinessAccount={isBusinessAccount}
        total={total}
      />

      {total > 0 ? (
        <Fragment>
          <div>
            <div style={headerStyle}>
              <div className="js-page-header">
                <Text color="black">{header}</Text>
              </div>
              <Divider />
            </div>
            <BitlyClickNotification
              hasBitlyPosts={hasBitlyPosts}
              isBitlyConnected={!!linkShortening.isBitlyConnected}
              isFreeUser={features.isFreeUser}
            />
            <div style={topBarContainerStyle}>
              {showComposer && !editMode && (
                <div style={composerStyle}>
                  <ComposerPopover
                    onSave={onComposerCreateSuccess}
                    type="sent"
                  />
                </div>
              )}
            </div>
            {showComposer && editMode && (
              <ComposerPopover onSave={onComposerCreateSuccess} type="sent" />
            )}
            <PostLists
              postLists={postLists}
              onEditClick={onEditClick}
              onShareAgainClick={onShareAgainClick}
              onImageClick={onImageClick}
              onImageClickNext={onImageClickNext}
              onImageClickPrev={onImageClickPrev}
              onImageClose={onImageClose}
              onCampaignTagClick={onCampaignTagClick}
              isManager={isManager}
              isBusinessAccount={isBusinessAccount}
              isSent
              hasFirstCommentFlip={hasFirstCommentFlip}
              hasCampaignsFeature={hasCampaignsFeature}
              showAnalyzeBannerAfterFirstPost={showAnalyzeBannerAfterFirstPost}
              isAnalyzeCustomer={isAnalyzeCustomer}
              profileServiceType={profileServiceType}
              profileService={profileService}
            />
          </div>
          {moreToLoad && (
            <div style={loadMoreButtonStyle}>
              <Button
                type="primary"
                label="Load More"
                onClick={loadMorePosts}
              />
            </div>
          )}
        </Fragment>
      ) : null}
    </ErrorBoundary>
  );
};

SentPosts.propTypes = {
  fetchSentPosts: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  moreToLoad: PropTypes.bool, // eslint-disable-line
  page: PropTypes.number, // eslint-disable-line
  features: PropTypes.object.isRequired, // eslint-disable-line
  postLists: PropTypes.arrayOf(
    PropTypes.shape({
      listHeader: PropTypes.string,
      posts: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
        })
      ),
    })
  ),
  total: PropTypes.number,
  showComposer: PropTypes.bool,
  showAnalyzeBannerAfterFirstPost: PropTypes.bool,
  isAnalyzeCustomer: PropTypes.bool,
  editMode: PropTypes.bool,
  onComposerCreateSuccess: PropTypes.func.isRequired,
  onEditClick: PropTypes.func,
  onShareAgainClick: PropTypes.func,
  onImageClick: PropTypes.func,
  onImageClickNext: PropTypes.func,
  onImageClickPrev: PropTypes.func,
  onImageClose: PropTypes.func,
  onCampaignTagClick: PropTypes.func,
  isManager: PropTypes.bool,
  isBusinessAccount: PropTypes.bool,
  isLockedProfile: PropTypes.bool,
  isDisconnectedProfile: PropTypes.bool,
  hasFirstCommentFlip: PropTypes.bool,
  hasCampaignsFeature: PropTypes.bool,
  linkShortening: PropTypes.shape({
    isBitlyConnected: PropTypes.bool,
  }),
  hasBitlyPosts: PropTypes.bool,
  onConnectBitlyURLClick: PropTypes.func.isRequired,
  fetchCampaignsIfNeeded: PropTypes.func.isRequired,
};

SentPosts.defaultProps = {
  loading: true,
  moreToLoad: false,
  page: 1,
  postLists: [],
  total: 0,
  showComposer: false,
  showAnalyzeBannerAfterFirstPost: false,
  isAnalyzeCustomer: false,
  editMode: false,
  isManager: true,
  isBusinessAccount: false,
  hasFirstCommentFlip: false,
  hasCampaignsFeature: false,
  isLockedProfile: false,
  isDisconnectedProfile: false,
  onEditClick: () => {},
  onShareAgainClick: () => {},
  onImageClick: () => {},
  onImageClickNext: () => {},
  onImageClickPrev: () => {},
  onImageClose: () => {},
  onCampaignTagClick: () => {},
};

export default WithFeatureLoader(SentPosts);
