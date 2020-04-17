import React from 'react';
import PropTypes from 'prop-types';
import {
  ButtonWithSkeleton,
  TextWithSkeleton,
} from '@bufferapp/publish-shared-components';
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
  NameContainer,
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
  displaySkeleton,
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

  const NameWrapper = displaySkeleton ? NameContainer : StyledLink;

  return (
    <Container>
      <LeftWrapper>
        <NameWrapper to={campaignRoute}>
          <Color color={campaign.color} displaySkeleton={displaySkeleton} />
          <TextWithSkeleton
            type="h3"
            displaySkeleton={displaySkeleton}
            aria-label={displaySkeleton ? 'Loading' : null}
            color="grayDarker"
          >
            {campaign.name}
          </TextWithSkeleton>
        </NameWrapper>
        <TextWithSkeleton
          type="p"
          displaySkeleton={displaySkeleton}
          aria-label={displaySkeleton ? 'Loading' : null}
          color="grayDark"
        >
          {campaign.lastUpdated}
        </TextWithSkeleton>
      </LeftWrapper>
      <Group>
        {campaign.dateRange ? (
          <React.Fragment>
            <Icon displaySkeleton={displaySkeleton}>
              <CalendarIcon size="medium" />
            </Icon>
            <TextWithSkeleton type="p" displaySkeleton={displaySkeleton}>
              {campaign.dateRange}
            </TextWithSkeleton>
          </React.Fragment>
        ) : (
          ''
        )}
      </Group>
      <Group>
        <Icon displaySkeleton={displaySkeleton}>
          <ClockIcon size="medium" />
        </Icon>
        <TextWithSkeleton type="p" displaySkeleton={displaySkeleton}>
          {campaign.scheduled} {translations.scheduled}
        </TextWithSkeleton>
      </Group>
      <Group>
        <Icon displaySkeleton={displaySkeleton}>
          <ListIcon size="medium" />
        </Icon>
        <TextWithSkeleton type="p" displaySkeleton={displaySkeleton}>
          {campaign.sent} {translations.sent}
        </TextWithSkeleton>
      </Group>
      <ButtonWrapper>
        <ButtonWithSkeleton
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
          onSelectClick={selectedItem => selectedItem.selectedItemClick()}
          items={
            hideAnalyzeReport
              ? selectItems
              : [viewCampaignSelectItem, ...selectItems]
          }
          disabled={displaySkeleton}
          displaySkeleton={displaySkeleton}
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
  displaySkeleton: PropTypes.bool,
  onViewCampaignClick: PropTypes.func,
  onDeleteCampaignClick: PropTypes.func,
  onEditCampaignClick: PropTypes.func,
  goToAnalyzeReport: PropTypes.func,
  hideAnalyzeReport: PropTypes.bool.isRequired,
};

ListItem.defaultProps = {
  displaySkeleton: false,
  onViewCampaignClick: () => {},
  onDeleteCampaignClick: () => {},
  onEditCampaignClick: () => {},
  goToAnalyzeReport: () => {},
};

export default ListItem;
