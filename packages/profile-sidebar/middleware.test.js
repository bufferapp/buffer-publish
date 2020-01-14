import { actionTypes as tabsActionTypes } from '@bufferapp/publish-tabs';
import { actions as dataFetchActions } from '@bufferapp/async-data-fetch';
import { actionTypes } from './reducer';
import middleware from './middleware';

describe('middleware', () => {
  const state = {
    profileSidebar: {
      loading: false,
      profiles: [
        {
          id: '1234',
          username: 'profile1',
        },
        {
          id: '12345',
          username: 'profile2',
        },
      ],
      isOnBusinessTrial: false,
      selectedProfileId: '1234',
    },
    tabs: {
      tabId: 'drafts',
    },
    router: {
      location: { pathname: '/profile/1234/tab/drafts' },
    },
  };
  const getState = jest.fn(() => state);

  it('should export middleware', () => {
    expect(middleware).toBeDefined();
  });

  it('should select a profile and a tab when PROFILE_ROUTE_LOADED', () => {
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: actionTypes.PROFILE_ROUTE_LOADED,
      selectedProfile: {
        id: 'id1',
      },
      tabId: 'queue',
    };

    const selectProfileAction = {
      type: actionTypes.SELECT_PROFILE,
      profile: {
        id: 'id1',
      },
      profileId: 'id1',
    };

    const selectTabAction = {
      type: tabsActionTypes.SELECT_TAB,
      tabId: 'queue',
      profileId: 'id1',
    };

    middleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledWith(action);
    expect(dispatch).toBeCalledWith(selectProfileAction);
    expect(dispatch).toBeCalledWith(selectTabAction);
  });

  it('reorders profiles when PROFILE_DROPPED', () => {
    const next = jest.fn();
    const dispatch = jest.fn();
    const action = {
      type: actionTypes.PROFILE_DROPPED,
      commit: true,
    };

    middleware({ dispatch, getState })(next)(action);
    expect(next).toBeCalledWith(action);
    expect(dispatch).toBeCalledWith(
      dataFetchActions.fetch({
        name: 'reorderProfiles',
        args: {
          order: ['1234', '12345'],
        },
      })
    );
  });
});
