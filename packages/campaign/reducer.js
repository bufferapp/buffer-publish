import keyWrapper from '@bufferapp/keywrapper';
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import {
  sortCampaignsByUpdatedAt,
  actionTypes as queueActionTypes,
} from '@bufferapp/publish-queue/reducer';

export const actionTypes = keyWrapper('CAMPAIGN_VIEW', {
  FETCH_CAMPAIGN: 0,
  OPEN_COMPOSER: 0,
  CLOSE_COMPOSER: 0,
  GO_TO_ANALYZE_REPORT: 0,
  POST_IMAGE_CLICKED: 0,
  POST_IMAGE_CLICKED_NEXT: 0,
  POST_IMAGE_CLICKED_PREV: 0,
  POST_IMAGE_CLOSED: 0,
  POST_CONFIRMED_DELETE: 0,
  POST_SHARE_NOW: 0,
});

export const initialState = {
  campaign: {},
  campaignPosts: [],
  isLoading: true,
  campaignId: null,
  showComposer: false,
  editMode: false,
  editingPostId: null,
  selectedProfileId: null,
  campaigns: [],
};

const postReducer = ({ campaignPosts, action, newState }) => {
  return campaignPosts.map(campaign => {
    if (campaign.id === action.updateId) {
      const { content, ...rest } = campaign;
      return {
        ...rest,
        content: {
          ...content,
          ...newState,
        },
      };
    }
    return campaign;
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case `getCampaign_${dataFetchActionTypes.FETCH_START}`: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case `getCampaign_${dataFetchActionTypes.FETCH_FAIL}`: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case `getCampaign_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      const { fullItems } = action.args;
      const { items, ...campaign } = action.result;
      return {
        ...state,
        campaign,
        campaignId: campaign.id,
        campaignPosts: (fullItems && items) || [],
        isLoading: false,
      };
    }
    case actionTypes.OPEN_COMPOSER: {
      return {
        ...state,
        showComposer: true,
        editMode: action.editMode || false,
        editingPostId: action.updateId || null,
        selectedProfileId: action.profileId || null,
      };
    }
    case actionTypes.CLOSE_COMPOSER: {
      return {
        ...state,
        showComposer: false,
        editMode: false,
      };
    }
    case `getCampaignsList_${dataFetchActionTypes.FETCH_SUCCESS}`:
      return {
        ...state,
        campaigns: sortCampaignsByUpdatedAt(action.result),
      };
    // Pusher events
    case queueActionTypes.POST_UPDATED: {
      const postCampaignId = action?.post?.campaignDetails?.id;
      if (
        postCampaignId === state.campaign?.id &&
        typeof postCampaignId === 'string'
      ) {
        const newCampaignPosts = state.campaignPosts.map(post => {
          if (post.id === action.post.id) {
            const campaignPost = {
              ...post,
              dueAt: action.post.due_at || post.dueAt,
              type: action.post.type || post.type,
              content: action.post,
            };
            return campaignPost;
          }
          return post;
        });
        return {
          ...state,
          campaignPosts: newCampaignPosts,
        };
      }
      return state;
    }
    case queueActionTypes.POST_CREATED: {
      const postCampaignId = action?.post?.campaignDetails?.id;
      if (
        postCampaignId === state.campaign?.id &&
        typeof postCampaignId === 'string'
      ) {
        const campaignPost = {
          _id: action.post.id,
          id: action.post.id,
          dueAt: action.post.due_at,
          type: action.post.type,
          content: action.post,
        };
        return {
          ...state,
          campaign: {
            ...state.campaign,
            scheduled: state.campaign.scheduled + 1,
          },
          campaignPosts: [...state.campaignPosts, campaignPost],
        };
      }
      return state;
    }
    case queueActionTypes.POST_DELETED: {
      const postCampaignId = action?.post?.campaignDetails?.id;
      if (
        postCampaignId === state.campaign?.id &&
        typeof postCampaignId === 'string'
      ) {
        const newCampaignPosts = state.campaignPosts.filter(
          post => post.id !== action.post.id
        );
        return {
          ...state,
          campaign: {
            ...state.campaign,
            scheduled: state.campaign.scheduled - 1,
          },
          campaignPosts: newCampaignPosts,
        };
      }
      return state;
    }
    case queueActionTypes.POST_SENT: {
      const postCampaignId = action?.post?.campaignDetails?.id;
      if (
        postCampaignId === state.campaign?.id &&
        typeof postCampaignId === 'string'
      ) {
        const newCampaignPosts = state.campaignPosts.filter(
          post => post.id !== action.post.id
        );
        return {
          ...state,
          campaign: {
            ...state.campaign,
            scheduled: state.campaign.scheduled - 1,
            sent: state.campaign.sent + 1,
          },
          campaignPosts: newCampaignPosts,
        };
      }
      return state;
    }
    // Post events
    case actionTypes.POST_IMAGE_CLICKED:
    case actionTypes.POST_IMAGE_CLOSED:
    case actionTypes.POST_IMAGE_CLICKED_NEXT:
    case actionTypes.POST_IMAGE_CLICKED_PREV:
    case actionTypes.POST_CONFIRMED_DELETE:
    case actionTypes.POST_SHARE_NOW:
    case `sharePostNow_${dataFetchActionTypes.FETCH_FAIL}`:
    case `deletePost_${dataFetchActionTypes.FETCH_FAIL}`: {
      let newState = {};
      switch (action.type) {
        case actionTypes.POST_IMAGE_CLICKED:
          newState = {
            isLightboxOpen: true,
            currentImage: 0,
          };
          break;
        case actionTypes.POST_IMAGE_CLOSED:
          newState = {
            isLightboxOpen: false,
          };
          break;
        case actionTypes.POST_IMAGE_CLICKED_NEXT:
          newState = {
            currentImage: action.post.currentImage + 1,
          };
          break;
        case actionTypes.POST_IMAGE_CLICKED_PREV:
          newState = {
            currentImage: action.post.currentImage - 1,
          };
          break;
        case actionTypes.POST_CONFIRMED_DELETE:
          newState = {
            isConfirmingDelete: false,
            isDeleting: true,
          };
          break;
        case `deletePost_${dataFetchActionTypes.FETCH_FAIL}`:
          newState = {
            isDeleting: false,
          };
          break;
        case actionTypes.POST_SHARE_NOW:
          newState = {
            isWorking: true,
          };
          break;
        case `sharePostNow_${dataFetchActionTypes.FETCH_FAIL}`:
          newState = {
            isWorking: false,
          };
          break;
        default:
      }

      return {
        ...state,
        campaignPosts: postReducer({
          campaignPosts: state.campaignPosts,
          action,
          newState,
        }),
      };
    }
    default:
      return state;
  }
};

export const actions = {
  handleOpenComposer: ({ post, profileId, campaignId, editMode }) => ({
    type: actionTypes.OPEN_COMPOSER,
    updateId: post?.id,
    editMode,
    post,
    profileId,
    campaignId,
  }),
  handleCloseComposer: () => ({
    type: actionTypes.CLOSE_COMPOSER,
  }),
  fetchCampaign: ({ campaignId, past, fullItems }) => ({
    type: actionTypes.FETCH_CAMPAIGN,
    campaignId,
    past,
    fullItems,
  }),
  goToAnalyzeReport: campaign => ({
    type: actionTypes.GO_TO_ANALYZE_REPORT,
    campaign,
  }),
  handleDeleteConfirmClick: ({ post }) => ({
    type: actionTypes.POST_CONFIRMED_DELETE,
    updateId: post.id,
  }),
  handleShareNowClick: ({ post }) => ({
    type: actionTypes.POST_SHARE_NOW,
    updateId: post.id,
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
};
