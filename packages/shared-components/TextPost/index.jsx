import React from 'react';
import PropTypes from 'prop-types';
import { LinkifiedText, Text } from '@bufferapp/components';
import Post from '../Post';

const postContentStyle = {
  display: 'flex',
};

const postContentTextStyle = {
  paddingRight: '1rem',
  flexGrow: 1,
};

const TextPost = ({
  isConfirmingDelete,
  isDeleting,
  isWorking,
  imageSrc,
  links,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onRequeueClick,
  onCampaignTagClick,
  postDetails,
  text,
  retweetProfile,
  retweetComment,
  retweetCommentLinks,
  draggable,
  dragging,
  hovering,
  isOver,
  fixed,
  statistics,
  subprofiles,
  profileServiceType,
  profileService,
  service_geolocation_name: locationName,
  source_url: sourceUrl,
  subprofile_id: subprofileID,
  serviceLink,
  isSent,
  isManager,
  isBusinessAccount,
  isPastReminder,
  day,
  dueTime,
  sharedBy,
  commentEnabled,
  commentText,
  hasCommentEnabled,
  hasFirstCommentFlip,
  hasPushNotifications,
  onSetRemindersClick,
  basic,
  campaignDetails,
  hasCampaignsFeature,
  ...props
}) => {
  const children = (
    <div style={postContentStyle}>
      <span style={postContentTextStyle}>
        {basic ? (
          <Text size="mini" whitespace="pre-wrap" color="black">
            {text}
          </Text>
        ) : (
          <LinkifiedText
            color="black"
            links={links}
            size="mini"
            whitespace="pre-wrap"
            newTab
            unstyled
            basic={basic}
          >
            {text}
          </LinkifiedText>
        )}
      </span>
    </div>
  );

  return (
    <Post
      {...props}
      isConfirmingDelete={isConfirmingDelete}
      isDeleting={isDeleting}
      isWorking={isWorking}
      imageSrc={imageSrc}
      links={links}
      onDeleteConfirmClick={onDeleteConfirmClick}
      onEditClick={onEditClick}
      onShareNowClick={onShareNowClick}
      onRequeueClick={onRequeueClick}
      postDetails={postDetails}
      text={text}
      retweetProfile={retweetProfile}
      retweetComment={retweetComment}
      retweetCommentLinks={retweetCommentLinks}
      draggable={draggable}
      dragging={dragging}
      hovering={hovering}
      isOver={isOver}
      fixed={fixed}
      statistics={statistics}
      subprofiles={subprofiles}
      profileServiceType={profileServiceType}
      profileService={profileService}
      locationName={locationName}
      sourceUrl={sourceUrl}
      subprofileID={subprofileID}
      serviceLink={serviceLink}
      isSent={isSent}
      isManager={isManager}
      isBusinessAccount={isBusinessAccount}
      isPastReminder={isPastReminder}
      day={day}
      dueTime={dueTime}
      sharedBy={sharedBy}
      commentEnabled={commentEnabled}
      commentText={commentText}
      hasCommentEnabled={hasCommentEnabled}
      hasFirstCommentFlip={hasFirstCommentFlip}
      hasPushNotifications={hasPushNotifications}
      onSetRemindersClick={onSetRemindersClick}
      basic={basic}
      campaignDetails={campaignDetails}
      onCampaignTagClick={onCampaignTagClick}
      hasCampaignsFeature={hasCampaignsFeature}
    >
      {children}
    </Post>
  );
};

TextPost.propTypes = {
  ...Post.commonPropTypes,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      rawString: PropTypes.string,
      displayString: PropTypes.string,
      expandedUrl: PropTypes.string,
      indices: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
  retweetCommentLinks: PropTypes.arrayOf(
    PropTypes.shape({
      rawString: PropTypes.string,
      displayString: PropTypes.string,
      expandedUrl: PropTypes.string,
      indices: PropTypes.arrayOf(PropTypes.number),
    })
  ),
  text: PropTypes.string.isRequired,
  isSent: PropTypes.bool,
  isManager: PropTypes.bool,
  isPastReminder: PropTypes.bool,
};

TextPost.defaultProps = Post.defaultProps;

export default TextPost;
