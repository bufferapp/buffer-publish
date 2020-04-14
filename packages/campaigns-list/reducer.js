import keyWrapper from '@bufferapp/keywrapper';
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actionTypes as campaignActionTypes } from '@bufferapp/publish-campaign';
import { campaignParser } from '@bufferapp/publish-server/parsers/src';
import { sortCampaignsByUpdatedAt } from '@bufferapp/publish-queue/reducer';

export const actionTypes = keyWrapper('CAMPAIGNS_LIST', {
  FETCH_CAMPAIGNS_IF_NEEDED: 0,
});

export const initialState = {
  campaigns: null,
  isLoading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case `getCampaignsList_${dataFetchActionTypes.FETCH_START}`: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case `getCampaignsList_${dataFetchActionTypes.FETCH_FAIL}`: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case `getCampaignsList_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      return {
        ...state,
        campaigns: action.result,
        isLoading: false,
      };
    }
    case campaignActionTypes.PUSHER_CAMPAIGN_CREATED: {
      const parsedCampaign = campaignParser(action.campaign);
      const updatedCampaigns = [...state.campaigns, parsedCampaign];
      return {
        ...state,
        campaigns: sortCampaignsByUpdatedAt(updatedCampaigns),
      };
    }
    case campaignActionTypes.PUSHER_CAMPAIGN_UPDATED: {
      const parsedCampaign = campaignParser(action.campaign);
      const updatedIndex = state.campaigns?.findIndex(
        i => i.id === parsedCampaign.id
      );
      const updatedCampaigns = state.campaigns.map((item, index) =>
        index === updatedIndex ? parsedCampaign : item
      );
      return {
        ...state,
        campaigns: sortCampaignsByUpdatedAt(updatedCampaigns),
      };
    }
    case campaignActionTypes.PUSHER_CAMPAIGN_DELETED: {
      const { campaignId } = action;
      const deletedIndex = state.campaigns?.findIndex(
        item => item.id === campaignId
      );
      const updatedCampaigns = state.campaigns?.filter(
        (_item, index) => index !== deletedIndex
      );
      return {
        ...state,
        campaigns: updatedCampaigns,
      };
    }

    default:
      return state;
  }
};

export const actions = {
  fetchCampaignsIfNeeded: () => ({
    type: actionTypes.FETCH_CAMPAIGNS_IF_NEEDED,
  }),
};
