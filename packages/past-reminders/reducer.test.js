import deepFreeze from 'deep-freeze';
import reducer, { actions, initialState, profileInitialState, actionTypes } from './reducer';
import {
  header,
  subHeader,
} from './components/PastRemindersPosts/postData';

const profileId = '123456';

describe('reducer', () => {
  it('should initialize default state', () => {
    const stateAfter = initialState;
    const action = {
      type: 'INIT',
    };
    deepFreeze(action);
    expect(reducer(undefined, action))
      .toEqual(stateAfter);
  });

  it('should handle pastRemindersPosts_FETCH_START action type', () => {
    const stateAfter = {
      ...initialState,
      byProfileId: {
        [profileId]: {
          header,
          subHeader,
          loading: true,
          loadingMore: false,
          moreToLoad: false,
          page: 1,
          posts: {},
          total: 0,
        },
      },
    };
    const action = {
      profileId,
      type: 'pastRemindersPosts_FETCH_START',
      args: {
        isFetchingMore: false,
      },
    };
    deepFreeze(action);
    expect(reducer(undefined, action))
      .toEqual(stateAfter);
  });

  it('should handle pastRemindersPosts_FETCH_SUCCESS action type', () => {
    const post = { id: 'foo', text: 'i love buffer' };
    const stateAfter = {
      ...initialState,
      byProfileId: {
        [profileId]: {
          header,
          subHeader,
          loading: false,
          loadingMore: false,
          moreToLoad: false,
          page: 2,
          posts: [post],
          total: 1,
        },
      },
    };
    const action = {
      profileId,
      type: 'pastRemindersPosts_FETCH_SUCCESS',
      result: {
        updates: [post],
        total: 1,
      },
      args: {
        isFetchingMore: false,
      },
    };
    deepFreeze(action);
    expect(reducer(undefined, action))
      .toEqual(stateAfter);
  });

  it('should handle pastRemindersPosts_FETCH_FAIL action type', () => {
    const stateAfter = {
      ...initialState,
      byProfileId: {
        [profileId]: {
          header,
          subHeader,
          loading: false,
          loadingMore: false,
          moreToLoad: false,
          page: 1,
          posts: {},
          total: 0,
        },
      },
    };
    const action = {
      profileId,
      type: 'pastRemindersPosts_FETCH_FAIL',
    };
    deepFreeze(action);
    expect(reducer(undefined, action))
      .toEqual(stateAfter);
  });

  it('should handle getPastRemindersStories_FETCH_START action type', () => {
    const stateAfter = {
      ...initialState,
      byProfileId: {
        [profileId]: {
          header,
          subHeader,
          loading: true,
          loadingMore: false,
          moreToLoad: false,
          page: 1,
          posts: {},
          total: 0,
        },
      },
    };
    const action = {
      profileId,
      type: 'getPastRemindersStories_FETCH_START',
      args: {
        isFetchingMore: false,
      },
    };
    deepFreeze(action);
    expect(reducer(undefined, action))
      .toEqual(stateAfter);
  });

  it('should handle getPastRemindersStories_FETCH_SUCCESS action type', () => {
    const post = { id: 'foo', text: 'i love buffer' };
    const stateAfter = {
      ...initialState,
      byProfileId: {
        [profileId]: {
          header,
          subHeader,
          loading: false,
          loadingMore: false,
          moreToLoad: false,
          page: 2,
          posts: [post],
          total: 1,
        },
      },
    };
    const action = {
      profileId,
      type: 'getPastRemindersStories_FETCH_SUCCESS',
      result: {
        updates: [post],
        total: 1,
      },
      args: {
        isFetchingMore: false,
      },
    };
    deepFreeze(action);
    expect(reducer(undefined, action))
      .toEqual(stateAfter);
  });

  it('should handle getPastRemindersStories_FETCH_FAIL action type', () => {
    const stateAfter = {
      ...initialState,
      byProfileId: {
        [profileId]: {
          header,
          subHeader,
          loading: false,
          loadingMore: false,
          moreToLoad: false,
          page: 1,
          posts: {},
          total: 0,
        },
      },
    };
    const action = {
      profileId,
      type: 'getPastRemindersStories_FETCH_FAIL',
    };
    deepFreeze(action);
    expect(reducer(undefined, action))
      .toEqual(stateAfter);
  });

  it('should handle OPEN_COMPOSER action type', () => {
    const stateComposerHidden = Object.assign(
      initialState,
      { showComposer: false },
    );

    const action = {
      profileId,
      type: 'OPEN_COMPOSER',
    };

    expect(reducer(stateComposerHidden, action))
      .toEqual(Object.assign(initialState, { showComposer: true }));
  });

  it('should handle HIDE_COMPOSER action type', () => {
    const stateComposerVisible = Object.assign(
      initialState,
      { showComposer: true },
    );

    const action = {
      profileId,
      type: 'HIDE_COMPOSER',
    };

    expect(reducer(stateComposerVisible, action))
      .toEqual(Object.assign(initialState, { showComposer: false }));
  });

  it('should handle OPEN_STORIES_COMPOSER action type', () => {
    const stateBefore = {
      ...initialState,
      showStoriesComposer: false,
      editMode: false,
      emptySlotMode: false,
      emptySlotData: null,
      editingPostId: '',
      showStoryPreview: false,
    };
    const stateAfter = {
      ...initialState,
      showStoriesComposer: true,
      editMode: false,
      editingPostId: '123',
      emptySlotMode: false,
      emptySlotData: null,
    };

    const action = {
      profileId,
      type: actionTypes.OPEN_STORIES_COMPOSER,
      editMode: false,
      updateId: '123',
    };

    expect(reducer(stateBefore, action))
      .toEqual(stateAfter);
  });

  it('should handle HIDE_STORIES_COMPOSER action type', () => {
    const stateBefore = {
      ...initialState,
      showStoriesComposer: true,
      editMode: false,
      emptySlotMode: false,
      emptySlotData: null,
      editingPostId: '',
      showStoryPreview: false,
    };
    const stateAfter = {
      ...initialState,
      showStoriesComposer: false,
      editMode: false,
      emptySlotMode: false,
      emptySlotData: null,
    };
    const action = {
      type: actionTypes.HIDE_STORIES_COMPOSER,
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action))
      .toEqual(stateAfter);
  });

  it('should handle POST_IMAGE_CLICKED action type', () => {
    const post = { id: '12345', text: 'i heart buffer' };
    const postAfter = { ...post, isLightboxOpen: true, currentImage: 0 };
    const stateBefore = {
      byProfileId: {
        [profileId]: Object.assign(profileInitialState, { posts: { 12345: post } }),
      },
    };
    const stateAfter = {
      byProfileId: {
        [profileId]: Object.assign(profileInitialState, { posts: { 12345: postAfter } }),
      },
    };
    const action = {
      type: actionTypes.POST_IMAGE_CLICKED,
      profileId,
      post: postAfter,
      updateId: postAfter.id,
    };
    deepFreeze(action);
    expect(reducer(stateBefore, action))
      .toEqual(stateAfter);
  });

  it('should handle TOGGLE_VIEW_TYPE action type', () => {
    const stateBefore = {
      ...initialState,
      viewType: 'posts',
    };
    const stateAfter = {
      ...initialState,
      profileId: '123',
      viewType: 'stories',
    };
    const action = {
      type: actionTypes.TOGGLE_VIEW_TYPE,
      profileId: '123',
      viewType: 'stories',
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action))
      .toEqual(stateAfter);
  });

  it('should handle OPEN_PREVIEW action type', () => {
    const stateBefore = {
      ...initialState,
      showStoryPreview: false,
    };
    const stateAfter = {
      ...initialState,
      showStoryPreview: true,
    };
    const action = {
      type: actionTypes.OPEN_PREVIEW,
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action))
      .toEqual(stateAfter);
  });

  it('should handle CLOSE_PREVIEW action type', () => {
    const stateBefore = {
      ...initialState,
      showStoryPreview: true,
    };
    const stateAfter = {
      ...initialState,
      showStoryPreview: false,
    };
    const action = {
      type: actionTypes.CLOSE_PREVIEW,
    };

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(reducer(stateBefore, action))
      .toEqual(stateAfter);
  });

  it('should handle POST_IMAGE_CLOSED action type', () => {
    const post = { id: '12345', text: 'i heart buffer' };
    const postAfter = { ...post, isLightboxOpen: false };
    const stateBefore = {
      byProfileId: {
        [profileId]: Object.assign(profileInitialState, { posts: { 12345: post } }),
      },
    };
    const stateAfter = {
      byProfileId: {
        [profileId]: Object.assign(profileInitialState, { posts: { 12345: postAfter } }),
      },
    };
    const action = {
      type: actionTypes.POST_IMAGE_CLOSED,
      profileId,
      post: postAfter,
      updateId: postAfter.id,
    };
    deepFreeze(action);
    expect(reducer(stateBefore, action))
      .toEqual(stateAfter);
  });

  describe('actions', () => {
    it('handleMobileClick triggers a POST_MOBILE_REMINDER action', () => {
      const post = { id: 'id1' };
      expect(actions.handleMobileClick({ post })).toEqual({
        type: actionTypes.POST_MOBILE_REMINDER,
        updateId: post.id,
      });
    });
  });
});
