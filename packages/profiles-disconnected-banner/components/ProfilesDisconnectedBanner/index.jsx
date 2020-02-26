import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ErrorBanner } from '@bufferapp/publish-shared-components';
import { Text } from '@bufferapp/ui';

const TextWithStyles = styled(Text)`
  margin: 0;
`;

const ExtraMessageWithStyles = styled(Text)`
  margin: 0;
  font-weight: bold;
`;

const ProfilesDisconnectedBanner = ({
  profileId,
  service,
  translations,
  onReconnectProfileClick,
  extraMessage,
}) => (
  <ErrorBanner
    title={translations.headline}
    content={
      <React.Fragment>
        <TextWithStyles type="p">{translations.body}</TextWithStyles>
        {extraMessage && (
          <ExtraMessageWithStyles type="p">
            {extraMessage}
          </ExtraMessageWithStyles>
        )}
      </React.Fragment>
    }
    onClick={() => onReconnectProfileClick({ id: profileId, service })}
    actionLabel={translations.cta}
  />
);

ProfilesDisconnectedBanner.propTypes = {
  profileId: PropTypes.string.isRequired,
  service: PropTypes.string.isRequired,
  extraMessage: PropTypes.string,
  translations: PropTypes.shape({
    headline: PropTypes.string,
    body: PropTypes.string,
    cta: PropTypes.string,
  }).isRequired,
  onReconnectProfileClick: PropTypes.func.isRequired,
};

ProfilesDisconnectedBanner.defaultProps = {
  extraMessage: null,
};

export default ProfilesDisconnectedBanner;
