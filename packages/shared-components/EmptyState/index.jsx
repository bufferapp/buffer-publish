import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, Button } from '@bufferapp/ui';
import { Image } from '@bufferapp/components';

const Wrapper = styled.div`
  height: ${props => (props.height ? props.height : '70vh')};
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const Emoji = styled(Text)`
  font-size: 24px;
`;

const TextContainer = styled.div`
  width: 400px;
`;

const Subtitle = styled(Text)`
  margin: 0;
`;

const Title = styled(Text)`
  margin: 0 0 8px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 24px;

  button:nth-of-type(2n) {
    margin-left: 8px;
  }
`;

const EmptyState = ({
  title,
  subtitle,
  emoji,
  heroImg,
  heroImgSize,
  height,
  primaryAction,
  secondaryAction,
}) => {
  return (
    <Wrapper height={height}>
      {emoji && <Emoji type="h3">{emoji}</Emoji>}
      {heroImg && (
        <Image
          marginBottom="24px"
          alt=""
          src={heroImg}
          width={heroImgSize?.width}
          height={heroImgSize?.height}
        />
      )}
      <TextContainer>
        {title && <Title type="h3">{title}</Title>}
        {subtitle && <Subtitle type="p">{subtitle}</Subtitle>}
      </TextContainer>
      <ButtonWrapper>
        {secondaryAction && (
          <Button
            type="secondary"
            size="large"
            onClick={secondaryAction.onClick}
            label={secondaryAction.label}
          />
        )}
        {primaryAction && (
          <Button
            type="primary"
            icon={primaryAction.icon ?? null}
            iconEnd={primaryAction.iconEnd ?? null}
            size="large"
            onClick={primaryAction.onClick}
            label={primaryAction.label}
          />
        )}
      </ButtonWrapper>
    </Wrapper>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  heroImg: PropTypes.string,
  heroImgSize: PropTypes.shape({
    width: PropTypes.string,
    height: PropTypes.string,
  }),
  height: PropTypes.string,
  emoji: PropTypes.string,
  primaryAction: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
    icon: PropTypes.node,
    iconEnd: PropTypes.bool,
  }),
  secondaryAction: PropTypes.shape({
    onClick: PropTypes.func,
    label: PropTypes.string,
  }),
};

export default EmptyState;
