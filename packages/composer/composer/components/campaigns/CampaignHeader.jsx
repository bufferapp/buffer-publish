import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@bufferapp/ui';
import Select from '@bufferapp/ui/Select';
import Tooltip from '@bufferapp/ui/Tooltip';
import ChevronDownIcon from '@bufferapp/ui/Icon/Icons/ChevronDown';
import ComposerActionCreators from '../../action-creators/ComposerActionCreators';
import QuestionIcon from '../QuestionIcon';
import {
  SelectWrapper,
  Container,
  Color,
  Icon,
  Separator,
  CustomButton,
  Checkmark,
  LabelWrapper,
  IconWrapper,
  ColorWrapper,
  TextWrapper,
} from './styles';

const CustomLabel = ({ campaign, onClick }) => (
  <CustomButton onClick={onClick}>
    <LabelWrapper>
      {campaign.color && <Color color={campaign.color} />}
      <Text color="grayDarker" type="label">
        {campaign.name}
      </Text>
    </LabelWrapper>
    <ChevronDownIcon />
  </CustomButton>
);

CustomLabel.propTypes = {
  campaign: PropTypes.shape({
    color: PropTypes.string,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

const getLabel = (campaign, isSelected) => (
  <LabelWrapper title={campaign.name}>
    <IconWrapper>{isSelected && <Checkmark />}</IconWrapper>
    {campaign.color && <Color color={campaign.color} />}
    <TextWrapper>
      <Text>{campaign.name}</Text>
    </TextWrapper>
  </LabelWrapper>
);

const noCampaign = { id: null, name: 'No Campaign' };

export const getSelected = ({ campaigns, campaignId }) => {
  const selected = campaignId
    ? campaigns.find(campaign => campaign?.id === campaignId)
    : noCampaign;
  return selected || noCampaign;
};

const CampaignHeader = ({ campaigns = [], campaignId = null }) => {
  const hasCampaigns = campaigns?.length > 0;
  const [selected, setSelected] = useState(
    getSelected({ campaigns, campaignId })
  );

  const updateCampaignId = campaign => {
    setSelected(campaign);
    ComposerActionCreators.updateDraftsCampaignId(campaign.id);
  };

  const getCampaignItems = selectedCampaignId => {
    return campaigns.map(campaign => ({
      title: getLabel(campaign, campaign.id === selectedCampaignId),
      selectedItemClick: () => {
        updateCampaignId(campaign);
      },
    }));
  };

  const noCampaignItem = selectedCampaignId => {
    return {
      title: getLabel(noCampaign, noCampaign.id === selectedCampaignId),
      selectedItemClick: () => {
        updateCampaignId(noCampaign);
      },
    };
  };

  useEffect(() => {
    if (!campaignId && hasCampaigns) {
      // select a campaign on default
      updateCampaignId(noCampaign);
    }
  }, []);

  return (
    <React.Fragment>
      <Container>
        <Text type="label">Campaign</Text>
        <Tooltip label="Manage related content across social accounts with a campaign.">
          <Icon>
            <QuestionIcon />
          </Icon>
        </Tooltip>
        <SelectWrapper>
          <Select
            hideSearch
            fullWidth
            type="secondary"
            label={selected.name}
            customButton={onClick => (
              <CustomLabel campaign={selected} onClick={onClick} />
            )}
            disabled={!hasCampaigns}
            onSelectClick={selectedItem => {
              if (typeof selectedItem.selectedItemClick !== 'undefined') {
                selectedItem.selectedItemClick();
              }
              return false;
            }}
            items={[
              noCampaignItem(selected.id),
              ...getCampaignItems(selected.id),
            ]}
          />
        </SelectWrapper>
      </Container>
      <Separator />
    </React.Fragment>
  );
};

CampaignHeader.propTypes = {
  // eslint-disable-next-line react/require-default-props
  campaigns: PropTypes.arrayOf({}),
  // eslint-disable-next-line react/require-default-props
  campaignId: PropTypes.string,
};

export default CampaignHeader;
