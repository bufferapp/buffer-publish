import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  profilePageRoute,
  preferencesPage,
  childTabRoute,
  plansPage,
  newBusinessTrialistsRoute,
  newConnection,
  generateProfilePageRoute,
  campaignsPage,
} from '@bufferapp/publish-routes';
import PagesWithSidebar from '@bufferapp/publish-app-pages/components/PagesWithSidebar';
import ProfilePage from '@bufferapp/profile-page';
import Preferences from '@bufferapp/publish-preferences';
import Plans from '@bufferapp/publish-plans';
import DefaultPage from '@bufferapp/default-page';
import OnboardingManager from '@bufferapp/publish-onboarding';

const AppPages = ({
  profiles,
  isOnBusinessTrial,
  needsToSetCurrentOrg,
  setCurrentOrganization,
  currentOrgId,
}) => {
  const hasProfiles = profiles && profiles.length > 0;
  // If org coming from route doesn't match the last org stored, select and store the new value
  if (needsToSetCurrentOrg) {
    setCurrentOrganization(currentOrgId);
  }
  const redirectToQueue = () => {
    const selectedProfileId =
      Array.isArray(profiles) && !!profiles.length && profiles[0].id;
    const newPath = generateProfilePageRoute({ profileId: selectedProfileId });
    return <Redirect to={newPath} />;
  };
  return (
    <Switch>
      <Route path={preferencesPage.route} component={Preferences} />
      <Route path={plansPage.route} component={Plans} />

      {!hasProfiles && (
        <Route path={newBusinessTrialistsRoute} component={OnboardingManager} />
      )}
      {!hasProfiles && isOnBusinessTrial && (
        <Redirect to={newBusinessTrialistsRoute} />
      )}

      {!hasProfiles && (
        <Route path={newConnection.route} component={DefaultPage} />
      )}
      {!hasProfiles && <Redirect to={newConnection.route} />}

      <Route path={campaignsPage.route} component={PagesWithSidebar} />
      <Route path={childTabRoute} component={ProfilePage} />
      <Route path={profilePageRoute} component={ProfilePage} />

      <Route>{redirectToQueue()}</Route>
    </Switch>
  );
};

AppPages.propTypes = {
  profiles: PropTypes.arrayOf(PropTypes.object),
  isOnBusinessTrial: PropTypes.bool,
  needsToSetCurrentOrg: PropTypes.bool,
  currentOrgId: PropTypes.string,
  setCurrentOrganization: PropTypes.func,
};

AppPages.defaultProps = {
  isOnBusinessTrial: false,
  profiles: [],
  needsToSetCurrentOrg: false,
  currentOrgId: null,
  setCurrentOrganization: () => {},
};

export default AppPages;
