import { actionTypes as profileActionTypes } from '@bufferapp/publish-profile-sidebar';

import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@bufferapp/async-data-fetch';
import { actions as generalSettingsActions } from '@bufferapp/publish-general-settings';
import { actions as notificationActions } from '@bufferapp/notifications';
import { actionTypes, actions } from './reducer';

export default ({ dispatch, getState }) => next => (action) => {
  next(action);
  switch (action.type) {
    case `user_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(dataFetchActions.fetch({
        name: 'enabledApplicationModes',
        args: {
          comprehensive: true,
        },
      }));
      break;
    case profileActionTypes.SELECT_PROFILE:
      dispatch(dataFetchActions.fetch({
        name: 'queuedPosts',
        args: {
          profileId: action.profile.id,
          isFetchingMore: false,
          count: 300,
        },
      }));
      break;
    case `updateSchedule_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `updatePausedSchedules_${dataFetchActionTypes.FETCH_SUCCESS}`:
    case `toggleInstagramReminders_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(dataFetchActions.fetch({
        name: 'queuedPosts',
        args: {
          profileId: action.args.profileId,
          isFetchingMore: false,
          count: 300,
        },
      }));
      break;
    case 'COMPOSER_EVENT':
      if (action.eventType === 'saved-drafts') {
        dispatch(notificationActions.createNotification({
          notificationType: 'success',
          message: action.data.message,
        }));
      }
      break;
    case `requeuePost_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(dataFetchActions.fetch({
        name: 'queuedPosts',
        args: {
          profileId: action.args.profileId,
          isFetchingMore: false,
          isReordering: true,
          count: 300,
        },
      }));
      break;
    case `queuedPosts_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (action.args.isReordering) {
        dispatch(notificationActions.createNotification({
          notificationType: 'success',
          message: 'We\'ve re-added this post to your queue!',
        }));
      }
      break;
    case `checkInstagramBusiness_${dataFetchActionTypes.FETCH_SUCCESS}`:
      if (action.args.recheck) {
        if (action.result.is_business) {
          dispatch(generalSettingsActions.handleSetUpDirectPostingClick({
            profileId: action.args.profileId,
          }));
        } else {
          dispatch(notificationActions.createNotification({
            notificationType: 'error',
            message: 'It seems you still don\'t have a Business Profile',
          }));
        }
      }

      if (action.args.callbackAction) {
        dispatch(action.args.callbackAction);
      }
      break;
    case `deletePost_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(notificationActions.createNotification({
        notificationType: 'success',
        message: 'Okay, we\'ve deleted that post!',
      }));
      /**
       * We also re-fetch the queue when a post is deleted
       * as this may have caused posts to change schedule
       */
      dispatch(dataFetchActions.fetch({
        name: 'queuedPosts',
        args: {
          profileId: action.args.profileId,
          isFetchingMore: false,
          hideLoading: true,
          count: 300,
        },
      }));
      break;
    case actionTypes.POST_CONFIRMED_DELETE:
      dispatch(dataFetchActions.fetch({
        name: 'deletePost',
        args: {
          updateId: action.updateId,
          profileId: action.profileId,
        },
      }));
      break;
    case actionTypes.POST_SHARE_NOW:
      dispatch(dataFetchActions.fetch({
        name: 'sharePostNow',
        args: {
          updateId: action.post.id,
          profileId: action.profileId,
        },
      }));
      break;
    case actionTypes.POST_REQUEUE:
      dispatch(dataFetchActions.fetch({
        name: 'requeuePost',
        args: {
          updateId: action.post.id,
          profileId: action.profileId,
        },
      }));
      break;
    case `sharePostNow_${dataFetchActionTypes.FETCH_SUCCESS}`:
      dispatch(notificationActions.createNotification({
        notificationType: 'success',
        message: 'Yay, your post has been shared! 🎉',
      }));
      break;
    case `sharePostNow_${dataFetchActionTypes.FETCH_FAIL}`:
      dispatch(notificationActions.createNotification({
        notificationType: 'error',
        message: action.error,
      }));
      break;
    case actionTypes.POST_DROPPED: {
      dispatch(dataFetchActions.fetch({
        name: 'dropPost',
        args: {
          updateId: action.updateId,
          timestamp: action.timestamp,
        },
      }));
      break;
    }

    /**
     * Watch for Pusher events to keep post counts up-to-date throughout the app.
     */
    case actionTypes.POST_CREATED:
    case actionTypes.POST_DELETED:
    case actionTypes.POST_SENT: {
      const state = getState();
      const { profileId } = action;
      const currentCounts = {
        pending: state.queue.byProfileId[profileId].total,
        sent: state.sent.byProfileId[profileId].total,
      };
      const changeMap = {
        [actionTypes.POST_CREATED]: { pending: 1, sent: 0 },
        [actionTypes.POST_DELETED]: { pending: -1, sent: 0 },
        [actionTypes.POST_SENT]: { pending: -1, sent: 1 },
      };
      const countChanges = changeMap[action.type];
      const newCounts = {
        pending: currentCounts.pending + countChanges.pending,
        sent: currentCounts.sent + countChanges.sent,
      };
      dispatch(actions.postCountUpdated(profileId, newCounts));
      break;
    }

    default:
      break;
  }
};
