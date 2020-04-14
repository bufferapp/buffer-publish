import { actions as dataFetchActions } from '@bufferapp/async-data-fetch';
import { actionTypes as notificationActionTypes } from '@bufferapp/notifications';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import middleware from './middleware';
import { actionTypes, initialState } from './reducer';

jest.mock('@bufferapp/publish-analytics-middleware');

describe('middleware', () => {
  const next = jest.fn();

  it('exports middleware', () => {
    expect(middleware).toBeDefined();
  });

  it('fetches getCampaign when FETCH_CAMPAIGN', () => {
    const store = {
      dispatch: jest.fn(),
      getState: () => ({ campaignView: initialState }),
    };
    const action = {
      type: actionTypes.FETCH_CAMPAIGN,
      campaignId: 'id1',
      past: null,
      fullItems: true,
    };
    middleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
    expect(store.dispatch).toBeCalledWith(
      dataFetchActions.fetch({
        name: 'getCampaign',
        args: {
          campaignId: 'id1',
          past: false,
          fullItems: true,
        },
      })
    );
  });
  it('triggers a notification if there is an error fetching campaign', () => {
    const store = {
      dispatch: jest.fn(),
      getState: () => ({ campaignView: initialState }),
    };
    const RPC_NAME = 'getCampaign';
    const action = dataFetchActions.fetchFail({
      name: RPC_NAME,
      error: 'There was an error getting the campaign!',
    });
    middleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
    expect(store.dispatch).toBeCalledWith(
      expect.objectContaining({
        type: notificationActionTypes.CREATE_NOTIFICATION,
        notificationType: 'error',
        message: 'There was an error getting the campaign!',
      })
    );
  });
  it('tracks view report event and redirects to analyze report', () => {
    const hostname = 'publish.local.buffer.com';
    const expectedObj = {
      campaignId: 'id1',
      campaignName: 'Awareness Day',
      organizationId: '123',
    };
    const url = `https://analyze.local.buffer.com/campaigns/${expectedObj.campaignId}`;
    window.location.assign = jest.fn();
    window.location.hostname = hostname;

    const store = {
      dispatch: jest.fn(),
      getState: () => ({
        campaignView: initialState,
        profileSidebar: {
          selectedProfile: {
            organizationId: '123',
          },
        },
      }),
    };
    const action = {
      type: actionTypes.GO_TO_ANALYZE_REPORT,
      campaign: { id: 'id1', name: 'Awareness Day' },
    };

    middleware(store)(next)(action);

    expect(next).toBeCalledWith(action);

    expect(analyticsActions.trackEvent).toBeCalledWith(
      'Campaign Report Viewed',
      expectedObj
    );
    expect(window.location.assign).toHaveBeenCalledWith(url);
    window.location.assign.mockRestore();
  });
});
