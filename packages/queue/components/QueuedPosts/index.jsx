import React from 'react';
import PropTypes from 'prop-types';

import {
  EmptyState,
  BufferLoading,
} from '@bufferapp/publish-shared-components';
import InstagramDirectPostingModal from '@bufferapp/publish-ig-direct-posting-modal';
import ComposerPopover from '@bufferapp/publish-composer-popover';
import LockedProfileNotification from '@bufferapp/publish-locked-profile-notification';
import getErrorBoundary from '@bufferapp/publish-web/components/ErrorBoundary';

import InstagramDirectPostingBanner from '../InstagramDirectPostingBanner';
import QueueItems from '../QueueItems';
import QueuePausedBar from '../QueuePausedBar';

const ErrorBoundary = getErrorBoundary(true);

const composerStyle = {
  marginBottom: '1.5rem',
  flexGrow: '1',
};

const composerInputStyle = {
  alignItems: 'center',
  backgroundColor: '#ffffff',
  border: '1px solid #B8B8B8',
  borderRadius: '4px',
  boxShadow: '0 1px 4px rgba(0,0,0,.16)',
  color: '#999999',
  cursor: 'pointer',
  display: 'flex',
  fontFamily: 'Roboto',
  fontSize: '14px',
  height: '48px',
  outline: 'none',
  paddingLeft: '16px',
  paddingRight: '16px',
  width: '100%',
};

const composerInputIcoCameraStyle = {
  background: 'url("https://s3.amazonaws.com/buffer-publish/images/ico-camera.svg") no-repeat',
  width: '16px',
  height: '16px',
  marginLeft: 'auto',
};

const topBarContainerStyle = {
  display: 'flex',
};

const loadingContainerStyle = {
  width: '100%',
  height: '100%',
  textAlign: 'center',
  paddingTop: '5rem',
};

const QueuedPosts = ({
  showEmptyQueueMessage,
  loading,
  postLists,
  onComposerPlaceholderClick,
  onComposerCreateSuccess,
  onComposerInteraction,
  onCancelConfirmClick,
  onRequeueClick,
  onDeleteClick,
  onDeleteConfirmClick,
  onEditClick,
  onEmptySlotClick,
  onCalendarClick,
  onShareNowClick,
  onImageClick,
  onImageClickNext,
  onImageClickPrev,
  onImageClose,
  onDropPost,
  showComposer,
  editMode,
  paused,
  draggingEnabled,
  onUnpauseClick,
  subprofiles,
  isInstagramProfile,
  isInstagramBusiness,
  showInstagramDirectPostingModal,
  onDirectPostingClick,
  isInstagramLoading,
  isLockedProfile,
  isManager,
  hasFirstCommentFlip,
}) => {
  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <BufferLoading size={64} />
      </div>
    );
  }

  if (isInstagramLoading) {
    return (
      <div style={loadingContainerStyle}>
        <BufferLoading size={64} fullscreen dark />
      </div>
    );
  }

  if (isLockedProfile) {
    return <LockedProfileNotification />;
  }

  return (
    <ErrorBoundary>
      <div>
        <div style={topBarContainerStyle}>
          <div style={composerStyle}>
            {showComposer && !editMode &&
              <ComposerPopover
                onSave={onComposerCreateSuccess}
                onInteraction={onComposerInteraction}
                preserveComposerStateOnClose
                type={'queue'}
              />
            }
            <button
              style={composerInputStyle}
              onClick={onComposerPlaceholderClick}
            >
              What would you like to share?
              <div style={composerInputIcoCameraStyle} />
            </button>
          </div>

        </div>
        {isInstagramProfile && !isInstagramBusiness &&
          <InstagramDirectPostingBanner onDirectPostingClick={onDirectPostingClick} />
        }
        {showInstagramDirectPostingModal &&
          <InstagramDirectPostingModal />
        }
        {!!paused && <QueuePausedBar isManager={isManager} handleClickUnpause={onUnpauseClick} />}
        {showEmptyQueueMessage &&
          <EmptyState
            title="It looks like you haven't got any posts in your queue!"
            subtitle="Click the box above to add a post to your queue :)"
            heroImg="https://s3.amazonaws.com/buffer-publish/images/fresh-queue%402x.png"
            heroImgSize={{ width: '229px', height: '196px' }}
          />
        }
        {showComposer && editMode &&
          <ComposerPopover
            onSave={onComposerCreateSuccess}
            onInteraction={onComposerInteraction}
            type={'queue'}
          />
        }
        <QueueItems
          items={postLists}
          subprofiles={subprofiles}
          onCancelConfirmClick={onCancelConfirmClick}
          onCalendarClick={onCalendarClick}
          onRequeueClick={onRequeueClick}
          onDeleteClick={onDeleteClick}
          onDeleteConfirmClick={onDeleteConfirmClick}
          onEditClick={onEditClick}
          onEmptySlotClick={onEmptySlotClick}
          onShareNowClick={onShareNowClick}
          onImageClick={onImageClick}
          onImageClickNext={onImageClickNext}
          onImageClickPrev={onImageClickPrev}
          onImageClose={onImageClose}
          onDropPost={onDropPost}
          draggable={draggingEnabled}
          hasFirstCommentFlip={hasFirstCommentFlip}
        />
      </div>
    </ErrorBoundary>
  );
};

QueuedPosts.propTypes = {
  loading: PropTypes.bool,
  moreToLoad: PropTypes.bool, // eslint-disable-line
  page: PropTypes.number, // eslint-disable-line
  postLists: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
    }),
  ).isRequired,
  subprofiles: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
    }),
  ),
  showEmptyQueueMessage: PropTypes.bool,
  onComposerPlaceholderClick: PropTypes.func.isRequired,
  onComposerCreateSuccess: PropTypes.func.isRequired,
  onComposerInteraction: PropTypes.func.isRequired,
  onCancelConfirmClick: PropTypes.func.isRequired,
  onRequeueClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onDeleteConfirmClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onEmptySlotClick: PropTypes.func.isRequired,
  onShareNowClick: PropTypes.func.isRequired,
  onImageClick: PropTypes.func.isRequired,
  onImageClickNext: PropTypes.func.isRequired,
  onImageClickPrev: PropTypes.func.isRequired,
  onImageClose: PropTypes.func.isRequired,
  onDropPost: PropTypes.func.isRequired,
  showComposer: PropTypes.bool,
  editMode: PropTypes.bool,
  paused: PropTypes.bool,
  draggingEnabled: PropTypes.bool,
  onUnpauseClick: PropTypes.func.isRequired,
  isManager: PropTypes.bool,
  isInstagramProfile: PropTypes.bool,
  isInstagramBusiness: PropTypes.bool,
  showInstagramDirectPostingModal: PropTypes.bool,
  onDirectPostingClick: PropTypes.func.isRequired,
  isInstagramLoading: PropTypes.bool,
  isLockedProfile: PropTypes.bool,
  hasFirstCommentFlip: PropTypes.bool,
  onCalendarClick: PropTypes.func.isRequired,
};

QueuedPosts.defaultProps = {
  loading: true,
  moreToLoad: false,
  page: 1,
  postLists: [],
  showComposer: false,
  showEmptyQueueMessage: false,
  enabledApplicationModes: [],
  editMode: false,
  paused: false,
  subprofiles: [],
  isInstagramProfile: false,
  isInstagramBusiness: false,
  showInstagramDirectPostingModal: false,
  isInstagramLoading: false,
  isLockedProfile: false,
  hasFirstCommentFlip: false,
  draggingEnabled: false,
  isManager: false,
};

export default QueuedPosts;
