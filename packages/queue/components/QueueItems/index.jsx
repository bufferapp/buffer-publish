import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { WithFeatureLoader } from '@bufferapp/product-features';
import { Button, Text } from '@bufferapp/ui';
import { calculateStyles } from '@bufferapp/components/lib/utils';
import {
  transitionAnimationTime,
  transitionAnimationType,
} from '@bufferapp/components/style/animation';
import {
  Post,
  PostDragWrapper,
  QueueHeader,
  CalendarButtons,
} from '@bufferapp/publish-shared-components';

import PostEmptySlot from '@bufferapp/publish-shared-components/PostEmptySlot/dropTarget';
import getErrorBoundary from '@bufferapp/publish-web/components/ErrorBoundary';
import FailedPostComponent from '@bufferapp/publish-web/components/ErrorBoundary/failedPostComponent';

const ErrorBoundary = getErrorBoundary(true);

const HeaderWrapper = styled.div`
  margin-bottom: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
`;

const ShowMorePostsWrapper = styled.div`
  text-align: center;
  margin: 24px 0px;
`;

const ViewCalendarWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

/* eslint-disable react/prop-types */

const RenderPost = ({
  post,
  index,
  subprofiles,
  onRequeueClick,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onDropPost,
  onSwapPosts,
  draggable,
  hasFirstCommentFlip,
  hasPushNotifications,
  onSetRemindersClick,
  onCampaignTagClick,
  hasCampaignsFeature,
}) => {
  const campaignId = post.campaignDetails ? post.campaignDetails.id : null;
  const postWithEventHandlers = {
    ...post,
    service_geolocation_name: post.locationName,
    source_url: post.sourceUrl,
    subprofile_id: post.subprofileID,
    service_user_tags: post.userTags,
    key: post.id,
    index,
    postDetails: post.postDetails,
    subprofiles,
    onDeleteConfirmClick: () => onDeleteConfirmClick({ post }),
    onEditClick: () => onEditClick({ post }),
    onShareNowClick: () => onShareNowClick({ post }),
    onRequeueClick: () => onRequeueClick({ post }),
    onCampaignTagClick: () => onCampaignTagClick(campaignId),
    onDropPost,
    onSwapPosts,
    hasFirstCommentFlip,
    hasPushNotifications,
    onSetRemindersClick,
    hasCampaignsFeature,
    shouldShowEditButton: post.retweet && !!post.retweetComment,
  };

  const PostComponent = Post;

  const defaultStyle = {
    default: {
      margin: '8px 0 8px',
      transition: `all ${transitionAnimationTime} ${transitionAnimationType}`,
    },
    hidden: {
      opacity: '0.5',
      pointerEvents: 'none',
    },
  };

  const hiddenStyle = {
    hidden: post.isDeleting,
  };

  if (draggable) {
    return (
      <div style={calculateStyles(defaultStyle, hiddenStyle)} key={post.id}>
        <ErrorBoundary
          fallbackComponent={() => (
            <ErrorBoundary
              fallbackComponent={() => (
                <FailedPostComponent
                  key={post.id}
                  post={post}
                  postId={post.id}
                />
              )}
            >
              <PostDragWrapper
                id={post.id}
                index={index}
                postComponent={PostComponent}
                postProps={postWithEventHandlers}
                basic
              />
            </ErrorBoundary>
          )}
        >
          <PostDragWrapper
            id={post.id}
            index={index}
            postComponent={PostComponent}
            postProps={postWithEventHandlers}
          />
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div style={calculateStyles(defaultStyle, hiddenStyle)} key={post.id}>
      <ErrorBoundary
        fallbackComponent={() => (
          <ErrorBoundary
            fallbackComponent={() => (
              <FailedPostComponent key={post.id} post={post} postId={post.id} />
            )}
          >
            <PostComponent {...postWithEventHandlers} basic />
          </ErrorBoundary>
        )}
      >
        <PostComponent {...postWithEventHandlers} />
      </ErrorBoundary>
    </div>
  );
};

const Header = ({
  item,
  index,
  features,
  isBusinessAccount,
  onCalendarClick,
}) => {
  const { text, dayOfWeek, date, id } = item;
  const isFirstItem = index === 0;
  const shouldRenderCalendarButtons =
    isFirstItem && (!features.isFreeUser() || isBusinessAccount);

  return (
    <HeaderWrapper key={id}>
      <QueueHeader id={id} text={text} dayOfWeek={dayOfWeek} date={date} />
      {shouldRenderCalendarButtons && (
        <CalendarButtons onCalendarClick={onCalendarClick} />
      )}
    </HeaderWrapper>
  );
};

const Slot = ({ item, onEmptySlotClick }) => {
  const { id, slot, profileService } = item;

  return (
    <PostEmptySlot
      key={id}
      time={slot.label}
      timestamp={slot.timestamp}
      day={slot.dayText}
      service={profileService}
      onClick={() =>
        onEmptySlotClick({
          dueTime: slot.label,
          profile_service: profileService,
          scheduled_at: slot.timestamp,
          due_at: slot.timestamp,
          pinned: true,
        })
      }
    />
  );
};

/* eslint-enable react/prop-types */

const QueueItems = props => {
  const {
    items,
    onEmptySlotClick,
    onCalendarClick,
    features,
    isBusinessAccount,
    ...propsForPosts
  } = props;
  const itemList = items.map((item, index) => {
    const { queueItemType, ...rest } = item;
    if (queueItemType === 'post') {
      return <RenderPost post={rest} index={index} {...propsForPosts} />;
    }
    if (queueItemType === 'header') {
      return (
        <Header
          item={rest}
          index={index}
          features={features}
          isBusinessAccount={isBusinessAccount}
          onCalendarClick={onCalendarClick}
        />
      );
    }
    if (queueItemType === 'slot') {
      return <Slot item={rest} onEmptySlotClick={onEmptySlotClick} />;
    }
    if (
      queueItemType === 'showMorePosts' &&
      (!features.isFreeUser() || isBusinessAccount)
    ) {
      return (
        <ShowMorePostsWrapper key={rest.id}>
          <Text type="p">Looking for your other posts?</Text>
          <ViewCalendarWrapper>
            <Button
              type="primary"
              label="View Your Calendar"
              onClick={() => onCalendarClick('month')}
            />
          </ViewCalendarWrapper>
        </ShowMorePostsWrapper>
      );
    }
    return null;
  });

  return <>{itemList}</>;
};

QueueItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      queueItemType: PropTypes.string.isRequired,
    })
  ),
  subprofiles: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
    })
  ),
  features: PropTypes.shape({
    isFreeUser: PropTypes.func,
  }).isRequired,
  onCalendarClick: PropTypes.func,
  onDeleteConfirmClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onEmptySlotClick: PropTypes.func,
  onShareNowClick: PropTypes.func,
  onRequeueClick: PropTypes.func,
  onDropPost: PropTypes.func,
  onSwapPosts: PropTypes.func,
  isBusinessAccount: PropTypes.bool,
  draggable: PropTypes.bool,
};

QueueItems.defaultProps = {
  items: [],
  subprofiles: [],
  draggable: false,
  isBusinessAccount: false,
  onCalendarClick: () => {},
  onDeleteConfirmClick: () => {},
  onEditClick: () => {},
  onEmptySlotClick: () => {},
  onShareNowClick: () => {},
  onRequeueClick: () => {},
  onDropPost: () => {},
  onSwapPosts: () => {},
};

export default WithFeatureLoader(QueueItems);
