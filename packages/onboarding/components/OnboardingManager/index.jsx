import React from 'react';
import PropTypes from 'prop-types';
import DisabledQueue from '@bufferapp/publish-disabled-queue';
import OnboardingPage from '../OnboardingPage';

const OnboardingManager = ({
  canSeeOnboardingPage,
  onConnectSocialAccountClick,
  onSkipStep,
  translations,
}) => (
  <div>
    {canSeeOnboardingPage
      && (
        <OnboardingPage
          onConnectSocialAccountClick={onConnectSocialAccountClick}
          onSkipStep={onSkipStep}
          translations={translations}
        />
      )
    }
    {!canSeeOnboardingPage
      && (
        <DisabledQueue />
      )
    }
  </div>
);

OnboardingManager.propTypes = {
  onConnectSocialAccountClick: PropTypes.func.isRequired,
  onSkipStep: PropTypes.func.isRequired,
  canSeeOnboardingPage: PropTypes.bool.isRequired,
  translations: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    cta1: PropTypes.string,
    ctaChannel1: PropTypes.string,
    cta2: PropTypes.string,
    ctaChannel2: PropTypes.string,
    cta3: PropTypes.string,
    skipStep: PropTypes.string,
    testemonial: PropTypes.string,
    name: PropTypes.string,
    role: PropTypes.string,
    company: PropTypes.string,
  }).isRequired,
};

export default OnboardingManager;