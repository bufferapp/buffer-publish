import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import DragMe from '@bufferapp/dragme';
import { AppEnvironments } from '@bufferapp/publish-constants';
import AppStore from '../stores/AppStore';
import ComposerStore from '../stores/ComposerStore';
import NotificationStore from '../stores/NotificationStore';
import {
  NotificationScopes,
  Services,
  ErrorTypes,
  SaveButtonTypes,
  ActionTypes,
} from '../AppConstants';
import AppActionCreators from '../action-creators/AppActionCreators';
import AppInitActionCreators from '../action-creators/AppInitActionCreators';
import ComposerActionCreators from '../action-creators/ComposerActionCreators';
import WebSocket from '@bufferapp/publish-upload-zone/utils/WebSocket';
import { observeStore } from '../utils/StoreUtils';
import AppHooks from '../utils/LifecycleHooks';
import AppStateless from './AppStateless';
import AppDispatcher from '../dispatcher';

function getState() {
  const scheduledAt = ComposerStore.getScheduledAt();

  return {
    profiles: AppStore.getProfiles(),
    appState: AppStore.getAppState(),
    metaData: AppStore.getMetaData(),
    userData: AppStore.getUserData(),
    scheduledAt,
    availableSchedulesSlotsForDay: AppStore.getAvailableSchedulesSlotsForDay(
      scheduledAt
    ),
    isPinnedToSlot: ComposerStore.isPinnedToSlot(),
    visibleNotifications: NotificationStore.getVisibleNotifications(),
  };
}

class App extends React.Component {
  static propTypes = {
    profilesData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        canPostComment: PropTypes.bool,
        serviceName: PropTypes.string.isRequired,
        serviceUsername: PropTypes.string.isRequired,
        serviceFormattedUsername: PropTypes.string.isRequired,
        imagesAvatar: PropTypes.string.isRequired,
        timezone: PropTypes.string.isRequired,
        shouldBeAutoSelected: PropTypes.bool.isRequired,
        shouldShowGridPreview: PropTypes.bool.isRequired,
        isDisabled: PropTypes.bool.isRequired,
        disabledMessage: PropTypes.string,
        serviceType: PropTypes.string.isRequired,
        serviceId: PropTypes.string.isRequired,
        isBusinessProfile: PropTypes.bool.isRequired,
        isContributor: PropTypes.bool,
        isManager: PropTypes.bool.isRequired,
        hasPushNotifications: PropTypes.bool.isRequired,
        profileHasPostingSchedule: PropTypes.bool,
        subprofiles: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            profileId: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            avatar: PropTypes.string.isRequired,
            isShared: PropTypes.bool.isRequired,
            shouldBeAutoSelected: PropTypes.bool.isRequired,
          })
        ).isRequired,
      })
    ).isRequired,

    userData: PropTypes.shape({
      id: PropTypes.string.isRequired,
      s3UploadSignature: PropTypes.shape({
        algorithm: PropTypes.string.isRequired,
        base64Policy: PropTypes.string.isRequired,
        bucket: PropTypes.string.isRequired,
        credentials: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        expires: PropTypes.string.isRequired,
        signature: PropTypes.string.isRequired,
        successActionStatus: PropTypes.string.isRequired,
      }).isRequired,
      canStartProTrial: PropTypes.bool.isRequired,
      isOnProTrial: PropTypes.bool.isRequired,
      uses24hTime: PropTypes.bool.isRequired,
      weekStartsMonday: PropTypes.bool.isRequired,
      isFreeUser: PropTypes.bool.isRequired,
      hasIGDirectFlip: PropTypes.bool.isRequired,
      hasCampaignsFlip: PropTypes.bool.isRequired,
      isProAndUpOrTeamMember: PropTypes.bool.isRequired,
      hasIGLocationTaggingFeature: PropTypes.bool.isRequired,
      hasIGDirectVideoFlip: PropTypes.bool.isRequired,
      isBusinessUser: PropTypes.bool.isRequired,
      shouldAlwaysSkipEmptyTextAlert: PropTypes.bool.isRequired,
      profileGroups: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          profileIds: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        })
      ).isRequired,
      profilesSchedulesSlots: PropTypes.objectOf(
        PropTypes.objectOf(
          PropTypes.arrayOf(
            PropTypes.shape({
              isSlotFree: PropTypes.bool.isRequired,
              timestamp: PropTypes.number.isRequired,
            })
          )
        )
      ),
    }).isRequired,

    metaData: PropTypes.shape({
      environment: PropTypes.string.isRequired,
      appEnvironment: PropTypes.string.isRequired,
      shouldDisplayHelpButton: PropTypes.bool.isRequired,
      shouldEnableFacebookAutocomplete: PropTypes.bool.isRequired,
      shouldUseNewTwitterAutocomplete: PropTypes.bool.isRequired,
      enableTwitterChanges: PropTypes.bool.isRequired,
      disableTelemetry: PropTypes.bool.isRequired,
      shouldShowRolloutTooltip: PropTypes.bool.isRequired,
      updateId: PropTypes.string,
      scheduledAt: PropTypes.number,
      isPinnedToSlot: PropTypes.bool,
      isPrefillingExistingUpdate: PropTypes.bool,
      existingUpdateProfileService: PropTypes.string,
      didUserSetScheduledAt: PropTypes.bool,
      text: PropTypes.string,
      url: PropTypes.string,
      sourceUrl: PropTypes.string,
      via: PropTypes.string,
      images: PropTypes.arrayOf(PropTypes.object),
      video: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        duration: PropTypes.number.isRequired,
        durationMs: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        url: PropTypes.string.isRequired,
        originalUrl: PropTypes.string.isRequired,
        thumbnail: PropTypes.string.isRequired,
        thumbOffset: PropTypes.string.isRequired,
        availableThumbnails: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
      browser: PropTypes.string,
      extensionVersion: PropTypes.string,
      retweetData: PropTypes.shape({
        text: PropTypes.string.isRequired,
        tweetId: PropTypes.string.isRequired,
        userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        userName: PropTypes.string.isRequired,
        userDisplayName: PropTypes.string.isRequired,
        tweetUrl: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired,
        comment: PropTypes.string.isRequired,
      }),
      facebookMentionEntities: PropTypes.arrayOf(
        PropTypes.shape({
          indices: PropTypes.arrayOf(PropTypes.number).isRequired,
          id: PropTypes.number.isRequired,
          name: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
      userTags: PropTypes.arrayOf(
        PropTypes.shape({
          username: PropTypes.string.isRequired,
          x: PropTypes.number.isRequired,
          y: PropTypes.number.isRequired,
        })
      ),
      campaignDetails: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        color: PropTypes.string,
      }),
      locationId: PropTypes.string,
      locationName: PropTypes.string,
      commentEnabled: PropTypes.bool,
      commentText: PropTypes.string,
      shopgridLink: PropTypes.string,
      composerSidebarVisible: PropTypes.bool,
      tabId: PropTypes.string,
      emptySlotMode: PropTypes.bool,
    }).isRequired,

    csrfToken: PropTypes.string.isRequired,
    draftMode: PropTypes.bool.isRequired,
    imageDimensionsKey: PropTypes.string.isRequired,
    onNewPublish: PropTypes.bool,
    options: PropTypes.shape({
      canSelectProfiles: PropTypes.bool.isRequired,
      prevPreserveStateOnClose: PropTypes.bool.isRequired,
      preserveStateOnClose: PropTypes.bool.isRequired,
      saveButtons: PropTypes.arrayOf(
        PropTypes.oneOf(Object.keys(SaveButtonTypes))
      ).isRequired,
      updateId: PropTypes.string,
      position: PropTypes.shape({
        top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        margin: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        marginLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        transition: PropTypes.string,
      }),
      onSave: PropTypes.func,
      sentPost: PropTypes.bool,
    }).isRequired,
  };

  static defaultProps = {
    userData: {
      profileSchedulesSlots: undefined,
      onNewPublish: false,
      hasIGLocationTaggingFeature: false,
      canStartProTrial: false,
      isOnProTrial: false,
      hasIGDirectVideoFlip: false,
      hasCampaignsFlip: false,
      isProAndUpOrTeamMember: false,
    },
    options: {
      onSave: () => {},
      sentPost: false,
    },
    profilesData: {
      isContributor: false,
      canPostComment: false,
      profileHasPostingSchedule: false,
    },
  };

  constructor(props) {
    super(props);

    this.state = getState();
    this.isInitialized = false; // Ensure we load initial data and open web socket only once

    if (!this.props.options.preserveStateOnClose) {
      AppInitActionCreators.resetData();
    }
  }

  componentDidMount() {
    AppStore.addChangeListener(this.onStoreChange);
    NotificationStore.addChangeListener(this.onStoreChange);
    // prevent drop/dragover behavior when dropping a file not in the dropzone
    window.addEventListener('drop', e => e.preventDefault());
    window.addEventListener('dragover', e => e.preventDefault());

    /* Load metadata for cases where the metadata could change (ex. tabId)
       every time composer opens */
    if (!this.isInitialized) this.init();
    else AppInitActionCreators.loadInitialMetaData(this.props.metaData);
    observeStore(AppStore, store => store.getAppState().isLoaded).then(() => {
      if (this.state.metaData.appEnvironment === AppEnvironments.EXTENSION) {
        this.dragMe = new DragMe(
          document.querySelector('.js-enable-dragging'),
          {
            cancel: '.js-disable-dragging',
          }
        );
      }
    });
  }

  componentDidUpdate() {
    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 100);
  }

  componentWillUnmount() {
    AppStore.removeChangeListener(this.onStoreChange);
    NotificationStore.removeChangeListener(this.onStoreChange);
    window.removeEventListener('drop', e => e.preventDefault());
    window.removeEventListener('dragover', e => e.preventDefault());

    if (this.dragMe) this.dragMe.cleanup();
    const { appEnvironment } = AppStore.getMetaData();
    WebSocket.cleanUp(appEnvironment);
  }

  onStoreChange = () => this.setState(getState());

  onAppWrapperClick = e => {
    const isBackdropClicked = e.target === e.currentTarget;
    if (isBackdropClicked) AppHooks.handleBackdropClicked();
  };

  onAppClick = e => {
    const { expandedComposerId } = this.state.appState;
    const isComposerExpanded = expandedComposerId !== null;

    if (!isComposerExpanded || e.defaultPrevented) return;

    // If users mousedown inside the editor, select some text and then mouseup
    // outside the editor, this action will also trigger a click, which would
    // collapse the composer. We double-check a click doesn't follow the action
    // of selecting text before collapsing the composer.
    const isClickFollowingSelection = getSelection().toString().length > 0;
    if (isClickFollowingSelection) return;

    ComposerActionCreators.collapse(expandedComposerId);
  };

  onCloseButtonClick = () => AppActionCreators.closeComposer();

  init = () => {
    const {
      profilesData,
      userData,
      metaData,
      csrfToken,
      draftMode,
      imageDimensionsKey,
      options,
      onNewPublish,
    } = this.props;

    const { preserveStateOnClose, prevPreserveStateOnClose = false } = options;

    /**
     * When `options.prevPreserveStateOnClose === false` let's reset the data.
     * (This ensures the state from editing a post doesn't remain when clicking
     * to compose a new one.)
     */
    if (
      prevPreserveStateOnClose === false &&
      preserveStateOnClose !== prevPreserveStateOnClose
    ) {
      AppInitActionCreators.resetData();
    }

    /**
     * And since we're sometimes preserving state with options.preserveStateOnClose,
     * we don't want to load initial data *again* when state was preserved. Only load
     * initial data again if the previous instance had its stores reset on close, or if
     * this new instance had its stores reset on init.
     */
    const shouldLoadInitialData =
      prevPreserveStateOnClose !== true || preserveStateOnClose === false;

    if (shouldLoadInitialData) {
      AppInitActionCreators.loadInitialData({
        profilesData,
        userData,
        metaData,
        csrfToken,
        draftMode,
        imageDimensionsKey,
        options,
        onNewPublish,
      });
    } else {
      AppDispatcher.handleViewAction({
        actionType: ActionTypes.APP_RECEIVE_OPTIONS,
        options,
      });
    }

    this.isInitialized = true;
  };

  render() {
    if (!this.state.appState.isLoaded) return null;

    const {
      canSelectProfiles,
      saveButtons,
      position = null,
    } = this.props.options;

    const topLevelNotificationContainerExcludedScopes = [
      NotificationScopes.BOARD_CREATION,
      NotificationScopes.MC_OMNIBOX_EDIT_NOTICE,
      NotificationScopes.UPDATE_SAVING_AGGREGATE,
      NotificationScopes.MC_ROLLOUT_INFO,
      NotificationScopes.TWITTER_MAX_ONE_PROFILE_SELECTED,
      NotificationScopes.TWITTER_DUPLICATE_CONTENT_WARNING,
      ...Services.map(
        service => `${NotificationScopes.PROFILE_QUEUE_LIMIT}-${service.name}`
      ),
      ...Services.map(
        service => `${NotificationScopes.UPDATE_SAVING}-${service.name}`
      ),
      ...Services.map(
        service =>
          `${NotificationScopes.UPDATE_SAVING}-${ErrorTypes.INLINE}-${service.name}`
      ),
      ...Services.map(
        service =>
          `${NotificationScopes.COMPOSER_NOTICE_NOT_PREFILLED}-${service.name}`
      ),
      NotificationScopes.COMPOSER_FACEBOOK_AUTOCOMPLETE_DISABLED,
    ];

    const areAllDraftsSaved = ComposerStore.areAllDraftsSaved();

    return (
      <AppStateless
        onAppWrapperClick={this.onAppWrapperClick}
        onAppClick={this.onAppClick}
        onCloseButtonClick={this.onCloseButtonClick}
        draggingAnchorRef={ref => {
          this.draggingAnchor = ref;
        }}
        appElementRef={ref => {
          this.appElement = ref;
        }}
        metaData={this.state.metaData}
        onNewPublish={this.props.onNewPublish}
        position={position}
        canSelectProfiles={canSelectProfiles}
        appState={this.state.appState}
        profiles={this.state.profiles}
        userData={this.state.userData}
        scheduledAt={this.state.scheduledAt}
        visibleNotifications={this.state.visibleNotifications}
        topLevelNotificationContainerExcludedScopes={
          topLevelNotificationContainerExcludedScopes
        }
        areAllDraftsSaved={areAllDraftsSaved}
        saveButtons={saveButtons}
        isPinnedToSlot={this.state.isPinnedToSlot}
        availableSchedulesSlotsForDay={this.state.availableSchedulesSlotsForDay}
        sentPost={this.props.options.sentPost}
        draftMode={this.props.draftMode}
        hasCampaignsFlip={this.props.hasCampaignsFlip}
      />
    );
  }
}

export default App;
