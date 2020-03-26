import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Link, LinkifiedText, Text } from '@bufferapp/components';
import Post from '../Post';

const postContentStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const postContentTextStyle = {
  paddingBottom: '1rem',
};

const linkAttachmentContentStyle = {
  display: 'flex',
  flexDirection: 'row',
};

const linkAttachmentTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  flexGrow: 1,
  minWidth: 0,
};

const linkUrlStyle = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'rgba(50, 59, 67, 0.3)',
  margin: '0.25rem 1rem 1rem 0',
};

const LinkPost = ({
  isConfirmingDelete,
  isDeleting,
  isWorking,
  links,
  linkAttachment,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onRequeueClick,
  postDetails,
  scheduledAt,
  text,
  draggable,
  dragging,
  hovering,
  isOver,
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
  basic,
  commentEnabled,
  commentText,
  hasCommentEnabled,
  hasFirstCommentFlip,
  hasPushNotifications,
  onSetRemindersClick,
  campaignDetails,
  onCampaignTagClick,
  hasCampaignsFeature,
  ...props
}) => {
  const children = (
    <div style={postContentStyle}>
      <div style={postContentTextStyle}>
        {basic ? (
          <Text color="black" size="mini" whitespace="pre-wrap">
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
          >
            {text}
          </LinkifiedText>
        )}
      </div>
      <div>
        <Link href={linkAttachment.url} unstyled newTab>
          <Card noPadding>
            <div style={linkAttachmentContentStyle}>
              <Image
                src={linkAttachment.thumbnailUrl}
                width="15rem"
                minWidth="15rem"
                maxWidth="15rem"
                height="10rem"
                border="rounded"
                objectFit="cover"
              />
              <div style={linkAttachmentTextStyle}>
                <div>
                  <Text>{linkAttachment.title}</Text>
                </div>
                <div style={linkUrlStyle}>
                  <Text size="small" color="outerSpaceLight">
                    {linkAttachment.url}
                  </Text>
                </div>
                <div>
                  <Text size="small">{linkAttachment.description}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );

  return (
    <Post
      {...props}
      isConfirmingDelete={isConfirmingDelete}
      isDeleting={isDeleting}
      isWorking={isWorking}
      links={links}
      linkAttachment={linkAttachment}
      onDeleteConfirmClick={onDeleteConfirmClick}
      onEditClick={onEditClick}
      onShareNowClick={onShareNowClick}
      postDetails={postDetails}
      scheduledAt={scheduledAt}
      text={text}
      draggable={draggable}
      dragging={dragging}
      hovering={hovering}
      isOver={isOver}
      onRequeueClick={onRequeueClick}
      statistics={statistics}
      profileService={profileService}
      profileServiceType={profileServiceType}
      locationName={locationName}
      subprofiles={subprofiles}
      subprofileID={subprofileID}
      sourceUrl={sourceUrl}
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

LinkPost.propTypes = {
  ...Post.commonPropTypes,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      rawString: PropTypes.string,
      displayString: PropTypes.string,
      expandedUrl: PropTypes.string,
      indices: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
  linkAttachment: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
    thumbnailUrl: PropTypes.string,
  }).isRequired,
  text: PropTypes.string.isRequired,
  isSent: PropTypes.bool,
  isManager: PropTypes.bool,
  isPastReminder: PropTypes.bool,
};

LinkPost.defaultProps = Post.defaultProps;

export default LinkPost;
