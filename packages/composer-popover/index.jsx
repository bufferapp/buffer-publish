import React from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@bufferapp/components';
import { hot } from 'react-hot-loader/root';
import ComposerWrapper from './components/ComposerWrapper';

const onOverlayClick = (onSave, onComposerOverlayClick, editMode) => {
  // If the composer is in editMode, display the confirmation modal
  if (editMode) {
    onComposerOverlayClick();
  } else {
    onSave();
  }
};

const ComposerPopover = ({
  onSave,
  onComposerOverlayClick,
  transparentOverlay,
  preserveComposerStateOnClose,
  shouldResetComposerData,
  type,
  editMode,
}) => (
  <Popover
    width="100%"
    top="5rem"
    transparentOverlay={transparentOverlay}
    onOverlayClick={() =>
      onOverlayClick(onSave, onComposerOverlayClick, editMode)
    }
  >
    <ComposerWrapper
      type={type}
      onSave={onSave}
      preserveStateOnClose={preserveComposerStateOnClose}
      shouldResetComposerData={shouldResetComposerData}
    />
  </Popover>
);

ComposerPopover.propTypes = {
  onSave: PropTypes.func.isRequired,
  onComposerOverlayClick: PropTypes.func.isRequired,
  transparentOverlay: PropTypes.bool,
  preserveComposerStateOnClose: PropTypes.bool,
  type: PropTypes.oneOf(['queue', 'drafts', 'sent', 'pastReminders']),
  editMode: PropTypes.bool,
};

ComposerPopover.defaultProps = {
  transparentOverlay: false,
  preserveComposerStateOnClose: false,
  type: 'queue',
  editMode: false,
};

export default hot(ComposerPopover);
