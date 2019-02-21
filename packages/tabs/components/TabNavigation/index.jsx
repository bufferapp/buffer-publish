import React from 'react';
import PropTypes from 'prop-types';
import {
  Tabs,
  Tab,
} from '@bufferapp/publish-shared-components';
import { Button, Text } from '@bufferapp/components';
import FeatureLoader, { WithFeatureLoader } from '@bufferapp/product-features';
import { openCalendarWindow } from '../../utils';

const upgradeCtaStyle = {
  transform: 'translate(0, 1px)',
  margin: '12px 16px',
  display: 'inline-block',
  textAlign: 'center',
  position: 'absolute',
  top: 0,
  right: 0,
};

const TabNavigation = ({
  features,
  isBusinessAccount,
  isManager,
  selectedTabId,
  selectedChildTabId,
  onTabClick,
  onChildTabClick,
  shouldShowUpgradeCta,
  shouldShowNestedSettingsTab,
  onUpgradeButtonClick,
  profileId,
  isLockedProfile,
  isInstagramProfile,
  hasPastRemindersFeatureFlip,
}) => {
  const selectedChildTab = selectedChildTabId || 'general-settings';
  return (
    /* wrapper div with "tabs" id necessary as a selector
    for a11y focus after selecting profile in sidebar */
    <div id="tabs" style={{ paddingLeft: '0.5rem' }}>
      <Tabs
        selectedTabId={selectedTabId}
        onTabClick={onTabClick}
      >
        <Tab tabId={'queue'}>Queue</Tab>
        <Tab tabId={'sent'}>Sent Posts</Tab>
        {isInstagramProfile && hasPastRemindersFeatureFlip &&
          <Tab tabId={'pastReminders'}>Past Reminders</Tab>
        }
        {!features.isFreeUser() && <Tab tabId={'analytics'}>Analytics</Tab>}
        {isBusinessAccount && isManager &&
          <Tab tabId={'awaitingApproval'}>Awaiting Approval</Tab>
        }
        {isBusinessAccount && !isManager &&
          <Tab tabId={'pendingApproval'}>Pending Approval</Tab>
        }
        {!features.isFreeUser() &&
          <Tab tabId={'drafts'}>Drafts</Tab>
        }
        <Tab tabId={'settings'}>Settings</Tab>
        <FeatureLoader supportedFeatures={'b4b_calendar'}>
          <Tab tabId={'b4bCalendar'} onClick={() => openCalendarWindow(profileId)}>
            Calendar
          </Tab>
        </FeatureLoader>
      </Tabs>
      {shouldShowUpgradeCta &&
        <div style={upgradeCtaStyle}>
          <div style={{ paddingRight: '10px', display: 'inline-block' }}>
            <Text size="mini">
              Want to see more from Buffer?
          </Text>
          </div>
          <Button
            secondary
            onClick={(e) => {
              e.preventDefault();
              onUpgradeButtonClick('pro');
            }}
          >
            Upgrade to Pro
            </Button>
        </div>
      }
      <FeatureLoader supportedPlans={'pro'}>
        <div style={upgradeCtaStyle}>
          <Button
            secondary
            onClick={(e) => {
              e.preventDefault();
              onUpgradeButtonClick('b4b');
            }}
          >
            Learn about Buffer for Business
            </Button>
        </div>
      </FeatureLoader>
      {shouldShowNestedSettingsTab && !isLockedProfile &&
        <Tabs
          selectedTabId={selectedChildTab}
          onTabClick={onChildTabClick}
          secondary
        >
          <Tab tabId={'general-settings'}>General</Tab>
          <Tab tabId={'posting-schedule'}>Posting Schedule</Tab>
        </Tabs>
      }
    </div>
  );
};

TabNavigation.defaultProps = {
  shouldShowUpgradeCta: false,
  shouldShowNestedSettingsTab: false,
  selectedChildTabId: null,
  profileId: null,
  isLockedProfile: false,
  isInstagramProfile: false,
  hasPastRemindersFeatureFlip: false,
  isBusinessAccount: false,
};

TabNavigation.propTypes = {
  features: PropTypes.any.isRequired, // eslint-disable-line
  isBusinessAccount: PropTypes.bool,
  isManager: PropTypes.bool.isRequired,
  selectedTabId: PropTypes.string.isRequired,
  onTabClick: PropTypes.func.isRequired,
  shouldShowUpgradeCta: PropTypes.bool.isRequired,
  onUpgradeButtonClick: PropTypes.func.isRequired,
  onChildTabClick: PropTypes.func.isRequired,
  selectedChildTabId: PropTypes.string,
  shouldShowNestedSettingsTab: PropTypes.bool,
  profileId: PropTypes.string,
  isLockedProfile: PropTypes.bool,
  isInstagramProfile: PropTypes.bool,
  hasPastRemindersFeatureFlip: PropTypes.bool,
};

export default WithFeatureLoader(TabNavigation);
