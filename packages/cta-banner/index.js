import { connect } from 'react-redux';
import { actions } from './reducer'

import BillingUpdateCTABanner from './components/BillingUpgradeCTABanner';

export default connect(
  state => ({
    trial: state.appSidebar.user && state.appSidebar.user.trial,
    translations: state.i18n.translations['billing-upgrade-cta-banner'],
    profileCount: state.ctaBanner.profileCount,
    isBusinessUser: state.appSidebar.user && state.appSidebar.user.is_business_user,
  }),
  (dispatch) => ({
    onClickManageBilling: () => {
      dispatch(actions.handleManageBillingClick());
    },
    onClickAddBilling: () => {
      dispatch(actions.handleAddBillingClick());
    },
  }),
)(BillingUpdateCTABanner);

export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
