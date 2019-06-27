import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  PostLists,
  EmptyState,
  BufferLoading,
} from '@bufferapp/publish-shared-components';
import { Divider, Text } from '@bufferapp/components';
import { Button } from '@bufferapp/ui';
import ComposerPopover from '@bufferapp/publish-composer-popover';
import LockedProfileNotification from '@bufferapp/publish-locked-profile-notification';
import { WithFeatureLoader } from '@bufferapp/product-features';
import getErrorBoundary from '@bufferapp/publish-web/components/ErrorBoundary';

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
  onComposerCreateSuccess,
  showComposer,
  editMode,
  isManager,
  isLockedProfile,
  isBusinessAccount,
  features,
  hasFirstCommentFlip,
  moreToLoad,
  tabId,
  profileId,
  page,
  loadMore,
}) => {
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

  if (total < 1) {
    const title = isBusinessAccount || !features.isFreeUser() ?
      'You haven’t published any posts with this account!' :
      'You haven’t published any posts with this account in the past 30 days!';
    return (
      <Fragment>
        <EmptyState
          title={title}
          subtitle="Once a post has gone live via Buffer, you can track its performance here to learn what works best with your audience!"
          heroImg="https://s3.amazonaws.com/buffer-publish/images/empty-sent2x.png"
          heroImgSize={{ width: '270px', height: '150px' }}
        />
      </Fragment>
    );
  }

  const loadMorePosts = () => {
    loadMore({ profileId, page, tabId });
  };

  const header = isBusinessAccount || !features.isFreeUser() ?
    'Your sent posts' :
    'Your sent posts for the last 30 days';
  return (
    <ErrorBoundary>
      <div>
        <div style={headerStyle}>
          <div className="js-page-header">
            <Text color={'black'}>{header}</Text>
          </div>
          <Divider />
        </div>
        <div style={topBarContainerStyle}>
          {showComposer && !editMode && (
            <div style={composerStyle}>
              <ComposerPopover onSave={onComposerCreateSuccess} type={'sent'} />
            </div>
          )}
        </div>
        {showComposer && editMode && (
          <ComposerPopover onSave={onComposerCreateSuccess} type={'sent'} />
        )}
        <PostLists
          postLists={postLists}
          onEditClick={onEditClick}
          onShareAgainClick={onShareAgainClick}
          onImageClick={onImageClick}
          onImageClickNext={onImageClickNext}
          onImageClickPrev={onImageClickPrev}
          onImageClose={onImageClose}
          isManager={isManager}
          isBusinessAccount={isBusinessAccount}
          isSent
          hasFirstCommentFlip={hasFirstCommentFlip}
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
    </ErrorBoundary>
  );
};

SentPosts.propTypes = {
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
        }),
      ),
    }),
  ),
  total: PropTypes.number,
  showComposer: PropTypes.bool,
  editMode: PropTypes.bool,
  onComposerCreateSuccess: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onShareAgainClick: PropTypes.func,
  onImageClick: PropTypes.func,
  onImageClickNext: PropTypes.func,
  onImageClickPrev: PropTypes.func,
  onImageClose: PropTypes.func,
  isManager: PropTypes.bool,
  isBusinessAccount: PropTypes.bool,
  isLockedProfile: PropTypes.bool,
  hasFirstCommentFlip: PropTypes.bool,
};

SentPosts.defaultProps = {
  loading: true,
  moreToLoad: false,
  page: 1,
  postLists: [],
  total: 0,
  showComposer: false,
  editMode: false,
  isManager: true,
  isBusinessAccount: false,
  hasFirstCommentFlip: false,
  isLockedProfile: false,
  onEditClick: () => {},
  onShareAgainClick: () => {},
  onImageClick: () => {},
  onImageClickNext: () => {},
  onImageClickPrev: () => {},
  onImageClose: () => {},
};

export default WithFeatureLoader(SentPosts);
