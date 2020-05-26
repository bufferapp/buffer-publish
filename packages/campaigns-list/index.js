import { connect } from 'react-redux';
import { actions as modalsActions } from '@bufferapp/publish-modals/reducer';
import { actions as campaignActions } from '@bufferapp/publish-campaign/reducer';
import {
  campaignEdit,
  campaignCreate,
  campaignScheduled,
} from '@bufferapp/publish-routes';
import { actions } from './reducer';
import ListCampaigns from './components/ListCampaigns';

export default connect(
  state => {
    return {
      campaigns: state.campaignsList.campaigns,
      showCampaignActions: !state.user.isUsingPublishAsTeamMember,
      isLoading: state.campaignsList.isLoading,
      hasCampaignsFlip: state.user.features
        ? state.user.features.includes('campaigns')
        : false,
    };
  },
  (dispatch, ownProps) => ({
    onViewCampaignClick: ({ campaignId }) => {
      if (campaignId) {
        dispatch(campaignScheduled.goTo({ campaignId }));
      }
    },
    onOpenCreateCampaignClick: () => {
      dispatch(campaignCreate.goTo());
    },
    onDeleteCampaignClick: campaign => {
      dispatch(modalsActions.showDeleteCampaignModal(campaign));
    },
    goToAnalyzeReport: campaign => {
      dispatch(campaignActions.goToAnalyzeReport(campaign));
    },
    onEditCampaignClick: ({ campaignId }) => {
      if (campaignId) {
        dispatch(
          campaignEdit.goTo({
            campaignId,
            from: ownProps.history.location.pathname,
          })
        );
      }
    },
    fetchCampaignsIfNeeded: () => {
      dispatch(actions.fetchCampaignsIfNeeded());
    },
  })
)(ListCampaigns);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
