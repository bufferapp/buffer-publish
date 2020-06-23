/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WithFeatureLoader } from '@bufferapp/product-features';

import Post from '../Post';
import Story from '../Story';
import QueueHeader from '../QueueHeader';
import PostActionButtons from '../PostActionButtons';
import BannerAdvancedAnalytics from '../BannerAdvancedAnalytics';

const PostStyle = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${props =>
    props.shouldShowAnalyzeBanner ? '2rem' : '2.5rem'};
`;

const postClassName = item => {
  if (!item) return '';

  return [
    'update',
    `post_${item.profile_service}`,
    item.postDetails?.isRetweet ? 'is_retweet' : 'not_retweet',
  ].join(' ');
};

const isPaidUser = ({ features, isBusinessAccount }) =>
  !features.isFreeUser() || isBusinessAccount;

const PostContent = ({
  item,
  index,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onCampaignTagClick,
  isBusinessAccount,
  isSent,
  isPastReminder,
  features,
  isManager,
  isAnalyzeCustomer,
  onMobileClick,
  onShareAgainClick,
  showAnalyzeBannerAfterFirstPost,
  showSendToMobile,
  showShareAgainButton,
  ...postProps
}) => {
  const campaignId = item.campaignDetails?.id ?? null;
  const postWithEventHandlers = {
    ...item,
    ...postProps,
    service_geolocation_name: item.locationName,
    source_url: item.sourceUrl,
    subprofile_id: item.subprofileID,
    service_user_tags: item.userTags,
    key: item.id,
    index,
    onDeleteConfirmClick: () => onDeleteConfirmClick({ item }),
    onEditClick: () => onEditClick({ item }),
    onShareNowClick: () => onShareNowClick({ item }),
    onCampaignTagClick: () => onCampaignTagClick(campaignId),
    isBusinessAccount,
    isSent,
    isPastReminder,
  };

  const shouldShowAnalyzeBanner =
    showAnalyzeBannerAfterFirstPost && index === 1;
  const isPastPost = isSent || isPastReminder;
  const isUserPaid = isPaidUser({ features, isBusinessAccount });
  const shouldShowShareAgain = showShareAgainButton && isPastPost && isUserPaid;
  const shouldShowSendToMobile =
    showSendToMobile && isPastReminder && isManager;

  const PostComponent = item.type === 'storyGroup' ? Story : Post;

  return (
    <>
      <PostStyle
        key={item.id}
        id={`update-${item.id}`}
        className={postClassName(item)}
        shouldShowAnalyzeBanner
      >
        <PostComponent {...postWithEventHandlers} />
        <PostActionButtons
          shouldShowShareAgainButton={shouldShowShareAgain}
          shouldShowSendToMobileButton={shouldShowSendToMobile}
          onShareAgainClick={() => {
            onShareAgainClick({ post: item });
          }}
          onMobileClick={() => {
            onMobileClick({ post: item });
          }}
        />
      </PostStyle>
      {shouldShowAnalyzeBanner && (
        <BannerAdvancedAnalytics isAnalyzeCustomer={isAnalyzeCustomer} />
      )}
    </>
  );
};

/* eslint-enable react/prop-types */

const PostLists = ({ items, ...propsForPosts }) => {
  const itemList = items.map((item, index) => {
    const { queueItemType, ...rest } = item;

    if (queueItemType === 'header') {
      return (
        <QueueHeader
          text={item.text}
          id={item.id}
          dayOfWeek={item.dayOfWeek}
          date={item.date}
        />
      );
    }
    if (queueItemType === 'post') {
      return <PostContent index={index} item={rest} {...propsForPosts} />;
    }

    return null;
  });

  return <>{itemList}</>;
};

PostLists.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      date: PropTypes.string,
      queueItemType: PropTypes.string,
      dayOfWeek: PropTypes.string,
      hasCommentEnabled: PropTypes.bool,
    })
  ).isRequired,
  features: PropTypes.shape({
    isFreeUser: () => {},
  }).isRequired,
};

export default WithFeatureLoader(PostLists);
