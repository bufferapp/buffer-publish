import { connect } from 'react-redux';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { formatPostLists } from '@bufferapp/publish-queue/util';
import { campaignEdit } from '@bufferapp/publish-routes';
import { actions } from './reducer';
import ViewCampaign from './components/ViewCampaign';

export default connect(
  (state, ownProps) => {
    let campaignPosts = [];
    if (state.campaign.campaign.items) {
      campaignPosts = formatPostLists({
        isManager: true, // temporary value
        posts: state.campaign.campaign.items,
        orderBy: 'dueAt',
      });
    }
    return {
      campaign: state.campaign.campaign,
      campaignPosts,
      showComposer: state.campaign.showComposer,
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
    onComposerCreateSuccess: () => {
      dispatch(actions.handleCloseComposer());
    },
    onComposerOverlayClick: () => {
      dispatch(modalsActions.showCloseComposerConfirmationModal());
    },
    onCreatePostClick: campaignId => {
      dispatch(actions.handleOpenComposer(campaignId));
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
  })
)(ViewCampaign);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
