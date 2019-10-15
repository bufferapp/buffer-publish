import { actions as appSwitcherActions } from '@bufferapp/publish-app-switcher';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { generatePreferencePageRoute, newBusinessTrialistsRoute } from '@bufferapp/publish-routes';
import { actions as modalActions } from '@bufferapp/publish-modals';
import { actions } from './reducer';

import AppShell from './components/AppShell';

export default connect(
  state => ({
    user: state.appShell.user,
    bannerOptions: state.appShell.bannerOptions,
    bannerKey: state.appShell.bannerKey,
    showReturnToClassic: state.appShell.showReturnToClassic,
    showSwitchPlan: state.appShell.showSwitchPlan,
    showManageTeam: state.appShell.showManageTeam,
    showStartProTrial: state.appShell.showStartProTrial,
    hideAppShell: (!state.appShell.sawOnboardingPage
      && state.router.location.pathname === newBusinessTrialistsRoute),
  }),

  dispatch => ({
    openPreferences() {
      dispatch(
        push(
          generatePreferencePageRoute({
            preferenceId: 'general',
          }),
        ),
      );
    },
    returnToClassic() {
      dispatch(
        appSwitcherActions.displayFeedbackModal({
          source: 'app_shell',
        }),
      );
    },
    switchPlan() {
      dispatch(modalActions.showSwitchPlanModal({ source: 'app_shell', plan: 'pro' }));
    },
    onCloseBanner({ key }) {
      dispatch(actions.onCloseBanner({ key }));
    },
  }),
)(AppShell);

export reducer from './reducer';
export middleware from './middleware';
