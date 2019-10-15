import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';
import { actionTypes as profileActionTypes } from '@bufferapp/publish-profile-sidebar/reducer';
import { actionTypes as lockedProfileActionTypes } from '@bufferapp/publish-locked-profile-notification/reducer';
import { actionTypes as thirdPartyActionTypes } from '@bufferapp/publish-thirdparty/reducer';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import getCtaProperties from '@bufferapp/publish-analytics-middleware/utils/CtaStrings';
import getCtaFromSource from '@bufferapp/publish-switch-plan-modal/utils/tracking';
import { getPlanId } from '@bufferapp/publish-plans/utils/plans';
import { actions, actionTypes } from './reducer';
import {
  shouldShowSwitchPlanModal,
  shouldShowWelcomeModal,
  getSourceFromKey,
  shouldShowStealProfileModal,
  shouldShowInstagramDirectPostingModal,
  shouldShowWelcomeModalPaidUsers,
  getShowModalValue,
  resetShowModalKey,
  shouldShowInstagramFirstCommentModal,
} from './util/showModal';

export default ({ dispatch, getState }) => next => (action) => {
  next(action);
  switch (action.type) {
    case lockedProfileActionTypes.UPGRADE:
      if (action.plan === 'free') {
        dispatch(actions.showSwitchPlanModal({ source: 'locked_profile', plan: 'pro' }));
      }
      break;
    case 'APP_INIT': {
      if (shouldShowSwitchPlanModal()) {
        dispatch(actions.showSwitchPlanModal({ source: getSourceFromKey(), plan: 'pro' }));
      }
      if (shouldShowStealProfileModal()) {
        dispatch(actions.showStealProfileModal({ stealProfileUsername: getShowModalValue() }));
      }
      if (shouldShowWelcomeModalPaidUsers()) {
        dispatch(actions.showWelcomePaidModal());
        // Don't overwhelm new users with lots of modals.
        return;
      }
      if (shouldShowInstagramFirstCommentModal()) {
        dispatch(actions.showInstagramFirstCommentModal());
      }
      if (shouldShowWelcomeModal()) {
        dispatch(actions.showWelcomeModal());
      }
      break;
    }

    case `profiles_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      if (action.result && action.result.some(profile => profile.isDisconnected)) {
        dispatch(actions.showProfilesDisconnectedModal());
      }

      break;
    }

    case `user_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      const {
        shouldShowProTrialExpiredModal,
        shouldShowBusinessTrialExpiredModal,
      } = action.result; // userData
      if (shouldShowProTrialExpiredModal) {
        dispatch(actions.showSwitchPlanModal({ source: 'pro_trial_expired', plan: 'pro' }));
      } else if (shouldShowBusinessTrialExpiredModal) {
        dispatch(actions.showB4BTrialExpiredModal({ source: 'b4b_trial_expired' }));
      }
      break;
    }

    case thirdPartyActionTypes.APPCUES_FINISHED: {
      const modalToShow = getState().modals.modalToShowLater;
      if (!modalToShow) {
        return;
      }

      if (modalToShow.id === actionTypes.SHOW_IG_DIRECT_POSTING_MODAL) {
        dispatch(actions.showInstagramDirectPostingModal({
          profileId: modalToShow.params.profileId,
        }));
      }

      break;
    }

    case thirdPartyActionTypes.APPCUES_STARTED: {
      const tourInProgress = getState().thirdparty.appCues.inProgress;
      const selectedProfileId = getState().profileSidebar.selectedProfileId;

      if (tourInProgress) {
        dispatch(actions.hideInstagramDirectPostingModal());
        dispatch(actions.saveModalToShowLater({
          modalId: actionTypes.SHOW_IG_DIRECT_POSTING_MODAL,
          selectedProfileId,
        }));
      }
      break;
    }

    case profileActionTypes.SELECT_PROFILE: {
      const profileId = getState().profileSidebar.selectedProfileId;
      const isIGBusiness = getState().profileSidebar.selectedProfile.service_type === 'business';
      const tourInProgress = getState().thirdparty.appCues.inProgress;

      if (shouldShowInstagramDirectPostingModal() && !isIGBusiness) {
        if (tourInProgress) {
          dispatch(dataFetchActions.fetch({
            name: 'checkInstagramBusiness',
            args: {
              profileId,
              callbackAction: actions.saveModalToShowLater({
                modalId: actionTypes.SHOW_IG_DIRECT_POSTING_MODAL,
                profileId,
              }),
            },
          }));
        } else {
          dispatch(dataFetchActions.fetch({
            name: 'checkInstagramBusiness',
            args: {
              profileId,
              callbackAction: actions.showInstagramDirectPostingModal({
                profileId,
              }),
            },
          }));
        }

        resetShowModalKey();
      }
      break;
    }
    case 'COMPOSER_EVENT':
      if (action.eventType === 'show-switch-plan-modal') {
        dispatch(actions.showSwitchPlanModal({ source: 'queue_limit', plan: 'pro' }));
      }
      break;

    case actionTypes.SHOW_SWITCH_PLAN_MODAL: {
      const { source, plan } = action;
      const ctaName = getCtaFromSource(source);
      const ctaProperties = getCtaProperties(ctaName);

      const metadata = {
        planName: plan,
        planId: getPlanId(plan),
        ...ctaProperties,
      };

      dispatch(analyticsActions.trackEvent('Modal Payment Opened', metadata));
      break;
    }
    default:
      break;
  }
};
