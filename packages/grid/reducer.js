import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actionTypes as profileSidebarActionTypes } from '@bufferapp/publish-profile-sidebar';
import { actionTypes as queueActionTypes } from '@bufferapp/publish-queue';
import keyWrapper from '@bufferapp/keywrapper';

export const actionTypes = keyWrapper('GRID', {
  POST_IMAGE_CLICKED: 0,
  POST_IMAGE_CLOSED: 0,
  UPDATE_POST_URL: 0,
  COPY_TO_CLIPBOARD_RESULT: 0,
});

export const initialState = {
  byProfileId: {},
  environment: 'production',
};

export const profileInitialState = {
  loading: true,
  loadingMore: false,
  moreToLoad: false,
  copySuccess: false,
  page: 1,
  gridPosts: [],
  total: 0,
};

const handlePosts = (action, currentPosts) => {
  let posts = action.result.updates;
  if (action.args.isFetchingMore) {
    posts = { ...currentPosts, ...posts };
  }
  return posts;
};

const increasePageCount = (page) => {
  page += 1;
  return page;
};

const determineIfMoreToLoad = (action, currentPosts) => {
  const currentPostCount = Object.keys(currentPosts).length;
  const resultUpdatesCount = Object.keys(action.result.updates).length;
  return (action.result.total > (currentPostCount + resultUpdatesCount));
};

const getProfileId = (action) => {
  if (action.profileId) { return action.profileId; }
  if (action.args) { return action.args.profileId; }
  if (action.profile) { return action.profile.id; }
};

const getPostUpdateId = (action) => {
  if (action.updateId) { return action.updateId; }
  if (action.args) { return action.args.updateId; }
  if (action.post) { return action.post.id; }
};

const postReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.POST_IMAGE_CLICKED:
      return {
        ...state,
        isLightboxOpen: true,
      };
    case actionTypes.POST_IMAGE_CLOSED:
      return {
        ...state,
        isLightboxOpen: false,
      };
    case actionTypes.UPDATE_POST_URL:
      return {
        ...state,
        link: action.link,
      };
    default:
      return state;
  }
};

const postsReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_POST_URL:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED: {
      return {
        ...state,
        [getPostUpdateId(action)]: postReducer(state[getPostUpdateId(action)], action),
      };
    }
    default:
      return state;
  }
};

const profileReducer = (state = profileInitialState, action) => {
  switch (action.type) {
    case profileSidebarActionTypes.SELECT_PROFILE:
      return profileInitialState;
    case `shortenUrl_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
      };
    case `shortenUrl_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        shortUrl: action.result.shortUrl,
      };
    case `gridPosts_${dataFetchActionTypes.FETCH_START}`:
      return {
        ...state,
        loading: !action.args.isFetchingMore,
        loadingMore: action.args.isFetchingMore,
      };
    case `gridPosts_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const gridPosts = handlePosts(action, state.gridPosts);
      return {
        ...state,
        loading: false,
        loadingMore: false,
        gridPosts,
        // total: gridPosts.length,
        // moreToLoad: determineIfMoreToLoad(action, state.gridPosts),
        // page: increasePageCount(state.page),
      };
    case `gridPosts_${dataFetchActionTypes.FETCH_FAIL}`:
      return {
        ...state,
        loading: false,
      };
    case queueActionTypes.POST_COUNT_UPDATED:
      return {
        ...state,
        total: action.counts.sent,
      };
    case actionTypes.UPDATE_POST_URL:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
      return {
        ...state,
        gridPosts: postsReducer(state.gridPosts, action),
      };
    default:
      return state;
  }
};

export default (state = initialState, action) => {
  let profileId;
  switch (action.type) {
    case profileSidebarActionTypes.SELECT_PROFILE:
    case `shortenUrl_${dataFetchActionTypes.FETCH_START}`:
    case `shortenUrl_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `shortenUrl_${dataFetchActionTypes.FETCH_FAIL}`:
    case `gridPosts_${dataFetchActionTypes.FETCH_START}`:
    case `gridPosts_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `gridPosts_${dataFetchActionTypes.FETCH_FAIL}`:
    case queueActionTypes.POST_COUNT_UPDATED:
    case actionTypes.UPDATE_POST_URL:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
      profileId = getProfileId(action);
      if (profileId) {
        return {
          byProfileId: {
            ...state.byProfileId,
            [profileId]: profileReducer(state.byProfileId[profileId], action),
          },
        };
      }
      return state;
    case actionTypes.COPY_TO_CLIPBOARD_RESULT:
      return {
        ...state,
        copySuccess: action.copySuccess,
      };
    default:
      return state;
  }
};

export const actions = {
  handleImageClick: ({ post, profileId }) => ({
    type: actionTypes.POST_IMAGE_CLICKED,
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
  handleChangePostUrl: ({ post, profileId, link }) => ({
    type: actionTypes.UPDATE_POST_URL,
    updateId: post.id,
    post,
    profileId,
    link,
  }),
  handleCopyToClipboardResult: ({ copySuccess }) => ({
    type: actionTypes.COPY_TO_CLIPBOARD_RESULT,
    copySuccess,
  }),
};
