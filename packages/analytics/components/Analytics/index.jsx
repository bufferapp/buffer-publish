import React, { lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

import { BusinessTrialOrUpgradeCard } from '@bufferapp/publish-shared-components';
import { WithFeatureLoader } from '@bufferapp/product-features';
import { trackAction } from '@bufferapp/publish-data-tracking';
import LockedProfileNotification from '@bufferapp/publish-locked-profile-notification';
import getErrorBoundary from '@bufferapp/publish-web/components/ErrorBoundary';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import { SEGMENT_NAMES } from '@bufferapp/publish-constants';

import Notification from '../Notification';
import ProfileHeader from '../ProfileHeader';

/**
 * Lazy load the Analyze components and their deps - this helps
 * prevent us from loading a lot of unecessary code for non-biz
 * profiles / users.
 */
const LazyAnalyticsList = lazy(() =>
  import(/* webpackChunkName: "analyze" */ '../AnalyticsList')
);
const ErrorBoundary = getErrorBoundary(true);

const AnalyticsList = ({
  features,
  profile,
  isAnalyticsSupported,
  isLockedProfile,
  canStartBusinessTrial,
  isBusinessAccount,
  isInstagramBusiness,
  fetchProfiles,
  selectProfile,
}) => {
  // user is either a free or pro and is not a team member
  if (!isBusinessAccount && (features.isProUser() || features.isFreeUser())) {
    const startTrial = () =>
      window.location.assign(
        `${getURL.getStartTrialURL({
          trialType: 'small',
          cta: SEGMENT_NAMES.ANALYTICS_OVERVIEW_SBP_TRIAL,
          nextUrl: 'https://publish.buffer.com',
        })}`
      );
    const goToBilling = () =>
      window.location.assign(
        `${getURL.getBillingURL({
          cta: SEGMENT_NAMES.ANALYTICS_OVERVIEW_BUSINESS_UPGRADE,
        })}`
      );
    const trackAndGo = ({ location, action, afterTracked }) => {
      trackAction(
        {
          location,
          action,
        },
        {
          success: afterTracked,
          error: afterTracked,
        }
      );
    };
    if (canStartBusinessTrial) {
      return (
        <BusinessTrialOrUpgradeCard
          heading="Unlock Great Insights"
          body="Gain a deeper understanding of how you are performing on social media with advanced analytics."
          cta="Start a Free 14-Day Trial of the Business Plan"
          onCtaClick={() => {
            trackAndGo({
              location: 'analytics',
              action: 'unlock_insights_b4b_trial_start_click',
              afterTracked: startTrial,
            });
          }}
          backgroundImage="circles"
        />
      );
    }
    return (
      <BusinessTrialOrUpgradeCard
        heading="Unlock Great Insights"
        body="Gain a deeper understanding of how you are performing on social media with advanced analytics."
        cta="Upgrade to Buffer for Business"
        onCtaClick={() => {
          trackAndGo({
            location: 'analytics',
            action: 'unlock_insights_b4b_upgrade_click',
            afterTracked: goToBilling,
          });
        }}
        backgroundImage="circles"
      />
    );
  }

  if (isLockedProfile) {
    return <LockedProfileNotification />;
  }

  if (isAnalyticsSupported) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div>Loading...</div>}>
          <LazyAnalyticsList
            profile={profile}
            isInstagramBusiness={isInstagramBusiness}
            fetchProfiles={fetchProfiles}
            selectProfile={selectProfile}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <Notification
      isInstagramBusiness={isInstagramBusiness}
      service={profile.service}
    />
  );
};

AnalyticsList.propTypes = {
  features: PropTypes.object.isRequired, // eslint-disable-line
  canStartBusinessTrial: PropTypes.bool.isRequired,
  isAnalyticsSupported: PropTypes.bool,
  profile: PropTypes.shape(ProfileHeader.propTypes),
  isLockedProfile: PropTypes.bool,
  isBusinessAccount: PropTypes.bool.isRequired,
  isInstagramBusiness: PropTypes.bool.isRequired,
  fetchProfiles: PropTypes.func.isRequired,
  selectProfile: PropTypes.func.isRequired,
};

AnalyticsList.defaultProps = {
  isAnalyticsSupported: null,
  profile: null,
  isLockedProfile: false,
};

export default WithFeatureLoader(AnalyticsList);
