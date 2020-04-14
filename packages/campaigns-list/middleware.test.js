import { actions as dataFetchActions } from '@bufferapp/async-data-fetch';
import { actionTypes as notificationActionTypes } from '@bufferapp/notifications';
import middleware from './middleware';
import { actionTypes, initialState } from './reducer';

describe('middleware', () => {
  const next = jest.fn();

  it('exports middleware', () => {
    expect(middleware).toBeDefined();
  });

  it('fetches getCampaignsList if campaign list state is null', () => {
    const store = {
      dispatch: jest.fn(),
      getState: () => ({
        campaignsList: initialState,
        appSidebar: { user: { features: ['campaigns'] } },
      }),
    };
    const action = {
      type: actionTypes.FETCH_CAMPAIGNS_IF_NEEDED,
    };
    middleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
    expect(store.dispatch).toBeCalledWith(
      dataFetchActions.fetch({
        name: 'getCampaignsList',
        args: {},
      })
    );
  });

  it('does not fetch campaigns if user has no campaign feature', () => {
    const store = {
      dispatch: jest.fn(),
      getState: () => ({
        campaignsList: { initialState },
        appSidebar: { user: { features: [] } },
      }),
    };
    const action = {
      type: actionTypes.FETCH_CAMPAIGNS_IF_NEEDED,
    };
    middleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
    expect(store.dispatch).not.toBeCalledWith(
      dataFetchActions.fetch({
        name: 'getCampaignsList',
        args: {},
      })
    );
  });
  it('does not fetch campaigns if campaigns is already in campaignsList state', () => {
    const store = {
      dispatch: jest.fn(),
      getState: () => ({
        campaignsList: { ...initialState, campaigns: [] },
        appSidebar: { user: { features: ['campaigns'] } },
      }),
    };
    const action = {
      type: actionTypes.FETCH_CAMPAIGNS_IF_NEEDED,
    };
    middleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
    expect(store.dispatch).not.toBeCalledWith(
      dataFetchActions.fetch({
        name: 'getCampaignsList',
        args: {},
      })
    );
  });
  it('triggers a notification if there is an error fetching campaigns', () => {
    const store = {
      dispatch: jest.fn(),
      getState: () => ({ campaignsList: initialState }),
    };
    const RPC_NAME = 'getCampaignsList';
    const action = dataFetchActions.fetchFail({
      name: RPC_NAME,
      error: 'There was an error getting the campaigns!',
    });
    middleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
    expect(store.dispatch).toBeCalledWith(
      expect.objectContaining({
        type: notificationActionTypes.CREATE_NOTIFICATION,
        notificationType: 'error',
        message: 'There was an error getting the campaigns!',
      })
    );
  });
});
