import React, { useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  campaignsPage,
  newBusinessTrialists,
  newConnection,
  plansPage,
  preferencesPage,
  profilePages,
  profileTabPages,
} from '@bufferapp/publish-routes';
import { filterProfilesByOrg } from '@bufferapp/publish-profile-sidebar/utils';
import PagesWithSidebar from '@bufferapp/publish-app-pages/components/PagesWithSidebar';
import ProfilePages from '@bufferapp/publish-app-pages/components/ProfilePages';
import Preferences from '@bufferapp/publish-preferences';
import Plans from '@bufferapp/publish-plans';
import DefaultPage from '@bufferapp/default-page';
import OnboardingManager from '@bufferapp/publish-onboarding';
import { useOrgSwitcher, useUser } from '@bufferapp/app-shell';
import MissingAccessPage from '../../../missing-access-page/index';

const AppPages = ({
  unfilteredProfiles,
  showBusinessTrialistsOnboarding,
  profileRouteLoaded,
  orgIdFromRoute,
}) => {
  // Get current selected org from appshell
  const user = useUser();
  const selectedOrgInAppShell = user?.currentOrganization?.id;

  const currentOrgId = orgIdFromRoute || selectedOrgInAppShell;
  const needsToSelectNewOrgInAppShell =
    selectedOrgInAppShell !== orgIdFromRoute && !!orgIdFromRoute;

  const canAccessPublishing =
    user?.currentOrganization?.billing?.canAccessPublishing;

  // Filters profiles by current org selected
  const profiles = filterProfilesByOrg(unfilteredProfiles, {
    id: currentOrgId,
  });

  const switchOrganization = useOrgSwitcher();

  // If org coming from route doesn't match the last org stored, select and store the new value
  useEffect(() => {
    if (needsToSelectNewOrgInAppShell) {
      switchOrganization(currentOrgId);
    }
  }, [currentOrgId]);

  const redirectToQueue = () => {
    const selectedProfileId =
      Array.isArray(profiles) && !!profiles.length && profiles[0].id;
    const newPath = profileTabPages.getRoute({
      profileId: selectedProfileId,
      tabId: 'queue',
    });
    return <Redirect to={newPath} />;
  };
  const hasProfiles = profiles && profiles.length > 0;

  if (!canAccessPublishing) {
    return <MissingAccessPage />;
  }

  return (
    <Switch>
      <Route path={preferencesPage.route} component={Preferences} />
      <Route path={plansPage.route} component={Plans} />

      {!hasProfiles && (
        <Route
          path={newBusinessTrialists.route}
          component={OnboardingManager}
        />
      )}
      {!hasProfiles && showBusinessTrialistsOnboarding && (
        <Redirect to={newBusinessTrialists.route} />
      )}

      {!hasProfiles && (
        <Route path={newConnection.route} component={DefaultPage} />
      )}
      {!hasProfiles && <Redirect to={newConnection.route} />}

      <Route path={campaignsPage.route} component={PagesWithSidebar} />
      <Route
        path={profilePages.route}
        render={props => (
          <ProfilePages
            profiles={profiles}
            profileRouteLoaded={profileRouteLoaded}
            {...props}
          />
        )}
      />

      <Route>{redirectToQueue()}</Route>
    </Switch>
  );
};

AppPages.propTypes = {
  unfilteredProfiles: PropTypes.arrayOf(PropTypes.object),
  showBusinessTrialistsOnboarding: PropTypes.bool,
  profileRouteLoaded: PropTypes.func.isRequired,
  needsToSetCurrentOrg: PropTypes.bool,
  orgIdFromRoute: PropTypes.string,
  switchOrganization: PropTypes.func,
};

AppPages.defaultProps = {
  showBusinessTrialistsOnboarding: false,
  unfilteredProfiles: [],
  needsToSetCurrentOrg: false,
  orgIdFromRoute: null,
  switchOrganization: () => {},
};

export default AppPages;
