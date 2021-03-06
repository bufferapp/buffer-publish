import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '@bufferapp/components';
import { Text, Button } from '@bufferapp/ui';
import PlanFeatureList from '../PlanFeatureList';
import {
  ColumnStyle,
  TopContentStyle,
  ImageWrapperStyle,
  SubtitleStyle,
  FooterStyle,
  ButtonWrapperStyle,
  LinkStyle,
} from './style';

const PlanColumn = ({
  title,
  cost,
  nonProfitCost,
  isNonprofit,
  subtitle,
  imageSrc,
  plan,
  source,
  onChoosePlanClick,
  monthly,
  features,
  buttonText,
  billingText,
}) => (
  <ColumnStyle>
    <TopContentStyle>
      <Text type="h3">{title}</Text>
      <ImageWrapperStyle>
        <Image src={imageSrc} width="auto" height="130px" />
      </ImageWrapperStyle>
      <Text type="h1">
        { isNonprofit ? nonProfitCost : cost }
        {monthly}
      </Text>
      <Text>{billingText}</Text>
      <SubtitleStyle>
        <Text>{subtitle}</Text>
      </SubtitleStyle>
    </TopContentStyle>
    {features.map(feature => (
      <PlanFeatureList feature={feature} key={feature} />
    ))}
    <FooterStyle>
      <ButtonWrapperStyle>
        <Button
          type="primary"
          label={buttonText}
          fullWidth
          disabled={false}
          onClick={() => onChoosePlanClick({ source, plan })}
        />
      </ButtonWrapperStyle>
      <Text>or </Text>
      <LinkStyle href="https://buffer.com/pricing/publish#compare-features">
        <Text>see more features</Text>
      </LinkStyle>
    </FooterStyle>
  </ColumnStyle>
);

PlanColumn.propTypes = {
  title: PropTypes.string.isRequired,
  cost: PropTypes.string.isRequired,
  nonProfitCost: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  plan: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  onChoosePlanClick: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  billingText: PropTypes.string.isRequired,
  features: PropTypes.array.isRequired,
  isNonprofit: PropTypes.bool.isRequired,
};

export default PlanColumn;
