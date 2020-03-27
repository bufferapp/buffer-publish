import keyWrapper from '@bufferapp/keywrapper';
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { sortCampaignsByUpdatedAt } from '@bufferapp/publish-queue/reducer';

export const actionTypes = keyWrapper('CAMPAIGN_VIEW', {
  FETCH_CAMPAIGN: 0,
  OPEN_COMPOSER: 0,
  CLOSE_COMPOSER: 0,
  GO_TO_ANALYZE_REPORT: 0,
});

export const initialState = {
  campaign: {},
  campaignPosts: [],
  isLoading: false,
  campaignId: null,
  showComposer: false,
  editMode: false,
  editingPostId: '',
  campaigns: [],
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
      return {
        ...state,
        campaign: action.result,
        campaignId: action.result.id,
        isLoading: false,
      };
    }
    case actionTypes.OPEN_COMPOSER: {
      return {
        ...state,
        showComposer: true,
        editMode: action.editMode || false,
        editingPostId: action.updateId || '',
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
    default:
      return state;
  }
};

export const actions = {
  handleOpenComposer: campaignId => ({
    type: actionTypes.OPEN_COMPOSER,
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
  handleEditClick: ({ post, profileId }) => ({
    type: actionTypes.OPEN_COMPOSER,
    updateId: post.id,
    editMode: true,
    post,
    profileId,
  }),
};
