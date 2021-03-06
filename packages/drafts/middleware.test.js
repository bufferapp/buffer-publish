import { actionTypes as notificationActionTypes } from '@bufferapp/notifications';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import { actions as dataFetchActions } from '@bufferapp/async-data-fetch';
import { actionTypes } from './reducer';
import middleware from './middleware';

describe('middleware', () => {
  let next;
  let dispatch;

  beforeEach(() => {
    next = jest.fn();
    dispatch = jest.fn();
  });

  const state = {
    profileSidebar: {
      selectedProfileId: 'id1',
      selectedProfile: {
        service_type: 'personal_profile',
        service: 'twitter',
        id: 'bar',
        serviceId: 'foo123',
      },
    },
    profile: {
      id: 'id1',
    },
    router: {
      location: { pathname: '/preferences/test' },
    },
  };
  const getState = jest.fn(() => state);

  it('should export middleware', () => {
    expect(middleware).toBeDefined();
  });

  it('should fetch deletePost', () => {
    const action = {
      type: actionTypes.DRAFT_CONFIRMED_DELETE,
      updateId: 'updateId1',
    };
    middleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledWith(action);
    expect(dispatch).toBeCalledWith(
      dataFetchActions.fetch({
        name: 'deletePost',
        args: {
          updateId: action.updateId,
        },
      })
    );
  });

  it('should fetch approveDraft', () => {
    const action = {
      type: actionTypes.DRAFT_APPROVE,
      updateId: 'updateId1',
    };
    middleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledWith(action);
    expect(dispatch).toBeCalledWith(
      dataFetchActions.fetch({
        name: 'approveDraft',
        args: {
          updateId: action.updateId,
        },
      })
    );
  });

  it('should fetch changeDraftStatus', () => {
    const action = {
      type: actionTypes.DRAFT_NEEDS_APPROVAL,
      needsApproval: true,
      updateId: 'updateId1',
    };
    middleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledWith(action);
    expect(dispatch).toBeCalledWith(
      dataFetchActions.fetch({
        name: 'changeDraftStatus',
        args: {
          updateId: action.updateId,
          needsApproval: action.needsApproval,
        },
      })
    );
  });

  it('should trigger a notification if draft is successfully approved', () => {
    const RPC_NAME = 'approveDraft';
    const action = dataFetchActions.fetchSuccess({
      name: RPC_NAME,
      result: { update: {}, draft: {} },
    });
    middleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledWith(action);
    expect(dispatch).toBeCalledWith(
      expect.objectContaining({
        type: notificationActionTypes.CREATE_NOTIFICATION,
        notificationType: 'success',
        message: "We've added this draft to your queue!",
      })
    );
  });

  it('should trigger a notification if draft is successfully moved', () => {
    const RPC_NAME = 'changeDraftStatus';
    const action = dataFetchActions.fetchSuccess({
      name: RPC_NAME,
      result: { update: {}, draft: {} },
    });
    middleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledWith(action);
    expect(dispatch).toBeCalledWith(
      expect.objectContaining({
        type: notificationActionTypes.CREATE_NOTIFICATION,
        notificationType: 'success',
        message: "We've successfully moved this draft!",
      })
    );
  });

  it('should trigger a notification if there is an error approving the draft', () => {
    const RPC_NAME = 'approveDraft';
    const action = dataFetchActions.fetchFail({
      name: RPC_NAME,
    });
    middleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledWith(action);
    expect(dispatch).toBeCalledWith(
      expect.objectContaining({
        type: notificationActionTypes.CREATE_NOTIFICATION,
        notificationType: 'error',
        message: 'There was an error adding this draft to your queue!',
      })
    );
  });

  it('should trigger a notification if there is an error moving the draft', () => {
    const RPC_NAME = 'changeDraftStatus';
    const action = dataFetchActions.fetchFail({
      name: RPC_NAME,
    });
    middleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledWith(action);
    expect(dispatch).toBeCalledWith(
      expect.objectContaining({
        type: notificationActionTypes.CREATE_NOTIFICATION,
        notificationType: 'error',
        message: 'There was an error moving this draft!',
      })
    );
  });
  describe('segment tracking', () => {
    const expectedTrackingObj = {
      postId: 'foo',
      channelId: 'bar',
      mediaType: 'text',
      channelType: 'personal_profile',
      channel: 'twitter',
      channelServiceId: 'foo123',
    };
    it('it should track analytics-middleware on changeDraftStatus_FETCH_SUCCESS move to approval', () => {
      analyticsActions.trackEvent = jest.fn();
      const RPC_NAME = 'changeDraftStatus';
      const action = dataFetchActions.fetchSuccess({
        name: RPC_NAME,
        result: {
          update: {},
          draft: { needs_approval: true, id: 'foo', type: 'text' },
        },
      });

      middleware({ dispatch, getState })(next)(action);
      expect(analyticsActions.trackEvent).toHaveBeenCalledWith(
        'Draft Submitted',
        expectedTrackingObj
      );
    });
    it('it should track analytics-middleware on draft rejected', () => {
      analyticsActions.trackEvent = jest.fn();
      const RPC_NAME = 'changeDraftStatus';
      const action = dataFetchActions.fetchSuccess({
        name: RPC_NAME,
        result: {
          update: {},
          draft: { needs_approval: false, id: 'foo', type: 'text' },
        },
      });

      middleware({ dispatch, getState })(next)(action);
      expect(analyticsActions.trackEvent).toHaveBeenCalledWith(
        'Draft Rejected',
        expectedTrackingObj
      );
    });

    it('it should track analytics-middleware on deletePost', () => {
      analyticsActions.trackEvent = jest.fn();
      const action = {
        type: actionTypes.DRAFT_CONFIRMED_DELETE,
        updateId: 'updateId1',
        draft: { id: 'foo', type: 'text' },
      };
      middleware({ dispatch, getState })(next)(action);
      expect(analyticsActions.trackEvent).toHaveBeenCalledWith(
        'Draft Deleted',
        expectedTrackingObj
      );
    });

    it('it should track analytics-middleware on approveDraft', () => {
      analyticsActions.trackEvent = jest.fn();
      const RPC_NAME = 'approveDraft';
      const action = dataFetchActions.fetchSuccess({
        name: RPC_NAME,
        result: {
          update: { id: 'foo', type: 'text' },
        },
      });

      middleware({ dispatch, getState })(next)(action);
      expect(analyticsActions.trackEvent).toHaveBeenCalledWith(
        'Draft Approved',
        expectedTrackingObj
      );
    });
  });

  describe('counters', () => {
    it('updates drafts counter when DRAFT_CREATED', () => {
      const fakeState = () => ({
        profileSidebar: {
          selectedProfileId: 'id',
        },
      });
      const action = {
        type: actionTypes.DRAFT_CREATED,
        draft: {
          needsApproval: false,
        },
        profileId: 'id',
      };

      middleware({ dispatch, getState: fakeState })(next)(action);
      expect(next).toBeCalledWith(action);
      expect(dispatch).toBeCalledWith(
        dataFetchActions.fetch({
          name: 'getCounts',
          args: {
            profileId: 'id',
          },
        })
      );
    });

    it('updates drafts counter when DRAFT_DELETED', () => {
      const fakeState = () => ({
        profileSidebar: {
          selectedProfileId: 'id',
        },
      });
      const action = {
        type: actionTypes.DRAFT_DELETED,
        draft: {
          needsApproval: false,
        },
        profileId: 'id',
      };

      middleware({ dispatch, getState: fakeState })(next)(action);
      expect(next).toBeCalledWith(action);
      expect(dispatch).toBeCalledWith(
        dataFetchActions.fetch({
          name: 'getCounts',
          args: {
            profileId: 'id',
          },
        })
      );
    });

    it('updates drafts counter when DRAFT_APPROVED', () => {
      const fakeState = () => ({
        profileSidebar: {
          selectedProfileId: 'id',
        },
      });
      const action = {
        type: actionTypes.DRAFT_APPROVED,
        draft: {
          needsApproval: true,
        },
        profileId: 'id',
      };

      middleware({ dispatch, getState: fakeState })(next)(action);
      expect(next).toBeCalledWith(action);
      expect(dispatch).toBeCalledWith(
        dataFetchActions.fetch({
          name: 'getCounts',
          args: {
            profileId: 'id',
          },
        })
      );
    });

    it('updates drafts counter when DRAFT_MOVED', () => {
      const fakeState = () => ({
        profileSidebar: {
          selectedProfileId: 'id',
        },
      });
      const action = {
        type: actionTypes.DRAFT_MOVED,
        draft: {
          needsApproval: false,
        },
        profileId: 'id',
      };

      middleware({ dispatch, getState: fakeState })(next)(action);
      expect(next).toBeCalledWith(action);
      expect(dispatch).toBeCalledWith(
        dataFetchActions.fetch({
          name: 'getCounts',
          args: {
            profileId: 'id',
          },
        })
      );
    });

    it('does not update drafts counter if draft profile Id is not the same as the selected profile', () => {
      const fakeState = () => ({
        profileSidebar: {
          selectedProfileId: 'id1',
        },
      });
      const action = {
        type: actionTypes.DRAFT_CREATED,
        draft: {
          needsApproval: false,
        },
        profileId: 'id',
      };

      middleware({ dispatch, getState: fakeState })(next)(action);
      expect(next).toBeCalledWith(action);
      expect(dispatch).not.toBeCalledWith(
        dataFetchActions.fetch({
          name: 'getCounts',
          args: {
            profileId: 'id',
          },
        })
      );
    });
  });
});
