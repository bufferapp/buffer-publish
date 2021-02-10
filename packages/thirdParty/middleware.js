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
import zendeskWidget from './zendesk-widget';

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
    case orgActionTypes.ORGANIZATION_SELECTED: {
      /*  AppCues and FullStory need both user and org selected data to initialize.
          If when the org is selected there's no user data fetched yet,
          we initialize the thirdParty apps on user fetch success. And vice versa.
      */
      const { user } = getState();
      const { canSeeOrgSwitcher } = getState()?.organizations || {};
      if (user && Object.keys(user).length > 0) {
        dispatch({
          type: actionTypes.FULLSTORY,
          organization: action.selected,
          user,
        });
        dispatch({
          type: actionTypes.APPCUES,
          organization: {
            ...action.selected,
            canSeeOrgSwitcher,
          },
          user,
        });
      }
      break;
    }

    case `user_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      dispatch({ type: actionTypes.BUGSNAG, result: action.result });
      dispatch({ type: actionTypes.ZENDESK_WIDGET, result: action.result });

      const selectedOrganization = getState()?.organizations?.selected;
      if (
        selectedOrganization &&
        Object.keys(selectedOrganization).length > 0
      ) {
        const { canSeeOrgSwitcher } = getState()?.organizations || {};
        dispatch({
          type: actionTypes.FULLSTORY,
          user: action.result,
          organization: selectedOrganization,
        });
        dispatch({
          type: actionTypes.APPCUES,
          user: action.result,
          organization: {
            ...selectedOrganization,
            canSeeOrgSwitcher,
          },
        });
      }

      break;
    }

    case actionTypes.BUGSNAG:
      if (window && window.bugsnagClient) {
        window.bugsnagClient.user = {
          id: action.result.id,
          adminLink: `https://buffer.com/admin/user/${action.result.id}`,
        };
      }
      break;

    case actionTypes.FULLSTORY: {
      const { id } = action.user;
      const { planBase } = action.organization;
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
          const { id, createdAt, tags } = action.user;
          let { plan } = action.organization;
          const {
            planBase,
            planCode,
            trial,
            usersCount,
            profilesCount,
            canSeeOrgSwitcher,
          } = action.organization; // org selected data
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

    case actionTypes.ZENDESK_WIDGET:
      if (window && window.zE) {
        const { name, email } = action.result;
        zendeskWidget.init();
        zendeskWidget.prefillWidgetForm(name, email);

        dispatch({
          type: actionTypes.ZENDESK_WIDGET_LOADED,
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
