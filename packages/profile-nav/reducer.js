import { LOCATION_CHANGE } from 'connected-react-router';
import keyWrapper from '@bufferapp/keywrapper';
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { getProfilesParams } from '@bufferapp/publish-routes';
import generateProfileTabs from './utils';

export const actionTypes = keyWrapper('PROFILE_NAV', {
  GENERATE_PROFILE_TABS: 0,
});

export const initialState = {
  profileNavTabs: [],
  draftsNeedApprovalCount: 0,
  draftsCount: 0,
  selectedTabId: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GENERATE_PROFILE_TABS: {
      const { profile, organization } = action;
      return {
        ...state,
        profileNavTabs: generateProfileTabs({ profile, organization }),
      };
    }

    case LOCATION_CHANGE: {
      const { pathname } = action.payload.location || {};
      const { tabId } = getProfilesParams({ pathname }) || {};
      return {
        ...state,
        selectedTabId: tabId,
      };
    }

    case `getCounts_${dataFetchActionTypes.FETCH_START}`: {
      return {
        ...state,
        draftsNeedApprovalCount: 0,
        draftsCount: 0,
      };
    }

    case `getCounts_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      return {
        ...state,
        draftsNeedApprovalCount:
          action.result.counts.drafts_needs_approval_true,
        draftsCount:
          action.result.counts.drafts_needs_approval_false ||
          action.result.counts.drafts,
      };
    }

    default:
      return state;
  }
};

export const actions = {
  generateProfileTabs: ({ profile, organization }) => ({
    type: actionTypes.GENERATE_PROFILE_TABS,
    profile,
    organization,
  }),
};
