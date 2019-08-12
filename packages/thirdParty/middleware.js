import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';
import { actionTypes } from './reducer';

import {
  HELPSCOUT_ID,
} from './constants';

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
      dispatch({ type: actionTypes.HELPSCOUT_BEACON, result: action.result });
      dispatch({ type: actionTypes.QUALAROO, result: action.result });
      break;

    case actionTypes.QUALAROO:
      if (window && window._kiq) {
        const { id } = action.result;
        window._kiq.push(['identify', id]);
      }
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
      if (!action.result.is_free_user) {
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
            profileCount,
            is_business_user: isBusinessUser,
          } = action.result;
          if (isBusinessUser || plan === 'pro') {
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
              profileCount, // Number of profiles _owned_ by the user
            });

            const dispatchAppcuesStarted = () => {
              dispatch({
                type: actionTypes.APPCUES_STARTED,
              });
            };

            window.Appcues.on('flow_started', dispatchAppcuesStarted);

            const dispatchAppcuesFinished = () => {
              dispatch({
                type: actionTypes.APPCUES_FINISHED,
              });
            };

            window.Appcues.on('flow_completed', dispatchAppcuesFinished);
            window.Appcues.on('flow_skipped', dispatchAppcuesFinished);
            window.Appcues.on('flow_aborted', dispatchAppcuesFinished);
          }
        }
      }
      break;
    case actionTypes.APPCUES_STARTED:
      const beaconDiv = document.querySelector('beacon-container');
      beaconDiv.style.display = 'none';
      break;
    case actionTypes.APPCUES_FINISHED:
      beaconDiv.style.display = '';
      break;
    case actionTypes.HELPSCOUT_BEACON:
      if (window && window.Beacon) {
        const {
          name,
          email,
          helpScoutConfig,
        } = action.result;

        window.Beacon('init', HELPSCOUT_ID);
        window.Beacon('identify', {
          name, // current user's name
          email, // current user's email
        });
        // Pass config parameters from the user object in the API.
        window.Beacon('config', JSON.parse(helpScoutConfig));
        dispatch({
          type: actionTypes.HELPSCOUT_BEACON_LOADED,
          loaded: true,
        });
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

    case `profiles_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      const profilesLoaded = getState().profileSidebar.loading === false;
      if (!profilesLoaded) {
        break;
      }

      const {
        thirdparty: {
          appCues: { loaded: appCuesLoaded },
        },
      } = getState();

      if (appCuesLoaded && window && window.Appcues) {
        const { profiles } = getState().profileSidebar;
        if (profiles.find(profile => (profile.service === 'instagram' && profile.isInstagramBusiness))) {
          window.Appcues.track('Has Instagram Business profile');
        }
      }

      break;
    }
    default:
      break;
  }
};
