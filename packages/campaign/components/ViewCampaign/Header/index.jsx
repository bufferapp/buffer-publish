import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Text } from '@bufferapp/ui';
import ArrowRightIcon from '@bufferapp/ui/Icon/Icons/ArrowRight';
import ClockIcon from '@bufferapp/ui/Icon/Icons/Clock';
import ListIcon from '@bufferapp/ui/Icon/Icons/List';
import CalendarIcon from '@bufferapp/ui/Icon/Icons/Calendar';
import {
  ButtonWithSkeleton,
  TextWithSkeleton,
} from '@bufferapp/publish-shared-components';
import { useTranslation } from 'react-i18next';

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
  Name,
} from './style';

const Header = ({
  campaignDetails,
  hideAnalyzeReport,
  showCampaignActions,
  onCreatePostClick,
  onDeleteCampaignClick,
  onEditCampaignClick,
  goToAnalyzeReport,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <Container aria-label="Campaign Details">
      <CampaignDetails>
        <Title>
          <Color color={campaignDetails.color} displaySkeleton={isLoading} />
          <Name
            type="h2"
            displaySkeleton={isLoading}
            aria-label={isLoading ? 'Loading' : null}
            aria-live="polite"
            aria-busy={isLoading}
          >
            {campaignDetails.name ||
              t('campaigns.viewCampaign.loadingCampaignName')}
          </Name>
        </Title>
        <SubText>
          {isLoading && (
            <TextWithSkeleton
              type="p"
              displaySkeleton={isLoading}
              aria-label={isLoading ? 'Loading' : null}
              aria-live="polite"
              aria-busy={isLoading}
            >
              {t('campaigns.viewCampaign.loadingCampaignDetails')}
            </TextWithSkeleton>
          )}
          {!isLoading && (
            <Fragment>
              <Details>
                {campaignDetails.dateRange && (
                  <Group>
                    <Icon>
                      <CalendarIcon size="medium" />
                    </Icon>
                    <Text type="p">{campaignDetails.dateRange}</Text>
                  </Group>
                )}
                <Group>
                  <Icon>
                    <ClockIcon size="medium" />
                  </Icon>
                  <Text type="p">
                    {campaignDetails.scheduled}{' '}
                    {t('campaigns.viewCampaign.scheduled')}
                  </Text>
                </Group>
                <Group>
                  <Icon>
                    <ListIcon size="medium" />
                  </Icon>
                  <Text type="p">
                    {campaignDetails.sent} {t('campaigns.viewCampaign.sent')}
                  </Text>
                </Group>
              </Details>
              <Text type="p">
                <LastUpdated>{campaignDetails.lastUpdated}</LastUpdated>
              </Text>
            </Fragment>
          )}
        </SubText>
      </CampaignDetails>
      <ButtonWrapper>
        <ButtonWithSkeleton
          onClick={onCreatePostClick}
          type="secondary"
          isSplit={showCampaignActions}
          label={t('campaigns.viewCampaign.createPost')}
          disabled={isLoading}
          displaySkeleton={isLoading}
          onSelectClick={selectedItem =>
            selectedItem.selectedItemClick(campaignDetails)
          }
          items={[
            {
              title: t('campaigns.viewCampaign.createPost'),
              selectedItemClick: onCreatePostClick,
            },
            {
              title: t('campaigns.viewCampaign.editCampaign'),
              selectedItemClick: campaign => onEditCampaignClick(campaign.id),
            },
            {
              title: t('campaigns.viewCampaign.deleteCampaign'),
              selectedItemClick: campaign => onDeleteCampaignClick(campaign),
            },
          ]}
        />
        {!hideAnalyzeReport && (
          <ButtonWithSkeleton
            type="primary"
            icon={<ArrowRightIcon />}
            iconEnd
            onClick={() => {
              goToAnalyzeReport(campaignDetails);
            }}
            displaySkeleton={isLoading}
            disabled={!campaignDetails.dateRange || isLoading}
            label={t('campaigns.viewCampaign.viewReport')}
          />
        )}
      </ButtonWrapper>
    </Container>
  );
};

Header.propTypes = {
  campaignDetails: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    color: PropTypes.string,
    dateRange: PropTypes.string,
    scheduled: PropTypes.number,
    sent: PropTypes.number,
    lastUpdated: PropTypes.string,
  }).isRequired,
  hideAnalyzeReport: PropTypes.bool.isRequired,
  showCampaignActions: PropTypes.bool.isRequired,
  onCreatePostClick: PropTypes.func.isRequired,
  onDeleteCampaignClick: PropTypes.func.isRequired,
  onEditCampaignClick: PropTypes.func.isRequired,
  goToAnalyzeReport: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

Header.defaultProps = {
  isLoading: false,
};

export default Header;
