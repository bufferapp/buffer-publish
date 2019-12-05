import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { grayLighter, orange } from '@bufferapp/ui/style/colors';
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
  LeftBillingText,
  PromoTextStyle,
  DiscountTextStyle,
} from './style';

const UserIcon = ({ Icon, text, isSelected }) => (
  <UsersStyle isSelected={isSelected}>
    <IconStyle>{Icon}</IconStyle>
    <Text>{text}</Text>
  </UsersStyle>
);

const RightPlanButton = ({
  isNonprofit,
  nonProfitCost,
  cost,
  billingText,
  monthly,
  isSelected,
}) => (
  <RightPlanItem>
    <UserIcon Icon={<People />} text="2 users" isSelected={isSelected} />
    <PriceStyle>
      <TextStyle type="h1">
        {isNonprofit ? nonProfitCost : cost}
        <MonthlyText>{monthly}</MonthlyText>
      </TextStyle>
    </PriceStyle>
    <BillingTextStyle type="p">{billingText}</BillingTextStyle>
  </RightPlanItem>
);

const RightButton = styled(Button)`
  height: unset;
  padding: ${props => (props.isNonprofit ? '4% 3%' : '20px 30px 15px 30px')};
  border-radius: 0 25px 25px 0;
  background-color: ${props =>
    props.type === 'primary' ? '#EEF1FF' : 'white'};
  :hover {
    background-color: ${props =>
      props.type === 'primary' ? '#EEF1FF' : grayLighter};
  }
`;

const LeftPlanButton = ({
  isNonprofit,
  nonProfitCost,
  cost,
  billingText,
  monthly,
  isSelected,
}) => (
  <LeftPlanItem>
    <UserIcon Icon={<Person />} text="1 user" isSelected={isSelected} />
    <PriceStyle>
      <TextStyle type="h1">
        {isNonprofit ? nonProfitCost : cost}
        <MonthlyText>{monthly}</MonthlyText>
      </TextStyle>
    </PriceStyle>
    <BillingTextStyle type="p">{billingText}</BillingTextStyle>
  </LeftPlanItem>
);

const LeftButton = styled(RightButton)`
  border-radius: 25px 0 0 25px;
  padding: ${props => (props.isNonprofit ? '4% 2%' : '')};
`;

const PromoCostLine = styled.div`
  position: relative;
  border: 1px solid ${orange};
  width: ${props => (props.isNonprofit ? '90px' : '67px')};
  top: 30px;
  left: ${props => (props.isNonprofit ? '30px' : '35px')};
`;

const PlanColumnWithPremiumSolo = ({
  title,
  cost,
  nonProfitCost,
  soloCost,
  soloNonProfitCost,
  promoCost,
  promoNonProfitCost,
  promoDiscount,
  isNonprofit,
  imageSrc,
  plan,
  source,
  onChoosePlanClick,
  features,
  featureTooltips,
  monthly,
  buttonText,
  billingText,
  onPremiumPlanClick,
  selectedPremiumPlan,
  isAwesomePromoUser,
}) => {
  const isSelected = () => selectedPremiumPlan === 1;
  const isPremium = plan === 'premium_business';
  return (
    <ColumnStyle isAwesomePromoUser={isAwesomePromoUser}>
      <TopContentStyle>
        <Text type="h3">{title}</Text>
        <ImageWrapperStyle isPremium={isPremium}>
          <Image src={imageSrc} width="auto" height="130px" />
        </ImageWrapperStyle>
        {!isPremium && (
          <React.Fragment>
            <UserIcon Icon={<Person />} text="1 user" isSelected />
            {isAwesomePromoUser && <PromoCostLine isNonprofit={isNonprofit} />}
            <PriceStyle>
              {!isAwesomePromoUser && (
                <TextStyle type="h1">
                  {isNonprofit ? nonProfitCost : cost}
                  <MonthlyText>{monthly}</MonthlyText>
                </TextStyle>
              )}
              {isAwesomePromoUser && (
                <TextStyle type="h1">
                  <PromoTextStyle>
                    {isNonprofit ? nonProfitCost : cost}
                  </PromoTextStyle>
                  {isNonprofit ? promoNonProfitCost : promoCost}
                  <MonthlyText>{monthly}</MonthlyText>
                </TextStyle>
              )}
            </PriceStyle>
            <LeftBillingText type="p">{billingText}</LeftBillingText>
            {isAwesomePromoUser && (
              <DiscountTextStyle type="p">{promoDiscount}</DiscountTextStyle>
            )}
          </React.Fragment>
        )}
        {isPremium && (
          <React.Fragment>
            <PlanStyle>
              <LeftButton
                type={isSelected() ? 'primary' : 'secondary'}
                onClick={() => onPremiumPlanClick({ selectedPlan: 1 })}
                hasIconOnly
                size="large"
                isNonprofit={isNonprofit}
                icon={
                  <LeftPlanButton
                    isNonprofit={isNonprofit}
                    nonProfitCost={soloNonProfitCost}
                    cost={soloCost}
                    billingText={billingText}
                    monthly={monthly}
                    isSelected={isSelected()}
                  />
                }
              />
              <RightButton
                type={isSelected() ? 'secondary' : 'primary'}
                onClick={() => onPremiumPlanClick({ selectedPlan: 2 })}
                hasIconOnly
                size="large"
                isNonprofit={isNonprofit}
                icon={
                  <RightPlanButton
                    isNonprofit={isNonprofit}
                    nonProfitCost={nonProfitCost}
                    cost={cost}
                    billingText={billingText}
                    monthly={monthly}
                    isSelected={!isSelected()}
                  />
                }
              />
            </PlanStyle>
            <EmptySpan />
          </React.Fragment>
        )}
      </TopContentStyle>
      <FeatureListStyle>
        {features.map((feature, index) => (
          <PlanFeatureList
            feature={feature}
            key={feature}
            tooltip={featureTooltips[index]}
          />
        ))}
      </FeatureListStyle>
      <FooterStyle>
        <ButtonWrapperStyle>
          <Button
            type="primary"
            label={buttonText}
            fullWidth
            disabled={false}
            onClick={() =>
              onChoosePlanClick({
                source,
                plan,
                soloPlanSelected: selectedPremiumPlan === 1,
                isPromo: isAwesomePromoUser,
              })
            }
          />
        </ButtonWrapperStyle>
      </FooterStyle>
    </ColumnStyle>
  );
};

PlanColumnWithPremiumSolo.propTypes = {
  title: PropTypes.string.isRequired,
  cost: PropTypes.string.isRequired,
  nonProfitCost: PropTypes.string.isRequired,
  soloCost: PropTypes.string.isRequired,
  soloNonProfitCost: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  plan: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  onChoosePlanClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  billingText: PropTypes.string.isRequired,
  features: PropTypes.array.isRequired,
  featureTooltips: PropTypes.array.isRequired,
  isNonprofit: PropTypes.bool.isRequired,
};

export default PlanColumnWithPremiumSolo;
