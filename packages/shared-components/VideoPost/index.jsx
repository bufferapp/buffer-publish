import React from 'react';
import ImagePost from '../ImagePost';

const VideoPost = ({
  isConfirmingDelete,
  isDeleting,
  isWorking,
  imageSrc,
  links,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onRequeueClick,
  postDetails,
  text,
  tag,
  retweetProfile,
  onImageClick,
  onImageClickNext,
  onImageClickPrev,
  onImageClose,
  isLightboxOpen,
  draggable,
  dragging,
  hovering,
  isOver,
  statistics,
  subprofiles,
  profile_service: profileService,
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
}) => (
  <ImagePost
    isConfirmingDelete={isConfirmingDelete}
    isDeleting={isDeleting}
    isWorking={isWorking}
    imageSrc={imageSrc}
    links={links}
    postDetails={postDetails}
    tag={tag}
    text={text}
    onDeleteConfirmClick={onDeleteConfirmClick}
    onEditClick={onEditClick}
    onShareNowClick={onShareNowClick}
    onRequeueClick={onRequeueClick}
    retweetProfile={retweetProfile}
    onImageClick={onImageClick}
    onImageClickNext={onImageClickNext}
    onImageClickPrev={onImageClickPrev}
    onImageClose={onImageClose}
    isLightboxOpen={isLightboxOpen}
    draggable={draggable}
    dragging={dragging}
    hovering={hovering}
    isOver={isOver}
    statistics={statistics}
    subprofiles={subprofiles}
    profileService={profileService}
    service_geolocation_name={locationName}
    source_url={sourceUrl}
    subprofile_id={subprofileID}
    serviceLink={serviceLink}
    isSent={isSent}
    isManager={isManager}
    isBusinessAccount={isBusinessAccount}
    isPastReminder={isPastReminder}
    day={day}
    dueTime={dueTime}
    sharedBy={sharedBy}
    basic={basic}
    commentEnabled={commentEnabled}
    commentText={commentText}
    hasCommentEnabled={hasCommentEnabled}
    hasFirstCommentFlip={hasFirstCommentFlip}
  />
);

VideoPost.propTypes = ImagePost.propTypes;

VideoPost.defaultProps = {
  ...ImagePost.defaultProps,
  tag: 'VIDEO',
};

export default VideoPost;
