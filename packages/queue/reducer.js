import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actionTypes as profileSidebarActionTypes } from '@bufferapp/publish-profile-sidebar/reducer';
import { actionTypes as draftActionTypes } from '@bufferapp/publish-drafts/reducer';
import { postParser } from '@bufferapp/publish-server/parsers/src';
import keyWrapper from '@bufferapp/keywrapper';

export const actionTypes = keyWrapper('QUEUE', {
  POST_CREATED: 0,
  POST_UPDATED: 0,
  POST_DELETED: 0,
  POST_SENT: 0,
  POST_CONFIRMED_DELETE: 0,
  POST_ERROR: 0,
  POST_SHARE_NOW: 0,
  POST_IMAGE_CLICKED: 0,
  POST_IMAGE_CLICKED_NEXT: 0,
  POST_IMAGE_CLICKED_PREV: 0,
  POST_IMAGE_CLOSED: 0,
  OPEN_COMPOSER: 0,
  HIDE_COMPOSER: 0,
  POST_COUNT_UPDATED: 0,
  POST_DROPPED: 0,
  POSTS_SWAPPED: 0,
  REORDERED_UPDATES: 0,
  POST_REQUEUE: 0,
  VIEW_CAMPAIGN_PAGE: 0,
});

export const initialState = {
  byProfileId: {},
  showComposer: false,
  environment: 'production',
  editMode: false,
  emptySlotMode: false,
  editingPostId: '',
  isBusinessOnInstagram: null,
  isInstagramLoading: false,
};

const profileInitialState = {
  loading: true,
  loadingMore: false,
  moreToLoad: false,
  page: 1,
  posts: {},
  total: 0,
};

const determineIfMoreToLoad = (action, currentPosts) => {
  const currentPostCount = Object.keys(currentPosts).length;
  const resultUpdatesCount = Object.keys(action.result.updates).length;
  return action.result.total > currentPostCount + resultUpdatesCount;
};

const getProfileId = action => {
  if (action.profileId) {
    return action.profileId;
  }
  if (action.args) {
    return action.args.profileId;
  }
  if (action.profile) {
    return action.profile.id;
  }
};

const getPostUpdateId = action => {
  if (action.updateId) {
    return action.updateId;
  }
  if (action.args) {
    return action.args.updateId;
  }
  if (action.post) {
    return action.post.id;
  }
  if (action.draft) {
    return action.draft.id;
  }
};

const handleInstagramLoading = action => {
  if (action.args.recheck && action.result.is_business) {
    return true;
  }
  return false;
};

/**
 * handlePostsReordered()
 *
 * This method is similar to the above, but instead of responding live to drag/hover events
 * it is responsible for handling the Pusher event we dispatch when a drop operation completes.
 * This allows us to keep other clients up-to-date with drag and drop changes.
 *
 * The Pusher event originates from buffer-web and contains an array `order` with the new order
 * of posts (their IDs).
 *
 * @param  {Object} posts         Current post map
 * @param  {Array}  action.order  The new order of posts (IDs)
 * @return {Object}               New post map
 */
const handlePostsReordered = (posts, { order: newOrder }) => {
  const orderedPosts = Object.values(posts).sort((a, b) => a.due_at - b.due_at);

  //  Save values that should be fixed
  const fixedValues = orderedPosts.map(p => ({
    due_at: p.due_at,
    postAction: p.postDetails.postAction,
    day: p.day,
  }));

  // Move the posts into their correct positions
  const reorderedPosts = newOrder.map(postId => posts[postId]);

  // Finally, apply the fixed values we saved
  const finalPosts = reorderedPosts.map((p, idx) => {
    p.day = fixedValues[idx].day;
    p.postDetails.postAction = fixedValues[idx].postAction;
    p.due_at = fixedValues[idx].due_at;
    return p;
  });

  // Return a new post map
  const newPostsMap = finalPosts.reduce((map, post) => {
    map[post.id] = post;
    return map;
  }, {});

  return newPostsMap;
};

export const sortCampaignsByUpdatedAt = campaigns =>
  campaigns?.sort((first, second) => second.updatedAt - first.updatedAt);

/**
 * Reducers
 */

const postReducer = (state, action) => {
  switch (action.type) {
    case draftActionTypes.DRAFT_APPROVED:
      return action.draft;
    case actionTypes.POST_CREATED:
    case actionTypes.POST_UPDATED:
      return action.post;
    case actionTypes.POST_ERROR:
      return state;
    case actionTypes.POST_CONFIRMED_DELETE:
      return {
        ...state,
        isConfirmingDelete: false,
        isDeleting: true,
      };
    case actionTypes.POST_SHARE_NOW:
      return {
        ...state,
        isWorking: true,
      };
    case actionTypes.POST_IMAGE_CLICKED:
      return {
        ...state,
        isLightboxOpen: true,
        currentImage: 0,
      };
    case actionTypes.POST_IMAGE_CLOSED:
      return {
        ...state,
        isLightboxOpen: false,
      };
    case actionTypes.POST_IMAGE_CLICKED_NEXT:
      return {
        ...state,
        currentImage: state.currentImage + 1,
      };
    case actionTypes.POST_IMAGE_CLICKED_PREV:
      return {
        ...state,
        currentImage: state.currentImage - 1,
      };
    case `sharePostNow_${dataFetchActionTypes.FETCH_FAIL}`:
      return {
        ...state,
        isWorking: false,
      };
    case actionTypes.POST_DROPPED: {
      const newPost = {
        profile_timezone: state.profileTimezone,
        pinned: true,
        due_at: action.timestamp,
        scheduled_at: action.timestamp,
        // we also have the same field in camelCase for some reason...
        scheduledAt: action.timestamp,
        day: action.day,
      };
      // Generate new `postAction` text...
      const {
        postDetails: { postAction },
      } = postParser(newPost);
      return {
        ...state,
        ...newPost,
        postDetails: {
          ...state.postDetails,
          isCustomScheduled: true,
          postAction,
        },
      };
    }
    case actionTypes.POSTS_SWAPPED: {
      const { id: targetId, postProps: postPropsTarget } = action.postTarget;
      const { postProps: postPropsSource } = action.postSource;
      const isTargetPost = state.id === targetId;
      let newPost = {};
      let isCustomScheduled;

      if (isTargetPost) {
        isCustomScheduled = postPropsSource.postDetails.isCustomScheduled;
        newPost = {
          profile_timezone: state.profileTimezone,
          due_at: postPropsSource.due_at,
          scheduled_at: postPropsSource.scheduled_at,
          scheduledAt: postPropsSource.scheduledAt,
          day: postPropsSource.day,
          pinned: postPropsSource.pinned,
        };
      } else {
        isCustomScheduled = postPropsTarget.postDetails.isCustomScheduled;
        newPost = {
          profile_timezone: state.profileTimezone,
          due_at: postPropsTarget.due_at,
          scheduled_at: postPropsTarget.scheduled_at,
          scheduledAt: postPropsTarget.scheduledAt,
          day: postPropsTarget.day,
          pinned: postPropsTarget.pinned,
        };
      }
      // Generate new `postAction` text...
      const {
        postDetails: { postAction },
      } = postParser(newPost);

      return {
        ...state,
        ...newPost,
        postDetails: { ...state.postDetails, isCustomScheduled, postAction },
      };
    }
    default:
      return state;
  }
};

const postsReducer = (state = {}, action) => {
  switch (action.type) {
    case `queuedPosts_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `shuffleQueue_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      const { updates } = action.result;
      if (action.args.isFetchingMore) {
        return { ...state, ...updates };
      }
      return updates;
    }
    case actionTypes.POST_DELETED:
    case actionTypes.POST_SENT: {
      const { [getPostUpdateId(action)]: deleted, ...currentState } = state;
      return currentState;
    }
    case draftActionTypes.DRAFT_APPROVED:
    case actionTypes.POST_CREATED:
    case actionTypes.POST_UPDATED:
    case actionTypes.POST_CONFIRMED_DELETE:
    case actionTypes.POST_SHARE_NOW:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
    case actionTypes.POST_IMAGE_CLICKED_NEXT:
    case actionTypes.POST_IMAGE_CLICKED_PREV:
    case actionTypes.POST_ERROR:
    case actionTypes.POST_DROPPED:
    case `sharePostNow_${dataFetchActionTypes.FETCH_FAIL}`:
      return {
        ...state,
        [getPostUpdateId(action)]: postReducer(
          state[getPostUpdateId(action)],
          action
        ),
      };
    case actionTypes.POSTS_SWAPPED:
      return {
        ...state,
        [action.postSource.id]: postReducer(
          state[action.postSource.id],
          action
        ),
        [action.postTarget.id]: postReducer(
          state[action.postTarget.id],
          action
        ),
      };
    default:
      return state;
  }
};

const profileReducer = (state = profileInitialState, action) => {
  switch (action.type) {
    case `queuedPosts_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        loading:
          !action.args.isFetchingMore &&
          !action.args.isReordering &&
          !action.args.hideLoading,
        loadingMore: action.args.isFetchingMore,
      };
    case `queuedPosts_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        moreToLoad: determineIfMoreToLoad(action, state.posts),
        page: state.page + 1,
        posts: postsReducer(state.posts, action),
        total: action.result.total,
      };
    case `shuffleQueue_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        posts: postsReducer(state.posts, action),
      };
    case `queuedPosts_${dataFetchActionTypes.FETCH_FAIL}`:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.POST_COUNT_UPDATED:
      return {
        ...state,
        total: action.counts.pending,
      };
    case actionTypes.REORDERED_UPDATES: {
      return {
        ...state,
        posts: handlePostsReordered(state.posts, action),
      };
    }
    case `sharePostNow_${dataFetchActionTypes.FETCH_FAIL}`:
    case actionTypes.POST_ERROR:
    case actionTypes.POST_CREATED:
    case actionTypes.POST_UPDATED:
    case actionTypes.POST_CONFIRMED_DELETE:
    case actionTypes.POST_DELETED:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
    case actionTypes.POST_IMAGE_CLICKED_NEXT:
    case actionTypes.POST_IMAGE_CLICKED_PREV:
    case actionTypes.POST_SHARE_NOW:
    case actionTypes.POST_SENT:
    case draftActionTypes.DRAFT_APPROVED:
    case actionTypes.POST_DROPPED:
    case actionTypes.POSTS_SWAPPED:
      return {
        ...state,
        posts: postsReducer(state.posts, action),
      };
    default:
      return state;
  }
};

export default (state = initialState, action) => {
  let profileId;
  switch (action.type) {
    case actionTypes.REORDERED_UPDATES:
    case actionTypes.POST_DROPPED:
    case actionTypes.POSTS_SWAPPED:
    case `sharePostNow_${dataFetchActionTypes.FETCH_FAIL}`:
    case profileSidebarActionTypes.SELECT_PROFILE:
    case `queuedPosts_${dataFetchActionTypes.FETCH_START}`:
    case `queuedPosts_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `queuedPosts_${dataFetchActionTypes.FETCH_FAIL}`:
    case `shuffleQueue_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case actionTypes.POST_CREATED:
    case actionTypes.POST_UPDATED:
    case actionTypes.POST_CONFIRMED_DELETE:
    case actionTypes.POST_DELETED:
    case actionTypes.POST_ERROR:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
    case actionTypes.POST_IMAGE_CLICKED_NEXT:
    case actionTypes.POST_IMAGE_CLICKED_PREV:
    case actionTypes.POST_SHARE_NOW:
    case actionTypes.POST_SENT:
    case actionTypes.POST_COUNT_UPDATED:
    case draftActionTypes.DRAFT_APPROVED: {
      profileId = getProfileId(action);
      if (profileId) {
        return {
          ...state,
          byProfileId: {
            ...state.byProfileId,
            [profileId]: profileReducer(state.byProfileId[profileId], action),
          },
        };
      }
      return state;
    }
    case `checkInstagramBusiness_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        isInstagramLoading: true,
      };
    case `checkInstagramBusiness_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        isBusinessOnInstagram: action.result.is_business,
        isInstagramLoading: handleInstagramLoading(action),
      };
    case `checkInstagramBusiness_${dataFetchActionTypes.FETCH_FAIL}`:
      return {
        ...state,
        isBusinessOnInstagram: false,
        isInstagramLoading: false,
      };

    case actionTypes.OPEN_COMPOSER:
      return {
        ...state,
        showComposer: true,
        editMode: action.editMode,
        editingPostId: action.updateId,
        emptySlotMode: action.emptySlotMode,
        emptySlotData: action.emptySlotData,
      };
    case actionTypes.HIDE_COMPOSER:
      return {
        ...state,
        showComposer: false,
        editMode: false,
        emptySlotMode: false,
      };
    default:
      return state;
  }
};

export const actions = {
  handleEditClick: ({ post, profileId }) => ({
    type: actionTypes.OPEN_COMPOSER,
    updateId: post.id,
    editMode: true,
    post,
    profileId,
  }),
  handleEmptySlotClick: ({ profileId, emptySlotData }) => ({
    type: actionTypes.OPEN_COMPOSER,
    emptySlotMode: true,
    emptySlotData,
    profileId,
  }),
  handleDeleteConfirmClick: ({ post, profileId }) => ({
    type: actionTypes.POST_CONFIRMED_DELETE,
    updateId: post.id,
    post,
    profileId,
  }),
  handleShareNowClick: ({ post, profileId }) => ({
    type: actionTypes.POST_SHARE_NOW,
    updateId: post.id,
    post,
    profileId,
  }),
  handleImageClick: ({ post, profileId }) => ({
    type: actionTypes.POST_IMAGE_CLICKED,
    updateId: post.id,
    post,
    profileId,
  }),
  handleImageClickNext: ({ post, profileId }) => ({
    type: actionTypes.POST_IMAGE_CLICKED_NEXT,
    updateId: post.id,
    post,
    profileId,
  }),
  handleImageClickPrev: ({ post, profileId }) => ({
    type: actionTypes.POST_IMAGE_CLICKED_PREV,
    updateId: post.id,
    post,
    profileId,
  }),
  handleImageClose: ({ post, profileId }) => ({
    type: actionTypes.POST_IMAGE_CLOSED,
    updateId: post.id,
    post,
    profileId,
  }),
  handleRequeue: ({ post, profileId }) => ({
    type: actionTypes.POST_REQUEUE,
    updateId: post.id,
    post,
    profileId,
  }),
  handleCampaignTagClick: ({ campaignId }) => ({
    type: actionTypes.VIEW_CAMPAIGN_PAGE,
    campaignId,
  }),
  handleComposerPlaceholderClick: () => ({
    type: actionTypes.OPEN_COMPOSER,
  }),
  // TODO: rename to more representative name
  handleComposerCreateSuccess: () => ({
    type: actionTypes.HIDE_COMPOSER,
  }),
  postCountUpdated: (profileId, counts) => ({
    type: actionTypes.POST_COUNT_UPDATED,
    profileId,
    counts,
  }),
  onDropPost: (id, timestamp, day, profileId) => ({
    type: actionTypes.POST_DROPPED,
    updateId: id,
    profileId,
    day,
    timestamp,
  }),
  onSwapPosts: (postSource, postTarget, profileId) => ({
    type: actionTypes.POSTS_SWAPPED,
    postSource,
    postTarget,
    profileId,
  }),
};
