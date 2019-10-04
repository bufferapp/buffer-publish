import React from 'react';
import PropTypes from 'prop-types';
import { calculateStyles } from '@bufferapp/components/lib/utils';
import {
  transitionAnimationTime,
  transitionAnimationType,
} from '@bufferapp/components/style/animation';
import getErrorBoundary from '@bufferapp/publish-web/components/ErrorBoundary';
import { PostEmptySlot } from '@bufferapp/publish-shared-components';

import TextPost from '../TextPost';
import ImagePost from '../ImagePost';
import MultipleImagesPost from '../MultipleImagesPost';
import Story from '../Story';
import LinkPost from '../LinkPost';
import VideoPost from '../VideoPost';
import PostDragWrapper from '../PostDragWrapper';
import TextDraft from '../TextDraft';
import ImageDraft from '../ImageDraft';
import MultipleImagesDraft from '../MultipleImagesDraft';
import LinkDraft from '../LinkDraft';
import VideoDraft from '../VideoDraft';

const ErrorBoundary = getErrorBoundary(true);
const listHeaderStyle = {
  marginBottom: '1rem',
  marginTop: '1rem',
  marginLeft: '0.5rem',
};

const headerTextStyle = {
  display: 'flex',
  alignItems: 'baseline',
};

const headerTextDayOfWeekStyle = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'bold',
  lineHeight: 'normal',
  fontSize: '18px',
  color: '#3D3D3D',
};

const headerTextDateStyle = {
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal',
  lineHeight: 'normal',
  fontSize: '14px',
  textTransform: 'uppercase',
  color: '#636363',
  marginLeft: '8px',
};

const postTypeComponentMap = new Map([
  ['text', TextPost],
  ['image', ImagePost],
  ['multipleImage', MultipleImagesPost],
  ['link', LinkPost],
  ['video', VideoPost],
  ['storyGroup', Story],
]);

const draftTypeComponentMap = new Map([
  ['text', TextDraft],
  ['image', ImageDraft],
  ['multipleImage', MultipleImagesDraft],
  ['link', LinkDraft],
  ['video', VideoDraft],
  ['storyGroup', Story],
]);

/* eslint-disable react/prop-types */

const renderPost = ({
  post,
  index,
  isStory,
  onRequeueClick,
  onDeleteConfirmClick,
  onEditClick,
  onShareNowClick,
  onImageClick,
  onImageClickNext,
  onImageClickPrev,
  onImageClose,
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
    key: post.id,
    index,
    postDetails: post.postDetails,
    onDeleteConfirmClick: () => onDeleteConfirmClick({ post }),
    onEditClick: () => onEditClick({ post }),
    onShareNowClick: () => onShareNowClick({ post }),
    onImageClick: () => onImageClick({ post }),
    onImageClickNext: () => onImageClickNext({ post }),
    onImageClickPrev: () => onImageClickPrev({ post }),
    onImageClose: () => onImageClose({ post }),
    onRequeueClick: () => onRequeueClick({ post }),
    onPreviewClick,
    onDropPost,
    onSwapPosts,
    hasFirstCommentFlip,
    serviceId,
    userData,
  };
  let PostComponent = postTypeComponentMap.get(post.type);
  PostComponent = PostComponent || TextPost;

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
      <div
        style={calculateStyles(defaultStyle, hiddenStyle)}
        key={post.id}
      >
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
    <div
      style={calculateStyles(defaultStyle, hiddenStyle)}
      key={post.id}
    >
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
  onImageClick,
  onImageClickNext,
  onImageClickPrev,
  onImageClose,
  hasFirstCommentFlip,
}) => {
  const draftWithEventHandlers = {
    ...draft,
    key: draft.id,
    draftDetails: draft.draftDetails,
    onDeleteConfirmClick: () => onDeleteConfirmClick({ draft }),
    onEditClick: () => onEditClick({ draft }),
    onApproveClick: () => onApproveClick({ draft }),
    onMoveToDraftsClick: () => onMoveToDraftsClick({ draft }),
    onRequestApprovalClick: () => onRequestApprovalClick({ draft }),
    onRescheduleClick: () => onRescheduleClick({ draft }),
    onImageClick: () => onImageClick({ draft }),
    onImageClickNext: () => onImageClickNext({ draft }),
    onImageClickPrev: () => onImageClickPrev({ draft }),
    onImageClose: () => onImageClose({ draft }),
    hasFirstCommentFlip,
  };
  let DraftComponent = draftTypeComponentMap.get(draft.type);
  DraftComponent = DraftComponent || TextDraft;

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
    <div
      style={calculateStyles(defaultStyle, hiddenStyle)}
      key={draft.id}
    >
      <ErrorBoundary fallbackComponent={() => <DraftComponent {...draftWithEventHandlers} basic />}>
        <DraftComponent {...draftWithEventHandlers} />
      </ErrorBoundary>
    </div>
  );
};

const renderHeader = ({
  text,
  id,
  dayOfWeek,
  date,
}) => (
  <div style={listHeaderStyle} key={id}>
    <div style={headerTextStyle}>
      {(dayOfWeek && date)
        ? (
          <React.Fragment>
            <span style={headerTextDayOfWeekStyle}>{dayOfWeek}</span>
            <span style={headerTextDateStyle}>{date}</span>
          </React.Fragment>
        ) : <span style={headerTextDayOfWeekStyle}>{text}</span>
      }
    </div>
  </div>
);

const renderSlot = ({ id, slot, profileService }, onEmptySlotClick) => (
  <PostEmptySlot
    key={id}
    time="Add to Story"
    service="isStoryGroup"
    onClick={() => onEmptySlotClick({
      dueTime: slot.label,
      profile_service: profileService,
      scheduledAt: slot.timestamp,
      due_at: slot.timestamp,
    })}
  />
);

/* eslint-enable react/prop-types */

const QueueItems = (props) => {
  const { items, type, onEmptySlotClick, ...propsForPosts } = props;
  const itemList = items.map((item, index) => {
    const { queueItemType, ...rest } = item;
    if (queueItemType === 'post') {
      switch (type) {
        case 'drafts':
          return renderDraft({ draft: rest, ...propsForPosts });
        case 'stories':
          return renderPost({ post: rest, index, isStory: true, ...propsForPosts });
        default:
          return renderPost({ post: rest, index, ...propsForPosts });
      }
    }
    if (queueItemType === 'header') {
      return renderHeader(rest);
    }
    if (type === 'stories' && queueItemType === 'slot') {
      return renderSlot(rest, onEmptySlotClick);
    }
    return null;
  });
  return (
    <div>
      {itemList}
    </div>
  );
};

QueueItems.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
    }),
  ),
  onDeleteConfirmClick: PropTypes.func,
  onEditClick: PropTypes.func,
  onShareNowClick: PropTypes.func,
  onRequeueClick: PropTypes.func,
  onImageClick: PropTypes.func,
  onImageClickNext: PropTypes.func,
  onImageClickPrev: PropTypes.func,
  onImageClose: PropTypes.func,
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
