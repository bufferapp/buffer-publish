import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@bufferapp/publish-shared-components';
import { Button } from '@bufferapp/ui';
import { WithFeatureLoader } from '@bufferapp/product-features';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import styled from 'styled-components';
import { getValidTab } from '../../utils';
import TabTag from '../TabTag';

const UpgradeCtaStyle = styled.div`
  transform: translate(0, 1px);
  margin: 12px 0;
  display: inline-block;
  text-align: center;
  position: absolute;
  top: 0;
  right: 0;
`;

const ButtonWrapper = styled.div`
  margin-left: 8px;
  display: inline-block;
`;

const tabsStyle = {
  paddingLeft: '0.5rem',
  position: 'relative',
  top: '0',
  backgroundColor: 'white',
  zIndex: 1,
};

const TabCounterTag = ({ labelName }) =>
  labelName != null && <TabTag type="counter" labelName={labelName} />;

class TabNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };

    this.isValidTab = this.isValidTab.bind(this);
  }

  isValidTab(tabId) {
    const {
      features,
      isBusinessAccount,
      isManager,
      isInstagramProfile,
      hasStoriesFlip,
    } = this.props;

    return (
      tabId ===
      getValidTab(
        tabId,
        isBusinessAccount,
        isInstagramProfile,
        isManager,
        features.isFreeUser(),
        hasStoriesFlip
      )
    );
  }

  render() {
    const { loading } = this.state;
    const {
      selectedTabId,
      selectedChildTabId,
      onTabClick,
      onChildTabClick,
      shouldShowUpgradeButton,
      shouldShowNestedSettingsTab,
      shouldShowNestedAnalyticsTab,
      shouldHideAdvancedAnalytics,
      onUpgradeButtonClick,
      isLockedProfile,
      isDisconnectedProfile,
      draftsNeedApprovalCount,
      draftsCount,
    } = this.props;

    return (
      /* wrapper div with "tabs" id necessary as a selector
      for a11y focus after selecting profile in sidebar */
      <nav id="tabs" role="navigation" style={tabsStyle}>
        <Tabs selectedTabId={selectedTabId} onTabClick={onTabClick}>
          <Tab tabId="queue">Queue</Tab>
          {/* IG, Business users or Team Members */}
          {this.isValidTab('stories') && (
            <Tab tabId="stories">
              Stories
            </Tab>
          )}
          {this.isValidTab('pastReminders') && (
            <Tab tabId="pastReminders">Past Reminders</Tab>
          )}
          <Tab tabId="analytics">Analytics</Tab>
          {/* Team Members who are Managers */}
          {this.isValidTab('awaitingApproval') && (
            <Tab tabId="awaitingApproval">
              Awaiting Approval
              <TabCounterTag labelName={draftsNeedApprovalCount} />
            </Tab>
          )}
          {/* Team Members who are Contributors */}
          {this.isValidTab('pendingApproval') && (
            <Tab tabId="pendingApproval">
              Pending Approval
              <TabCounterTag labelName={draftsNeedApprovalCount} />
            </Tab>
          )}
          {/* Pro and up users or Team Members */}
          {this.isValidTab('drafts') && (
            <Tab tabId="drafts">
              Drafts
              <TabCounterTag labelName={draftsCount} />
            </Tab>
          )}
          {/* IG, Business users or Team Members */}
          {this.isValidTab('grid') && <Tab tabId="grid">Shop Grid</Tab>}
          <Tab tabId="settings">Settings</Tab>
        </Tabs>
        {shouldShowUpgradeButton && (
          <UpgradeCtaStyle>
            <ButtonWrapper>
              <Button
                label="Upgrade"
                type="secondary"
                size="small"
                onClick={e => {
                  e.preventDefault();
                  onUpgradeButtonClick();
                }}
              />
            </ButtonWrapper>
          </UpgradeCtaStyle>
        )}
        {shouldShowNestedAnalyticsTab && !isLockedProfile && (
          <Tabs
            selectedTabId={selectedChildTabId || 'posts'}
            onTabClick={onChildTabClick}
            secondary
          >
            <Tab tabId="posts">Posts</Tab>
            {!shouldHideAdvancedAnalytics && (
              <Tab tabId="overview">Overview</Tab>
            )}
          </Tabs>
        )}
        {shouldShowNestedSettingsTab && !isLockedProfile && (
          <Tabs
            selectedTabId={selectedChildTabId || 'general-settings'}
            onTabClick={onChildTabClick}
            secondary
          >
            <Tab tabId="general-settings">General</Tab>
            <Tab tabId="posting-schedule">Posting Schedule</Tab>
            {/* Hidding reconnect  button when profile is disconnected, as we have a banner in settings content for that */}
            {!isDisconnectedProfile && (
              <div style={{ display: 'inline-block' }}>
                <Button
                  type="secondary"
                  size="small"
                  label={loading ? 'Reconnecting…' : 'Reconnect'}
                  onClick={e => {
                    e.preventDefault();
                    this.setState({ loading: true });
                    window.location.assign(`${getURL.getManageURL()}`);
                  }}
                />
              </div>
            )}
          </Tabs>
        )}
      </nav>
    );
  }
}

TabNavigation.defaultProps = {
  shouldShowNestedSettingsTab: false,
  shouldShowNestedAnalyticsTab: false,
  shouldHideAdvancedAnalytics: true,
  shouldShowUpgradeButton: false,
  selectedChildTabId: null,
  isLockedProfile: false,
  isDisconnectedProfile: false,
  isInstagramProfile: false,
  isBusinessAccount: false,
  isManager: false,
  hasStoriesFlip: false,
  draftsNeedApprovalCount: null,
  draftsCount: null,
};

TabNavigation.propTypes = {
  features: PropTypes.any.isRequired, // eslint-disable-line
  isBusinessAccount: PropTypes.bool,
  isManager: PropTypes.bool,
  selectedTabId: PropTypes.string.isRequired,
  onTabClick: PropTypes.func.isRequired,
  onUpgradeButtonClick: PropTypes.func.isRequired,
  onChildTabClick: PropTypes.func.isRequired,
  selectedChildTabId: PropTypes.string,
  shouldShowNestedSettingsTab: PropTypes.bool,
  shouldShowNestedAnalyticsTab: PropTypes.bool,
  shouldHideAdvancedAnalytics: PropTypes.bool,
  isLockedProfile: PropTypes.bool,
  isDisconnectedProfile: PropTypes.bool,
  isInstagramProfile: PropTypes.bool,
  shouldShowUpgradeButton: PropTypes.bool,
  hasStoriesFlip: PropTypes.bool,
  draftsNeedApprovalCount: PropTypes.number,
  draftsCount: PropTypes.number,
};

export default WithFeatureLoader(TabNavigation);
