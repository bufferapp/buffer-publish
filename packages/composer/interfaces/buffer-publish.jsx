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
  organizations,
  enabledApplicationModes,
  environment,
  editMode,
  sentPost,
  post,
  onSave,
  preserveStateOnClose,
  shouldResetComposerData,
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
  const showShareNextFeature = organizations.selected?.hasShareNextFeature;
  if (showShareNextFeature && !editMode && !draftMode && !emptySlotMode) {
    saveButtons.splice(2, 2, 'SHARE_NEXT', 'SCHEDULE_POST');
  }

  publishComposerOnSaveCallback = onSave;

  publishComposerOnInteractionCallback = onInteraction;

  if (!bootstrappedListener && onEvent) {
    events.subscribe('*', onEvent);
    bootstrappedListener = true;
  }
  const preserveState = emptySlotMode ? false : preserveStateOnClose;
  // Get the 'preserve state' setting from the last time the composer was open
  const prevPreserveState = AppStore.getOptions().preserveStateOnClose || false;

  // reset data on App constructor
  const shouldResetData = !preserveState || shouldResetComposerData;
  const shouldResetDataOnInit =
    prevPreserveState === false &&
    preserveState !== prevPreserveState &&
    !shouldResetData; // ensure we never call reset twice
  const shouldLoadInitialDataOnInit =
    prevPreserveState !== true ||
    preserveState === false ||
    shouldResetComposerData;

  const options = {
    canSelectProfiles: !editMode && !emptySlotMode,
    saveButtons,
    position: { margin: '0 auto' },
    onSave,
    sentPost,
    preserveStateOnClose: preserveState,
    shouldResetData,
    shouldResetDataOnInit,
    shouldLoadInitialDataOnInit,
  };

  const subprofileId = post ? post.subprofile_id : undefined;

  const initialCampaignDetails = initialCampaignId
    ? { id: initialCampaignId }
    : undefined;

  const metaData = {
    application: 'WEB_DASHBOARD',
    environment: `${environment === 'development' ? 'local' : 'production'}`,
    should_enable_fb_autocomplete: true, // Deprecated features (to delete)
    enable_twitter_march_18_changes: true, // Deprecated features (to delete)
    // TODO: make should_use_new_twitter_autocomplete dynamic based on the
    // value of enabledApplicationModes.includes('web-twitter-typeahead-autocomplete')
    should_use_new_twitter_autocomplete: true,
    updateId: post ? post.id : undefined,
    serviceUpdateId: post ? post.serviceUpdateId : undefined,
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
    isTaggingPageLocation: post.isTaggingPageLocation,
    tabId,
    emptySlotMode,
    draftMode,
    campaignDetails: post?.campaignDetails || initialCampaignDetails,
    campaigns: campaigns ?? undefined,
    editMode,
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
      organizationsData={organizations}
      metaData={formattedData.metaData}
      imageDimensionsKey={formattedData.imageDimensionsKey}
      options={options}
      onNewPublish
      csrfToken={csrfToken}
      draftMode={draftMode}
    />
  );
};

ComposerWrapper.propTypes = {
  userData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    s3_upload_signature: PropTypes.shape({}).isRequired,
    hasTwentyFourHourTimeFormat: PropTypes.bool.isRequired,
    week_starts_monday: PropTypes.bool.isRequired,
    profile_groups: PropTypes.array,
    skip_empty_text_alert: PropTypes.bool.isRequired,
    hasShareNextFeature: PropTypes.bool.isRequired,
    imageDimensionsKey: PropTypes.string.isRequired,
  }).isRequired,
  organizations: PropTypes.shape({}).isRequired,
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
  shouldResetComposerData: PropTypes.bool,
};

ComposerWrapper.defaultProps = {
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
  // reformat new organizationsData
  const organizationsData = message;
  AppInitActionCreators.resetOrganizationsData(organizationsData);

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
