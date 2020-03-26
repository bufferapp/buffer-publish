import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@bufferapp/ui';

import { getColorContrast } from '@bufferapp/publish-shared-components/ColorPicker/utils/HexValidations';

const TagButton = styled(Button)`
  margin-left: 16px;
  margin-bottom: 16px;
  padding: 8px;
  height: initial;
  opacity: ${props => (props.dragging ? 0 : 1)};
  background-color: ${props => props.color};
  border-color: ${props => props.color};
  :hover {
    background-color: ${props => props.color};
    color: ${props => props.textColor};
    border-color: ${props => props.color};
    opacity: 0.9;
  }
  color: ${props => props.textColor};
`;

const PostTag = ({ name, color, dragging, onPostTagClick }) => (
  <div>
    <TagButton
      type="primary"
      onClick={onPostTagClick}
      label={name}
      dragging={dragging}
      color={color}
      textColor={getColorContrast(color)}
    />
  </div>
);

PostTag.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  dragging: PropTypes.bool.isRequired,
  onPostTagClick: PropTypes.func.isRequired,
};

export default PostTag;
