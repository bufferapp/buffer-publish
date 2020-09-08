import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Banner from '@bufferapp/ui/Banner';

const dashboardBanner = 'temporary-dashboard-banner';

const getContainerStyle = hidden => ({
  display: hidden ? 'none' : 'flex',
});

/* eslint-disable react/prop-types */
const TopBanner = ({
  status,
  content,
  onCloseBanner,
  themeColor = 'orange',
}) => (
  <div style={getContainerStyle(status)}>
    <Banner
      themeColor={themeColor}
      customHTML={{ __html: content }}
      onCloseBanner={onCloseBanner}
    />
  </div>
);

/* eslint-enable react/prop-types */

const TemporaryDashboardBanner = ({
  enabledApplicationModes,
  displayRemindersBanner,
  shouldDisplayIGRetirementBanner,
  usernamesRemindersList,
}) => {
  const [hidden, hideBanner] = useState(false);

  const onCloseBannerClick = () => {
    hideBanner(!hidden);
  };

  const getEnabledApplicationMode = tag =>
    enabledApplicationModes.filter(mode => mode.tag === tag)[0];

  if (
    !enabledApplicationModes &&
    !displayRemindersBanner &&
    !shouldDisplayIGRetirementBanner
  ) {
    return null;
  }

  // Displays Temporary Banner With Admin Message.
  if (enabledApplicationModes && getEnabledApplicationMode(dashboardBanner)) {
    const { content } = getEnabledApplicationMode(dashboardBanner);
    return TopBanner({
      status: hidden,
      content,
      onCloseBanner: onCloseBannerClick,
    });
  }
  // Displays temporary banner for Retiring IG personal profiles. Should remove in Oct.
  if (shouldDisplayIGRetirementBanner) {
    return TopBanner({
      status: hidden,
      content: `Beginning in October, we’ll no longer support personal Instagram
          accounts. Learn how to convert
          <a href="https://support.buffer.com/hc/en-us/articles/360052978413-Deprecating-Instagram-Personal-Profiles">to business here.</a>`,
      onCloseBanner: onCloseBannerClick,
    });
  }

  // Displays Temporary Banner With Reminders Message.
  let remindersBannerMessage = '';
  if (displayRemindersBanner && usernamesRemindersList) {
    remindersBannerMessage = `Check out your queue for Instagram accounts ${usernamesRemindersList} to set up Reminders and complete your post.`;
  }

  if (displayRemindersBanner && usernamesRemindersList) {
    return TopBanner({
      status: hidden,
      content: remindersBannerMessage,
      onCloseBanner: onCloseBannerClick,
    });
  }
  return null;
};

TemporaryDashboardBanner.propTypes = {
  enabledApplicationModes: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.string)
  ),
  displayRemindersBanner: PropTypes.bool,
  shouldDisplayIGRetirementBanner: PropTypes.bool,
  usernamesRemindersList: PropTypes.string,
};

TemporaryDashboardBanner.defaultProps = {
  enabledApplicationModes: [],
  shouldDisplayIGRetirementBanner: false,
};

export default TemporaryDashboardBanner;
