import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Text,
  ClockIcon,
  WarningIcon,
} from '@bufferapp/components';
import {
  borderWidth,
} from '@bufferapp/components/style/border';
import {
  mystic,
} from '@bufferapp/components/style/color';
import PostFooterDelete from '../PostFooterDelete';
import DraftFooterApproval from '../DraftFooterApproval';
import HoverableText from '../HoverableText';

const postDetailsStyle = {
  display: 'flex',
  padding: '0.5rem 1rem',
  backgroundColor: '#fcfcfc',
  borderTop: `${borderWidth} solid ${mystic}`,
};

const postActionDetailsStyle = {
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
};

const postActionDetailsIconStyle = {
  marginRight: '0.5rem',
  display: 'flex',
  alignItems: 'center',
};

const postControlsStyle = {
  display: 'flex',
};

const postButtonEdit = {
  marginLeft: '0.7rem',
};

const verticalLineStyle = {
  marginRight: '0.7rem',
  marginLeft: '0.7rem',
  borderLeft: `${borderWidth} solid ${mystic}`,
};

const igCommentWrapper = {
  display: 'flex',
  alignItems: 'center',
};

const igCommentIconWrapper = {
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '0.5rem',
  marginLeft: '0.5rem',
  borderLeft: '1px solid #cfd4d6',
};

/* eslint-disable react/prop-types */
const renderEdit = ({
  hasPermission,
  manager,
  onEditClick,
  view,
}) => {
  if (!hasPermission) return;
  if (!manager && view === 'approval') return;

  return (
    <span style={postButtonEdit}>
      <Button onClick={onEditClick} noStyle>
        <HoverableText
          size={'small'}
        >
          Edit
        </HoverableText>
      </Button>
    </span>
  );
};

const renderIcon = ({ isPastDue, scheduledAt }) => {
  if (isPastDue) {
    return (
      <div style={postActionDetailsIconStyle}>
        <WarningIcon color={'torchRed'} />
      </div>
    );
  } else if (scheduledAt) {
    return (
      <div style={postActionDetailsIconStyle}>
        <ClockIcon />
      </div>
    );
  }
  return null;
};

const renderMoveToDrafts = ({
  hasPermission,
  onMoveToDraftsClick,
  view,
}) => {
  if (view !== 'approval' || !hasPermission) return;

  return (<span>
    <span style={verticalLineStyle} />
    <Button onClick={onMoveToDraftsClick} noStyle>
      <HoverableText
        size={'small'}
        color={'curiousBlue'}
        hoverColor={'toryBlue'}
      >
        Move to Drafts
      </HoverableText>
    </Button>
  </span>);
};

const renderCommentIcon = () => (
  <span style={igCommentIconWrapper} title="Post includes a comment">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#59626a"
        d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6c-.746 0-2.886 1.672-4.13 2.52-.457.31-.87.032-.87-.52V3z"
      />
    </svg>
  </span>
);

const renderActionText = (postAction, hasCommentEnabled, commentEnabled, hasFirstCommentFlip) => (
  hasFirstCommentFlip && hasCommentEnabled && commentEnabled ?
    <span style={igCommentWrapper}>
      {postAction}
      {renderCommentIcon()}
    </span>
    : postAction
);

const renderText = ({
  draftDetails,
  isPastDue,
  view,
  hasPermission,
  manager,
  hasFirstCommentFlip,
}) =>
  <span>
    <Text
      size={'small'}
      color={isPastDue ? 'torchRed' : undefined}
    >
      {renderActionText(
        draftDetails.postAction,
        draftDetails.hasCommentEnabled,
        draftDetails.commentEnabled,
        hasFirstCommentFlip,
      )}
    </Text>
    {
      (hasPermission || manager) && isPastDue && view === 'drafts' ?
        <Text size={'small'}> Please reschedule.</Text>
      : null
    }
  </span>;

const renderControls = ({
  hasPermission,
  isDeleting,
  isConfirmingDelete,
  isMoving,
  isPastDue,
  isWorking,
  manager,
  onApproveClick,
  onCancelConfirmClick,
  onDeleteClick,
  onEditClick,
  onDeleteConfirmClick,
  onMoveToDraftsClick,
  onRescheduleClick,
  onRequestApprovalClick,
  view,
}) => {
  if (isDeleting) {
    return (
      <Text size={'small'}> Deleting... </Text>
    );
  }

  const approvalView = view === 'approval';

  if (approvalView && isMoving) {
    return (
      <Text size={'small'}> Moving... </Text>
    );
  }

  if (manager && isWorking) {
    return (
      <Text size={'small'}>{ approvalView ? 'Approving...' : 'Adding...' }</Text>
    );
  }

  if (!approvalView && isMoving) {
    return (
      <Text size={'small'}> Requesting... </Text>
    );
  }

  return (
    <div>
      { hasPermission &&
        <PostFooterDelete
          isConfirmingDelete={isConfirmingDelete}
          onCancelConfirmClick={onCancelConfirmClick}
          onDeleteConfirmClick={onDeleteConfirmClick}
          onDeleteClick={onDeleteClick}
        />
      }
      {renderEdit({
        hasPermission,
        manager,
        onEditClick,
        view,
      })}
      {renderMoveToDrafts({
        hasPermission,
        manager,
        onMoveToDraftsClick,
        view,
      })}
      <DraftFooterApproval
        hasPermission={hasPermission}
        isPastDue={isPastDue}
        onApproveClick={onApproveClick}
        onRequestApprovalClick={onRequestApprovalClick}
        onRescheduleClick={onRescheduleClick}
        manager={manager}
        view={view}
      />
    </div>
  );
};

/* eslint-enable react/prop-types */

const DraftFooter = ({
  hasPermission,
  isDeleting,
  isConfirmingDelete,
  isMoving,
  isPastDue,
  isWorking,
  manager,
  onApproveClick,
  onCancelConfirmClick,
  onDeleteClick,
  onDeleteConfirmClick,
  onEditClick,
  onMoveToDraftsClick,
  onRequestApprovalClick,
  onRescheduleClick,
  scheduledAt,
  draftDetails,
  view,
  hasFirstCommentFlip,
}) =>
  <div style={postDetailsStyle}>
    <div style={postActionDetailsStyle}>
      {renderIcon({ isPastDue, scheduledAt })}
      {renderText({ draftDetails, scheduledAt, isPastDue, view, hasPermission, manager, hasFirstCommentFlip })}
    </div>
    <div style={postControlsStyle}>
      {renderControls({
        hasPermission,
        isDeleting,
        isConfirmingDelete,
        isMoving,
        isPastDue,
        isWorking,
        manager,
        onApproveClick,
        onCancelConfirmClick,
        onDeleteClick,
        onEditClick,
        onMoveToDraftsClick,
        onRequestApprovalClick,
        onRescheduleClick,
        onDeleteConfirmClick,
        view,
      })}
    </div>
  </div>;

DraftFooter.propTypes = {
  hasPermission: PropTypes.bool.isRequired,
  isDeleting: PropTypes.bool,
  isConfirmingDelete: PropTypes.bool,
  isMoving: PropTypes.bool,
  isPastDue: PropTypes.bool,
  isWorking: PropTypes.bool,
  manager: PropTypes.bool,
  onApproveClick: PropTypes.func,
  onCancelConfirmClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onDeleteConfirmClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onMoveToDraftsClick: PropTypes.func,
  onRequestApprovalClick: PropTypes.func,
  onRescheduleClick: PropTypes.func,
  draftDetails: PropTypes.shape({
    creatorName: PropTypes.string,
    avatarUrl: PropTypes.string,
    email: PropTypes.string,
    createdAt: PropTypes.string,
    via: PropTypes.string,
    postAction: PropTypes.string,
  }).isRequired,
  scheduledAt: PropTypes.number,
  view: PropTypes.string.isRequired,
};

DraftFooter.defaultProps = {
  isDeleting: false,
  isConfirmingDelete: false,
  isMoving: false,
  isPastDue: false,
  isWorking: false,
};

export default DraftFooter;
