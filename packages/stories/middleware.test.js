import { actionTypes as profileActionTypes } from '@bufferapp/publish-profile-sidebar';
import { actions as dataFetchActions } from '@bufferapp/async-data-fetch';
import middleware from './middleware';

const getStateWithPaidUser = () => ({
  appSidebar: {
    user: {
      is_free_user: false,
    },
  },
});

describe('middleware', () => {
  const next = jest.fn();
  const dispatch = jest.fn();

  it('should export middleware', () => {
    expect(middleware)
      .toBeDefined();
  });

  it('should fetch storiesPosts', () => {
    const action = {
      type: profileActionTypes.SELECT_PROFILE,
      profile: {
        id: 'id1',
      },
    };
    middleware({ dispatch, getState: getStateWithPaidUser })(next)(action);
    expect(next)
      .toBeCalledWith(action);
    expect(dispatch)
      .toBeCalledWith(dataFetchActions.fetch({
        name: 'storiesPosts',
        args: {
          profileId: action.profile.id,
          isFetchingMore: false,
          count: 300,
        },
      }));
  });
});
