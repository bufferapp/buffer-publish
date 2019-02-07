import React from 'react';
import PropTypes from 'prop-types';
import {
  QueueItems,
  BufferLoading,
  LockedProfileNotification,
} from '@bufferapp/publish-shared-components';
import ComposerPopover from '@bufferapp/publish-composer-popover';
import {
  Input,
} from '@bufferapp/components';
import Empty from '../Empty';

const composerStyle = {
  marginBottom: '1.5rem',
  flexGrow: '1',
};

const topBarContainerStyle = {
  display: 'flex',
};

const loadingContainerStyle = {
  width: '100%',
  height: '100%',
  textAlign: 'center',
  paddingTop: '5rem',
};

const containerStyle = {
  marginRight: '0.5rem',
};

const DraftList = ({
  loading,
  postLists,
  manager,
  onApproveClick,
  onCancelConfirmClick,
  onDeleteClick,
  onDeleteConfirmClick,
  onEditClick,
  onMoveToDraftsClick,
  onRequestApprovalClick,
  onRescheduleClick,
  onComposerPlaceholderClick,
  onComposerCreateSuccess,
  showComposer,
  editMode,
  tabId,
  isLockedProfile,
  onClickUpgradeToPro,
}) => {
  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <BufferLoading size={64} />
      </div>
    );
  }

  if (isLockedProfile) {
    return (
      <LockedProfileNotification onClickUpgradeToPro={onClickUpgradeToPro} />
    );
  }

  return (
    <div className={containerStyle}>
      <div style={topBarContainerStyle}>
        {tabId === 'drafts' &&
          <div style={composerStyle}>
            {showComposer && !editMode &&
              <ComposerPopover
                type={'drafts'}
                onSave={onComposerCreateSuccess}
                preserveComposerStateOnClose
              />
            }
            <Input
              placeholder={'Create a new draft...'}
              onFocus={onComposerPlaceholderClick}
            />
          </div>
        }
      </div>
      {showComposer && editMode &&
        <ComposerPopover
          type={'drafts'}
          onSave={onComposerCreateSuccess}
        />
      }
      {
        postLists.length > 0 ?
          <QueueItems
            items={postLists}
            onApproveClick={onApproveClick}
            onCancelConfirmClick={onCancelConfirmClick}
            onDeleteClick={onDeleteClick}
            onDeleteConfirmClick={onDeleteConfirmClick}
            onEditClick={onEditClick}
            onMoveToDraftsClick={onMoveToDraftsClick}
            onRequestApprovalClick={onRequestApprovalClick}
            onRescheduleClick={onRescheduleClick}
            draggable={false}
            type={'drafts'}
          /> :
          <Empty
            isManager={manager}
            view={tabId}
          />
      }
    </div>
  );
};

DraftList.propTypes = {
  loading: PropTypes.bool,
  postLists: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
    }),
  ),
  manager: PropTypes.bool.isRequired,
  onApproveClick: PropTypes.func.isRequired,
  onCancelConfirmClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onDeleteConfirmClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onMoveToDraftsClick: PropTypes.func.isRequired,
  onRequestApprovalClick: PropTypes.func.isRequired,
  onRescheduleClick: PropTypes.func.isRequired,
  onComposerPlaceholderClick: PropTypes.func.isRequired,
  onComposerCreateSuccess: PropTypes.func.isRequired,
  showComposer: PropTypes.bool,
  editMode: PropTypes.bool,
  tabId: PropTypes.oneOf(['awaitingApproval', 'pendingApproval', 'drafts']),
  isLockedProfile: PropTypes.bool,
  onClickUpgradeToPro: PropTypes.func.isRequired,
};

DraftList.defaultProps = {
  loading: true,
  postLists: [],
  showComposer: false,
  editMode: false,
  tabId: null,
  isLockedProfile: false,
};

export default DraftList;
