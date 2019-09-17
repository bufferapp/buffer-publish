import React from 'react';
import PropTypes from 'prop-types';
import {
  LinkifiedText,
  Text,
} from '@bufferapp/components';

import Card from '../Card';
import CardHeader from '../CardHeader';
import DraftFooter from '../DraftFooter';
import RetweetPanel from '../RetweetPanel';

import RenderPostMetaBar from '../Post/RenderPostMetaBar';

const postContentStyle = {
  padding: '1rem',
};

const retweetProfileWrapperStyle = {
  marginBottom: '1rem',
};

const commentStyle = {
  marginBottom: '1rem',
};

/* eslint-disable react/prop-types */
const renderRetweetComment = ({
  retweetComment,
  retweetCommentLinks,
  basic,
}) => (
  <div style={commentStyle}>
    {basic
      ? (
        <Text
          color="black"
          size="mini"
        >
          {retweetComment}
        </Text>
      )
      : (
        <LinkifiedText
          links={retweetCommentLinks}
          newTab
          size="mini"
          unstyled
          color="black"
        >
          {retweetComment}
        </LinkifiedText>
      )
    }
  </div>
);

const renderContent = ({
  children,
  retweetComment,
  retweetCommentLinks,
  retweetProfile,
  basic,
}) => {
  if (retweetProfile) {
    return (
      <div style={postContentStyle}>
        { retweetComment ? renderRetweetComment({ retweetComment, retweetCommentLinks, basic }) : '' }
        <Card>
          <div style={retweetProfileWrapperStyle}>
            <RetweetPanel {...retweetProfile} />
          </div>
          { children }
        </Card>
      </div>
    );
  }

  return (
    <div style={postContentStyle}>
      { children }
    </div>
  );
};

/* eslint-enable react/prop-types */
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
  onCancelConfirmClick,
  onDeleteClick,
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
      creatorName={draftDetails.creatorName}
      avatarUrl={draftDetails.avatarUrl}
      createdAt={draftDetails.createdAt}
    />
    {renderContent({
      children,
      retweetProfile,
      retweetComment,
      retweetCommentLinks,
      basic,
    })}
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
      onCancelConfirmClick={onCancelConfirmClick}
      onDeleteClick={onDeleteClick}
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

Draft.commonPropTypes = {
  hasPermission: PropTypes.bool.isRequired,
  isConfirmingDelete: PropTypes.bool,
  isDeleting: PropTypes.bool,
  isWorking: PropTypes.bool,
  onCancelConfirmClick: PropTypes.func,
  onRequeueClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onDeleteConfirmClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onShareNowClick: PropTypes.func,
  draftDetails: PropTypes.shape({
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
    }),
  ),
  hasFirstCommentFlip: PropTypes.bool,
};

Draft.propTypes = {
  ...Draft.commonPropTypes,
  view: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

Draft.defaultProps = {
  isConfirmingDelete: false,
  isDeleting: false,
  isWorking: false,
  hasFirstCommentFlip: false,
};

export default Draft;
