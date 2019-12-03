import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actionTypes as profileSidebarActionTypes } from '@bufferapp/publish-profile-sidebar/reducer';
import keyWrapper from '@bufferapp/keywrapper';
import cloneDeep from 'lodash.clonedeep';
import { isValidURL, urlHasProtocol } from './util';

export const actionTypes = keyWrapper('GRID', {
  POST_IMAGE_CLICKED: 0,
  POST_IMAGE_CLOSED: 0,
  UPDATE_POST_URL: 0,
  SAVE_POST_URL: 0,
  COPY_TO_CLIPBOARD_RESULT: 0,
  GET_CUSTOM_LINKS: 0,
  UPDATE_CUSTOM_LINKS: 0,
  DELETE_CUSTOM_LINK: 0,
  ADD_CUSTOM_LINK: 0,
  EDIT_CUSTOM_LINK_TEXT: 0,
  CANCEL_EDIT_CUSTOM_LINK_TEXT: 0,
  EDIT_CUSTOM_LINK_URL: 0,
  SAVE_CUSTOM_LINK: 0,
  TOGGLE_CUSTOM_LINK_EDIT_MODE: 0,
});

export const initialState = {
  byProfileId: {},
  environment: 'production',
};

export const profileInitialState = {
  loading: true,
  copySuccess: false,
  gridPosts: [],
  customLinksDetails: {
    buttonColor: null,
    buttonType: null,
    customLinks: [],
  },
  total: 0,
  maxCustomLinks: 3,
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
  let { link } = action;
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
    case actionTypes.SAVE_POST_URL:
      if (isValidURL(action.link)) {
        if (!urlHasProtocol(action.link)) {
          link = `https://${link}`;
        }
      }
      return {
        ...state,
        link,
        oldLink: link,
      };
    case actionTypes.UPDATE_POST_URL:
      return {
        ...state,
        link: action.link,
        oldLink: action.oldLink || null,
      };
    default:
      return state;
  }
};

const postsReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SAVE_POST_URL:
    case actionTypes.UPDATE_POST_URL:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED: {
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

const profileReducer = (state = profileInitialState, action) => {
  switch (action.type) {
    case profileSidebarActionTypes.SELECT_PROFILE:
      if (action.profile && action.profile.customLinksDetails) {
        return {
          ...profileInitialState,
          customLinksDetails: action.profile.customLinksDetails,
        };
      }
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
        loading: true,
      };
    case `gridPosts_${dataFetchActionTypes.FETCH_SUCCESS}`:
      const gridPosts = action.result.updates;
      return {
        ...state,
        loading: false,
        gridPosts,
        total: gridPosts.length,
      };
    case `gridPosts_${dataFetchActionTypes.FETCH_FAIL}`:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.SAVE_POST_URL:
    case actionTypes.UPDATE_POST_URL:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
      return {
        ...state,
        gridPosts: postsReducer(state.gridPosts, action),
      };
    case actionTypes.ADD_CUSTOM_LINK: {
      const { customLinksDetails } = state;
      const { customLinks = [] } = customLinksDetails;
      return {
        ...state,
        customLinksDetails: {
          ...customLinksDetails,
          customLinks: [
            ...customLinks,
            {
              editing: true,
              text: '',
              url: '',
              order: customLinks.length,
            },
          ],
        },
      };
    }
    case actionTypes.TOGGLE_CUSTOM_LINK_EDIT_MODE: {
      const { customLinksDetails } = state;
      const { customLinks } = customLinksDetails;

      const editedCustomLinks = cloneDeep(customLinks);

      editedCustomLinks.map(item => {
        if (item._id === action.item._id) {
          item.editing = action.editing;
        }
        return item;
      });

      return {
        ...state,
        customLinksDetails: {
          ...customLinksDetails,
          customLinks: editedCustomLinks,
        },
      };
    }
    case actionTypes.UPDATE_CUSTOM_LINKS: {
      const { customLinksDetails } = state;
      const { customLinks } = customLinksDetails;

      const editedCustomLinks = cloneDeep(customLinks);

      editedCustomLinks.map(item => {
        item.editing = false;
        return item;
      });

      return {
        ...state,
        customLinksDetails: {
          ...customLinksDetails,
          customLinks: editedCustomLinks,
        },
      };
    }
    case actionTypes.DELETE_CUSTOM_LINK: {
      const { customLinksDetails } = state;
      const { customLinks } = customLinksDetails;

      const editedCustomLinks = cloneDeep(customLinks);

      return {
        ...state,
        customLinksDetails: {
          ...customLinksDetails,
          customLinks: editedCustomLinks.filter(
            link => link._id !== action.customLinkId
          ),
        },
      };
    }
    case actionTypes.EDIT_CUSTOM_LINK_TEXT:
    case actionTypes.EDIT_CUSTOM_LINK_URL: {
      const { customLinksDetails } = state;
      const { customLinks } = customLinksDetails;

      const editedCustomLinks = cloneDeep(customLinks);

      editedCustomLinks.map(item => {
        if (item.order === action.item.order) {
          if (typeof item[`old_${action.prop}`] === 'undefined') {
            item[`old_${action.prop}`] = item[action.prop];
          }
          item[action.prop] = action.value;
        }
        return item;
      });

      return {
        ...state,
        customLinksDetails: {
          ...customLinksDetails,
          customLinks: editedCustomLinks,
        },
      };
    }
    case actionTypes.SAVE_CUSTOM_LINK:
      return state;
    default:
      return state;
  }
};

export default (state = initialState, action) => {
  let profileId;
  switch (action.type) {
    case profileSidebarActionTypes.SELECT_PROFILE:
    case `updatePostLink_${dataFetchActionTypes.FETCH_START}`:
    case `updatePostLink_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `updatePostLink_${dataFetchActionTypes.FETCH_FAIL}`:
    case `shortenUrl_${dataFetchActionTypes.FETCH_START}`:
    case `shortenUrl_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `shortenUrl_${dataFetchActionTypes.FETCH_FAIL}`:
    case `gridPosts_${dataFetchActionTypes.FETCH_START}`:
    case `gridPosts_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `gridPosts_${dataFetchActionTypes.FETCH_FAIL}`:
    case actionTypes.SAVE_POST_URL:
    case actionTypes.UPDATE_POST_URL:
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
    case actionTypes.ADD_CUSTOM_LINK:
    case actionTypes.EDIT_CUSTOM_LINK_TEXT:
    case actionTypes.EDIT_CUSTOM_LINK_URL:
    case actionTypes.TOGGLE_CUSTOM_LINK_EDIT_MODE:
    case actionTypes.UPDATE_CUSTOM_LINKS:
    case actionTypes.DELETE_CUSTOM_LINK:
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
  handleChangePostUrl: ({ post, profileId, link, oldLink }) => ({
    type: actionTypes.UPDATE_POST_URL,
    updateId: post.id,
    post,
    profileId,
    link,
    oldLink,
  }),
  handleSavePostUrl: ({ post, profileId, link }) => ({
    type: actionTypes.SAVE_POST_URL,
    updateId: post.id,
    post,
    profileId,
    link,
  }),
  handleCopyToClipboardResult: ({ copySuccess, publicGridUrl }) => ({
    type: actionTypes.COPY_TO_CLIPBOARD_RESULT,
    copySuccess,
    publicGridUrl,
  }),
  handleUpdateCustomLinks: ({
    profileId,
    customLinks,
    customLinkColor,
    customLinkContrastColor,
    customLinkButtonType,
  }) => ({
    type: actionTypes.UPDATE_CUSTOM_LINKS,
    profileId,
    customLinks,
    customLinkColor,
    customLinkContrastColor,
    customLinkButtonType,
  }),
  handleDeleteCustomLink: ({ profileId, customLinkId }) => ({
    type: actionTypes.DELETE_CUSTOM_LINK,
    profileId,
    customLinkId,
  }),
  handleAddGridLink: ({ profileId }) => ({
    type: actionTypes.ADD_CUSTOM_LINK,
    profileId,
  }),
  handleCancelEditCustomLinkText: ({ profileId, item }) => ({
    type: actionTypes.CANCEL_EDIT_CUSTOM_LINK_TEXT,
    profileId,
    item,
  }),
  handleSaveCustomLink: ({ profileId, item }) => ({
    type: actionTypes.SAVE_CUSTOM_LINK,
    profileId,
    item,
  }),
  handleEditCustomLinkText: ({ profileId, item, value, prop }) => ({
    type: actionTypes.EDIT_CUSTOM_LINK_TEXT,
    profileId,
    item,
    value,
    prop,
  }),
  handleEditCustomLinkUrl: ({ profileId, item, value, prop }) => ({
    type: actionTypes.EDIT_CUSTOM_LINK_URL,
    profileId,
    item,
    value,
    prop,
  }),
  handleToggleEditMode: ({ profileId, item, editing }) => ({
    type: actionTypes.TOGGLE_CUSTOM_LINK_EDIT_MODE,
    profileId,
    item,
    editing,
  }),
};
