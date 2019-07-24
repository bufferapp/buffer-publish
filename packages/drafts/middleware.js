import { actionTypes as profileActionTypes } from '@bufferapp/publish-profile-sidebar';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';

import {
  actions as dataFetchActions,
  actionTypes as dataFetchActionTypes,
} from '@bufferapp/async-data-fetch';
import { actions as notificationActions } from '@bufferapp/notifications';
import { actionTypes } from './reducer';

const getTrackingData = ({ post = {}, channel = {} }) => ({
  postId: post.id,
  channelId: channel.id,
  mediaType: post.type,
  product: 'publish',
  channelType: channel.service_type,
  channelNetwork: channel.service,
});

export default ({ dispatch, getState }) => next => (action) => {
  next(action);
  const state = getState();

  switch (action.type) {
    case profileActionTypes.SELECT_PROFILE:
      dispatch(dataFetchActions.fetch({
        name: 'draftPosts',
        args: {
          profileId: action.profile.id,
          isFetchingMore: false,
        },
      }));
      break;
    case actionTypes.DRAFT_CONFIRMED_DELETE: {
      dispatch(dataFetchActions.fetch({
        name: 'deletePost',
        args: {
          updateId: action.updateId,
        },
      }));
      const channel = state.profileSidebar.selectedProfile;
      const metadata = getTrackingData({ post: action.draft, channel });
      dispatch(analyticsActions.trackEvent('Draft Deleted', metadata));
      break;
    }
/*
In Classic it's REQUESTING_DRAFT_APPROVE.
Sends draft to queue, which means approves draft
*/
    case actionTypes.DRAFT_APPROVE:
      dispatch(dataFetchActions.fetch({
        name: 'approveDraft',
        args: {
          updateId: action.updateId,
        },
      }));
      break;
/*
In Classic it's REQUESTING_NEEDS_APPROVAL_UPDATE:
Requests approval as a contributor (moves draft to awaiting approval tab if needsApproval is true,
moves from approval tab to drafts if needsApproval false)
*/
    case actionTypes.DRAFT_NEEDS_APPROVAL:
      dispatch(dataFetchActions.fetch({
        name: 'changeDraftStatus',
        args: {
          updateId: action.updateId,
          needsApproval: action.needsApproval,
        },
      }));
      break;
    case `approveDraft_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      dispatch(notificationActions.createNotification({
        notificationType: 'success',
        message: 'We\'ve added this draft to your queue!',
      }));
      const post = action.result.update;
      const channel = state.profileSidebar.selectedProfile;
      const metadata = getTrackingData({ post, channel });
      dispatch(analyticsActions.trackEvent('Draft Approved', metadata));
      break;
    }
    case `changeDraftStatus_${dataFetchActionTypes.FETCH_SUCCESS}`: {
      dispatch(notificationActions.createNotification({
        notificationType: 'success',
        message: 'We\'ve successfully moved this draft!',
      }));
      const draft = action.result ? action.result.draft : {};
      /* this is also called when a draft in approval is moved back into drafts, which
       is why we need to check the needs_approval bool */
      if (draft.needs_approval) {
        const channel = state.profileSidebar.selectedProfile;
        const metadata = getTrackingData({ post: draft, channel });
        dispatch(analyticsActions.trackEvent('Draft Submitted', metadata));
      }
      break;
    }
    case `approveDraft_${dataFetchActionTypes.FETCH_FAIL}`:
      dispatch(notificationActions.createNotification({
        notificationType: 'error',
        message: 'There was an error adding this draft to your queue!',
      }));
      break;
    case `changeDraftStatus_${dataFetchActionTypes.FETCH_FAIL}`:
      dispatch(notificationActions.createNotification({
        notificationType: 'error',
        message: 'There was an error moving this draft!',
      }));
      break;
    default:
      break;
  }
};
