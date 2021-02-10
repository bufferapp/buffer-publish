import { connect } from 'react-redux';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { actions as queueActions } from '@bufferapp/publish-queue';
import { actions as sentActions } from '@bufferapp/publish-sent';
import { formatPostLists } from '@bufferapp/publish-queue/util';
import {
  campaignEdit,
  campaignScheduled,
  campaignCreate,
} from '@bufferapp/publish-routes';
import { getURL } from '@bufferapp/publish-server/formatters';
import { actions } from './reducer';
import ViewCampaign from './components/ViewCampaign';

export default connect(
  (state, ownProps) => {
    const { campaignPosts } = state.campaign;
    return {
      campaign: state.campaign.campaign,
      campaignPosts:
        campaignPosts.length > 0
          ? formatPostLists({
              posts: campaignPosts,
              orderBy: 'dueAt',
            })
          : [],
      showComposer: state.campaign.showComposer,
      editMode: state.campaign.editMode,
      editingPostId: state.campaign.editingPostId,
      hideAnalyzeReport: !state.organizations.selected?.canSeeCampaignsReport,
      showCampaignActions: state.organizations.selected?.canModifyCampaigns,
      isLoading: state.campaign.isLoading,
      hideSkeletonHeader: state.campaign.hideSkeletonHeader,
      campaignId: ownProps.match?.params?.id || state.campaign?.campaignId,
      page: state.campaign.page,
      hasCampaignsFlip: state.organizations.selected?.hasCampaignsFeature,
      hasAnalyticsOnPosts: state.organizations.selected?.hasAnalyticsOnPosts,
      hasTwitterImpressions:
        state.organizations.selected?.hasTwitterImpressions,
    };
  },

  (dispatch, ownProps) => ({
    actions: {
      onComposerCreateSuccess: () => {
        dispatch(actions.handleCloseComposer());
      },
      onComposerOverlayClick: () => {
        dispatch(
          modalsActions.showCloseComposerConfirmationModal({
            page: 'campaigns',
          })
        );
      },
      onCreateCampaignClick: () => {
        dispatch(campaignCreate.goTo());
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
          dispatch(
            campaignEdit.goTo({
              campaignId,
              from: ownProps.history.location.pathname,
            })
          );
        }
      },
      fetchCampaign: ({ campaignId, past }) => {
        dispatch(actions.fetchCampaign({ campaignId, past, fullItems: true }));
      },
    },
    postActions: {
      onSetRemindersClick: ({ post }) => {
        const nextUrl = campaignScheduled.getRoute({
          campaignId: post.campaignDetails.id,
        });
        const reminderUrl = getURL.getRemindersURL({
          profileId: post.profileId,
          nextUrl,
        });
        window.location.assign(reminderUrl);
      },
      onShareAgainClick: post => {
        dispatch(
          sentActions.handleShareAgainClick({
            post,
            profileId: ownProps.profileId,
          })
        );
      },
      onEditClick: ({ post }) => {
        dispatch(
          actions.handleOpenComposer({
            post,
            profileId: post.profileId,
            editMode: true,
          })
        );
      },
      onDeleteConfirmClick: ({ post }) => {
        dispatch(
          queueActions.handleDeleteConfirmClick({
            post,
            profileId: post.profileId,
          })
        );
        dispatch(
          actions.handleDeleteConfirmClick({
            post,
          })
        );
      },
      onRequeueClick: ({ post }) => {
        dispatch(
          queueActions.handleRequeue({
            post,
            profileId: post.profileId,
          })
        );
      },
      onShareNowClick: ({ post }) => {
        dispatch(
          queueActions.handleShareNowClick({
            post,
            profileId: post.profileId,
          })
        );
        dispatch(
          actions.handleShareNowClick({
            post,
          })
        );
      },
    },
  })
)(ViewCampaign);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
