import { connect } from 'react-redux';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { actions as queueActions } from '@bufferapp/publish-queue';
import { formatPostLists } from '@bufferapp/publish-queue/util';
import {
  campaignEdit,
  campaignScheduled,
  campaignSent,
  campaignCreate,
} from '@bufferapp/publish-routes';
import { actions as campaignListActions } from '@bufferapp/publish-campaigns-list';
import { getURL } from '@bufferapp/publish-server/formatters/src';
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
      hideAnalyzeReport: !state.user.canSeeCampaignsReport,
      showCampaignActions: state.user.canModifyCampaigns,
      isLoading: state.campaign.isLoading,
      hideSkeletonHeader: state.campaign.hideSkeletonHeader,
      campaignId: ownProps.match?.params?.id || state.campaign?.campaignId,
      page: state.campaign.page,
      hasCampaignsFlip: state.user.hasCampaignsFeature,
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
      onTabClick: ({ tabId, campaignId }) => {
        if (tabId === 'scheduled') {
          dispatch(campaignScheduled.goTo({ campaignId }));
        }
        if (tabId === 'sent') {
          dispatch(campaignSent.goTo({ campaignId }));
        }
      },
      fetchCampaign: ({ campaignId, past }) => {
        dispatch(actions.fetchCampaign({ campaignId, past, fullItems: true }));
      },
      fetchCampaignsIfNeeded: () => {
        dispatch(campaignListActions.fetchCampaignsIfNeeded());
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
