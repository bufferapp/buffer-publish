import keyWrapper from '@bufferapp/keywrapper';
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';

export const actionTypes = keyWrapper('CAMPAIGN_FORM', {
  CREATE_CAMPAIGN: 0,
  EDIT_CAMPAIGN: 0,
});

export const initialState = {
  campaign: {},
  isLoading: false,
  campaignId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case `createCampaign_${dataFetchActionTypes.FETCH_START}`: {
      return {
        ...state,
        isLoading: true,
      };
    }

    case `createCampaign_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `getCampaign_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      return {
        ...state,
        campaign: action.result,
        campaignId: action.result.id,
        isLoading: false,
      };
    }

    case `createCampaign_${dataFetchActionTypes.FETCH_FAIL}`:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const actions = {
  handleCreateCampaignClick: ({ name, color }) => ({
    type: actionTypes.CREATE_CAMPAIGN,
    name,
    color,
  }),
  handleEditCampaignClick: ({ id, name, color, orgId }) => ({
    type: actionTypes.EDIT_CAMPAIGN,
    id,
    name,
    color,
    orgId,
  }),
};
