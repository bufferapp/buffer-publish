import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { actions as modalsActions } from '@bufferapp/publish-modals';
import { profilePages } from '@bufferapp/publish-routes';
import { actions as profileSidebarActions } from '@bufferapp/publish-profile-sidebar/reducer';
import Plans from './components/Plans';

import { actions } from './reducer';

export default connect(
  state => ({
    currentPlan: state.organizations?.selected?.plan,
    currentPlanBase: state.organizations?.selected?.planBase,
    onProTrial:
      state.organizations.selected?.trial?.onTrial &&
      state.organizations.selected?.trial.plan === 'pro',
    profiles: state.profileSidebar.profiles,
    selectedProfileId: state.profileSidebar.selectedProfileId,
    translations: state.i18n.translations['plans-page'],
    isNonprofit: state.organizations.selected?.isNonProfit,
    selectedPremiumPlan: state.plans.selectedPremiumPlan,
    shouldSeeSoloPlanOption: state.organizations?.selected?.planBase === 'pro',
  }),
  dispatch => ({
    onPremiumPlanClick: ({ selectedPlan }) => {
      dispatch(actions.setSelectedPlan({ selectedPlan }));
    },
    onChoosePlanClick: ({ source, plan, soloPlanSelected }) => {
      if (plan === 'premium_business' && soloPlanSelected) {
        plan = 'solo_premium_business';
      }
      dispatch(modalsActions.showSwitchPlanModal({ source, plan }));
    },
    onBackToDashboardClick: ({ selectedProfileId, profiles }) => {
      if (profiles.length > 0) {
        const profileId = selectedProfileId || profiles[0].id;
        const profile = profiles.find(p => p.id === profileId);
        dispatch(
          profileSidebarActions.selectProfile({
            profile,
          })
        );
        dispatch(
          profilePages.goTo({
            profileId,
          })
        );
      } else {
        dispatch(push('/'));
      }
    },
  })
)(Plans);
