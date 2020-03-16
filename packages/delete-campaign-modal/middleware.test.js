import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import { actions as notificationActions } from '@bufferapp/notifications';
import { actions as modalActions } from '@bufferapp/publish-modals/reducer';
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
      profileSidebar: {
        selectedProfile: {
          organizationId: '123',
        },
      },
    }),
  };
  it('should handle deleteCampaign_FETCH_SUCCESS', () => {
    const action = {
      type: `deleteCampaign_${dataFetchActionTypes.FETCH_SUCCESS}`,
      result: { id: '1234' },
    };
    const expectedObj = {
      campaignId: '1234',
      campaignName: 'Awareness Day',
      campaignColor: 'blue',
      organizationId: '123',
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
  it('should handle deleteCampaign_FETCH_FAIL', () => {
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
});
