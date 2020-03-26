import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actionTypes as profileSidebarActionTypes } from '@bufferapp/publish-profile-sidebar/reducer';
import {
  actionTypes as queueActionTypes,
  sortCampaignsByUpdatedAt,
} from '@bufferapp/publish-queue/reducer';
import keyWrapper from '@bufferapp/keywrapper';

export const actionTypes = keyWrapper('SENT', {
  OPEN_COMPOSER: 0,
  HIDE_COMPOSER: 0,
  POST_IMAGE_CLICKED: 0,
  POST_IMAGE_CLICKED_NEXT: 0,
  POST_IMAGE_CLICKED_PREV: 0,
  POST_IMAGE_CLOSED: 0,
  FETCH_SENT_POSTS: 0,
  VIEW_CAMPAIGN_PAGE: 0,
});

export const initialState = {
  byProfileId: {},
  showComposer: false,
  editMode: false,
  editingPostId: '',
  environment: 'production',
  campaigns: [],
};

export const profileInitialState = {
  loading: true,
  loadingMore: false,
  moreToLoad: false,
  page: 1,
  posts: {},
  total: 0,
};

const handlePosts = (action, currentPosts) => {
  let posts = action.result.updates;
  if (action.args.isFetchingMore) {
    posts = { ...currentPosts, ...posts };
  }
  return posts;
};

const increasePageCount = page => {
  page += 1;
  return page;
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
};

const postReducer = (state, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

const postsReducer = (state, action) => {
  switch (action.type) {
    case queueActionTypes.POST_SENT:
      return {
        ...state,
        [getPostUpdateId(action)]: action.post,
      };
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
    case actionTypes.POST_IMAGE_CLICKED_NEXT:
    case actionTypes.POST_IMAGE_CLICKED_PREV: {
      return {
        ...state,
        [getPostUpdateId(action)]: postReducer(
          state[getPostUpdateId(action)],
          action
        ),
      };
    }
    default:
      return state;
  }
};

const hasBitlyPosts = posts => Object.values(posts).some(
  post =>
    post.text.indexOf('https://buff.ly/') >= 0 ||
    post.text.indexOf('https://bit.ly/') >= 0 ||
    post.text.indexOf('https://j.mp/') >= 0
);

const profileReducer = (state = profileInitialState, action) => {
  switch (action.type) {
    case profileSidebarActionTypes.SELECT_PROFILE:
      return profileInitialState;
    case `sentPosts_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        loading: !action.args.isFetchingMore,
        loadingMore: action.args.isFetchingMore,
      };
    case `sentPosts_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      const posts = handlePosts(action, state.posts);

      return {
        ...state,
        loading: false,
        loadingMore: false,
        moreToLoad: determineIfMoreToLoad(action, state.posts),
        page: increasePageCount(state.page),
        posts,
        total: action.result.total,
        hasBitlyPosts: hasBitlyPosts(posts),
      };
    }
    case `sentPosts_${dataFetchActionTypes.FETCH_FAIL}`:
      return {
        ...state,
        loading: false,
      };
    case queueActionTypes.POST_COUNT_UPDATED:
      return {
        ...state,
        total: action.counts.sent,
      };
    case queueActionTypes.POST_SENT:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
    case actionTypes.POST_IMAGE_CLICKED_NEXT:
    case actionTypes.POST_IMAGE_CLICKED_PREV:
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
    case profileSidebarActionTypes.SELECT_PROFILE:
    case `sentPosts_${dataFetchActionTypes.FETCH_START}`:
    case `sentPosts_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `sentPosts_${dataFetchActionTypes.FETCH_FAIL}`:
    case queueActionTypes.POST_SENT:
    case queueActionTypes.POST_COUNT_UPDATED:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
    case actionTypes.POST_IMAGE_CLICKED_NEXT:
    case actionTypes.POST_IMAGE_CLICKED_PREV:
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
    case actionTypes.OPEN_COMPOSER:
      return {
        ...state,
        showComposer: true,
        editMode: action.editMode,
        editingPostId: action.updateId,
      };
    case actionTypes.HIDE_COMPOSER:
      return {
        ...state,
        showComposer: false,
        editMode: false,
      };
    case `getCampaignsList_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        campaigns: sortCampaignsByUpdatedAt(action.result),
      };
    default:
      return state;
  }
};

export const actions = {
  handleShareAgainClick: ({ post, profileId }) => {
    return {
      type: actionTypes.OPEN_COMPOSER,
      updateId: post.id,
      editMode: false,
      profileId,
    };
  },
  handleCampaignTagClick: ({ campaignId }) => ({
    type: queueActionTypes.VIEW_CAMPAIGN_PAGE,
    campaignId,
    isSent: true,
  }),
  handleComposerCreateSuccess: () => ({
    type: actionTypes.HIDE_COMPOSER,
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
  fetchSentPosts: ({ profileId }) => ({
    type: actionTypes.FETCH_SENT_POSTS,
    profileId,
  }),
};
