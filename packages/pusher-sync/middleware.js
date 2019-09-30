import Pusher from 'pusher-js';
import { actionTypes as profileSidebarActionTypes } from '@bufferapp/publish-profile-sidebar/reducer';
import { actionTypes as queueActionTypes } from '@bufferapp/publish-queue/reducer';
import { actionTypes as draftActionTypes } from '@bufferapp/publish-drafts/reducer';
import { actionTypes as storiesActionTypes } from '@bufferapp/publish-stories/reducer';
import { postParser, storyGroupParser } from '@bufferapp/publish-server/parsers/src';

const PUSHER_APP_KEY = 'bd9ba9324ece3341976e';

const profileEventActionMap = {
  sent_update: queueActionTypes.POST_SENT,
  updated_update: queueActionTypes.POST_UPDATED,
};

const bindProfileUpdateEvents = (channel, profileId, dispatch) => {
  // Bind post related events
  Object.entries(profileEventActionMap).forEach(([pusherEvent, actionType]) => {
    channel.bind(pusherEvent, (data) => {
      dispatch({
        type: actionType,
        profileId,
        post: postParser(data.update),
      });
    });
  });
  // Bind added update events, both for posts and drafts
  channel.bind('added_update', (data) => {
    if (data.update.draft) {
      dispatch({
        type: draftActionTypes.DRAFT_CREATED,
        profileId,
        draft: postParser(data.update),
      });
    } else {
      dispatch({
        type: queueActionTypes.POST_CREATED,
        profileId,
        post: postParser(data.update),
      });
    }
  });
  // Bind deleted update events, both for posts and drafts
  channel.bind('deleted_update', (data) => {
    if (data.update.draft) {
      dispatch({
        type: draftActionTypes.DRAFT_DELETED,
        profileId,
        draft: postParser(data.update),
      });
    } else {
      dispatch({
        type: queueActionTypes.POST_DELETED,
        profileId,
        post: postParser(data.update),
      });
    }
  });
  // Bind approved drafts event
  channel.bind('collaboration_draft_approved', (data) => {
    dispatch({
      type: draftActionTypes.DRAFT_APPROVED,
      profileId,
      draft: postParser(data.draft),
    });
  });
  // Bind updated/ moved drafts event
  channel.bind('collaboration_draft_updated', (data) => {
    dispatch({
      type: draftActionTypes.DRAFT_UPDATED,
      profileId,
      draft: postParser(data.draft),
    });
  });
  // Bind other events
  channel.bind('reordered_updates', (order) => {
    dispatch({
      type: queueActionTypes.REORDERED_UPDATES,
      profileId,
      order,
    });
  });
  channel.bind('queue_paused', (paused) => {
    dispatch({
      type: profileSidebarActionTypes.PUSHER_PROFILE_PAUSED_STATE,
      paused,
      profileId,
    });
  });
};

const bindProfileStoryGroupEvents = (channel, profileId, dispatch) => {
  channel.bind('sent_story_group', (data) => {
    dispatch({
      type: storiesActionTypes.STORY_SENT,
      profileId,
      storyGroup: storyGroupParser(data.story_group),
    });
  });
  channel.bind('story_group_created', (data) => {
    console.log(data);
    dispatch({
      type: storiesActionTypes.STORY_CREATED,
      profileId,
      storyGroup: storyGroupParser(data.story_group),
    });
  });
  channel.bind('story_group_updated', (data) => {
    console.log(data);
    dispatch({
      type: storiesActionTypes.STORY_UPDATED,
      profileId,
      storyGroup: storyGroupParser(data.story_group),
    });
  });
  channel.bind('story_group_deleted', (data) => {
    dispatch({
      type: storiesActionTypes.STORY_DELETED,
      profileId,
      storyGroupId: data.story_group_id,
    });
  });
};

export default ({ dispatch }) => {
  const pusher = new Pusher(PUSHER_APP_KEY, { authEndpoint: '/pusher/auth' });
  window.__pusher = pusher;
  const channelsByProfileId = {};

  return next => (action) => {
    next(action);
    if (action.type === profileSidebarActionTypes.SELECT_PROFILE) {
      const { profileId } = action;
      const { service } = action.profile;
      if (profileId) {
        // If the profile is not subscribed to any channels, subscribes to private-updates channel:
        const newProfileChannels = channelsByProfileId[profileId] || { updates: pusher.subscribe(`private-updates-${profileId}`) };
        // If instagram profile and profile is not subscribed to story-groups channel, subscribes to private-story-groups channel:
        if (service === 'instagram' && newProfileChannels.storyGroups === undefined) {
          newProfileChannels.storyGroups = pusher.subscribe(`private-story-groups-${profileId}`);
        }
        channelsByProfileId[profileId] = newProfileChannels;

        bindProfileUpdateEvents(channelsByProfileId[profileId].updates, profileId, dispatch);
        if (channelsByProfileId[profileId].storyGroups) {
          bindProfileStoryGroupEvents(channelsByProfileId[profileId].storyGroups, profileId, dispatch);
        }
      }
    }
  };
};
