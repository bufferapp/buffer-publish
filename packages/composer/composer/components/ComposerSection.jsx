import React from 'react';
import PropTypes from 'prop-types';
import uniqBy from 'lodash.uniqby';
import AppStore from '../stores/AppStore';
import ComposerStore from '../stores/ComposerStore';
import AppActionCreators from '../action-creators/AppActionCreators';
import { NotificationScopes } from '../AppConstants';
import Composer from './Composer';
import ProductRolloutTooltip from './ProductRolloutTooltip';
import NotificationContainer from './NotificationContainer';
import styles from './css/ComposerSection.css';

const getComposerState = () => ({
  enabledDrafts: ComposerStore.getEnabledDrafts(),
  draftsSharedData: ComposerStore.getDraftsSharedData(),
  omniDraft: ComposerStore.getDraft('omni'),
  forceEditorFocus: ComposerStore.getMeta().forceEditorFocus,
});

/* eslint-disable react/prop-types */
const ComposerComponent = ({
  draft,
  index,
  state,
  profiles,
  organizations,
  isOmniboxEnabled,
  enabledDrafts,
  AppStore,
  visibleNotifications,
  appState,
  draftsSharedData,
  areAllDraftsSaved,
  selectedProfiles,
  shouldEnableFacebookAutocomplete,
  shouldShowInlineSubprofileDropdown,
  composerPosition,
  draftMode,
}) => {
  const canUserPostToMultipleNetworks =
    uniqBy(profiles, p => p.service.name).length > 1;
  const showRolloutTooltip =
    AppStore.getOptions().canSelectProfiles &&
    canUserPostToMultipleNetworks &&
    (isOmniboxEnabled || index === enabledDrafts.length - 1);

  const children = showRolloutTooltip ? (
    <ProductRolloutTooltip
      visibleNotifications={visibleNotifications}
      isOmniboxEnabled={isOmniboxEnabled}
    />
  ) : null;

  const {
    hasCustomIgVideoCoverFeature,
    hasFirstCommentFeature,
    hasHashtagManagerFeature,
    hasGridFeature,
    canStartProTrial,
    hasUserTagFeature,
  } = organizations?.selected || {};

  // When focus should be forced, figure out *which* editor instance to force-focus
  const forceEditorInstanceFocus =
    state.forceEditorFocus &&
    (isOmniboxEnabled || appState.expandedComposerId === draft.id);

  return (
    <Composer
      appState={appState}
      draft={draft}
      key={draft.id}
      enabledDrafts={enabledDrafts}
      draftsSharedData={draftsSharedData}
      profiles={profiles}
      organizations={organizations}
      expandedComposerId={
        isOmniboxEnabled ? draft.id : appState.expandedComposerId
      }
      visibleNotifications={visibleNotifications}
      areAllDraftsSaved={areAllDraftsSaved}
      selectedProfiles={selectedProfiles}
      shouldEnableFacebookAutocomplete={shouldEnableFacebookAutocomplete}
      shouldShowInlineSubprofileDropdown={shouldShowInlineSubprofileDropdown}
      composerPosition={composerPosition}
      forceEditorFocus={forceEditorInstanceFocus}
      canStartProTrial={canStartProTrial}
      hasGridFeature={hasGridFeature}
      hasUserTagFeature={hasUserTagFeature}
      hasCustomIgVideoCoverFeature={hasCustomIgVideoCoverFeature}
      hasFirstCommentFeature={hasFirstCommentFeature}
      hasHashtagManagerFeature={hasHashtagManagerFeature}
      draftMode={draftMode}
    >
      {children}
    </Composer>
  );
};

/* eslint-enable react/prop-types */

class ComposerSection extends React.Component {
  state = getComposerState();

  componentDidMount = () => ComposerStore.addChangeListener(this.onStoreChange);

  componentWillUnmount = () =>
    ComposerStore.removeChangeListener(this.onStoreChange);

  onStoreChange = () => this.setState(getComposerState());

  onTwitterMaxProfileNotificationClose = () => {
    AppActionCreators.rememberTwitterMaxProfileNotificationClosedOnce();
  };

  render() {
    const { enabledDrafts, draftsSharedData, omniDraft } = this.state;

    const {
      appState,
      profiles,
      organizations,
      visibleNotifications,
      areAllDraftsSaved,
      selectedProfiles,
      shouldEnableFacebookAutocomplete,
      shouldShowInlineSubprofileDropdown,
      isOmniboxEnabled,
      composerPosition,
      draftMode,
    } = this.props;

    const hasEnabledDrafts = enabledDrafts.length > 0 || isOmniboxEnabled;
    const { composersHaveBeenExpanded } = appState;

    const twitterMaxProfileNotificationClassNames = {
      container: styles.twitterMaxProfileNotificationContainer,
      notification: `${styles.twitterMaxProfileNotification} bi-notification`,
      notificationCloseButton: styles.twitterMaxProfileNotificationCloseButton,
    };

    return (
      <section className={styles.composerSection}>
        {!hasEnabledDrafts && (
          <div className={styles.emptyState}>
            {composersHaveBeenExpanded
              ? 'Your work has been saved. Please select a channel above to continue.'
              : 'Please select a channel above to continue.'}
          </div>
        )}

        <NotificationContainer
          visibleNotifications={visibleNotifications}
          scope={NotificationScopes.TWITTER_MAX_ONE_PROFILE_SELECTED}
          classNames={twitterMaxProfileNotificationClassNames}
          onClose={this.onTwitterMaxProfileNotificationClose}
          showCloseIcon
        />

        {isOmniboxEnabled && (
          <ComposerComponent
            {...{
              state: this.state,
              draft: omniDraft,
              profiles,
              organizations,
              isOmniboxEnabled,
              enabledDrafts,
              AppStore,
              visibleNotifications,
              appState,
              draftsSharedData,
              areAllDraftsSaved,
              selectedProfiles,
              shouldEnableFacebookAutocomplete,
              shouldShowInlineSubprofileDropdown,
              composerPosition,
              draftMode,
            }}
          />
        )}

        {!isOmniboxEnabled &&
          enabledDrafts.map((draft, index) => (
            <ComposerComponent
              key={draft.id}
              {...{
                state: this.state,
                draft,
                index,
                profiles,
                organizations,
                isOmniboxEnabled,
                enabledDrafts,
                AppStore,
                visibleNotifications,
                appState,
                draftsSharedData,
                areAllDraftsSaved,
                selectedProfiles,
                shouldEnableFacebookAutocomplete,
                shouldShowInlineSubprofileDropdown,
                composerPosition,
                draftMode,
              }}
            />
          ))}
      </section>
    );
  }
}

ComposerSection.propTypes = {
  appState: PropTypes.object.isRequired,
  visibleNotifications: PropTypes.array.isRequired,
  areAllDraftsSaved: PropTypes.bool.isRequired,
  shouldEnableFacebookAutocomplete: PropTypes.bool.isRequired,
  shouldShowInlineSubprofileDropdown: PropTypes.bool.isRequired,
  profiles: PropTypes.array,
  organizations: PropTypes.object,
  selectedProfiles: PropTypes.array,
  isOmniboxEnabled: PropTypes.bool,
  composerPosition: PropTypes.object,
  draftMode: PropTypes.bool,
};

ComposerSection.defaultProps = {
  isOmniboxEnabled: null,
  composerPosition: null,
  draftMode: false,
  organizations: {},
};

export default ComposerSection;
