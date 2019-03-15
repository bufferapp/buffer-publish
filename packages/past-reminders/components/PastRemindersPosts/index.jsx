import React from 'react';
import PropTypes from 'prop-types';
import {
  PostLists,
  EmptyState,
  LockedProfileNotification,
} from '@bufferapp/publish-shared-components';
import {
  Divider,
  Text,
  LoadingAnimation,
} from '@bufferapp/components';
import ComposerPopover from '@bufferapp/publish-composer-popover';
import { WithFeatureLoader } from '@bufferapp/product-features';

const headerStyle = {
  marginBottom: '1.5rem',
  width: '100%',
};

const titleStyle = {
  marginBottom: '8px',
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

const PastRemindersPosts = ({
  header,
  subHeader,
  total,
  loading,
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
  isLockedProfile,
  profileLimit,
  isOwner,
  onClickUpgrade,
  features,
}) => {
  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <LoadingAnimation />
      </div>
    );
  }

  if (isLockedProfile) {
    if (!isOwner) {
      return (
        <LockedProfileNotification
          type={'teamMember'}
        />
      );
    } else if (features.isFreeUser()) {
      return (
        <LockedProfileNotification
          onClickUpgrade={onClickUpgrade}
          profileLimit={profileLimit}
          type={'free'}
        />
      );
    } else if (features.isProUser()) {
      return (
        <LockedProfileNotification
          onClickUpgrade={onClickUpgrade}
          profileLimit={profileLimit}
          type={'pro'}
        />
      );
    }
    return (
      <LockedProfileNotification
        onClickUpgrade={onClickUpgrade}
        profileLimit={profileLimit}
        type={'business'}
      />
    );
  }

  if (total < 1) {
    return (
      <EmptyState
        title="You haven’t published any posts with this account in the past 30 days!"
        subtitle="Once a post has gone live via Buffer, you can track its performance here to learn what works best with your audience!"
        heroImg="https://s3.amazonaws.com/buffer-publish/images/empty-sent2x.png"
        heroImgSize={{ width: '270px', height: '150px' }}
      />
    );
  }
  return (
    <div>
      <div style={headerStyle}>
        <div style={titleStyle}>
          <Text color={'black'}>{header}</Text>
        </div>
        <Text color={'shuttleGray'} size={'mini'}>{subHeader}</Text>
        <Divider />
      </div>
      <div style={topBarContainerStyle}>
        {showComposer && !editMode &&
          <div style={composerStyle}>
            <ComposerPopover
              onSave={onComposerCreateSuccess}
              type={'pastReminders'}
            />
          </div>
        }
      </div>
      {showComposer && editMode &&
        <ComposerPopover
          onSave={onComposerCreateSuccess}
          type={'pastReminders'}
        />
      }
      <PostLists
        postLists={postLists}
        onEditClick={onEditClick}
        onShareAgainClick={onShareAgainClick}
        onMobileClick={onMobileClick}
        onImageClick={onImageClick}
        onImageClickNext={onImageClickNext}
        onImageClickPrev={onImageClickPrev}
        onImageClose={onImageClose}
        isManager={isManager}
        isBusinessAccount={isBusinessAccount}
        isSent={false}
        isPastReminder
      />
    </div>
  );
};

PastRemindersPosts.propTypes = {
  features: PropTypes.object.isRequired, // eslint-disable-line
  header: PropTypes.string,
  subHeader: PropTypes.string,
  loading: PropTypes.bool,
  moreToLoad: PropTypes.bool, // eslint-disable-line
  page: PropTypes.number, // eslint-disable-line
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
  onMobileClick: PropTypes.func,
  onImageClick: PropTypes.func,
  onImageClickNext: PropTypes.func,
  onImageClickPrev: PropTypes.func,
  onImageClose: PropTypes.func,
  isManager: PropTypes.bool,
  isBusinessAccount: PropTypes.bool,
  isLockedProfile: PropTypes.bool,
  profileLimit: PropTypes.number.isRequired,
  isOwner: PropTypes.bool,
  onClickUpgrade: PropTypes.func.isRequired,
};

PastRemindersPosts.defaultProps = {
  header: null,
  subHeader: null,
  loading: true,
  moreToLoad: false,
  page: 1,
  postLists: [],
  total: 0,
  showComposer: false,
  editMode: false,
  isManager: true,
  isBusinessAccount: false,
  isLockedProfile: false,
  isOwner: true,
  onEditClick: () => {},
  onShareAgainClick: () => {},
  onMobileClick: () => {},
  onImageClick: () => {},
  onImageClickNext: () => {},
  onImageClickPrev: () => {},
  onImageClose: () => {},
};

export default WithFeatureLoader(PastRemindersPosts);
