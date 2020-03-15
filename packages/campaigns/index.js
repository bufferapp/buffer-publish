import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { getURL } from '@bufferapp/publish-server/formatters/src';
import {
  getCampaignPageParams,
  campaignsCreateRoute,
  campaignsPageRoute,
  campaignPages,
  generateCampaignPageRoute,
} from '@bufferapp/publish-routes';
import { actions as modalActions } from '@bufferapp/publish-modals/reducer';
import { actions as deleteCampaignModalActions } from '@bufferapp/publish-delete-campaign-modal/reducer';
import { actions } from './reducer';
import CampaignsPage from './components/CampaignsPage';

export default connect(
  (state, ownProps) => {
    const { campaignId, selectedPage = campaignPages.VIEW_ALL_CAMPAIGNS } =
      getCampaignPageParams({ path: ownProps.history.location.pathname }) || {};
    return {
      campaigns: state.campaigns.campaigns,
      currentCampaign: state.campaigns.currentCampaign,
      translations: state.i18n.translations.campaigns,
      isUsingPublishAsTeamMember:
        state.appSidebar.user.isUsingPublishAsTeamMember,
      isSaving: state.campaigns.isSaving,
      campaignId,
      selectedPage,
      hasCampaignsFlip: state.appSidebar.user.features
        ? state.appSidebar.user.features.includes('campaigns')
        : false,
    };
  },
  dispatch => ({
    onOpenCreateCampaignClick: () => {
      dispatch(push(campaignsCreateRoute));
    },
    onCancelCreateCampaignClick: () => {
      dispatch(push(campaignsPageRoute));
    },
    onCreateCampaignClick: ({ colorSelected, campaignName }) => {
      dispatch(
        actions.handleCreateCampaignClick({
          name: campaignName,
          color: colorSelected,
        })
      );
    },
    onCreatePostClick: campaignId => {
      dispatch(actions.handleOpenComposer(campaignId));
    },
    goToAnalyzeReport: () => {
      window.location.assign(`${getURL.getAnalyzeReportUrl()}`);
    },
    onEditCampaignClick: campaignId => {
      if (campaignId) {
        const routeObj = {
          campaignId,
          selectedPage: campaignPages.EDIT_CAMPAIGN,
        };
        dispatch(push(generateCampaignPageRoute(routeObj)));
      }
    },
    onViewCampaignClick: campaignId => {
      if (campaignId) {
        const routeObj = {
          campaignId,
          selectedPage: campaignPages.VIEW_CAMPAIGN,
        };
        dispatch(push(generateCampaignPageRoute(routeObj)));
      }
    },
    fetchCampaign: campaignId => {
      dispatch(actions.fetchCampaign(campaignId));
    },
    onDeleteCampaignClick: campaign => {
      dispatch(deleteCampaignModalActions.handleDeleteClick(campaign));
      dispatch(modalActions.showDeleteCampaignModal());
    },
  })
)(CampaignsPage);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
