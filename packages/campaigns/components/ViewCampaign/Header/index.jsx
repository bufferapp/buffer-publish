import React from 'react';
import PropTypes from 'prop-types';
import { Text, Button } from '@bufferapp/ui';

import ArrowRightIcon from '@bufferapp/ui/Icon/Icons/ArrowRight';
import ClockIcon from '@bufferapp/ui/Icon/Icons/Clock';
import ListIcon from '@bufferapp/ui/Icon/Icons/List';

import {
  ButtonWrapper,
  CampaignDetails,
  Color,
  Container,
  Details,
  Group,
  Icon,
  LastUpdated,
  SubText,
  Title,
} from './style';

const Header = ({
  translations,
  campaignDetails,
  isOwner,
  hasPosts,
  onCreatePostClick,
  onDeleteCampaignClick,
  onEditCampaignClick,
}) => (
  <Container>
    <CampaignDetails>
      <Title>
        <Color color={campaignDetails.color} />
        <Text type="h1">{campaignDetails.name}</Text>
      </Title>
      <SubText>
        {hasPosts && (
          <Details>
            <Group>
              <Icon>
                <ClockIcon size="medium" />
              </Icon>
              <Text type="p">{campaignDetails.dateRange}</Text>
            </Group>
            <Group>
              <Icon>
                <ClockIcon size="medium" />
              </Icon>
              <Text type="p">{campaignDetails.scheduled}</Text>
            </Group>
            <Group>
              <Icon>
                <ListIcon size="medium" />
              </Icon>
              <Text type="p">{campaignDetails.sent}</Text>
            </Group>
          </Details>
        )}
        <Text type="p">
          <LastUpdated>{campaignDetails.lastUpdated}</LastUpdated>
        </Text>
      </SubText>
    </CampaignDetails>
    <ButtonWrapper>
      <Button
        onClick={onCreatePostClick}
        type="secondary"
        isSplit
        label={translations.createPost}
        onSelectClick={selectedItem => {
          if (typeof selectedItem.selectedItemClick !== 'undefined') {
            selectedItem.selectedItemClick();
          }
          return false;
        }}
        items={[
          {
            title: translations.createPost,
            selectedItemClick: onCreatePostClick,
          },
          {
            title: translations.editCampaign,
            selectedItemClick: onEditCampaignClick,
          },
          {
            title: translations.deleteCampaign,
            selectedItemClick: onDeleteCampaignClick,
          },
        ]}
      />
      {isOwner && (
        <Button
          type="secondary"
          icon={<ArrowRightIcon />}
          iconEnd
          onClick={() => {}}
          disabled={!hasPosts}
          label={translations.viewReport}
        />
      )}
    </ButtonWrapper>
  </Container>
);

Header.propTypes = {
  translations: PropTypes.shape({
    viewReport: PropTypes.string,
    createPost: PropTypes.string,
    editCampaign: PropTypes.string,
    deleteCampaign: PropTypes.string,
  }).isRequired,
  campaignDetails: PropTypes.shape({
    name: PropTypes.string,
    color: PropTypes.string,
    dateRange: PropTypes.string,
    scheduled: PropTypes.string,
    sent: PropTypes.string,
    lastUpdated: PropTypes.string,
  }).isRequired,
  hasPosts: PropTypes.string.isRequired,
  isOwner: PropTypes.bool.isRequired,
  onCreatePostClick: PropTypes.func.isRequired,
  onDeleteCampaignClick: PropTypes.func.isRequired,
  onEditCampaignClick: PropTypes.func.isRequired,
};

export default Header;
