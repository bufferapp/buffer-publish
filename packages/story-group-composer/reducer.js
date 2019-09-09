import keyWrapper from '@bufferapp/keywrapper';
import { actionTypes as dataFetchActionTypes } from '@bufferapp/async-data-fetch';

export const actionTypes = keyWrapper('STORY_GROUP_COMPOSER', {
  SAVE_STORY_GROUP: 0,
  SAVE_STORY_NOTE: 0,
  UPDATE_STORY_GROUP: 0,
  SET_SCHEDULE_LOADING: 0,
});

export const initialState = {
  // temporarily adding as dummy data until create is working
  draft: {
    stories: [{
      note: null,
      order: 1,
      type: 'image',
      asset_url: 'https://images.unsplash.com/photo-1562887189-e5d078343de4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80',
      thumbnail_url: 'https://images.unsplash.com/photo-1562887189-e5d078343de4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80',
    }],
    scheduledAt: null,
  },
  isScheduleLoading: false,
};

const updateStoryNote = ({ stories = [], storyId, note }) => (
  stories.map(story => (story.id === storyId ? { ...story, note } : story))
);

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SAVE_STORY_GROUP: {
      return {
        ...state,
        draft: { ...state.draft, scheduledAt: action.scheduledAt },
      };
    }
    case actionTypes.UPDATE_STORY_GROUP: {
      return {
        ...state,
        draft: {
          ...state.draft,
          scheduledAt: action.scheduledAt,
          stories: action.stories,
        },
      };
    }
    case actionTypes.SAVE_STORY_NOTE: {
      const { storyId, note } = action;
      const { stories } = state.draft;
      return {
        ...state,
        draft: { ...state.draft, stories: updateStoryNote({ stories, storyId, note }) },
      };
    }
    case actionTypes.SET_SCHEDULE_LOADING: {
      return {
        ...state,
        isScheduleLoading: action.isLoading,
      };
    }
    default:
      return state;
  }
};

export const actions = {
  handleSaveStoryGroup: scheduledAt => ({
    type: actionTypes.SAVE_STORY_GROUP,
    scheduledAt,
  }),
  handleUpdateStoryGroup: (storyGroupId, scheduledAt, stories) => ({
    type: actionTypes.UPDATE_STORY_GROUP,
    storyGroupId,
    scheduledAt,
    stories,
  }),
  handleSaveStoryNote: ({ storyId, note }) => ({
    type: actionTypes.SAVE_STORY_NOTE,
    storyId,
    note,
  }),
  setScheduleLoading: isLoading => ({
    type: actionTypes.SET_SCHEDULE_LOADING,
    isLoading,
  }),
};
