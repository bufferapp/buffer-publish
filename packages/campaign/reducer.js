import keyWrapper from '@bufferapp/keywrapper';
import { LOCATION_CHANGE } from 'connected-react-router';
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actionTypes as queueActionTypes } from '@bufferapp/publish-queue/reducer';
import { actionTypes as draftActionTypes } from '@bufferapp/publish-drafts/reducer';
import {
  campaignParser,
  campaignItemParser,
} from '@bufferapp/publish-server/parsers/src';
import {
  getParams,
  campaignScheduled,
  campaignSent,
} from '@bufferapp/publish-routes';

export const actionTypes = keyWrapper('CAMPAIGN_VIEW', {
  FETCH_CAMPAIGN: 0,
  PUSHER_CAMPAIGN_CREATED: 0,
  PUSHER_CAMPAIGN_DELETED: 0,
  PUSHER_CAMPAIGN_UPDATED: 0,
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
  hideSkeletonHeader: false,
  campaignId: null,
  showComposer: false,
  editMode: false,
  editingPostId: null,
  selectedProfileId: null,
  page: null,
};

const postReducer = ({ campaignPosts, action, newState }) => {
  return campaignPosts.map(campaign => {
    if (campaign.id === action.updateId) {
      return {
        ...campaign,
        ...newState,
      };
    }
    return campaign;
  });
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOCATION_CHANGE: {
      const { pathname } = action.payload.location;
      const scheduledParams = getParams({
        pathname,
        route: campaignScheduled.route,
      });
      const sentParams = getParams({ pathname, route: campaignSent.route });
      const currentSingleCampaignPage = () => {
        if (scheduledParams) return 'scheduled';
        if (sentParams) return 'sent';
        return null;
      };
      const campaignId = scheduledParams?.id || sentParams?.id;
      const { id } = state.campaign;
      // Not showing a header loader when the campaign stored in the state is the same.
      const isFirstTimeLoading = id !== campaignId;
      return {
        ...state,
        campaignId,
        page: currentSingleCampaignPage(),
        isLoading: true,
        hideSkeletonHeader: !isFirstTimeLoading,
      };
    }
    case `getCampaign_${dataFetchActionTypes.FETCH_FAIL}`: {
      return {
        ...state,
        isLoading: false,
        hideSkeletonHeader: false,
      };
    }
    case actionTypes.PUSHER_CAMPAIGN_UPDATED: {
      const { campaign } = state;
      const updatedCampaign = campaignParser(action.campaign);
      return {
        ...state,
        campaign:
          updatedCampaign.id === campaign.id ? updatedCampaign : campaign,
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
        hideSkeletonHeader: false,
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
    // Pusher events
    case queueActionTypes.POST_UPDATED: {
      const inScheduledPage = state.page === 'scheduled';
      const postCampaignId = action?.post?.campaignDetails?.id;
      if (
        postCampaignId === state.campaign?.id &&
        typeof postCampaignId === 'string' &&
        inScheduledPage
      ) {
        const newCampaignPosts = state.campaignPosts.map(post => {
          if (post.id === action.post.id) {
            const parsedItem = campaignItemParser(
              {
                content: action.post,
                type: 'update',
              },
              state.campaign.channels,
              true
            );
            return parsedItem;
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
    case queueActionTypes.POST_CREATED:
    case draftActionTypes.DRAFT_APPROVED: {
      const inScheduledPage = state.page === 'scheduled';
      const postCampaignId = action?.post?.campaignDetails?.id;
      if (
        postCampaignId === state.campaign?.id &&
        typeof postCampaignId === 'string' &&
        inScheduledPage
      ) {
        const parsedItem = campaignItemParser(
          {
            content: action.post || action.draft,
            type: 'update',
          },
          state.campaign.channels,
          true
        );
        return {
          ...state,
          campaign: {
            ...state.campaign,
            scheduled: state.campaign.scheduled + 1,
          },
          campaignPosts: [...state.campaignPosts, parsedItem],
        };
      }
      return state;
    }
    case queueActionTypes.POST_DELETED: {
      const inScheduledPage = state.page === 'scheduled';
      const postCampaignId = action?.post?.campaignDetails?.id;
      if (
        postCampaignId === state.campaign?.id &&
        typeof postCampaignId === 'string' &&
        inScheduledPage
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
      const inScheduledPage = state.page === 'scheduled';
      const inSentPage = state.page === 'sent';
      const postCampaignId = action?.post?.campaignDetails?.id;
      if (
        postCampaignId === state.campaign?.id &&
        typeof postCampaignId === 'string' &&
        (inScheduledPage || inSentPage)
      ) {
        const campaignPostsFiltered = state.campaignPosts.filter(
          post => post.id !== action.post.id
        );
        const parsedItem = campaignItemParser(
          {
            content: action.post,
            type: 'update',
          },
          state.campaign.channels,
          true
        );
        const newCampaignPosts = () => {
          if (inScheduledPage) return campaignPostsFiltered;
          if (inSentPage) return [...state.campaignPosts, parsedItem];
        };
        return {
          ...state,
          campaign: {
            ...state.campaign,
            scheduled: state.campaign.scheduled - 1,
            sent: state.campaign.sent + 1,
          },
          campaignPosts: newCampaignPosts(),
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
