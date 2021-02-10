import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import { actions as notificationActions } from '@bufferapp/notifications';
import { actions as modalActions } from '@bufferapp/publish-modals/reducer';
import { actionTypes } from './reducer';
import middleware from './middleware';

jest.mock('@bufferapp/publish-analytics-middleware');
jest.mock('@bufferapp/notifications');
jest.mock('@bufferapp/publish-modals/reducer');

describe('middleware', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: () => ({
      deleteCampaignModal: {
        campaign: {
          id: '1234',
          name: 'Awareness Day',
          color: 'blue',
        },
      },
      router: {
        location: {
          pathname: '/campaigns',
        },
      },
    }),
  };
  it('should hide modal, create success notification and track event if fetch succeeds', () => {
    const action = {
      type: `deleteCampaign_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: { id: '1234' },
    };
    const expectedObj = {
      campaignId: '1234',
      campaignName: 'Awareness Day',
      campaignColor: 'blue'
    };

    middleware(store)(next)(action);

    expect(next).toBeCalledWith(action);

    expect(analyticsActions.trackEvent).toBeCalledWith(
      'Campaign Deleted',
      expectedObj
    );
    expect(modalActions.hideDeleteCampaignModal).toHaveBeenCalled();
    expect(notificationActions.createNotification).toBeCalledWith({
      notificationType: 'success',
      message: 'Your campaign has been deleted!',
    });
  });
  it('should hide modal and display error if fetch fails', () => {
    const action = {
      type: `deleteCampaign_${dataFetchActionTypes.FETCH_FAIL}`,
      error: 'Something went wrong',
    };

    middleware(store)(next)(action);

    expect(next).toBeCalledWith(action);
    expect(modalActions.hideDeleteCampaignModal).toHaveBeenCalled();
    expect(notificationActions.createNotification).toBeCalledWith({
      notificationType: 'error',
      message: action.error,
    });
  });
  it('fetches deleteCampaign when DELETE_CAMPAIGN', () => {
    const action = {
      type: actionTypes.DELETE_CAMPAIGN,
    };
    const campaignId = store.getState().deleteCampaignModal.campaign.id;
    middleware(store)(next)(action);
    expect(next).toBeCalledWith(action);
    expect(store.dispatch).toBeCalledWith(
      dataFetchActions.fetch({
        name: 'deleteCampaign',
        args: { campaignId },
      })
    );
  });
});
