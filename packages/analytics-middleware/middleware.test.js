import './analytics.mock';
import { actionTypes } from './actions';
import middleware from './middleware';

const state = {
};

describe('middleware', () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: jest.fn(() => state),
  };

  global.PRODUCT_TRACKING_KEY = 'publish';

  afterEach(() => jest.clearAllMocks());

  it('should exist', () => {
    expect(middleware).toBeDefined();
  });

  it('should keep propagating the action through the chain', () => {
    const action = {
      type: 'TEST',
    };
    middleware(store)(next)(action);
  });

  it(`On ${actionTypes.INIT} should identify user on segment`, () => {
    const action = {
      type: actionTypes.INIT,
      userId: 'foo1',
      payload: {
        email: 'foo@buffer.com',
        organizationId: 'org1',
      },
    };
    middleware(store)(next)(action);
    expect(window.analytics.identify)
      .toHaveBeenCalledWith(action.userId, action.payload);
  });

  it(`On ${actionTypes.TRACK_EVENT} should push an event to segment`, () => {
    const action = {
      type: actionTypes.TRACK_EVENT,
      eventName: 'event foo',
      payload: {
        bar: 'bar',
      },
    };
    middleware(store)(next)(action);
    expect(window.analytics.track)
      .toHaveBeenCalledWith(action.eventName, {
        bar: 'bar',
        product: 'publish',
      });
  });

  it(`On ${actionTypes.PUBLISH_PAGE_CHANGE} should push a page change to segment`, () => {
    const action = {
      type: actionTypes.PUBLISH_PAGE_CHANGE,
      pageName: 'page foo',
      payload: {
        bar: 'bar',
      },
    };
    middleware(store)(next)(action);
    expect(window.analytics.page)
      .toHaveBeenCalledWith(action.pageName, {
        bar: 'bar',
        product: 'publish',
      });
  });
});
