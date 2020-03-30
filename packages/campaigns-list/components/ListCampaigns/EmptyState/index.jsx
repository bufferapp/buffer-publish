import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text, Button, Link } from '@bufferapp/ui';
import { StepList } from '@bufferapp/publish-shared-components';

const EmptyStateContainer = styled.div`
  display: flex;
  margin-left: 48px;
`;

const Content = styled.div`
  margin-top: 43px;
`;

const Image = styled.img`
  object-fit: contain;
  width: 100%;
`;

const LinkWithStyles = styled(Link)`
  display: inline-block;
  padding: 16px;
`;

const EmptyState = ({ translations, onOpenCreateCampaignClick }) => {
  const {
    step1,
    step2,
    step3,
    createCampaign,
    title,
    subtext,
    learnMore,
    imageTag,
  } = translations;
  const stepsArray = [step1, step2, step3];

  return (
    <EmptyStateContainer>
      <Content>
        <Text type="h1">{title}</Text>
        <Text type="p">{subtext}</Text>
        <StepList steps={stepsArray} />
        <div style={{ alignSelf: 'flex-end', paddingTop: '30px' }}>
          <Button
            type="primary"
            size="large"
            label={createCampaign}
            onClick={onOpenCreateCampaignClick}
          />
          <LinkWithStyles
            href="https://faq.buffer.com/" // Update FAQ link when it's ready
            newTab
          >
            {learnMore}
          </LinkWithStyles>
        </div>
      </Content>
      <Image
        src="https://buffer-publish.s3.amazonaws.com/images/campaigns-screenshot.jpg"
        alt={imageTag}
      />
    </EmptyStateContainer>
  );
};

EmptyState.propTypes = {
  translations: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtext: PropTypes.string.isRequired,
    step1: PropTypes.string.isRequired,
    step2: PropTypes.string.isRequired,
    step3: PropTypes.string.isRequired,
    createCampaign: PropTypes.string.isRequired,
    learnMore: PropTypes.string.isRequired,
    imageTag: PropTypes.string.isRequired,
  }).isRequired,
  onOpenCreateCampaignClick: PropTypes.func.isRequired,
};

export default EmptyState;
