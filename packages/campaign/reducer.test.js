import deepFreeze from 'deep-freeze';
import { LOCATION_CHANGE } from 'connected-react-router';
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actionTypes as queueActionTypes } from '@bufferapp/publish-queue/reducer';
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

  it('handles LOCATION_CHANGE action when navigates to scheduled campaigns page', () => {
    const stateBefore = {
      ...initialState,
      page: null,
      isLoading: false,
    };
    const stateAfter = {
      ...initialState,
      page: 'scheduled',
      campaignId: 'id1',
      isLoading: true,
    };
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        location: {
          pathname: '/campaigns/id1/scheduled',
        },
      },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles LOCATION_CHANGE action when navigates to sent campaigns page', () => {
    const stateBefore = {
      ...initialState,
      page: null,
      isLoading: false,
      hideSkeletonHeader: false,
      campaign: {
        id: 'id1',
      },
    };
    const stateAfter = {
      ...initialState,
      page: 'sent',
      campaignId: 'id1',
      campaign: {
        id: 'id1',
      },
      isLoading: true,
      hideSkeletonHeader: true,
    };
    const action = {
      type: LOCATION_CHANGE,
      payload: {
        location: {
          pathname: '/campaigns/id1/sent',
        },
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
      args: {
        fullItems: false,
      },
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

  it('handles pusher PUSHER_CAMPAIGN_UPDATED action', () => {
    const campaign = {
      _id: 'id1',
      color: 'yellow',
      name: 'Test',
      updated_at: 1586224276,
    };
    const stateBefore = {
      ...initialState,
      isLoading: false,
      campaign: campaignParser(campaign),
    };
    const stateAfter = {
      ...initialState,
      isLoading: false,
      campaign: { ...campaignParser(campaign), color: 'green' },
    };

    const action = {
      type: actionTypes.PUSHER_CAMPAIGN_UPDATED,
      campaign: { ...campaign, color: 'green' },
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

  it('handles POST_IMAGE_CLICKED action', () => {
    const stateBefore = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: {} }],
    };
    const stateAfter = {
      ...initialState,
      campaignPosts: [
        { id: 'id1', content: { isLightboxOpen: true, currentImage: 0 } },
      ],
    };
    const action = {
      type: actionTypes.POST_IMAGE_CLICKED,
      updateId: 'id1',
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_IMAGE_CLOSED action', () => {
    const stateBefore = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: {} }],
    };
    const stateAfter = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: { isLightboxOpen: false } }],
    };
    const action = {
      type: actionTypes.POST_IMAGE_CLOSED,
      updateId: 'id1',
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_IMAGE_CLICKED_NEXT action', () => {
    const stateBefore = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: {} }],
    };
    const stateAfter = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: { currentImage: 2 } }],
    };
    const action = {
      type: actionTypes.POST_IMAGE_CLICKED_NEXT,
      updateId: 'id1',
      post: { currentImage: 1 },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_IMAGE_CLICKED_PREV action', () => {
    const stateBefore = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: {} }],
    };
    const stateAfter = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: { currentImage: 1 } }],
    };
    const action = {
      type: actionTypes.POST_IMAGE_CLICKED_PREV,
      updateId: 'id1',
      post: { currentImage: 2 },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_CONFIRMED_DELETE action', () => {
    const stateBefore = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: {} }],
    };
    const stateAfter = {
      ...initialState,
      campaignPosts: [
        { id: 'id1', content: { isConfirmingDelete: false, isDeleting: true } },
      ],
    };
    const action = {
      type: actionTypes.POST_CONFIRMED_DELETE,
      updateId: 'id1',
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles deletePost failed action', () => {
    const stateBefore = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: {} }],
    };
    const stateAfter = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: { isDeleting: false } }],
    };
    const action = {
      type: `deletePost_${dataFetchActionTypes.FETCH_FAIL}`,
      updateId: 'id1',
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_SHARE_NOW action', () => {
    const stateBefore = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: {} }],
    };
    const stateAfter = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: { isWorking: true } }],
    };
    const action = {
      type: actionTypes.POST_SHARE_NOW,
      updateId: 'id1',
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles sharePostNow failed action', () => {
    const stateBefore = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: {} }],
    };
    const stateAfter = {
      ...initialState,
      campaignPosts: [{ id: 'id1', content: { isWorking: false } }],
    };
    const action = {
      type: `sharePostNow_${dataFetchActionTypes.FETCH_FAIL}`,
      updateId: 'id1',
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_CREATED action if post created belongs to the current campaign', () => {
    const stateBefore = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 0, sent: 0 },
      campaignPosts: [
        { id: 'id1', content: { campaignDetails: { id: 'campaignId' } } },
      ],
      page: 'scheduled',
    };
    const stateAfter = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 1, sent: 0 },
      campaignPosts: [
        { id: 'id1', content: { campaignDetails: { id: 'campaignId' } } },
        {
          id: 'id2',
          _id: 'id2',
          dueAt: undefined,
          type: undefined,
          content: { id: 'id2', campaignDetails: { id: 'campaignId' } },
        },
      ],
      page: 'scheduled',
    };
    const action = {
      type: queueActionTypes.POST_CREATED,
      post: { id: 'id2', campaignDetails: { id: 'campaignId' } },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_CREATED action if post created does not belong to the current campaign', () => {
    const stateBefore = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 0, sent: 0 },
      campaignPosts: [
        { id: 'id1', content: { campaignDetails: { id: 'campaignId' } } },
      ],
      page: 'scheduled',
    };
    const stateAfter = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 0, sent: 0 },
      campaignPosts: [
        { id: 'id1', content: { campaignDetails: { id: 'campaignId' } } },
      ],
      page: 'scheduled',
    };
    const action = {
      type: queueActionTypes.POST_CREATED,
      post: { id: 'id2', campaignDetails: { id: 'campaignId2' } },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_UPDATED action if on scheduled tab', () => {
    const stateBefore = {
      ...initialState,
      campaign: { id: 'campaignId' },
      campaignPosts: [
        {
          id: 'id1',
          content: { text: 'Old Post', campaignDetails: { id: 'campaignId' } },
        },
      ],
      page: 'scheduled',
    };
    const stateAfter = {
      ...initialState,
      campaign: { id: 'campaignId' },
      campaignPosts: [
        {
          id: 'id1',
          content: {
            id: 'id1',
            text: 'Post',
            campaignDetails: { id: 'campaignId' },
          },
        },
      ],
      page: 'scheduled',
    };
    const action = {
      type: queueActionTypes.POST_UPDATED,
      post: { id: 'id1', text: 'Post', campaignDetails: { id: 'campaignId' } },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_DELETED action if on scheduled tab', () => {
    const stateBefore = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 1, sent: 0 },
      campaignPosts: [
        { id: 'id1', campaignDetails: { id: 'campaignId' } },
        { id: 'id2', campaignDetails: { id: 'campaignId' } },
      ],
      page: 'scheduled',
    };
    const stateAfter = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 0, sent: 0 },
      campaignPosts: [{ id: 'id1', campaignDetails: { id: 'campaignId' } }],
      page: 'scheduled',
    };
    const action = {
      type: queueActionTypes.POST_DELETED,
      post: { id: 'id2', campaignDetails: { id: 'campaignId' } },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_SENT action if on scheduled tab', () => {
    const stateBefore = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 1, sent: 0 },
      campaignPosts: [
        { id: 'id1', campaignDetails: { id: 'campaignId' } },
        { id: 'id2', campaignDetails: { id: 'campaignId' } },
      ],
      page: 'scheduled',
    };
    const stateAfter = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 0, sent: 1 },
      campaignPosts: [{ id: 'id1', campaignDetails: { id: 'campaignId' } }],
      page: 'scheduled',
    };
    const action = {
      type: queueActionTypes.POST_SENT,
      post: { id: 'id2', campaignDetails: { id: 'campaignId' } },
    };
    deepFreeze(stateBefore);
    deepFreeze(action);
    expect(reducer(stateBefore, action)).toEqual(stateAfter);
  });

  it('handles POST_SENT action if on sent tab', () => {
    const stateBefore = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 1, sent: 0 },
      campaignPosts: [{ id: 'id1', campaignDetails: { id: 'campaignId' } }],
      page: 'sent',
    };
    const stateAfter = {
      ...initialState,
      campaign: { id: 'campaignId', scheduled: 0, sent: 1 },
      campaignPosts: [
        { id: 'id1', campaignDetails: { id: 'campaignId' } },
        {
          id: 'id2',
          _id: 'id2',
          dueAt: undefined,
          type: undefined,
          content: { id: 'id2', campaignDetails: { id: 'campaignId' } },
        },
      ],
      page: 'sent',
    };
    const action = {
      type: queueActionTypes.POST_SENT,
      post: { id: 'id2', campaignDetails: { id: 'campaignId' } },
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
        past: false,
        fullItems: false,
      };
      expect(
        actions.fetchCampaign({ campaignId, past: false, fullItems: false })
      ).toEqual(expectedAction);
    });
    it('creates a OPEN_COMPOSER action', () => {
      const post = { id: 'id1' };
      const profileId = 'id2';
      const expectedAction = {
        type: actionTypes.OPEN_COMPOSER,
        post,
        profileId,
        editMode: true,
        updateId: 'id1',
      };
      expect(
        actions.handleOpenComposer({ post, profileId, editMode: true })
      ).toEqual(expectedAction);
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
    it('creates a POST_CONFIRMED_DELETE action', () => {
      const post = { id: 'id1' };
      const expectedAction = {
        type: actionTypes.POST_CONFIRMED_DELETE,
        updateId: 'id1',
      };
      expect(actions.handleDeleteConfirmClick({ post })).toEqual(
        expectedAction
      );
    });
    it('creates a POST_SHARE_NOW action', () => {
      const post = { id: 'id1' };
      const expectedAction = {
        type: actionTypes.POST_SHARE_NOW,
        updateId: 'id1',
      };
      expect(actions.handleShareNowClick({ post })).toEqual(expectedAction);
    });
    it('creates a POST_IMAGE_CLICKED action', () => {
      const post = { id: 'id1' };
      const profileId = 'id2';
      const expectedAction = {
        type: actionTypes.POST_IMAGE_CLICKED,
        updateId: 'id1',
        post,
        profileId,
      };
      expect(actions.handleImageClick({ post, profileId })).toEqual(
        expectedAction
      );
    });
    it('creates a POST_IMAGE_CLICKED_NEXT action', () => {
      const post = { id: 'id1' };
      const profileId = 'id2';
      const expectedAction = {
        type: actionTypes.POST_IMAGE_CLICKED_NEXT,
        updateId: 'id1',
        post,
        profileId,
      };
      expect(actions.handleImageClickNext({ post, profileId })).toEqual(
        expectedAction
      );
    });
    it('creates a POST_IMAGE_CLICKED_PREV action', () => {
      const post = { id: 'id1' };
      const profileId = 'id2';
      const expectedAction = {
        type: actionTypes.POST_IMAGE_CLICKED_PREV,
        updateId: 'id1',
        post,
        profileId,
      };
      expect(actions.handleImageClickPrev({ post, profileId })).toEqual(
        expectedAction
      );
    });
    it('creates a POST_IMAGE_CLOSED action', () => {
      const post = { id: 'id1' };
      const profileId = 'id2';
      const expectedAction = {
        type: actionTypes.POST_IMAGE_CLOSED,
        updateId: 'id1',
        post,
        profileId,
      };
      expect(actions.handleImageClose({ post, profileId })).toEqual(
        expectedAction
      );
    });
  });
});
