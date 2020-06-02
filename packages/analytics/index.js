import { connect } from 'react-redux';
import { actions as dataFetchActions } from '@bufferapp/async-data-fetch';

import { actions as settingsAction } from '@bufferapp/publish-general-settings';
import Analytics from './components/Analytics';

const mapStateToProps = state => ({
  profile: state.profileSidebar.selectedProfile,
  isLockedProfile: state.profileSidebar.isLockedProfile,
  isBusinessAccount: state.profileSidebar.selectedProfile.business,
  isInstagramBusiness: state.profileSidebar.selectedProfile.isInstagramBusiness,
  isAnalyticsSupported:
    state.profileSidebar.selectedProfile.isAnalyticsSupported,
  //  TODO: Refactor so we're not pulling this state from drafts
  canStartBusinessTrial: state.drafts.canStartBusinessTrial,
  linkShortening: state.generalSettings.linkShortening,
  hasBitlyPosts: !!state.sent.byProfileId[
    state.profileSidebar.selectedProfile.id
  ].hasBitlyPosts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  /**
   * We pass down these methods so that when the lazy-loaded `AnalyticsList`
   * is mounted it can setup its stores / trigger fetches / etc.
   */
  fetchProfiles() {
    dispatch({ type: 'INIT_PROFILES', forAnalyze: true });
  },
  selectProfile(profile) {
    const {
      id,
      avatarUrl,
      service,
      timezone,
      username,
      organizationId,
    } = profile;
    dispatch({
      // copied from `@bufferapp/analyze-profile-selector/reducer`
      type: 'PROFILE_SELECTOR__SELECT_PROFILE',
      profile: {
        id,
        avatarUrl,
        service,
        timezone,
        username,
        organizationId,
      },
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Analytics);
