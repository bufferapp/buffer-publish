import { actions as dataFetchActions } from '@bufferapp/async-data-fetch';
import { actionTypes } from './reducer';

export default ({ dispatch }) => next => action => {
  next(action);
  switch (action.type) {
    case 'INIT_PROFILES':
      if (
        typeof window !== 'undefined' &&
        typeof window.bufferData !== 'undefined' &&
        typeof window.bufferData.profiles !== 'undefined' &&
        window.bufferData.profiles
      ) {
        dispatch(
          dataFetchActions.fetchSuccess({
            name: 'profiles',
            result: [...window.bufferData.profiles],
          })
        );
        // make sure we only bootstrap this data once
        window.bufferData.profiles = undefined;
      } else {
        dispatch(
          dataFetchActions.fetch({
            name: 'profiles',
            args: {
              // Passing this prevents the profiles FETCH_SUCCESS from affecting the
              // rest of the publish app.
              forAnalyze: action.forAnalyze || false,
            },
          })
        );
      }
      break;
    case actionTypes.FETCH_SINGLE_PROFILE:
      dispatch(
        dataFetchActions.fetch({
          name: 'singleProfile',
          args: {
            profileId: action.profileId,
          },
        })
      );
      break;
    default:
      break;
  }
};
