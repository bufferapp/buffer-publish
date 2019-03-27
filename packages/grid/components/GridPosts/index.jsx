import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  GridList,
  EmptyState,
  BufferLoading,
} from '@bufferapp/publish-shared-components';
import { Button } from '@bufferapp/ui';
import CopyIcon from '@bufferapp/ui/Icon/Icons/Copy';
import LockedProfileNotification from '@bufferapp/publish-locked-profile-notification';
import { ProfileBadge } from '@bufferapp/analyze-shared-components';

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '1.8rem',
  width: '100%',
};

const loadingContainerStyle = {
  width: '100%',
  height: '100%',
  textAlign: 'center',
  paddingTop: '5rem',
};

const profileBadgeStyle = {
  padding: '0.05rem 0.25rem',
};

const profileHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
};

const buttonsWrapperStyles = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: '290px',
};

const linkFieldStyle = {
  marginRight: '12px',
  width: '100%',
};

const copyLinkButtonStyle = {
  alignItems: 'center',
  backgroundColor: '#E0E0E0',
  border: '1px solid #E0E0E0',
  borderRadius: '4px',
  color: '#636363',
  cursor: 'pointer',
  display: 'flex',
  fontFamily: 'Roboto',
  fontSize: '14px',
  height: '40px',
  outline: 'none',
  paddingLeft: '16px',
  paddingRight: '16px',
  width: '100%',
};

const copyLinkStyle = {
  width: '16px',
  height: '16px',
  marginLeft: 'auto',
};

const onCopyToClipboard = (text, handleCopyToClipboard) => {
  navigator.clipboard.writeText(text).then(() => {
    handleCopyToClipboard(true);
  }, (err) => {
    handleCopyToClipboard(false);
  });
};

const GridPosts = ({
  total,
  loading,
  mergedPosts,
  onImageClick,
  onImageClose,
  onChangePostUrl,
  isManager,
  isLockedProfile,
  isBusinessAccount,
  onPreviewPageClick,
  profile,
  handleCopyToClipboard,
  generatedUrl,
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
    return (
      <Fragment>
        <EmptyState
          title="You haven’t published any posts with this account in the past 30 days!"
          subtitle="Once a post has gone live via Buffer,
          you can track its performance here to learn what works best with your audience!"
          heroImg="https://s3.amazonaws.com/buffer-publish/images/empty-sent2x.png"
          heroImgSize={{ width: '270px', height: '150px' }}
        />
      </Fragment>
    );
  }

  return (
    <div>
      <div style={headerStyle}>
        <div style={profileHeaderStyle}>
          <div style={profileBadgeStyle}>
            <ProfileBadge
              avatarUrl={profile.avatar_https}
              service={profile.service}
              avatarSize={48}
              socialIconSize={24}
            />
          </div>
        </div>
        <div style={buttonsWrapperStyles}>
          <div style={linkFieldStyle}>
            <button
              style={copyLinkButtonStyle}
              onClick={() => {
                onCopyToClipboard(
                  generatedUrl,
                  handleCopyToClipboard,
                );
              }}
            >
              {generatedUrl}
              <div style={copyLinkStyle}>
                <CopyIcon size="medium" />
              </div>
            </button>
          </div>
          <Button
            label={'Preview Page'}
            type="secondary"
            onClick={() => {
              onPreviewPageClick();
            }}
          />
        </div>
      </div>
      <GridList
        mergedPosts={mergedPosts}
        onChangePostUrl={onChangePostUrl}
        onImageClick={onImageClick}
        onImageClose={onImageClose}
      />
    </div>
  );
};

GridPosts.propTypes = {
  loading: PropTypes.bool,
  moreToLoad: PropTypes.bool, // eslint-disable-line
  page: PropTypes.number, // eslint-disable-line
  mergedPosts: PropTypes.arrayOf(
    PropTypes.shape({
      posts: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string,
        }),
      ),
    }),
  ),
  total: PropTypes.number,
  onChangePostUrl: PropTypes.func,
  onImageClick: PropTypes.func,
  onImageClose: PropTypes.func,
  onPreviewPageClick: PropTypes.func,
  handleCopyToClipboard: PropTypes.func,
  isManager: PropTypes.bool,
  isBusinessAccount: PropTypes.bool,
  generatedUrl: PropTypes.string,
  isLockedProfile: PropTypes.bool,
  profile: PropTypes.shape({
    service: PropTypes.string,
    avatar_https: PropTypes.string,
  }),
};

GridPosts.defaultProps = {
  loading: true,
  moreToLoad: false,
  page: 1,
  total: 0,
  mergedPosts: [],
  isManager: true,
  generatedUrl: '',
  isBusinessAccount: false,
  isLockedProfile: false,
  onChangePostUrl: () => {},
  onImageClick: () => {},
  onImageClose: () => {},
  onPreviewPageClick: () => {},
  handleCopyToClipboard: () => {},
  profile: {},
};

export default GridPosts;
