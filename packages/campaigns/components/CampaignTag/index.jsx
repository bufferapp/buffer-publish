import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '@bufferapp/ui';

import { getColorContrast } from '@bufferapp/publish-shared-components/ColorPicker/utils/HexValidations';

const CampaignButton = styled(Button)`
  margin-left: 16px;
  margin-bottom: 16px;
  padding: 8px;
  opacity: ${props => (props.dragging ? 0 : 1)};
  background-color: ${props => props.campaignColor};
  border-color: ${props => props.campaignColor};
  :hover {
    background-color: ${props => props.campaignColor};
    color: ${props => props.textColor};
  }
  color: ${props => props.textColor};
`;

const CampaignTag = ({
  campaignName,
  campaignColor,
  dragging,
  onCampaignTagClick,
}) => {
  return (
    <CampaignButton
      type="primary"
      onClick={onCampaignTagClick}
      label={campaignName}
      dragging={dragging}
      campaignColor={campaignColor}
      textColor={getColorContrast(campaignColor)}
    />
  );
};

CampaignTag.propTypes = {
  campaignName: PropTypes.string.isRequired,
  campaignColor: PropTypes.string.isRequired,
  dragging: PropTypes.bool.isRequired,
  onCampaignTagClick: PropTypes.func.isRequired,
};

export default CampaignTag;
