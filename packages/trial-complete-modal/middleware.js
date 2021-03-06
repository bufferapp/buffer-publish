import { actions as dataFetchActions } from '@bufferapp/async-data-fetch';
import { actions as modalActions } from '@bufferapp/publish-modals/reducer';
import { getURL } from '@bufferapp/publish-server/formatters';
import { SEGMENT_NAMES } from '@bufferapp/publish-constants';
import { actionTypes } from './reducer';

export default ({ getState, dispatch }) => next => action => {
  // eslint-disable-line
  next(action);

  switch (action.type) {
    case actionTypes.CANCEL_TRIAL: {
      dispatch(dataFetchActions.fetch({ name: 'cancelTrial' }));
      dispatch(modalActions.hideTrialCompleteModal());
      break;
    }
    case actionTypes.COMPLETE_UPGRADE_TRIAL: {
      const {
        hasExpiredProTrial,
        hasExpiredBusinessTrial,
        isPremiumBusiness,
      } = getState().trialCompleteModal;
      const ctaName = () => {
        if (hasExpiredProTrial) return SEGMENT_NAMES.EXPIRED_TRIAL_PRO_UPGRADE;
        if (hasExpiredBusinessTrial) {
          if (isPremiumBusiness) {
            return SEGMENT_NAMES.EXPIRED_TRIAL_PREMIUM_UPGRADE;
          }
          return SEGMENT_NAMES.EXPIRED_TRIAL_BUSINESS_UPGRADE;
        }
      };

      /** For business trials send them to the billing page */
      if (hasExpiredBusinessTrial) {
        window.location.assign(
          `${getURL.getBillingURL({
            cta: ctaName(),
          })}`
        );
        return;
      }

      /** For pro trials show the upgrade/switch plan modal */
      if (hasExpiredProTrial) {
        dispatch(modalActions.hideTrialCompleteModal());
        dispatch(
          modalActions.showSwitchPlanModal({
            plan: 'pro',
            source: ctaName(),
            isPromo: false,
          })
        );
      }
      break;
    }
    default:
      break;
  }
};
