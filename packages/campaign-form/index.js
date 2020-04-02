import { connect } from 'react-redux';
import { actions as campaignActions } from '@bufferapp/publish-campaign';
import { actions } from './reducer';
import CampaignForm from './components/CampaignForm';

export default connect(
  (state, ownProps) => {
    return {
      campaign: state.campaignForm.campaign,
      translations: state.i18n.translations.campaigns.campaignForm,
      isLoading: state.campaignForm.isLoading,
      editMode: ownProps.editMode,
      campaignId:
        ownProps?.match?.params?.id || state?.campaignForm?.campaignId,
      hasCampaignsFlip: state.appSidebar.user.features
        ? state.appSidebar.user.features.includes('campaigns')
        : false,
    };
  },
  dispatch => ({
    onCreateOrUpdateCampaignClick: ({
      campaignId,
      colorSelected,
      campaignName,
      orgId,
      editMode,
    }) => {
      if (editMode) {
        dispatch(
          actions.handleEditCampaignClick({
            id: campaignId,
            name: campaignName,
            color: colorSelected,
            orgId,
          })
        );
      } else {
        dispatch(
          actions.handleCreateCampaignClick({
            name: campaignName,
            color: colorSelected,
          })
        );
      }
    },
    fetchCampaign: ({ campaignId }) => {
      dispatch(campaignActions.fetchCampaign({ campaignId }));
    },
  })
)(CampaignForm);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
