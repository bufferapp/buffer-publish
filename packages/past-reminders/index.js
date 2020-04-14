// component vs. container https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
import { connect } from 'react-redux';
import { actions as previewActions } from '@bufferapp/publish-story-preview';
import { actions as campaignListActions } from '@bufferapp/publish-campaigns-list';
// load the presentational component
import { actions } from './reducer';
import PastRemindersWrapper from './components/PastRemindersWrapper';
import { header, subHeader } from './components/PastRemindersPosts/postData';

const orderPosts = posts =>
  posts && typeof posts === 'object'
    ? Object.values(posts).sort((a, b) => b.due_at - a.due_at)
    : [];

const preparePosts = orderedPosts => {
  let day;
  let newList;
  const result = [];

  orderedPosts.forEach(post => {
    if (post.storyDetails) {
      post.postDetails = post.storyDetails;
    }

    if (post.day !== day) {
      day = post.day;
      newList = { listHeader: day, posts: [post] };
      result.push(newList);
    } else {
      // if same day add to posts array of current list
      newList.posts.push(post);
    }
  });

  return result;
};

const formatPostLists = posts => {
  const orderedPosts = orderPosts(posts);
  const postLists = preparePosts(orderedPosts);
  return postLists;
};

// default export = container
export default connect(
  (state, ownProps) => {
    const { profileId } = ownProps;
    const currentProfile = state.pastReminders.byProfileId[profileId];

    if (currentProfile) {
      return {
        header,
        subHeader,
        viewType: state.pastReminders.viewType,
        loading: currentProfile.loading,
        loadingMore: currentProfile.loadingMore,
        moreToLoad: currentProfile.moreToLoad,
        page: currentProfile.page,
        postLists: formatPostLists(currentProfile.posts),
        total: currentProfile.total,
        showComposer: state.pastReminders.showComposer,
        showStoriesComposer: state.pastReminders.showStoriesComposer,
        editMode: state.pastReminders.editMode,
        isManager: state.profileSidebar.selectedProfile.isManager,
        isBusinessAccount: state.profileSidebar.selectedProfile.business,
        isLockedProfile: state.profileSidebar.isLockedProfile,
        isDisconnectedProfile:
          state.profileSidebar.selectedProfile.isDisconnected,
        userData: state.appSidebar.user,
        showStoryPreview: state.pastReminders.showStoryPreview,
      };
    }
    return {};
  },
  (dispatch, ownProps) => ({
    onShareAgainClick: ({ post }, viewType) => {
      if (viewType && viewType === 'stories') {
        dispatch(
          actions.handleShareStoryGroupAgain({
            post,
            profileId: ownProps.profileId,
          })
        );
      } else {
        dispatch(
          actions.handleShareAgainClick({
            post,
            profileId: ownProps.profileId,
          })
        );
      }
    },
    onComposerCreateSuccess: () => {
      dispatch(actions.handleComposerCreateSuccess());
    },
    handleCloseStoriesComposer: () => {
      dispatch(actions.handleCloseStoriesComposer());
    },
    onMobileClick: ({ post }, viewType) => {
      if (viewType && viewType === 'stories') {
        dispatch(
          actions.handleStoryGroupMobileClick({
            post,
            profileId: ownProps.profileId,
          })
        );
      } else {
        dispatch(
          actions.handleMobileClick({
            post,
          })
        );
      }
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
    onToggleViewType: viewType => {
      dispatch(
        actions.handleToggleViewType({
          profileId: ownProps.profileId,
          viewType,
        })
      );
    },
    onPreviewClick: ({ stories, profileId, id, scheduledAt, serviceId }) => {
      dispatch(
        previewActions.handlePreviewClick({
          stories,
          profileId,
          id,
          scheduledAt,
        })
      );
      dispatch(actions.handlePreviewClick());
    },
    onClosePreviewClick: () => {
      dispatch(actions.handleClosePreviewClick());
    },
    fetchCampaignsIfNeeded: () => {
      dispatch(campaignListActions.fetchCampaignsIfNeeded());
    },
  })
)(PastRemindersWrapper);

// export reducer, actions and action types
export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
