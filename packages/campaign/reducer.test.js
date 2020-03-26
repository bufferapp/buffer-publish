import deepFreeze from 'deep-freeze';
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

  it('handles getCampaign_FETCH_START action', () => {
    const stateBefore = {
      ...initialState,
      isLoading: false,
    };
    const stateAfter = {
      ...initialState,
      isLoading: true,
    };
    const action = {
      type: 'getCampaign_FETCH_START',
      args: {
        campaignId: 'id1',
      },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles getCampaign_FETCH_FAIL action', () => {
    const stateBefore = {
      ...initialState,
      isLoading: true,
    };
    const stateAfter = {
      ...initialState,
      isLoading: false,
    };
    const action = {
      type: 'getCampaign_FETCH_FAIL',
      args: {
        campaignId: 'id1',
      },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles getCampaign_FETCH_SUCCESS action', () => {
    const stateBefore = {
      ...initialState,
      isLoading: true,
      campaign: {},
      campaignId: null,
    };
    const stateAfter = {
      ...initialState,
      isLoading: false,
      campaign: { id: 'id1', name: 'campaignA', color: '#fff' },
      campaignId: 'id1',
    };
    const action = {
      type: 'getCampaign_FETCH_SUCCESS',
      result: {
        id: 'id1',
        name: 'campaignA',
        color: '#fff',
      },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles OPEN_COMPOSER action', () => {
    const stateBefore = {
      ...initialState,
      showComposer: false,
    };
    const stateAfter = {
      ...initialState,
      showComposer: true,
    };
    const action = {
      type: actionTypes.OPEN_COMPOSER,
      args: {
        campaignId: 'id1',
      },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles CLOSE_COMPOSER action', () => {
    const stateBefore = {
      ...initialState,
      showComposer: true,
    };
    const stateAfter = {
      ...initialState,
      showComposer: false,
    };
    const action = {
      type: actionTypes.CLOSE_COMPOSER,
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  // Test action creators:
  describe('action creators', () => {
    it('creates a FETCH_CAMPAIGN action', () => {
      const campaignId = 'id2';
      const expectedAction = {
        type: actionTypes.FETCH_CAMPAIGN,
        campaignId: 'id2',
      };
      expect(actions.fetchCampaign({ campaignId })).toEqual(expectedAction);
    });
    it('creates a OPEN_COMPOSER action', () => {
      const campaignId = 'id2';
      const expectedAction = {
        type: actionTypes.OPEN_COMPOSER,
        campaignId: 'id2',
      };
      expect(actions.handleOpenComposer(campaignId)).toEqual(expectedAction);
    });
    it('creates a CLOSE_COMPOSER action', () => {
      const expectedAction = {
        type: actionTypes.CLOSE_COMPOSER,
      };
      expect(actions.handleCloseComposer()).toEqual(expectedAction);
    });
    it('creates a GO_TO_ANALYZE_REPORT action', () => {
      const campaign = {};
      const expectedAction = {
        type: actionTypes.GO_TO_ANALYZE_REPORT,
        campaign,
      };
      expect(actions.goToAnalyzeReport(campaign)).toEqual(expectedAction);
    });
  });
});
