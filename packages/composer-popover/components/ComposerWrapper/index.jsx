import React, { lazy, Suspense } from 'react';
import { connect } from 'react-redux';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { actions as trialActions } from '@bufferapp/publish-trial';
import { actions as analyticsActions } from '@bufferapp/publish-analytics-middleware';
// import { bufferPublishComposer as Composer } from '@bufferapp/publish-composer';

const Composer = lazy(() =>
  import(
    /* webpackChunkName: "composer" */ '@bufferapp/publish-composer/interfaces/buffer-publish'
  )
);

const ConnectedComposer = props => (
  <Suspense fallback={<div>Loading...</div>}>
    <Composer {...props} />
  </Suspense>
);

const getProfiles = (state, selectedProfileId) => {
  let { profiles } = state.profileSidebar;

  if (selectedProfileId) {
    profiles = profiles.map(profile => ({
      ...profile,
      open: profile.id === selectedProfileId,
    }));
  }

  return profiles;
};

export default connect(
  (state, ownProps) => {
    if (state.appSidebar && state.profileSidebar) {
      const { type } = ownProps;
      let {
        profileSidebar: { selectedProfileId },
      } = state;
      const postId = state[type].editingPostId;
      let options = {};

      switch (type) {
        case 'drafts':
          options = {
            editMode: state.drafts.editMode,
            post: state.drafts.byProfileId[selectedProfileId].drafts[postId],
            draftMode: state.drafts.draftMode,
          };
          break;
        case 'queue':
          options = {
            editMode: state.queue.editMode,
            emptySlotMode: state.queue.emptySlotMode,
            post: state.queue.emptySlotMode
              ? state.queue.emptySlotData
              : state.queue.byProfileId[selectedProfileId].posts[postId],
          };
          break;
        case 'campaign': {
          const posts = state.campaign.campaignPosts;
          const post = posts.find(p => p.id === postId);
          ({ selectedProfileId } = state.campaign);

          options = {
            editMode: state.campaign.editMode,
            post: post?.content || {},
            initialCampaignId: state.campaign.campaign?.id || null,
          };
          break;
        }
        case 'sent':
          options = {
            editMode: state.sent.editMode,
            sentPost: true,
            post: {
              ...state.sent.byProfileId[selectedProfileId].posts[postId],
              scheduled_at: null,
              pinned: null,
            },
          };
          break;
        case 'pastReminders':
          options = {
            editMode: state.pastReminders.editMode,
            sentPost: true,
            post: {
              ...state.pastReminders.byProfileId[selectedProfileId].posts[postId],
              scheduled_at: null,
              pinned: null,
            }, 
          };
          break;
        default:
          return;
      }
      return {
        userData: state.appSidebar.user,
        profiles: getProfiles(state, selectedProfileId),
        enabledApplicationModes: state.temporaryBanner.enabledApplicationModes,
        environment: state.environment.environment,
        editMode: false,
        draftMode: null,
        selectedProfileId,
        tabId: state.tabs.tabId,
        campaigns: state.campaignsList.campaigns ?? [],
        ...options,
      };
    }
    return {};
  },
  dispatch => ({
    onEvent: (type, data) => {
      dispatch({ type: 'COMPOSER_EVENT', eventType: type, data });
    },
    onInteraction: ({ message }) => {
      switch (message.action) {
        case 'COMMENT_ENABLED':
          dispatch(modalsActions.showInstagramFirstCommentModal(message));
          break;
        case 'SHOW_IG_FIRST_COMMENT_PRO_TRIAL_MODAL':
          dispatch(
            modalsActions.showInstagramFirstCommentProTrialModal({
              source: 'ig_first_comment_toggle',
            })
          );
          break;
        case 'SHOW_PRO_UPGRADE_MODAL':
          dispatch(
            modalsActions.showSwitchPlanModal({
              source: 'ig_first_comment_toggle',
              plan: 'pro',
            })
          );
          break;
        case 'START_PRO_TRIAL':
          dispatch(
            trialActions.handleStartProTrial({
              scope: message.scope,
              source: message.source,
            })
          );
          break;
        case 'SEGMENT_TRACKING':
          dispatch(
            analyticsActions.trackEvent(message.eventName, message.metadata)
          );
          break;
        default:
          break;
      }
    },
  })
)(ConnectedComposer);
