// component vs. container https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
import { connect } from 'react-redux';
import { actions as campaignListActions } from '@bufferapp/publish-campaigns-list';
// load the presentational component
import { actions } from './reducer';
import SentPosts from './components/SentPosts';

const servicesWithCommentFeature = ['instagram'];

const formatPostLists = posts => {
  const postLists = [];
  let day;
  let newList;
  const orderedPosts =
    posts && typeof posts === 'object'
      ? Object.values(posts).sort((a, b) => b.due_at - a.due_at)
      : [];

  orderedPosts.forEach(post => {
    post.hasCommentEnabled =
      servicesWithCommentFeature.indexOf(post.profile_service) !== -1;
    if (post.day !== day) {
      day = post.day;
      newList = { listHeader: day, posts: [post] };
      postLists.push(newList);
    } else {
      // if same day add to posts array of current list
      newList.posts.push(post);
    }
  });
  return postLists;
};

// default export = container
export default connect(
  (state, ownProps) => {
    const { profileId } = ownProps;
    const currentProfile = state.sent.byProfileId[profileId];
    if (currentProfile) {
      const profileData = state.profileSidebar.profiles.find(
        p => p.id === profileId
      );

      return {
        header: currentProfile.header,
        loading: currentProfile.loading,
        loadingMore: currentProfile.loadingMore,
        moreToLoad: currentProfile.moreToLoad,
        page: currentProfile.page,
        postLists: formatPostLists(currentProfile.posts),
        total: currentProfile.total,
        profileServiceType: profileData.service_type,
        profileService: profileData.service,
        showComposer: state.sent.showComposer,
        editMode: state.sent.editMode,
        isManager: state.profileSidebar.selectedProfile.isManager,
        isBusinessAccount: state.profileSidebar.selectedProfile.business,
        showAnalyzeBannerAfterFirstPost:
          state.profileSidebar.selectedProfile.shouldHideAdvancedAnalytics,
        isLockedProfile: state.profileSidebar.isLockedProfile,
        isDisconnectedProfile:
          state.profileSidebar.selectedProfile.isDisconnected,
        isAnalyzeCustomer: state.appSidebar.user.isAnalyzeCustomer,
        hasFirstCommentFlip: state.appSidebar.user.features
          ? state.appSidebar.user.features.includes('first_comment')
          : false,
        hasCampaignsFeature: state.appSidebar.user.features
          ? state.appSidebar.user.features.includes('campaigns')
          : false,
        linkShortening: state.generalSettings.linkShortening,
        hasBitlyPosts: currentProfile.hasBitlyPosts,
        shouldDisplayBitly: !state?.productFeatures?.isFreeUser,
      };
    }
    return {};
  },
  (dispatch, ownProps) => ({
    onShareAgainClick: ({ post }) => {
      dispatch(
        actions.handleShareAgainClick({
          post,
          profileId: ownProps.profileId,
        })
      );
    },
    onComposerCreateSuccess: () => {
      dispatch(actions.handleComposerCreateSuccess());
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
    onCampaignTagClick: campaignId => {
      dispatch(
        actions.handleCampaignTagClick({
          campaignId,
        })
      );
    },
    fetchSentPosts: () => {
      dispatch(
        actions.fetchSentPosts({
          profileId: ownProps.profileId,
        })
      );
    },
    fetchCampaignsIfNeeded: () => {
      dispatch(campaignListActions.fetchCampaignsIfNeeded());
    },
  })
)(SentPosts);

// export reducer, actions and action types
export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
