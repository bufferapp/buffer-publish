import { connect } from 'react-redux';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { actions as queueActions } from '@bufferapp/publish-queue';
import { formatPostLists } from '@bufferapp/publish-queue/util';
import { campaignEdit } from '@bufferapp/publish-routes';
import { actions } from './reducer';
import ViewCampaign from './components/ViewCampaign';

export default connect(
  (state, ownProps) => {
    return {
      campaign: state.campaign.campaign,
      campaignPosts: state.campaign.campaignPosts
        ? formatPostLists({
            posts: state.campaign.campaignPosts,
            orderBy: 'dueAt',
          })
        : [],
      showComposer: state.campaign.showComposer,
      editMode: state.campaign.editMode,
      editingPostId: state.campaign.editingPostId,
      translations: state.i18n.translations.campaigns.viewCampaign,
      hideAnalyzeReport: state.appSidebar.user.isUsingPublishAsTeamMember,
      isLoading: state.campaign.isLoading,
      campaignId: ownProps.match?.params?.id || state.campaign?.campaignId,
      hasCampaignsFlip: state.appSidebar.user.features
        ? state.appSidebar.user.features.includes('campaigns')
        : false,
    };
  },

  dispatch => ({
    actions: {
      onComposerCreateSuccess: () => {
        dispatch(actions.handleCloseComposer());
      },
      onComposerOverlayClick: () => {
        dispatch(modalsActions.showCloseComposerConfirmationModal());
      },
      onCreatePostClick: campaignId => {
        dispatch(actions.handleOpenComposer({ campaignId, editMode: false }));
      },
      onDeleteCampaignClick: campaign => {
        dispatch(modalsActions.showDeleteCampaignModal(campaign));
      },
      goToAnalyzeReport: campaign => {
        dispatch(actions.goToAnalyzeReport(campaign));
      },
      onEditCampaignClick: campaignId => {
        if (campaignId) {
          dispatch(campaignEdit.goTo({ campaignId }));
        }
      },
      fetchCampaign: ({ campaignId, past }) => {
        dispatch(actions.fetchCampaign({ campaignId, past, fullItems: true }));
      },
    },
    postActions: {
      onEditClick: post => {
        dispatch(
          actions.handleOpenComposer({
            post: post.post,
            profileId: post.post.profileId,
            editMode: true,
          })
        );
      },
      onDeleteConfirmClick: post => {
        dispatch(
          queueActions.handleDeleteConfirmClick({
            post: post.post,
            profileId: post.post.profileId,
          })
        );
        dispatch(
          actions.handleDeleteConfirmClick({
            post: post.post,
          })
        );
      },
      onRequeueClick: post => {
        dispatch(
          queueActions.handleRequeue({
            post: post.post,
            profileId: post.post.profileId,
          })
        );
      },
      onShareNowClick: post => {
        dispatch(
          queueActions.handleShareNowClick({
            post: post.post,
            profileId: post.post.profileId,
          })
        );
        dispatch(
          actions.handleShareNowClick({
            post: post.post,
          })
        );
      },

      onImageClick: post => {
        dispatch(
          actions.handleImageClick({
            post: post.post,
            profileId: post.post.profileId,
          })
        );
      },
      onImageClose: post => {
        dispatch(
          actions.handleImageClose({
            post: post.post,
            profileId: post.post.profileId,
          })
        );
      },
      onImageClickNext: post => {
        dispatch(
          actions.handleImageClickNext({
            post: post.post,
            profileId: post.post.profileId,
          })
        );
      },
      onImageClickPrev: post => {
        dispatch(
          actions.handleImageClickPrev({
            post: post.post,
            profileId: post.post.profileId,
          })
        );
      },
    },
  })
)(ViewCampaign);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
