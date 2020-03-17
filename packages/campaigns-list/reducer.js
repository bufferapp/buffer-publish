import keyWrapper from '@bufferapp/keywrapper';
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';

export const actionTypes = keyWrapper('CAMPAIGNS_LIST', {
  FETCH_CAMPAIGNS: 0,
});

export const initialState = {
  campaigns: [],
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

    default:
      return state;
  }
};

export const actions = {
  fetchCampaigns: () => ({
    type: actionTypes.FETCH_CAMPAIGNS,
  }),
};
