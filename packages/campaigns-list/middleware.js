import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@bufferapp/async-data-fetch';
import { actions as notificationActions } from '@bufferapp/notifications';
import { actionTypes } from './reducer';

export default ({ dispatch, getState }) => next => action => {
  next(action);
  const state = getState();
  switch (action.type) {
    case actionTypes.FETCH_CAMPAIGNS_IF_NEEDED: {
      /* if a user enters a url directly, the campaign list will need to be fetched.
       campaign list should only be fetched once while in publish */
      const hasCampaignsFeature = state.appSidebar.user.features?.includes(
        'campaigns'
      );
      const shouldFetchCampaigns =
        !state.campaignsList.campaigns && hasCampaignsFeature;
      if (shouldFetchCampaigns) {
        dispatch(
          dataFetchActions.fetch({
            name: 'getCampaignsList',
            args: {},
          })
        );
      }
      break;
    }

    case `getCampaignsList_${dataFetchActionTypes.FETCH_FAIL}`:
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
