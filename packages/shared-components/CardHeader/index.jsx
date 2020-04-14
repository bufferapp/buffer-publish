import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Image } from '@bufferapp/components';
import { grayLight } from '@bufferapp/ui/style/colors';
import { Text, Button, Avatar } from '@bufferapp/ui';

const CardHeaderWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid ${grayLight};
  padding: 12px 16px;
`;

const CardHeaderWrapperWithButton = styled(CardHeaderWrapper)`
  padding: 8px 16px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;
`;

const ChannelWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const ChannelHandle = styled(Text)`
  margin-left: 16px;
`;

const CreatorWrapper = styled.span`
  display: flex;
  align-items: center;
`;

const AvatarWrapper = styled.span`
  margin-right: 9px;
`;

const TextWithStyles = styled(Text)`
  font-size: 12px;
  line-height: 20px;
  margin: 0;
`;

const getCreatedText = creatorName =>
  creatorName ? `${creatorName} created this ` : 'Created ';

const CardHeader = ({ headerDetails }) => {
  const {
    channel,
    creatorName,
    avatarUrl,
    createdAt,
    hideCreatorDetails,
    onPreviewClick,
  } = headerDetails;
  const WrapperComponent = onPreviewClick
    ? CardHeaderWrapperWithButton
    : CardHeaderWrapper;

  const hasChannelDetails = channel?.handle && channel?.type;

  return (
    <WrapperComponent>
      <ContentWrapper>
        {hasChannelDetails && (
          <ChannelWrapper>
            <Avatar
              src={channel.avatarUrl}
              fallbackUrl="https://s3.amazonaws.com/buffer-ui/Default+Avatar.png"
              alt={channel.handle}
              size="small"
              type="social"
              network={channel.type}
            />
            <ChannelHandle type="label" color="grayDark">
              {channel.handle}
            </ChannelHandle>
          </ChannelWrapper>
        )}
        <CreatorWrapper>
          {creatorName && !hasChannelDetails && (
            <AvatarWrapper>
              <Image
                src={avatarUrl}
                border="circle"
                height="1.25rem"
                width="1.25rem"
              />
            </AvatarWrapper>
          )}
          {!hideCreatorDetails && (
            <TextWithStyles type="p" color="grayDark">
              {getCreatedText(creatorName)}
              {createdAt}
            </TextWithStyles>
          )}
        </CreatorWrapper>
      </ContentWrapper>
      {onPreviewClick && (
        <Button
          type="secondary"
          label="Preview"
          size="small"
          onClick={onPreviewClick}
        />
      )}
    </WrapperComponent>
  );
};

CardHeader.propTypes = {
  headerDetails: PropTypes.shape({
    creatorName: PropTypes.string,
    avatarUrl: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    hideCreatorDetails: PropTypes.bool,
    onPreviewClick: PropTypes.func,
    channel: PropTypes.shape({
      avatarUrl: PropTypes.string,
      handle: PropTypes.string,
      type: PropTypes.string,
    }),
  }).isRequired,
};

export default CardHeader;
