import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@bufferapp/async-data-fetch';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import { actions as notificationActions } from '@bufferapp/notifications';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import { campaignsPage } from '@bufferapp/publish-routes';
import { actionTypes } from './reducer';

export default ({ dispatch, getState }) => next => action => {
  next(action);
  const state = getState();
  switch (action.type) {
    case actionTypes.FETCH_CAMPAIGN: {
      const { campaignId, past, fullItems } = action;

      dispatch(
        dataFetchActions.fetch({
          name: 'getCampaign',
          args: {
            campaignId,
            past: past || false,
            fullItems: fullItems || false,
          },
        })
      );
      break;
    }

    case actionTypes.GO_TO_ANALYZE_REPORT: {
      const { id, name } = action.campaign;
      const { organizationId } = state.profileSidebar.selectedProfile;
      const metadata = {
        campaignId: id,
        campaignName: name,
        organizationId,
      };
      dispatch(analyticsActions.trackEvent('Campaign Report Viewed', metadata));
      window.location.assign(`${getURL.getAnalyzeReportUrl()}`);
      break;
    }

    case `getCampaign_${dataFetchActionTypes.FETCH_FAIL}`:
      dispatch(
        notificationActions.createNotification({
          notificationType: 'error',
          message: action.error,
        })
      );
      dispatch(campaignsPage.goTo());
      break;

    default:
      break;
  }
};
