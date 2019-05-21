import React from 'react';
import PropTypes from 'prop-types';
import { getURL } from '@bufferapp/publish-server/formatters/src';

import { AppShell as BDSAppShell } from '@bufferapp/ui';
import { Gear, Return, Plus } from '@bufferapp/ui/Icon';
import { gray } from '@bufferapp/ui/style/colors';

const InvertedReturnIcon = () => (
  <span style={{ transform: 'scaleX(-1)', height: '16px' }}>
    <Return color={gray} />
  </span>
);

const helpMenuItems = [
  {
    id: '1',
    title: 'Support',
    onItemClick: () => {
      window.location.assign(`https://${getURL.getBaseURL()}/support`);
    },
  },
  {
    id: '1',
    title: 'FAQ',
    onItemClick: () => {
      window.location.assign('https://faq.buffer.com/');
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
      window.location.assign('https://buffersurvey.typeform.com/to/ZEiVmL');
    },
  },
];

function generateUserMenuItems({
  showReturnToClassic,
  showUpgradeToPro,
  returnToClassic,
  upgradeToPro,
  openPreferences,
}) {
  const userMenuItems = {
    top: [
      {
        id: 'preferences',
        title: 'Preferences',
        icon: <Gear color={gray} />,
        onItemClick: openPreferences,
      },
    ],
    returnToClassic: {
      id: 'returnToClassic',
      title: 'Return to Classic',
      icon: <InvertedReturnIcon />,
      hasDivider: true,
      onItemClick: returnToClassic,
    },
    upgradeToPro: {
      id: 'upgradeToPro',
      title: 'Upgrade to Pro',
      icon: <Plus color={gray} />,
      onItemClick: upgradeToPro,
    },
  };
  const extraItems = [];
  if (showReturnToClassic) {
    extraItems.push(userMenuItems.returnToClassic);
  }
  if (showUpgradeToPro) {
    extraItems.push(userMenuItems.upgradeToPro);
  }
  return [...userMenuItems.top, ...extraItems];
}

const AppShell = ({
  children,
  user,
  showReturnToClassic,
  showUpgradeToPro,
  returnToClassic,
  upgradeToPro,
  openPreferences,
}) => (
  <BDSAppShell
    content={children}
    activeProduct="publish"
    user={{
      ...user,
      menuItems: generateUserMenuItems({
        showReturnToClassic,
        showUpgradeToPro,
        returnToClassic,
        upgradeToPro,
        openPreferences,
      }),
    }}
    helpMenuItems={helpMenuItems}
  />
);

AppShell.propTypes = {
  children: PropTypes.node.isRequired,
  showReturnToClassic: PropTypes.bool,
  showUpgradeToPro: PropTypes.bool,
  returnToClassic: PropTypes.func.isRequired,
  upgradeToPro: PropTypes.func.isRequired,
  openPreferences: PropTypes.func.isRequired,

  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
};

AppShell.defaultProps = {
  user: {
    name: null,
    email: null,
    avatar: null,
  },
  showReturnToClassic: false,
  showUpgradeToPro: false,
};

export default AppShell;
