import deepFreeze from 'deep-freeze';
import { actionTypes as campaignActionTypes } from '@bufferapp/publish-campaign';
import { campaignParser } from '@bufferapp/publish-server/parsers/src';
import reducer, { actions, initialState, actionTypes } from './reducer';

describe('reducer', () => {
  // Tests the default case in the reducer switch statement
  it('should initialize default state', () => {
    const action = {
      type: '',
    };
    // Protects state and actions from mutation
    deepFreeze(initialState);
    deepFreeze(action);

    // When state is undefined, it's supposed to return initial state
    expect(reducer(undefined, action)).toEqual(initialState);
  });

  it('handles getCampaignsList_FETCH_START action', () => {
    const stateBefore = {
      ...initialState,
      isLoading: false,
    };
    const stateAfter = {
      ...initialState,
      isLoading: true,
    };
    const action = {
      type: 'getCampaignsList_FETCH_START',
      args: {},
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles getCampaignsList_FETCH_FAIL action', () => {
    const stateBefore = {
      ...initialState,
      isLoading: true,
    };
    const stateAfter = {
      ...initialState,
      isLoading: false,
    };
    const action = {
      type: 'getCampaignsList_FETCH_FAIL',
      args: {},
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles getCampaignsList_FETCH_SUCCESS action', () => {
    const stateBefore = {
      ...initialState,
      isLoading: true,
      campaigns: [],
    };
    const stateAfter = {
      ...initialState,
      isLoading: false,
      campaigns: [],
    };
    const action = {
      type: 'getCampaignsList_FETCH_SUCCESS',
      result: [],
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  describe('campaign pusher events', () => {
    const campaign = campaignParser({
      _id: '123',
      color: 'yellow',
      name: 'Test',
      global_organization_id: '321',
      updated_at: 1586224276,
    });
    const recentlyUpdatedCampaign = {
      _id: '1234',
      color: 'blue',
      name: 'A campaign recently updated',
      global_organization_id: '654',
      updated_at: 1586269886,
    };

    it('handles PUSHER_CAMPAIGN_CREATED action', () => {
      const stateBefore = {
        ...initialState,
        isLoading: false,
        campaigns: [],
      };
      const stateAfter = {
        ...initialState,
        isLoading: false,
        campaigns: [campaignParser(recentlyUpdatedCampaign)],
      };
      const action = {
        type: campaignActionTypes.PUSHER_CAMPAIGN_CREATED,
        campaign: recentlyUpdatedCampaign,
      };
      deepFreeze(stateBefore);
      deepFreeze(action);
      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

    it('sorts campaigns by updatedAt in PUSHER_CAMPAIGN_CREATED action', () => {
      const stateBefore = {
        ...initialState,
        isLoading: false,
        campaigns: [campaign],
      };
      const stateAfter = {
        ...initialState,
        isLoading: false,
        campaigns: [campaignParser(recentlyUpdatedCampaign), campaign],
      };
      const action = {
        type: campaignActionTypes.PUSHER_CAMPAIGN_CREATED,
        campaign: recentlyUpdatedCampaign,
      };
      deepFreeze(stateBefore);
      deepFreeze(action);
      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

    it('handles PUSHER_CAMPAIGN_UPDATED action', () => {
      const stateBefore = {
        ...initialState,
        isLoading: false,
        campaigns: [campaignParser(recentlyUpdatedCampaign)],
      };
      const stateAfter = {
        ...initialState,
        isLoading: false,
        campaigns: [
          campaignParser({ ...recentlyUpdatedCampaign, color: 'green' }),
        ],
      };
      const action = {
        type: campaignActionTypes.PUSHER_CAMPAIGN_UPDATED,
        campaign: { ...recentlyUpdatedCampaign, color: 'green' },
      };
      deepFreeze(stateBefore);
      deepFreeze(action);
      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });

    it('handles PUSHER_CAMPAIGN_DELETED action', () => {
      const stateBefore = {
        ...initialState,
        isLoading: false,
        campaigns: [campaign, campaignParser(recentlyUpdatedCampaign)],
      };
      const stateAfter = {
        ...initialState,
        isLoading: false,
        campaigns: [campaign],
      };
      const action = {
        type: campaignActionTypes.PUSHER_CAMPAIGN_DELETED,
        campaignId: '1234',
      };
      deepFreeze(stateBefore);
      deepFreeze(action);
      expect(reducer(stateBefore, action)).toEqual(stateAfter);
    });
  });

  // Test action creators:
  describe('action creators', () => {
    it('creates a FETCH_CAMPAIGNS_IF_NEEDED action', () => {
      const expectedAction = {
        type: actionTypes.FETCH_CAMPAIGNS_IF_NEEDED,
      };
      expect(actions.fetchCampaignsIfNeeded()).toEqual(expectedAction);
    });
  });
});
