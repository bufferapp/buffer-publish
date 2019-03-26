import { actionTypes as profileActionTypes } from '@bufferapp/publish-profile-sidebar';
import {
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';
import middleware from './middleware';

describe('middleware', () => {
  const next = jest.fn();
  const dispatch = jest.fn();
  it('should export middleware', () => {
    expect(middleware)
      .toBeDefined();
  });

  it('should fetch sentPosts', () => {
    const action = {
      type: profileActionTypes.SELECT_PROFILE,
      profile: {
        id: 'id1',
      },
    };
    middleware({ dispatch })(next)(action);
    expect(next)
    .toBeCalledWith(action);
    expect(dispatch)
    .toBeCalledWith(dataFetchActions.fetch({
      name: 'sentPosts',
      args: {
        profileId: action.profile.id,
        isFetchingMore: false,
      },
    }));
  });
});
