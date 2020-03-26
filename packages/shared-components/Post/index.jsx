import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WithFeatureLoader } from '@bufferapp/product-features';
import PostTag from '../PostTag';
import PostFooter from '../PostFooter';
import PostStats from '../PostStats';
import RenderPostMetaBar from './RenderPostMetaBar';
import PostErrorBanner from '../PostErrorBanner';
import RetweetPanel from '../RetweetPanel';
import CardHeader from '../CardHeader';
import Card from '../Card';

const PostContainer = styled.div`
  display: flex;
  width: 100%;
`;

const PostSubContainer = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

const PostContent = styled.div`
  padding: 1rem;
  cursor: ${props => (props.draggable ? 'grab' : 'inherit')};
  opacity: ${props => (props.dragging ? 0 : 1)};
`;

const Post = ({
  children,
  isConfirmingDelete,
  isDeleting,
  isWorking,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onRequeueClick,
  postDetails,
  retweetComment,
  retweetCommentLinks,
  retweetProfile,
  locationName,
  sourceUrl,
  subprofileID,
  subprofiles,
  draggable,
  dragging,
  isOver,
  statistics,
  profileService,
  profileServiceType,
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
  features,
  basic,
  hasUserTags,
  campaignDetails,
  onCampaignTagClick,
  hasCampaignsFeature,
  headerDetails,
}) => {
  const hasError =
    postDetails && postDetails.error && postDetails.error.length > 0;
  const hasReminderError =
    !isSent &&
    !hasError &&
    !hasPushNotifications &&
    postDetails.isInstagramReminder &&
    !isPastReminder;
  const cardDetails = {
    faded: isDeleting,
    dragging,
    isOver,
  };

  return (
    <PostContainer>
      <PostSubContainer>
        <Card state={cardDetails}>
          {hasReminderError && (
            <PostErrorBanner
              dragging={dragging}
              errorLabel="Set Up Reminders"
              error="Shoot, looks like we can't publish this until you set up Reminders. Would you be up for setting them now?"
              errorAction={onSetRemindersClick}
            />
          )}
          {hasError && (
            <PostErrorBanner
              dragging={dragging}
              error={postDetails.error}
              errorLink={postDetails.errorLink}
            />
          )}
          {headerDetails && <CardHeader headerDetails={headerDetails} />}
          <PostContent draggable={draggable} dragging={dragging}>
            {retweetProfile ? (
              <RetweetPanel
                retweetProfile={retweetProfile}
                retweetComment={retweetComment}
                retweetCommentLinks={retweetCommentLinks}
                basic={basic}
              >
                {children}
              </RetweetPanel>
            ) : (
              children
            )}
          </PostContent>

          {hasCampaignsFeature && campaignDetails && (
            <PostTag
              name={campaignDetails.name}
              color={campaignDetails.color}
              dragging={dragging}
              onPostTagClick={onCampaignTagClick}
            />
          )}

          <RenderPostMetaBar
            profileService={profileService}
            dragging={dragging}
            locationName={locationName}
            sourceUrl={sourceUrl}
            subprofileID={subprofileID}
            subprofiles={subprofiles}
            isSent={isSent}
            isPastReminder={isPastReminder}
          />
          <PostFooter
            isManager={isManager}
            isDeleting={isDeleting}
            isConfirmingDelete={isConfirmingDelete}
            isWorking={isWorking}
            onDeleteConfirmClick={onDeleteConfirmClick}
            onEditClick={onEditClick}
            onShareNowClick={onShareNowClick}
            postDetails={postDetails}
            dragging={dragging}
            onRequeueClick={onRequeueClick}
            serviceLink={serviceLink}
            isSent={isSent}
            isPastReminder={isPastReminder}
            day={day}
            dueTime={dueTime}
            sharedBy={sharedBy}
            commentEnabled={commentEnabled}
            commentText={commentText}
            hasCommentEnabled={hasCommentEnabled}
            hasFirstCommentFlip={hasFirstCommentFlip}
            hasUserTags={hasUserTags}
          />
          {(isBusinessAccount || !features.isFreeUser()) &&
            isSent &&
            !postDetails.isRetweet && (
              <PostStats
                showTwitterMentions={
                  !features.isFreeUser() && !features.isProUser()
                }
                statistics={statistics}
                profileService={profileService}
                profileServiceType={profileServiceType}
              />
            )}
        </Card>
      </PostSubContainer>
    </PostContainer>
  );
};

Post.commonPropTypes = {
  isConfirmingDelete: PropTypes.bool,
  isDeleting: PropTypes.bool,
  isWorking: PropTypes.bool,
  isBusinessAccount: PropTypes.bool,
  onRequeueClick: PropTypes.func,
  onDeleteConfirmClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onShareNowClick: PropTypes.func,
  postDetails: PropTypes.shape({
    isRetweet: PropTypes.bool,
    postAction: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
  retweetProfile: PropTypes.shape({
    avatarUrl: PropTypes.string,
    handle: PropTypes.string,
    name: PropTypes.string,
  }),
  retweetComment: PropTypes.string,
  retweetCommentLinks: PropTypes.arrayOf(
    PropTypes.shape({
      rawString: PropTypes.string,
      displayString: PropTypes.string,
      expandedUrl: PropTypes.string,
      indices: PropTypes.arrayOf(PropTypes.number),
    })
  ),
  draggable: PropTypes.bool,
  dragging: PropTypes.bool,
  isOver: PropTypes.bool,
  onDropPost: PropTypes.func,
  serviceLink: PropTypes.string,
  isSent: PropTypes.bool,
  isPastReminder: PropTypes.bool,
  day: PropTypes.string,
  dueTime: PropTypes.string,
  sharedBy: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  basic: PropTypes.bool,
};

Post.propTypes = {
  ...Post.commonPropTypes,
  children: PropTypes.node.isRequired,
};

Post.defaultProps = {
  isConfirmingDelete: false,
  isDeleting: false,
  isWorking: false,
  isSent: false,
  isBusinessAccount: false,
  isManager: true,
  isPastReminder: false,
  day: null,
  dueTime: null,
  sharedBy: null,
  basic: false,
};

export default WithFeatureLoader(Post);
