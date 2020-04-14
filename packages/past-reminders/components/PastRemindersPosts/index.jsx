import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PostLists, EmptyState } from '@bufferapp/publish-shared-components';
import PreviewPopover from '@bufferapp/publish-story-preview';
import ComposerPopover from '@bufferapp/publish-composer-popover';
import StoryGroupPopover from '@bufferapp/publish-story-group-composer';
import getErrorBoundary from '@bufferapp/publish-web/components/ErrorBoundary';
import { LoadingAnimation } from '@bufferapp/components';

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 5rem;
`;

const TopBarContainerStyle = styled.div`
  display: flex;
`;

const ComposerStyle = styled.div`
  flex-grow: 1;
`;

const ErrorBoundary = getErrorBoundary(true);

const Composer = ({ showComposer, showStoriesComposer, onSave }) => {
  if (showComposer) {
    return <ComposerPopover onSave={onSave} type="pastReminders" />;
  }

  if (showStoriesComposer) {
    return <StoryGroupPopover type="pastReminders" />;
  }
};

const ComposerWrapper = ({
  editMode,
  showComposer,
  showStoriesComposer,
  onComposerCreateSuccess,
}) => (
  <React.Fragment>
    {(showComposer || showStoriesComposer) && !editMode && (
      <TopBarContainerStyle>
        <ComposerStyle>
          <Composer
            showComposer={showComposer}
            showStoriesComposer={showStoriesComposer}
            onSave={onComposerCreateSuccess}
          />
        </ComposerStyle>
      </TopBarContainerStyle>
    )}
    {(showComposer || showStoriesComposer) && editMode && (
      <Composer
        showComposer={showComposer}
        showStoriesComposer={showStoriesComposer}
        onSave={onComposerCreateSuccess}
      />
    )}
  </React.Fragment>
);

ComposerWrapper.propTypes = {
  editMode: PropTypes.bool,
  showComposer: PropTypes.bool,
  showStoriesComposer: PropTypes.bool,
  onComposerCreateSuccess: PropTypes.func,
};

ComposerWrapper.defaultProps = {
  editMode: false,
  showComposer: false,
  showStoriesComposer: false,
  onComposerCreateSuccess: () => {},
};

const PastRemindersPosts = ({
  total,
  loading,
  userData,
  viewType,
  postLists,
  onEditClick,
  onShareAgainClick,
  onMobileClick,
  onImageClick,
  onImageClickNext,
  onImageClickPrev,
  onImageClose,
  onComposerCreateSuccess,
  showComposer,
  editMode,
  isManager,
  isBusinessAccount,
  onPreviewClick,
  showStoryPreview,
  showStoriesComposer,
  isDisconnectedProfile,
  onClosePreviewClick,
  fetchCampaignsIfNeeded,
}) => {
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingAnimation />
      </LoadingContainer>
    );
  }

  if (!isDisconnectedProfile && total < 1) {
    return (
      <EmptyState
        title="You haven’t published any posts with this account in the past 30 days!"
        subtitle="Once a post has gone live via Buffer, you can track its performance here to learn what works best with your audience!"
        heroImg="https://s3.amazonaws.com/buffer-publish/images/empty-sent2x.png"
        heroImgSize={{ width: '270px', height: '150px' }}
      />
    );
  }

  useEffect(() => {
    fetchCampaignsIfNeeded();
  }, []);

  return (
    <ErrorBoundary>
      {showStoryPreview && (
        <PreviewPopover onCloseClick={onClosePreviewClick} view="queue" />
      )}
      <React.Fragment>
        <ComposerWrapper
          editMode={editMode}
          showComposer={showComposer}
          showStoriesComposer={showStoriesComposer}
          onComposerCreateSuccess={onComposerCreateSuccess}
        />

        <PostLists
          postLists={postLists}
          onEditClick={onEditClick}
          onShareAgainClick={post => onShareAgainClick(post, viewType)}
          onMobileClick={post => onMobileClick(post, viewType)}
          onImageClick={onImageClick}
          onImageClickNext={onImageClickNext}
          onImageClickPrev={onImageClickPrev}
          onImageClose={onImageClose}
          isManager={isManager}
          isBusinessAccount={isBusinessAccount}
          isSent={false}
          isPastReminder
          userData={userData}
          onPreviewClick={onPreviewClick}
        />
      </React.Fragment>
    </ErrorBoundary>
  );
};

PastRemindersPosts.propTypes = {
  loading: PropTypes.bool,
  moreToLoad: PropTypes.bool, // eslint-disable-line
  page: PropTypes.number, // eslint-disable-line
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
  editMode: PropTypes.bool,
  showStoriesComposer: PropTypes.bool,
  onComposerCreateSuccess: PropTypes.func.isRequired,
  onEditClick: PropTypes.func,
  onShareAgainClick: PropTypes.func,
  onMobileClick: PropTypes.func,
  onImageClick: PropTypes.func,
  onImageClickNext: PropTypes.func,
  onImageClickPrev: PropTypes.func,
  onImageClose: PropTypes.func,
  onPreviewClick: PropTypes.func,
  onClosePreviewClick: PropTypes.func,
  viewType: PropTypes.string,
  isManager: PropTypes.bool,
  isBusinessAccount: PropTypes.bool,
  showStoryPreview: PropTypes.bool,
  isDisconnectedProfile: PropTypes.bool,
  userData: PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  fetchCampaignsIfNeeded: PropTypes.func.isRequired,
};

PastRemindersPosts.defaultProps = {
  loading: true,
  moreToLoad: false,
  page: 1,
  postLists: [],
  total: 0,
  showComposer: false,
  showStoriesComposer: false,
  editMode: false,
  isManager: true,
  isBusinessAccount: false,
  showStoryPreview: false,
  isDisconnectedProfile: false,
  viewType: 'posts',
  userData: {},
  onEditClick: () => {},
  onShareAgainClick: () => {},
  onMobileClick: () => {},
  onImageClick: () => {},
  onImageClickNext: () => {},
  onImageClickPrev: () => {},
  onImageClose: () => {},
  onPreviewClick: () => {},
  onClosePreviewClick: () => {},
};

export default PastRemindersPosts;
