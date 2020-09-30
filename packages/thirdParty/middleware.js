import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware/actions';
import {
  getPageNameFromPath,
  getChannelIfNeeded,
} from '@bufferapp/publish-analytics-middleware/utils/Pathname';
import { actionTypes as orgActionTypes } from '@bufferapp/publish-data-organizations';
import { LOCATION_CHANGE } from 'connected-react-router';
import { actions as modalReducers } from '@bufferapp/publish-modals/reducer';
import * as FullStory from '@fullstory/browser';

import { actionTypes } from './reducer';

const shouldIdentifyWithAppcues = ({ plan, tags }) => {
  // We identify with Appcues for all Business and Pro users
  if (plan !== 'free') {
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
    case `user_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch({ type: actionTypes.BUGSNAG, result: action.result });
      break;

    case actionTypes.BUGSNAG:
      if (window && window.bugsnagClient) {
        window.bugsnagClient.user = {
          id: action.result.id,
          adminLink: `https://buffer.com/admin/user/${action.result.id}`,
        };
      }
      break;

    case orgActionTypes.ORGANIZATION_SELECTED:
      dispatch({ type: actionTypes.FULLSTORY, result: action.selected });
      dispatch({ type: actionTypes.APPCUES, result: action.selected });
      break;

    case actionTypes.FULLSTORY: {
      const { id } = getState().user || {};
      const { planBase } = action.result;
      if (planBase !== 'free' && process.env.NODE_ENV === 'production') {
        FullStory.init({
          orgId: '9F6GW',
          debug: !!window.location.href.match(
            /(local\.buffer)|(dev\.buffer\.com)/
          ),
        });

        FullStory.identify(id, {
          pricingPlan_str: planBase,
        });
      }
      break;
    }

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
          const { id, createdAt, canSeeOrgSwitcher, tags } =
            getState().user || {};
          let { plan } = action.result;
          const {
            planBase,
            planCode,
            trial,
            usersCount,
            profilesCount,
          } = action.result; // org selected data
          if (shouldIdentifyWithAppcues({ plan, tags })) {
            dispatch({
              type: actionTypes.APPCUES_LOADED,
              loaded: true,
            });
            // We use the planName (free, pro8, pro5, premium_business, ...) but are expecting to receive the planBase label for pro plans.
            if (planBase === 'pro') plan = planBase;

            const modalsShowing = modalReducers.isShowingModals(getState());
            window.Appcues.identify(id, {
              modalsShowing,
              name: id, // current user's name
              createdAt, // Unix timestamp of user signup date
              plan, // Current user’s plan name
              planCode, // Current user’s plan tier
              onTrial: trial.onTrial,
              trialLength: trial.trialLength,
              trialTimeRemaining: trial.trialTimeRemaining,
              orgUserCount: usersCount, // Number of users (including the account owner)
              profileCount: profilesCount, // Number of profiles _owned_ by the user
              canSeeOrgSwitcher,
              upgradedFromLegacyAwesomeToProPromotion: tags.includes(
                'upgraded-to-pro-from-legacy-awesome'
              ),
              migratedFromAwesomeToPro_Batch1: tags.includes(
                'awesome-pro-forced-migration'
              ),
              migratedFromAwesomeToPro_teamMember_Batch1: tags.includes(
                'awesome-pro-forced-migration-team-member'
              ),
              migratedFromAwesomeToPro_Batch2: tags.includes(
                'upgraded-awesome-to-pro-batch-2'
              ),
              migratedFromAwesomeToSBP: tags.includes(
                'upgraded-awesome-to-small-business'
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
