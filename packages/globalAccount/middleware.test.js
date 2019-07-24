import { actionTypes as fetchActions } from '@bufferapp/async-data-fetch';
import { actions as analyticsActions } from '@bufferapp/analytics-middleware';

import middleware from './middleware';

describe('middleware', () => {
  const state = {
    globalAccount: {
      _id: 'foo1',
      email: 'foo@buffer.com',
    },
    appSidebar: {
      user: {
        name: 'The Great Foo',
      },
    },
  };

  const store = {
    dispatch: jest.fn(),
    getState: jest.fn(() => state),
  };
  const next = jest.fn();

  it('it should init analytics-middleware on globalAccount_FETCH_SUCCESS', () => {
    analyticsActions.init = jest.fn();

    const action = {
      type: `globalAccount_${fetchActions.FETCH_SUCCESS}`,
    };

    middleware(store)(next)(action);
    expect(analyticsActions.init)
      .toHaveBeenCalledWith('foo1', {
        name: 'The Great Foo',
        email: 'foo@buffer.com',
      });
  });
});
