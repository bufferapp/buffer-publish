import React from 'react';
import PropTypes from 'prop-types';
import { calculateStyles } from '@bufferapp/components/lib/utils';
import {
  transitionAnimationTime,
  transitionAnimationType,
} from '@bufferapp/components/style/animation';
import getErrorBoundary from '@bufferapp/publish-web/components/ErrorBoundary';
import { PostEmptySlot } from '@bufferapp/publish-shared-components';

import Story from '../Story';
import Post from '../Post';
import PostDragWrapper from '../PostDragWrapper';
import Draft from '../Draft';
import QueueHeader from '../QueueHeader';

const ErrorBoundary = getErrorBoundary(true);

const postTypeComponentMap = new Map([
  ['text', Post],
  ['image', Post],
  ['multipleImage', Post],
  ['link', Post],
  ['video', Post],
  ['storyGroup', Story],
]);

const draftTypeComponentMap = new Map([
  ['text', Draft],
  ['image', Draft],
  ['multipleImage', Draft],
  ['link', Draft],
  ['video', Draft],
  ['storyGroup', Story],
]);

/* eslint-disable react/prop-types */

const renderPost = ({
  post,
  index,
  isStory,
  onRequeueClick,
  onDeleteConfirmClick,
  onSetRemindersClick,
  onEditClick,
  onShareNowClick,
  onDropPost,
  onSwapPosts,
  draggable,
  basic,
  hasFirstCommentFlip,
  onPreviewClick,
  serviceId,
  userData,
}) => {
  const postWithEventHandlers = {
    ...post,
    service_geolocation_name: post.locationName,
    source_url: post.sourceUrl,
    subprofile_id: post.subprofileID,
    service_user_tags: post.userTags,
    key: post.id,
    index,
    postDetails: post.postDetails,
    onDeleteConfirmClick: () => onDeleteConfirmClick({ post }),
    onSetRemindersClick: ({ type }) => onSetRemindersClick({ type, post }),
    onEditClick: () => onEditClick({ post }),
    onShareNowClick: () => onShareNowClick({ post }),
    onRequeueClick: () => onRequeueClick({ post }),
    onPreviewClick,
    onDropPost,
    onSwapPosts,
    hasFirstCommentFlip,
    serviceId,
    userData,
  };
  let PostComponent = postTypeComponentMap.get(post.type);
  PostComponent = PostComponent || Post;

  const defaultStyle = {
    default: {
      marginBottom: isStory ? '8px' : '2rem',
      maxHeight: '100vh',
      transition: `all ${transitionAnimationTime} ${transitionAnimationType}`,
    },
    hidden: {
      maxHeight: 0,
      opacity: 0,
    },
  };

  const hiddenStyle = {
    hidden: post.isDeleting,
  };

  if (draggable) {
    return (
      <div style={calculateStyles(defaultStyle, hiddenStyle)} key={post.id}>
        <PostDragWrapper
          id={post.id}
          index={index}
          postComponent={PostComponent}
          postProps={postWithEventHandlers}
          basic={basic}
        />
      </div>
    );
  }

  return (
    <div style={calculateStyles(defaultStyle, hiddenStyle)} key={post.id}>
      <PostComponent {...postWithEventHandlers} basic={basic} />
    </div>
  );
};

const renderDraft = ({
  draft,
  onApproveClick,
  onDeleteConfirmClick,
  onEditClick,
  onMoveToDraftsClick,
  onRequestApprovalClick,
  onRescheduleClick,
  hasFirstCommentFlip,
}) => {
  const draftWithEventHandlers = {
    ...draft,
    profileService: draft.profile_service,
    geolocationName: draft.service_geolocation_name,
    key: draft.id,
    draftDetails: draft.draftDetails,
    onDeleteConfirmClick: () => onDeleteConfirmClick({ draft }),
    onEditClick: () => onEditClick({ draft }),
    onApproveClick: () => onApproveClick({ draft }),
    onMoveToDraftsClick: () => onMoveToDraftsClick({ draft }),
    onRequestApprovalClick: () => onRequestApprovalClick({ draft }),
    onRescheduleClick: () => onRescheduleClick({ draft }),
    hasFirstCommentFlip,
  };
  let DraftComponent = draftTypeComponentMap.get(draft.type);
  DraftComponent = DraftComponent || Draft;

  const defaultStyle = {
    default: {
      marginBottom: '2rem',
      maxHeight: '100vh',
      transition: `all ${transitionAnimationTime} ${transitionAnimationType}`,
    },
    hidden: {
      maxHeight: 0,
      opacity: 0,
    },
  };

  const hiddenStyle = {
    hidden: draft.isDeleting,
  };

  return (
    <div style={calculateStyles(defaultStyle, hiddenStyle)} key={draft.id}>
      <ErrorBoundary
        fallbackComponent={() => (
          <DraftComponent {...draftWithEventHandlers} basic />
        )}
      >
        <DraftComponent {...draftWithEventHandlers} />
      </ErrorBoundary>
    </div>
  );
};

/* eslint-enable react/prop-types */

const QueueItems = props => {
  const { items, type, onEmptySlotClick, ...propsForPosts } = props;
  const itemList = items.map((item, index) => {
    const { queueItemType, slot, ...rest } = item;
    if (queueItemType === 'post') {
      switch (type) {
        case 'drafts':
          return renderDraft({ draft: rest, ...propsForPosts });
        case 'stories':
          return renderPost({
            post: rest,
            index,
            isStory: true,
            ...propsForPosts,
          });
        default:
          return renderPost({ post: rest, index, ...propsForPosts });
      }
    }
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
    if (type === 'stories' && queueItemType === 'slot') {
      return (
        <PostEmptySlot
          key={item.id}
          time="Add to Story"
          service="isStoryGroup"
          onClick={() =>
            onEmptySlotClick({
              dueTime: slot.label,
              profile_service: item.profileService,
              scheduledAt: slot.timestamp,
              due_at: slot.timestamp,
            })
          }
        />
      );
    }
    return null;
  });
  return <div>{itemList}</div>;
};

QueueItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
    })
  ),
  onDeleteConfirmClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onShareNowClick: PropTypes.func,
  onRequeueClick: PropTypes.func,
  onDropPost: PropTypes.func,
  onSwapPosts: PropTypes.func,
  draggable: PropTypes.bool,
  type: PropTypes.string,
  onEmptySlotClick: PropTypes.func,
};

QueueItems.defaultProps = {
  items: [],
  draggable: false,
  type: 'post',
  onEmptySlotClick: () => {},
};

export default QueueItems;
