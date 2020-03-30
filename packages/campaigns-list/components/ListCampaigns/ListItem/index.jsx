import React from 'react';
import PropTypes from 'prop-types';
import { Text, Button } from '@bufferapp/ui';

import ClockIcon from '@bufferapp/ui/Icon/Icons/Clock';
import ListIcon from '@bufferapp/ui/Icon/Icons/List';
import CalendarIcon from '@bufferapp/ui/Icon/Icons/Calendar';
import { campaignScheduled } from '@bufferapp/publish-routes';

import {
  ButtonWrapper,
  Color,
  Container,
  Group,
  Icon,
  LeftWrapper,
  LastUpdated,
  StyledLink,
} from './style';

const ListItem = ({
  campaign,
  hideAnalyzeReport,
  onEditCampaignClick,
  onDeleteCampaignClick,
  onViewCampaignClick,
  goToAnalyzeReport,
  translations,
}) => {
  const campaignId = campaign.id;
  const selectItems = [
    {
      title: translations.editCampaign,
      selectedItemClick: () => {
        onEditCampaignClick({ campaignId });
      },
    },
    {
      title: translations.deleteCampaign,
      selectedItemClick: () => {
        onDeleteCampaignClick(campaign);
      },
    },
  ];

  const viewCampaignSelectItem = {
    title: translations.viewCampaign,
    selectedItemClick: () => {
      onViewCampaignClick({ campaignId });
    },
  };

  const campaignRoute = campaignScheduled.getRoute({
    campaignId: campaign.id,
  });

  return (
    <Container>
      <LeftWrapper>
        <StyledLink to={campaignRoute}>
          <Color color={campaign.color} />
          <Text type="h3">{campaign.name}</Text>
        </StyledLink>
        <Text type="p">
          <LastUpdated>{campaign.lastUpdated}</LastUpdated>
        </Text>
      </LeftWrapper>
      <Group>
        {campaign.dateRange ? (
          <React.Fragment>
            <Icon>
              <CalendarIcon size="medium" />
            </Icon>
            <Text type="p">{campaign.dateRange}</Text>
          </React.Fragment>
        ) : (
          ''
        )}
      </Group>
      <Group>
        <Icon>
          <ClockIcon size="medium" />
        </Icon>
        <Text type="p">
          {campaign.scheduled} {translations.scheduled}
        </Text>
      </Group>
      <Group>
        <Icon>
          <ListIcon size="medium" />
        </Icon>
        <Text type="p">
          {campaign.sent} {translations.sent}
        </Text>
      </Group>
      <ButtonWrapper>
        <Button
          onClick={
            hideAnalyzeReport
              ? viewCampaignSelectItem.selectedItemClick
              : () => {
                  goToAnalyzeReport(campaign);
                }
          }
          type="secondary"
          isSplit
          label={
            hideAnalyzeReport
              ? translations.viewCampaign
              : translations.viewReport
          }
          onSelectClick={selectedItem => {
            if (typeof selectedItem.selectedItemClick !== 'undefined') {
              selectedItem.selectedItemClick();
            }
            return false;
          }}
          items={
            hideAnalyzeReport
              ? selectItems
              : [viewCampaignSelectItem, ...selectItems]
          }
        />
      </ButtonWrapper>
    </Container>
  );
};

ListItem.propTypes = {
  translations: PropTypes.shape({
    viewReport: PropTypes.string,
    viewCampaign: PropTypes.string,
    editCampaign: PropTypes.string,
    deleteCampaign: PropTypes.string,
    sent: PropTypes.string,
    scheduled: PropTypes.string,
  }).isRequired,
  campaign: PropTypes.shape({
    color: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    sent: PropTypes.number,
    scheduled: PropTypes.number,
    lastUpdated: PropTypes.string,
    dateRange: PropTypes.string,
  }).isRequired,
  onViewCampaignClick: PropTypes.func.isRequired,
  onDeleteCampaignClick: PropTypes.func.isRequired,
  onEditCampaignClick: PropTypes.func.isRequired,
  goToAnalyzeReport: PropTypes.func.isRequired,
  hideAnalyzeReport: PropTypes.bool.isRequired,
};

export default ListItem;
