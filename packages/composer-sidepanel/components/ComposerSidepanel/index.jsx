import React from 'react';
import PropTypes from 'prop-types';
import { calculateStyles } from '@bufferapp/components/lib/utils';
import { Cross } from '@bufferapp/ui/Icon';

const sidepanelWrapperStyle = {
  position: 'absolute',
  width: '200px',
  backgroundColor: 'white',
  top: 0,
  right: '-210px',
  height: '100%',
  display: 'none',
  borderRadius: '3px',
};

const closeIconStyle = {
  position: 'absolute',
  cursor: 'pointer',
  top: '15px',
  right: '15px',
};

const ComposerSidepanel = ({ isVisible, onClose, children }) =>
  <div
    id="composer-sidepanel"
    style={calculateStyles(
      {
        default: sidepanelWrapperStyle,
        isVisible: {
          display: 'block',
        },
      },
      {
        isVisible,
      },
    )}
  >
    <div style={closeIconStyle}>
      <Cross size="medium" onClick={onClose} />
    </div>
    {children}
  </div>;

ComposerSidepanel.propTypes = {
  isVisible: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
};

ComposerSidepanel.defaultProps = {
  isVisible: false,
  onClose: () => {},
};

export default ComposerSidepanel;
