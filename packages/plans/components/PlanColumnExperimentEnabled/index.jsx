import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { grayLighter } from '@bufferapp/ui/style/colors';
import { Image } from '@bufferapp/components';
import { Text, Button } from '@bufferapp/ui';
import { People, Person } from '@bufferapp/ui/Icon';
import PlanFeatureList from '../PlanFeatureList';
import {
  ColumnStyle,
  TopContentStyle,
  ImageWrapperStyle,
  FooterStyle,
  ButtonWrapperStyle,
  UsersStyle,
  IconStyle,
  PriceStyle,
  FeatureListStyle,
  PlanStyle,
  RightPlanItem,
  LeftPlanItem,
  TextStyle,
  MonthlyText,
  BillingTextStyle,
  EmptySpan,
} from './style';

const UserIcon = ({ Icon, text, isSelected }) => (
  <UsersStyle isSelected={isSelected}>
    <IconStyle>
      {Icon}
    </IconStyle>
    <Text>
      {text}
    </Text>
  </UsersStyle>
);

const RightPlanButton = ({
  isNonprofit, nonProfitCost, cost, billingText, monthly, isSelected}) => (
    <RightPlanItem>
      <UserIcon Icon={<People />} text="2 users" isSelected={isSelected} />
      <PriceStyle>
        <TextStyle type="h1">
          { isNonprofit ? nonProfitCost : cost }
          <MonthlyText>{ monthly }</MonthlyText>
        </TextStyle>
      </PriceStyle>
      <BillingTextStyle type="p">{ billingText }</BillingTextStyle>
    </RightPlanItem>
);

const RightButton = styled(Button)`
  height: unset;
  padding: 20px 30px 15px 30px;
  border-top-right-radius: 25px;
  border-bottom-right-radius: 25px;
  border-top-left-radius: 0px;
  border-bottom-left-radius: 0px;
  background-color: ${props => (props.type === 'primary' ? '#EEF1FF' : 'white')};
  :hover {
    background-color: ${props => (props.type === 'primary' ? '#EEF1FF' : grayLighter)};
  }
`;

const LeftPlanButton = ({
  isNonprofit, nonProfitCost, cost, billingText, monthly, isSelected}) => (
    <LeftPlanItem>
      <UserIcon Icon={<People />} text="1 user" isSelected={isSelected} />
      <PriceStyle>
        <TextStyle type="h1">
          { isNonprofit ? nonProfitCost : cost }
          <MonthlyText>{ monthly }</MonthlyText>
        </TextStyle>
      </PriceStyle>
      <BillingTextStyle type="p">{ billingText }</BillingTextStyle>
    </LeftPlanItem>
);

const LeftButton = styled(RightButton)`
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
`;

const PlanColumnExperimentEnabled = ({
  title,
  cost,
  nonProfitCost,
  soloCost,
  soloNonProfitCost,
  isNonprofit,
  imageSrc,
  plan,
  currentPlan,
  source,
  onChoosePlanClick,
  features,
  featureTooltips,
  monthly,
  buttonText,
  buttonCurrentPlanText,
  billingText,
  onPremiumPlanClick,
  selectedPremiumPlan,
}) => {
  const isSelected = () => selectedPremiumPlan === 1;
  return (
    <ColumnStyle>
      <TopContentStyle>
        <Text type="h3">{ title }</Text>
        <ImageWrapperStyle>
          <Image
            src={imageSrc}
            width="auto"
            height="130px"
          />
        </ImageWrapperStyle>
        {plan !== 'premium_business' && (
          <div>
            <UserIcon Icon={<Person />} text="1 user" isSelected />
            <PriceStyle>
              <TextStyle type="h1">
                { isNonprofit ? nonProfitCost : cost }
                <MonthlyText>{ monthly }</MonthlyText>
              </TextStyle>
            </PriceStyle>
            <Text type="p">{ billingText }</Text>
          </div>
        )}
        {plan === 'premium_business' && (
        <div>
          <PlanStyle>
            <LeftButton
              type={isSelected() ? 'primary' : 'secondary'}
              onClick={() => onPremiumPlanClick({ selectedPlan: 1 })}
              hasIconOnly
              size="large"
              icon={<LeftPlanButton isNonprofit={isNonprofit} nonProfitCost={soloNonProfitCost} cost={soloCost} billingText={billingText} monthly={monthly} isSelected={isSelected()} />}
            />
            <RightButton
              type={isSelected() ? 'secondary' : 'primary'}
              onClick={() => onPremiumPlanClick({ selectedPlan: 2 })}
              hasIconOnly
              size="large"
              icon={<RightPlanButton isNonprofit={isNonprofit} nonProfitCost={nonProfitCost} cost={cost} billingText={billingText} monthly={monthly} isSelected={!isSelected()} />}
            />
          </PlanStyle>
          <EmptySpan />
        </div>
        )}
      </TopContentStyle>
      <FeatureListStyle>
        {features.map((feature, index) => (
          <PlanFeatureList feature={feature} key={feature} tooltip={featureTooltips[index]} />
        ))}
      </FeatureListStyle>
      <FooterStyle>
        <ButtonWrapperStyle>
          <Button
            type="primary"
            label={currentPlan === plan ? buttonCurrentPlanText : buttonText}
            fullWidth
            disabled={currentPlan === plan}
            onClick={() => onChoosePlanClick({ source, plan, soloPlanSelected: selectedPremiumPlan === 1 })}
          />
        </ButtonWrapperStyle>
      </FooterStyle>
    </ColumnStyle>
  )
};

PlanColumnExperimentEnabled.propTypes = {
  title: PropTypes.string.isRequired,
  cost: PropTypes.string.isRequired,
  nonProfitCost: PropTypes.string.isRequired,
  soloCost: PropTypes.string.isRequired,
  soloNonProfitCost: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  plan: PropTypes.string.isRequired,
  currentPlan: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  onChoosePlanClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  buttonCurrentPlanText: PropTypes.string.isRequired,
  billingText: PropTypes.string.isRequired,
  features: PropTypes.array.isRequired,
  featureTooltips: PropTypes.array.isRequired,
  isNonprofit: PropTypes.bool.isRequired,
};

export default PlanColumnExperimentEnabled;
