import { connect } from 'react-redux';
import { formatPostLists } from '@bufferapp/publish-queue/util';
import { actions as previewActions } from '@bufferapp/publish-story-preview';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
import { SEGMENT_NAMES } from '@bufferapp/publish-constants';
import getCtaProperties from '@bufferapp/publish-analytics-middleware/utils/CtaStrings';

import { actions } from './reducer';
import StoryGroups from './components/StoryGroups';

export default connect(
  (state, ownProps) => {
    const { profileId } = ownProps;
    const currentProfile = state.stories.byProfileId[profileId];
    const profileData = state.profileSidebar.profiles.find(p => p.id === ownProps.profileId);

    if (currentProfile) {
      return {
        loading: currentProfile.loading,
        loadingMore: currentProfile.loadingMore,
        moreToLoad: currentProfile.moreToLoad,
        page: currentProfile.page,
        storyGroups: formatPostLists({
          isManager: profileData.isManager,
          posts: currentProfile.storyPosts,
          scheduleSlotsEnabled: true,
          isSingleSlot: true,
          profileTimezone: profileData.timezone,
          weekStartsOnMonday: state.appSidebar.user.week_starts_monday,
          weeksToShow: currentProfile.page + 1,
          hasTwentyFourHourTimeFormat: state.appSidebar.user.hasTwentyFourHourTimeFormat,
          profileService: profileData.service,
          orderBy: 'scheduledAt',
        }),
        showStoriesComposer: state.stories.showStoriesComposer,
        showStoryPreview: state.stories.showStoryPreview,
        editMode: state.stories.editMode,
        isBusinessAccount: profileData.business,
        userData: state.appSidebar.user,
        translations: state.i18n.translations['story-group-queue'],
      };
    }
    return {};
  },
  (dispatch, ownProps) => ({
    onEmptySlotClick: (storyGroup) => {
      dispatch(actions.handleEmptySlotClick({
        emptySlotData: storyGroup,
        profileId: ownProps.profileId,
      }));
    },
    onComposerPlaceholderClick: () => {
      dispatch(actions.handleComposerPlaceholderClick());
    },
    onEditClick: (storyGroup) => {
      dispatch(actions.handleEditStoryGroupClick({
        storyGroup: storyGroup.post,
        profileId: ownProps.profileId,
      }));
    },
    handleCloseStoriesComposer: () => {
      dispatch(actions.handleCloseStoriesComposer());
    },
    onPreviewClick: ({
      stories, profileId, id, scheduledAt,
    }) => {
      const ctaProperties = getCtaProperties(SEGMENT_NAMES.STORIES_PREVIEW_QUEUE);
      const imageCount = stories.filter(story => story.type === 'image').length;
      const videoCount = stories.filter(story => story.type === 'video').length;
      const noteCount = stories.filter(story => story.note && story.note.length > 0).length;
      const metadata = {
        product: 'publish',
        storyGroupId: id,
        channel: 'instagram',
        channelId: profileId,
        channelServiceId: '',
        mediaCount: imageCount + videoCount,
        imageCount,
        videoCount,
        noteCount,
        scheduledAt,
        ...ctaProperties,
      };
      dispatch(analyticsActions.trackEvent('Story Preview Opened Queue', metadata));
      dispatch(previewActions.handlePreviewClick({
        stories, profileId, id, scheduledAt,
      }));
      dispatch(actions.handlePreviewClick());
    },
    onClosePreviewClick: () => {
      dispatch(actions.handleClosePreviewClick());
    },
    onDeleteConfirmClick: (storyGroup) => {
      dispatch(actions.handleDeleteStoryGroup({
        storyGroup,
        profileId: ownProps.profileId,
      }));
    },
    onShareNowClick: (storyGroup) => {
      dispatch(actions.handleShareNowClick({
        storyGroup: storyGroup.post,
        profileId: ownProps.profileId,
      }));
    },
  }),
)(StoryGroups);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
