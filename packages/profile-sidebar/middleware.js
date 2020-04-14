import { getURL } from '@bufferapp/publish-server/formatters/src';
import { actions as tabsActions } from '@bufferapp/publish-tabs/reducer';

import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';

import { actions as notificationActions } from '@bufferapp/notifications';
import { actions, actionTypes } from './reducer';

export const refreshProfile = (dispatch, profileId, message) => {
  dispatch(
    dataFetchActions.fetch({
      name: 'singleProfile',
      args: {
        profileId,
        message,
      },
    })
  );
};

export default ({ dispatch, getState }) => next => action => {
  next(action);
  switch (action.type) {
    case actionTypes.SINGLE_PROFILE:
      dispatch(
        dataFetchActions.fetch({
          name: 'singleProfile',
          args: {
            profileId: action.profileId,
          },
        })
      );
      break;
    case `singleProfile_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (action.args.message) {
        dispatch(
          notificationActions.createNotification({
            notificationType: 'success',
            message: action.args.message,
          })
        );
      }
      break;

    case actionTypes.PROFILE_ROUTE_LOADED: {
      const { selectedProfile = {} } = action;
      let profile = selectedProfile;
      let profileFound = true;

      // force user redirection to valid profile if none exists
      if (!profile || !profile.id) {
        profileFound = false;
        const { profileSidebar = {} } = getState();
        const { profiles } = profileSidebar;
        if (profiles && profiles.length > 0) {
          [profile] = profiles;
        }
      }

      dispatch(
        actions.selectProfile({
          profile,
        })
      );
      // When the page has just loaded or is refreshed,
      // we want to be able to update the actual selected tab
      if (
        (action.tabId && getState().tabs.tabId !== action.tabId) ||
        !profileFound
      ) {
        dispatch(
          tabsActions.selectTab({
            tabId: action.tabId,
            profileId: profile.id,
          })
        );
      }
      break;
    }

    case actionTypes.PROFILE_PAUSED:
    case actionTypes.PROFILE_UNPAUSED:
      dispatch(
        dataFetchActions.fetch({
          name: 'pauseQueue',
          args: {
            profileId: action.profileId,
            paused: action.type === actionTypes.PROFILE_PAUSED,
          },
        })
      );
      break;
    case actionTypes.MANAGE_SOCIAL_ACCOUNT:
      window.location = getURL.getManageSocialAccountURL();
      break;
    case actionTypes.CONNECT_SOCIAL_ACCOUNT:
      window.location = getURL.getConnectSocialAccountURL();
      break;
    case `pauseQueue_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(
        notificationActions.createNotification({
          notificationType: 'success',
          message: action.result.message,
        })
      );
      break;
    /**
     * When the buffer-web backend sends out it's paused state
     * message via Pusher let's reload the queue (only if it is now unpaused)
     */
    case actionTypes.PUSHER_PROFILE_PAUSED_STATE:
      if (!action.paused) {
        dispatch(
          dataFetchActions.fetch({
            name: 'queuedPosts',
            args: {
              profileId: action.profileId,
              isFetchingMore: false,
              count: 300,
            },
          })
        );
      }
      break;
    case actionTypes.PROFILE_DROPPED: {
      if (action.commit) {
        const { profiles } = getState().profileSidebar;
        const orderedIds = profiles.map(profile => profile.id);
        dispatch(
          dataFetchActions.fetch({
            name: 'reorderProfiles',
            args: {
              order: orderedIds,
            },
          })
        );
      }
      break;
    }
    default:
      break;
  }
};
