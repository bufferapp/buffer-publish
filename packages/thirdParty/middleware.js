import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';
import { actionTypes } from './reducer';

const checkExtensionInstalled = () => {
  /**
   * We place this marker in the DOM (server/index.html) and the Buffer Extension
   * will add it's version to it with a data-attribute when present. 👌
   */
  const markerEl = document.querySelector('#browser-extension-marker');
  const version = markerEl.getAttribute('data-version');
  return !!version;
};

export default ({ dispatch, getState }) => next => (action) => {
  next(action);
  switch (action.type) {
    case 'APP_INIT':
      dispatch(dataFetchActions.fetch({ name: 'intercom' }));
      break;

    case `user_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch({ type: actionTypes.FULLSTORY, result: action.result });
      dispatch({ type: actionTypes.APPCUES, result: action.result });
      break;

    case `intercom_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      const intercomUser = action.result;
      if (window && window.Intercom) {
        dispatch({
          type: actionTypes.INTERCOM_LOADED,
          loaded: true,
        });
        const extensionInstalled = checkExtensionInstalled();
        window.Intercom('boot', {
          ...intercomUser,
          extension_installed: extensionInstalled,
        });
      }
      break;
    }
    case actionTypes.FULLSTORY:
      if (window) {
        if (window.FS && window.FS.identify) {
          const { id } = action.result;
          const {
            productFeatures: { planName },
          } = getState();
          window.FS.identify(id, {
            pricingPlan_str: planName,
          });
        }
      }
      break;
    case actionTypes.APPCUES:
      if (window) {
        if (window.Appcues) {
          const {
            id,
            createdAt,
            plan,
            planCode,
            trial,
            orgUserCount,
            is_business_user: isBusinessUser,
          } = action.result;

          if (isBusinessUser) {
            dispatch({
              type: actionTypes.APPCUES_LOADED,
              loaded: true,
            });
            window.Appcues.identify(id, {
              name: id, // current user's name
              createdAt, // Unix timestamp of user signup date
              plan, // Current user’s plan type
              planCode, // Current user’s plan tier
              onTrial: trial.onTrial,
              trialLength: trial.trialLength,
              trialTimeRemaining: trial.trialTimeRemaining,
              orgUserCount, // Number of users (including the account owner)
            });
          }
        }
      }
      break;
    case 'COMPOSER_EVENT': {
      const {
        thirdparty: {
          appCues: { loaded: appCuesLoaded },
        },
      } = getState();
      if (appCuesLoaded && window && window.Appcues) {
        // this event is emitted from the composer when they create an update
        if (action.eventType === 'saved-drafts') {
          window.Appcues.track('Created Post');
        }
      }
      break;
    }
    default:
      break;
  }
};
