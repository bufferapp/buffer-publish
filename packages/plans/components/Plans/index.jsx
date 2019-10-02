import React from 'react';
import PropTypes from 'prop-types';
import { Text, Button } from '@bufferapp/ui';
import { ArrowLeft } from '@bufferapp/ui/Icon';
import { gray } from '@bufferapp/ui/style/colors';
import ProfileSidebarComponent from '@bufferapp/publish-profile-sidebar/components/ProfileSidebar';
import styled from 'styled-components';
import PlanColumn from '../PlanColumn';
import PlanColumnExperimentControl from '../PlanColumnExperimentControl';
import { getSource } from '../../utils/plans';

const ButtonStyle = styled.div`
  padding: 16px 16px 0px;
`;

const ColumnContainerStyle = styled.div`
  display: flex;
  justify-content: center;
`;

const HeaderStyle = styled(Text)`
  margin-top: 0px;
`;

const ContainerStyle = styled.div`
  overflow-y: auto;
`;

const Plans = ({
  onChoosePlanClick,
  currentPlan,
  onBackToDashboardClick,
  selectedProfileId,
  profiles,
  translations,
  isNonprofit,
  isExperimentControl,
}) => (
  <ContainerStyle>
    <ButtonStyle>
      <Button
        type="secondary"
        size="small"
        icon={<ArrowLeft color={gray} />}
        label={translations.buttonDashboardText}
        onClick={() =>
          onBackToDashboardClick({
            selectedProfileId,
            profiles,
          })
        }
      />
    </ButtonStyle>
    <div style={{ textAlign: 'center' }}>
      <HeaderStyle type="h1">{ translations.headerText }</HeaderStyle>
      <ColumnContainerStyle>
        {!isExperimentControl && (
        <div>
          <PlanColumn
            {...translations.pro}
            imageSrc="https://static.buffer.com/marketing/static/illustrations/publish-pricing-pro@2x.jpeg"
            currentPlan={currentPlan}
            onChoosePlanClick={onChoosePlanClick}
            source={getSource({ newPlan: 'pro', currentPlan })}
            isNonprofit={isNonprofit}
          />
          <PlanColumn
            {...translations.premium}
            imageSrc="https://static.buffer.com/marketing/static/illustrations/publish-pricing-premium@2x.jpeg"
            currentPlan={currentPlan}
            onChoosePlanClick={onChoosePlanClick}
            source={getSource({ newPlan: 'premium_business', currentPlan })}
            isNonprofit={isNonprofit}
          />
        </div>
        )}
        {isExperimentControl && (
        <div>
          <PlanColumn
            {...translations.pro}
            imageSrc="https://static.buffer.com/marketing/static/illustrations/publish-pricing-pro@2x.jpeg"
            currentPlan={currentPlan}
            onChoosePlanClick={onChoosePlanClick}
            source={getSource({ newPlan: 'pro', currentPlan })}
            isNonprofit={isNonprofit}
          />
          <PlanColumn
            {...translations.premium}
            imageSrc="https://static.buffer.com/marketing/static/illustrations/publish-pricing-premium@2x.jpeg"
            currentPlan={currentPlan}
            onChoosePlanClick={onChoosePlanClick}
            source={getSource({ newPlan: 'premium_business', currentPlan })}
            isNonprofit={isNonprofit}
          />
        </div>
        )}
      </ColumnContainerStyle>
    </div>
  </ContainerStyle>
);

Plans.propTypes = {
  onChoosePlanClick: PropTypes.func.isRequired,
  currentPlan: PropTypes.string.isRequired,
  onBackToDashboardClick: PropTypes.func.isRequired,
  selectedProfileId: ProfileSidebarComponent.propTypes.selectedProfileId,
  profiles: ProfileSidebarComponent.propTypes.profiles.isRequired,
  translations: PropTypes.object.isRequired,  // eslint-disable-line
  isNonprofit: PropTypes.bool.isRequired,
  isExperimentControl: PropTypes.bool.isRequired,
};

export default Plans;
