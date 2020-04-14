import Pusher from 'pusher-js';
import { actionTypes as profileSidebarActionTypes } from '@bufferapp/publish-profile-sidebar/reducer';
import { actionTypes as queueActionTypes } from '@bufferapp/publish-queue/reducer';
import { actionTypes as draftActionTypes } from '@bufferapp/publish-drafts/reducer';
import { actionTypes as storiesActionTypes } from '@bufferapp/publish-stories/reducer';
import {
  actionTypes as dataFetchActionTypes,
  actions as dataFetchActions,
} from '@bufferapp/async-data-fetch';
import { actionTypes as campaignActionTypes } from '@bufferapp/publish-campaign/reducer';
import {
  postParser,
  storyGroupParser,
} from '@bufferapp/publish-server/parsers/src';

const PUSHER_APP_KEY = 'bd9ba9324ece3341976e';

const updateEventActionMap = {
  sent_update: queueActionTypes.POST_SENT,
  updated_update: queueActionTypes.POST_UPDATED,
};

const bindProfileUpdateEvents = (channel, profileId, dispatch) => {
  // Bind updated drafts event
  channel.bind('collaboration_draft_updated', data => {
    dispatch({
      type: draftActionTypes.DRAFT_UPDATED,
      profileId,
      draft: postParser(data.draft),
    });
  });
  // Bind moved drafts event
  channel.bind('collaboration_draft_moved', data => {
    dispatch({
      type: draftActionTypes.DRAFT_MOVED,
      profileId,
      draft: postParser(data.draft),
    });
  });
  // Bind other events
  channel.bind('reordered_updates', order => {
    dispatch({
      type: queueActionTypes.REORDERED_UPDATES,
      profileId,
      order,
    });
  });
  channel.bind('queue_paused', paused => {
    dispatch({
      type: profileSidebarActionTypes.PUSHER_PROFILE_PAUSED_STATE,
      paused,
      profileId,
    });
  });
};

const bindProfileStoryGroupEvents = (channel, profileId, dispatch) => {
  channel.bind('sent_story_group', data => {
    dispatch({
      type: storiesActionTypes.STORY_SENT,
      profileId,
      storyGroup: storyGroupParser(data.story_group),
    });
  });
  channel.bind('story_group_created', data => {
    dispatch({
      type: storiesActionTypes.STORY_CREATED,
      profileId,
      storyGroup: storyGroupParser(data.story_group),
    });
  });
  channel.bind('story_group_updated', data => {
    dispatch({
      type: storiesActionTypes.STORY_UPDATED,
      profileId,
      storyGroup: storyGroupParser(data.story_group),
    });
  });
  channel.bind('story_group_deleted', data => {
    dispatch({
      type: storiesActionTypes.STORY_DELETED,
      profileId,
      storyGroupId: data.story_group_id,
    });
  });
};

const channelsByProfileId = {};
const setupProfilePusherEvents = (
  { profileId, profile: { service } },
  pusher,
  dispatch
) => {
  if (profileId) {
    // If the profile is not subscribed to any channels, subscribes to private-updates channel:
    const newProfileChannels = channelsByProfileId[profileId] || {
      updates: pusher.subscribe(`private-updates-${profileId}`),
    };
    // If instagram profile and profile is not subscribed to story-groups channel, subscribes to private-story-groups channel:
    if (
      service === 'instagram' &&
      newProfileChannels.storyGroups === undefined
    ) {
      newProfileChannels.storyGroups = pusher.subscribe(
        `private-story-groups-${profileId}`
      );
    }
    channelsByProfileId[profileId] = newProfileChannels;

    bindProfileUpdateEvents(
      channelsByProfileId[profileId].updates,
      profileId,
      dispatch
    );
    if (channelsByProfileId[profileId].storyGroups) {
      bindProfileStoryGroupEvents(
        channelsByProfileId[profileId].storyGroups,
        profileId,
        dispatch
      );
    }
  }
};

const bindOrganizationEvents = (orgChannel, dispatch) => {
  // Campaigns
  orgChannel.bind('create_campaign', data => {
    dispatch({
      type: campaignActionTypes.PUSHER_CAMPAIGN_CREATED,
      campaign: data,
    });
  });
  orgChannel.bind('update_campaign', data => {
    dispatch({
      type: campaignActionTypes.PUSHER_CAMPAIGN_UPDATED,
      campaign: data,
    });
  });
  orgChannel.bind('delete_campaign', data => {
    dispatch({
      type: campaignActionTypes.PUSHER_CAMPAIGN_DELETED,
      campaignId: data.id,
    });
  });
  // Posts and Drafts
  orgChannel.bind('added_update', data => {
    if (data.update.draft) {
      dispatch({
        type: draftActionTypes.DRAFT_CREATED,
        profileId: data.profile_id,
        draft: postParser(data.update),
      });
    } else {
      dispatch({
        type: queueActionTypes.POST_CREATED,
        profileId: data.profile_id,
        post: postParser(data.update),
      });
    }
  });
  orgChannel.bind('deleted_update', data => {
    if (data.update.draft) {
      dispatch({
        type: draftActionTypes.DRAFT_DELETED,
        profileId: data.profile_id,
        draft: postParser(data.update),
      });
    } else {
      dispatch({
        type: queueActionTypes.POST_DELETED,
        profileId: data.profile_id,
        post: postParser(data.update),
      });
    }
  });
  orgChannel.bind('collaboration_draft_approved', data => {
    dispatch({
      type: draftActionTypes.DRAFT_APPROVED,
      profileId: data.profile_id,
      draft: postParser(data.draft),
    });
  });
  Object.entries(updateEventActionMap).forEach(([pusherEvent, actionType]) => {
    orgChannel.bind(pusherEvent, data => {
      dispatch({
        type: actionType,
        profileId: data.profile_id,
        post: postParser(data.update),
      });
    });
  });
};

/**
 * Middleware
 */
export default ({ dispatch }) => {
  const pusher = new Pusher(PUSHER_APP_KEY, { authEndpoint: '/pusher/auth' });
  window.__pusher = pusher;

  return next => action => {
    next(action);

    switch (action.type) {
      case 'APP_INIT':
        dispatch(dataFetchActions.fetch({ name: 'getGlobalOrganizationId' }));
        break;
      case profileSidebarActionTypes.SELECT_PROFILE:
        setupProfilePusherEvents(action, pusher, dispatch);
        break;
      case `getGlobalOrganizationId_${dataFetchActionTypes.FETCH_SUCCESS}`: {
        const { globalOrganizationId } = action.result;
        if (globalOrganizationId) {
          const channelName = `private-updates-org-${globalOrganizationId}`;
          const orgChannel = pusher.subscribe(channelName);
          bindOrganizationEvents(orgChannel, dispatch);
        }
        break;
      }
      default:
        break;
    }
  };
};
