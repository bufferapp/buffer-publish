import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@bufferapp/async-data-fetch';
import { actionTypes as orgActionTypes } from '@bufferapp/publish-data-organizations';
import { actions as notificationActions } from '@bufferapp/notifications/lib/';
import { AppHooks } from '@bufferapp/publish-composer/composer/utils/LifecycleHooks';
import { actionTypes } from './reducer';

export default ({ dispatch, getState }) => next => action => {
  next(action);
  switch (action.type) {
    case actionTypes.START_PRO_TRIAL:
      dispatch(
        dataFetchActions.fetch({
          name: 'startTrial',
          args: {
            source: action.source,
            plan: 'pro',
          },
        })
      );
      break;
    case `startTrial_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      dispatch(
        notificationActions.createNotification({
          notificationType: 'success',
          message: 'Awesome! You’re now starting your free 7-day Pro trial',
        })
      );
      dispatch({ type: 'INIT_ORGANIZATIONS' });
      dispatch({ type: 'INIT_PROFILES' });

      if (action.source === 'ig_first_comment') {
        const {
          thirdparty: {
            appCues: { loaded: appCuesLoaded },
          },
        } = getState();

        if (appCuesLoaded && window && window.Appcues) {
          window.Appcues.track('Started a trial via First Comment');
        }
      }
      break;
    }

    case `startTrial_${dataFetchActionTypes.FETCH_FAIL}`:
      dispatch(
        notificationActions.createNotification({
          notificationType: 'error',
          message:
            'Uh oh, something went wrong. Please get in touch if this problem persists.',
        })
      );
      break;
    case orgActionTypes.ORGANIZATION_SELECTED: {
      const state = getState();
      // only reset composer organnizations Data if the user just started a trial
      if (state.trial.startedTrial) {
        const { organizations } = state;
        AppHooks.handleStartTrial({
          message: organizations,
          removeScope: state.trial.scope,
        });
      }

      dispatch({ type: actionTypes.CLEAR_SCOPE });
      break;
    }
    default:
      break;
  }
};
