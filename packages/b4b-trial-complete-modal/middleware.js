import { trackAction } from '@bufferapp/publish-data-tracking';
import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';
import { actions as notificationActions } from '@bufferapp/notifications';
import { actions as modalActions } from '@bufferapp/publish-modals';
import { actionTypes } from './reducer';

export default ({ getState, dispatch }) => next => (action) => { // eslint-disable-line
  const source = getState().b4bTrialComplete.source;

  next(action);

  switch (action.type) {
    case actionTypes.CANCEL_TRIAL: {
      dispatch(dataFetchActions.fetch({ name: 'cancelTrial' }));
      dispatch(modalActions.hideUpgradeB4BModal());
      trackAction({
        location: 'MODALS',
        action: 'cancel_expired_b4b_trial',
        metadata: { source },
      });
      break;
    }
    case `cancelTrial_${dataFetchActionTypes.FETCH_FAIL}`: {
      dispatch(notificationActions.createNotification({
        notificationType: 'error',
        message: action.error,
      }));
      break;
    }
    default:
      break;
  }
};
