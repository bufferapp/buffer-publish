import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card';
import CardHeader from '../CardHeader';
import DraftFooter from '../DraftFooter';
import RetweetPanel from '../RetweetPanel';
import RenderPostMetaBar from '../Post/RenderPostMetaBar';

const postContentStyle = {
  padding: '1rem',
};

const Draft = ({
  children,
  hasPermission,
  isConfirmingDelete,
  isDeleting,
  isWorking,
  isMoving,
  isPastDue,
  manager,
  onApproveClick,
  onDeleteConfirmClick,
  onEditClick,
  onMoveToDraftsClick,
  onRequestApprovalClick,
  onRescheduleClick,
  draftDetails,
  retweetComment,
  retweetCommentLinks,
  retweetProfile,
  scheduledAt,
  view,
  basic,
  hasFirstCommentFlip,
  profileService,
  geolocationName,
}) => (
  <Card>
    <CardHeader
      headerDetails={{
        creatorName: draftDetails.creatorName,
        avatarUrl: draftDetails.avatarUrl,
        createdAt: draftDetails.createdAt,
      }}
    />
    {/* Draft Content */}
    <div style={postContentStyle}>
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
    </div>
    <RenderPostMetaBar
      profileService={profileService}
      locationName={geolocationName}
    />
    <DraftFooter
      hasPermission={hasPermission}
      isDeleting={isDeleting}
      isConfirmingDelete={isConfirmingDelete}
      isMoving={isMoving}
      isPastDue={isPastDue}
      isWorking={isWorking}
      manager={manager}
      scheduledAt={scheduledAt}
      onApproveClick={onApproveClick}
      onDeleteConfirmClick={onDeleteConfirmClick}
      onEditClick={onEditClick}
      onMoveToDraftsClick={onMoveToDraftsClick}
      onRequestApprovalClick={onRequestApprovalClick}
      onRescheduleClick={onRescheduleClick}
      draftDetails={draftDetails}
      view={view}
      hasFirstCommentFlip={hasFirstCommentFlip}
    />
  </Card>
);

Draft.propTypes = {
  hasPermission: PropTypes.bool.isRequired,
  isConfirmingDelete: PropTypes.bool,
  isDeleting: PropTypes.bool,
  isWorking: PropTypes.bool,
  isMoving: PropTypes.bool,
  isPastDue: PropTypes.bool,
  manager: PropTypes.bool,
  onDeleteConfirmClick: PropTypes.func,
  onApproveClick: PropTypes.func,
  onMoveToDraftsClick: PropTypes.func,
  onRequestApprovalClick: PropTypes.func,
  onRescheduleClick: PropTypes.func,
  onEditClick: PropTypes.func,
  draftDetails: PropTypes.shape({
    isRetweet: PropTypes.bool,
    postAction: PropTypes.string,
    error: PropTypes.string,
    creatorName: PropTypes.string,
    avatarUrl: PropTypes.string,
    createdAt: PropTypes.string,
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
  hasFirstCommentFlip: PropTypes.bool,
  view: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Draft.defaultProps = {
  isConfirmingDelete: false,
  isDeleting: false,
  isWorking: false,
  isMoving: false,
  isPastDue: false,
  manager: true,
  hasFirstCommentFlip: false,
};

export default Draft;
