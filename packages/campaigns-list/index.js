import { connect } from 'react-redux';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import { actions as modalsActions } from '@bufferapp/publish-modals/reducer';
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
      translations: state.i18n.translations.campaigns,
      isUsingPublishAsTeamMember:
        state.appSidebar.user.isUsingPublishAsTeamMember,
      isLoading: state.campaignsList.isLoading,
      hasCampaignsFlip: state.appSidebar.user.features
        ? state.appSidebar.user.features.includes('campaigns')
        : false,
    };
  },
  dispatch => ({
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
    goToAnalyzeReport: () => {
      window.location.assign(`${getURL.getAnalyzeReportUrl()}`);
    },
    onEditCampaignClick: ({ campaignId }) => {
      if (campaignId) {
        dispatch(campaignEdit.goTo({ campaignId }));
      }
    },
    fetchCampaigns: () => {
      dispatch(actions.fetchCampaigns());
    },
  })
)(ListCampaigns);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
