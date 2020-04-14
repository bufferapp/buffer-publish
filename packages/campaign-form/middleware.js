import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@bufferapp/async-data-fetch';
import { actions as notificationActions } from '@bufferapp/notifications';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import { campaignScheduled } from '@bufferapp/publish-routes';
import { SEGMENT_NAMES } from '@bufferapp/publish-constants';
import { actionTypes } from './reducer';

export default ({ dispatch }) => next => action => {
  next(action);
  switch (action.type) {
    case actionTypes.CREATE_CAMPAIGN: {
      const { name, color } = action;

      dispatch(
        dataFetchActions.fetch({
          name: 'createCampaign',
          args: {
            name,
            color,
          },
        })
      );
      break;
    }
    case actionTypes.EDIT_CAMPAIGN: {
      const { id, name, color } = action;

      dispatch(
        dataFetchActions.fetch({
          name: 'updateCampaign',
          args: {
            campaignId: id,
            name,
            color,
          },
        })
      );
      break;
    }
    // Complete once changes to the backend endpoint are made:
    case `createCampaign_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      const { id, name, color, globalOrganizationId } = action.result || {};
      const metadata = {
        campaignId: id,
        campaignName: name,
        campaignColor: color,
        organizationId: globalOrganizationId,
      };
      dispatch(analyticsActions.trackEvent('Campaign Created', metadata));
      dispatch(
        notificationActions.createNotification({
          notificationType: 'success',
          message: 'Great! Your new campaign was created!',
        })
      );

      if (id) {
        dispatch(campaignScheduled.goTo({ campaignId: id }));
      }
      break;
    }

    case `updateCampaign_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      const { id, name, color, globalOrganizationId } = action.result || {};
      const metadata = {
        campaignId: id,
        campaignName: name,
        campaignColor: color,
        organizationId: globalOrganizationId,
      };
      dispatch(analyticsActions.trackEvent('Campaign Edited', metadata));

      if (id) {
        dispatch(campaignScheduled.goTo({ campaignId: id }));
      }
      break;
    }

    case `createCampaign_${dataFetchActionTypes.FETCH_FAIL}`:
    case `updateCampaign_${dataFetchActionTypes.FETCH_FAIL}`:
      dispatch(
        notificationActions.createNotification({
          notificationType: 'error',
          message: action.error,
        })
      );
      break;

    default:
      break;
  }
};
