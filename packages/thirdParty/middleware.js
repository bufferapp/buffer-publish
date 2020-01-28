import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware/actions';
import {
  getPageNameFromPath,
  getChannelIfNeeded,
} from '@bufferapp/publish-analytics-middleware/utils/Pathname';
import { LOCATION_CHANGE } from 'connected-react-router';
import { actions as modalReducers } from '@bufferapp/publish-modals/reducer';
import { actionTypes } from './reducer';

import { HELPSCOUT_ID } from './constants';

const checkExtensionInstalled = () => {
  /**
   * We place this marker in the DOM (server/index.html) and the Buffer Extension
   * will add it's version to it with a data-attribute when present. 👌
   */
  const markerEl = document.querySelector('#browser-extension-marker');
  const version = markerEl.getAttribute('data-version');
  return !!version;
};

const shouldIdentifyWithAppcues = ({ isBusinessUser, plan, tags }) => {
  // We identify with Appcues for all Business and Pro users
  if (isBusinessUser || plan === 'pro') {
    return true;
  }
  // We also identify with any team members of migrated Awesome users
  if (tags.includes('awesome-pro-forced-migration-team-member')) {
    return true;
  }
  return false;
};

export default ({ dispatch, getState }) => next => action => {
  next(action);
  switch (action.type) {
    case 'APP_INIT':
      dispatch(dataFetchActions.fetch({ name: 'intercom' }));
      break;

    case `user_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch({ type: actionTypes.FULLSTORY, result: action.result });
      dispatch({ type: actionTypes.APPCUES, result: action.result });
      if (!action.result.isOnAwesomePlan) {
        // Context: https://buffer.atlassian.net/browse/PUB-2004
        dispatch({ type: actionTypes.HELPSCOUT_BEACON, result: action.result });
      }
      dispatch({ type: actionTypes.ITERATE, result: action.result });
      break;

    case actionTypes.ITERATE:
      if (window && window.Iterate) {
        const { result } = action;
        window.Iterate('identify', {
          first_name: result.name,
          last_name: ' ',
          email: result.email,
          createdAt: result.createdAt,
          plan: result.plan,
          planCode: result.planCode,
          onTrial: result.trial.onTrial,
          trialLength: result.trial.trialLength,
          trialTimeRemaining: result.trial.trialTimeRemaining,
          orgUserCount: result.orgUserCount,
          profileCount: result.profileCount,
        });
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
            if (planName !== 'free') {
              window.FS.identify(id, {
                pricingPlan_str: planName,
              });
            }
          }
        }
      }
      break;
    case actionTypes.APPCUES:
      if (window) {
        if (!window.Appcues) {
          const appcuesJS = document.querySelector('#appcues-js');
          if (appcuesJS !== null) {
            appcuesJS.addEventListener('load', () => {
              // re-dispatch this event if appcues isn't yet loaded
              dispatch(action);
            });
          }
        } else if (window.Appcues) {
          const {
            id,
            createdAt,
            plan,
            planCode,
            trial,
            orgUserCount,
            profileCount,
            is_business_user: isBusinessUser,
            tags,
          } = action.result;
          if (shouldIdentifyWithAppcues({ isBusinessUser, plan, tags })) {
            dispatch({
              type: actionTypes.APPCUES_LOADED,
              loaded: true,
            });

            const { modals } = getState();

            const modalsShowing = modalReducers.isShowingModals({ modals });

            window.Appcues.identify(id, {
              name: id, // current user's name
              createdAt, // Unix timestamp of user signup date
              plan, // Current user’s plan type
              planCode, // Current user’s plan tier
              onTrial: trial.onTrial,
              modalsShowing,
              trialLength: trial.trialLength,
              trialTimeRemaining: trial.trialTimeRemaining,
              orgUserCount, // Number of users (including the account owner)
              profileCount, // Number of profiles _owned_ by the user
              upgradedFromLegacyAwesomeToProPromotion: tags.includes(
                'upgraded-to-pro-from-legacy-awesome'
              ),
              migratedFromAwesomeToPro_Batch1: tags.includes(
                'awesome-pro-forced-migration'
              ),
              migratedFromAwesomeToPro_teamMember_Batch1: tags.includes(
                'awesome-pro-forced-migration-team-member'
              ),
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
        const { name, email, helpScoutConfig } = action.result;

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
        if (
          profiles.find(
            profile =>
              profile.service === 'instagram' && profile.isInstagramBusiness
          )
        ) {
          window.Appcues.track('Has Instagram Business profile');
        }
      }

      break;
    }
    case LOCATION_CHANGE: {
      const path = action.payload.location.pathname;
      /* when a user first hits publish.buffer.com, we select a profile for them and the routes changes
       We don't want to track the initial load before the profile is selected */
      if (path !== '/') {
        const metadata = {
          platform: 'new_publish',
          product: 'publish',
          name: getPageNameFromPath(path) || null,
          path,
          title: document.title || null,
          url: window.location.origin || null,
          referrer: document.referrer || null,
          search: action.payload.search || null,
          // don't need channel if route isnt associated with profileId
          channel: getChannelIfNeeded({ path, getState }),
        };
        dispatch(analyticsActions.trackEvent('Page Viewed', metadata));
      }
      break;
    }
    default:
      break;
  }
};
