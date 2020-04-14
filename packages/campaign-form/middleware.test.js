import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import middleware from './middleware';
import { initialState } from './reducer';

jest.mock('@bufferapp/publish-analytics-middleware');

describe('middleware', () => {
  const next = jest.fn();

  it('exports middleware', () => {
    expect(middleware).toBeDefined();
  });

  describe('tracking', () => {
    const store = {
      dispatch: jest.fn(),
      getState: () => initialState,
    };

    const expectedObj = {
      campaignId: 'id1',
      campaignName: 'Awareness Day',
      organizationId: '123',
      campaignColor: 'blue',
    };

    const result = {
      id: 'id1',
      name: 'Awareness Day',
      globalOrganizationId: '123',
      color: 'blue',
    };

    it('tracks edit campaign event', () => {
      const action = {
        type: `updateCampaign_${dataFetchActionTypes.FETCH_SUCCESS}`,
        result,
      };

      middleware(store)(next)(action);
      expect(next).toBeCalledWith(action);
      expect(analyticsActions.trackEvent).toBeCalledWith(
        'Campaign Edited',
        expectedObj
      );
    });
    it('tracks create campaign event', () => {
      const action = {
        type: `createCampaign_${dataFetchActionTypes.FETCH_SUCCESS}`,
        result,
      };

      middleware(store)(next)(action);
      expect(next).toBeCalledWith(action);
      expect(analyticsActions.trackEvent).toBeCalledWith(
        'Campaign Created',
        expectedObj
      );
    });
  });
});
