import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
} from './style';

const UsersStyle = styled.span`
  align-items: center;
  justify-content: center;
  display: flex;
  color: blue;
`;

const IconStyle = styled.span`
  display: flex;
  padding-right: 4px;
`;

const PriceStyle = styled.span`
  h1 {
    margin-bottom: 5px;
  }
`;

const BillingTextStyle = styled.span`
  font-size: 14px;
  color: gray;
`;

const FeatureListStyle = styled.span`
  margin-top: 35px;
`;

const PlanStyle = styled.div`
  display: flex;
  align-items: center;
`;

const RightPlanItem = styled.div`
  margin-left: 5px;
`;

const LeftPlanItem = styled.div`
  margin-right: 5px;
`;

const UserIcon = ({ Icon, text }) => (
  <UsersStyle>
    <IconStyle>
      {Icon}
    </IconStyle>
    <Text>
      {text}
    </Text>
  </UsersStyle>
);

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
  buttonText,
  buttonCurrentPlanText,
  billingText,
}) => (
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
          <UserIcon Icon={plan === 'premium_business' ? <People /> : <Person />} text={plan === 'premium_business' ? '2 users' : '1 user'} />
          <PriceStyle>
            <Text type="h1">
              { isNonprofit ? nonProfitCost : cost }
              /mo
            </Text>
          </PriceStyle>
          <BillingTextStyle>
            <Text>{ billingText }</Text>
          </BillingTextStyle>
        </div>
      )}
      {plan === 'premium_business' && (
      <PlanStyle>
        <LeftPlanItem>
          <UserIcon Icon={<People />} text="2 users" />
          <PriceStyle>
            <Text type="h1">
              { isNonprofit ? nonProfitCost : cost }
              /mo
            </Text>
          </PriceStyle>
          <BillingTextStyle>
            <Text>{ billingText }</Text>
          </BillingTextStyle>
        </LeftPlanItem>
        <RightPlanItem>
          <UserIcon Icon={<Person />} text="1 user" />
          <PriceStyle>
            <Text type="h1">
              { isNonprofit ? soloNonProfitCost : soloCost }
              /mo
            </Text>
          </PriceStyle>
          <BillingTextStyle>
            <Text>{ billingText }</Text>
          </BillingTextStyle>
        </RightPlanItem>
      </PlanStyle>
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
          onClick={() => onChoosePlanClick({ source, plan })}
        />
      </ButtonWrapperStyle>
    </FooterStyle>
  </ColumnStyle>
);

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
