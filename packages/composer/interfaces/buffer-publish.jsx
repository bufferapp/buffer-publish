import React from 'react';
import PropTypes from 'prop-types';
import Composer from '../composer/components/App';
import DataImportUtils from '../composer/utils/DataImportUtils';
import AppInitActionCreators from '../composer/action-creators/AppInitActionCreators';
import AppActionCreators from '../composer/action-creators/AppActionCreators';
import AppStore from '../composer/stores/AppStore';
import events from '../composer/utils/Events';
import AppDispatcher from '../composer/dispatcher';
import { ActionTypes } from '../composer/AppConstants';
import NotificationActionCreators from '../composer/action-creators/NotificationActionCreators';

let publishComposerOnSaveCallback;
let publishComposerOnInteractionCallback;
let bootstrappedListener = false;
let prevSelectedProfileId = null;

const ComposerWrapper = ({
  userData,
  profiles,
  enabledApplicationModes,
  environment,
  editMode,
  sentPost,
  post,
  onSave,
  preserveStateOnClose,
  csrfToken,
  onEvent,
  onInteraction,
  draftMode,
  emptySlotMode,
  selectedProfileId,
  tabId,
  campaigns,
  initialCampaignId,
}) => {
  const getSaveButtons = () => {
    if (editMode) return ['SAVE'];
    else if (emptySlotMode) return ['SCHEDULE_POST'];
    else if (draftMode)
      return ['ADD_TO_DRAFTS', 'SHARE_NEXT_DRAFT', 'SCHEDULE_DRAFT'];
    return ['ADD_TO_QUEUE', 'SHARE_NOW', 'SCHEDULE_POST'];
  };

  const saveButtons = getSaveButtons();

  // Add Share Next feature to all users except free.
  const freeUser = userData.is_free_user && !userData.isBusinessTeamMember;
  if (!freeUser && !editMode && !draftMode && !emptySlotMode) {
    saveButtons.splice(2, 2, 'SHARE_NEXT', 'SCHEDULE_POST');
  }

  publishComposerOnSaveCallback = onSave;

  publishComposerOnInteractionCallback = onInteraction;

  if (!bootstrappedListener && onEvent) {
    events.subscribe('*', onEvent);
    bootstrappedListener = true;
  }

  // Get the 'preserve state' setting from the last time the composer was open
  const prevPreserveStateOnClose = AppStore.getOptions().preserveStateOnClose;

  const options = {
    canSelectProfiles: !editMode && !emptySlotMode,
    saveButtons,
    position: { margin: '0 auto' },
    onSave,
    prevPreserveStateOnClose,
    preserveStateOnClose: emptySlotMode ? false : preserveStateOnClose,
    sentPost,
  };

  const subprofileId = post ? post.subprofile_id : undefined;

  const initialCampaignDetails = initialCampaignId
    ? { id: initialCampaignId }
    : undefined;

  const metaData = {
    application: 'WEB_DASHBOARD',
    environment: `${environment === 'development' ? 'local' : 'production'}`,
    should_enable_fb_autocomplete:
      userData.features &&
      userData.features.includes('mc_facebook_autocomplete'),
    enable_twitter_march_18_changes:
      userData.features &&
      userData.features.includes('twitter-march-18-changes'),
    hasIGLocationTaggingFeature:
      userData.features &&
      userData.features.includes('instagram-location-tagging'),
    // TODO: make should_use_new_twitter_autocomplete dynamic based on the
    // value of enabledApplicationModes.includes('web-twitter-typeahead-autocomplete')
    isOnProTrial: userData.isOnProTrial,
    should_use_new_twitter_autocomplete: true,
    updateId: post ? post.id : undefined,
    update: { ...post, images: post.imageUrls },
    subprofileId,
    due_at: post ? post.due_at : undefined,
    scheduled_at: post ? post.scheduled_at : undefined,
    pinned: post ? post.pinned : undefined,
    disable_telemetry: false,
    should_show_rollout_tooltip: false,
    commentEnabled: post.commentEnabled,
    commentText: post.commentText,
    shopgridLink: post.shopgridLink,
    tabId,
    emptySlotMode,
    draftMode,
    campaignDetails: post?.campaignDetails || initialCampaignDetails,
    campaigns: campaigns ?? undefined,
  };
  const formattedData = DataImportUtils.formatInputData({
    env: metaData.application,
    data: {
      profiles,
      userData,
      metaData,
      csrfToken,
      update: { ...post, images: post.imageUrls },
      imageDimensionsKey: userData.imageDimensionsKey,
      subprofileId,
    },
  });

  if (!prevSelectedProfileId) {
    prevSelectedProfileId = selectedProfileId;
  } else if (selectedProfileId !== prevSelectedProfileId) {
    AppActionCreators.resetSelectedProfiles(formattedData.profilesData);
    prevSelectedProfileId = selectedProfileId;
  }

  return (
    <Composer
      profilesData={formattedData.profilesData}
      userData={formattedData.userData}
      metaData={formattedData.metaData}
      imageDimensionsKey={formattedData.imageDimensionsKey}
      options={options}
      onNewPublish
      hasIGDirectFlip={formattedData.userData.has_ig_direct_flip}
      isFreeUser={formattedData.userData.isFreeUser}
      csrfToken={csrfToken}
      draftMode={draftMode}
    />
  );
};

ComposerWrapper.propTypes = {
  userData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    s3_upload_signature: PropTypes.shape({}).isRequired,
    uses_24h_time: PropTypes.bool.isRequired,
    week_starts_monday: PropTypes.bool.isRequired,
    profile_groups: PropTypes.PropTypes.array,
    is_free_user: PropTypes.bool.isRequired,
    skip_empty_text_alert: PropTypes.bool.isRequired,
    is_business_user: PropTypes.bool.isRequired,
    imageDimensionsKey: PropTypes.string.isRequired,
    has_simplified_free_plan_ux: PropTypes.bool.isRequired,
    has_ig_direct_flip: PropTypes.bool.isRequired,
  }).isRequired,
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  enabledApplicationModes: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSave: PropTypes.func.isRequired,
  preserveStateOnClose: PropTypes.bool.isRequired,
  environment: PropTypes.string.isRequired,
  editMode: PropTypes.bool.isRequired,
  draftMode: PropTypes.bool.isRequired,
  sentPost: PropTypes.bool,
  emptySlotMode: PropTypes.bool,
  post: PropTypes.shape({}).isRequired,
  csrfToken: PropTypes.string.isRequired,
  onEvent: PropTypes.func,
  selectedProfileId: PropTypes.string,
  onInteraction: PropTypes.func,
  tabId: PropTypes.string.isRequired,
};

ComposerWrapper.defaultProps = {
  userData: {
    has_simplified_free_plan_ux: false,
  },
  onEvent: null,
  profiles: [],
  enabledApplicationModes: [],
  csrfToken: '1234', // dummy string for now since MC requires csrfToken
  post: {},
  editMode: false,
  draftMode: false,
  sentPost: false,
  emptySlotMode: false,
  selectedProfileId: null,
  onInteraction: () => {},
};

events.on('saved-drafts', () => {
  AppInitActionCreators.softResetData();
  publishComposerOnSaveCallback();
});

events.on('start-trial', ({ message, removeScope }) => {
  // reformat new userData
  const userData = DataImportUtils.formatUserData(null, { userData: message });
  AppInitActionCreators.resetUserData(userData);

  if (removeScope) {
    NotificationActionCreators.removeAllNotificationsByScope(removeScope);
  }

  // Trigger the comment toggle as the commentEnabled property
  // will not be updated until the composer is reopened
  AppDispatcher.handleViewAction({
    actionType: ActionTypes.COMPOSER_UPDATE_DRAFTS_TOGGLE_COMMENT,
    commentEnabled: true,
  });
});

events.on('action-taken', message => {
  publishComposerOnInteractionCallback(message);
});

events.on('backdrop-clicked', () => {
  AppActionCreators.markAppAsNotLoaded();
});

export default ComposerWrapper;
