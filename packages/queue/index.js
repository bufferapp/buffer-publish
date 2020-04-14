import { connect } from 'react-redux';
import { actions as profileSidebarActions } from '@bufferapp/publish-profile-sidebar/reducer';
import { actions as dataFetchActions } from '@bufferapp/async-data-fetch';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { actions as campaignListActions } from '@bufferapp/publish-campaigns-list';
import { SEGMENT_NAMES } from '@bufferapp/publish-constants';
import { getURL } from '@bufferapp/publish-server/formatters/src';

import { actions } from './reducer';
import {
  formatPostLists,
  openCalendarWindow,
  isScheduleSlotsAvailable,
} from './util';
import QueuedPosts from './components/QueuedPosts';

export default connect(
  (state, ownProps) => {
    const { profileId } = ownProps;
    const profileQueuePosts = state.queue.byProfileId[profileId];
    const profileData = state.profileSidebar.profiles.find(
      p => p.id === ownProps.profileId
    );
    const { isLockedProfile } = state.profileSidebar;

    const queuePostsArray =
      profileQueuePosts &&
      profileQueuePosts.posts &&
      Object.keys(profileQueuePosts.posts).map(key => {
        return profileQueuePosts.posts[key];
      });

    const hasAtLeastOneReminderPost =
      queuePostsArray &&
      queuePostsArray.some(
        post => post.postDetails && post.postDetails.isInstagramReminder
      );

    if (isLockedProfile) {
      return {
        loading: false,
        isLockedProfile,
      };
    }
    if (profileQueuePosts && profileData) {
      return {
        loading: profileQueuePosts.loading,
        loadingMore: profileQueuePosts.loadingMore,
        moreToLoad: profileQueuePosts.moreToLoad,
        page: profileQueuePosts.page,
        postLists: formatPostLists({
          isManager: profileData.isManager,
          posts: profileQueuePosts.posts,
          scheduleSlotsEnabled: true,
          schedules: profileData.schedules,
          profileTimezone: profileData.timezone,
          weekStartsOnMonday: state.appSidebar.user.week_starts_monday,
          weeksToShow: profileQueuePosts.page + 1,
          hasTwentyFourHourTimeFormat:
            state.appSidebar.user.hasTwentyFourHourTimeFormat,
          profileService: profileData.service,
        }),
        scheduleSlotsIsAvailable: isScheduleSlotsAvailable(
          profileData.schedules
        ),
        draggingEnabled: !profileData.paused,
        showEmptyQueueMessage: false, // @todo: Show this if they have no slots?
        showComposer: state.queue.showComposer,
        environment: state.environment.environment,
        editMode: state.queue.editMode,
        editingPostId: state.queue.editingPostId,
        subprofiles: profileData.subprofiles || [],
        isInstagramProfile: profileData.type === 'instagram',
        isInstagramBusiness: profileData.isInstagramBusiness,
        paused: profileData.paused,
        isManager: profileData.isManager,
        isBusinessAccount: profileData.business,
        hasPushNotifications: profileData.hasPushNotifications,
        hasAtLeastOneReminderPost,
        showInstagramDirectPostingModal:
          state.modals.showInstagramDirectPostingModal,
        isBusinessOnInstagram: state.queue.isBusinessOnInstagram,
        isInstagramLoading: state.queue.isInstagramLoading,
        isDisconnectedProfile:
          state.profileSidebar.selectedProfile.isDisconnected,
        hasFirstCommentFlip: state.appSidebar.user.features
          ? state.appSidebar.user.features.includes('first_comment')
          : false,
        hasCampaignsFeature: state.appSidebar.user.features
          ? state.appSidebar.user.features.includes('campaigns')
          : false,
      };
    }
    return {};
  },

  (dispatch, ownProps) => ({
    onEditClick: post => {
      dispatch(
        actions.handleEditClick({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onEmptySlotClick: post => {
      dispatch(
        actions.handleEmptySlotClick({
          emptySlotData: post,
          profileId: ownProps.profileId,
        })
      );
    },
    onDeleteConfirmClick: post => {
      dispatch(
        actions.handleDeleteConfirmClick({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onRequeueClick: post => {
      dispatch(
        actions.handleRequeue({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onCampaignTagClick: campaignId => {
      dispatch(
        actions.handleCampaignTagClick({
          campaignId,
        })
      );
    },
    onShareNowClick: post => {
      dispatch(
        actions.handleShareNowClick({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onImageClick: post => {
      dispatch(
        actions.handleImageClick({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onImageClose: post => {
      dispatch(
        actions.handleImageClose({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onImageClickNext: post => {
      dispatch(
        actions.handleImageClickNext({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onImageClickPrev: post => {
      dispatch(
        actions.handleImageClickPrev({
          post: post.post,
          profileId: ownProps.profileId,
        })
      );
    },
    onDropPost: (id, timestamp, day) => {
      dispatch(actions.onDropPost(id, timestamp, day, ownProps.profileId));
    },
    onSwapPosts: (postSource, postTarget) => {
      dispatch(actions.onSwapPosts(postSource, postTarget, ownProps.profileId));
    },
    onUnpauseClick: () => {
      dispatch(
        profileSidebarActions.onUnpauseClick({ profileId: ownProps.profileId })
      );
    },
    onComposerPlaceholderClick: () => {
      dispatch(actions.handleComposerPlaceholderClick());
    },
    onComposerCreateSuccess: () => {
      dispatch(actions.handleComposerCreateSuccess());
    },
    onDirectPostingClick: () => {
      dispatch(
        dataFetchActions.fetch({
          name: 'checkInstagramBusiness',
          args: {
            profileId: ownProps.profileId,
            callbackAction: modalsActions.showInstagramDirectPostingModal({
              profileId: ownProps.profileId,
            }),
          },
        })
      );
    },
    onComposerOverlayClick: () => {
      dispatch(
        modalsActions.showCloseComposerConfirmationModal({ page: 'queue' })
      );
    },
    onCheckInstagramBusinessClick: () => {
      dispatch(
        dataFetchActions.fetch({
          name: 'checkInstagramBusiness',
          args: {
            profileId: ownProps.profileId,
            recheck: true,
          },
        })
      );
    },
    onHideInstagramModal: () => {
      dispatch(actions.handleHideInstagramModal());
    },
    onSetRemindersClick: ({ type }) => {
      let cta = '';
      if (type === 'banner') {
        cta = SEGMENT_NAMES.REMINDERS_BANNER;
      }
      if (type === 'post') {
        cta = SEGMENT_NAMES.REMINDERS_POST;
      }
      window.location.assign(
        `${getURL.getRemindersURL({
          profileId: ownProps.profileId,
          cta,
          nextUrl: `profile/${ownProps.profileId}/tab/queue`,
        })}`
      );
    },
    onCalendarClick: weekOrMonth => {
      if (weekOrMonth === 'week' || weekOrMonth === 'month') {
        openCalendarWindow(ownProps.profileId, weekOrMonth);
      }
    },
    fetchCampaignsIfNeeded: () => {
      dispatch(campaignListActions.fetchCampaignsIfNeeded());
    },
  })
)(QueuedPosts);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
