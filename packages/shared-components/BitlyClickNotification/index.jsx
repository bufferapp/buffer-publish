import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Notification from '../Notification/index';

const SpacedNotification = styled.div`
  margin-bottom: 0.75rem;
`;

const BitlyNotification = ({ marginAfter }) => {
  const notificationMessage = (
    <Notification
      type="info"
      title="Issue Reporting Clicks"
      body="We’re aware of an issue regarding reported clicks from shortened links and are actively working to resolve the situation. Our sincere apologies for this inconvenience!"
    />
  );
  return marginAfter ? (
    <SpacedNotification>{notificationMessage}</SpacedNotification>
  ) : (
    notificationMessage
  );
};

BitlyNotification.propTypes = {
  marginAfter: PropTypes.bool.isRequired,
};

const BitlyClickNotification = ({
  isFreeUser,
  isBitlyConnected,
  hasBitlyPosts,
  marginAfter = false,
}) => {
  return hasBitlyPosts && !isFreeUser() && !isBitlyConnected ? (
    <BitlyNotification marginAfter={marginAfter}/>
  ) : null;
};

BitlyClickNotification.propTypes = {
  isFreeUser: PropTypes.func.isRequired,
  isBitlyConnected: PropTypes.bool.isRequired,
  hasBitlyPosts: PropTypes.bool.isRequired,
  marginAfter: PropTypes.bool,
};

BitlyClickNotification.defaultProps = {
  marginAfter: false,
};

export default BitlyClickNotification;
