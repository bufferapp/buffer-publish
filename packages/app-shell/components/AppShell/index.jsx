import React from 'react';
import PropTypes from 'prop-types';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import { AppShell as BDSAppShell } from '@bufferapp/ui';
import { Gear, Return, Plus, People } from '@bufferapp/ui/Icon';
import { gray } from '@bufferapp/ui/style/colors';
import { SEGMENT_NAMES } from '@bufferapp/publish-constants';

const InvertedReturnIcon = () => (
  <span style={{ transform: 'scaleX(-1)', height: '16px' }}>
    <Return color={gray} />
  </span>
);

const helpMenuItems = [
  {
    id: '1',
    title: 'Help Center',
    onItemClick: () => {
      window.location.assign('https://support.buffer.com/hc/en-us');
    },
  },
  {
    id: '2',
    title: 'Status',
    onItemClick: () => {
      window.location.assign('https://status.buffer.com/');
    },
  },
  {
    id: '3',
    title: 'Pricing & Plans',
    onItemClick: () => {
      window.location.assign(`https://${getURL.getBaseURL()}/pricing`);
    },
  },
  {
    id: '4',
    title: 'Wishlist',
    onItemClick: () => {
      window.location.assign('https://buffer.com/feature-request');
    },
  },
];

function generateUserMenuItems({
  showReturnToClassic,
  showSwitchPlan,
  showStartProTrial,
  returnToClassic,
  switchPlan,
  openPreferences,
  showManageTeam,
  hideMenuItems,
}) {
  if (hideMenuItems) {
    return [];
  }
  const userMenuItems = {
    top: [
      {
        id: 'preferences',
        title: 'Preferences',
        icon: <Gear color={gray} />,
        onItemClick: openPreferences,
      },
    ],
    manageTeam: {
      id: 'openTeam',
      title: 'Team',
      icon: <People color={gray} />,
      onItemClick: () => {
        window.location.assign(`${getURL.getManageTeamURL()}`);
      },
    },
    returnToClassic: {
      id: 'returnToClassic',
      title: 'Return to Classic',
      icon: <InvertedReturnIcon />,
      hasDivider: true,
      onItemClick: returnToClassic,
    },
    startProTrial: {
      id: 'startProTrial',
      title: 'Start Pro Trial',
      icon: <Plus color={gray} />,
      onItemClick: () => {
        window.location.assign(
          `${getURL.getStartTrialURL({
            trialType: 'pro',
            cta: SEGMENT_NAMES.APP_SHELL_PRO_TRIAL,
          })}`
        );
      },
    },
    switchPlan: {
      id: 'switchPlan',
      title: 'Upgrade to Pro',
      icon: <Plus color={gray} />,
      onItemClick: switchPlan,
    },
  };
  const extraItems = [];
  if (showManageTeam) {
    extraItems.push(userMenuItems.manageTeam);
  }
  if (showReturnToClassic) {
    extraItems.push(userMenuItems.returnToClassic);
  }
  if (showSwitchPlan) {
    extraItems.push(userMenuItems.switchPlan);
  }
  return [...userMenuItems.top, ...extraItems];
}

const AppShell = ({
  children,
  user,
  showReturnToClassic,
  showSwitchPlan,
  showManageTeam,
  showStartProTrial,
  returnToClassic,
  switchPlan,
  openPreferences,
  bannerOptions,
  onCloseBanner,
  bannerKey,
  hideAppShell,
  hideMenuItems,
  featureFlips
}) => {
  if (hideAppShell) {
    return children;
  }

  return (
    <BDSAppShell
      content={children}
      featureFlips={featureFlips}
      activeProduct="publish"
      user={{
        ...user,
        menuItems: generateUserMenuItems({
          showReturnToClassic,
          showSwitchPlan,
          showManageTeam,
          showStartProTrial,
          returnToClassic,
          switchPlan,
          openPreferences,
          hideMenuItems,
        }),
      }}
      helpMenuItems={helpMenuItems}
      bannerOptions={
        bannerOptions
          ? {
              ...bannerOptions,
              onCloseBanner: () => onCloseBanner({ key: bannerKey }),
            }
          : null
      }
    />
  );
};

AppShell.propTypes = {
  children: PropTypes.node.isRequired,
  showReturnToClassic: PropTypes.bool,
  showSwitchPlan: PropTypes.bool,
  showManageTeam: PropTypes.bool,
  showStartProTrial: PropTypes.bool,
  returnToClassic: PropTypes.func.isRequired,
  switchPlan: PropTypes.func.isRequired,
  openPreferences: PropTypes.func.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
  bannerKey: PropTypes.string,
  onCloseBanner: PropTypes.func,
  bannerOptions: PropTypes.shape({
    themeColor: PropTypes.string,
    customHTML: PropTypes.shape({
      __html: PropTypes.string,
    }),
  }),
  hideAppShell: PropTypes.bool.isRequired,
  featureFlips: PropTypes.arrayOf(PropTypes.string)
};

AppShell.defaultProps = {
  user: {
    name: '...',
    email: null,
    avatar: null,
  },
  showReturnToClassic: false,
  showSwitchPlan: false,
  showManageTeam: false,
  bannerOptions: null,
  showStartProTrial: false
};

export default AppShell;
